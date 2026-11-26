import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfDashStyle, PdfGraphics, PdfPen, Rectangle } from '@syncfusion/ej2-pdf';
import {
    ExcelBordersIndex,
    ExcelLineStyle,
    IBorder,
    IBorders,
    ICell,
    IWorksheet,
    Rgba
} from '../common/index';
import { normalizeColor, toPdfColor } from '../common/index';

/** Default black Rgba color structure. */
const BLACK: Rgba = { r: 0, g: 0, b: 0, a: 255 };

/**
 * Handles evaluation, conflict resolution, and rendering of cell borders and diagonal lines.
 */
export class BorderRenderer {
    /**
     * Checks whether any border line style is defined on the cell.
     *
     * @param {IBorders} borders The borders collection of the cell.
     * @returns {boolean} True if at least one border edge or diagonal line has a line style other than `None`.
     */
    public static checkCellBorderStyle(borders: IBorders): boolean {
        if (!borders) {
            return false;
        }
        const hasDiagDown: boolean = !isNullOrUndefined(borders.diagonalDown) && borders.diagonalDown.lineStyle !== ExcelLineStyle.None;
        const hasDiagUp: boolean = !isNullOrUndefined(borders.diagonalUp) && borders.diagonalUp.lineStyle !== ExcelLineStyle.None;
        const hasBottom: boolean = !isNullOrUndefined(borders.bottom) && borders.bottom.lineStyle !== ExcelLineStyle.None;
        const hasLeft: boolean = !isNullOrUndefined(borders.left) && borders.left.lineStyle !== ExcelLineStyle.None;
        const hasRight: boolean = !isNullOrUndefined(borders.right) && borders.right.lineStyle !== ExcelLineStyle.None;
        const hasTop: boolean = !isNullOrUndefined(borders.top) && borders.top.lineStyle !== ExcelLineStyle.None;
        return hasDiagDown || hasDiagUp || hasBottom || hasLeft || hasRight || hasTop;
    }

    /**
     * Maps an Excel border line style to its corresponding pen stroke width in points.
     *
     * @param {IBorder} border The cell border definition.
     * @returns {number} The stroke width in typographic points.
     */
    public static getBorderWidth(border: IBorder): number {
        switch (border.lineStyle) {
        case ExcelLineStyle.Double:
            return 1;
        case ExcelLineStyle.SlantedDashDot:
        case ExcelLineStyle.Medium:
        case ExcelLineStyle.MediumDashed:
        case ExcelLineStyle.MediumDashDot:
        case ExcelLineStyle.MediumDashDotDot:
            return 1.8;
        case ExcelLineStyle.Thin:
        case ExcelLineStyle.Dashed:
        case ExcelLineStyle.DashDot:
        case ExcelLineStyle.DashDotDot:
            return 0.9;
        case ExcelLineStyle.Dotted:
            return 0.8;
        case ExcelLineStyle.Thick:
            return 3;
        case ExcelLineStyle.Hair:
            return 0.2;
        default:
            return 0.5;
        }
    }

    /**
     * Gets the visual rendering priority of a line style used to resolve overlapping adjacent borders.
     *
     * @param {ExcelLineStyle} lineStyle The border line style.
     * @returns {number} The priority weight where higher numbers override lower ones.
     */
    public static getBorderPriority(lineStyle: ExcelLineStyle): number {
        switch (lineStyle) {
        case ExcelLineStyle.None: return 0.5;
        case ExcelLineStyle.Hair: return 0.6;
        case ExcelLineStyle.Dotted: return 1;
        case ExcelLineStyle.DashDotDot: return 1.1;
        case ExcelLineStyle.DashDot: return 1.2;
        case ExcelLineStyle.Dashed: return 1.3;
        case ExcelLineStyle.Thin: return 1.4;
        case ExcelLineStyle.MediumDashDotDot: return 2;
        case ExcelLineStyle.SlantedDashDot: return 2.1;
        case ExcelLineStyle.MediumDashDot: return 2.2;
        case ExcelLineStyle.MediumDashed: return 2.3;
        case ExcelLineStyle.Medium: return 2.4;
        case ExcelLineStyle.Thick: return 3;
        case ExcelLineStyle.Double: return 3.5;
        default: return 0;
        }
    }

