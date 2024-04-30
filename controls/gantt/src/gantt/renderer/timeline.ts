import { TimelineFormat, ITaskData } from './../base/interface';
import { createElement, isNullOrUndefined, getValue, addClass, removeClass, extend } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';
import { TimelineSettingsModel } from '../models/timeline-settings-model';
import * as cls from '../base/css-constants';
import { CriticalPath } from '../actions/critical-path';
import { TimelineViewMode } from '../base/enum';
import { ITimeSpanEventArgs, ITimelineFormatter, IGanttData, ZoomEventArgs, ZoomTimelineSettings } from '../base/interface';
import { DataUtil } from '@syncfusion/ej2-data';
import { TaskbarEdit } from '../actions/taskbar-edit';
/**
 * Configures the `Timeline` of the gantt.
 */
export class Timeline {
    private parent: Gantt;
    public timelineStartDate: Date;
    public timelineEndDate: Date;
    public topTierCellWidth: number;
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
    public topTierCollection: TimelineFormat[] = [];
    public bottomTierCollection: TimelineFormat[] = [];
    public pdfExportTopTierCollection: TimelineFormat[] = [];
    public pdfExportBottomTierCollection: TimelineFormat[] = [];
    public wholeTimelineWidth: number;
    public restrictRender: boolean = true;
    public weekendEndDate: Date;
    private performedTimeSpanAction: boolean = false;
    public isZoomedToFit: boolean = false;
    constructor(ganttObj?: Gantt) {
        this.parent = ganttObj;
        this.initProperties();
    }

    /**
     * To initialize the public property.
     *
     * @returns {void}
     * @private
     */
    private initProperties(): void {
        this.timelineStartDate = null;
        this.timelineEndDate = null;
        this.totalTimelineWidth = 0;
        this.customTimelineSettings = null;
        this.parent.isTimelineRoundOff = this.isZoomToFit ? false : isNullOrUndefined(this.parent.projectStartDate) ? true : false;
        if (this.parent.enablePersistence && this.parent.isLoad) {
            this.parent.timelineSettings = this.parent.currentZoomingLevel;
          }
    }

    /**
     * To render timeline header series.
     *
     * @returns {void}
     * @private
     */
    public validateTimelineProp(): void {
        this.roundOffDays();
        this.processTimelineProperty();
        this.timelineWidthCalculation();
    }

