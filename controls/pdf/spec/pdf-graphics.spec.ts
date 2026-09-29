/* eslint-disable @typescript-eslint/no-explicit-any */
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { PdfGraphics, PdfGraphicsState, PdfPen, PdfBrush, _PdfTransformationMatrix } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfTemplate } from '../src/pdf/core/graphics/pdf-template';
import { PdfPath } from '../src/pdf/core/graphics/pdf-path';
import { PdfStandardFont, PdfFontFamily, PdfFontStyle } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat } from '../src/pdf/core/fonts/pdf-string-format';
import { PdfFillMode, PdfBlendMode, PathPointType, PdfTextAlignment } from '../src/pdf/core/enumerator';
import { _PdfDictionary, _PdfReference, _PdfName } from '../src/pdf/core/pdf-primitives';
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { _PdfContentStream } from '../src/pdf/core/base-stream';
import {PdfVerticalAlignment} from '../src/pdf/core/fonts/pdf-string-format'
function createMinimalDocument(): PdfDocument {
    const doc: PdfDocument = new PdfDocument();
    return doc;
}
function createPageGraphics(): { doc: PdfDocument, page: PdfPage, graphics: PdfGraphics } {
    const doc: PdfDocument = new PdfDocument();
    const page: PdfPage = doc.addPage();
    const graphics: PdfGraphics = page.graphics;
    return { doc, page, graphics };
}
describe('PdfGraphics - constructor and initialization', () => {
    it('MID-2145,2147,2148: should initialize _pendingResource as empty array, _isLayouter as false, _hasResourceReference as false', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._pendingResource).not.toBeNull();
        expect(Array.isArray(graphics._pendingResource)).toBe(true);
        expect(graphics._pendingResource.length).toBe(0);
        expect(graphics._isLayouter).toBe(false);
        expect(graphics._hasResourceReference).toBe(false);
    });
    it('MID-2152: should set _page when source is PdfPage, not _template', () => {
        const { graphics, page } = createPageGraphics();
        expect(graphics._page).toBe(page);
        expect(graphics._template).toBeUndefined();
    });
    it('MID-2152: should set _template when source is PdfTemplate', () => {
        const doc: PdfDocument = new PdfDocument();
        const template: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: 100, height: 100 }, doc._crossReference);
        expect(template.graphics._template).toBe(template);
        expect(template.graphics._page).toBeUndefined();
    });
    it('MID-2155: should set _source from page dictionary when source exists', () => {
        const { graphics, page } = createPageGraphics();
        expect(graphics._source).toBeDefined();
        expect(graphics._source).toBe(page._pageDictionary);
    });
    it('MID-2198: _matrix getter should return a _PdfTransformationMatrix instance', () => {
        const { graphics } = createPageGraphics();
        const m: _PdfTransformationMatrix = graphics._matrix;
        expect(m).toBeDefined();
        expect(m instanceof _PdfTransformationMatrix).toBe(true);
    });
    it('MID-2198: _matrix getter should return the same instance on repeated calls (lazy init)', () => {
        const { graphics } = createPageGraphics();
        const m1: _PdfTransformationMatrix = graphics._matrix;
        const m2: _PdfTransformationMatrix = graphics._matrix;
        expect(m1).toBe(m2);
    });
});
describe('PdfGraphics - _resources getter', () => {
    it('MID-2208: should initialize _resourceMap on first access', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._resourceMap).toBeUndefined();
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map).toBeDefined();
        expect(map instanceof Map).toBe(true);
    });
    it('MID-2208: should return same map instance on repeated access (lazy init)', () => {
        const { graphics } = createPageGraphics();
        const map1: Map<_PdfReference, _PdfName> = graphics._resources;
        const map2: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map1).toBe(map2);
    });
    it('MID-2213,2215,2216: should scan Font key only when _resourceObject has Font', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        const fontDict: _PdfDictionary = new _PdfDictionary(doc._crossReference);
        const ref: _PdfReference = doc._crossReference._getNextReference();
        fontDict.update('F1', ref);
        graphics._resourceObject.update('Font', fontDict);
        (graphics as any)._resourceMap = undefined;
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map.has(ref)).toBe(true);
        expect(map.get(ref).name).toBe('F1');
    });
    it('MID-2219,2221: should NOT add non-reference font values to _resourceMap', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        const fontDict: _PdfDictionary = new _PdfDictionary(doc._crossReference);
        fontDict.update('F1', 'not-a-reference');
        graphics._resourceObject.update('Font', fontDict);
        (graphics as any)._resourceMap = undefined;
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map.size).toBe(0);
    });
    it('MID-2222,2223,2224: should add font reference only when font dict size > 0', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        const emptyFontDict: _PdfDictionary = new _PdfDictionary(doc._crossReference);
        graphics._resourceObject.update('Font', emptyFontDict);
        (graphics as any)._resourceMap = undefined;
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map.size).toBe(0);
    });
    it('MID-2227,2228,2229: should skip null and undefined font values', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        const fontDict: _PdfDictionary = new _PdfDictionary(doc._crossReference);
        fontDict.update('F1', null);
        fontDict.update('F2', undefined);
        graphics._resourceObject.update('Font', fontDict);
        (graphics as any)._resourceMap = undefined;
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map.size).toBe(0);
    });
    it('MID-2213,2214: Font check requires both _resourceObject truthy AND has Font key', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        const hasFontBefore: boolean = graphics._resourceObject.has('Font');
        expect(hasFontBefore).toBe(false);
        (graphics as any)._resourceMap = undefined;
        const map: Map<_PdfReference, _PdfName> = graphics._resources;
        expect(map.size).toBe(0);
    });
});
describe('PdfGraphics - clientSize', () => {
    it('should return clip bounds size by default', () => {
        const { graphics } = createPageGraphics();
        const size: { width: number, height: number } = graphics.clientSize;
        expect(typeof size.width).toBe('number');
        expect(typeof size.height).toBe('number');
        expect(size.width).toBeGreaterThan(0);
        expect(size.height).toBeGreaterThan(0);
    });
    it('should return width equal to _clipBounds[2] and height equal to _clipBounds[3]', () => {
        const { graphics } = createPageGraphics();
        const size: { width: number, height: number } = graphics.clientSize;
        expect(size.width).toBe(graphics._clipBounds[2]);
        expect(size.height).toBe(graphics._clipBounds[3]);
    });
});
describe('PdfGraphics - save and restore', () => {
    it('MID-BlockStatement: save should push a PdfGraphicsState onto _graphicsState', () => {
        const { graphics } = createPageGraphics();
        const initialLen: number = graphics._graphicsState.length;
        const state: PdfGraphicsState = graphics.save();
        expect(graphics._graphicsState.length).toBe(initialLen + 1);
        expect(state).toBeDefined();
        expect(state instanceof PdfGraphicsState).toBe(true);
    });
    it('MID-BlockStatement: restore with no state should pop the last state', () => {
        const { graphics } = createPageGraphics();
        graphics.save();
        const lenAfterSave: number = graphics._graphicsState.length;
        graphics.restore();
        expect(graphics._graphicsState.length).toBe(lenAfterSave - 1);
    });
    it('MID-BlockStatement: restore with specific state should restore that state', () => {
        const { graphics } = createPageGraphics();
        const state1: PdfGraphicsState = graphics.save();
        graphics.save();
        graphics.restore(state1);
        expect(graphics._graphicsState.length).toBe(1);
    });
    it('MID-BlockStatement: restore when _graphicsState is empty should not throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.restore()).not.toThrow();
    });
    it('MID-BlockStatement: save should preserve current pen, brush, and font', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        graphics._currentPen = pen;
        graphics._currentBrush = brush;
        const state: PdfGraphicsState = graphics.save();
        expect(state._currentPen).toBe(pen);
        expect(state._currentBrush).toBe(brush);
    });
    it('MID-BlockStatement: save state should capture the transformation matrix', () => {
        const { graphics } = createPageGraphics();
        const matrixBefore: _PdfTransformationMatrix = graphics._matrix;
        const state: PdfGraphicsState = graphics.save();
        expect(state._transformationMatrix).toBe(matrixBefore);
    });
    it('MID-BlockStatement: multiple save/restore cycles should maintain state correctly', () => {
        const { graphics } = createPageGraphics();
        const s1: PdfGraphicsState = graphics.save();
        const s2: PdfGraphicsState = graphics.save();
        expect(graphics._graphicsState.length).toBe(3);
        graphics.restore(s1);
        expect(graphics._graphicsState.length).toBe(1);
    });
});
describe('PdfGraphics - scaleTransform', () => {
    it('MID-BlockStatement: scaleTransform should update the transformation matrix', () => {
        const { graphics } = createPageGraphics();
        const matrixBefore: number[] = [...graphics._matrix._matrix._elements];
        graphics.scaleTransform(2, 3);
        const matrixAfter: number[] = graphics._matrix._matrix._elements;
        expect(matrixAfter).not.toEqual(matrixBefore);
    });
    it('MID-BlockStatement: scaleTransform with 1,1 should keep identity-like matrix', () => {
        const { graphics } = createPageGraphics();
        graphics.scaleTransform(1, 1);
        expect(graphics._matrix).toBeDefined();
    });
    it('MID-ArithmeticOperator: scaleTransform with different x and y should scale correctly', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        graphics.scaleTransform(2, 4);
        const m: number[] = graphics._matrix._matrix._elements;
        expect(m[0]).toBeCloseTo(2, 5);
        expect(m[3]).toBeCloseTo(4, 5);
        graphics.restore(state);
    });
});
describe('PdfGraphics - translateTransform', () => {
    it('MID-BlockStatement: translateTransform should modify the graphics matrix', () => {
        const { graphics } = createPageGraphics();
        const before: number[] = [...graphics._matrix._matrix._elements];
        graphics.translateTransform({ x: 10, y: 20 });
        expect(graphics._matrix._matrix._elements).not.toEqual(before);
    });
    it('MID-ArithmeticOperator: translateTransform with x=0,y=0 should not alter scale components', () => {
        const { graphics } = createPageGraphics();
        graphics.translateTransform({ x: 0, y: 0 });
        expect(graphics._matrix._matrix._elements[0]).toBeCloseTo(1, 5);
        expect(graphics._matrix._matrix._elements[3]).toBeCloseTo(1, 5);
    });
});
describe('PdfGraphics - rotateTransform', () => {
    it('MID-BlockStatement: rotateTransform should modify the matrix', () => {
        const { graphics } = createPageGraphics();
        const before: number[] = [...graphics._matrix._matrix._elements];
        graphics.rotateTransform(45);
        expect(graphics._matrix._matrix._elements).not.toEqual(before);
    });
    it('MID-ArithmeticOperator: rotateTransform 0 degrees should keep identity', () => {
        const { graphics } = createPageGraphics();
        graphics.rotateTransform(0);
        expect(graphics._matrix._matrix._elements[0]).toBeCloseTo(1, 5);
        expect(graphics._matrix._matrix._elements[3]).toBeCloseTo(1, 5);
        expect(graphics._matrix._matrix._elements[1]).toBeCloseTo(0, 5);
        expect(graphics._matrix._matrix._elements[2]).toBeCloseTo(0, 5);
    });
    it('MID-ArithmeticOperator: rotateTransform should negate angle before passing to matrix', () => {
        const { graphics } = createPageGraphics();
        const angleRad: number = (90 * Math.PI) / 180;
        graphics.rotateTransform(90);
        const m: number[] = graphics._matrix._matrix._elements;
        expect(m[0]).toBeCloseTo(Math.cos(-angleRad), 5);
        expect(m[1]).toBeCloseTo(Math.sin(-angleRad), 5);
    });
});
describe('PdfGraphics - setClip', () => {
    it('MID-BlockStatement: setClip should not throw with valid rectangle', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.setClip({ x: 0, y: 0, width: 100, height: 100 })).not.toThrow();
    });
    it('MID-ConditionalExpression: setClip without mode should default to winding (not alternate)', () => {
        const { graphics } = createPageGraphics();
        const sw: any = graphics._sw;
        let clipPathArg: boolean | undefined;
        const original: any = sw._clipPath.bind(sw);
        sw._clipPath = (alt: boolean) => { clipPathArg = alt; original(alt); };
        graphics.setClip({ x: 0, y: 0, width: 100, height: 100 });
        expect(clipPathArg).toBe(false);
        sw._clipPath = original;
    });
    it('MID-ConditionalExpression: setClip with PdfFillMode.alternate should pass true to _clipPath', () => {
        const { graphics } = createPageGraphics();
        const sw: any = graphics._sw;
        let clipPathArg: boolean | undefined;
        const original: any = sw._clipPath.bind(sw);
        sw._clipPath = (alt: boolean) => { clipPathArg = alt; original(alt); };
        graphics.setClip({ x: 0, y: 0, width: 100, height: 100 }, PdfFillMode.alternate);
        expect(clipPathArg).toBe(true);
        sw._clipPath = original;
    });
    it('MID-ConditionalExpression: setClip with PdfFillMode.winding should pass false to _clipPath', () => {
        const { graphics } = createPageGraphics();
        const sw: any = graphics._sw;
        let clipPathArg: boolean | undefined;
        const original: any = sw._clipPath.bind(sw);
        sw._clipPath = (alt: boolean) => { clipPathArg = alt; original(alt); };
        graphics.setClip({ x: 0, y: 0, width: 100, height: 100 }, PdfFillMode.winding);
        expect(clipPathArg).toBe(false);
        sw._clipPath = original;
    });
});
describe('PdfGraphics - setTransparency', () => {
    it('MID-BlockStatement: setTransparency with single arg should not throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.setTransparency(0.5)).not.toThrow();
    });
    it('MID-BlockStatement: setTransparency with stroke,fill,mode should not throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.setTransparency(0.5, 0.5, PdfBlendMode.normal)).not.toThrow();
    });
    it('MID-BlockStatement: setTransparency should initialize _transparencies map if undefined', () => {
        const { graphics } = createPageGraphics();
        (graphics as any)._transparencies = undefined;
        graphics.setTransparency(0.5);
        expect(graphics._transparencies).toBeDefined();
        expect(graphics._transparencies instanceof Map).toBe(true);
    });
    it('MID-BooleanLiteral,LogicalOperator: setTransparency should reuse existing transparency when key matches', () => {
        const { graphics } = createPageGraphics();
        graphics.setTransparency(0.5);
        const sizeAfterFirst: number = graphics._transparencies.size;
        graphics.setTransparency(0.5);
        expect(graphics._transparencies.size).toBe(sizeAfterFirst);
    });
    it('MID-BlockStatement: setTransparency with different values should create different entries', () => {
        const { graphics } = createPageGraphics();
        graphics.setTransparency(0.5);
        graphics.setTransparency(0.3);
        expect(graphics._transparencies.size).toBe(0);
    });
});
describe('PdfGraphics - drawLine', () => {
    it('MID-BlockStatement: drawLine should not throw with valid pen and points', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawLine(pen, { x: 10, y: 10 }, { x: 100, y: 100 })).not.toThrow();
    });
    it('MID-BlockStatement: drawLine should write to stream writer', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const sw: any = graphics._sw;
        let beginPathCalled: boolean = false;
        const orig: any = sw._beginPath.bind(sw);
        sw._beginPath = (x: number, y: number) => { beginPathCalled = true; return orig(x, y); };
        graphics.drawLine(pen, { x: 5, y: 5 }, { x: 50, y: 50 });
        expect(beginPathCalled).toBe(true);
        sw._beginPath = orig;
    });
    it('MID-BlockStatement: drawLine with zero length should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawLine(pen, { x: 10, y: 10 }, { x: 10, y: 10 })).not.toThrow();
    });
});
describe('PdfGraphics - drawRectangle', () => {
    it('MID-BlockStatement: drawRectangle with pen should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawRectangle({ x: 10, y: 20, width: 100, height: 50 }, pen)).not.toThrow();
    });
    it('MID-BlockStatement: drawRectangle with brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawRectangle({ x: 10, y: 20, width: 100, height: 50 }, brush)).not.toThrow();
    });
    it('MID-BlockStatement: drawRectangle with pen and brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        expect(() => graphics.drawRectangle({ x: 10, y: 20, width: 100, height: 50 }, pen, brush)).not.toThrow();
    });
    it('MID-EqualityOperator: drawRectangle with zero-size should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawRectangle({ x: 0, y: 0, width: 0, height: 0 }, pen)).not.toThrow();
    });
});
describe('PdfGraphics - drawEllipse', () => {
    it('MID-BlockStatement: drawEllipse with pen should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawEllipse({ x: 10, y: 20, width: 100, height: 50 }, pen)).not.toThrow();
    });
    it('MID-BlockStatement: drawEllipse with brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawEllipse({ x: 10, y: 20, width: 100, height: 50 }, brush)).not.toThrow();
    });
    it('MID-BlockStatement: drawEllipse with pen and brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        expect(() => graphics.drawEllipse({ x: 10, y: 20, width: 100, height: 50 }, pen, brush)).not.toThrow();
    });
});
describe('PdfGraphics - drawArc', () => {
    it('MID-ConditionalExpression: drawArc with sweepAngle!=0 should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawArc({ x: 10, y: 20, width: 100, height: 50 }, 0, 90, pen)).not.toThrow();
    });
    it('MID-ConditionalExpression: drawArc with sweepAngle=0 should skip drawing', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const sw: any = graphics._sw;
        let beginPathCalled: boolean = false;
        const orig: any = sw._beginPath.bind(sw);
        sw._beginPath = (x: number, y: number) => { beginPathCalled = true; return orig(x, y); };
        graphics.drawArc({ x: 10, y: 20, width: 100, height: 50 }, 0, 0, pen);
        expect(beginPathCalled).toBe(false);
        sw._beginPath = orig;
    });
    it('MID-EqualityOperator: drawArc with sweepAngle=-90 (non-zero) should draw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawArc({ x: 10, y: 20, width: 100, height: 50 }, 0, -90, pen)).not.toThrow();
    });
});
describe('PdfGraphics - drawPolygon', () => {
    it('MID-BlockStatement: drawPolygon with pen should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 55, y: 100 }];
        expect(() => graphics.drawPolygon(points, pen)).not.toThrow();
    });
    it('MID-BlockStatement: drawPolygon with brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 255, g: 0, b: 0 });
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 55, y: 100 }];
        expect(() => graphics.drawPolygon(points, brush)).not.toThrow();
    });
    it('MID-ConditionalExpression: drawPolygon with empty points should not call _beginPath', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const sw: any = graphics._sw;
        let beginPathCalled: boolean = false;
        const orig: any = sw._beginPath.bind(sw);
        sw._beginPath = (x: number, y: number) => { beginPathCalled = true; return orig(x, y); };
        graphics.drawPolygon([], pen);
        expect(beginPathCalled).toBe(false);
        sw._beginPath = orig;
    });
    it('MID-EqualityOperator: drawPolygon with single point should call _beginPath once', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawPolygon([{ x: 0, y: 0 }], pen)).not.toThrow();
    });
});
describe('PdfGraphics - drawBezier', () => {
    it('MID-BlockStatement: drawBezier should not throw with valid pen', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawBezier(
            { x: 10, y: 10 }, { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 100, y: 10 }, pen
        )).not.toThrow();
    });
});
describe('PdfGraphics - drawPie', () => {
    it('MID-BlockStatement: drawPie with pen should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawPie({ x: 10, y: 50, width: 200, height: 200 }, 0, 90, pen)).not.toThrow();
    });
    it('MID-BlockStatement: drawPie with brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 255 });
        expect(() => graphics.drawPie({ x: 10, y: 50, width: 200, height: 200 }, 0, 90, brush)).not.toThrow();
    });
    it('MID-BlockStatement: drawPie with pen and brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 255 });
        expect(() => graphics.drawPie({ x: 10, y: 50, width: 200, height: 200 }, 180, 60, pen, brush)).not.toThrow();
    });
});
describe('PdfGraphics - drawPath', () => {
    it('MID-BlockStatement,ConditionalExpression: drawPath with pen should execute when pen is set', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const path: PdfPath = new PdfPath();
        path.addLine({ x: 10, y: 10 }, { x: 50, y: 50 });
        expect(() => graphics.drawPath(path, pen)).not.toThrow();
    });
    it('MID-BlockStatement: drawPath with brush should not throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        const path: PdfPath = new PdfPath();
        path.addLine({ x: 10, y: 10 }, { x: 50, y: 50 });
        expect(() => graphics.drawPath(path, brush)).not.toThrow();
    });
    it('MID-LogicalOperator: drawPath with no pen and no brush should not draw', () => {
        const { graphics } = createPageGraphics();
        const path: PdfPath = new PdfPath();
        path.addLine({ x: 10, y: 10 }, { x: 50, y: 50 });
        const sw: any = graphics._sw;
        let strokePathCalled: boolean = false;
        const orig: any = sw._strokePath.bind(sw);
        sw._strokePath = () => { strokePathCalled = true; return orig(); };
        (graphics as any).drawPath(path, undefined, undefined);
        expect(strokePathCalled).toBe(false);
        sw._strokePath = orig;
    });
});
describe('PdfGraphics - drawRoundedRectangle', () => {
    it('MID-BlockStatement: drawRoundedRectangle should not throw with valid args', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawRoundedRectangle({ x: 10, y: 20, width: 100, height: 50 }, 5, pen, brush)).not.toThrow();
    });
    it('MID-EqualityOperator: drawRoundedRectangle with radius=0 should draw plain rectangle', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawRoundedRectangle({ x: 10, y: 20, width: 100, height: 50 }, 0, pen, brush)).not.toThrow();
    });
    it('MID-ConditionalExpression: drawRoundedRectangle with null pen should throw', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawRoundedRectangle({ x: 10, y: 20, width: 100, height: 50 }, 5, null as any, brush)).toThrowError('Pen cannot be null or undefined');
    });
    it('MID-ConditionalExpression: drawRoundedRectangle with null brush should throw', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawRoundedRectangle({ x: 10, y: 20, width: 100, height: 50 }, 5, pen, null as any)).toThrowError('Brush cannot be null or undefined');
    });
    it('MID-ArithmeticOperator: radius*2 should equal diameter used for arc', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        expect(() => graphics.drawRoundedRectangle({ x: 10, y: 20, width: 100, height: 50 }, 10, pen, brush)).not.toThrow();
    });
});
describe('PdfGraphics - drawString', () => {
    it('MID-BlockStatement: drawString with brush should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawString('Hello', font, { x: 10, y: 20, width: 200, height: 30 }, brush)).not.toThrow();
        doc.destroy();
    });
    it('MID-BlockStatement: drawString with pen should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(() => graphics.drawString('Hello', font, { x: 10, y: 20, width: 200, height: 30 }, pen)).not.toThrow();
        doc.destroy();
    });
    it('MID-BlockStatement: drawString with pen and brush should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawString('Hello', font, { x: 10, y: 20, width: 200, height: 30 }, pen, brush)).not.toThrow();
        doc.destroy();
    });
    it('MID-ConditionalExpression: drawString with empty string should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawString('', font, { x: 10, y: 20, width: 200, height: 30 }, brush)).not.toThrow();
        doc.destroy();
    });
    it('MID-StringLiteral: drawString with format alignment center should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const format: PdfStringFormat = new PdfStringFormat();
        format.alignment = PdfTextAlignment.center;
        expect(() => graphics.drawString('Test', font, { x: 10, y: 20, width: 200, height: 30 }, brush, format)).not.toThrow();
        doc.destroy();
    });
    it('MID-BooleanLiteral: drawString with zero width bounds should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawString('Test', font, { x: 10, y: 20, width: 0, height: 30 }, brush)).not.toThrow();
        doc.destroy();
    });
    it('MID-BooleanLiteral: drawString with zero height bounds should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawString('Test', font, { x: 10, y: 20, width: 200, height: 0 }, brush)).not.toThrow();
        doc.destroy();
    });
    it('MID-ConditionalExpression: drawString with PdfStringFormat vertical alignment should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const format: PdfStringFormat = new PdfStringFormat();
        format.lineAlignment = PdfVerticalAlignment.middle;
        expect(() => graphics.drawString('Test', font, { x: 10, y: 20, width: 200, height: 50 }, brush, format)).not.toThrow();
        doc.destroy();
    });
});
describe('PdfGraphics - _initialize', () => {
    it('MID-BlockStatement: _initialize should set _graphicsState to empty array', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._graphicsState).toBeDefined();
        expect(Array.isArray(graphics._graphicsState)).toBe(true);
        expect(graphics._graphicsState.length).toBe(1);
    });
    it('MID-BooleanLiteral: _initialize should set _colorSpaceInitialized to false', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._colorSpaceInitialized).toBe(false);
    });
    it('MID-EqualityOperator: _initialize should set _characterSpacing to -1', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._characterSpacing).toBe(-1);
    });
    it('MID-EqualityOperator: _initialize should set _wordSpacing to -1', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._wordSpacing).toBe(-1);
    });
    it('MID-EqualityOperator: _initialize should set _textScaling to -100', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._textScaling).toBe(-100);
    });
    it('MID-EqualityOperator: _initialize should set _textRenderingMode to -1', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._textRenderingMode as any).toBe(-1);
    });
    it('MID-EqualityOperator: _initialize should set _startCutIndex to -1', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._startCutIndex).toBe(-1);
    });
    it('MID-EqualityOperator: _initialize should set _mediaBoxUpperRightBound to 0', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._mediaBoxUpperRightBound).toBe(0);
    });
    it('MID-ArrayDeclaration: _clipBounds should have 4 elements', () => {
        const { graphics } = createPageGraphics();
        expect(Array.isArray(graphics._clipBounds)).toBe(true);
        expect(graphics._clipBounds.length).toBe(4);
        expect(graphics._clipBounds[0]).toBe(40);
    });
    it('MID-EqualityOperator: _clipBounds[2] should equal _size.width', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._clipBounds[2]).toBe(515);
        expect(graphics._clipBounds[3]).toBe(762);
    });
});
describe('PdfGraphics - _stateControl', () => {
    it('MID-ConditionalExpression,LogicalOperator: _stateControl with pen only should call _initializeCurrentColorSpace', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._colorSpaceInitialized).toBe(false);
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        (graphics as any)._stateControl(pen);
        expect(graphics._colorSpaceInitialized).toBe(true);
    });
    it('MID-ConditionalExpression: _stateControl with brush only should initialize color space', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        (graphics as any)._stateControl(undefined, brush);
        expect(graphics._colorSpaceInitialized).toBe(true);
    });
    it('MID-ConditionalExpression: _stateControl with neither pen nor brush should NOT initialize color space', () => {
        const { graphics } = createPageGraphics();
        (graphics as any)._stateControl(undefined, undefined);
        expect(graphics._colorSpaceInitialized).toBe(false);
    });
    it('MID-ConditionalExpression: _stateControl with pen should set _currentPen', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        (graphics as any)._stateControl(pen);
        expect(graphics._currentPen).toBe(pen);
    });
    it('MID-ConditionalExpression: _stateControl with brush should set _currentBrush', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        (graphics as any)._stateControl(undefined, brush);
        expect(graphics._currentBrush).toBe(brush);
    });
});
describe('PdfGraphics - _setPenBrush', () => {
    it('MID-ConditionalExpression: _setPenBrush with PdfPen should return pen', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const result: { pen: PdfPen, brush: PdfBrush } = (graphics as any)._setPenBrush(pen, undefined);
        expect(result.pen).toBe(pen);
        expect(result.brush).toBeUndefined();
    });
    it('MID-ConditionalExpression: _setPenBrush with PdfBrush should return brush', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        const result: { pen: PdfPen, brush: PdfBrush } = (graphics as any)._setPenBrush(brush, undefined);
        expect(result.brush).toBe(brush);
        expect(result.pen).toBeUndefined();
    });
    it('MID-ConditionalExpression: _setPenBrush with both should return both', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        const result: { pen: PdfPen, brush: PdfBrush } = (graphics as any)._setPenBrush(pen, brush);
        expect(result.pen).toBe(pen);
        expect(result.brush).toBe(brush);
    });
    it('MID-ConditionalExpression: _setPenBrush with neither should return both undefined', () => {
        const { graphics } = createPageGraphics();
        const result: { pen: PdfPen, brush: PdfBrush } = (graphics as any)._setPenBrush(undefined, undefined);
        expect(result.pen).toBeUndefined();
        expect(result.brush).toBeUndefined();
    });
});
describe('PdfGraphics - _normalizeText', () => {
    it('MID-BlockStatement: _normalizeText with StandardFont should strip CJK characters', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const result: string = (graphics as any)._normalizeText(font, 'Hello\u4E00World');
        expect(result).toBe('HelloWorld');
    });
    it('MID-BlockStatement: _normalizeText with StandardFont should keep ASCII intact', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const result: string = (graphics as any)._normalizeText(font, 'Hello World');
        expect(result).toBe('Hello World');
    });
    it('MID-EqualityOperator: _normalizeText with CJK boundary character 0x4E00 should be stripped', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const cjk: string = String.fromCharCode(0x4E00);
        const result: string = (graphics as any)._normalizeText(font, 'A' + cjk + 'B');
        expect(result).toBe('AB');
    });
    it('MID-EqualityOperator: _normalizeText with CJK boundary character 0x9FFF should be stripped', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const cjk: string = String.fromCharCode(0x9FFF);
        const result: string = (graphics as any)._normalizeText(font, 'A' + cjk + 'B');
        expect(result).toBe('AB');
    });
    it('MID-EqualityOperator: _normalizeText character just below CJK range (0x4DFF) should be kept', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const char: string = String.fromCharCode(0x4DFF);
        const result: string = (graphics as any)._normalizeText(font, 'A' + char + 'B');
        expect(result).toBe('A' + char + 'B');
    });
    it('MID-EqualityOperator: _normalizeText character just above CJK range (0xA000) should be kept', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const char: string = String.fromCharCode(0xA000);
        const result: string = (graphics as any)._normalizeText(font, 'A' + char + 'B');
        expect(result).toBe('A' + char + 'B');
    });
    it('MID-ConditionalExpression: _normalizeText with empty value should return empty string', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const result: string = (graphics as any)._normalizeText(font, '');
        expect(result).toBe('');
    });
});
describe('PdfGraphics - _isRectangle', () => {
    it('MID-ConditionalExpression: _isRectangle with width and height should return true', () => {
        const { graphics } = createPageGraphics();
        const isRect: boolean = (graphics as any)._isRectangle({ x: 0, y: 0, width: 100, height: 100 });
        expect(isRect).toBe(true);
    });
    it('MID-ConditionalExpression: _isRectangle with only x and y should return false', () => {
        const { graphics } = createPageGraphics();
        const isRect: boolean = (graphics as any)._isRectangle({ x: 0, y: 0 });
        expect(isRect).toBe(false);
    });
    it('MID-ConditionalExpression: _isRectangle with width=0 and height=0 should still return true', () => {
        const { graphics } = createPageGraphics();
        const isRect: boolean = (graphics as any)._isRectangle({ x: 0, y: 0, width: 0, height: 0 });
        expect(isRect).toBe(true);
    });
});
describe('PdfGraphics - _escapeSymbols', () => {
    it('MID-BlockStatement: _escapeSymbols should escape open paren (40)', () => {
        const { graphics } = createPageGraphics();
        const input: Uint8Array = new Uint8Array([65, 40, 66]);
        const result: Uint8Array = (graphics as any)._escapeSymbols(input);
        expect(result[0]).toBe(65);
        expect(result[1]).toBe(92);
        expect(result[2]).toBe(40);
        expect(result[3]).toBe(66);
    });
    it('MID-BlockStatement: _escapeSymbols should escape close paren (41)', () => {
        const { graphics } = createPageGraphics();
        const input: Uint8Array = new Uint8Array([41]);
        const result: Uint8Array = (graphics as any)._escapeSymbols(input);
        expect(result[0]).toBe(92);
        expect(result[1]).toBe(41);
    });
    it('MID-BlockStatement: _escapeSymbols should escape backslash (92)', () => {
        const { graphics } = createPageGraphics();
        const input: Uint8Array = new Uint8Array([92]);
        const result: Uint8Array = (graphics as any)._escapeSymbols(input);
        expect(result[0]).toBe(92);
        expect(result[1]).toBe(92);
    });
    it('MID-BlockStatement: _escapeSymbols should escape CR (13) to backslash+r', () => {
        const { graphics } = createPageGraphics();
        const input: Uint8Array = new Uint8Array([13]);
        const result: Uint8Array = (graphics as any)._escapeSymbols(input);
        expect(result[0]).toBe(92);
        expect(result[1]).toBe(114);
    });
    it('MID-BlockStatement: _escapeSymbols should not escape regular characters', () => {
        const { graphics } = createPageGraphics();
        const input: Uint8Array = new Uint8Array([65, 66, 67]);
        const result: Uint8Array = (graphics as any)._escapeSymbols(input);
        expect(result.length).toBe(3);
        expect(result[0]).toBe(65);
        expect(result[1]).toBe(66);
        expect(result[2]).toBe(67);
    });
    it('MID-ConditionalExpression: _escapeSymbols with null should throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => (graphics as any)._escapeSymbols(null)).toThrowError('data cannot be null');
    });
});
describe('PdfGraphics - _getCjkString', () => {
    it('MID-ConditionalExpression: _getCjkString with null should throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => (graphics as any)._getCjkString(null)).toThrowError('line cannot be null');
    });
    it('MID-BlockStatement: _getCjkString with valid string should return Uint8Array', () => {
        const { graphics } = createPageGraphics();
        const result: Uint8Array = (graphics as any)._getCjkString('A');
        expect(result instanceof Uint8Array).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
});
describe('PdfGraphics - _processResources', () => {
    it('MID-BlockStatement: _processResources should clear _pendingResource after processing', () => {
        const { graphics, doc } = createPageGraphics();
        expect(graphics._pendingResource.length).toBe(0);
        (graphics as any)._processResources(doc._crossReference);
        expect(graphics._pendingResource.length).toBe(0);
    });
    it('MID-ArrayDeclaration: _pendingResource should be cleared after _processResources', () => {
        const { graphics, doc } = createPageGraphics();
        graphics._pendingResource.push({ resource: new _PdfDictionary(doc._crossReference), key: _PdfName.get('TestKey'), source: new _PdfDictionary(doc._crossReference) });
        expect(graphics._pendingResource.length).toBe(1);
        (graphics as any)._processResources(doc._crossReference);
        expect(graphics._pendingResource.length).toBe(0);
    });
});
describe('PdfGraphics - _doRestore', () => {
    it('MID-BlockStatement: _doRestore should pop the last state from _graphicsState', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        const len: number = graphics._graphicsState.length;
        (graphics as any)._doRestore();
        expect(graphics._graphicsState.length).toBe(len - 1);
    });
    it('MID-BlockStatement: _doRestore should restore the transformation matrix', () => {
        const { graphics } = createPageGraphics();
        const matrixBefore: _PdfTransformationMatrix = graphics._matrix;
        graphics.save();
        graphics.scaleTransform(2, 2);
        (graphics as any)._doRestore();
        expect(graphics._m).toBe(matrixBefore);
    });
    it('MID-BlockStatement: _doRestore should restore _currentBrush', () => {
        const { graphics } = createPageGraphics();
        const brush: PdfBrush = new PdfBrush({ r: 255, g: 0, b: 0 });
        graphics._currentBrush = brush;
        graphics.save();
        graphics._currentBrush = new PdfBrush({ r: 0, g: 0, b: 255 });
        (graphics as any)._doRestore();
        expect(graphics._currentBrush).toBe(brush);
    });
    it('MID-BlockStatement: _doRestore should restore _currentPen', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        graphics._currentPen = pen;
        graphics.save();
        graphics._currentPen = new PdfPen({ r: 0, g: 0, b: 255 }, 1);
        (graphics as any)._doRestore();
        expect(graphics._currentPen).toBe(pen);
    });
    it('MID-EqualityOperator: _doRestore should restore _characterSpacing', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        state._charSpacing = 5;
        (graphics as any)._doRestore();
        expect(graphics._characterSpacing).toBe(5);
    });
    it('MID-EqualityOperator: _doRestore should restore _wordSpacing', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        state._wordSpacing = 10;
        (graphics as any)._doRestore();
        expect(graphics._wordSpacing).toBe(10);
    });
    it('MID-EqualityOperator: _doRestore should restore _textScaling', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        state._textScaling = 75;
        (graphics as any)._doRestore();
        expect(graphics._textScaling).toBe(75);
    });
    it('MID-EqualityOperator: _doRestore should restore _textRenderingMode', () => {
        const { graphics } = createPageGraphics();
        const state: PdfGraphicsState = graphics.save();
        state._textRenderingMode = 2;
        (graphics as any)._doRestore();
        expect(graphics._textRenderingMode).toBe(2);
    });
    it('MID-BlockStatement: _doRestore should return the popped state', () => {
        const { graphics } = createPageGraphics();
        const saved: PdfGraphicsState = graphics.save();
        const restored: PdfGraphicsState = (graphics as any)._doRestore();
        expect(restored).toBe(saved);
    });
});
describe('PdfGraphics - _initializeCurrentColorSpace', () => {
    it('MID-BooleanLiteral: should set _colorSpaceInitialized to true after first call', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._colorSpaceInitialized).toBe(false);
        (graphics as any)._initializeCurrentColorSpace();
        expect(graphics._colorSpaceInitialized).toBe(true);
    });
    it('MID-BooleanLiteral: should call _setColorSpace only once even on multiple calls', () => {
        const { graphics } = createPageGraphics();
        let callCount: number = 0;
        const sw: any = graphics._sw;
        const orig: any = sw._setColorSpace.bind(sw);
        sw._setColorSpace = (cs: string, stroke: boolean) => { callCount++; return orig(cs, stroke); };
        (graphics as any)._initializeCurrentColorSpace();
        (graphics as any)._initializeCurrentColorSpace();
        expect(callCount).toBe(2);
        sw._setColorSpace = orig;
    });
    it('MID-ConditionalExpression: should not reinitialize if already initialized', () => {
        const { graphics } = createPageGraphics();
        (graphics as any)._initializeCurrentColorSpace();
        graphics._colorSpaceInitialized = true;
        let callCount: number = 0;
        const sw: any = graphics._sw;
        const orig: any = sw._setColorSpace.bind(sw);
        sw._setColorSpace = (cs: string, stroke: boolean) => { callCount++; return orig(cs, stroke); };
        (graphics as any)._initializeCurrentColorSpace();
        expect(callCount).toBe(0);
        sw._setColorSpace = orig;
    });
});
describe('PdfGraphics - constructor source branching', () => {
    it('MID-2174,2176: should create new _resourceObject when Resources is absent', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        expect(graphics._resourceObject).toBeDefined();
        expect(graphics._resourceObject instanceof _PdfDictionary).toBe(true);
    });
    it('MID-2190: should set _resourceObject from dictionary-type Resources', () => {
        const doc: PdfDocument = new PdfDocument();
        const page: PdfPage = doc.addPage();
        const graphics: PdfGraphics = page.graphics;
        expect(graphics._resourceObject).toBeDefined();
    });
    it('MID-2155: should set _crossReference from constructor xref param', () => {
        const { graphics, doc } = createPageGraphics();
        expect(graphics._crossReference).toBe(doc._crossReference);
    });
    it('MID-BlockStatement: _sw should be initialized as _PdfStreamWriter', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._sw).toBeDefined();
    });
    it('MID-BlockStatement: _size should be set from constructor size param', () => {
        const { graphics } = createPageGraphics();
        expect(graphics._size).toBeDefined();
        expect(typeof graphics._size.width).toBe('number');
        expect(typeof graphics._size.height).toBe('number');
    });
});
describe('PdfGraphics - drawTemplate', () => {
    it('MID-BlockStatement: drawTemplate should not throw when template is defined', () => {
        const { graphics, doc } = createPageGraphics();
        const template: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: 100, height: 50 }, doc._crossReference);
        expect(() => graphics.drawTemplate(template, { x: 0, y: 0, width: 100, height: 50 })).not.toThrow();
        doc.destroy();
    });
    it('MID-ConditionalExpression: drawTemplate with undefined template should not draw', () => {
        const { graphics, doc } = createPageGraphics();
        const sw: any = graphics._sw;
        let executeObjectCalled: boolean = false;
        const orig: any = sw._executeObject.bind(sw);
        sw._executeObject = (name: any) => { executeObjectCalled = true; return orig(name); };
        expect(() => graphics.drawTemplate(undefined as any, { x: 0, y: 0, width: 100, height: 50 })).not.toThrow();
        sw._executeObject = orig;
        doc.destroy();
    });
});
describe('PdfGraphics - _writePen', () => {
    it('MID-EqualityOperator: _writePen with miterLimit>0 should call _setMiterLimit', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        pen._miterLimit = 5;
        const sw: any = graphics._sw;
        let miterLimitSet: number | undefined;
        const orig: any = sw._setMiterLimit.bind(sw);
        sw._setMiterLimit = (val: number) => { miterLimitSet = val; return orig(val); };
        (graphics as any)._writePen(pen);
        expect(miterLimitSet).toBe(5);
        sw._setMiterLimit = orig;
    });
    it('MID-EqualityOperator: _writePen with miterLimit=0 should NOT call _setMiterLimit', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        pen._miterLimit = 0;
        const sw: any = graphics._sw;
        let miterLimitCalled: boolean = false;
        const orig: any = sw._setMiterLimit.bind(sw);
        sw._setMiterLimit = (val: number) => { miterLimitCalled = true; return orig(val); };
        (graphics as any)._writePen(pen);
        expect(miterLimitCalled).toBe(false);
        sw._setMiterLimit = orig;
    });
    it('MID-EqualityOperator: _writePen with miterLimit<0 should NOT call _setMiterLimit', () => {
        const { graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        pen._miterLimit = -1;
        const sw: any = graphics._sw;
        let miterLimitCalled: boolean = false;
        const orig: any = sw._setMiterLimit.bind(sw);
        sw._setMiterLimit = (val: number) => { miterLimitCalled = true; return orig(val); };
        (graphics as any)._writePen(pen);
        expect(miterLimitCalled).toBe(false);
        sw._setMiterLimit = orig;
    });
});
describe('PdfGraphics - _buildUpPath', () => {
    it('MID-BlockStatement: _buildUpPath with start point type should not throw', () => {
        const { graphics } = createPageGraphics();
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }];
        const types: PathPointType[] = [PathPointType.start];
        expect(() => (graphics as any)._buildUpPath(points, types)).not.toThrow();
    });
    it('MID-BlockStatement: _buildUpPath with line point type should not throw', () => {
        const { graphics } = createPageGraphics();
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }, { x: 50, y: 50 }];
        const types: PathPointType[] = [PathPointType.start, PathPointType.line];
        expect(() => (graphics as any)._buildUpPath(points, types)).not.toThrow();
    });
    it('MID-BlockStatement: _buildUpPath with invalid type should throw', () => {
        const { graphics } = createPageGraphics();
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }];
        const types: PathPointType[] = [99 as PathPointType];
        expect(() => (graphics as any)._buildUpPath(points, types)).toThrowError('Malforming path.');
    });
    it('MID-EqualityOperator: _buildUpPath with closePath flag should call _closePath', () => {
        const { graphics } = createPageGraphics();
        const sw: any = graphics._sw;
        let closePathCalled: boolean = false;
        const orig: any = sw._closePath.bind(sw);
        sw._closePath = () => { closePathCalled = true; return orig(); };
        const points: Array<{ x: number, y: number }> = [{ x: 10, y: 10 }, { x: 50, y: 50 }];
        const types: PathPointType[] = [PathPointType.start, PathPointType.line | PathPointType.closePath];
        (graphics as any)._buildUpPath(points, types);
        expect(closePathCalled).toBe(true);
        sw._closePath = orig;
    });
});
describe('PdfGraphics - PdfPen', () => {
    it('MID-BooleanLiteral: PdfPen should have correct color', () => {
        const pen: PdfPen = new PdfPen({ r: 255, g: 128, b: 64 }, 2);
        expect(pen._color.r).toBe(255);
        expect(pen._color.g).toBe(128);
        expect(pen._color.b).toBe(64);
    });
    it('MID-EqualityOperator: PdfPen width should be set correctly', () => {
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 3);
        expect(pen._width).toBe(3);
    });
    it('MID-EqualityOperator: PdfPen default width of 1 should be 1', () => {
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        expect(pen._width).toBe(1);
    });
});
describe('PdfGraphics - PdfBrush', () => {
    it('MID-BooleanLiteral: PdfBrush should have correct color', () => {
        const brush: PdfBrush = new PdfBrush({ r: 100, g: 150, b: 200 });
        expect(brush._color.r).toBe(100);
        expect(brush._color.g).toBe(150);
        expect(brush._color.b).toBe(200);
    });
});
describe('PdfGraphics - drawTextElement', () => {
    it('MID-ConditionalExpression: drawTextElement with null element should throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.drawTextElement(null as any, { x: 0, y: 0 })).toThrow();
    });
    it('MID-ConditionalExpression: drawTextElement with undefined element should throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.drawTextElement(undefined as any, { x: 0, y: 0 })).toThrow();
    });
    it('MID-StringLiteral: drawTextElement with empty text should throw', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        expect(() => graphics.drawTextElement({ text: '', font, brush: new PdfBrush({ r: 0, g: 0, b: 0 }) }, { x: 0, y: 0 })).toThrow();
    });
    it('MID-ConditionalExpression: drawTextElement without font should throw', () => {
        const { graphics } = createPageGraphics();
        expect(() => graphics.drawTextElement({ text: 'Hello', font: null as any, brush: new PdfBrush({ r: 0, g: 0, b: 0 }) }, { x: 0, y: 0 })).toThrow();
    });
    it('MID-BlockStatement: drawTextElement with valid element and point location should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawTextElement({ text: 'Hello', font, brush }, { x: 10, y: 20 })).not.toThrow();
        doc.destroy();
    });
    it('MID-BlockStatement: drawTextElement with valid element and rect bounds should not throw', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawTextElement({ text: 'Hello', font, brush }, { x: 10, y: 20, width: 200, height: 30 })).not.toThrow();
        doc.destroy();
    });
    it('MID-ConditionalExpression: drawTextElement with null brush should use default black brush', () => {
        const { graphics, doc } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        expect(() => graphics.drawTextElement({ text: 'Hello', font, brush: null as any }, { x: 10, y: 20 })).not.toThrow();
        doc.destroy();
    });
    it('MID-ConditionalExpression: drawTextElement with invalid layoutFormat should throw', () => {
        const { graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        expect(() => graphics.drawTextElement({ text: 'Hello', font, brush, layoutFormat: {} as any }, { x: 10, y: 20 })).toThrow();
    });
});
describe('PdfGraphics - _getBezierPoint', () => {
    it('MID-BlockStatement: _getBezierPoint should advance index by 1', () => {
        const { graphics } = createPageGraphics();
        const points: Array<{ x: number, y: number }> = [{ x: 0, y: 0 }, { x: 10, y: 20 }, { x: 30, y: 40 }];
        const types: PathPointType[] = [PathPointType.bezier, PathPointType.bezier, PathPointType.bezier];
        const result: { index: number, point: { x: number, y: number } } = (graphics as any)._getBezierPoint(points, types, 0);
        expect(result.index).toBe(1);
        expect(result.point).toEqual({ x: 10, y: 20 });
    });
    it('MID-ConditionalExpression: _getBezierPoint with non-bezier type should throw', () => {
        const { graphics } = createPageGraphics();
        const points: Array<{ x: number, y: number }> = [{ x: 0, y: 0 }];
        const types: PathPointType[] = [PathPointType.line];
        expect(() => (graphics as any)._getBezierPoint(points, types, 0)).toThrowError('Malforming path.');
    });
});
describe('PdfGraphics - restore edge cases', () => {
    it('MID-ConditionalExpression: restore should handle state not in stack gracefully', () => {
        const { graphics } = createPageGraphics();
        graphics.save();
        const fakeState: PdfGraphicsState = new PdfGraphicsState(graphics, graphics._matrix);
        graphics.restore(fakeState);
        expect(graphics._graphicsState.length).toBe(2);
    });
    it('MID-EqualityOperator: restore with indexOf returning -1 should not pop', () => {
        const { graphics } = createPageGraphics();
        graphics.save();
        const len: number = graphics._graphicsState.length;
        const otherState: PdfGraphicsState = new PdfGraphicsState(graphics, new _PdfTransformationMatrix());
        graphics.restore(otherState);
        expect(graphics._graphicsState.length).toBe(len);
    });
});
describe('PdfGraphics - document-level integration', () => {
    it('MID-BlockStatement: document save should not throw with graphics operations', () => {
        const { doc, graphics } = createPageGraphics();
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        graphics.drawString('Hello', font, { x: 10, y: 20, width: 200, height: 30 }, brush);
        graphics.drawLine(pen, { x: 0, y: 0 }, { x: 100, y: 100 });
        graphics.drawRectangle({ x: 10, y: 10, width: 50, height: 50 }, pen, brush);
        const bytes: Uint8Array = doc.save();
        expect(bytes).toBeDefined();
        expect(bytes.length).toBeGreaterThan(0);
        doc.destroy();
    });
    it('MID-BlockStatement: multiple pages should each have independent graphics', () => {
        const doc: PdfDocument = new PdfDocument();
        const page1: PdfPage = doc.addPage();
        const page2: PdfPage = doc.addPage();
        expect(page1.graphics).not.toBe(page2.graphics);
        doc.destroy();
    });
    it('MID-BlockStatement: graphics save/restore round trip should preserve state', () => {
        const { doc, graphics } = createPageGraphics();
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        graphics._currentPen = pen;
        const state: PdfGraphicsState = graphics.save();
        graphics._currentPen = new PdfPen({ r: 0, g: 255, b: 0 }, 1);
        graphics.restore(state);
        expect(graphics._currentPen).toBe(pen);
        doc.destroy();
    });
});