    /**
     * Resolves the PDF dash pattern style for a given border line style.
     *
     * @param {IBorder} border The cell border definition.
     * @returns {PdfDashStyle} The resolved `PdfDashStyle`.
     */
    public static getDashStyle(border: IBorder): PdfDashStyle {
        switch (border.lineStyle) {
        case ExcelLineStyle.Dashed:
        case ExcelLineStyle.MediumDashed:
            return PdfDashStyle.dash;
        case ExcelLineStyle.Dotted:
            return PdfDashStyle.dot;
        case ExcelLineStyle.DashDot:
        case ExcelLineStyle.MediumDashDot:
        case ExcelLineStyle.SlantedDashDot:
            return PdfDashStyle.dashDot;
        case ExcelLineStyle.DashDotDot:
        case ExcelLineStyle.MediumDashDotDot:
            return PdfDashStyle.dashDotDot;
        default:
            return PdfDashStyle.solid;
        }
    }

    /**
     * Creates a configured `PdfPen` instance for rendering the specified border edge.
     *
     * @param {IBorder} border The border definition.
     * @param {boolean} blackAndWhite Whether black and white printing mode is active.
     * @param {Rgba} [color] Optional custom Rgba color override.
     * @returns {PdfPen} Fully configured `PdfPen` instance.
     */
    public static createPen(border: IBorder, blackAndWhite: boolean, color?: Rgba): PdfPen {
        const effectiveColor: Rgba = blackAndWhite ? BLACK : normalizeColor(color || border.color);
        const pen: PdfPen = new PdfPen(toPdfColor(effectiveColor), BorderRenderer.getBorderWidth(border));
        pen.dashStyle = BorderRenderer.getDashStyle(border);
        if (pen.dashStyle === PdfDashStyle.dash) {
            pen.dashPattern = [3, 2];
        } else if (pen.dashStyle === PdfDashStyle.dot) {
            pen.dashPattern = [1, 1];
        }
        return pen;
    }

    /**
     * Draws all borders and diagonal lines for a cell matching Excel layout rules.
     *
     * @param {IWorksheet} worksheet The parent worksheet instance.
     * @param {IBorders} borders The full borders collection of the cell.
     * @param {Rectangle} rect The bounding rectangle of the cell in points.
     * @param {PdfGraphics} graphics The target PDF page graphics context.
     * @param {ICell} cell The cell data model.
     * @param {number} lastCell Flag indicating boundary placement (1 = page boundary bottom, 2 = omitted bottom).
     * @param {boolean} enableRtl Whether Right-To-Left column layout is active.
     * @param {boolean} isFirstColumnOfPage Whether this cell is on the first column of the page.
     * @param {boolean} isFirstRowOfPage Whether this cell is on the first row of the page.
     * @param {boolean} blackAndWhite Whether to force monochrome printing.
     * @returns {void}
     */
    public static drawBordersAsMSExcel(
        worksheet: IWorksheet,
        borders: IBorders,
        rect: Rectangle,
        graphics: PdfGraphics,
        cell: ICell,
        lastCell: number,
        enableRtl: boolean,
        isFirstColumnOfPage: boolean,
        isFirstRowOfPage: boolean,
        blackAndWhite: boolean
    ): void {
        if (!borders) {
            return;
        }
        const bLeft: IBorder = borders.left || { lineStyle: ExcelLineStyle.None, color: BLACK };
        const bRight: IBorder = borders.right || { lineStyle: ExcelLineStyle.None, color: BLACK };
        const bTop: IBorder = borders.top || { lineStyle: ExcelLineStyle.None, color: BLACK };
        let bottom: IBorder = borders.bottom || { lineStyle: ExcelLineStyle.None, color: BLACK };
        const bDiagDown: IBorder = borders.diagonalDown || { lineStyle: ExcelLineStyle.None, color: BLACK };
        const bDiagUp: IBorder = borders.diagonalUp || { lineStyle: ExcelLineStyle.None, color: BLACK };

        if (lastCell === 1 && bottom.lineStyle === ExcelLineStyle.None) {
            const nextCell: ICell = worksheet.getCell(cell.row + 1, cell.column);
            if (nextCell && nextCell.style && nextCell.style.borders && nextCell.style.borders.top) {
                bottom = nextCell.style.borders.top;
            }
        } else if (lastCell === 2) {
            bottom = { lineStyle: ExcelLineStyle.None, color: bottom.color };
        }
        const sameAll: boolean = BorderRenderer.sameBorder(bLeft, bRight) &&
            BorderRenderer.sameBorder(bRight, bTop) &&
            BorderRenderer.sameBorder(bTop, bottom) &&
            bLeft.lineStyle !== ExcelLineStyle.Double &&
            !BorderRenderer.isDashedFamily(bTop.lineStyle) &&
            !bDiagDown.showDiagonalLine &&
            !bDiagUp.showDiagonalLine;
        if (sameAll) {
            graphics.drawRectangle(rect, BorderRenderer.createPen(bRight, blackAndWhite));
            return;
        }
        const edgeList: { border: IBorder; borderIndex: ExcelBordersIndex }[] = [
            { border: bLeft, borderIndex: ExcelBordersIndex.EdgeLeft },
            { border: bTop, borderIndex: ExcelBordersIndex.EdgeTop },
            { border: bRight, borderIndex: ExcelBordersIndex.EdgeRight },
            { border: bottom, borderIndex: ExcelBordersIndex.EdgeBottom },
            { border: bDiagDown, borderIndex: ExcelBordersIndex.DiagonalDown },
            { border: bDiagUp, borderIndex: ExcelBordersIndex.DiagonalUp }
        ].filter((entry: { border: IBorder }) => entry.border && entry.border.lineStyle !== ExcelLineStyle.None)
            .sort((firstEntry: { border: IBorder }, secondEntry: { border: IBorder }) => {
                const p1: number = BorderRenderer.getBorderPriority(firstEntry.border.lineStyle);
                const p2: number = BorderRenderer.getBorderPriority(secondEntry.border.lineStyle);
                return p1 - p2;
            });
        let fillEdge: number = 0;
        let isFirstEdge: boolean = true;
        for (const entry of edgeList) {
            BorderRenderer.drawAllBorders(
                worksheet, borders, entry.border, rect, graphics, cell, entry.borderIndex,
                isFirstEdge, fillEdge, enableRtl, isFirstColumnOfPage, isFirstRowOfPage, blackAndWhite
            );
            fillEdge |= (1 << entry.borderIndex);
            isFirstEdge = false;
        }
    }

