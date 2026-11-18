import { PdfShape, PdfShapeElement, Point, Rectangle, _ShapeLayoutContext } from '../pdf-document-helper';
import { PdfBrush, PdfGraphics, PdfGraphicsState, PdfPen } from './pdf-graphics';
import { PdfLayoutBreakType, PdfLayoutType, PdfShapeType } from '../enumerator';
import { PdfPath } from './pdf-path';
import { PdfLayoutFormat, PdfLayoutResult } from './pdf-layouter';
import { PdfPage } from '../pdf-page';
import { PdfDocument } from '../pdf-document';
/**
 * Draws a shape element directly on the specified graphics context.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the shape is drawn.
 * @param {PdfShapeElement} element The shape element to draw.
 * @returns {void} Nothing.
 */
export function _drawOnGraphics( graphics: PdfGraphics, element: PdfShapeElement ): void {
    _validateShapeElement(element);
    const bounds: Rectangle = _getShapeBounds(element.shape);
    const state: PdfGraphicsState = graphics.save();
    try {
        _drawShape(graphics, element, { x: bounds.x, y: bounds.y });
    } finally {
        graphics.restore(state);
    }
}
/**
 * Draws and paginates a shape element from the specified page.
 *
 * @private
 * @param {PdfPage} page The page from which layout begins.
 * @param {PdfShapeElement} element The shape element to draw.
 * @returns {PdfLayoutResult} The result containing the final page and occupied bounds.
 */
