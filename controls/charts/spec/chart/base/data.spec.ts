
/**
 * Data for chart
 */
import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ChartLocation } from '../../../src/common/utils/helper';

export function unbindResizeEvents(chart: Chart): boolean {
    if (Browser.isTouch && chart.isOrientation()) {
        EventHandler.remove(<HTMLElement & Window>window, 'orientationchange', chart.chartResize);
    } else {
        EventHandler.remove(<HTMLElement & Window>window, 'resize', chart.chartResize);
    }
    return false;
}
export function getDistance(start: ChartLocation, end: ChartLocation): number {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}
export interface DataValue {
    x: number | Date | string;
    y: number;
}

export let piedata: Object[] = [
    { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18', radius: '50%' }, { y: 23, x: 2, name: 'Bison', text: 'Bison : 23', radius: '60%' },
    { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30', radius: '70%' }, { y: 44, x: 4, name: 'Elk', text: 'Elk : 44', radius: '100%' },
    { y: 52, x: 5, name: 'Pronghorn', text: 'Pronghorn : 52', radius: '80%' }, { y: 62, x: 6, name: 'Turkey', text: 'Turkey : 62', radius: '80%' },
    { y: 74, x: 7, name: 'Alligator', text: 'Alligator : 74', radius: '80%' }, { y: 85, x: 8, name: 'Prairie Dog', text: 'Prairie Dog : 85', radius: '80%' },
    { y: 96, x: 9, name: 'Mountain Lion', text: 'Mountain Lion : 96', radius: '80%' }, { y: 102, x: 10, name: 'Beaver', text: 'Beaver : 102', radius: '80%' }
];
export let pieColorMapping: Object[] = [
    { y: 18, x: 1, name: 'Bald Eagle', text: 'Bald Eagle : 18', color:'red' },
    { y: 23, x: 2, name: 'Bison', text: 'Bison : 23', color:'green'  },
    { y: 30, x: 3, name: 'Brown Bear', text: 'Brown Bear : 30', color:'blue' }
];
export let stackedBarData: Object[] = [{ x: 'GBR', y: 17, y1: 13, y2: 7 }, { x: 'CHN', y: 16, y1: 20, y2: 11 }, { x: 'AUS', y: 8, y1: 11, y2: 10 }, 
    { x: 'RUS', y: 14, y1: 6, y2: 20 }, { x: 'GER', y: 17, y1: 10, y2: 15 }, { x: 'UA', y: 2, y1: 5, y2: 24 }, { x: 'ES', y: 7, y1: 4, y2: 6 }, 
    { x: 'UZB', y: 4, y1: 2, y2: 7 }, { x: 'JPN', y: 12, y1: 8, y2: 8 }, { x: 'NL', y: 8, y1: 7, y2: 4 }, { x: 'USA', y: 26, y1: 10, y2: 8 }];
export let data: Object[] = [
    {
        OrderCount: 18, EmployeeID: 1, Freight: 12, Verified: !0
    },
    {
        OrderCount: 29, EmployeeID: 2, Freight: 37, Verified: !1
    },
    {
        OrderCount: 30, EmployeeID: 3, Freight: 71, Verified: !0
    },
    {
        OrderCount: 41, EmployeeID: 4, Freight: 43, Verified: !0
    },
    {
        OrderCount: 52, EmployeeID: 5, Freight: 46, Verified: !0
    },
    {
        OrderCount: 62, EmployeeID: 6, Freight: 74, Verified: !0
    },
    {
        OrderCount: 74, EmployeeID: 7, Freight: 81, Verified: !1
    },
    {
        OrderCount: 85, EmployeeID: 8, Freight: 68, Verified: !0
    },
    {
        OrderCount: 96, EmployeeID: 9, Freight: 43, Verified: !1
    },
    {
        OrderCount: 102, EmployeeID: 10, Freight: 41, Verified: !0
    },
    {
        OrderCount: 118, EmployeeID: 11, Freight: 92, Verified: !0
    },
    {
        OrderCount: 119, EmployeeID: 12, Freight: 73, Verified: !1
    },
    {
        OrderCount: 120, EmployeeID: 13, Freight: 85, Verified: !0
    },
    {
        OrderCount: 125, EmployeeID: 14, Freight: 94, Verified: !1
    },
    {
        OrderCount: 128, EmployeeID: 15, Freight: 78, Verified: !0
    }];
export let indexedCategoryData: DataValue[] = [{ x: 'Monday', y: 50 }, { x: 'Tuesday', y: 40 },
    { x: 'Wednesday', y: 70 },
    { x: 'Thursday', y: 60 }, { x: 'Friday', y: 50 },
    { x: 'Monday', y: 40 }, { x: 'Monday', y: 30 }];
export let bar: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
export let barData: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];
export let track1: DataValue[] = [{ x: 'Jan', y: -1 }, { x: 'Feb', y: -1 }, { x: 'Mar', y: 2 }, { x: 'Apr', y: 8 },
{ x: 'May', y: 13 }, { x: 'Jun', y: 18 }, { x: 'Jul', y: 21 }, { x: 'Aug', y: 20 },
{ x: 'Sep', y: 16 }, { x: 'Oct', y: 10 }, { x: 'Nov', y: 4 }, { x: 'Dec', y: 0 }];
export let track2: DataValue[] = [{ x: 'Jan', y: 3 }, { x: 'Feb', y: 3.5 }, { x: 'Mar', y: 7 }, { x: 'Apr', y: 13.5 },
{ x: 'May', y: 19 }, { x: 'Jun', y: 23.5 }, { x: 'Jul', y: 26 }, { x: 'Aug', y: 25 },
{ x: 'Sep', y: 21 }, { x: 'Oct', y: 15 }, { x: 'Nov', y: 9 }, { x: 'Dec', y: 3.5 }];
export let track3: DataValue[] = [{ x: 'Jan', y: 7 }, { x: 'Feb', y: 8 }, { x: 'Mar', y: 12 }, { x: 'Apr', y: 19 },
{ x: 'May', y: 25 }, { x: 'Jun', y: 29 }, { x: 'Jul', y: 31 }, { x: 'Aug', y: 30 },
{ x: 'Sep', y: 26 }, { x: 'Oct', y: 20 }, { x: 'Nov', y: 14 }, { x: 'Dec', y: 8 }];
export let track4: DataValue[] = [{ x: 'Jan', y: 9 }, { x: 'Feb', y: 10 }, { x: 'Mar', y: 14 }, { x: 'Apr', y:21 },
{ x: 'May', y: 27 }, { x: 'Jun', y: 31 }, { x: 'Jul', y: 33 }, { x: 'Aug', y: 32 },
{ x: 'Sep', y: 28 }, { x: 'Oct', y: 22 }, { x: 'Nov', y: 16 }, { x: 'Dec', y: 10 }];

export let tooltipData1: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
export let tooltipData2: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];
export let tool1: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
export let tool2: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];