    private static isDashedFamily(lineStyle: ExcelLineStyle): boolean {
        const isBasicDash: boolean = lineStyle === ExcelLineStyle.Dashed ||
            lineStyle === ExcelLineStyle.DashDot ||
            lineStyle === ExcelLineStyle.DashDotDot;
        const isMedDash: boolean = lineStyle === ExcelLineStyle.MediumDashDot ||
            lineStyle === ExcelLineStyle.MediumDashDotDot ||
            lineStyle === ExcelLineStyle.SlantedDashDot;
        return isBasicDash || isMedDash;
    }

    private static sameBorder(first: IBorder, second: IBorder): boolean {
        if (!first || !second) {
            return false;
        }
        const isSameStyle: boolean = first.lineStyle === second.lineStyle;
        const color1: Rgba = first.color || BLACK;
        const color2: Rgba = second.color || BLACK;
        const isSameColor: boolean = color1.r === color2.r &&
            color1.g === color2.g &&
            color1.b === color2.b;
        return isSameStyle && isSameColor;
    }

    private static brightness(color: Rgba): number {
        return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    }

    private static drawAllBorders(
        worksheet: IWorksheet,
        borders: IBorders,
        border: IBorder,
        rect: Rectangle,
        graphics: PdfGraphics,
        cell: ICell,
        borderIndex: ExcelBordersIndex,
        isFirst: boolean,
        fillEdge: number,
        enableRtl: boolean,
        isFirstColumnOfPage: boolean,
        isFirstRowOfPage: boolean,
        blackAndWhite: boolean
    ): void {
        if (worksheet.isRightToLeft) {
            if (borderIndex === ExcelBordersIndex.EdgeLeft) {
                borderIndex = ExcelBordersIndex.EdgeRight;
            } else if (borderIndex === ExcelBordersIndex.EdgeRight) {
                borderIndex = ExcelBordersIndex.EdgeLeft;
            }
        }
        const neighborWins: (neighborBorder: IBorder) => boolean = (neighborBorder: IBorder): boolean => {
            const sameStyleAndColor: boolean = neighborBorder.lineStyle === border.lineStyle &&
                BorderRenderer.sameBorder(neighborBorder, border);
            const higherPriority: boolean = BorderRenderer.getBorderPriority(neighborBorder.lineStyle) >
                BorderRenderer.getBorderPriority(border.lineStyle);
            const darkerSameStyle: boolean = neighborBorder.lineStyle === border.lineStyle &&
                BorderRenderer.brightness(neighborBorder.color) < BorderRenderer.brightness(border.color);
            return sameStyleAndColor || higherPriority || darkerSameStyle;
        };
        switch (borderIndex) {
        case ExcelBordersIndex.EdgeLeft:
            if (!enableRtl && !isFirstColumnOfPage && cell.column > 1 && worksheet.isColumnVisible(cell.column - 1) &&
                neighborWins(worksheet.getCell(cell.row, cell.column - 1).style.borders.right)) {
                return;
            }
            BorderRenderer.drawSingleBorder(
                borders, border, rect.x, rect.y, rect.x, rect.y + rect.height,
                graphics, borderIndex, isFirst, fillEdge, blackAndWhite
            );
            break;
        case ExcelBordersIndex.EdgeTop:
            if (!isFirstRowOfPage && cell.row > 1 && worksheet.isRowVisible(cell.row - 1) &&
                neighborWins(worksheet.getCell(cell.row - 1, cell.column).style.borders.bottom)) {
                return;
            }
            BorderRenderer.drawSingleBorder(
                borders, border, rect.x, rect.y, rect.x + rect.width, rect.y,
                graphics, borderIndex, isFirst, fillEdge, blackAndWhite
            );
            break;
        case ExcelBordersIndex.EdgeRight:
            BorderRenderer.drawSingleBorder(
                borders, border, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height,
                graphics, borderIndex, isFirst, fillEdge, blackAndWhite
            );
            break;
        case ExcelBordersIndex.EdgeBottom:
            BorderRenderer.drawSingleBorder(
                borders, border, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height,
                graphics, borderIndex, isFirst, fillEdge, blackAndWhite
            );
            break;
        case ExcelBordersIndex.DiagonalDown:
            if (border.showDiagonalLine) {
                BorderRenderer.drawSingleBorder(
                    borders, border, rect.x, rect.y, rect.x + rect.width, rect.y + rect.height,
                    graphics, borderIndex, isFirst, fillEdge, blackAndWhite
                );
            }
            break;
        case ExcelBordersIndex.DiagonalUp:
            if (border.showDiagonalLine) {
                BorderRenderer.drawSingleBorder(
                    borders, border, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y,
                    graphics, borderIndex, isFirst, fillEdge, blackAndWhite
                );
            }
            break;
        default:
            break;
        }
    }

