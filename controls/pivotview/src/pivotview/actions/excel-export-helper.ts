import { ExcelImage } from '../../common/base/interface';
import { PivotView } from '../base/pivotview';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelStyle, ExcelTheme } from '@syncfusion/ej2-grids';

/**
 * `ExcelExportHelper` module is used to add theme styles in Excel document.
 *
 * @hidden
 */

export class ExcelExportHelper {
    private parent: PivotView;

    /**
     * Constructor for the PivotTable Excel Export Helper module.
     *
     * @param {PivotView} parent - Instance of pivot table.
     * @hidden
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
    }

    /**
     * Merges the given theme style into the existing Excel style.
     *
     * @param {ExcelTheme} themestyle - Theme-specific style to apply.
     * @param {ExcelStyle} style - Existing Excel style to be extended.
     * @returns {ExcelStyle} The combined Excel style.
     * @hidden
     */
    public updateThemeStyle(themestyle: ExcelTheme, style: ExcelStyle): ExcelStyle {
        return extend(style, themestyle);
    }

    /**
     * Returns the caption style by merging theme caption with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing caption style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated caption style as ExcelTheme.
     * @hidden
     */
    public getCaptionThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme {
        const style: ExcelStyle = this.updateThemeStyle((<{ caption?: Object }>theme).caption, styles);
        return style as ExcelTheme;
    }

    /**
     * Returns the header style by merging theme header with the provided style.
     *
     * @param {ExcelTheme} theme - Excel theme containing header style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated header style as ExcelTheme.
     * @hidden
     */
    public getHeaderThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme {
        const style: ExcelStyle = this.updateThemeStyle((<{ header?: Object }>theme).header, styles);
        return style as ExcelTheme;
    }

    /**
     * Returns the record style by merging theme record with the provided style
     *
     * @param {ExcelTheme} theme - Excel theme containing record style.
     * @param {ExcelStyle} styles - Base style to be extended.
     * @returns {ExcelTheme} The updated record style as ExcelTheme.
     * @hidden
     */
    public getRecordThemeStyle(theme: ExcelTheme, styles: ExcelStyle): ExcelTheme {
        const style: ExcelStyle = this.updateThemeStyle((<{ record?: Object }>theme).record, styles);
        return style as ExcelTheme;
    }

    /**
     * Inserts an image into the Excel export at the specified cell location.
     *
     * @param {ExcelHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs} args - Cell info event arguments containing image data.
     * @param {number} colIndex - Column index where the image should be placed.
     * @param {number} rowIndex - Row index where the image should be placed.
     * @param {number} rowHeight - Height of the row to compare with image height.
     * @returns  {number} The final row height after inserting the image.
     * @hidden
     */
    public setImage(
        args: ExcelHeaderQueryCellInfoEventArgs | ExcelQueryCellInfoEventArgs, colIndex: number, rowIndex: number, rowHeight: number
    ): number {
        const excelImage: ExcelImage = {
            image: args.image.base64, row: rowIndex, column: colIndex + 1,
            lastRow: rowIndex, lastColumn: colIndex + 1
        };
        if (args.image.width && args.image.height) {
            excelImage.width = args.image.width;
            excelImage.height = args.image.height;
        }
        this.parent.excelExportModule.images.push(excelImage);
        const height: number = rowHeight > args.image.height ? rowHeight : args.image.height;
        return height || 50;
    }
}
