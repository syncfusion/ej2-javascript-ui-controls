import { IPivotValues } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ExcelExportProperties, ExcelRow } from '@syncfusion/ej2-grids';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 * @hidden
 */

export class PivotExportUtil {

    /* eslint-disable @typescript-eslint/no-explicit-any */
    private static getDefinedObj(data: { [key: string]: any }): { [key: string]: any } {
        let keyPos: number = 0;
        let framedSet: any = {};
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (!(data === null || data === undefined)) {
            let fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos]] === null || data[fields[keyPos]] === undefined)) {
                    framedSet[fields[keyPos]] = data[fields[keyPos]];
                }
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    public static getClonedPivotValues(pivotValues: IPivotValues): IPivotValues {
        let clonedSets: IPivotValues = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i]) {
                clonedSets[i] = [];
                for (let j: number = 0; j < pivotValues[i].length; j++) {
                    if (pivotValues[i][j]) {
                        /* eslint-disable */
                        clonedSets[i][j] = this.getClonedPivotValueObj(pivotValues[i][j] as { [key: string]: Object });
                        /* eslint-enable */
                    }
                }
            }
        }
        return clonedSets;
    }

    /* eslint-disable */
    private static getClonedPivotValueObj(data: { [key: string]: Object }): { [key: string]: Object } {
        /* eslint-enable */
        let keyPos: number = 0;
        /* eslint-disable @typescript-eslint/no-explicit-any */
        let framedSet: any = {};
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (!(data === null || data === undefined)) {
            let fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos]] = data[fields[keyPos]];
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    /* eslint-disable */
    public static isContainCommonElements(collection1: Object[], collection2: Object[]): boolean {
        /* eslint-enable */
        for (let i: number = 0, cnt: number = collection1.length; i < cnt; i++) {
            for (let j: number = 0, lnt: number = collection2.length; j < lnt; j++) {
                if (collection2[j] === collection1[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    /* eslint-disable */
    public static formatPdfHeaderFooter(pdf: any): any {
        let contents: any = [];
        if (!isNullOrUndefined(pdf)) {
            for (let i: number = 0; i < pdf.length; i++) {
                let a = pdf[i];
                let content = {
                    /* eslint-enable */
                    type: a.Type,
                    pageNumberType: a.PageNumberType,
                    style: a.Style ? {
                        penColor: a.Style.PenColor,
                        penSize: a.Style.PenSize,
                        dashStyle: a.Style.DashStyle,
                        textBrushColor: a.Style.TextBrushColor,
                        textPenColor: a.Style.TextPenColor,
                        fontSize: a.Style.FontSize,
                        hAlign: a.Style.HAlign,
                        vAlign: a.Style.VAlign
                    } : a.Style,
                    points: a.Points !== null ? {
                        x1: a.Points.X1,
                        y1: a.Points.Y1,
                        x2: a.Points.X2,
                        y2: a.Points.Y2
                    } : null,
                    format: a.Format,
                    position: a.Position !== null ? {
                        x: a.Position.X,
                        y: a.Position.Y
                    } : null,
                    size: a.Size !== null ? {
                        height: a.Size.Height,
                        width: a.Size.Width
                    } : null,
                    src: a.Src,
                    value: a.Value,
                    font: a.Font
                };
                contents.push(content);
            }
        }
        return contents;
    }

    /* eslint-disable */
    public static formatPdfExportProperties(pdf: any): any {
        let values: any;
        /* eslint-enable */
        values = this.getDefinedObj({
            pageOrientation: typeof pdf.PageOrientation === 'string' ? pdf.PageOrientation : null,
            pageSize: typeof pdf.PageSize === 'string' ? pdf.PageSize : null,
            header: !isNullOrUndefined(pdf.Header) ? {
                fromTop: pdf.Header.FromTop,
                height: pdf.Header.Height,
                contents: this.formatPdfHeaderFooter(pdf.Header.Contents)
            } : null,
            columns: pdf.Columns,
            footer: !isNullOrUndefined(pdf.Footer) ? {
                fromTop: pdf.Footer.FromBottom,
                height: pdf.Footer.Height,
                contents: this.formatPdfHeaderFooter(pdf.Footer.Contents)
            } : null,
            includeHiddenColumn: pdf.IncludeHiddenColumn,
            dataSource: pdf.DataSource,
            exportType: typeof pdf.ExportType === 'string' ? pdf.ExportType : null,
            theme: !isNullOrUndefined(pdf.Theme) ? {
                header: pdf.Theme.Header,
                record: pdf.Theme.Record,
                caption: pdf.Theme.Caption
            } : null,
            fileName: pdf.FileName,
            hierarchyExportMode: typeof pdf.HierarchyExportMode === 'string' ? pdf.HierarchyExportMode : null,
            allowHorizontalOverflow: pdf.AllowHorizontalOverflow
        });
        return values;
    }
    /* eslint-disable */
    public static formatExcelStyle(style: any): any {
        let prop;
        /* eslint-enable */
        if (!isNullOrUndefined(style)) {
            prop = this.getDefinedObj({
                fontColor: style.FontColor,
                fontName: style.FontName,
                fontSize: style.FontSize,
                hAlign: style.HAlign === String ? style.HAlign : null,
                vAlign: style.VAlign === String ? style.VAlign : null,
                bold: style.Bold,
                indent: style.Indent,
                italic: style.Italic,
                underline: style.Underline,
                backColor: style.BackColor,
                wrapText: style.WrapText,
                borders: style.Borders,
                numberFormat: style.NumberFormat,
                type: style.Type
            });
        }
        return prop;
    }

    /* eslint-disable */
    public static formatExcelCell(cell: any): any {
        let cells: ExcelRow[] = [];
        if (!isNullOrUndefined(cell)) {
            for (let i: number = 0; i < cell.length; i++) {
                this.getDefinedObj({
                    index: !isNullOrUndefined(cell[i].Index) ? cell[i].Index : null,
                    colSpan: !isNullOrUndefined(cell[i].ColSpan) ? cell[i].ColSpan : null,
                    value: !isNullOrUndefined(cell[i].Value) ? cell[i].Value : null,
                    hyperlink: {
                        target: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.Target : null,
                        displayText: !isNullOrUndefined(cell[i].Hyperlink) ? cell[i].Hyperlink.DisplayText : null
                    },
                    styles: this.formatExcelStyle(cell[i].Style),
                    rowSpan: !isNullOrUndefined(cell[i].RowSpan) ? cell[i].RowSpan : null
                });
                /* eslint-enable */
            }
        }
        return cells;
    }

    /* eslint-disable */
    public static formatExcelHeaderFooter(excel: any): any {
        let rows: ExcelRow[] = [];
        if (!isNullOrUndefined(excel)) {
            for (let i: number = 0; i < excel.Rows.length; i++) {
                let row = excel.Rows[i];
                let prop = this.getDefinedObj({
                    index: !isNullOrUndefined(row.Index) ? row.Index : null,
                    cells: this.formatExcelCell(row.Cells),
                    grouping: !isNullOrUndefined(row.Grouping) ? row.Grouping : null
                });
                rows.push(prop);
            }
        }
        return rows;
    }

    public static formatExcelExportProperties(excel: any): any {
        /* eslint-enable */
        let prop: ExcelExportProperties;
        prop = this.getDefinedObj({
            dataSource: excel.DataSource,
            query: excel.Query,
            multipleExport: this.getDefinedObj({
                type: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.Type : null,
                blankRows: !isNullOrUndefined(excel.MultipleExport) ? excel.MultipleExport.BlankRows : null
            }),
            header: this.getDefinedObj({
                headerRows: !isNullOrUndefined(excel.Header) ? excel.Header.HeaderRows : null,
                rows: this.formatExcelHeaderFooter(excel.Header)
            }),
            footer: this.getDefinedObj({
                footerRows: !isNullOrUndefined(excel.Footer) ? excel.Footer.FooterRows : null,
                rows: this.formatExcelHeaderFooter(excel.Footer)
            }),
            columns: excel.Columns,
            exportType: typeof excel.ExportType === 'string' ? excel.ExportType : undefined,
            includeHiddenColumn: excel.IncludeHiddenColumn,
            theme: !isNullOrUndefined(excel.Theme) ? {
                header: this.formatExcelStyle(excel.Theme.Header),
                record: this.formatExcelStyle(excel.Theme.Record),
                caption: this.formatExcelStyle(excel.Theme.Caption)
            } : undefined,
            fileName: excel.FileName,
            hierarchyExportMode: typeof excel.HierarchyExportMode === 'string' ? excel.HierarchyExportMode : undefined
        });
        return prop;
    }
}
