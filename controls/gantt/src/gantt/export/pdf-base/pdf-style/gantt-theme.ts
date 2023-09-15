import { PdfTheme } from './../../../base/enum';
import { IGanttStyle } from './../../../base/interface';
import { PdfColor, PdfFontFamily, PdfStringFormat } from '@syncfusion/ej2-pdf-export';

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
    }
    public get style(): IGanttStyle {
        if (this.ganttStyle) {
            return this.ganttStyle;
        } else {
            this.setTheme(this.ganttStyle, 'Material');
            return this.ganttStyle;
        }
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
        ganttStyle.timeline.fontSize = 9.5;
        ganttStyle.timeline.fontStyle = 0;
        ganttStyle.timeline.backgroundColor = new PdfColor(252, 252, 252);
        ganttStyle.timeline.fontColor = new PdfColor(40, 40, 39);
        ganttStyle.chartGridLineColor = new PdfColor(206, 206, 206);
        ganttStyle.timeline.borderColor = new PdfColor(206, 206, 206);
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
    }
}