    private static drawSingleBorder(
        borders: IBorders,
        border: IBorder,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        graphics: PdfGraphics,
        borderIndex: ExcelBordersIndex,
        isFirst: boolean,
        fillEdge: number,
        blackAndWhite: boolean
    ): void {
        if (border.lineStyle === ExcelLineStyle.Double) {
            BorderRenderer.drawDoubleBorder(border, startX, startY, endX, endY, graphics, borderIndex, blackAndWhite);
            return;
        }
        const pen: PdfPen = BorderRenderer.createPen(border, blackAndWhite);
        const hasEdge: (edgeIndex: ExcelBordersIndex) => boolean = (edgeIndex: ExcelBordersIndex): boolean =>
            (fillEdge & (1 << edgeIndex)) !== 0;
        if (!isFirst) {
            if (borderIndex === ExcelBordersIndex.EdgeLeft || borderIndex === ExcelBordersIndex.EdgeRight) {
                if (hasEdge(ExcelBordersIndex.EdgeTop)) { startY -= BorderRenderer.getBorderWidth(borders.top) / 2; }
                if (hasEdge(ExcelBordersIndex.EdgeBottom)) { endY += BorderRenderer.getBorderWidth(borders.bottom) / 2; }
            } else if (borderIndex === ExcelBordersIndex.EdgeTop || borderIndex === ExcelBordersIndex.EdgeBottom) {
                if (hasEdge(ExcelBordersIndex.EdgeLeft)) { startX -= BorderRenderer.getBorderWidth(borders.left) / 2; }
                if (hasEdge(ExcelBordersIndex.EdgeRight)) { endX += BorderRenderer.getBorderWidth(borders.right) / 2; }
            }
        }
        graphics.drawLine(pen, { x: startX, y: startY }, { x: endX, y: endY });
    }

    private static drawDoubleBorder(
        border: IBorder,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        graphics: PdfGraphics,
        borderIndex: ExcelBordersIndex,
        blackAndWhite: boolean
    ): void {
        const pen: PdfPen = BorderRenderer.createPen(border, blackAndWhite);
        let offsetX: number = 1;
        let offsetY: number = 1;
        switch (borderIndex) {
        case ExcelBordersIndex.EdgeBottom: offsetX = 0; offsetY = 1; break;
        case ExcelBordersIndex.EdgeLeft: offsetX = -1; offsetY = 0; break;
        case ExcelBordersIndex.EdgeRight: offsetX = 1; offsetY = 0; break;
        case ExcelBordersIndex.EdgeTop: offsetX = 0; offsetY = -1; break;
        default: break;
        }
        graphics.drawLine(pen, { x: startX - offsetX, y: startY - offsetY }, { x: endX - offsetX, y: endY - offsetY });
        graphics.drawLine(pen, { x: startX + offsetX, y: startY + offsetY }, { x: endX + offsetX, y: endY + offsetY });
    }
}
