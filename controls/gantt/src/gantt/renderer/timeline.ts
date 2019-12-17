import { createElement, isNullOrUndefined, getValue, addClass, removeClass } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TimelineSettingsModel } from '../models/timeline-settings-model';
import * as cls from '../base/css-constants';
import { TimelineViewMode } from '../base/enum';
import { ITimeSpanEventArgs, ITimelineFormatter, IGanttData, ZoomEventArgs, ZoomTimelineSettings } from '../base/interface';
import { DataUtil } from '@syncfusion/ej2-data';
/**   
 * Configures the `Timeline` of the gantt.    
 */
export class Timeline {
    private parent: Gantt;
    public timelineStartDate: Date;
    public timelineEndDate: Date;
    private topTierCellWidth: number;
    public bottomTierCellWidth: number;
    public customTimelineSettings: TimelineSettingsModel;
    public chartTimelineContainer: HTMLElement;
    public topTier: string;
    public bottomTier: string;
    public isSingleTier: boolean;
    private previousIsSingleTier: boolean;
    public timelineRoundOffEndDate: Date;
    public totalTimelineWidth: number;
    public isZoomIn: boolean = false;
    public isZooming: boolean = false;
    public isZoomToFit: boolean = false;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.initProperties();
    }

    /**
     * To initialize the public property.
     * @return {void}
     * @private
     */
    private initProperties(): void {
        this.timelineStartDate = null;
        this.timelineEndDate = null;
        this.totalTimelineWidth = 0;
        this.customTimelineSettings = null;
        this.parent.isTimelineRoundOff = this.isZoomToFit ? false : isNullOrUndefined(this.parent.projectStartDate) ? true : false;
    }

    /**
     * To render timeline header series.
     * @return {void}
     * @private
     */
    public validateTimelineProp(): void {
        this.roundOffDays();
        this.processTimelineProperty();
        this.timelineWidthCalculation();
    }

    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    public refreshTimeline(): void {
        this.initProperties();
        this.processTimelineUnit();
        this.parent.dataOperation.calculateProjectDates();
        this.parent.updateProjectDates(
            this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
    }

    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    public refreshTimelineByTimeSpan(): void {
        this.validateTimelineProp();
        this.parent.ganttChartModule.chartTimelineContainer.innerHTML = '';
        this.createTimelineSeries();
    }

    /**
     * Function used to refresh Gantt rows.
     * @return {void}
     * @private
     */
    public updateChartByNewTimeline(): void {
        this.parent.chartRowsModule.refreshChartByTimeline();
        this.parent.notify('refreshDayMarkers', {});

    }
    /**
     * Function used to perform Zoomin and Zoomout actions in Gantt control.
     * @param isZoomIn 
     * @private
     * @return {void}
     */
    public processZooming(isZoomIn: boolean): void {
        this.isZoomToFit = false;
        if (!isNullOrUndefined(this.parent.zoomingProjectStartDate)) {
            this.parent.cloneProjectStartDate = this.parent.cloneProjectStartDate.getTime() < this.parent.zoomingProjectStartDate.getTime()
                ? this.parent.cloneProjectStartDate : this.parent.zoomingProjectStartDate;
            this.parent.cloneProjectEndDate = this.parent.cloneProjectEndDate.getTime() > this.parent.zoomingProjectEndDate.getTime()
                ? this.parent.cloneProjectEndDate : this.parent.zoomingProjectEndDate;
        }
        this.parent.zoomingProjectStartDate = null;
        this.parent.zoomingProjectEndDate = null;
        let currentLevel: number;
        let currentZoomingLevel: number = this.checkCurrentZoomingLevel();
        this.isZoomIn = isZoomIn;
        this.isZooming = true;
        currentLevel = isZoomIn ? currentZoomingLevel + 1 : currentZoomingLevel - 1;
        if (this.parent.toolbarModule) {
            if (isZoomIn) {
                if (currentLevel === this.parent.zoomingLevels[this.parent.zoomingLevels.length - 1].level) {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], false); // disable toolbar items.
                } else {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], true); // disable toolbar items.
                }
            } else {
                if (currentLevel === this.parent.zoomingLevels[0].level) {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], false); // disable toolbar items.
                } else {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], true); // enable toolbar items.
                }
            }
        }

        let newTimeline: ZoomTimelineSettings = this.parent.zoomingLevels[currentLevel];
        let args: ZoomEventArgs = {
            requestType: isZoomIn ? 'beforeZoomIn' : 'beforeZoomOut',
            timeline: newTimeline
        };
        this.parent.trigger('actionBegin', args);
        newTimeline = args.timeline;
        this.changeTimelineSettings(newTimeline);
    }

    /**
     * To change the timeline settings property values based upon the Zooming levels.
     * @return {void}
     * @private
     */
    private changeTimelineSettings(newTimeline: ZoomTimelineSettings): void {
        let skipProperty: string = this.isSingleTier ?
            this.customTimelineSettings.topTier.unit === 'None' ?
                'topTier' : 'bottomTier' : null;
        Object.keys(this.customTimelineSettings).forEach((property: string) => {
            if (property !== skipProperty) {
                this.customTimelineSettings[property] = (typeof newTimeline[property] === 'object'
                    && !isNullOrUndefined(newTimeline[property])) ? { ...newTimeline[property] } : newTimeline[property];
            } else {
                let value: string = property === 'topTier' ? 'bottomTier' : 'topTier';
                let assignValue: string = 'bottomTier';
                this.customTimelineSettings[value] = { ...newTimeline[assignValue] };
            }
        });
        this.parent.isTimelineRoundOff = this.isZoomToFit ? false : isNullOrUndefined(this.parent.projectStartDate) ? true : false;
        this.processTimelineUnit();
        this.parent.updateProjectDates(
            this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
        if (this.isZooming || this.isZoomToFit) {
            let args: ZoomEventArgs = {
                requestType: this.isZoomIn ? 'AfterZoomIn' : this.isZoomToFit ? 'AfterZoomToProject' : 'AfterZoomOut',
            };
            this.parent.trigger('actionComplete', args);
        }

    }
    /**
     * To perform the zoom to fit operation in Gantt.
     * @return {void}
     * @private
     */
    public processZoomToFit(): void {
        this.isZoomToFit = true;
        this.isZooming = false;
        if (!this.parent.zoomingProjectStartDate) {
            this.parent.zoomingProjectStartDate = this.parent.cloneProjectStartDate;
            this.parent.zoomingProjectEndDate = this.parent.cloneProjectEndDate;
        }
        this.parent.dataOperation.calculateProjectDates();
        let timeDifference: number = (this.parent.cloneProjectEndDate.getTime() - this.parent.cloneProjectStartDate.getTime());
        let totalDays: number = (timeDifference / (1000 * 3600 * 24));
        let chartWidth: number = this.parent.ganttChartModule.chartElement.offsetWidth;
        let perDayWidth: number = chartWidth / totalDays;
        let zoomingLevel: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        let secondValue: ZoomTimelineSettings;
        let zoomingCollections: ZoomTimelineSettings[] = [...this.parent.zoomingLevels];
        let sortedCollectons: ZoomTimelineSettings[] = zoomingCollections.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings) =>
           (a.perDayWidth < b.perDayWidth) ? 1 : -1);
        if (perDayWidth === 0) { // return when the Gantt chart is not in viewable state.
            return;
        }
        for (let i: number = 0; i < sortedCollectons.length; i++) {
            firstValue = sortedCollectons[i];
            if (i === sortedCollectons.length - 1) {
                zoomingLevel = sortedCollectons[i];
                break;
            } else {
                secondValue = sortedCollectons[i + 1];
            }
            if (perDayWidth >= firstValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i];
                break;
            }
            if (perDayWidth < firstValue.perDayWidth && perDayWidth > secondValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i + 1];
                break;
            }
        }
        let newTimeline: ZoomTimelineSettings = { ...zoomingLevel };
        this.roundOffDateToZoom(this.parent.cloneProjectStartDate, true, perDayWidth, newTimeline.bottomTier.unit);
        this.roundOffDateToZoom(this.parent.cloneProjectEndDate, false, perDayWidth, newTimeline.bottomTier.unit);
        let numberOfCells: number = this.calculateNumberOfTimelineCells(newTimeline);
        newTimeline.timelineUnitSize = Math.abs((chartWidth - 25)) / numberOfCells;
        this.changeTimelineSettings(newTimeline);
        let args: ZoomEventArgs = {
            requestType: 'beforeZoomToProject',
            timeline: newTimeline
        };
        this.parent.trigger('actionBegin', args);
    }

    private roundOffDateToZoom(date: Date, isStartDate: boolean, perDayWidth: number, tierMode: string): void {
        let width: number = tierMode === 'Month' || tierMode === 'Year' ? 60 : 20;
        let roundOffTime: number = (width / perDayWidth) * (24 * 60 * 60 * 1000);
        if (isStartDate) {
            date.setTime(date.getTime() - roundOffTime);
        } else {
            date.setTime(date.getTime() + roundOffTime);
        }
        if (tierMode === 'Hour') {
            date.setMinutes(isStartDate ? -120 : 120);
        } else if (tierMode === 'Minutes') {
            date.setSeconds(isStartDate ? -120 : 120);
        } else {
            date.setHours(isStartDate ? -48 : 48, 0, 0, 0);
        }
    };

    private calculateNumberOfTimelineCells(newTimeline: ZoomTimelineSettings): number {
        let numberOfDays: number = Math.abs((this.parent.cloneProjectEndDate.getTime() -
            this.parent.cloneProjectStartDate.getTime()) / (24 * 60 * 60 * 1000));
        let count: number = newTimeline.bottomTier.count;
        let unit: string = newTimeline.bottomTier.unit;
        if (unit === 'Day') {
            return numberOfDays / count;
        } else if (unit === 'Week') {
            return (numberOfDays / count) / 7;
        } else if (unit === 'Month') {
            return (numberOfDays / count) / 28;
        } else if (unit === 'Year') {
            return (numberOfDays / count) / (12 * 28);
        } else if (unit === 'Hour') {
            return numberOfDays * (24 / count);
        } else {
            return numberOfDays * ((60 * 24) / count);
        }
    }
    /**
     * To validate time line unit.
     * @return {void}
     * @private
     */
    public processTimelineUnit(): void {
        let directProperty: string[] = ['timelineViewMode', 'timelineUnitSize', 'weekStartDay', 'weekendBackground'];
        let innerProperty: Object = {
            'topTier': ['unit', 'format', 'count', 'formatter'],
            'bottomTier': ['unit', 'format', 'count', 'formatter']
        };
        let tierUnits: string[] = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minutes'];
        this.customTimelineSettings = this.customTimelineSettings ? this.customTimelineSettings :
         this.extendFunction(this.parent.timelineSettings, directProperty, innerProperty);
        if ((tierUnits.indexOf(this.customTimelineSettings.topTier.unit) === -1) &&
            (tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) === -1)) {
            this.customTimelineSettings.topTier.unit = tierUnits.indexOf(this.customTimelineSettings.timelineViewMode) !== -1 ?
                this.customTimelineSettings.timelineViewMode : 'Week';
            this.customTimelineSettings.bottomTier.unit = tierUnits.indexOf(this.customTimelineSettings.topTier.unit) !== 5 ?
                tierUnits[tierUnits.indexOf(this.customTimelineSettings.topTier.unit) + 1] as TimelineViewMode : 'None';
        } else if ((tierUnits.indexOf(this.customTimelineSettings.topTier.unit) !== -1 &&
            tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) !== -1)
            && (tierUnits.indexOf(this.customTimelineSettings.topTier.unit) >
                tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit))) {
            this.customTimelineSettings.bottomTier.unit = this.customTimelineSettings.topTier.unit;
        } else {
            this.customTimelineSettings.topTier.unit = tierUnits.indexOf(this.customTimelineSettings.topTier.unit) === -1 ?
                'None' : this.customTimelineSettings.topTier.unit;
            this.customTimelineSettings.bottomTier.unit = tierUnits.indexOf(this.customTimelineSettings.bottomTier.unit) === -1 ?
                'None' : this.customTimelineSettings.bottomTier.unit;
        }
        this.topTier = this.customTimelineSettings.topTier.unit;
        this.bottomTier = this.customTimelineSettings.bottomTier.unit;
        this.previousIsSingleTier = this.isSingleTier;
        this.isSingleTier = this.topTier === 'None' || this.bottomTier === 'None' ? true : false;
    }

    /**
     * To validate timeline properties.
     * @return {void}
     * @private
     */
    private processTimelineProperty(): void {

        this.customTimelineSettings.topTier.count = (this.topTier === 'None') ?
            1 : this.validateCount(this.customTimelineSettings.topTier.unit, this.customTimelineSettings.topTier.count, 'topTier');
        this.customTimelineSettings.bottomTier.count = this.customTimelineSettings.bottomTier.unit === 'None' ?
            1 : this.validateCount(this.customTimelineSettings.bottomTier.unit, this.customTimelineSettings.bottomTier.count, 'bottomTier');
        this.customTimelineSettings.bottomTier.format = this.validateFormat(
            this.customTimelineSettings.bottomTier.unit, this.customTimelineSettings.bottomTier.format);
        this.customTimelineSettings.topTier.format = this.validateFormat(this.topTier, this.customTimelineSettings.topTier.format);
        this.customTimelineSettings.weekStartDay = this.customTimelineSettings.weekStartDay >= 0 &&
            this.customTimelineSettings.weekStartDay <= 6 ? this.customTimelineSettings.weekStartDay : 0;
        this.checkCurrentZoomingLevel();
    }
    /**
     * To find the current zooming level of the Gantt control.
     * @return {void}
     * @private
     */
    public calculateZoomingLevelsPerDayWidth(): void {
        let collections: ZoomTimelineSettings[] = this.parent.zoomingLevels;
        for (let i: number = 0; i < collections.length; i++) {
            let perDayWidth: number =
                this.getPerDayWidth(
                    collections[i].timelineUnitSize,
                    collections[i].bottomTier.count,
                    collections[i].bottomTier.unit);
            collections[i].perDayWidth = perDayWidth;
        }
    }
    /**
     * To find the current zooming level of the Gantt control.
     * @return {void}
     * @private
     */
    private checkCurrentZoomingLevel(): number {
        let count: number = this.customTimelineSettings.bottomTier.unit !== 'None' ?
            this.customTimelineSettings.bottomTier.count : this.customTimelineSettings.topTier.count;
        let unit: string = this.customTimelineSettings.bottomTier.unit !== 'None' ?
            this.customTimelineSettings.bottomTier.unit : this.customTimelineSettings.topTier.unit;
        let zoomLevel: number = this.getCurrentZoomingLevel(unit, count);
        if (this.parent.toolbarModule) {
            if (zoomLevel === this.parent.zoomingLevels[this.parent.zoomingLevels.length - 1].level) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], false);
            } else if (zoomLevel === this.parent.zoomingLevels[0].level) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], false);
            }

        }
        this.parent.currentZoomingLevel = this.parent.zoomingLevels[zoomLevel];
        return zoomLevel;
    }
    /**
     * @private
     */
    private getCurrentZoomingLevel(unit: string, count: number): number {
        let level: number;
        let currentZoomCollection: ZoomTimelineSettings;
        let checkSameCountLevels: ZoomTimelineSettings[];
        let secondValue: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        if (!this.parent.zoomingLevels.length) {
            this.parent.zoomingLevels = this.parent.getZoomingLevels();
        }
        let sameUnitLevels: ZoomTimelineSettings[] = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
            return tempLevel.bottomTier.unit === unit;
        });
        if (sameUnitLevels.length === 0) {
            let closestUnit: string = this.getClosestUnit(unit, '', false);
            sameUnitLevels = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
                return tempLevel.bottomTier.unit === closestUnit;
            });
        }
        let sortedUnitLevels: ZoomTimelineSettings[] = sameUnitLevels.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings)  =>
         (a.bottomTier.count < b.bottomTier.count) ? 1 : -1);
        for (let i: number = 0; i < sortedUnitLevels.length; i++) {
            firstValue = sortedUnitLevels[i];
            if (i === sortedUnitLevels.length - 1) {
                level = sortedUnitLevels[i].level;
                break;
            } else {
                secondValue = sortedUnitLevels[i + 1];
            }

            if (count >= firstValue.bottomTier.count) {
                currentZoomCollection = sortedUnitLevels[i];
                checkSameCountLevels = sortedUnitLevels.filter((tempLevel: ZoomTimelineSettings) => {
                    return tempLevel.bottomTier.count === currentZoomCollection.bottomTier.count;
                });
                if (checkSameCountLevels.length > 1) {
                    level = this.checkCollectionsWidth(checkSameCountLevels);
                } else {
                    level = checkSameCountLevels[0].level;
                }
                break;
            } else if (count < firstValue.bottomTier.count && count > secondValue.bottomTier.count) {
                currentZoomCollection = sortedUnitLevels[i + 1];
                checkSameCountLevels = sortedUnitLevels.filter((tempLevel: ZoomTimelineSettings) => {
                    return tempLevel.bottomTier.count === currentZoomCollection.bottomTier.count;
                });
                if (checkSameCountLevels.length > 1) {
                    level = this.checkCollectionsWidth(checkSameCountLevels);
                } else {
                    level = checkSameCountLevels[0].level;
                }
                break;
            }
        }
        return level;
    }
    /**
     * Getting closest zooimg level.
     * @private
     */
    private getClosestUnit(unit: string, closetUnit: string, isCont: boolean): string {
        let bottomTierUnits: string[] = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minutes'];
        let index: number = bottomTierUnits.indexOf(unit);
        if (index === 0) {
            isCont = true;
        }
        if (this.isZoomIn || isCont) {
            unit = bottomTierUnits[index + 1];
        } else {
            unit = bottomTierUnits[index - 1];

        }
        let sameUnitLevels: ZoomTimelineSettings[] = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
            return tempLevel.bottomTier.unit === unit;
        });
        if (sameUnitLevels.length === 0) {
            if (unit === 'Year') {
                isCont = true;
            }
            closetUnit = unit;
            return this.getClosestUnit(unit, closetUnit, isCont);
        } else {
            return unit;
        }


    }
    private checkCollectionsWidth(checkSameLevels: ZoomTimelineSettings[]): number {
        let zoomLevels: ZoomTimelineSettings[] = checkSameLevels;
        let width: number = this.customTimelineSettings.timelineUnitSize;
        let level: number;
        let secondValue: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        let sortedZoomLevels: ZoomTimelineSettings[] = zoomLevels.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings) =>
           (a.timelineUnitSize < b.timelineUnitSize) ? 1 : -1);
        for (let i: number = 0; i < sortedZoomLevels.length; i++) {
            firstValue = sortedZoomLevels[i];
            if (i === sortedZoomLevels.length - 1) {
                level = sortedZoomLevels[i].level;
                break;
            } else {
                secondValue = sortedZoomLevels[i + 1];
            }
            if (width >= firstValue.timelineUnitSize) {
                level = sortedZoomLevels[i].level;
                break;
            } else if (width < firstValue.timelineUnitSize && width > secondValue.timelineUnitSize) {
                level = sortedZoomLevels[i + 1].level;
                break;
            }
        }
        return level;
    }
    /**
     * To create timeline header template.
     * @return {void}
     * @private
     */
    public updateTimelineHeaderHeight(): void {
        if (this.parent.timelineModule.isSingleTier) {
            addClass([this.parent.ganttChartModule.chartTimelineContainer as Element], cls.timelineSingleHeaderOuterDiv);
            if (this.parent.treeGrid.element) {
                addClass(this.parent.treeGrid.element.querySelectorAll('.e-headercell'), cls.timelineSingleHeaderOuterDiv);
                addClass(this.parent.treeGrid.element.querySelectorAll('.e-columnheader'), cls.timelineSingleHeaderOuterDiv);
            }
        } else {
            removeClass([this.parent.ganttChartModule.chartTimelineContainer as Element], cls.timelineSingleHeaderOuterDiv);
            if (this.parent.treeGrid.element) {
                removeClass(this.parent.treeGrid.element.querySelectorAll('.e-headercell'), cls.timelineSingleHeaderOuterDiv);
                removeClass(this.parent.treeGrid.element.querySelectorAll('.e-columnheader'), cls.timelineSingleHeaderOuterDiv);
            }
        }
        if (this.previousIsSingleTier !== this.isSingleTier) {
            let toolbarHeight: number = 0;
            if (!isNullOrUndefined(this.parent.toolbarModule) && !isNullOrUndefined(this.parent.toolbarModule.element)) {
                toolbarHeight = this.parent.toolbarModule.element.offsetHeight;
            }
            this.parent.ganttChartModule.scrollObject.
                setHeight(this.parent.ganttHeight - this.parent.ganttChartModule.chartTimelineContainer.offsetHeight - toolbarHeight);
            this.parent.treeGrid.height = this.parent.ganttHeight - toolbarHeight -
                this.parent.ganttChartModule.chartTimelineContainer.offsetHeight;
        }
    }

    /**
     * To create timeline header template.
     * @return {void}
     * @private
     */
    public createTimelineSeries(): void {
        let tr: Element;
        let td: Element;
        let div: Element;
        let table: HTMLElement;
        let thead: Element;
        let loopCount: number = this.isSingleTier ? 1 : 2;
        let tier: string = this.topTier === 'None' ? 'bottomTier' : 'topTier';
        this.updateTimelineHeaderHeight();
        for (let count: number = 0; count < loopCount; count++) {
            table = createElement(
                'table', { className: cls.timelineHeaderTableContainer, styles: 'display: block;' });
            thead = createElement('thead', { className: cls.timelineHeaderTableBody, styles: 'display:block; border-collapse:collapse' });
            tr = createElement('tr', { innerHTML: this.createTimelineTemplate(tier) });
            td = createElement('th');
            div = createElement('div', { styles: 'width: 20px' });
            td.appendChild(div);
            tr.appendChild(td);
            thead.appendChild(tr);
            table.appendChild(thead);
            this.parent.ganttChartModule.chartTimelineContainer.appendChild(table);
            tier = 'bottomTier';
            tr = null;


        }
    }

    /**
     * To validate timeline tier count.
     * @return {number}
     * @private
     */
    private validateCount(mode: string, count: number, tier: string): number {
        let tierCount: number = !isNullOrUndefined(count) && parseInt(count.toString(), 10) > 0 ? parseInt(count.toString(), 10) : 1;
        let timeDifference: number = Math.abs(this.timelineRoundOffEndDate.getTime() - this.timelineStartDate.getTime());
        let difference: number;
        switch (mode) {
            case 'Year':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / (12 * 28));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Month':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / 28);
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Week':
                difference = Math.round((timeDifference / (1000 * 3600 * 24)) / 7);
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Day':
                difference = Math.round(timeDifference / (1000 * 3600 * 24));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Hour':
                difference = Math.round(timeDifference / (1000 * 3600));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
            case 'Minutes':
                difference = Math.round(timeDifference / (1000 * 60));
                tierCount = tierCount <= difference ? tierCount : difference > 0 ? difference : 1;
                if (this.topTier !== 'None' && tier === 'bottomTier') {
                    tierCount = this.validateBottomTierCount(mode, tierCount);
                }
                break;
        }
        if (count !== tierCount && this.isZooming && this.parent.toolbarModule && (tier === 'bottomTier' || this.isSingleTier)) {
            if (this.isZoomIn) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], false);
            } else {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], false);
            }
        }
        return tierCount;
    }

    /**
     * To validate bottom tier count.
     * @return {number}
     * @private
     */
    private validateBottomTierCount(mode: string, tierCount: number): number {
        let count: number;
        switch (mode) {
            case 'Year':
                count = tierCount <= this.customTimelineSettings.topTier.count ?
                    tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Month':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * 12) ?
                    tierCount : (this.customTimelineSettings.topTier.count * 12) :
                    tierCount <= this.customTimelineSettings.topTier.count ?
                        tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Week':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 4)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 4)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * 4) ?
                        tierCount : (this.customTimelineSettings.topTier.count * 4) :
                        tierCount <= this.customTimelineSettings.topTier.count ?
                            tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Day':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * 28) ?
                        tierCount : (this.customTimelineSettings.topTier.count * 28) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7) :
                            tierCount <= this.customTimelineSettings.topTier.count ? tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Hour':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28 * 24)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28 * 24)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * (28 * 24)) ?
                        tierCount : (this.customTimelineSettings.topTier.count * (28 * 24)) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7 * 24) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7 * 24) :
                            this.topTier === 'Day' ? tierCount <= (this.customTimelineSettings.topTier.count * 24) ?
                                tierCount : (this.customTimelineSettings.topTier.count * 24) :
                                tierCount <= this.customTimelineSettings.topTier.count ?
                                    tierCount : this.customTimelineSettings.topTier.count;
                break;
            case 'Minutes':
                count = this.topTier === 'Year' ? tierCount <= (this.customTimelineSettings.topTier.count * (12 * 28 * 24 * 60)) ?
                    tierCount : (this.customTimelineSettings.topTier.count * (12 * 28 * 24 * 60)) :
                    this.topTier === 'Month' ? tierCount <= (this.customTimelineSettings.topTier.count * (28 * 24 * 60)) ?
                        tierCount : (this.customTimelineSettings.topTier.count * (28 * 24 * 60)) :
                        this.topTier === 'Week' ? tierCount <= (this.customTimelineSettings.topTier.count * 7 * 24 * 60) ?
                            tierCount : (this.customTimelineSettings.topTier.count * 7 * 24 * 60) :
                            this.topTier === 'Day' ? tierCount <= (this.customTimelineSettings.topTier.count * 24 * 60) ?
                                tierCount : (this.customTimelineSettings.topTier.count * 24 * 60) :
                                this.topTier === 'Hour' ? tierCount <= (this.customTimelineSettings.topTier.count * 60) ?
                                    tierCount : (this.customTimelineSettings.topTier.count * 60) :
                                    tierCount <= this.customTimelineSettings.topTier.count ?
                                        tierCount : this.customTimelineSettings.topTier.count;
                break;
        }
        return count;
    }

    /**
     * To validate timeline tier format.
     * @return {string}
     * @private
     */
    private validateFormat(mode: string, format: string): string {
        let tierFormat: string;
        switch (mode) {
            case 'Week':
                tierFormat = !format ? 'MMM dd, yyyy' : format;
                break;
            case 'Day':
            case 'None':
                tierFormat = !format ? '' : format;
                break;
            case 'Hour':
                tierFormat = !format ? 'H' : format;
                break;
            case 'Month':
                tierFormat = !format ? 'MMM yyyy' : format;
                break;
            case 'Year':
                tierFormat = !format ? 'yyyy' : format;
                break;
            case 'Minutes':
                tierFormat = !format ? 'm' : format;
                break;
        }
        return tierFormat;
    }

    /**
     * To perform extend operation.
     * @return {object}
     * @private
     */
    public extendFunction(cloneObj: Object, propertyCollection: string[], innerProperty?: Object): Object {
        let tempObj: Object = {};
        for (let index: number = 0; index < propertyCollection.length; index++) {
            tempObj[propertyCollection[index]] = cloneObj[propertyCollection[index]];
        }
        if (innerProperty) {
            Object.keys(innerProperty).forEach((key: string) => {
                tempObj[key] = this.extendFunction(cloneObj[key], innerProperty[key], null);
            });
        }
        return tempObj;
    }

    /**
     * To format date.
     * @return {string}
     * @private
     */
    private formatDateHeader(dayFormat: string, data: Date): string {
        let date: Date = new Date(data.getTime());
        let dateString: string;
        switch (dayFormat) {
            case '':
                dateString = this.parent.globalize.formatDate(date, { format: 'E' });
                dateString = dateString.slice(0, 1);
                break;
            default:
                dateString = this.parent.globalize.formatDate(date, { format: dayFormat });
        }
        return dateString;
    }

    /**
     * Custom Formatting.
     * @return {string}
     * @private
     */
    private customFormat(date: Date, format: string, tier: string, mode: string, formatter: string | ITimelineFormatter): string {
        formatter = (typeof formatter === 'string' ? getValue(<string>formatter, window) as ITimelineFormatter : formatter);
        return formatter(date, format, tier, mode);
    }

    /**
     * To create timeline template .
     * @return {string}
     * @private
     */
    private createTimelineTemplate(tier: string): string {
        let parent: Gantt = this.parent;
        let parentTh: string = '';
        let parentTr: string = '';
        let mode: string = tier === 'topTier' ?
            parent.timelineModule.customTimelineSettings.topTier.unit : parent.timelineModule.customTimelineSettings.bottomTier.unit;
        let count: number = tier === 'topTier' ? parent.timelineModule.customTimelineSettings.topTier.count :
            parent.timelineModule.customTimelineSettings.bottomTier.count;
        let increment: number;
        let newTime: number;
        let startDate: Date = new Date(this.parent.timelineModule.timelineStartDate.toString());
        let endDate: Date = new Date(this.timelineRoundOffEndDate.toString());
        let scheduleDateCollection: Date[] = [];
        do {
            parentTr = this.getHeaterTemplateString(new Date(startDate.toString()), mode, tier, false, count);
            scheduleDateCollection.push(new Date(startDate.toString()));
            increment = this.getIncrement(startDate, count, mode);
            newTime = startDate.getTime() + increment;
            startDate.setTime(newTime);
            if (startDate >= endDate) {
                parentTr = this.getHeaterTemplateString(scheduleDateCollection[scheduleDateCollection.length - 1], mode, tier, true, count);
            }
            parentTh = parentTh + parentTr;
            parentTr = '';
        } while (!(startDate >= endDate));
        return parentTh;
    }

    private getTimelineRoundOffEndDate(date: Date): Date {
        let tierMode: string = this.topTier === 'None' ? this.bottomTier : this.topTier;
        let endDate: Date = new Date(date.toString());
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Hour') {
                endDate.setMinutes(60);
            } else if (tierMode === 'Minutes') {
                endDate.setSeconds(60);
            } else {
                endDate.setHours(24, 0, 0, 0);
            }
        }
        return endDate;
    }
    /**
     * 
     * @param startDate 
     * @param count 
     * @param mode 
     * @private
     */
    public getIncrement(startDate: Date, count: number, mode: String): number {
        let firstDay: Date = new Date(startDate.getTime());
        let lastDay: Date = new Date(startDate.getTime());
        let increment: number;
        switch (mode) {
            case 'Year':
                firstDay = startDate;
                lastDay = new Date(startDate.getFullYear() + (count - 1), 11, 31);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * 24);
                break;
            case 'Month':
                firstDay = startDate;
                lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + count, 1);
                increment = ((lastDay.getTime() - firstDay.getTime()));
                break;
            case 'Week':
                let dayIndex: number = this.parent.timelineModule.customTimelineSettings.weekStartDay;
                let dayIntervel: number = startDate.getDay() < dayIndex ? (dayIndex - startDate.getDay()) :
                    (6 - startDate.getDay()) + dayIndex;
                count = dayIntervel > 0 ? count - 1 : 0;
                lastDay.setHours(24, 0, 0, 0);
                dayIntervel = startDate.getDay() < dayIndex ? dayIntervel > 0 ?
                    dayIntervel - 1 : dayIntervel : dayIntervel;
                lastDay.setDate(lastDay.getDate() + (dayIntervel + (7 * count)));
                increment = ((lastDay.getTime() - firstDay.getTime()));
                break;
            case 'Day':
                lastDay.setHours(24, 0, 0, 0);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * 24 * (count - 1));
                break;
            case 'Hour':
                lastDay.setMinutes(60);
                lastDay.setSeconds(0);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * 60 * (count - 1));
                break;
            case 'Minutes':
                lastDay.setSeconds(60);
                increment = ((lastDay.getTime() - firstDay.getTime())) + (1000 * 60 * (count - 1));
                break;
        }
        return increment;
    }

    /**
     * Method to find header cell was weekend or not
     * @param mode 
     * @param tier 
     * @param day 
     */
    private isWeekendHeaderCell(mode: string, tier: string, day: Date): boolean {
        return mode === 'Day' && this.customTimelineSettings[tier].count === 1 &&
            this.parent.nonWorkingDayIndex.indexOf(day.getDay()) !== -1;
    }

    /**
     * To construct template string.
     * @return {string}
     * @private
     */
    private getHeaterTemplateString(scheduleWeeks: Date, mode: string, tier: string, isLast: boolean, count?: number): string {
        let parentTr: string = '';
        let td: string = '';
        let format: string = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.format :
            this.parent.timelineModule.customTimelineSettings.bottomTier.format;
        let formatter: string | ITimelineFormatter = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.formatter :
            this.parent.timelineModule.customTimelineSettings.bottomTier.formatter;
        let thWidth: number;
        let cellWidth: number;
        let isWeekendCell: boolean;
        let date: string = isNullOrUndefined(formatter) ?
            this.parent.globalize.formatDate(scheduleWeeks, { format: this.parent.dateFormat }) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter);
        thWidth = (this.getIncrement(scheduleWeeks, count, mode) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth;
        cellWidth = thWidth;
        thWidth = isLast ? this.calculateWidthBetweenTwoDate(
            mode, scheduleWeeks, this.timelineRoundOffEndDate)
            : thWidth;
        isWeekendCell = this.isWeekendHeaderCell(mode, tier, scheduleWeeks);
        let textClassName: string = tier === 'topTier' ? ' e-gantt-top-cell-text' : '';

        td += this.parent.timelineModule.isSingleTier ?
            '<th class="' + cls.timelineSingleHeaderCell + ' ' : '<th class="' + cls.timelineTopHeaderCell;
        td += isWeekendCell ? ' ' + cls.weekendHeaderCell : '';
        td += '" tabindex="-1" aria-label= "' + this.parent.localeObj.getConstant('timelineCell') + ' ' + date;
        td += '" style="width:' + thWidth + 'px;';
        td += isWeekendCell && this.customTimelineSettings.weekendBackground ?
            'background-color:' + this.customTimelineSettings.weekendBackground + ';' : '';
        td += '"><div class="' + cls.timelineHeaderCellLabel + textClassName + '" style="width:' +
            (thWidth - 1) + 'px;' + (this.parent.timelineSettings.showTooltip ? '"title="' + date : '');
        td += '">' + (isNullOrUndefined(formatter) ? this.formatDateHeader(format, scheduleWeeks) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter)) + '</div>';
        parentTr += td;
        parentTr += '</th>';
        td = '';
        if ((this.isSingleTier || tier === 'topTier') && !isLast) {
            this.totalTimelineWidth = this.totalTimelineWidth + thWidth;
        } else if ((this.isSingleTier || tier === 'topTier') && isLast) {
            this.totalTimelineWidth = (this.totalTimelineWidth - cellWidth) + thWidth;
        }
        return parentTr;
    }

    /**
     * To calculate last 'th' width.
     * @return {number}
     * @private
     */
    private calculateWidthBetweenTwoDate(mode: string, scheduleWeeks: Date, endDate: Date): number {
        let balanceDay: number = ((endDate.getTime() - scheduleWeeks.getTime()) / (1000 * 60 * 60 * 24));
        return balanceDay * this.parent.perDayWidth;
    }

    /**
     * To calculate timeline width.
     * @return {void}
     * @private
     */
    private timelineWidthCalculation(): void {
        let timelineUnitSize: number = this.customTimelineSettings.timelineUnitSize;
        let bottomTierCount: number = this.customTimelineSettings.bottomTier.count;
        let topTierCount: number = this.customTimelineSettings.topTier.count;
        this.bottomTierCellWidth = timelineUnitSize;
        switch (this.bottomTier) {
            case 'None':
                this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, topTierCount, this.topTier);
                break;
            default:
                this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, bottomTierCount, this.bottomTier);
                break;
        }
        this.topTierCellWidth = this.bottomTier !== 'None' ? this.topTier === 'Week' ?
            this.parent.perDayWidth * 7 : this.topTier === 'Hour' ?
                this.parent.perDayWidth / 24 : this.topTier === 'Minutes' ?
                    this.parent.perDayWidth / (24 * 60) : this.parent.perDayWidth : timelineUnitSize;
        this.topTierCellWidth = this.isSingleTier ? this.topTierCellWidth : this.topTierCellWidth * topTierCount;
    }

    /**
     * To validate per day width.
     * @return {number}
     * @private
     */
    private getPerDayWidth(timelineUnitSize: number, bottomTierCount: number, mode: string): number {
        let perDayWidth: number;
        switch (mode) {
            case 'Year':
                perDayWidth = (timelineUnitSize / bottomTierCount) / (12 * 28);
                break;
            case 'Month':
                perDayWidth = (timelineUnitSize / bottomTierCount) / 28;
                break;
            case 'Week':
                perDayWidth = (timelineUnitSize / bottomTierCount) / 7;
                break;
            case 'Day':
                perDayWidth = timelineUnitSize / bottomTierCount;
                break;
            case 'Hour':
                perDayWidth = (24 / bottomTierCount) * timelineUnitSize;
                break;
            case 'Minutes':
                perDayWidth = ((60 * 24) / bottomTierCount) * timelineUnitSize;
                break;
        }
        return perDayWidth;
    }

    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    private roundOffDays(): void {
        let startDate: Date = this.parent.cloneProjectStartDate;
        let endDate: Date = this.parent.cloneProjectEndDate;
        let tierMode: string = this.topTier === 'None' ? this.bottomTier : this.topTier;
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Year') {
                startDate = new Date(startDate.getFullYear(), 0, 1);
                endDate = new Date(endDate.getFullYear(), 11, 31);
            } else if (tierMode === 'Month') {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            } else if (tierMode === 'Week') {
                let dayIndex: number = this.parent.timelineModule.customTimelineSettings.weekStartDay;
                let roundOffStartDate: number = startDate.getDay() < dayIndex ?
                    (startDate.getDate()) - (7 - dayIndex + startDate.getDay()) :
                    (startDate.getDate()) - startDate.getDay() + dayIndex;
                startDate.setDate(roundOffStartDate);
                let first: number = endDate.getDate() - endDate.getDay();
                let last: number = first + 6 + dayIndex;
                endDate.setDate(last);
            }
            if (tierMode === 'Hour') {
                startDate.setMinutes(0);
            } else if (tierMode === 'Minutes') {
                startDate.setSeconds(0);
            } else {
                startDate.setHours(0, 0, 0, 0);
            }
        }
        this.timelineStartDate = startDate;
        this.timelineEndDate = endDate;
        this.timelineRoundOffEndDate = this.getTimelineRoundOffEndDate(this.timelineEndDate);

    }

    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    public updateScheduleDatesByToolBar(mode: string, span: string, startDate: Date, endDate: Date): void {
        if (mode === 'Year') {
            if (span === 'prevTimeSpan') {
                if (startDate.getMonth() === 0) {
                    startDate = new Date(startDate.getFullYear() - 1, 0, 1);
                } else {
                    startDate = new Date(startDate.getFullYear(), 0, 1);
                }
            } else {
                if (endDate.getMonth() === 11) {
                    endDate = new Date(endDate.getFullYear() + 1, 0, 1);
                } else {
                    endDate = new Date(endDate.getFullYear(), 12, 1);
                }
            }
        }
        if (mode === 'Month') {
            if (span === 'prevTimeSpan') {
                if (startDate.getDate() === 1) {
                    startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
                } else {
                    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                }
            } else {
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1);
            }
        }
        if (mode === 'Week') {
            let dayIndex: number = this.parent.timelineModule.customTimelineSettings.weekStartDay;
            let dayIntervel: number;
            if (span === 'prevTimeSpan') {
                dayIntervel = startDate.getDay() < dayIndex ? 7 - (dayIndex - startDate.getDay()) :
                    startDate.getDay() - dayIndex;
                startDate.setHours(0, 0, 0, 0);
                if (dayIntervel === 0) {
                    startDate.setDate(startDate.getDate() - 7);
                } else {
                    startDate.setDate(startDate.getDate() - dayIntervel);
                }
            } else {
                dayIntervel = endDate.getDay() < dayIndex ? (dayIndex - endDate.getDay()) :
                    (7 - endDate.getDay()) + dayIndex;
                endDate.setHours(0, 0, 0, 0);
                if (dayIntervel === 0) {
                    endDate.setDate(endDate.getDate() + 6);
                } else {
                    endDate.setDate(endDate.getDate() + dayIntervel);
                }
            }
        }
        if (mode === 'Day') {
            if (span === 'prevTimeSpan') {
                if (startDate.getHours() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60 * 60 * 24));
                } else {
                    startDate.setHours(0);
                }
            } else {
                if (endDate.getHours() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60 * 60 * 24));
                } else {
                    endDate.setHours(24);
                }
            }
        }
        if (mode === 'Hour') {
            if (span === 'prevTimeSpan') {
                if (startDate.getMinutes() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60 * 60));
                } else {
                    startDate.setMinutes(0);
                }
            } else {
                if (endDate.getMinutes() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60 * 60));
                } else {
                    endDate.setMinutes(60);
                }
            }
        }
        if (mode === 'Minutes') {
            if (span === 'prevTimeSpan') {
                if (startDate.getSeconds() === 0) {
                    startDate.setTime(startDate.getTime() - (1000 * 60));
                } else {
                    startDate.setSeconds(0);
                }
            } else {
                if (endDate.getSeconds() === 0) {
                    endDate.setTime(endDate.getTime() + (1000 * 60));
                } else {
                    endDate.setSeconds(60);
                }
            }
        }
        this.parent.cloneProjectStartDate = startDate;
        this.parent.cloneProjectEndDate = endDate;
    }
    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    public updateTimeLineOnEditing(tempArray: IGanttData[], action: string): void {
        let filteredStartDateRecord: IGanttData[] = tempArray.filter(
            (pdc: IGanttData) => { return !isNullOrUndefined(pdc.ganttProperties.startDate); });
        let filteredEndDateRecord: IGanttData[] = tempArray.filter(
            (pdc: IGanttData) => { return !isNullOrUndefined(pdc.ganttProperties.endDate); });
        let minStartDate: Date = filteredStartDateRecord.length > 0 ?
            new Date(DataUtil.aggregates.min(filteredStartDateRecord, 'ganttProperties.startDate')) : null;
        let maxEndDate: Date = filteredEndDateRecord.length > 0 ?
            new Date(DataUtil.aggregates.max(filteredEndDateRecord, 'ganttProperties.endDate')) : null;
        let validStartDate: Date = new Date(this.parent.dataOperation.checkStartDate(this.timelineStartDate).getTime());
        let validEndDate: Date = new Date(this.parent.dataOperation.checkEndDate(this.timelineEndDate).getTime());
        let maxStartLeft: number = isNullOrUndefined(minStartDate) ?
            null : this.parent.dataOperation.getTaskLeft(minStartDate, false);
        let maxEndLeft: number = isNullOrUndefined(maxEndDate) ?
            null : this.parent.dataOperation.getTaskLeft(maxEndDate, false);
        let validStartLeft: number = this.parent.dataOperation.getTaskLeft(validStartDate, false);
        let validEndLeft: number = this.parent.dataOperation.getTaskLeft(validEndDate, false);
        let isChanged: string;
        if (!isNullOrUndefined(maxStartLeft) && (maxStartLeft <= this.bottomTierCellWidth || maxStartLeft <= validStartLeft)) {
            isChanged = 'prevTimeSpan';
            minStartDate = minStartDate > this.timelineStartDate ? this.timelineStartDate : minStartDate;
        } else {
            minStartDate = this.timelineStartDate;
        }
        if (!isNullOrUndefined(maxEndLeft) && (maxEndLeft >= (this.totalTimelineWidth - this.bottomTierCellWidth) ||
            maxEndLeft >= validEndLeft)) {
            isChanged = isChanged === 'prevTimeSpan' ? 'both' : 'nextTimeSpan';
            maxEndDate = maxEndDate < this.timelineEndDate ? this.timelineEndDate : maxEndDate;
        } else {
            maxEndDate = this.timelineEndDate;
        }
        if (isChanged) {
            this.performTimeSpanAction(isChanged, action, minStartDate, maxEndDate);
        }
    }
    /**
     * To validate project start date and end date on editing action
     * @return {void}
     * @private
     */
    public performTimeSpanAction(type: string, isFrom: string, startDate: Date, endDate: Date, mode?: string): void {
        mode = !isNullOrUndefined(mode) ? mode : this.parent.timelineModule.topTier === 'None' ?
            this.parent.timelineModule.bottomTier : this.parent.timelineModule.topTier;
        let projectStartDate: Date = new Date(this.parent.cloneProjectStartDate.getTime());
        let projectEndDate: Date = new Date(this.parent.cloneProjectEndDate.getTime());
        if (isFrom !== 'publicMethod' && type === 'both') {
            this.updateScheduleDatesByToolBar(
                mode, 'prevTimeSpan', startDate, endDate);
            this.updateScheduleDatesByToolBar(
                mode, 'nextTimeSpan', new Date(this.parent.cloneProjectStartDate.getTime()), endDate);
        } else {
            this.updateScheduleDatesByToolBar(
                mode, type, startDate, endDate);
        }
        let args: ITimeSpanEventArgs = this.timeSpanActionEvent('actionBegin', type, isFrom);
        if (!args.cancel) {
            this.parent.updateProjectDates(args.projectStartDate, args.ProjectEndDate, args.isTimelineRoundOff, isFrom);
            if (type === 'prevTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(0);
            } else if (type === 'nextTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(this.parent.timelineModule.totalTimelineWidth);
            }

            this.parent.timelineModule.timeSpanActionEvent('actionComplete', type, isFrom);
        } else {
            this.parent.cloneProjectStartDate = projectStartDate;
            this.parent.cloneProjectEndDate = projectEndDate;
        }
    }

    /**
     * To validate project start date and end date.
     * @return {void}
     * @private
     */
    public timeSpanActionEvent(eventType: string, requestType?: string, isFrom?: string): ITimeSpanEventArgs {
        let args: ITimeSpanEventArgs = {} as ITimeSpanEventArgs;
        args.projectStartDate = new Date(this.parent.cloneProjectStartDate.getTime());
        args.ProjectEndDate = new Date(this.parent.cloneProjectEndDate.getTime());
        args.requestType = isFrom === 'publicMethod' ? requestType : isFrom === 'beforeAdd' ?
            'TimelineRefreshOnAdd' : isFrom === 'TaskbarEditing' ? 'TimelineRefreshOnEdit' : requestType;
        if (eventType === 'actionBegin') {
            args.isTimelineRoundOff = this.parent.isTimelineRoundOff;
            args.cancel = false;
        }
        args.action = 'TimescaleUpdate';
        this.parent.trigger(eventType, args);
        return args;
    }
}
