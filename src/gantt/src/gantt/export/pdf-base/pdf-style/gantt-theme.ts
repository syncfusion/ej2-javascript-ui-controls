import { PdfTheme } from './../../../base/enum';
import { IGanttStyle } from './../../../base/interface';
import { PdfBorders, PdfColor, PdfDashStyle, PdfFontFamily, PdfPen, PdfStringFormat } from '@syncfusion/ej2-pdf-export';

/**
 * @hidden
 */
export class PdfGanttTheme {
    public ganttStyle: IGanttStyle;
    private theme: PdfTheme;
    constructor(theme: PdfTheme) {
        this.theme = theme;
        this.ganttStyle = {};
        this.setTheme(this.ganttStyle, this.theme);
        this.ganttStyle.eventMarker.lineStyle.dashStyle = PdfDashStyle.Dash;
    }
    public get style(): IGanttStyle {
        return this.ganttStyle;
    }
    private setTheme(ganttStyle: IGanttStyle, theme: PdfTheme): void {
        this.initStyles(ganttStyle);
        ganttStyle.columnHeader.fontSize = 9.5;
        ganttStyle.columnHeader.fontColor = new PdfColor(0, 0, 0);
        ganttStyle.columnHeader.fontColor.gray = 0.2;
        ganttStyle.columnHeader.backgroundColor = new PdfColor(255, 255, 255);
        ganttStyle.columnHeader.borderColor = new PdfColor(234, 234, 234);
        ganttStyle.columnHeader.format.lineAlignment = 1; //Centre
        ganttStyle.columnHeader.format.alignment = 0; //Left
        ganttStyle.fontFamily = PdfFontFamily.Helvetica;
        ganttStyle.cell.fontSize = 9.5;
        ganttStyle.cell.backgroundColor = new PdfColor(255, 255, 255);
        ganttStyle.cell.borderColor = new PdfColor(234, 234, 234);
        ganttStyle.cell.fontColor = new PdfColor(0, 0, 0);
        ganttStyle.cell.fontColor.gray = 0.2;
        ganttStyle.cell.format.lineAlignment = 1; // Centre
        ganttStyle.cell.format.alignment = 0; // Left
        ganttStyle.footer.fontSize = 9.5;
        ganttStyle.footer.fontStyle = 0;
        ganttStyle.footer.format.alignment = 1; //Centre
        ganttStyle.footer.format.lineAlignment = 1; // Middle
        ganttStyle.footer.borderColor = new PdfColor(235, 235, 235);
        ganttStyle.timeline.fontSize = 9.5;
        ganttStyle.timeline.fontStyle = 0;
        ganttStyle.timeline.backgroundColor = new PdfColor(252, 252, 252);
        ganttStyle.timeline.fontColor = new PdfColor(40, 40, 39);
        ganttStyle.chartGridLineColor = new PdfColor(235, 235, 235);
        ganttStyle.timeline.borderColor = new PdfColor(235, 235, 235);
        ganttStyle.eventMarker.label.backgroundColor = new PdfColor(100, 253, 191);
        ganttStyle.eventMarker.label.fontColor = new PdfColor(33, 33, 33);
        ganttStyle.eventMarker.lineStyle = new PdfPen(new PdfColor(227, 22, 91));
        ganttStyle.eventMarker.lineStyle.dashStyle = PdfDashStyle.Dash;
        ganttStyle.holiday.backgroundColor = new PdfColor(238, 238, 238);
        switch (theme) {
        case 'Bootstrap':
            //chart side theme
            ganttStyle.taskbar.taskColor = new PdfColor(49, 122, 185);
            ganttStyle.taskbar.progressColor = new PdfColor(33, 82, 125);
            ganttStyle.taskbar.criticalTaskColor = new PdfColor(255, 139, 139);
            ganttStyle.taskbar.criticalProgressColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.baselineColor = new PdfColor(240, 173, 78);
            ganttStyle.taskbar.baselineBorderColor = new PdfColor(240, 173, 78);
            ganttStyle.criticalConnectorLineColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.criticalTaskBorderColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.parentTaskColor = new PdfColor(119, 119, 119);
            ganttStyle.taskbar.parentProgressColor = new PdfColor(85, 85, 85);
            ganttStyle.taskbar.taskBorderColor = new PdfColor(33, 82, 125);
            ganttStyle.taskbar.parentTaskBorderColor = new PdfColor(85, 85, 85);
            ganttStyle.taskbar.milestoneColor = new PdfColor(85, 85, 85);
            ganttStyle.footer.fontColor = new PdfColor(0, 0, 0);
            ganttStyle.footer.fontColor.gray = 0.2;
            ganttStyle.connectorLineColor = new PdfColor(33, 82, 125);
            ganttStyle.footer.backgroundColor = new PdfColor(255, 255, 255);
            ganttStyle.taskbar.progressFontColor = new PdfColor(255, 255, 255);
            ganttStyle.label.fontColor = new PdfColor(0, 0, 0);
            ganttStyle.taskbar.splitLineBackground = new PdfColor(51, 51, 51);
            ganttStyle.taskbar.unscheduledTaskBarColor = new PdfColor(49, 122, 185);
            ganttStyle.taskbar.manualParentBackground = new PdfColor(119, 119, 119);
            ganttStyle.taskbar.manualParentProgress = new PdfColor(85, 85, 85);
            ganttStyle.taskbar.manualChildBackground = new PdfColor(117, 56, 201);
            ganttStyle.taskbar.manualChildProgress = new PdfColor(87, 42, 150);
            ganttStyle.taskbar.manualLineColor = new PdfColor(152, 154, 156);
            ganttStyle.taskbar.manualParentBorder = new PdfColor(85, 85, 85);
            ganttStyle.taskbar.manualChildBorder = new PdfColor(87, 42, 150);
            ganttStyle.eventMarker.label.backgroundColor = new PdfColor(138, 109, 59);
            ganttStyle.eventMarker.label.fontColor =  new PdfColor(252, 248, 227);
            ganttStyle.eventMarker.lineStyle = new PdfPen(new PdfColor(49, 122, 185));
            ganttStyle.holiday.backgroundColor = new PdfColor(238, 238, 238);
            break;
        case 'Bootstrap 4':
            //chart side theme
            ganttStyle.taskbar.taskColor = new PdfColor(0, 123, 255);
            ganttStyle.taskbar.progressColor = new PdfColor(0, 86, 179);
            ganttStyle.taskbar.criticalTaskColor = new PdfColor(255, 139, 139);
            ganttStyle.taskbar.criticalProgressColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.baselineColor = new PdfColor(255, 193, 7);
            ganttStyle.taskbar.baselineBorderColor = new PdfColor(255, 193, 7);
            ganttStyle.criticalConnectorLineColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.criticalTaskBorderColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.parentTaskColor = new PdfColor(108, 117, 125);
            ganttStyle.taskbar.parentProgressColor = new PdfColor(73, 80, 87);
            ganttStyle.taskbar.taskBorderColor = new PdfColor(0, 86, 179);
            ganttStyle.taskbar.parentTaskBorderColor = new PdfColor(73, 80, 87);
            ganttStyle.taskbar.milestoneColor = new PdfColor(73, 80, 87);
            ganttStyle.footer.fontColor = new PdfColor(0, 0, 0);
            ganttStyle.footer.fontColor.gray = 0.2;
            ganttStyle.connectorLineColor = new PdfColor(0, 86, 179);
            ganttStyle.footer.backgroundColor = new PdfColor(255, 255, 255);
            ganttStyle.taskbar.progressFontColor = new PdfColor(255, 255, 255);
            ganttStyle.label.fontColor = new PdfColor(33, 37, 41);
            ganttStyle.taskbar.splitLineBackground = new PdfColor(0, 0, 0);
            ganttStyle.taskbar.unscheduledTaskBarColor = new PdfColor(0, 123, 255);
            ganttStyle.taskbar.manualParentBackground = new PdfColor(108, 117, 125);
            ganttStyle.taskbar.manualParentProgress = new PdfColor(73, 80, 87);
            ganttStyle.taskbar.manualChildBackground = new PdfColor(133, 83, 241);
            ganttStyle.taskbar.manualChildProgress = new PdfColor(102, 40, 238);
            ganttStyle.taskbar.manualLineColor = new PdfColor(152, 154, 156);
            ganttStyle.taskbar.manualParentBorder = new PdfColor(73, 80, 87);
            ganttStyle.taskbar.manualChildBorder = new PdfColor(102, 40, 238);
            ganttStyle.eventMarker.label.backgroundColor = new PdfColor(255, 193, 7);
            ganttStyle.eventMarker.label.fontColor =  new PdfColor(0, 0, 0);
            ganttStyle.eventMarker.lineStyle = new PdfPen(new PdfColor(0, 123, 255));
            ganttStyle.holiday.backgroundColor = new PdfColor(233, 236, 239);
            break;
        case 'Fabric':
            ganttStyle.columnHeader.fontColor = new PdfColor(102, 102, 102);
            ganttStyle.cell.fontColor = new PdfColor(51, 51, 51);
            //chart side theme
            ganttStyle.taskbar.taskColor = new PdfColor(0, 120, 214);
            ganttStyle.taskbar.progressColor = new PdfColor(0, 91, 163);
            ganttStyle.taskbar.criticalTaskColor = new PdfColor(255, 139, 139);
            ganttStyle.taskbar.criticalProgressColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.baselineColor = new PdfColor(216, 59, 1);
            ganttStyle.taskbar.baselineBorderColor = new PdfColor(216, 59, 1);
            ganttStyle.criticalConnectorLineColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.criticalTaskBorderColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.parentTaskColor = new PdfColor(118, 118, 118);
            ganttStyle.taskbar.parentProgressColor = new PdfColor(80, 80, 80);
            ganttStyle.taskbar.taskBorderColor = new PdfColor(0, 91, 163);
            ganttStyle.taskbar.parentTaskBorderColor = new PdfColor(80, 80, 80);
            ganttStyle.taskbar.milestoneColor = new PdfColor(80, 80, 80);
            ganttStyle.footer.fontColor = new PdfColor(51, 51, 51);
            ganttStyle.footer.fontColor.gray = 0.2;
            ganttStyle.connectorLineColor = new PdfColor(0, 69, 122);
            ganttStyle.footer.backgroundColor = new PdfColor(255, 255, 255);
            ganttStyle.taskbar.progressFontColor = new PdfColor(255, 255, 255);
            ganttStyle.label.fontColor = new PdfColor(51, 51, 51);
            ganttStyle.taskbar.splitLineBackground = new PdfColor(0, 0, 0);
            ganttStyle.taskbar.unscheduledTaskBarColor = new PdfColor(0, 120, 214);
            ganttStyle.taskbar.manualParentBackground = new PdfColor(118, 118, 118);
            ganttStyle.taskbar.manualParentProgress = new PdfColor(80, 80, 80);
            ganttStyle.taskbar.manualChildBackground = new PdfColor(154, 56, 186);
            ganttStyle.taskbar.manualChildProgress = new PdfColor(109, 24, 136);
            ganttStyle.taskbar.manualLineColor = new PdfColor(152, 154, 156);
            ganttStyle.taskbar.manualParentBorder = new PdfColor(80, 80, 80);
            ganttStyle.taskbar.manualChildBorder = new PdfColor(109, 24, 136);
            ganttStyle.eventMarker.label.backgroundColor = new PdfColor(202, 232, 255);
            ganttStyle.eventMarker.label.fontColor = new PdfColor(0, 90, 158);
            ganttStyle.eventMarker.lineStyle = new PdfPen(new PdfColor(0, 120, 214));
            ganttStyle.holiday.backgroundColor = new PdfColor(244, 244, 244);
            break;
        default:
            //chart side theme
            ganttStyle.taskbar.taskColor = new PdfColor(88, 105, 197);
            ganttStyle.taskbar.progressColor = new PdfColor(63, 81, 181);
            ganttStyle.taskbar.criticalTaskColor = new PdfColor(255, 139, 139);
            ganttStyle.taskbar.criticalProgressColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.baselineColor = new PdfColor(193, 87, 0);
            ganttStyle.taskbar.baselineBorderColor = new PdfColor(193, 87, 0);
            ganttStyle.criticalConnectorLineColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.criticalTaskBorderColor = new PdfColor(255, 85, 85);
            ganttStyle.taskbar.parentTaskColor = new PdfColor(132, 132, 132);
            ganttStyle.taskbar.parentProgressColor = new PdfColor(97, 97, 97);
            ganttStyle.taskbar.taskBorderColor = new PdfColor(63, 81, 181);
            ganttStyle.taskbar.parentTaskBorderColor = new PdfColor(51, 51, 51);
            ganttStyle.taskbar.milestoneColor = new PdfColor(97, 97, 97);
            ganttStyle.footer.fontColor = new PdfColor(0, 0, 0);
            ganttStyle.footer.fontColor.gray = 0.2;
            ganttStyle.connectorLineColor = new PdfColor(63, 81, 181);
            ganttStyle.footer.backgroundColor = new PdfColor(255, 255, 255);
            ganttStyle.taskbar.progressFontColor = new PdfColor(255, 255, 255);
            ganttStyle.label.fontColor = new PdfColor(51, 51, 51);
            ganttStyle.taskbar.splitLineBackground = new PdfColor(0, 0, 0);
            ganttStyle.taskbar.unscheduledTaskBarColor = new PdfColor(63, 81, 181);
            ganttStyle.taskbar.manualParentBackground = new PdfColor(97, 97, 97);
            ganttStyle.taskbar.manualParentProgress = new PdfColor(97, 97, 97);
            ganttStyle.taskbar.manualChildBackground = new PdfColor(0, 135, 134);
            ganttStyle.taskbar.manualChildProgress = new PdfColor(0, 135, 134);
            ganttStyle.taskbar.manualLineColor = new PdfColor(152, 154, 156);
            ganttStyle.taskbar.manualParentBorder = new PdfColor(97, 97, 97);
            ganttStyle.taskbar.manualChildBorder = new PdfColor(0, 135, 134);
            ganttStyle.eventMarker.label.backgroundColor = new PdfColor(253, 191, 100);
            ganttStyle.eventMarker.label.fontColor = new PdfColor(33, 33, 33);
            ganttStyle.eventMarker.lineStyle = new PdfPen(new PdfColor(227, 22, 91));
            ganttStyle.holiday.backgroundColor = new PdfColor(238, 238, 238);
            break;
        }
    }
    private initStyles(ganttStyle: IGanttStyle): void {
        ganttStyle.columnHeader = {};
        ganttStyle.columnHeader.format = new PdfStringFormat();
        ganttStyle.cell = {};
        ganttStyle.cell.format = new PdfStringFormat();
        ganttStyle.timeline = {};
        ganttStyle.footer = {};
        ganttStyle.footer.format = new PdfStringFormat();
        ganttStyle.label = {};
        ganttStyle.taskbar = {};
        ganttStyle.eventMarker = {};
        ganttStyle.eventMarker.label = {};
        ganttStyle.eventMarker.lineStyle = new PdfPen(null);
        ganttStyle.holiday = {};
    }
}