export let datetimeData: DataValue[] = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
{ x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
{ x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];
export let tooltipData21: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
export let tooltipData22: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];

export let datetimeData21: DataValue[] = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
{ x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
{ x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];
export let tooltipData11: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: 50 }, { x: 6000, y: 40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];
export let tooltipData12: DataValue[] = [{ x: 1000, y: 73 }, { x: 2000, y: 40 },
{ x: 3000, y: 75 }, { x: 4000, y: 30 },
{ x: 5000, y: 56 }, { x: 6000, y: 60 },
{ x: 7000, y: 41 }, { x: 8000, y: 45 }];

export let datetimeData11: DataValue[] = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
{ x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
{ x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];
export let datetimeData1: DataValue[] = [{ x: new Date(2000, 3, 21), y: 10 }, { x: new Date(2000, 3, 17), y: 10 },
{ x: new Date(2000, 3, 18), y: 14 }, { x: new Date(2000, 3, 20), y: 45 },
{ x: new Date(2000, 3, 25), y: 67 }, { x: new Date(2000, 3, 30), y: 75 }];

export let categoryData: DataValue[] = [{ x: 'USA', y: 50 }, { x: 'China', y: 40 },
{ x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
{ x: 'France', y: 50 }, { x: 'Germany', y: null },
{ x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }];

export let categoryData1: DataValue[] = [{ x: 'USA', y: 70 }, { x: 'China', y: 60 },
{ x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
{ x: 'France1', y: 45 }, { x: 'Germany1', y: 30 },
{ x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 }];


export let definition1: DataValue[] = [
    { x: 10, y: 124 },
    { x: 20, y: 120 },
    { x: 30, y: 115 },
    { x: 40, y: 147 },
    { x: 50, y: 122 }
];
export let definition2: DataValue[] = [
    { x: 10, y: 24 },
    { x: 20, y: 20 },
    { x: 30, y: 55 },
    { x: 40, y: 47 },
    { x: 50, y: 72 }
];
export let definition3: DataValue[] = [
    { x: 10, y: 30 },
    { x: 20, y: 40 },
    { x: 30, y: 20 },
    { x: 40, y: 15 },
    { x: 50, y: 45 }
];
export let definition4: DataValue[] = [
    { x: 10, y: 24 },
    { x: 20, y: 20 },
    { x: 30, y: 15 },
    { x: 40, y: 47 },
    { x: 50, y: 22 }
];
export let definition5: DataValue[] = [
    { x: 10, y: 64 },
    { x: 20, y: 70 },
    { x: 30, y: 95 },
    { x: 40, y: 97 },
    { x: 50, y: 52 }
];
export let definition6: DataValue[] = [
    { x: 10, y: 24 },
    { x: 20, y: 20 },
    { x: 30, y: 55 },
    { x: 40, y: 87 },
    { x: 50, y: 72 }
];

export let seriesData1: DataValue[] = [
    { y: 18, x: 1 }, { y: 29, x: 2 }, { y: 30, x: 3 }, { y: 41, x: 4 },
    { y: 52, x: 5 }, { y: 62, x: 6 },
    { y: 74, x: 7 }, { y: 85, x: 8 }, { y: 96, x: 9 }, { y: 102, x: 10 }
];
export let seriesData2: DataValue[] = [
    { x: 1, y: 2 }, { x: 2, y: 7 }, { x: 3, y: 11 }, { x: 4, y: 13 },
    { x: 5, y: 16 }, { x: 6, y: 19 },
    { x: 7, y: 22 }, { x: 8, y: 28 }, { x: 9, y: 33 }, { x: 10, y: 41 }
];
export let negativeDataPoint: DataValue[] = [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
{ x: 3000, y: 70 }, { x: 4000, y: 60 },
{ x: 5000, y: -50 }, { x: 6000, y: -40 },
{ x: 7000, y: 40 }, { x: 8000, y: 70 }];


export let firstSeries: DataValue[] = [{ x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 },
{ x: 2009, y: 32 }, { x: 2010, y: 35 }, { x: 2011, y: 30 }];

export let secondSeries: DataValue[] = [{ x: 2005, y: 31 }, { x: 2006, y: 28 }, { x: 2007, y: 30 }, { x: 2008, y: 36 },
{ x: 2009, y: 36 }, { x: 2010, y: 39 }, { x: 2011, y: 37 }];

export let thirdSeries: DataValue[] = [{ x: 2005, y: 36 }, { x: 2006, y: 32 }, { x: 2007, y: 34 }, { x: 2008, y: 41 },
{ x: 2009, y: 42 }, { x: 2010, y: 42 }, { x: 2011, y: 43 }];

export let fourthSeries: DataValue[] = [{ x: 2005, y: 39 }, { x: 2006, y: 36 }, { x: 2007, y: 40 }, { x: 2008, y: 44 },
{ x: 2009, y: 45 }, { x: 2010, y: 48 }, { x: 2011, y: 46 }];

export let spline1: DataValue[] = [{ x: 2002, y: 2.2 }, { x: 2003, y: 3.4 }, { x: 2004, y: 2.8 }, { x: 2005, y: 1.6 },
{ x: 2006, y: 2.3 }, { x: 2007, y: 2.5 }, { x: 2008, y: 2.9 }, { x: 2009, y: 3.8 },{ x: 2010, y: 1.4 }, { x: 2011, y: 3.1 }];

export let rotateData1: DataValue[] = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: -30 },
{ x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: -65 },
{ x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }];

export let rotateData2: DataValue[] = [{ x: new Date(2000, 6, 11), y: -30 }, { x: new Date(2002, 3, 7), y: 10 },
{ x: new Date(2004, 3, 6), y: 0 }, { x: new Date(2006, 3, 30), y: 75 },
{ x: new Date(2008, 3, 8), y: 45 }, { x: new Date(2010, 3, 8), y: 32 }];

export let doubleRangeColumnData: any[] = [
    { x: 1, low: -12, high: 0 }, { x: 2, low: 12, high: 10 },
    { x: 3, low: 23, high: 10 }, { x: 4, low: 202, high: 43 },
    { x: 5, low: 0, high: 10 }, { x: 6, low: -22, high: 34 },
    { x: 7, low: -12, high: 23 }, { x: 8, low: 12, high: 40 }];

export let datetimeCategoryYearData: DataValue[] = [{ x: new Date(2000, 3, 17), y: 16 }, { x: new Date(2000, 3, 17), y: 20 },
{ x: new Date(2000, 3, 18), y: 34 }, { x: new Date(2001, 3, 20), y: 40 },
{ x: new Date(2001, 3, 25), y: 23 }, { x: new Date(2002, 3, 30), y: 80 }];
export let datetimeCategoryYearData1: DataValue[] = [{ x: new Date(2000, 3, 21), y: 10 }, { x: new Date(2000, 3, 17), y: 10 },
{ x: new Date(2000, 3, 18), y: 14 }, { x: new Date(2001, 3, 20), y: 45 },
{ x: new Date(2001, 3, 25), y: 67 }, { x: new Date(2002, 3, 30), y: 75 }];
export let datetimeCategoryYearData2: DataValue[] = [{ x: new Date(2000, 4, 21), y: 10 }, { x: new Date(2000, 5, 17), y: 10 },
{ x: new Date(2000, 7, 18), y: 14 }, { x: new Date(2001, 4, 20), y: 45 },
{ x: new Date(2001, 5, 25), y: 67 }, { x: new Date(2002, 8, 30), y: 75 }];
export let dateTimedataInterval: any[] = [
    { x: new Date(2000, 0, 23), y: 12 }, { x: new Date(2001, 2, 12), y: 10 }, { x: new Date(2001, 3, 12), y: 23 },
    { x: new Date(2001, 4, 20), y: 10 }, { x: new Date(2001, 5, 12), y: 34 }, { x: new Date(2001, 6, 56), y: 10 }
];

export let remoteData: Object[] = [
    {
        Assignee: "Nancy Davloio",
        Estimate: 3.5,
        Id: 1,
        ImgUrl: "../content/images/kanban/1.png",
        Priority: "Low",
        Status: "Open",
        Summary: "Analyze the new requirements gathered from the customer",
        Tags: "Analyze,Customer",
        Type: "Story"
    },
    {
        Assignee: "Andrew Fuller",
        Estimate: 6,
        Id: 2,
        ImgUrl: "../content/images/kanban/2.png",
        Priority: "Normal",
        Status: "InProgress",
        Summary: "Improve application performance",
        Tags: "Improvement",
        Type: "Improvement"
    },
    {
        Assignee: "Janet Leverling",
        Estimate: 5.5,
        Id: 3,
        ImgUrl: "../content/images/kanban/3.png",
        Priority: "Critical",
        Status: "Open",
        Summary: "Arrange a web meeting with the customer to get new requirements",
        Tags: "Meeting",
        Type: "Others"
    },
    {
        Assignee: "Janet Leverling",
        Estimate: 2.5,
        Id: 4,
        ImgUrl: "../content/images/kanban/4.png",
        Priority: "Release Breaker",
        Status: "InProgress",
        Summary: "Fix the issues reported in IE browsers",
        Tags: "IE",
        Type: "Bug"
    },
    {
        Assignee: "Steven walker",
        Estimate: 3.5,
        Id: 5,
        ImgUrl: "../content/images/kanban/5.png",
        Priority: "Low",
        Status: "Testing",
        Summary: "Fix the issues reported by the customer",
        Tags: "Customer",
        Type: "Bug"
    },
    {
        Assignee: "Michael Suyama",
        Estimate: 2,
        Id: 6,
        ImgUrl: "../content/images/kanban/6.png",
        Priority: "Low",
        Status: "Close",
        Summary: "Arrange a web meeting with the customer to get the login page requirements",
        Tags: "Meeting",
        Type: "Others"
    },
    {
        Assignee: "Robert King",
        Estimate: 1.5,
        Id: 7,
        ImgUrl: "../content/images/kanban/7.png",
        Priority: "Low",
        Status: "Validate",
        Summary: "Validate new requirements",
        Tags: "Validation",
        Type: "Improvement"
    }
];
export let rotatedLabels: Object[] = [{ x: "Alfreds FutterkisteObere Str. 57", y: 29.46, size: null, fill: null },
{ x: "Alfred's FutterkisteObere Str. 57", y: 196.12, size: null, fill: null },
{ x: "Ana Trujillo Emparedados y heladosAvda. de la Constitución 2222", y: 97.42, size: null, fill: null },
{ x: "Antonio Moreno TaqueríaMataderos  2312", y: 268.52, size: null, fill: null },
{ x: "Around the HornBrook Farm Stratford St. Mary", y: 471.95, size: null, fill: null },
{ x: "Berglunds snabbköpBerguvsvägen  8", y: 1559.52, size: null, fill: null },
{ x: "Blauer See DelikatessenForsterstr. 57", y: 168.26, size: null, fill: null },
{ x: "Blondel père et fils24, place Kléber", y: 623.66, size: null, fill: null },
{ x: "Bólido Comidas preparadasC/ Araquil, 67", y: 191.17, size: null, fill: null },
{ x: "Bon app'12, rue des Bouchers", y: 1357.87, size: null, fill: null },
{ x: "Bottom-Dollar Markets23 Tsawassen Blvd.", y: 793.95, size: null, fill: null },
{ x: "B's BeveragesFauntleroy Circus", y: 281.31, size: null, fill: null },
{ x: "Cactus Comidas para llevarCerrito 333", y: 72.76, size: null, fill: null },
{ x: "Centro comercial MoctezumaSierras de Granada 9993", y: 3.25, size: null, fill: null },
{ x: "Chop-suey ChineseHauptstr. 31", y: 367.24, size: null, fill: null },
{ x: "Comércio MineiroAv. dos Lusíadas, 23", y: 187.82, size: null, fill: null },
{ x: "Consolidated HoldingsBerkeley Gardens 12  Brewery", y: 53.62, size: null, fill: null },
{ x: "Die Wandernde KuhAdenauerallee 900", y: 432.87, size: null, fill: null },
{ x: "Drachenblut DelikatessenWalserweg 21", y: 306.04, size: null, fill: null },
{ x: "Du monde entier67, rue des Cinquante Otages", y: 63.7, size: null, fill: null },
{ x: "Eastern Connection35 King George", y: 832.34, size: null, fill: null },
{ x: "Ernst HandelKirchgasse 6", y: 6205.39, size: null, fill: null },
{ x: "Familia ArquibaldoRua Orós, 92", y: 232.75, size: null, fill: null },
{ x: "Folies gourmandes184, chaussée de Tournai", y: 637.94, size: null, fill: null },
{ x: "Folk och fä HBÅkergatan 24", y: 1678.08, size: null, fill: null },
{ x: "France restauration54, rue Royale", y: 171.42, size: null, fill: null },
{ x: "Franchi S.p.A.Via Monte Bianco 34", y: 75.13, size: null, fill: null },
{ x: "FrankenversandBerliner Platz 43", y: 1403.44, size: null, fill: null },
{ x: "Furia Bacalhau e Frutos do MarJardim das rosas n. 32", y: 278.67, size: null, fill: null },
{ x: "Galería del gastronómoRambla de Cataluña, 23", y: 37.98, size: null, fill: null },
{ x: "Godos Cocina TípicaC/ Romero, 33", y: 568.27, size: null, fill: null },
{ x: "Gourmet LanchonetesAv. Brasil, 442", y: 322.38, size: null, fill: null },
{ x: "Great Lakes Food Market2732 Baker Blvd.", y: 1087.61, size: null, fill: null },
{ x: "GROSELLA-Restaurante5ª Ave. Los Palos Grandes", y: 67.8, size: null, fill: null },
{ x: "Hanari CarnesRua do Paço, 67", y: 724.77, size: null, fill: null },
{ x: "HILARION-AbastosCarrera 22 con Ave. Carlos Soublette #8-35", y: 1259.16, size: null, fill: null },
{ x: "Hungry Coyote Import StoreCity Center Plaza 516 Main St.", y: 207.08, size: null, fill: null },
{ x: "Hungry Owl All-Night Grocers8 Johnstown Road", y: 2755.24, size: null, fill: null },
{ x: "Island TradingGarden House Crowther Way", y: 363.65, size: null, fill: null },
{ x: "Königlich EssenMaubelstr. 90", y: 813.68, size: null, fill: null },
{ x: "La corne d'abondance67, avenue de l'Europe", y: 87.49, size: null, fill: null },
{ x: "La maison d'Asie1 rue Alsace-Lorraine", y: 635.82, size: null, fill: null },
{ x: "Laughing Bacchus Wine Cellars2319 Elm St.", y: 9.92, size: null, fill: null },
{ x: "Lazy K Kountry Store12 Orchestra Terrace", y: 19.4, size: null, fill: null },
{ x: "Lehmanns MarktstandMagazinweg 7", y: 1017.03, size: null, fill: null },
{ x: "Let's Stop N Shop87 Polk St. Suite 5", y: 202.11, size: null, fill: null },
{ x: "LILA-SupermercadoCarrera 52 con Ave. Bolívar #65-98 Llano Largo", y: 734.41, size: null, fill: null },
{ x: "LINO-DelicatesesAve. 5 de Mayo Porlamar", y: 673.81, size: null, fill: null },
{ x: "Lonesome Pine Restaurant89 Chiaroscuro Rd.", y: 79.86, size: null, fill: null },
{ x: "Magazzini Alimentari RiunitiVia Ludovico il Moro 22", y: 469.75, size: null, fill: null }];

export let highlightData: Object[] = [
    { x: 'Jan', y: 5.2,  y1: 1.5 },   { x: 'Feb', y: 5.7,  y1: 1.6 },
    { x: 'Mar', y: 8.7,  y1: 3.3 },   { x: 'Apr', y: 13.9, y1: 5.9 },
    { x: 'May', y: 18.2, y1: 10.5 },  { x: 'Jun', y: 21.4, y1: 13.5 },
    { x: 'Jul', y: 25,   y1: 14.5 },  { x: 'Aug', y: 26.4, y1: 14.4 },
    { x: 'Sep', y: 22.8, y1: 11.5 },  { x: 'Oct', y: 17.5, y1: 8.7 },
    { x: 'Nov', y: 12.1, y1: 4.7 },   { x: 'Dec', y: 7.6,  y1: 2.6 }
];

export let highlightAxesData: Object[] = [
    { x: 'Jan', y: 5.2 },   { x: 'Feb', y: 5.7 },
    { x: 'Mar', y: 8.7 },   { x: 'Apr', y: 13.9 },
    { x: 'May', y: 18.2 },  { x: 'Jun', y: 21.4 }
];