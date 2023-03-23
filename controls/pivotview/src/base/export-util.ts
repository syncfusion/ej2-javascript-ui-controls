import { IAxisSet, IPivotValues } from './engine';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ExcelExportProperties, ExcelRow } from '@syncfusion/ej2-grids';

/**
 * This is a file to perform common utility for OLAP and Relational datasource
 *
 * @hidden
 */

export class PivotExportUtil {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private static getDefinedObj(data: { [key: string]: any }): { [key: string]: any } {
        let keyPos: number = 0;
        let framedSet: any = {};
        if (!(data === null || data === undefined)) {
            const fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                if (!(data[fields[keyPos as number]] === null || data[fields[keyPos as number]] === undefined)) {
                    framedSet[fields[keyPos as number]] = data[fields[keyPos as number]];
                }
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    public static getClonedPivotValues(pivotValues: IAxisSet[][]): IAxisSet[][] {
        const clonedSets: IAxisSet[][] = [];
        for (let i: number = 0; i < pivotValues.length; i++) {
            if (pivotValues[i as number]) {
                clonedSets[i as number] = [];
                for (let j: number = 0; j < pivotValues[i as number].length; j++) {
                    if (pivotValues[i as number][j as number]) {
                        clonedSets[i as number][j as number] =
                            this.getClonedPivotValueObj(pivotValues[i as number][j as number] as { [key: string]: Object });
                    }
                }
            }
        }
        return clonedSets;
    }

    private static getClonedPivotValueObj(data: { [key: string]: Object }): { [key: string]: Object } {
        let keyPos: number = 0;
        let framedSet: any = {};
        if (!(data === null || data === undefined)) {
            const fields: string[] = Object.keys(data);
            while (keyPos < fields.length) {
                framedSet[fields[keyPos as number]] = data[fields[keyPos as number]];
                keyPos++;
            }
        } else {
            framedSet = data;
        }
        return framedSet;
    }

    public static isContainCommonElements(collection1: Object[], collection2: Object[]): boolean {
        for (let i: number = 0, cnt: number = collection1.length; i < cnt; i++) {
            for (let j: number = 0, lnt: number = collection2.length; j < lnt; j++) {
                if (collection2[j as number] === collection1[i as number]) {
                    return true;
                }
            }
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatPdfHeaderFooter(pdf: any): any {
        const contents: any = [];
        if (!isNullOrUndefined(pdf)) {
            for (let i: number = 0; i < pdf.length; i++) {
                const a: any = pdf[i as number];
                const content: any = {
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatPdfExportProperties(pdf: any): any {
        const values: any = this.getDefinedObj({
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatExcelStyle(style: any): any {
        let prop: any;
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatExcelCell(cell: any): any {
        const cells: ExcelRow[] = [];
        if (!isNullOrUndefined(cell)) {
            for (let i: number = 0; i < cell.length; i++) {
                this.getDefinedObj({
                    index: !isNullOrUndefined(cell[i as number].Index) ? cell[i as number].Index : null,
                    colSpan: !isNullOrUndefined(cell[i as number].ColSpan) ? cell[i as number].ColSpan : null,
                    value: !isNullOrUndefined(cell[i as number].Value) ? cell[i as number].Value : null,
                    hyperlink: {
                        target: !isNullOrUndefined(cell[i as number].Hyperlink) ? cell[i as number].Hyperlink.Target : null,
                        displayText: !isNullOrUndefined(cell[i as number].Hyperlink) ? cell[i as number].Hyperlink.DisplayText : null
                    },
                    styles: this.formatExcelStyle(cell[i as number].Style),
                    rowSpan: !isNullOrUndefined(cell[i as number].RowSpan) ? cell[i as number].RowSpan : null
                });
            }
        }
        return cells;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatExcelHeaderFooter(excel: any): any {
        const rows: ExcelRow[] = [];
        if (!isNullOrUndefined(excel)) {
            for (let i: number = 0; i < excel.Rows.length; i++) {
                const row: any = excel.Rows[i as number];
                const prop: any = this.getDefinedObj({
                    index: !isNullOrUndefined(row.Index) ? row.Index : null,
                    cells: this.formatExcelCell(row.Cells),
                    grouping: !isNullOrUndefined(row.Grouping) ? row.Grouping : null
                });
                rows.push(prop);
            }
        }
        return rows;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static formatExcelExportProperties(excel: any): any {
        const prop: ExcelExportProperties = this.getDefinedObj({
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
    /* eslint-enable @typescript-eslint/no-explicit-any */
}
