/**
 * Gantt base spec
 */
import { createElement, remove, extend } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, IQueryTaskbarInfoEventArgs, ITaskbarEditedEventArgs } from '../../src/index';
import { customZoomingLevels, customZoomingLevels1, defaultGanttData, editingData18, editingResources, editingResources1, manualData, projectNewData23, resourceDataUndo, resourceResourcesUndo, tempData1, tempData2, tempData3, tempData4, tempData5, tempData6, zoomData, zoomData1, zoomInData, zoomingData1, timelineData,projectNewData, MT905728 } from './data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from './gantt-util.spec';
import * as cls from '../../src/gantt/base/css-constants';
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    //None
    it('Default Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.timelineViewMode = "None";
        ganttObj.load = function () {
            this.isTimelineRoundOff = true;
        };
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/25/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });

    it('Timeline in Year-Month Mode', (done: Function) => {
        ganttObj.timelineSettings.timelineViewMode = "Year";
        ganttObj.timelineSettings.bottomTier.count = 0;
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM yyyy");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy').toString()).toBe("1/1/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("1/1/2019");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });

    it('Timeline in Month-Week Mode', (done: Function) => {
        ganttObj.timelineSettings.timelineViewMode = "Month";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/1/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("4/1/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });

    it('Timeline in Week-Day Mode', (done: Function) => {
        ganttObj.timelineSettings.timelineViewMode = "Week";
        ganttObj.timelineSettings.weekStartDay = 3;
        ganttObj.timelineSettings.weekendBackground = 'red';
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/24/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/28/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            enableTimelineVirtualization: true,
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Day-Hour Mode', (done: Function) => {
        ganttObj.timelineSettings.timelineViewMode = "Day";
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Hour-Minutes Mode', (done: Function) => {
        ganttObj.projectStartDate = "01/28/2018";
        ganttObj.projectEndDate = "02/05/2018";
        ganttObj.timelineSettings.timelineViewMode = "Hour";
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("H");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("2/5/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Year in topTier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.topTier.format = 'yyyy';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            // expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            // expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("1/1/2019");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Minutes Mode only', function (done: Function) {
        ganttObj.projectStartDate = "02/02/2018";
        ganttObj.projectEndDate = "02/05/2018";
        ganttObj.timelineSettings.timelineViewMode = "Minutes";
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("m");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("2/2/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("2/5/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Year in both tier', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.count = 5;
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Month Mode with large count value', (done: Function) => {
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.count = 25;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(3);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Week Mode with large count value', (done: Function) => {
        ganttObj.timelineSettings.bottomTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.count = (25 * 4);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(8);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Day Mode with large count value', (done: Function) => {
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.count = (25 * 4 * 30);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(55);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Year-Hour Mode with large count value', (done: Function) => {
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.count = (25 * 4 * 30 * 24);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1320);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Minutes Mode with large count value', (done: Function) => {
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.count = (25 * 4 * 30 * 24 * 60);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(79200);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Week Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.format = 'M/dd';
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("M/dd");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Day Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.format = 'd';
        ganttObj.timelineSettings.bottomTier.count = 30;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(30);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("d");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Year-Hour Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.format = 'H';
        ganttObj.timelineSettings.bottomTier.count = (30 * 24);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(720);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Year-Minutes Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.format = 'm';
        ganttObj.timelineSettings.bottomTier.count = (30 * 24 * 60);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Year");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(43200);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    // Month
    it('Month in Toptier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.format = '';
        ganttObj.timelineSettings.topTier.format = 'M';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("M");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            // expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/1/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    it('Month in both tier with invalid bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Month in both tier with valid bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Week Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.count = 6;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(4);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Day Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.count = (6 * 7);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(28);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Hour Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.count = (6 * 7 * 24);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(672);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Month-Minutes Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.count = (6 * 7 * 24 * 60);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(40320);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Day Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Hour Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.count = (24);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(24);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Month-Minutes Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.count = (24 * 60);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Month");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1440);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Week in toptier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    it('Week in both tier', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Week in both tier', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Week-Day Mode with invalid weekstartday', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.timelineViewMode = "Week";
        ganttObj.timelineSettings.weekStartDay = 7;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Week-Day Mode with valid weekstartday', (done: Function) => {
        ganttObj.timelineSettings.timelineViewMode = "Week";
        ganttObj.timelineSettings.weekStartDay = 6;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Week-Hour Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.count = (24 * 8);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(168);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Week-Minutes Mode with large bottomtier count', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.count = (24 * 8 * 60);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(10080);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    it('Timeline in Week-Hour Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.count = 24;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(24);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Week-Minutes Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Week";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            // expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(24);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("MMM dd, yyyy");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Day in bottomTier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();

    });
    it('Day in both tier', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.unit = "Day";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Timeline in Day-Minutes Mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Day";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Day");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            // expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(24);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
     // Hour
     it('Hour in toptier only', (done: Function) => {
        ganttObj.projectStartDate = "02/02/2018";
        ganttObj.projectEndDate = "02/05/2018";
        ganttObj.timelineSettings.topTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.count = 24;
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("H");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("2/2/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe("2/5/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(1);
            done();
        }
        ganttObj.refresh();
    });
    it('Hour in both mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Hour";
        ganttObj.timelineSettings.bottomTier.unit = "Hour";
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Hour");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("H");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("H");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Custom Formatting the timeline', () => {
        ganttObj.timelineSettings.timelineViewMode = "Month";
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.timelineSettings.topTier.count = 3;
        ganttObj.timelineSettings.topTier.formatter = (date: Date) => {
            let month: number = date.getMonth();
            if (month >= 0 && month <= 2) {
                return 'Q1';
            }
            else if (month >= 3 && month <= 5) {
                return 'Q2';
            }
            else if (month >= 6 && month <= 8) {
                return 'Q3';
            }
            else {
                return 'Q4';
            }
        };
        ganttObj.refresh();
        let element: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(1) > thead > tr > th.e-timeline-top-header-cell > div') as HTMLElement;
        expect(element.textContent).toBe("Q1");
    });

    it('Zooming action with Top tier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.format = '';
        ganttObj.timelineSettings.topTier.format = 'M';
        ganttObj.dataBound = () => {
            ganttObj.zoomIn();
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.timelineUnitSize).toBe(66);
            expect(ganttObj.currentZoomingLevel.level).toBe(12);
            done();
        }
        ganttObj.refresh();
    });

    it('Zooming action with Bottom tier only', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.timelineSettings.bottomTier.format = 'M';
        ganttObj.timelineSettings.topTier.format = '';
        ganttObj.dataBound = () => {
            ganttObj.zoomIn();
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Week");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("None");
            expect(ganttObj.timelineModule.customTimelineSettings.timelineUnitSize).toBe(33);
            expect(ganttObj.currentZoomingLevel.level).toBe(8);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Minute in both mode', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.timelineSettings.bottomTier.count = 1000;
        // setTimeout(done, 1000);
        ganttObj.dataBound = () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(1);
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.format).toBe("m");
            expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.format).toBe("m");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("1/28/2018");
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            expect(ganttObj.element.querySelector("." + cls.timelineHeaderContainer).childElementCount).toBe(2);
            done();
        }
        // setTimeout(() => {
        ganttObj.refresh();
        //     done(); 
        // }, 1000); 
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('check zoomout button with last zoomout level', (done: Function) => {
        ganttObj.projectEndDate = new Date('03/24/2028');
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.topTier.count = 5;
        ganttObj.timelineSettings.bottomTier.count = 10;
        ganttObj.timelineSettings.bottomTier.unit = "Year";
        ganttObj.timelineSettings.bottomTier.format = 'yyyy';
        ganttObj.timelineSettings.topTier.format = 'yyyy';
        ganttObj.dataBound = function () {
            ganttObj.zoomOut();
            expect(ganttObj.currentZoomingLevel.level).toBe(0);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('check zoomin button with last zoomin level', (done: Function) => {
        ganttObj.projectEndDate = new Date('02/24/2018');
        ganttObj.timelineSettings.topTier.unit = "Hour";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 15;
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.dataBound = function () {
            ganttObj.zoomIn();
            expect(ganttObj.currentZoomingLevel.level).toBe(24);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('check zooming level collections length', (done: Function) => {
        ganttObj.projectEndDate = new Date('02/24/2018');
        ganttObj.timelineSettings.topTier.unit = "Hour";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 15;
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.dataBound = function () {
            ganttObj.zoomingLevels = [];
            ganttObj.zoomIn();
            expect(ganttObj.currentZoomingLevel.level).toBe(24);
            expect(ganttObj.zoomingLevels.length).toBeGreaterThanOrEqual(0);
            done();
        }
        ganttObj.refresh();
    });

    it('zoomtofit action when Gantt chart width is zero', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.timelineSettings.bottomTier.unit = "Year";
        ganttObj.splitterSettings.position = '100%';
        ganttObj.dataBound = function () {
            ganttObj.fitToProject();
            expect(ganttObj.currentZoomingLevel.level).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('check zooming level collections length', (done: Function) => {
        ganttObj.projectEndDate = new Date('02/24/2018');
        ganttObj.timelineSettings.topTier.unit = "Hour";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 15;
        ganttObj.timelineSettings.bottomTier.unit = "Minutes";
        ganttObj.dataBound = function () {
            ganttObj.zoomingLevels = [];
            ganttObj.zoomIn();
            expect(ganttObj.currentZoomingLevel.level).toBe(24);
            expect(ganttObj.zoomingLevels.length).toBeGreaterThanOrEqual(0);
            done();
        }
        ganttObj.refresh();
    });

    it('zoomtofit action when Gantt chart width is zero', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.timelineSettings.bottomTier.unit = "Year";
        ganttObj.splitterSettings.position = '100%';
        ganttObj.dataBound = function () {
            ganttObj.fitToProject();
            expect(ganttObj.currentZoomingLevel.level).toBe(2);
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            enableTimelineVirtualization: true,
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('check zooming actions with custom zooming levels', (done: Function) => {
        ganttObj.zoomingLevels = [{
            topTier: { unit: 'Day', format: 'ddd MMM d', count: 1 },
            bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 99, level: 0,
            timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
        },
        {
            topTier: { unit: 'Hour', format: 'ddd MMM d, h a', count: 1 },
            bottomTier: { unit: 'Minutes', format: 'mm', count: 30 }, timelineUnitSize: 66, level: 1,
            timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
        }]
        setTimeout(() => {
            ganttObj.zoomIn();
            expect(ganttObj.currentZoomingLevel.level).toBe(1);
            expect(ganttObj.currentZoomingLevel.bottomTier.unit).toBe('Minutes');
            done();
            ganttObj.zoomingLevels = ganttObj.getZoomingLevels();
            ganttObj.refresh();
        }, 200); 
       
    });

    it('check zooming actions with custom zooming levels', (done: Function) => {
        ganttObj.timelineSettings.topTier.unit = "Month";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.timelineSettings.bottomTier.unit = "Week";
        ganttObj.dataBound = function () {
            ganttObj.zoomingLevels = [{
                topTier: { unit: 'Day', format: 'ddd MMM d', count: 1 },
                bottomTier: { unit: 'Hour', format: 'hh a', count: 12 }, timelineUnitSize: 99, level: 0,
                timelineViewMode: 'Day', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            },
            {
                topTier: { unit: 'Hour', format: 'ddd MMM d, h a', count: 1 },
                bottomTier: { unit: 'Minutes', format: 'mm', count: 30 }, timelineUnitSize: 66, level: 1,
                timelineViewMode: 'Hour', weekStartDay: 0, updateTimescaleView: true, weekendBackground: null, showTooltip: true
            }];
            setTimeout(() => {
                ganttObj.zoomIn();
                expect(ganttObj.currentZoomingLevel.level).toBe(1);
                expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe("Minutes");
                done();
            }, 200);           
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
// disconnect issue in CI 
    it('check the current zooming level when the bottom tire count in between the zooming levels', (done: Function) => {
        ganttObj.zoomingLevels = ganttObj.getZoomingLevels();
        ganttObj.timelineSettings.topTier.unit = "Year";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 4;
        ganttObj.timelineSettings.bottomTier.unit = "Month";
        ganttObj.dataBound = function () {
            setTimeout(() => {
                ganttObj.zoomOut();
                expect(ganttObj.currentZoomingLevel.level).toBe(6);
                done();
            }, 200);
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });

    // disconnect issue occurs in CI has been resolved
    it('Zoom to fit when perDay width below the last zoomin level width', (done: Function) => {
        ganttObj.dataSource = zoomData;
        ganttObj.splitterSettings.position = '0%';
        ganttObj.dataBound = () => {
            let zoomToFit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_zoomtofit') as HTMLElement;
            triggerMouseEvent(zoomToFit, 'click');
            setTimeout(() => { // Add a timeout to give Gantt operations time to complete
                expect(ganttObj.currentZoomingLevel.level).toBe(24);
                done();
            }, 1000);
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    it('Checking bottom tier weekStartDay after zooming action', () => {
        ganttObj.timelineSettings.weekStartDay = 1;
        ganttObj.zoomIn();
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === "ZoomIn") {
                expect(ganttObj.timelineSettings.weekStartDay).toBe(1);
            }
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
// disconnect issue occurs in CI has been resolved -increase 0.75% coverage
    it('Zoom to fit when perDay width exceed the last zoomout level width', (done: Function) => {
        ganttObj.dataSource = zoomData1;
        ganttObj.splitterSettings.position = '99%';
        ganttObj.dataBound = () => {
            ganttObj.fitToProject();
            expect(ganttObj.currentZoomingLevel.level).toBe(0);
            ganttObj.zoomingLevels[3].bottomTier.count = 13;
            ganttObj.zoomIn();
            setTimeout(() => {
                done();
            }, 1000); // Added delay to ensure all operations complete
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    // doesn't used to improve the coverage
    it('To check disable state of zoomin icon when mismatching the count value', (done: Function) => {
        ganttObj.dataSource = defaultGanttData;
        ganttObj.splitterSettings.position = '50%';
        ganttObj.dataBound = () => {
            ganttObj.zoomingLevels[1].bottomTier.count = 14;
            ganttObj.zoomIn();
            expect(ganttObj.currentZoomingLevel.level).toBe(12);
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("3/24/2018");
            ganttObj.fitToProject();
            done();
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '100%'
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            projectStartDate: new Date('01/28/2018'),
            projectEndDate: new Date('03/24/2018'),
        }, done);
    });
    // disconnect issue occurs in CI has been resolved - doesn't improve coverage
    it('Aria-label testing', (done: Function) => {
        ganttObj.projectStartDate = "01/28/2018";
        ganttObj.projectEndDate = "03/24/2018";
        ganttObj.timelineSettings.timelineViewMode = "Week";
        ganttObj.timelineSettings.topTier.unit = "None";
        ganttObj.timelineSettings.bottomTier.unit = "None";
        ganttObj.timelineSettings.topTier.count = 1;
        ganttObj.timelineSettings.bottomTier.count = 1;
        ganttObj.timelineSettings.topTier.formatter = null;
        ganttObj.dataBound = () => {
            setTimeout(() => { // Add a timeout to give Gantt operations time to complete
                // expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(1) > thead > tr > th').getAttribute('aria-label').indexOf('Timeline cell 1/27/2018') > -1).toBeTruthy();
                // expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttChart > div.e-timeline-header-container > table:nth-child(2) > thead > tr > th:nth-child(3)').getAttribute('aria-label').indexOf('Timeline cell 1/29/2018') > -1).toBeTruthy();
                done();
        }, 1000);
        }
        ganttObj.refresh();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Project End Date', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: defaultGanttData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                },
                splitterSettings: {
                    position: '30%'
                },
                toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
                projectStartDate: new Date('01/28/2018'),
                projectEndDate: new Date('02/07/2018')
            }, done);
    });
    it('Render project end date as in sample', () => {
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("2/7/2018");
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Render top Tier alone in Zoom to fit', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: zoomingData1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                dataBound(): void {
                    ganttObj.zoomingLevels = customZoomingLevels;
                },
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/06/2019')
            }, done);
    });
    it('perform zoomToFit', () => {
        ganttObj.actionBegin = (args) => {
            let a = extend([], [], customZoomingLevels, true);
            if ((args.requestType == 'beforeZoomToProject')) {
                ganttObj.timelineModule.customTimelineSettings = a[0];
                ganttObj.timelineModule.customTimelineSettings.bottomTier.unit = 'None';
            }
        }
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'AfterZoomToProject') {
                expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('None');
            }
        }
        ganttObj.dataBind();
        ganttObj.fitToProject();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Check Zooming levels API', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: defaultGanttData,
                zoomingLevels: customZoomingLevels1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                },
                splitterSettings: {
                    position: '30%'
                },
                toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
                projectStartDate: new Date('01/28/2018'),
                projectEndDate: new Date('02/07/2018')
            }, done);
    });
    it('Zooming levels API', () => {
        expect(ganttObj.zoomingLevels.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Check timeline dates', () => {
    let ganttObj: Gantt;
    let data = [{ TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('03/25/2019'), Duration: 1 }]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },

                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Check timeline start date after right resize', () => {
        ganttObj.actionComplete = (args) => {
            if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe("3/24/2019");
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 60, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Zoming in Manual TaskMode', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: manualData,
                height: '450px',
                highlightWeekends: true,
                allowSelection: true,
                taskMode: 'Manual',
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                columns: [
                    { field: 'taskID', width: 60, allowEditing: true, editType: 'stringedit' },
                    { field: 'taskName', width: 250 },
                    { field: 'startDate' },
                    { field: 'endDate' },
                    { field: 'duration' },
                    { field: 'predecessor' },
                    { field: 'progress' },
                ],

                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Search',
                    'ZoomIn',
                    'ZoomOut',
                    'ZoomToFit',
                    'PrevTimeSpan',
                    'NextTimeSpan',
                    'ExcelExport',
                    'CsvExport',
                    'PdfExport',
                ],
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: '50%',
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: true,
                },
                tooltipSettings: {
                    showTooltip: true,
                },
                filterSettings: {
                    type: 'Menu',
                },
                allowFiltering: true,
                gridLines: 'Both',
                showColumnMenu: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                eventMarkers: [
                    {
                        day: '02/22/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off',
                    },
                ],
                holidays: [
                    {
                        from: '02/27/2019',
                        to: '02/28/2019',
                        label: ' Public holidays',
                        cssClass: 'e-custom-holiday',
                    },
                    {
                        from: '01/30/2019',
                        to: '01/30/2019',
                        label: ' Public holiday',
                        cssClass: 'e-custom-holiday',
                    },
                ],
                searchSettings: { fields: ['taskName', 'duration'] },
                labelSettings: {
                    leftLabel: 'taskID',
                    rightLabel: 'Task Name: ${taskData.taskName}',
                    taskLabel: '${progress}%',
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/28/2019'),
                projectEndDate: new Date('03/10/2019'),

            }, done);
    });
    it('Percentage renders wrong in parent taskbar', () => {
        ganttObj.actionComplete = (args) => {
            expect(ganttObj.currentViewData[0].ganttProperties.autoWidth).toBe(396);
        }
        ganttObj.dataBind();
        ganttObj.zoomIn();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Fit to project issue', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: tempData1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                allowUnscheduledTasks: true,
                treeColumnIndex: 0,
                splitterSettings: {
                    columnIndex: 2
                },
                created: () => {
                    if (ganttObj) {
                        ganttObj.fitToProject();
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress',

                },
            }, done);
    });
    it('check fit to project works properly', () => {
        ganttObj.dataSource = [];
        ganttObj.dataSource = tempData2;
        ganttObj.fitToProject();
        ganttObj.dataBind();
        expect(ganttObj.getFormatedDate(ganttObj.cloneProjectStartDate, 'MM/dd/yyyy')).toEqual('04/02/2013');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});

describe('Bug-833033-Cannot see a Dragged Task after Zoom In', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: zoomInData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                },
                splitterSettings: {
                    position: '30%'
                },
                toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
            }, done);
    });
    it('Check project end date rendered in sample after ZoomIn action', () => {
        ganttObj.zoomIn();
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === "ZoomIn") {
                expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineRoundOffEndDate, 'M/d/yyyy')).toBe("6/24/2023");
            }
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Fit to project display wrong timeline', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: tempData3,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                allowUnscheduledTasks: true,
                treeColumnIndex: 0,
                splitterSettings: {
                    columnIndex: 2
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress',

                },

            }, done);
    });
    it('check timeline renders properly', () => {
        ganttObj.fitToProject();
        ganttObj.dataSource = [];
        ganttObj.dataSource = tempData4;
        ganttObj.fitToProject();
        ganttObj.dataBind();
        expect(ganttObj.getFormatedDate(ganttObj.cloneProjectEndDate, 'MM/dd/yyyy')).toEqual('04/19/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});
describe('Bug-841056:console error occurs while using segment data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: tempData5,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                progress: 'Progress',
                endDate: 'EndDate',
                segments: 'Segments'
            },
            dateFormat: "yyyy-MM-dd",
            splitterSettings: {
                columnIndex: 3
            },
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('Checking 1st segments startdate and enddate', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[0].startDate, 'MM/dd/yyyy HH:mm')).toEqual('04/02/2019 08:00');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[0].endDate, 'MM/dd/yyyy HH:mm')).toEqual('04/16/2019 17:00');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[1].endDate, 'MM/dd/yyyy HH:mm')).toEqual('04/25/2019 17:00');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Bug:839954-Vertical scroll and taskbar is not fully visible in yearly mode', () => {
    let ganttObj: Gantt;
    let tempData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: tempData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                },
                splitterSettings: {
                    columnIndex: 2
                },
                timelineSettings: {
                    topTier: {
                        format: 'yyyy',
                        unit: 'Year',
                    },
                    bottomTier: {
                        format: 'MMM `yy',
                        unit: 'None',
                        count: 1,
                    },
                },
            }, done);
    });
    it('Checking scrollbar height in singletier mode', () => {
        expect(ganttObj.element.getElementsByClassName('e-chart-scroll-container e-content')[0]['style'].height).toBe('calc(100% - 46px)');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Bug-841056:console error occurs while using segment data', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: tempData6,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                progress: 'Progress',
                endDate: 'EndDate',
                segments: 'Segments'
            },
            dateFormat: "yyyy-MM-dd",
            splitterSettings: {
                columnIndex: 3
            },
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('Checking 1st segments startdate and enddate', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[0].startDate, 'MM/dd/yyyy HH:mm')).toEqual('04/02/2019 08:00');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[0].endDate, 'MM/dd/yyyy HH:mm')).toEqual('04/16/2019 17:00');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[1].endDate, 'MM/dd/yyyy HH:mm')).toEqual('04/25/2019 17:00');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-855831:Timeline render in advance the project start date while resizing taskbar', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        { TaskID: 1, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 10 },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowSelection: true,
            allowRowDragAndDrop: true,
            gridLines: "Both",
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            allowResizing: true,
            readOnly: false,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('04/05/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Taskbar Right resizing', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown');
        triggerMouseEvent(dragElement, 'mousemove', -20, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe('04/05/2019');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/02/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('870027: Zooming action', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: editingData18,
            allowSorting: true,
            allowReordering: true,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
                notes: 'info',
                resourceInfo: 'resources',
            },
            renderBaseline: true,
            baselineColor: 'red',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', width: 80 },
                {
                    field: 'TaskName',
                    headerText: 'Job Name',
                    width: '250',
                    clipMode: 'EllipsisWithTooltip',
                },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            dateFormat: "MMM dd, y",

            allowSelection: true,
            selectedRowIndex: 1,
            splitterSettings: {
                position: "35%",
            },

            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Month',
                    format: 'MMM',
                },
                bottomTier: {
                    unit: 'Day',
                    format: 'd',
                    count: 1,
                },
            },
            searchSettings: {
                fields: ['TaskName', 'Duration']
            },
            allowResizing: true,
            readOnly: false,
            resources: editingResources1,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
            },
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('01/01/2019'),
            projectEndDate: new Date('01/01/2022'),
        }, done);
    });

    it('perform ZoomTofit and zoomout', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType === "ZoomOut") {
                expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe('1/1/2019');
            }
        }
        ganttObj.fitToProject();
        ganttObj.zoomOut();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-871590: top and bottom tier shows null when using custom zooming levels ', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData23,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                notes: 'info',
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExpandAll', 'CollapseAll'],
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('07/06/2019'),
            labelSettings: {
                leftLabel: 'TaskName'
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            splitterSettings: {
                position: "35%"
            },
        }, done);
    });
    it('top and bottom tier shows null when using custom zooming levels ', () => {
        ganttObj.zoomingLevels = [
            {
                topTier: {
                    unit: 'Year',
                    format: 'yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Month',
                    count: 3,
                },
                timelineUnitSize: 99,
                level: 0,
                timelineViewMode: 'Year',
            },
            {
                topTier: {
                    unit: 'Year',
                    format: 'yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Month',
                    format: 'MMM yyyy',
                    count: 1
                }, timelineUnitSize: 99,
                level: 1,
                timelineViewMode: 'Year',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd',
                    count: 1,
                }, timelineUnitSize: 33,
                level: 2,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd MMM',
                    count: 1,
                }, timelineUnitSize: 66,
                level: 3,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd MMM',
                    count: 1,
                }, timelineUnitSize: 99,
                level: 4,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Day',
                    format: 'd',
                    count: 1,
                }, timelineUnitSize: 33,
                level: 5,
                timelineViewMode: 'Week',
            },
        ];
        ganttObj.zoomIn();
        expect(ganttObj.currentZoomingLevel.level).toBe(5);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('dependency rendering in RTL', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: timelineData,
                enableTimelineVirtualization: true,
                taskFields: {
                    id: 'id',
                    name: 'title',
                    startDate: 'startDate',
                    endDate: 'finishDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                },
                taskType: 'FixedWork',
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
               enableRtl: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
            }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency object', () => {
        expect(ganttObj.timelineModule.wholeTimelineWidth).toBe(1155);
    });
});
describe('timeline virtualization for shimmer ', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData23,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                notes: 'info',
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'ExpandAll', 'CollapseAll'],
            projectStartDate: new Date('03/24/2019'),
            projectEndDate: new Date('07/06/2019'),
            labelSettings: {
                leftLabel: 'TaskName'
            },
            loadingIndicator: {
                indicatorType: 'Shimmer'
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', width: 250 },
                { field: 'StartDate' },
                { field: 'EndDate' },
                { field: 'Duration' },
                { field: 'Predecessor' },
                { field: 'Progress' },
            ],
            splitterSettings: {
                position: "35%"
            },
            enableTimelineVirtualization: true,
        }, done);
    });
    it('top and bottom tier shows null when using custom zooming levels ', () => {
        ganttObj.zoomingLevels = [
            {
                topTier: {
                    unit: 'Year',
                    format: 'yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Month',
                    count: 3,
                },
                timelineUnitSize: 99,
                level: 0,
                timelineViewMode: 'Year',
            },
            {
                topTier: {
                    unit: 'Year',
                    format: 'yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Month',
                    format: 'MMM yyyy',
                    count: 1
                }, timelineUnitSize: 99,
                level: 1,
                timelineViewMode: 'Year',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd',
                    count: 1,
                }, timelineUnitSize: 33,
                level: 2,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd MMM',
                    count: 1,
                }, timelineUnitSize: 66,
                level: 3,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Month',
                    format: 'MMM, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Week',
                    format: 'dd MMM',
                    count: 1,
                }, timelineUnitSize: 99,
                level: 4,
                timelineViewMode: 'Month',
            },
            {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, yyyy',
                    count: 1,
                },
                bottomTier: {
                    unit: 'Day',
                    format: 'd',
                    count: 1,
                }, timelineUnitSize: 33,
                level: 5,
                timelineViewMode: 'Week',
            },
        ];
        ganttObj.zoomIn();
        expect(ganttObj.currentZoomingLevel.level).toBe(5);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('select row in different timeline segment', () => {
    Gantt.Inject(Selection, Sort, Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    let resource: Object[] = [{
        TaskID: 10, TaskName: 'Sign contract', StartDate: new Date('04/01/2024'), Duration: 1,
        Progress: 30, resources: [12], work: 24
    }];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resource,
                enableTimelineVirtualization: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    work: 'work',
                    type: 'taskType',
                },
                taskType: 'FixedWork',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit'
                },
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' }
                ],
                undoRedoActions: ['ZoomToFit'],
                loadingIndicator: {
                    indicatorType: 'Shimmer'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('select row in different timeline segment', () => {
        ganttObj.selectRow(0);
    });
});
describe('Timeline coverage for timezone issue height auto', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                enableTimelineVirtualization:true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: 'auto',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Check for flat data', () => {
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Timeline coverage for timezone issue setting previous minute timeline', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Minutes',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('03/26/2019'),
            }, done);
    });
    it('Check for flat data', () => {
        ganttObj.previousTimeSpan()
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Timeline coverage for timezone issue setting next minute timeline', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Minutes',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('03/26/2019'),
            }, done);
    });
    it('Check for flat data', () => {
        ganttObj.nextTimeSpan()
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Timeline coverage for timezone issue setting next minute timeline', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Year',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('04/26/2019'),
            }, done);
    });
    it('Check for flat data', () => {
        ganttObj.nextTimeSpan()
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Timeline coverage for timezone issue setting next minute timeline', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                timelineTemplate:"#TimelineTemplates",
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('04/26/2019'),
            }, done);
    });
    it('Check for flat data', () => {
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Timeline coverage for timezone issue setting Hour timeline', () => {
    Gantt.Inject(Selection,Sort,Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    bottomTier: {
                        unit: 'Hour',
                        count: 2
                    }
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                holidays: [{
                    from: "04/04/2019",
                    to: "04/05/2019",
                    label: " Public holidays",
                    cssClass: "e-custom-holiday"
                },
                {
                    from: "04/12/2019",
                    to: "04/12/2019",
                    label: " Public holiday",
                    cssClass: "e-custom-holiday"
                }],
                dayWorkingTime: [{ from: 0, to: 24 }],
                searchSettings: {
                    fields: ['TaskName', 'Duration']
                },
                labelSettings: {
                    leftLabel: 'TaskID',
                    rightLabel: 'Task Name: ${taskData.TaskName}',
                    taskLabel: '${Progress}%'
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                timelineTemplate:"#TimelineTemplates",
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019 05:00:00'),
                projectEndDate: new Date('04/26/2019 05:00:00'),
            }, done);
    });
    it('Check for flat data', () => {
        expect(ganttObj.flatData.length).toBe(8);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('dependency rendering in RTL', () => {
    Gantt.Inject(Selection, Sort, Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: timelineData,
                enableTimelineVirtualization: true,
                taskFields: {
                    id: 'id',
                    name: 'title',
                    startDate: 'startDate',
                    endDate: 'finishDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                },
                taskType: 'FixedWork',
                allowSorting: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan', 'Undo', 'Redo'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                enableRtl: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
            }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency object', () => {
        expect(ganttObj.timelineModule.wholeTimelineWidth).toBe(1155);
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '30%'
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            enableTimelineVirtualization: true,
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
        }, done);
    });
    it('Performing taskbar nextspan action for code coverage', () => {
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 480, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement1, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement1, 'mousemove', dragElement.offsetLeft + 880, 0);
        triggerMouseEvent(dragElement1, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '30%'
            },
            timelineSettings: {
                topTier: {
                    unit: 'Year',
                },
                bottomTier: {
                    unit: 'Month',
                    count: 15
                }
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
        }, done);
    });
    it('Code coverage with bottom tier Month, count', () => {
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(12);
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('Month');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '30%'
            },
            timelineSettings: {
                topTier: {
                    unit: 'Year',
                },
                bottomTier: {
                    unit: 'Week',
                    count: 55
                }
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
        }, done);
    });
    it('Code coverage with bottom tier Week, count', () => {
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(48);
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('Week');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '30%'
            },
            timelineSettings: {
                topTier: {
                    unit: 'Year',
                },
                bottomTier: {
                    unit: 'Day',
                    count: 350
                }
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
        }, done);
    });
    it('Code coverage with bottom tier Day, count', () => {
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(336);
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('Day');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt base module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: defaultGanttData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'Children',
            },
            splitterSettings: {
                position: '30%'
            },
            timelineSettings: {
                topTier: {
                    unit: 'Year',
                },
                bottomTier: {
                    unit: 'Hour',
                    count: 8066
                }
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
        }, done);
    });
    it('Code coverage with bottom tier Hour, count', () => {
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.count).toBe(8064);
        expect(ganttObj.timelineModule.customTimelineSettings.bottomTier.unit).toBe('Hour');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:905728-Timeline is moving back after editing unscheduled tasks sample', () => {
    Gantt.Inject(Selection, Sort, Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: MT905728,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                {field: 'TaskId', width: 75 },
                {field: 'TaskName', width: 80 },
                {field: 'StartDate', width: 120},
                {field: 'EndDate', width: 120 },
                {field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            allowSelection: true,
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            allowResizing: true,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Declare Enddate as null', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = null;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe("03/25/2019")
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Blank space in timeline', () => {
    Gantt.Inject(Selection, Sort, Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: MT905728,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                {field: 'TaskId', width: 75 },
                {field: 'TaskName', width: 80 },
                {field: 'StartDate', width: 120},
                {field: 'EndDate', width: 120 },
                {field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            allowSelection: true,
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                }
            },
            allowResizing: true,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Change tier', () => {
        expect(ganttObj.element.classList.contains('e-gantt-single-timeline')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Blank space in timeline', () => {
    Gantt.Inject(Selection, Sort, Filter, Edit, Toolbar, RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: MT905728,
            enableContextMenu: true,
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                {field: 'TaskId', width: 75 },
                {field: 'TaskName', width: 80 },
                {field: 'StartDate', width: 120},
                {field: 'EndDate', width: 120 },
                {field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            allowSelection: true,
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                }
            },
            allowResizing: true,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Change tier', () => {
        ganttObj.timelineModule.isZoomToFit = true;
        ganttObj.timelineModule['initProperties']();
        expect(ganttObj.element.classList.contains('e-gantt-single-timeline')).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('code to coverage previousTimeSpan method', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: MT905728,
            enableContextMenu: true,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
            taskFields: {
                id: 'TaskId',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                {field: 'TaskId', width: 75 },
                {field: 'TaskName', width: 80 },
                {field: 'StartDate', width: 120},
                {field: 'EndDate', width: 120 },
                {field: 'Duration', width: 90 }
            ],
            splitterSettings: {
                columnIndex: 4
            },
            allowSelection: true,
            allowFiltering: true,
            gridLines: "Both",
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                }
            },
            allowResizing: true,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('code to coverage previousTimeSpan method', () => {
        ganttObj.previousTimeSpan('Week');
        expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'MM/dd/yyyy')).toBe('03/24/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});