export function _drawShapeElementWithPagination(page: PdfPage, element: PdfShapeElement): PdfLayoutResult {
    _validateShapeElement(element);
    const boundsOfShape: Rectangle = _getShapeBounds(element.shape);
    const hasPaginationBounds: boolean = Boolean( element.layoutFormat && element.layoutFormat.paginationBounds );
    const paginationBounds: Rectangle = hasPaginationBounds ? element.layoutFormat.paginationBounds : { x: boundsOfShape.x,
        y: boundsOfShape.y, width: 0, height: 0 };
    const bounds: Rectangle = { x: hasPaginationBounds ? paginationBounds.x : boundsOfShape.x, y: boundsOfShape.y,
        width: hasPaginationBounds ? paginationBounds.width : 0, height: hasPaginationBounds
            ? paginationBounds.height : 0 };
    const format: PdfLayoutFormat = _createLayoutFormat(element);
    const currentBounds: Rectangle = { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    _correctBounds(currentBounds, page);
    const context: _ShapeLayoutContext = { element: element, firstPage: page, currentPage: page, currentBounds: currentBounds,
        shapeBounds: { x: 0, y: 0, width: boundsOfShape.width, height: boundsOfShape.height },
        format: format, resultBounds: { x: currentBounds.x, y: currentBounds.y, width: 0, height: 0 }, isEnd: false };
    const originalX: number = currentBounds.x;
    const originalWidth: number = currentBounds.width;
    while (true) { // eslint-disable-line
        _layoutShapePage(context);
        if (context.isEnd) {
            break;
        }
        if (context.resultBounds.height > 0) {
            context.shapeBounds.y += context.resultBounds.height;
            context.shapeBounds.height -= context.resultBounds.height;
        }
        context.currentPage = _getNextPage(context.currentPage);
        context.currentBounds = _getContinuationBounds(format, originalX, originalWidth);
        _correctBounds(context.currentBounds, context.currentPage);
    }
    return new PdfLayoutResult(context.currentPage, context.resultBounds);
}
/**
 * Creates a layout format from the pagination settings of a shape element.
 *
 * @private
 * @param {PdfShapeElement} element The shape element containing the layout settings.
 * @returns {PdfLayoutFormat} The initialized layout format.
 */
function _createLayoutFormat(element: PdfShapeElement): PdfLayoutFormat {
    const format: PdfLayoutFormat = new PdfLayoutFormat();
    if (element.layoutFormat && element.layoutFormat.layoutType !== undefined) {
        format.layout = element.layoutFormat.layoutType;
    }
    if (element.layoutFormat && element.layoutFormat.breakType !== undefined) {
        format.break = element.layoutFormat.breakType;
    }
    if (element.layoutFormat && element.layoutFormat.paginationBounds) {
        format.paginateBounds = element.layoutFormat.paginationBounds;
    }
    return format;
}
/**
 * Corrects zero or oversized layout dimensions using the remaining page client area.
 *
 * @private
 * @param {Rectangle} bounds The mutable layout bounds to correct.
 * @param {PdfPage} page The page containing the available client area.
 * @returns {void} Nothing.
 */
function _correctBounds(bounds: Rectangle, page: PdfPage): void {
    const availableWidth: number = page.graphics.clientSize.width - bounds.x;
    const availableHeight: number = page.graphics.clientSize.height - bounds.y;
    if (bounds.width === 0 || bounds.width > availableWidth) {
        bounds.width = availableWidth;
    }
    if (bounds.height === 0 || bounds.height > availableHeight) {
        bounds.height = availableHeight;
    }
}
/**
 * Gets the next existing page or creates a continuation page using the current page settings.
 *
 * @private
 * @param {PdfPage} currentPage The current layout page.
 * @returns {PdfPage} The next page used for shape continuation.
 */
function _getNextPage(currentPage: PdfPage): PdfPage {
    const document: PdfDocument = currentPage._crossReference._document;
    if (currentPage._pageIndex + 1 < document.pageCount) {
        return document.getPage(currentPage._pageIndex + 1);
    }
    return document.addPage(currentPage._pageSettings);
}
/**
 * Gets the layout bounds used on a continuation page.
 *
 * @private
 * @param {PdfLayoutFormat} format The layout format containing optional pagination bounds.
 * @param {number} originalX The original horizontal layout position.
 * @param {number} originalWidth The original layout width.
 * @returns {Rectangle} The continuation-page layout bounds.
 */
function _getContinuationBounds(format: PdfLayoutFormat, originalX: number, originalWidth: number): Rectangle {
    if (format.usePaginateBounds && format.paginateBounds) {
        return { x: format.paginateBounds.x, y: format.paginateBounds.y, width: format.paginateBounds.width,
            height: format.paginateBounds.height };
    }
    return { x: originalX, y: 0, width: originalWidth, height: 0 };
}
/**
 * Lays out and draws the current visible portion of a shape on one page.
 *
 * @private
 * @param {_ShapeLayoutContext} context The mutable shape layout context.
 * @returns {void} Nothing.
 */
function _layoutShapePage(context: _ShapeLayoutContext): void {
    const fitToPage: boolean = context.shapeBounds.height <= context.currentBounds.height;
    const canDraw: boolean = !(context.format.break === PdfLayoutBreakType.fitElement && !fitToPage &&
                               context.currentPage === context.firstPage);
    if (canDraw) {
        const graphics: PdfGraphics = context.currentPage.graphics;
        const state: PdfGraphicsState = graphics.save();
        try {
            graphics.setClip(context.currentBounds);
            _drawShape(graphics, context.element, { x: context.currentBounds.x,
                y: context.currentBounds.y - context.shapeBounds.y });
        } finally {
            graphics.restore(state);
        }
        context.resultBounds = { x: context.currentBounds.x, y: context.currentBounds.y, width: context.currentBounds.width, height:
                                 Math.min(context.currentBounds.height, context.shapeBounds.height) };
    } else {
        context.resultBounds = { x: context.currentBounds.x, y: context.currentBounds.y, width: 0, height: 0 };
    }
    context.isEnd = context.format.layout === PdfLayoutType.onePage || Math.trunc(context.currentBounds.height) >=
                                              Math.trunc(context.shapeBounds.height);
}
/**
 * Validates a shape element and its required drawing style.
 *
 * @private
 * @param {PdfShapeElement} element The shape element to validate.
 * @returns {void} Nothing.
 * @throws {Error} Throws an error when the shape or its required pen or brush is missing.
 */
export function _validateShapeElement(element: PdfShapeElement): void {
    if (!element || !element.shape) {
        throw new Error('shape cannot be null or undefined');
    }
    const type: PdfShapeType = element.shape.type;
    const strokeOnly: boolean = type === PdfShapeType.Line || type === PdfShapeType.BezierCurve || type === PdfShapeType.Arc;
    const roundedRectangle: boolean = type === PdfShapeType.RoundedRectangle;
    if (strokeOnly && !element.pen) {
        throw new Error('pen cannot be null or undefined for stroke based shapes');
    }
    if (roundedRectangle && (!element.pen || !element.brush)) {
        throw new Error('pen and brush cannot be null or undefined for rounded rectangle');
    }
    if (!strokeOnly && !roundedRectangle && !element.pen && !element.brush) {
        throw new Error('pen or brush must be defined for stroke and fill based shapes');
    }
}
/**
 * Gets the axis-aligned bounds of the specified shape.
 *
 * @private
 * @param {PdfShape} shape The shape whose bounds are required.
 * @returns {Rectangle} The axis-aligned bounds of the shape.
 */
function _getShapeBounds(shape: PdfShape): Rectangle {
    switch (shape.type) {
    case PdfShapeType.Line:
        return _getPointBounds([shape.start, shape.end]);
    case PdfShapeType.BezierCurve:
        return _getPointBounds([shape.start, shape.first, shape.second, shape.end]);
    case PdfShapeType.Arc:
    case PdfShapeType.Rectangle:
    case PdfShapeType.RoundedRectangle:
    case PdfShapeType.Ellipse:
    case PdfShapeType.Pie:
        return { x: shape.bounds.x, y: shape.bounds.y, width: shape.bounds.width, height: shape.bounds.height };
    case PdfShapeType.Polygon:
        return _getPointBounds(shape.points);
    case PdfShapeType.Path:
        const pathBounds: number[] = shape.path._getBounds(); // eslint-disable-line
        return { x: pathBounds[0], y: pathBounds[1], width: pathBounds[2], height: pathBounds[3] };
    }
}
/* eslint-disable */
/**
 * Calculates the axis-aligned bounds of the specified points.
 *
 * @private
 * @param {Point[]} points The points used to calculate the bounds.
 * @returns {Rectangle} The calculated point bounds, or zero bounds when the collection is empty.
 */
function _getPointBounds(points: Point[]): Rectangle {
    if (points.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    let minX: number = points[0].x;
    let maxX: number = points[0].x;
    let minY: number = points[0].y;
    let maxY: number = points[0].y;
    for (let i: number = 1; i < points.length; i++) {
        minX = Math.min(minX, points[i].x);
        maxX = Math.max(maxX, points[i].x);
        minY = Math.min(minY, points[i].y);
        maxY = Math.max(maxY, points[i].y);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
/* eslint-enable */
/**
 * Draws the specified shape element at the provided location.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the shape is drawn.
 * @param {PdfShapeElement} element The shape element containing the geometry and drawing style.
 * @param {Point} location The location at which the shape is drawn.
 * @returns {void} Nothing.
 */
function _drawShape(graphics: PdfGraphics, element: PdfShapeElement, location: Point): void {
    const shape: PdfShape = element.shape;
    const bounds: Rectangle = _getShapeBounds(shape);
    const pen: PdfPen = element.pen;
    const brush: PdfBrush = element.brush;
    const state: PdfGraphicsState = graphics.save();
    try {
        graphics.translateTransform(location);
        switch (shape.type) {
        case PdfShapeType.Line:
            graphics.drawLine(pen, { x: shape.start.x - bounds.x, y: shape.start.y - bounds.y },
                              { x: shape.end.x - bounds.x, y: shape.end.y - bounds.y });
            break;
        case PdfShapeType.BezierCurve:
            graphics.drawBezier({ x: shape.start.x - bounds.x, y: shape.start.y - bounds.y },
                                { x: shape.first.x - bounds.x, y: shape.first.y - bounds.y },
                                { x: shape.second.x - bounds.x, y: shape.second.y - bounds.y },
                                { x: shape.end.x - bounds.x, y: shape.end.y - bounds.y }, pen);
            break;
        case PdfShapeType.Arc:
            graphics.drawArc({ x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height },
                             shape.startAngle, shape.sweepAngle, pen);
            break;
        case PdfShapeType.Rectangle:
            _drawRectangle(graphics, { x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height }, pen, brush);
            break;
        case PdfShapeType.RoundedRectangle:
            _drawRoundedRectangle(graphics, { x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height },
                                  shape.radius, pen, brush);
            break;
        case PdfShapeType.Ellipse:
            _drawEllipse(graphics, { x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height }, pen, brush);
            break;
        case PdfShapeType.Pie:
            _drawPie(graphics, { x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height },
                     shape.startAngle, shape.sweepAngle, pen, brush);
            break;
        case PdfShapeType.Polygon:
            const points: Point[] = shape.points.map((point: Point): Point => ({ x: point.x - bounds.x, y: point.y - bounds.y })); // eslint-disable-line
            _drawPolygon(graphics, points, pen, brush);
            break;
        case PdfShapeType.Path:
            _drawPath(graphics, shape.path, bounds, pen, brush);
            break;
        }
    } finally {
        graphics.restore(state);
    }
}
/**
 * Draws a rectangle using the specified pen and brush.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the rectangle is drawn.
 * @param {Rectangle} bounds The bounds of the rectangle.
 * @param {PdfPen} pen The pen used to stroke the rectangle.
 * @param {PdfBrush} brush The brush used to fill the rectangle.
 * @returns {void} Nothing.
 */
function _drawRectangle(graphics: PdfGraphics, bounds: Rectangle, pen: PdfPen, brush: PdfBrush): void {
    if (pen && brush) {
        graphics.drawRectangle(bounds, pen, brush);
    } else if (brush) {
        graphics.drawRectangle(bounds, brush);
    } else {
        graphics.drawRectangle(bounds, pen);
    }
}
/**
 * Draws a rectangle using the specified pen and brush.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the rectangle is drawn.
 * @param {Rectangle} bounds The bounds of the rectangle.
 * @param {PdfPen} pen The pen used to stroke the rectangle.
 * @param {PdfBrush} brush The brush used to fill the rectangle.
 * @returns {void} Nothing.
 */
function _drawEllipse(graphics: PdfGraphics, bounds: Rectangle, pen: PdfPen, brush: PdfBrush): void {
    if (pen && brush) {
        graphics.drawEllipse(bounds, pen, brush);
    } else if (brush) {
        graphics.drawEllipse(bounds, brush);
    } else {
        graphics.drawEllipse(bounds, pen);
    }
}
/**
 * Draws a pie shape using the specified bounds, angles, pen, and brush.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the pie shape is drawn.
 * @param {Rectangle} bounds The pie bounds.
 * @param {number} startAngle The start angle of the pie shape.
 * @param {number} sweepAngle The sweep angle of the pie shape.
 * @param {PdfPen} pen The pen used to stroke the pie shape.
 * @param {PdfBrush} brush The brush used to fill the pie shape.
 * @returns {void} Nothing.
 */
function _drawPie(graphics: PdfGraphics, bounds: Rectangle, startAngle: number, sweepAngle: number, pen: PdfPen, brush: PdfBrush): void {
    if (pen && brush) {
        graphics.drawPie(bounds, startAngle, sweepAngle, pen, brush);
    } else if (brush) {
        graphics.drawPie(bounds, startAngle, sweepAngle, brush);
    } else {
        graphics.drawPie(bounds, startAngle, sweepAngle, pen);
    }
}
/**
 * Draws a polygon using the specified points, pen, and brush.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the polygon is drawn.
 * @param {Point[]} points The points that define the polygon.
 * @param {PdfPen} pen The pen used to stroke the polygon.
 * @param {PdfBrush} brush The brush used to fill the polygon.
 * @returns {void} Nothing.
 */
function _drawPolygon(graphics: PdfGraphics, points: Point[], pen: PdfPen, brush: PdfBrush): void {
    if (pen && brush) {
        graphics.drawPolygon(points, pen, brush);
    } else if (brush) {
        graphics.drawPolygon(points, brush);
    } else {
        graphics.drawPolygon(points, pen);
    }
}
/**
 * Draws an existing PDF path after normalizing the path to its local bounds.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the path is drawn.
 * @param {PdfPath} path The PDF path to draw.
 * @param {Rectangle} bounds The original bounds of the path.
 * @param {PdfPen} pen The pen used to stroke the path.
 * @param {PdfBrush} brush The brush used to fill the path.
 * @returns {void} Nothing.
 */
function _drawPath(graphics: PdfGraphics, path: PdfPath, bounds: Rectangle, pen: PdfPen, brush: PdfBrush): void {
    const state: PdfGraphicsState = graphics.save();
    try {
        graphics.translateTransform({ x: -bounds.x, y: -bounds.y });
        if (pen && brush) {
            graphics.drawPath(path, pen, brush);
        } else if (brush) {
            graphics.drawPath(path, brush);
        } else {
            graphics.drawPath(path, pen);
        }
    } finally {
        graphics.restore(state);
    }
}
/**
 * Creates and draws a rounded rectangle path using the specified radius, pen, and brush.
 *
 * @private
 * @param {PdfGraphics} graphics The graphics context on which the rounded rectangle is drawn.
 * @param {Rectangle} bounds The rounded rectangle bounds.
 * @param {number} radius The corner radius of the rounded rectangle.
 * @param {PdfPen} pen The pen used to stroke the rounded rectangle.
 * @param {PdfBrush} brush The brush used to fill the rounded rectangle.
 * @returns {void} Nothing.
 */
function _drawRoundedRectangle(graphics: PdfGraphics, bounds: Rectangle, radius: number, pen: PdfPen, brush: PdfBrush): void {
    const diameter: number = Math.min(radius * 2, Math.min(bounds.width, bounds.height));
    const path: PdfPath = new PdfPath();
    path.addArc({ x: bounds.x, y: bounds.y, width: diameter, height: diameter }, 180, 90);
    path.addLine({ x: bounds.x + radius, y: bounds.y }, { x: bounds.x + bounds.width - radius, y: bounds.y });
    path.addArc({ x: bounds.x + bounds.width - diameter, y: bounds.y, width: diameter, height: diameter }, 270, 90);
    path.addLine({ x: bounds.x + bounds.width, y: bounds.y + radius },
                 { x: bounds.x + bounds.width, y: bounds.y + bounds.height - radius });
    path.addArc({ x: bounds.x + bounds.width - diameter, y: bounds.y + bounds.height - diameter, width: diameter, height: diameter },
                0, 90);
    path.addLine({ x: bounds.x + bounds.width - radius, y: bounds.y + bounds.height },
                 { x: bounds.x + radius, y: bounds.y + bounds.height });
    path.addArc({ x: bounds.x, y: bounds.y + bounds.height - diameter, width: diameter, height: diameter }, 90, 90);
    path.closeFigure();
    graphics.drawPath(path, pen, brush);
}
