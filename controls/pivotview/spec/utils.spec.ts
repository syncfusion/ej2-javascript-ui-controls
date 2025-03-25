import {
    PdfCellRenderArgs, ToolbarArgs, RenameReportArgs, RemoveReportArgs, SaveReportArgs, FetchReportArgs, LoadReportArgs,
    NumberFormattingEventArgs
} from '../src/common/base/interface';
import { BeforeExportEventArgs } from '../src';
import { isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { TreeView } from '@syncfusion/ej2-navigations';

export function copyObject(source: any, destiation: any): Object {
    for (let prop of source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

export function disableDialogAnimation(dialogObject: Dialog): void {
    dialogObject.animationSettings = { effect: 'None' };
    dialogObject.dataBind();
    dialogObject.hide();
}

export function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(currentTarget)) {
        returnObject.currentTarget = currentTarget;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = target;
        returnObject.offsetY = 7;
    }
    returnObject.type = 'mouse';
    return returnObject;
}

export function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.offsetY = 7;
    return eventarg;
}

export function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
    let mouseEve: MouseEvent = document.createEvent('MouseEvents');
    if (x && y) {
        mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
    } else {
        mouseEve.initEvent(eventType, true, true);
    }
    node.dispatchEvent(mouseEve);
}

export function triggerEvent(node: HTMLElement, eventType: string) {
    let mouseEve: MouseEvent = document.createEvent('MouseEvents');
    mouseEve.initEvent(eventType, true, true);
    node.dispatchEvent(mouseEve);
}

export function saveReport(args: SaveReportArgs): void {
    let reports: SaveReportArgs[] = [];
    let isSaved: boolean = false;
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        reports = JSON.parse(localStorage.pivotviewReports);
    }
    if (args.report && args.reportName && args.reportName !== '') {
        reports.map(function (item: any): any {
            if (args.reportName === item.reportName) {
                item.report = args.report; isSaved = true;
            }
        });
        if (!isSaved) {
            reports.push(args);
        }
        localStorage.pivotviewReports = JSON.stringify(reports);
    }
}

export function fetchReport(args: FetchReportArgs): void {
    let reportCollection: string[] = [];
    let reeportList: string[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    reportCollection.map(function (item: any): void { reeportList.push(item.reportName); });
    args.reportName = reeportList;
}

export function loadReport(args: LoadReportArgs): void {
    let reportCollection: string[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    reportCollection.map(function (item: any): void {
        if (args.reportName === item.reportName) {
            args.report = item.report;
        }
    });
    if (args.report) {
        this.dataSource = JSON.parse(args.report).dataSource;
    }
}

export function removeReport(args: RemoveReportArgs): void {
    let reportCollection: any[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    for (let i: number = 0; i < reportCollection.length; i++) {
        if (reportCollection[i].reportName === args.reportName) {
            reportCollection.splice(i, 1);
        }
    }
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        localStorage.pivotviewReports = JSON.stringify(reportCollection);
    }
}

export function renameReport(args: RenameReportArgs): void {
    let reportCollection: string[] = [];
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        reportCollection = JSON.parse(localStorage.pivotviewReports);
    }
    reportCollection.map(function (item: any): any { if (args.reportName === item.reportName) { item.reportName = args.rename; } });
    if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
        localStorage.pivotviewReports = JSON.stringify(reportCollection);
    }
}

export function newReport(): void {
}

export function beforeToolbarRender(args: ToolbarArgs): void {
    args.customToolbar.splice(4, 0, {
        prefixIcon: 'e-new-report e-icons', tooltipText: 'ADD', id: 'new-report'
    });
}

export function beforeExport(args: BeforeExportEventArgs): void {
    args.dataCollections.push(args.dataCollections[0]);
    args.header = 'This is Header';
    args.footer = 'This is Footer';
    args.style = {
        header: {
            bold: true,
            border: { color: '#000000', dashStyle: 'DashDot', width: 2 },
            fontColor: '#bd1616',
            fontName: 'Symbol',
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8
        },
        record: {
            bold: true,
            border: { color: '#000000', dashStyle: 'Dot', width: 2 },
            fontColor: '#bd1616',
            fontName: 'Courier',
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8
        }
    };
}

export function pdfCellRender(args: PdfCellRenderArgs): void {
    if (args.pivotCell && args.pivotCell.formattedText == 'balance') {
        args.style = {
            backgroundColor: '#bd1616',
            bold: true,
            textBrushColor: '#00FFFF',
            textPenColor: '#0000FF',
            border: { color: '#000000', dashStyle: 'DashDotDot', width: 2 },
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8,
            fontFamily: undefined
        };
    } else if (args.pivotCell && args.pivotCell.formattedText == 'blue') {
        args.style = {
            backgroundColor: '#bd1616',
            bold: true,
            textBrushColor: '#00FFFF',
            textPenColor: '#0000FF',
            border: { color: '#000000', dashStyle: 'Dash', width: 2 },
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8,
            fontFamily: 'TimesNewRoman'
        };
    } else if (args.pivotCell && args.pivotCell.formattedText == 'true') {
        args.style = {
            backgroundColor: '#bd1616',
            bold: true,
            textBrushColor: '#00FFFF',
            textPenColor: '#0000FF',
            border: undefined,
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8,
            fontFamily: 'TimesRoman'
        };
    } else {
        args.style = {
            backgroundColor: '#bd1616',
            bold: true,
            textBrushColor: '#00FFFF',
            textPenColor: '#0000FF',
            border: { color: '#000000', dashStyle: 'DashDotDot', width: 2 },
            underline: true,
            italic: true,
            strikeout: true,
            fontSize: 8,
            fontFamily: 'ZapfDingbats'
        };
    }
}

export function checkTreeNode(treeObj: TreeView, li: Element): void {
    removeClass(treeObj.element.querySelectorAll('li'), ['e-node-focus', 'e-active']);
    addClass([li], ['e-node-focus', 'e-active']);
    (treeObj as any).checkNode((li).getAttribute('data-uid'));
}

export function numberFormatting(args: NumberFormattingEventArgs): void {
    args.cancel = true;
}