    /**
     * Function used to refresh Gantt rows.
     *
     * @returns {void}
     * @private
     */
    public refreshTimeline(): void {
        this.initProperties();
        this.processTimelineUnit();
        this.parent.dataOperation.calculateProjectDates();
        if (!this.parent.isFromOnPropertyChange) {
            this.parent.updateProjectDates(
                this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
        }
        const timelineContainer: number = this.parent.element.getElementsByClassName('e-timeline-header-container')[0]['offsetHeight'];
        this.parent.element.getElementsByClassName('e-gridcontent')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
        // eslint-disable-next-line
        this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
    }

    /**
     * Function used to refresh Gantt rows.
     *
     * @returns {void}
     * @private
     */
    public refreshTimelineByTimeSpan(): void {
        this.validateTimelineProp();
        if (!this.parent.pdfExportModule || (this.parent.pdfExportModule && !this.parent.pdfExportModule.isPdfExport) || (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps && !this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth)) {
            this.parent.ganttChartModule.chartTimelineContainer.innerHTML = '';
        }
        this.createTimelineSeries();
    }

    /**
     * Function used to refresh Gantt rows.
     *
     * @returns {void}
     * @private
     */
    public updateChartByNewTimeline(): void {
        this.parent.chartRowsModule.refreshChartByTimeline();
        let currentScrollLeft = this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0].scrollLeft;
        this.parent.element.getElementsByClassName('e-timeline-header-container')[0].scrollLeft = currentScrollLeft;
        this.parent.notify('refreshDayMarkers', {});

    }
    /**
     * Function used to perform Zoomin and Zoomout actions in Gantt control.
     *
     * @param {boolean} isZoomIn .
     * @private
     * @returns {void}
     */
    public processZooming(isZoomIn: boolean): void {
        this.isZoomToFit = false;
        this.isZoomedToFit = false;
        const action: string = isZoomIn ? "ZoomIn" : 'ZoomOut';
        if (this.parent.undoRedoModule && this.parent['isUndoRedoItemPresent'](action)) {
            if (this.parent.undoRedoModule['redoEnabled']) {
                this.parent.undoRedoModule['disableRedo']();
            }
            this.parent.undoRedoModule['createUndoCollection']();
            let previousTimeline: Object = {};
            previousTimeline['action'] = action;
            previousTimeline['previousZoomingLevel'] = extend({}, {}, this.parent.currentZoomingLevel, true);
            (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = previousTimeline;
        }
        if(!this.parent['isProjectDateUpdated']){
            this.parent.dateValidationModule.calculateProjectDates();
        }
        if (!isNullOrUndefined(this.parent.zoomingProjectStartDate)) {
            this.parent.cloneProjectStartDate = this.parent.zoomingProjectStartDate;
            this.parent.cloneProjectEndDate = this.parent.zoomingProjectEndDate;
        }
        this.parent.zoomingProjectStartDate = null;
        this.parent.zoomingProjectEndDate = null;
        const currentZoomingLevel: number = this.checkCurrentZoomingLevel();
        this.isZoomIn = isZoomIn;
        this.isZooming = true;
        let currentLevel: number;
        let level: number = isZoomIn ? currentZoomingLevel + 1 : currentZoomingLevel - 1;
        const foundLevel = this.parent.zoomingLevels.find(tempLevel => tempLevel.level === level);
        if (foundLevel) {
            currentLevel = level;
        } else {
            currentLevel = currentZoomingLevel;
        } 
        if (this.parent.toolbarModule) {
            if (isZoomIn) {
                if (currentLevel === this.parent.zoomingLevels[this.parent.zoomingLevels.length - 1].level) {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], false); // disable toolbar items.
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], true)
                } else {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], true); // disable toolbar items.
                }
            } else {
                if (currentLevel === this.parent.zoomingLevels[0].level) {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], false); // disable toolbar items.
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], true);
                } else {
                    this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], true); // enable toolbar items.
                }
            }
        }
        currentLevel = this.parent.zoomingLevels.findIndex((tempLevel: ZoomTimelineSettings) => {
            return tempLevel.level === currentLevel;
        });
        let newTimeline: ZoomTimelineSettings = this.parent.zoomingLevels[currentLevel as number];
        const args: ZoomEventArgs = {
            requestType: isZoomIn ? 'beforeZoomIn' : 'beforeZoomOut',
            timeline: newTimeline,
            cancel: false
        };
        this.parent.trigger('actionBegin', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
            this.parent.showMaskRow();
        } else {
            this.parent.showSpinner();
        }
        if (!args.cancel) {
            newTimeline = args.timeline;
            this.changeTimelineSettings(newTimeline);
        }
    }

    /**
     * To change the timeline settings property values based upon the Zooming levels.
     *
     * @param {ZoomTimelineSettings} newTimeline .
     * @returns {void}
     * @private
     */
    private changeTimelineSettings(newTimeline: ZoomTimelineSettings): void {
        if (this.isZoomToFit) {
            this.isSingleTier = this.customTimelineSettings.topTier.unit === 'None' || this.customTimelineSettings.bottomTier.unit === 'None' ? true : false;
        }
        else if (!this.isZoomIn) {
             this.isSingleTier = newTimeline.topTier.unit === 'None' || newTimeline.bottomTier.unit === 'None' ? true : false;
        }
        const skipProperty: string = this.isSingleTier ?
            this.customTimelineSettings.topTier.unit === 'None' ?
                'topTier' : 'bottomTier' : null;
        Object.keys(this.customTimelineSettings).forEach((property: string) => {
            if (property !== skipProperty) {
                this.customTimelineSettings[property as string] = (typeof newTimeline[property as string] === 'object'
                    && !isNullOrUndefined(newTimeline[property as string])) ? { ...newTimeline[property as string] } : newTimeline[property as string];
            } else {
                const value: string = property === 'topTier' ? 'bottomTier' : 'topTier';
                const assignValue: string = 'bottomTier';
                if ( newTimeline[`${assignValue}`].unit != "None") {
                    this.customTimelineSettings[value as string] = { ...newTimeline[assignValue as string] };
                }
            }
        });
        this.parent.isTimelineRoundOff = this.isZoomToFit ? false : isNullOrUndefined(this.parent.projectStartDate) ? true : false;
        this.processTimelineUnit();
        this.parent.updateProjectDates(
            this.parent.cloneProjectStartDate, this.parent.cloneProjectEndDate, this.parent.isTimelineRoundOff);
        const criticalModule: CriticalPath  = this.parent.criticalPathModule;
        if (this.parent.enableCriticalPath && criticalModule) {
            criticalModule.criticalConnectorLine(criticalModule.criticalPathCollection, criticalModule.detailPredecessorCollection, true, criticalModule.predecessorCollectionTaskIds);
         }
        if (this.isZooming || this.isZoomToFit) {
            const args: ZoomEventArgs = {
                requestType: this.isZoomIn ? 'AfterZoomIn' : this.isZoomToFit ? 'AfterZoomToProject' : 'AfterZoomOut',
                timeline: this.parent.currentZoomingLevel
            };
            this.parent.trigger('actionComplete', args);
            if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
                this.parent.hideMaskRow();
            } else {
                this.parent.hideSpinner();
            }
        }
        let tier: string = this.topTier === 'None' ? 'bottomTier' : 'topTier';
        if (this.parent.enableTimelineVirtualization && (!this.parent.pdfExportModule || this.parent.pdfExportModule && !this.parent.pdfExportModule.isPdfExport)) {
            this.wholeTimelineWidth = this.calculateWidthBetweenTwoDate(tier, this.parent.timelineModule.timelineStartDate, this.parent.timelineModule.timelineEndDate);
            this.parent.element.querySelectorAll(".e-chart-scroll-container")[0].querySelector(".e-virtualtrack")['style'].width = this.wholeTimelineWidth + 'px';
            this.parent.element.querySelectorAll(".e-timeline-header-container")[0].querySelector(".e-virtualtrack")['style'].width = this.wholeTimelineWidth + 'px';
            this.parent.ganttChartModule.updateWidthAndHeight();
        }
    }
    /**
     * To perform the zoom to fit operation in Gantt.
     *
     * @returns {void}
     * @private
     */
    public processZoomToFit(): void {
        this.isZoomToFit = true;
        this.isZooming = false;
        this.isZoomedToFit = true;
        let previousTimeline: Object = {};
        if (this.parent.undoRedoModule && !this.parent.undoRedoModule['isUndoRedoPerformed'] && this.parent['isUndoRedoItemPresent']('ZoomToFit')) {
            if (this.parent.undoRedoModule['redoEnabled']) {
                this.parent.undoRedoModule['disableRedo']();
            }
            this.parent.undoRedoModule['createUndoCollection']();
            previousTimeline['action'] = 'ZoomToFit';
            previousTimeline['previousTimelineStartDate'] = extend([], [], [this.parent.cloneProjectStartDate], true)[0];
            previousTimeline['previousTimelineEndDate'] = extend([], [], [this.parent.cloneProjectEndDate], true)[0];
            previousTimeline['previousZoomingLevel'] = extend({}, {}, this.parent.currentZoomingLevel, true);
            (this.parent.undoRedoModule['getUndoCollection'][this.parent.undoRedoModule['getUndoCollection'].length - 1] as any) = previousTimeline;
        }
        if (!this.parent.zoomingProjectStartDate) {
            this.parent.zoomingProjectStartDate = this.parent.cloneProjectStartDate;
            this.parent.zoomingProjectEndDate = this.parent.cloneProjectEndDate;
        }
        if(this.parent.zoomingProjectStartDate > this.parent.cloneProjectStartDate){
            this.parent.cloneProjectStartDate = new Date(this.parent.allowUnscheduledTasks ? this.parent.zoomingProjectStartDate : this.parent.cloneProjectStartDate);
        }
        this.parent.dataOperation.calculateProjectDates();
        const timeDifference: number = (this.parent.cloneProjectEndDate.getTime() - this.parent.cloneProjectStartDate.getTime());
        const totalDays: number = (timeDifference / (1000 * 3600 * 24));
        const chartWidth: number = this.parent.ganttChartModule.chartElement.offsetWidth;
        const perDayWidth: number = chartWidth / totalDays;
        let zoomingLevel: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        let secondValue: ZoomTimelineSettings;
        const zoomingCollections: ZoomTimelineSettings[] = [...this.parent.zoomingLevels];
        const sortedCollectons: ZoomTimelineSettings[] = zoomingCollections.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings) =>
            (!a.perDayWidth && !b.perDayWidth ? 0 : (a.perDayWidth < b.perDayWidth) ? 1 : -1));
        if (perDayWidth === 0) { // return when the Gantt chart is not in viewable state.
            return;
        }
        for (let i: number = 0; i < sortedCollectons.length; i++) {
            firstValue = sortedCollectons[i as number];
            if (i === sortedCollectons.length - 1) {
                zoomingLevel = sortedCollectons[i as number];
                break;
            } else {
                secondValue = sortedCollectons[i + 1];
            }
            if (perDayWidth >= firstValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i as number];
                break;
            }
            if (perDayWidth < firstValue.perDayWidth && perDayWidth > secondValue.perDayWidth) {
                zoomingLevel = sortedCollectons[i + 1];
                break;
            }
        }
        const newTimeline: ZoomTimelineSettings = extend({}, {}, zoomingLevel, true);
        this.roundOffDateToZoom(this.parent.cloneProjectStartDate, true, perDayWidth, newTimeline.bottomTier.unit, zoomingLevel);
        this.roundOffDateToZoom(this.parent.cloneProjectEndDate, false, perDayWidth, newTimeline.bottomTier.unit, zoomingLevel);
        const numberOfCells: number = this.calculateNumberOfTimelineCells(newTimeline);
        const scrollHeight: number = this.parent.ganttChartModule.scrollElement.offsetHeight - 17; //17 is horizontal scrollbar width
        const contentHeight: number = this.parent.ganttChartModule.chartBodyContent.offsetHeight;
        const emptySpace: number = contentHeight <= scrollHeight ? 0 : 17;
        newTimeline.timelineUnitSize = Math.abs((chartWidth - emptySpace)) / numberOfCells;
        const args: ZoomEventArgs = {
            requestType: 'beforeZoomToProject',
            timeline: newTimeline
        };
        if (this.parent.toolbarModule) {
            this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin', this.parent.controlId + '_zoomout'], true);
        }
        this.parent.trigger('actionBegin', args);
        if (!isNullOrUndefined(this.parent.loadingIndicator) && this.parent.loadingIndicator.indicatorType === "Shimmer") {
            this.parent.showMaskRow();
        } else {
            this.parent.showSpinner();
        }
        this.changeTimelineSettings(newTimeline);
        this.parent.isTimelineRoundOff = isNullOrUndefined(this.parent.projectStartDate) ? true : false;
        this.isZoomToFit = false;
    }
    
    private bottomTierCellWidthCalc(mode: string, zoomLevel: ZoomTimelineSettings, date: Date) {
        let convertedMilliSeconds: number;
        switch (mode) {
            case 'Minutes':
                convertedMilliSeconds = zoomLevel.bottomTier.count * (60 * 1000);
                break
            case 'Hour':
                convertedMilliSeconds = zoomLevel.bottomTier.count * (60 * 60 * 1000);
                break
            case 'Week':
                convertedMilliSeconds = zoomLevel.bottomTier.count * (7 * 24 * 60 * 60 * 1000);
                break
            case 'Day':
                convertedMilliSeconds = zoomLevel.bottomTier.count * (24 * 60 * 60 * 1000);
                break;
            case 'Month':
                const daysInMonth: number = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                convertedMilliSeconds = zoomLevel.bottomTier.count * (60 * 60 * 24 * daysInMonth * 1000);
                break
            case 'Year':
                const daysInYear: number = (date.getFullYear() % 400 === 0 || (date.getFullYear() % 100 !== 0 && date.getFullYear() % 4 === 0)) ? 366 : 365;
                convertedMilliSeconds = zoomLevel.bottomTier.count * (60 * 60 * 24 * daysInYear * 1000);
                break
        }
        return convertedMilliSeconds;
    }

    private roundOffDateToZoom(date: Date, isStartDate: boolean, perDayWidth: number, tierMode: string, zoomingLevel: ZoomTimelineSettings): void {
        const roundOffTime: number = this.bottomTierCellWidthCalc(tierMode, zoomingLevel, date);
        if (isStartDate) {
            date.setTime(date.getTime() - roundOffTime);
        } else {
            date.setTime(date.getTime() + roundOffTime);
        }
    }

    private calculateNumberOfTimelineCells(newTimeline: ZoomTimelineSettings): number {
        const sDate: Date = new Date(this.parent.cloneProjectStartDate.getTime());
        const eDate: Date = new Date(this.parent.cloneProjectEndDate.getTime());
        this.parent.dateValidationModule['updateDateWithTimeZone'](sDate, eDate);
        const numberOfDays: number = Math.abs((eDate.getTime() - sDate.getTime()) / (24 * 60 * 60 * 1000));
        const count: number = newTimeline.bottomTier.count;
        const unit: string = newTimeline.bottomTier.unit;
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
     *
     * @returns {void}
     * @private
     */
    public processTimelineUnit(): void {
        const directProperty: string[] = ['timelineViewMode', 'timelineUnitSize', 'weekStartDay', 'weekendBackground'];
        const innerProperty: Object = {
            'topTier': ['unit', 'format', 'count', 'formatter'],
            'bottomTier': ['unit', 'format', 'count', 'formatter']
        };
        const tierUnits: string[] = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minutes'];
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
     *
     * @returns {void}
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
        if (!(this.parent.pdfExportModule && this.parent.pdfExportModule.helper.exportProps &&
            this.parent.pdfExportModule.isPdfExport && this.parent.pdfExportModule.helper.exportProps.fitToWidthSettings.isFitToWidth)) {
           this.checkCurrentZoomingLevel();
        }
    }
    /**
     * To find the current zooming level of the Gantt control.
     *
     * @returns {void}
     * @private
     */
    public calculateZoomingLevelsPerDayWidth(): void {
        const collections: ZoomTimelineSettings[] = this.parent.zoomingLevels;
        for (let i: number = 0; i < collections.length; i++) {
            const perDayWidth: number =
                this.getPerDayWidth(
                    collections[i as number].timelineUnitSize,
                    collections[i as number].bottomTier.count,
                    collections[i as number].bottomTier.unit);
            collections[i as number].perDayWidth = perDayWidth;
        }
    }
    /**
     * To find the current zooming level of the Gantt control.
     *
     * @returns {void}
     * @private
     */
    private checkCurrentZoomingLevel(): number {
        const count: number = this.customTimelineSettings.bottomTier.unit !== 'None' ?
            this.customTimelineSettings.bottomTier.count : this.customTimelineSettings.topTier.count;
        const unit: string = this.customTimelineSettings.bottomTier.unit !== 'None' ?
            this.customTimelineSettings.bottomTier.unit : this.customTimelineSettings.topTier.unit;
        const tier: string = this.customTimelineSettings.bottomTier.unit !== 'None' ?
            "bottomTier" : "topTier";
        const zoomLevel: number = this.getCurrentZoomingLevel(unit, count,tier);
        if (this.parent.toolbarModule) {
            if (zoomLevel === this.parent.zoomingLevels[this.parent.zoomingLevels.length - 1].level) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomin'], false);
            } else if (zoomLevel === this.parent.zoomingLevels[0].level) {
                this.parent.toolbarModule.enableItems([this.parent.controlId + '_zoomout'], false);
            }

        }
        this.parent.currentZoomingLevel = this.parent.zoomingLevels[zoomLevel as number];
        return zoomLevel;
    }
    /**
     * @param {string} unit .
     * @param {number} count .
     * @returns {number} .
     * @private
     */
    private getCurrentZoomingLevel(unit: string, count: number,tier?:string): number {
        let level: number;
        let currentZoomCollection: ZoomTimelineSettings;
        let checkSameCountLevels: ZoomTimelineSettings[];
        let secondValue: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        if (!this.parent.zoomingLevels.length) {
            this.parent.zoomingLevels = this.parent.getZoomingLevels();
        }
        let sameUnitLevels: ZoomTimelineSettings[] = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
            if (tier === "bottomTier") {
                return tempLevel.bottomTier.unit === unit;
            } else {
                return tempLevel.topTier.unit === unit;
            }
        });
        if (sameUnitLevels.length === 0) {
            const closestUnit: string = this.getClosestUnit(unit, '', false);
            sameUnitLevels = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
                if (tier === "bottomTier") {
                    return tempLevel.bottomTier.unit === closestUnit;
                } else {
                    return tempLevel.topTier.unit === closestUnit;
                }
            });
        }
        const sortedUnitLevels: ZoomTimelineSettings[] = sameUnitLevels.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings)  =>  {
            if (tier === "bottomTier") {
                return (!a.bottomTier.count || !b.bottomTier.count) ? 0 : ((a.bottomTier.count < b.bottomTier.count) ? 1 : -1);
            } else {
                return (!a.topTier.count || !b.topTier.count) ? 0 : ((a.topTier.count < b.topTier.count) ? 1 : -1);
            }
        });
        for (let i: number = 0; i < sortedUnitLevels.length; i++) {
            firstValue = sortedUnitLevels[i as number];
            if (i === sortedUnitLevels.length - 1) {
                level = sortedUnitLevels[i as number].level;
                break;
            } else {
                secondValue = sortedUnitLevels[i + 1];
            }

            if (count >= firstValue[`${tier}`].count) {
                currentZoomCollection = sortedUnitLevels[i as number];
                checkSameCountLevels = sortedUnitLevels.filter((tempLevel: ZoomTimelineSettings) => {
                    if (tier === "bottomTier") {
                        return tempLevel.bottomTier.count === currentZoomCollection.bottomTier.count;
                    } else {
                        return tempLevel.topTier.count === currentZoomCollection.topTier.count;
                    }
                });
                if (checkSameCountLevels.length > 1) {
                    level = this.checkCollectionsWidth(checkSameCountLevels);
                } else {
                    level = checkSameCountLevels[0].level;
                }
                break;
            } else if (count < firstValue[`${tier}`].count && count > secondValue[`${tier}`].count) {
                currentZoomCollection = sortedUnitLevels[i + 1];
                checkSameCountLevels = sortedUnitLevels.filter((tempLevel: ZoomTimelineSettings) => {
                    if (tier === "bottomTier") {
                        return tempLevel.bottomTier.count === currentZoomCollection.bottomTier.count;
                    } else {
                        return tempLevel.topTier.count === currentZoomCollection.topTier.count;
                    }
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
     *
     * @param {string} unit .
     * @param {string} closetUnit .
     * @param {boolean} isCont .
     * @returns {string} .
     * @private
     */
    private getClosestUnit(unit: string, closetUnit: string, isCont: boolean): string {
        const bottomTierUnits: string[] = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minutes'];
        const index: number = bottomTierUnits.indexOf(unit);
        if (index === 0) {
            isCont = true;
        }
        if (this.isZoomIn || isCont) {
            unit = bottomTierUnits[index + 1];
        } else {
            unit = bottomTierUnits[index - 1];

        }
        const sameUnitLevels: ZoomTimelineSettings[] = this.parent.zoomingLevels.filter((tempLevel: ZoomTimelineSettings) => {
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
        const zoomLevels: ZoomTimelineSettings[] = checkSameLevels;
        const width: number = this.customTimelineSettings.timelineUnitSize;
        let level: number;
        let secondValue: ZoomTimelineSettings;
        let firstValue: ZoomTimelineSettings;
        const sortedZoomLevels: ZoomTimelineSettings[] = zoomLevels.sort((a: ZoomTimelineSettings, b: ZoomTimelineSettings) =>
            (a.timelineUnitSize < b.timelineUnitSize) ? 1 : -1);
        for (let i: number = 0; i < sortedZoomLevels.length; i++) {
            firstValue = sortedZoomLevels[i as number];
            if (i === sortedZoomLevels.length - 1) {
                level = sortedZoomLevels[i as number].level;
                break;
            } else {
                secondValue = sortedZoomLevels[i + 1];
            }
            if (width >= firstValue.timelineUnitSize) {
                level = sortedZoomLevels[i as number].level;
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
     *
     * @returns {void}
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

    private dateByLeftValue(left: number,isMilestone?:boolean,property?:ITaskData): Date {
        let pStartDate: Date = new Date(this.parent.timelineModule.timelineStartDate.toString());
        const milliSecondsPerPixel: number = (24 * 60 * 60 * 1000) / this.parent.perDayWidth;
        pStartDate.setTime(pStartDate.getTime() + (left * milliSecondsPerPixel));
        /* To render the milestone in proper date while editing */
        if (isMilestone && !isNullOrUndefined(property.predecessorsName) && property.predecessorsName !== '') {
            pStartDate.setDate(pStartDate.getDate()-1);
            this.parent.dateValidationModule.setTime(this.parent.defaultEndTime,pStartDate);
            pStartDate = this.parent.dateValidationModule.checkStartDate(pStartDate,property,true)
        }
        const tierMode: string = this.parent.timelineModule.bottomTier !== 'None' ? this.parent.timelineModule.topTier :
            this.parent.timelineModule.bottomTier;
        if (tierMode !== 'Hour' && tierMode !== 'Minutes') {
            if (this.parent.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && !this.parent.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() + (60 * 60 * 1000));
            } else if (!this.parent.isInDst(new Date(this.parent.timelineModule.timelineStartDate.toString())) && this.parent.isInDst(pStartDate)) {
                pStartDate.setTime(pStartDate.getTime() - (60 * 60 * 1000));
            }
        }
        return pStartDate;
    }

    /**
     * To create timeline header template.
     *
     * @returns {void}
     * @private
     */
    public createTimelineSeries(): void {           
        let tr: Element;
        let td: Element;
        let div: Element;
        let table: HTMLElement;
        let thead: Element;
        let virtualTableDiv: HTMLElement;
        let virtualTrackDiv: HTMLElement;
        const loopCount: number = this.isSingleTier ? 1 : 2;
        let tier: string = this.topTier === 'None' ? 'bottomTier' : 'topTier';
        this.topTierCollection = [];
        this.bottomTierCollection = [];
        if (this.restrictRender == true){        
            this.updateTimelineHeaderHeight();
            this.wholeTimelineWidth = this.calculateWidthBetweenTwoDate(tier, this.parent.timelineModule.timelineStartDate, this.parent.timelineModule.timelineEndDate);
        }
        if (this.parent.enableTimelineVirtualization && (this.wholeTimelineWidth > this.parent.element.offsetWidth * 3)) {
            for (let count: number = 0; count < loopCount; count++) {
                table = createElement('table', { className: cls.timelineHeaderTableContainer, styles: 'display: block;' });
                table.setAttribute('role', 'none');
                thead = createElement('thead', { className: cls.timelineHeaderTableBody, styles: 'display:block; border-collapse:collapse' });
                tr = createElement('tr', { innerHTML: this.createTimelineTemplate(tier) });
                td = createElement('td');
                div = createElement('div', { styles: 'width: 20px' });
                virtualTableDiv = createElement('div', { className: cls.virtualTable });
                virtualTrackDiv = createElement('div', { className: cls.virtualTrack });
                td.appendChild(div);
                tr.appendChild(td);
                virtualTableDiv.appendChild(tr);
                thead.appendChild(virtualTableDiv);
                thead.appendChild(virtualTrackDiv);
                table.appendChild(thead);
                this.parent.ganttChartModule.chartTimelineContainer.appendChild(table);
                tier = 'bottomTier';
                tr = null;
                this.restrictRender = false;
            }
            if (this.parent.height === "Auto" || this.parent.timelineModule.isSingleTier) {
                var timelineContainer = this.parent.element.getElementsByClassName('e-timeline-header-container')[0]['offsetHeight'];
                this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
                if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-gridcontent')[0])) {
                    this.parent.treeGrid.element.getElementsByClassName('e-gridcontent')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
                }
            }
            this.timelineVirtualizationStyles();
        }
        else {
            for (let count: number = 0; count < loopCount; count++) {
                table = createElement('table', { className: cls.timelineHeaderTableContainer, styles: 'display: block;' });
                table.setAttribute('role', 'none');
                thead = createElement('thead', { className: cls.timelineHeaderTableBody, styles: 'display:block; border-collapse:collapse' });
                tr = createElement('tr', { innerHTML: this.createTimelineTemplate(tier) });
                td = createElement('td');
                div = createElement('div', { styles: 'width: 20px' });
                td.appendChild(div);
                tr.appendChild(td);
                thead.appendChild(tr);
                table.appendChild(thead);
                this.parent.ganttChartModule.chartTimelineContainer.appendChild(table);
                tier = 'bottomTier';
                tr = null;
            }
            if (this.parent.height === "Auto" || this.parent.timelineModule.isSingleTier) {
                var timelineContainer = this.parent.element.getElementsByClassName('e-timeline-header-container')[0]['offsetHeight'];
                this.parent.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
                if (!isNullOrUndefined(this.parent.element.getElementsByClassName('e-gridcontent')[0])) {
                    this.parent.treeGrid.element.getElementsByClassName('e-gridcontent')[0]['style'].height = 'calc(100% - ' + timelineContainer + 'px)';
                }
            }
        }
    }

    public timelineVirtualizationStyles(): void {
        let translateXValue: number = 0;
        let translateYValue: number = 0;
        let trackWidth: number = this.wholeTimelineWidth;
        if (this.parent.enableTimelineVirtualization) {
            //e-content styles updating
            translateXValue = (this.parent.enableTimelineVirtualization && !isNullOrUndefined(this.parent.ganttChartModule.scrollObject.element.scrollLeft)
                && this.parent.ganttChartModule.scrollObject.element.scrollLeft != 0) ? this.parent.ganttChartModule.scrollObject.getTimelineLeft() : 0;
            if (this.parent.enableRtl) {
               translateXValue = -(translateXValue);
            }
            let contentVirtualTable: HTMLElement = this.parent.element.querySelectorAll(".e-chart-scroll-container")[0].querySelector(".e-virtualtable");
            contentVirtualTable.style.transform = `translate(${translateXValue}px, ${translateYValue}px)`;
            let contentVirtualTrack: HTMLElement = this.parent.element.querySelectorAll(".e-chart-scroll-container")[0].querySelector(".e-virtualtrack");
            contentVirtualTrack.style.position = "relative";
            contentVirtualTrack.style.width = trackWidth + 'px';
            //timeline styles updating
            if (this.parent.ganttChartModule.scrollObject['isSetScrollLeft']) {
                let virtualTableStylesT: HTMLElement = this.parent.element.querySelectorAll(".e-timeline-header-table-container")[0].querySelector(".e-virtualtable");
                let virtualTableStylesB: HTMLElement = this.parent.element.querySelectorAll(".e-timeline-header-table-container")[1].querySelector(".e-virtualtable");
                virtualTableStylesT.style.transform = `translate(${translateXValue}px, ${translateYValue}px)`;
                virtualTableStylesB.style.transform = `translate(${translateXValue}px, ${translateYValue}px)`;
            }
            let virtualTrackStylesT: HTMLElement = this.parent.element.querySelectorAll(".e-timeline-header-table-container")[0].querySelector(".e-virtualtrack");
            let virtualTrackStylesB: HTMLElement = this.parent.element.querySelectorAll(".e-timeline-header-table-container")[1].querySelector(".e-virtualtrack");
            virtualTrackStylesT.style.position = "relative";
            virtualTrackStylesB.style.position = "relative";
            virtualTrackStylesT.style.width = trackWidth + 'px';
            virtualTrackStylesB.style.width = trackWidth + 'px';
            //dependency viewer styles updating
            let dependencyViewer: Element = this.parent.connectorLineModule.svgObject;
            dependencyViewer['style'].width = trackWidth + 'px';
            // timeline header container width updating
            let timelineHeader: HTMLElement = this.parent.element.querySelector('.' + cls.timelineHeaderContainer);
            timelineHeader['style'].width = 'calc(100% - ' + 17 + 'px)';
            if (this.parent.timelineModule.isZooming || this.parent.timelineModule.isZoomToFit) {
                this.parent.ganttChartModule.scrollElement.scrollLeft = 0;
                this.parent.ganttChartModule.scrollObject.updateChartElementStyles();
            }
        }
    }

    /**
     * To validate timeline tier count.
     *
     * @param {string} mode .
     * @param {number} count .
     * @param {string} tier .
     * @returns {number} .
     * @private
     */
    private validateCount(mode: string, count: number, tier: string): number {
        let tierCount: number = !isNullOrUndefined(count) && parseInt(count.toString(), 10) > 0 ? parseInt(count.toString(), 10) : 1;
        const timeDifference: number = Math.abs(this.timelineRoundOffEndDate.getTime() - this.timelineStartDate.getTime());
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
            tierCount = tierCount <= difference ? tierCount : difference > 0 ? (difference + 1) : 1;
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
     *
     * @param {string} mode .
     * @param {number} tierCount .
     * @returns {number} .
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
     *
     * @param {string} mode .
     * @param {string} format .
     * @returns {string} .
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
     *
     * @param {object} cloneObj .
     * @param {string[]} propertyCollection .
     * @param {object} innerProperty .
     * @returns {object} .
     * @private
     */
    public extendFunction(cloneObj: Object, propertyCollection: string[], innerProperty?: Object): Object {
        const tempObj: Object = {};
        for (let index: number = 0; index < propertyCollection.length; index++) {
            tempObj[propertyCollection[index as number]] = cloneObj[propertyCollection[index as number]];
        }
        if (innerProperty) {
            Object.keys(innerProperty).forEach((key: string) => {
                tempObj[key as string] = this.extendFunction(cloneObj[key as string], innerProperty[key as string], null);
            });
        }
        return tempObj;
    }

    /**
     * To format date.
     *
     * @param {string} dayFormat .
     * @param {Date} data .
     * @returns {string} .
     * @private
     */
    private formatDateHeader(dayFormat: string, data: Date): string {
        const date: Date = new Date(data.getTime());
        let dateString: string;
        if (dayFormat === '') {
            dateString = this.parent.globalize.formatDate(date, { format: 'E' });
            if (this.parent.locale === 'zh') {
                dateString = dateString.slice(1);
            } else {
                if (this.parent.locale === 'ar') {
                    dateString = dateString;
                }else{
                    dateString = dateString.slice(0, 1);
                }
            }
        } else {
            dateString = this.parent.globalize.formatDate(date, { format: dayFormat });
        }
        return dateString;
    }

    /**
     * Custom Formatting.
     *
     * @param {Date} date .
     * @param {string} format .
     * @param {string} tier .
     * @param {string} mode .
     * @param {string | ITimelineFormatter} formatter .
     * @returns {string} .
     * @private
     */
    private customFormat(date: Date, format: string, tier: string, mode: string, formatter: string | ITimelineFormatter): string {
        formatter = (typeof formatter === 'string' ? getValue(formatter, window) as ITimelineFormatter : formatter);
        return formatter(date, format, tier, mode);
    }

    /**
     * To create timeline template .
     *
     * @param {string} tier .
     * @returns {string} .
     * @private
     */
    private createTimelineTemplate(tier: string): string {
        var isFirstCell = false;
        const parent: Gantt = this.parent;
        let parentTh: string = '';
        let parentTr: string = '';
        const mode: string = tier === 'topTier' ?
            parent.timelineModule.customTimelineSettings.topTier.unit : parent.timelineModule.customTimelineSettings.bottomTier.unit;
        const count: number = tier === 'topTier' ? parent.timelineModule.customTimelineSettings.topTier.count :
            parent.timelineModule.customTimelineSettings.bottomTier.count;
        let increment: number;
        let newTime: number;
        let leftValueForStartDate: number = (this.parent.enableTimelineVirtualization && this.parent.ganttChartModule.scrollObject.element.scrollLeft != 0)
            ? this.parent.ganttChartModule.scrollObject.getTimelineLeft() : null;
        let startDate: Date = (this.parent.enableTimelineVirtualization && !isNullOrUndefined(leftValueForStartDate))
            ? new Date((this.dateByLeftValue(leftValueForStartDate)).toString()) : new Date(this.parent.timelineModule.timelineStartDate.toString());
        const endDate: Date = new Date(this.timelineRoundOffEndDate.toString());
        const scheduleDateCollection: Date[] = [];
        let width: number = 0;
        let WidthForVirtualTable: number = this.parent.element.offsetWidth * 3;
        do {
            // PDf export collection
            const timelineCell: TimelineFormat = {};
            timelineCell.startDate = new Date(startDate.getTime());
            if (mode === 'Month' && tier === 'bottomTier' && (count != 1) && scheduleDateCollection.length === 0) {
                isFirstCell = true;
            }
            parentTr = this.getHeaterTemplateString(new Date(startDate.toString()), mode, tier, false, count, timelineCell, isFirstCell);
            scheduleDateCollection.push(new Date(startDate.toString()));
            if (isFirstCell) {
                newTime = this.calculateQuarterEndDate(startDate, count).getTime();
            } else {
                increment = this.getIncrement(startDate, count, mode);
                newTime = startDate.getTime() + increment;
            }
            isFirstCell = false;
            startDate.setTime(newTime);
            if (startDate.getHours() === 5 && count === 2 && tier === 'bottomTier' &&
                this.parent.timelineSettings.bottomTier.unit === 'Hour') {
                startDate.setTime(startDate.getTime() - (1000 * 60 * 60));
            }
            if (startDate >= endDate) {
                /* eslint-disable-next-line */
                parentTr = this.getHeaterTemplateString(scheduleDateCollection[scheduleDateCollection.length - 1], mode, tier, true, count, timelineCell);
            }
            parentTh = parentTh + parentTr;
            const tierCollection: TimelineFormat[] = tier === 'topTier' ? this.topTierCollection : this.bottomTierCollection;
            timelineCell.endDate = new Date(startDate.getTime());
            if (this.parent.pdfExportModule && this.parent.pdfExportModule.isPdfExport && this.parent.enableTimelineVirtualization) {
                if(tier == 'topTier') {
                    this.pdfExportTopTierCollection.push(timelineCell);
                }
                else {
                    this.pdfExportBottomTierCollection.push(timelineCell);
                }
            }
            else {
                 tierCollection.push(timelineCell);
            }
            width += timelineCell.width;
            this.weekendEndDate = timelineCell.endDate >= endDate ? endDate : timelineCell.endDate;
        }
        while ((this.parent.enableTimelineVirtualization && (!this.parent.pdfExportModule || this.parent.pdfExportModule && !this.parent.pdfExportModule.isPdfExport)) ? (width < WidthForVirtualTable) && (startDate < endDate) : (startDate < endDate));
        return parentTh;
    }
   
    public updateTimelineAfterZooming(endDate: Date, resized: boolean) {
        let timeDiff: number;
        let perDayWidth: number;
        let totWidth: number;
        let contentElement: HTMLElement = document.getElementsByClassName('e-chart-scroll-container e-content')[0] as HTMLElement;
        if (!isNullOrUndefined(contentElement)) {
            let contentWidth: number = contentElement['offsetWidth'];
            let contentHeight: number = contentElement['offsetHeight'];
            let scrollHeight: number = document.getElementsByClassName('e-chart-rows-container')[0]['offsetHeight'];
            timeDiff = Math.abs(this.timelineStartDate.getTime() - endDate.getTime());
            timeDiff = timeDiff / (1000 * 3600 * 24);
            if (this.bottomTier === 'None') {
                perDayWidth = this.getPerDayWidth(this.customTimelineSettings.timelineUnitSize, this.customTimelineSettings.topTier.count, this.topTier);
            } else {
                perDayWidth = this.getPerDayWidth(this.customTimelineSettings.timelineUnitSize, this.customTimelineSettings.bottomTier.count, this.bottomTier);
            }
            if (contentHeight < scrollHeight) {
                totWidth = (perDayWidth * timeDiff) + 17;
            } else {
                totWidth = (perDayWidth * timeDiff);
            }
            if (contentWidth >= totWidth) {
                let widthDiff: number = contentWidth - totWidth;
                widthDiff = Math.round(widthDiff / perDayWidth);
                endDate.setDate(endDate.getDate() + widthDiff);
                this.parent.timelineModule.timelineEndDate = endDate;
                if (resized) {
                    this.parent.updateProjectDates(this.timelineStartDate, this.timelineEndDate, this.parent.isTimelineRoundOff)
                }
            }
        }
    }
    private getTimelineRoundOffEndDate(date: Date): Date {
        const tierMode: string = this.topTier === 'None' ? this.bottomTier : this.topTier;
        const endDate: Date = new Date(date.toString());
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Hour') {
                endDate.setMinutes(60);
            } else if (tierMode === 'Minutes') {
                endDate.setSeconds(60);
            } else {
                endDate.setHours(24, 0, 0, 0);
            }
        }
        if (isNullOrUndefined(this.parent.projectEndDate)) {
            this.updateTimelineAfterZooming(endDate, false);
        }
        return endDate;
    }
    /**
     *
     * @param {Date} startDate .
     * @param {number} count .
     * @param {string} mode .
     * @returns {number} .
     * @private
     */
    public getIncrement(startDate: Date, count: number, mode: string): number {
        let firstDay: Date = new Date(startDate.getTime());
        let lastDay: Date = new Date(startDate.getTime());
        let increment: number;
        switch (mode) {
        case 'Year':
            firstDay = startDate;
            lastDay = new Date(startDate.getFullYear() + (count - 1), 11, 31);
            increment = (lastDay.getTime() - firstDay.getTime()) + (1000 * 60 * 60 * 24);
            break;
        case 'Month':
            firstDay = startDate;
            lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + count, 1);
            increment = lastDay.getTime() - firstDay.getTime();
            break;
        case 'Week':
        {
            const dayIndex: number = this.parent.timelineModule.customTimelineSettings.weekStartDay;
            let dayIntervel: number = startDate.getDay() < dayIndex ? (dayIndex - startDate.getDay()) :
                (6 - startDate.getDay()) + dayIndex;
            count = dayIntervel > 0 ? count - 1 : 0;
            lastDay.setHours(24, 0, 0, 0);
            dayIntervel = startDate.getDay() < dayIndex ? dayIntervel > 0 ?
                dayIntervel - 1 : dayIntervel : dayIntervel;
            lastDay.setDate(lastDay.getDate() + (dayIntervel + (7 * count)));
            increment = lastDay.getTime() - firstDay.getTime();
            break;
        }
        case 'Day':
            lastDay.setHours(24, 0, 0, 0);
            increment = (lastDay.getTime() - firstDay.getTime()) + (1000 * 60 * 60 * 24 * (count - 1));
            increment = this.checkDate(firstDay, lastDay, increment, count, mode);
            break;
        case 'Hour':
            lastDay.setMinutes(60);
            lastDay.setSeconds(0);
            increment = (lastDay.getTime() - firstDay.getTime()) + (1000 * 60 * 60 * (count - 1));
            increment = this.checkDate(firstDay, lastDay, increment, count, mode);
            break;
        case 'Minutes':
            lastDay.setSeconds(60);
            increment = (lastDay.getTime() - firstDay.getTime()) + (1000 * 60 * (count - 1));
            increment = this.checkDate(firstDay, lastDay, increment, count, mode);
            break;
        }
        return increment;
    }

    private checkDate(firstDay: Date, lastDay: Date, increment: number, count: number, mode: string): number {
        var date = new Date(firstDay.getTime());
        date.setTime(date.getTime() + increment);
        if (mode === "Day" && count !== 1 && ((date.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)) != count && (firstDay.getTimezoneOffset() !== date.getTimezoneOffset())) {
            var diffCount = count - (date.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24);
            if (!this.parent.isInDst(date)) {
                increment += (1000 * 60 * 60 * diffCount);
            }
            else if (this.parent.isInDst(date) && count !== 2) {
                increment -= (1000 * 60 * 60 * diffCount);
            }
        }
        else if (mode === "Hour" && count !== 1 && ((date.getTime() - lastDay.getTime()) / (1000 * 60 * 60)) != count && (firstDay.getTimezoneOffset() !== date.getTimezoneOffset())) {
            var diffCount = count - (date.getTime() - lastDay.getTime()) / (1000 * 60 * 60);
            if (!this.parent.isInDst(date)) {
                increment += (1000 * 60 * 60 * diffCount);
            }
            else if (this.parent.isInDst(date) && count !== 2) {
                increment -= (1000 * 60 * 60 * diffCount);
            }
        }
        else if (mode === "Minutes" && count !== 1 && ((date.getTime() - lastDay.getTime()) / (1000 * 60)) != count && (firstDay.getTimezoneOffset() !== date.getTimezoneOffset())) {
            var diffCount = count - (date.getTime() - lastDay.getTime()) / (1000 * 60);
            if (!this.parent.isInDst(date)) {
                increment += (1000 * 60 * 60 * diffCount);
            }
            else if (this.parent.isInDst(date) && count !== 2) {
                increment -= (1000 * 60 * 60 * diffCount);
            }
        }
        return increment;
    }

    /**
     * Method to find header cell was weekend or not
     *
     * @param {string} mode .
     * @param {string} tier .
     * @param {Date} day .
     * @returns {boolean} .
     */
    private isWeekendHeaderCell(mode: string, tier: string, day: Date): boolean {
        return (mode === 'Day' || mode === 'Hour' || mode === 'Minutes') && (this.customTimelineSettings[tier as string].count === 1 ||
            mode === 'Hour' || mode === 'Minutes') &&
            this.parent.nonWorkingDayIndex.indexOf(day.getDay()) !== -1;
    }

    private calculateQuarterEndDate(date: Date, count: number) {
        const month: number = date.getMonth();
        if(count === 3){
            if (month >= 0 && month <= 2) {
                return new Date(date.getFullYear(), 3, 1);
            } else if (month >= 3 && month <= 5) {
                return new Date(date.getFullYear(), 6, 1);
            } else if (month >= 6 && month <= 8) {
                return new Date(date.getFullYear(), 9, 1);
            } else {
                return new Date(date.getFullYear() + 1, 0, 1);
            }
        }
        else{
            if (month >= 0 && month <= 5) {
                return new Date(date.getFullYear(), 6, 1);
            }else {
                return new Date(date.getFullYear() + 1, 0, 1);
            }
        }
    }

    /**
     * To construct template string.
     *
     * @param {Date} scheduleWeeks .
     * @param {string} mode .
     * @param {string} tier .
     * @param {boolean} isLast .
     * @param {number} count .
     * @param {TimelineFormat} timelineCell .
     * @returns {string} .
     * @private
     */
    /* eslint-disable-next-line */
    private getHeaterTemplateString(scheduleWeeks: Date, mode: string, tier: string, isLast: boolean, count?: number, timelineCell?: TimelineFormat, isFirstCell?: boolean): string {
        let parentTr: string = '';
        let td: string = '';
        const format: string = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.format :
            this.parent.timelineModule.customTimelineSettings.bottomTier.format;
        const formatter: string | ITimelineFormatter = tier === 'topTier' ?
            this.parent.timelineModule.customTimelineSettings.topTier.formatter :
            this.parent.timelineModule.customTimelineSettings.bottomTier.formatter;
        let thWidth: number;
        const date: string = isNullOrUndefined(formatter) ?
            this.parent.globalize.formatDate(scheduleWeeks, { format: this.parent.getDateFormat() }) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter);
        thWidth = (this.getIncrement(scheduleWeeks, count, mode) / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth;
        const newDate: Date = new Date(scheduleWeeks.getTime() + this.getIncrement(scheduleWeeks, count, mode))
        if ((!this.parent.isInDst(newDate) && this.parent.isInDst(scheduleWeeks)) ||
            (this.parent.isInDst(newDate) && !this.parent.isInDst(scheduleWeeks))) {
            let temp: number;
            if ((!this.parent.isInDst(newDate) && this.parent.isInDst(scheduleWeeks))) {
                temp = this.getIncrement(scheduleWeeks, count, mode) - (1000 * 60 * 60);
            }
            else {
                temp = this.getIncrement(scheduleWeeks, count, mode) + (1000 * 60 * 60);
            }
            thWidth = (temp / (1000 * 60 * 60 * 24)) * this.parent.perDayWidth;
        }
        const cellWidth: number = thWidth;
        thWidth = isLast || isFirstCell ? isLast ? this.calculateWidthBetweenTwoDate(
            mode, scheduleWeeks, this.timelineRoundOffEndDate) : this.calculateWidthBetweenTwoDate(mode, scheduleWeeks, this.calculateQuarterEndDate(scheduleWeeks, count))
            : thWidth;
        const isWeekendCell: boolean = this.isWeekendHeaderCell(mode, tier, scheduleWeeks);
        const textClassName: string = tier === 'topTier' ? ' e-gantt-top-cell-text' : '';
        const value: string = (isNullOrUndefined(formatter) ? this.formatDateHeader(format, scheduleWeeks) :
            this.customFormat(scheduleWeeks, format, tier, mode, formatter));
        td += this.parent.timelineModule.isSingleTier ?
            '<th class="' + cls.timelineSingleHeaderCell + ' ' : '<th class="' + cls.timelineTopHeaderCell;
        td += isWeekendCell ? ' ' + cls.weekendHeaderCell : '';
        td += '" tabindex="-1" aria-label= "' + this.parent.localeObj.getConstant('timelineCell') + ' ' + date;
        td += '" style="width:' + thWidth + 'px;';
        td += isWeekendCell && this.customTimelineSettings.weekendBackground ?
            'background-color:' + this.customTimelineSettings.weekendBackground + ';' : '';
        td += '"><div class="' + cls.timelineHeaderCellLabel + textClassName + '" style="width:' +
            (thWidth - 1) + 'px;' + (this.parent.timelineSettings.showTooltip ? '"title="' + date : '');
        td += '">' + value + '</div>';
        parentTr += td;
        parentTr += '</th>';
        if ((this.isSingleTier || tier === 'topTier') && !isLast) {
            this.totalTimelineWidth = this.totalTimelineWidth + thWidth;
        } else if ((this.isSingleTier || tier === 'topTier') && isLast) {
            this.totalTimelineWidth = (this.totalTimelineWidth - cellWidth) + thWidth;
        }
        // PDf export collection
        timelineCell.value = value;
        timelineCell.isWeekend = isWeekendCell;
        timelineCell.width = thWidth;
        return parentTr;
    }

    /**
     * To calculate last 'th' width.
     *
     * @param {string} mode .
     * @param {Date} scheduleWeeks .
     * @param {Date} endDate .
     * @returns {number} .
     * @private
     */
    private calculateWidthBetweenTwoDate(mode: string, scheduleWeeks: Date, endDate: Date): number {
        const sDate: Date = new Date(scheduleWeeks.getTime());
        const eDate: Date = new Date(endDate.getTime());
        this.parent.dateValidationModule['updateDateWithTimeZone'](sDate, eDate);
        let timeDifference: number = (eDate.getTime() - sDate.getTime());
        const balanceDay: number = (timeDifference / (1000 * 60 * 60 * 24));
        return balanceDay * this.parent.perDayWidth;
    }

    /**
     * To calculate timeline width.
     *
     * @returns {void} .
     * @private
     */
    private timelineWidthCalculation(): void {
        const timelineUnitSize: number = this.customTimelineSettings.timelineUnitSize;
        const bottomTierCount: number = this.customTimelineSettings.bottomTier.count;
        const topTierCount: number = this.customTimelineSettings.topTier.count;
        this.bottomTierCellWidth = timelineUnitSize;
        if (this.bottomTier === 'None') {
            this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, topTierCount, this.topTier);
        } else {
            this.parent.perDayWidth = this.getPerDayWidth(timelineUnitSize, bottomTierCount, this.bottomTier);
        }
        this.topTierCellWidth = this.bottomTier !== 'None' ? this.topTier === 'Week' ?
            this.parent.perDayWidth * 7 : this.topTier === 'Hour' ?
                this.parent.perDayWidth / 24 : this.topTier === 'Minutes' ?
                    this.parent.perDayWidth / (24 * 60) : this.parent.perDayWidth : timelineUnitSize;
        this.topTierCellWidth = this.isSingleTier ? this.topTierCellWidth : this.topTierCellWidth * topTierCount;
    }

    /**
     * To validate per day width.
     *
     * @param {number} timelineUnitSize .
     * @param {number} bottomTierCount .
     * @param {string} mode .
     * @returns {number} .
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
     *
     * @returns {void} .
     * @private
     */
    private roundOffDays(): void {
        let startDate: Date = this.parent.cloneProjectStartDate;
        let endDate: Date = this.parent.cloneProjectEndDate;
        const tierMode: string = this.topTier === 'None' ? this.bottomTier : this.topTier;
        if (this.parent.isTimelineRoundOff) {
            if (tierMode === 'Year') {
                startDate = new Date(startDate.getFullYear(), 0, 1);
                endDate = new Date(endDate.getFullYear(), 11, 31);
            } else if (tierMode === 'Month') {
                startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            } else if (tierMode === 'Week') {
                const dayIndex: number = !isNullOrUndefined(this.customTimelineSettings.weekStartDay) ? this.parent.timelineModule.customTimelineSettings.weekStartDay : 0;
                const roundOffStartDate: number = startDate.getDay() < dayIndex ?
                    (startDate.getDate()) - (7 - dayIndex + startDate.getDay()) :
                    (startDate.getDate()) - startDate.getDay() + dayIndex;
                startDate.setDate(roundOffStartDate);
                const first: number = endDate.getDate() - endDate.getDay();
                const last: number = first + 6 + dayIndex;
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
     *
     * @param {string} mode .
     * @param {string} span .
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @returns {void} .
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
            const dayIndex: number = this.parent.timelineModule.customTimelineSettings.weekStartDay;
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
     *
     * @param {IGanttData[]} tempArray .
     * @param {string} action .
     * @returns {void} .
     * @private
     */
    public updateTimeLineOnEditing(tempArray: IGanttData[][], data: any): void {
        let action:any = data.action
        if (tempArray[0].length >= 1)
        {
            for (let i: number = 0; i < tempArray.length; i++)
            {
                /* eslint-disable-next-line */
                const temp: any = tempArray[i];
                const filteredStartDateRecord: IGanttData[] = temp.filter(
                    (pdc: IGanttData) => { return !isNullOrUndefined(pdc.ganttProperties.startDate); });
                const filteredEndDateRecord: IGanttData[] = temp.filter(
                    (pdc: IGanttData) => { return !isNullOrUndefined(pdc.ganttProperties.endDate); });
                let minStartDate: Date = filteredStartDateRecord.length > 0 ?
                    new Date(DataUtil.aggregates.min(filteredStartDateRecord, 'ganttProperties.startDate')) : null;
                let maxEndDate: Date = filteredEndDateRecord.length > 0 ?
                    new Date(DataUtil.aggregates.max(filteredEndDateRecord, 'ganttProperties.endDate')) : null;
                const validStartDate: Date = new Date(this.parent.dataOperation.checkStartDate(this.timelineStartDate).getTime());
                const validEndDate: Date = new Date(this.parent.dataOperation.checkEndDate(this.timelineEndDate).getTime());
                const maxStartLeft: number = isNullOrUndefined(minStartDate) ?
                    null : this.parent.dataOperation.getTaskLeft(minStartDate, false);
                const maxEndLeft: number = isNullOrUndefined(maxEndDate) ?
                    null : this.parent.dataOperation.getTaskLeft(maxEndDate, false);
                const validStartLeft: number = this.parent.dataOperation.getTaskLeft(validStartDate, false);
                const validEndLeft: number = this.parent.dataOperation.getTaskLeft(validEndDate, false);
                let isChanged: string;
                let taskbarModule: TaskbarEdit = this.parent.editModule.taskbarEditModule;
                let validateDate:any;
                if (data.data && data.data.ganttProperties) {
                    validateDate = data.data.ganttProperties.startDate ? 
                                        data.data.ganttProperties.startDate : 
                                        data.data.ganttProperties.endDate;
                }
                let validLeft = maxStartLeft ? maxStartLeft : maxEndLeft
                let validStartorEndLeft = validStartLeft ? validStartLeft : validEndLeft
                let minOrMaxDate = minStartDate ? minStartDate :maxEndDate
                if (!isNullOrUndefined(validLeft) && (((!isNullOrUndefined(taskbarModule)) && (!isNullOrUndefined(taskbarModule.taskBarEditAction)
                    && taskbarModule.taskBarEditAction !== 'ProgressResizing' &&
                    taskbarModule.taskBarEditAction !== 'RightResizing' && taskbarModule.taskBarEditAction !== 'LeftResizing')) || (((taskbarModule)
                        && isNullOrUndefined(taskbarModule.taskBarEditAction)) && this.parent.timelineModule.timelineStartDate !== null &&
                        validateDate && this.parent.timelineModule.timelineStartDate > validateDate)) && (validLeft < this.bottomTierCellWidth || validLeft <= validStartorEndLeft)) {
                    isChanged = 'prevTimeSpan';
                    minStartDate = minOrMaxDate > this.timelineStartDate ? this.timelineStartDate : minOrMaxDate;
                } else {
                    minStartDate = this.timelineStartDate;
                }
                if (!isNullOrUndefined(maxEndLeft) && (maxEndLeft >= ((this.parent.enableTimelineVirtualization ? this.wholeTimelineWidth : this.totalTimelineWidth) - this.bottomTierCellWidth) ||
                    maxEndLeft > validEndLeft)) {
                    isChanged = isChanged === 'prevTimeSpan' ? 'both' : 'nextTimeSpan';
                    maxEndDate = maxEndDate < this.timelineEndDate ? this.timelineEndDate : maxEndDate;
                } else {
                    maxEndDate = this.timelineEndDate;
                }
                if (isChanged) {
                    this.performTimeSpanAction(isChanged, action, minStartDate, maxEndDate);
                } else if (!isNullOrUndefined(temp[0].ganttProperties.segments)) {
                    this.parent.dataOperation.updateWidthLeft(temp[0]);
                }
                break;
            }
        }
    }
    /**
     * To validate project start date and end date on editing action
     *
     * @param {string} type .
     * @param {string} isFrom .
     * @param {Date} startDate .
     * @param {Date} endDate .
     * @param {string} mode .
     * @returns {void} .
     * @private
     */
    public performTimeSpanAction(type: string, isFrom: string, startDate: Date, endDate: Date, mode?: string): void {
        mode = !isNullOrUndefined(mode) ? mode : this.parent.timelineModule.topTier === 'None' ?
            this.parent.timelineModule.bottomTier : this.parent.timelineModule.topTier;
        const projectStartDate: Date = new Date(this.parent.cloneProjectStartDate.getTime());
        const projectEndDate: Date = new Date(this.parent.cloneProjectEndDate.getTime());
        if (isFrom !== 'publicMethod' && type === 'both') {
            this.updateScheduleDatesByToolBar(
                mode, 'prevTimeSpan', startDate, endDate);
            this.updateScheduleDatesByToolBar(
                mode, 'nextTimeSpan', new Date(this.parent.cloneProjectStartDate.getTime()), endDate);
        } else {
            this.updateScheduleDatesByToolBar(
                mode, type, startDate, endDate);
        }
        const args: ITimeSpanEventArgs = this.timeSpanActionEvent('actionBegin', type, isFrom);
        if (!args.cancel) {
            this.restrictRender = true;
            this.performedTimeSpanAction = true;
            const previousScrollLeft: number = this.parent.ganttChartModule.scrollElement.scrollLeft;
            this.parent.updateProjectDates(args.projectStartDate, args.ProjectEndDate, args.isTimelineRoundOff, isFrom);
            if (type === 'prevTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(0);
                this.parent.timelineModule.isZoomToFit = false;
            } else if (type === 'nextTimeSpan' && isFrom === 'publicMethod') {
                this.parent.ganttChartModule.updateScrollLeft(this.parent.enableTimelineVirtualization? this.wholeTimelineWidth : this.totalTimelineWidth);
                this.parent.timelineModule.isZoomToFit = false;
            } else if (type === 'nextTimeSpan' && isFrom === 'TaskbarEditing') {
                let currentScrollLeft: number = document.getElementsByClassName('e-chart-scroll-container e-content')[0].scrollLeft;
                this.parent.element.querySelector('.e-timeline-header-container').scrollLeft = currentScrollLeft;
                this.parent.timelineModule.isZoomToFit = false;
            }
            if (isFrom === 'TaskbarEditing' && this.parent.enableTimelineVirtualization && this.wholeTimelineWidth > this.parent.element.offsetWidth * 3) {
                this.parent.ganttChartModule.scrollObject.setScrollLeft(previousScrollLeft);
                this.parent.ganttChartModule.scrollObject.updateContent();
             }
            this.parent.timelineModule.timeSpanActionEvent('actionComplete', type, isFrom);
        } else {
            this.parent.cloneProjectStartDate = projectStartDate;
            this.parent.cloneProjectEndDate = projectEndDate;
        }
    }

    /**
     * To validate project start date and end date.
     *
     * @param {string} eventType .
     * @param {string} requestType .
     * @param {string} isFrom .
     * @returns {void}
     * @private
     */
    public timeSpanActionEvent(eventType: string, requestType?: string, isFrom?: string): ITimeSpanEventArgs {
        const args: ITimeSpanEventArgs = {} as ITimeSpanEventArgs;
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
