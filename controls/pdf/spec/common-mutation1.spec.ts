import { _PdfDictionary, _PdfName } from "../src/pdf/core/pdf-primitives";
import { PdfBitmap } from "../src/pdf/core/graphics/images/pdf-bitmap";
import { _PngDecoder } from "../src/pdf/core/graphics/images/png-decoder";
import { _decode, _getDecoder } from "../src/pdf/core/utils";
import { PdfPageTemplateElement } from "../src/pdf/core/graphics/pdf-page-template-element";
import { PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfPath } from "../src/pdf/core/graphics/pdf-path";
import { PathPointType } from "../src/pdf/core/enumerator";
function createBitmapDictionary(colorSpaceName: string): _PdfDictionary {
    const dictionary: _PdfDictionary = new _PdfDictionary();
    dictionary.update('ColorSpace', _PdfName.get(colorSpaceName));
    return dictionary;
}
describe('1038509 PdfBitmap _setColorSpace decoder type check', () => {
    it('1038509 non png decoder should not switch to indexed color space', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        const dictionary: _PdfDictionary = createBitmapDictionary('DeviceCMYK');
        bitmap._imageStream = { dictionary };
        bitmap._decoder = { _colorSpace: _PdfName.get('Indexed')};
        bitmap._setColorSpace();
        const decode: number[] = dictionary.get('Decode') as number[];
        expect(decode).toBeDefined();
        expect(decode.length).toBe(8);
        const colorSpace: _PdfName = dictionary.get('ColorSpace') as _PdfName;
        expect(colorSpace.name).toBe('DeviceCMYK');
    });
    it('1038509 non png decoder should not switch to indexed color space12', () => {
        const pngBytes: Uint8Array = new Uint8Array([ 137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 248, 15, 4, 0, 9, 251, 3, 253, 160, 90, 183, 153, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
        const map = new PdfBitmap(pngBytes);
        expect(map._imageStatus).toBe(true);
    });
    it('1038509 non png decoder should not switch to indexed color space123', () => {
        const pngBytes = [ 137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 13, 73, 68, 65, 84, 120, 156, 99, 248, 15, 4, 0, 9, 251, 3, 253, 160, 90, 183, 153, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130];
        expect(() => new PdfBitmap(pngBytes as any)).toThrow();
    });
    it('1038509 null png color space should keep gray scale conversion', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        const dictionary: _PdfDictionary = createBitmapDictionary('DeviceGray');
        bitmap._imageStream = { dictionary };
        const pngDecoder: any = new _PngDecoder(new Uint8Array(0));
        pngDecoder._colorSpace = null;
        bitmap._decoder = pngDecoder;
        bitmap._setColorSpace();
        const decode: number[] = dictionary.get('Decode') as number[];
        expect(decode).toEqual([0.0, 1.0]);
        const colorSpace: _PdfName = dictionary.get('ColorSpace') as _PdfName;
        expect(colorSpace.name).toBe('DeviceGray');
    });
    it('1038509 cmyk should create decode array and device cmyk color space', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        const dictionary: _PdfDictionary = createBitmapDictionary('DeviceCMYK');
        bitmap._imageStream = { dictionary };
        bitmap._decoder = {};
        bitmap._setColorSpace();
        expect(dictionary.has('Decode')).toBe(true);
        const decode: number[] = dictionary.get('Decode') as number[];
        expect(decode.length).toBe(8);
        const colorSpace: _PdfName = dictionary.get('ColorSpace') as _PdfName;
        expect(colorSpace.name).toBe('DeviceCMYK');
    });
    it('1038509 cmyk decode array should contain eight entries', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        const dictionary: _PdfDictionary = createBitmapDictionary('DeviceCMYK');
        bitmap._imageStream = { dictionary };
        bitmap._decoder = {};
        bitmap._setColorSpace();
        const decode: number[] = dictionary.get('Decode') as number[];
        expect(Array.isArray(decode)).toBe(true);
        expect(decode.length).toBe(8);
        expect(dictionary.has('')).toBe(false);
        const colorSpace: _PdfName = dictionary.get('ColorSpace') as _PdfName;
        expect(colorSpace).toBeDefined();
        expect(colorSpace.name).toBe('DeviceCMYK');
        expect(colorSpace.name).not.toBe('');
        expect(colorSpace.name.length).toBeGreaterThan(0);
    });
    it('1038509 grayScale decode array should contain eight entries', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        const dictionary: _PdfDictionary = createBitmapDictionary('DeviceGray');
        bitmap._imageStream = { dictionary };
        bitmap._decoder = {};
        bitmap._setColorSpace();
        const decode: number[] = dictionary.get('Decode') as number[];
        expect(Array.isArray(decode)).toBe(true);
        expect(decode.length).toBe(2);
        expect(dictionary.has('')).toBe(false);
        const colorSpace: _PdfName = dictionary.get('ColorSpace') as _PdfName;
        expect(colorSpace).toBeDefined();
        expect(colorSpace.name).toBe('DeviceGray');
        expect(colorSpace.name).not.toBe('');
        expect(colorSpace.name.length).toBeGreaterThan(0);
    });
    it('1038509 save sets image status true', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        bitmap._decoder = { _getImageDictionary: (): any => { return { dictionary: new _PdfDictionary() }; } };
        bitmap._setColorSpace = (): void => { };
        bitmap._save();
        expect(bitmap._imageStatus).toBe(true);
    });
    it('1038509 non png decoder does not assign mask stream', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let colorSpaceCallCount: number = 0;
        bitmap._decoder = { _getImageDictionary: (): any => { return { dictionary: new _PdfDictionary() }; } };
        bitmap._setColorSpace = (): void => { colorSpaceCallCount++; };
        bitmap._save();
        expect(colorSpaceCallCount).toBe(1);
        expect(bitmap._maskStream).toBeUndefined();
    });
    it('1038509 non png decoder follows non png branch', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let setColorSpaceCount: number = 0;
        bitmap._decoder = { _getImageDictionary: (): any => { return { dictionary: new _PdfDictionary() }; } };
        bitmap._setColorSpace = (): void => {setColorSpaceCount++;};
        bitmap._save();
        expect(bitmap._maskStream).toBeUndefined();
        expect(setColorSpaceCount).toBe(1);
    });
    it('1038509 when decode flag false setColorSpace is invoked', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let callCount: number = 0;
        const decoder: any = new _PngDecoder(new Uint8Array(0));
        decoder._isDecode = false;
        decoder._maskStream = {};
        decoder._colorSpace = null;
        decoder._getImageDictionary = (): any => { return { dictionary: new _PdfDictionary() }; };
        bitmap._decoder = decoder;
        bitmap._setColorSpace = (): void => { callCount++; };
        bitmap._save();
        expect(callCount).toBe(1);
    });
    it('1038509 decode true with color space invokes setColorSpace', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let callCount: number = 0;
        const decoder: any = new _PngDecoder(new Uint8Array(0));
        decoder._isDecode = true;
        decoder._maskStream = {};
        decoder._colorSpace = _PdfName.get('Indexed');
        decoder._getImageDictionary = (): any => { return { dictionary: new _PdfDictionary() }; };
        bitmap._decoder = decoder;
        bitmap._setColorSpace = (): void => { callCount++; };
        bitmap._save();
        expect(callCount).toBe(1);
    });
    it('1038509 decode true without color space skips setColorSpace', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let callCount: number = 0;
        const decoder: any = new _PngDecoder(new Uint8Array(0));
        decoder._isDecode = true;
        decoder._colorSpace = null;
        decoder._maskStream = {};
        decoder._getImageDictionary = (): any => { return { dictionary: new _PdfDictionary() }; };
        bitmap._decoder = decoder;
        bitmap._setColorSpace = (): void => { callCount++; };
        bitmap._save();
        expect(callCount).toBe(0);
    });
    it('1038509 decode false executes setColorSpace from else branch', () => {
        const bitmap: any = Object.create(PdfBitmap.prototype);
        let callCount: number = 0;
        const decoder: any = new _PngDecoder(new Uint8Array(0));
        decoder._isDecode = false;
        decoder._colorSpace = null;
        decoder._maskStream = {};
        decoder._getImageDictionary = (): any => { return { dictionary: new _PdfDictionary() }; };
        bitmap._decoder = decoder;
        bitmap._setColorSpace = (): void => { callCount++; };
        bitmap._save();
        expect(callCount).toBe(1);
    });
    it('1038509 graphics getter reuses existing template', () => {
        const element: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 100, height: 50 });
        const firstGraphics: PdfGraphics = element.graphics;
        const firstTemplate: any = (element as any)._template;
        expect(firstTemplate).toBeDefined();
        const secondGraphics: PdfGraphics = element.graphics;
        const secondTemplate: any = (element as any)._template;
        expect(secondTemplate).toBe(firstTemplate);
        expect(secondGraphics).toBe(firstGraphics);
    });
    it('1038509 draw should skip when template is undefined', () => {
        const element: PdfPageTemplateElement = new PdfPageTemplateElement({ width: 100, height: 50 });
        let drawCount: number = 0;
        const pageGraphics: any = { drawTemplate: ( _template: any, _bounds: any ): void => { drawCount++; } };
        element._draw(pageGraphics, 10, 20, 30, 40);
        expect(drawCount).toBe(0);
        expect((element as any)._template).toBeUndefined();
    });
});
describe('1038509 PdfPath constructor mutations', () => {
    it('1038509 constructor initializes empty points collection when arguments are not provided', () => {
        const path: PdfPath = new PdfPath();
        expect(path.pathPoints).toBeDefined();
        expect(Array.isArray(path.pathPoints)).toBe(true);
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathPoints).not.toContain('Stryker was here' as any);
    });
    it('1038509 constructor initializes empty path types collection when arguments are not provided', () => {
        const path: PdfPath = new PdfPath();
        expect(path.pathTypes).toBeDefined();
        expect(Array.isArray(path.pathTypes)).toBe(true);
        expect(path.pathTypes.length).toBe(0);
        expect(path.pathTypes).not.toContain('Stryker was here' as any);
    });
    it('1038509 constructor sets rounded rectangle flag to false by default', () => {
        const path: any = new PdfPath();
        expect(path._isRoundedRectangle).toBe(false);
        expect(path._isRoundedRectangle).not.toBe(true);
    });
    it('1038509 constructor without arguments creates independent empty collections', () => {
        const path: PdfPath = new PdfPath();
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
        path.addLine( { x: 10, y: 20 }, { x: 30, y: 40 });
        expect(path.pathPoints.length).toBeGreaterThan(0);
        expect(path.pathTypes.length).toBeGreaterThan(0);
    });
    it('1038509 constructor retains provided points and path types', () => {
        const points: { x: number; y: number }[] = [{ x: 10, y: 20 }, { x: 30, y: 40 }];
        const pathTypes: number[] = [0, 1];
        const path: PdfPath = new PdfPath(points, pathTypes);
        expect(path.pathPoints).toBe(points);
        expect(path.pathTypes).toBe(pathTypes);
        expect(path.pathPoints.length).toBe(2);
        expect(path.pathTypes.length).toBe(2);
    });
    it('1038509 addPath ignores non PdfPath and non array arguments', () => {
        const path: any = new PdfPath();
        const initialPointCount: number = path.pathPoints.length;
        const initialTypeCount: number = path.pathTypes.length;
        path.addPath('invalid-value' as any, 100 as any);
        expect(path.pathPoints.length).toBe(initialPointCount);
        expect(path.pathTypes.length).toBe(initialTypeCount);
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
    });
    it('1038509 addPath ignores arguments when only first parameter is array', () => {
        const path: any = new PdfPath();
        const pointCollection: number[] = [10, 20];
        expect(() => path.addPath(pointCollection as any, undefined as any)).not.toThrow();
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
    });
    it('1038509 addPath ignores arguments when only second parameter is array', () => {
        const path: any = new PdfPath();
        const pathTypeCollection: number[] = [1];
        expect(() => path.addPath(undefined as any, pathTypeCollection as any)).not.toThrow();
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
    });
});
describe('1038509 PdfPath _addPoints mutations', () => {
    it('1038509 _addPoints respects provided start index', () => {
        const path: any = new PdfPath();
        path._addPoints( [1, 2, 10, 20, 30, 40], PathPointType.line, 2);
        expect(path.pathPoints.length).toBe(2);
        expect(path.pathPoints[0].x).toBe(10);
        expect(path.pathPoints[0].y).toBe(20);
    });
    it('1038509 _addPoints respects provided end index', () => {
        const path: any = new PdfPath();
        path._addPoints([10, 20, 30, 40, 50, 60], PathPointType.line, 0, 4);
        expect(path.pathPoints.length).toBe(2);
        expect(path.pathPoints[1].x).toBe(30);
        expect(path.pathPoints[1].y).toBe(40);
    });
    it('1038509 _addPoints adds start point when figure is started', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 5, y: 5 });
        path._pathTypes.push(PathPointType.line);
        path.startFigure();
        path._addPoints( [10, 20], PathPointType.line);
        expect(path.pathTypes[1]).toBe(PathPointType.start);
    });
    it('1038509 _addPoints uses empty point collection as start condition', () => {
        const path: any = new PdfPath();
        path._isStart = false;
        path._addPoints([10, 20], PathPointType.line);
        expect(path.pathTypes[0]).toBe(PathPointType.start);
    });
    it('1038509 _addPoints does not add duplicate point when rounded rectangle is false', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 10, y: 10 });
        path._pathTypes.push(PathPointType.line);
        path._isStart = false;
        path._isRoundedRectangle = false;
        path._addPoints([20, 10], PathPointType.line);
        expect(path.pathPoints.length).toBe(1);
    });
    it('1038509 _addPoints skips identical point for rounded rectangle', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 10, y: 10 });
        path._pathTypes.push(PathPointType.line);
        path._isStart = false;
        path._isRoundedRectangle = true;
        path._addPoints([10, 10], PathPointType.line);
        expect(path.pathPoints.length).toBe(1);
    });
    it('1038509 _addPoints requires both coordinates to differ', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 10, y: 10 });
        path._pathTypes.push(PathPointType.line);
        path._isStart = false;
        path._isRoundedRectangle = false;
        path._addPoints([20, 10], PathPointType.line);
        expect(path.pathPoints.length).toBe(1);
    });
    it('1038509 _addPoints checks x coordinate difference before adding point', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 10, y: 10 });
        path._pathTypes.push(PathPointType.line);
        path._isStart = false;
        path._isRoundedRectangle = false;
        path._addPoints([10, 20], PathPointType.line);
        expect(path.pathPoints.length).toBe(1);
    });
    it('1038509 _addPoints requires y coordinate difference before adding point', () => {
        const path: any = new PdfPath();
        path._points.push({ x: 10, y: 10 });
        path._pathTypes.push(PathPointType.line);
        path._isStart = false;
        path._isRoundedRectangle = false;
        const initialPointCount: number = path.pathPoints.length;
        const initialTypeCount: number = path.pathTypes.length;
        path._addPoints([20, 10], PathPointType.line);
        expect(path.pathPoints.length).toBe(initialPointCount);
        expect(path.pathTypes.length).toBe(initialTypeCount);
        expect(path.pathPoints[0].x).toBe(10);
        expect(path.pathPoints[0].y).toBe(10);
    });
    it('1038509 _addBezierPoints uses second point as first control point', () => {
        const path: PdfPath = new PdfPath();

        (path as any)._addBezierPoints([
            [0, 0],
            [10, 20],
            [30, 40],
            [50, 60]
        ]);

        expect(path.pathPoints.length).toBe(4);
        expect(path.pathPoints[1].x).toBe(10);
        expect(path.pathPoints[1].y).toBe(20);
    });
    it('1038509 _addBezierPoints uses third point as second control point', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([ [0, 0], [10, 20], [30, 40], [50, 60]]);
        expect(path.pathPoints.length).toBe(4);
        expect(path.pathPoints[2].x).toBe(30);
        expect(path.pathPoints[2].y).toBe(40);
    });
    it('1038509 _addBezierPoints uses fourth point as end point', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([ [0, 0], [10, 20], [30, 40], [50, 60]]);
        expect(path.pathPoints.length).toBe(4);
        expect(path.pathPoints[3].x).toBe(50);
        expect(path.pathPoints[3].y).toBe(60);
    });
    it('1038509 _addBezierPoints preserves first control point coordinates', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([[1, 2], [11, 22], [33, 44], [55, 66] ]);
        expect(path.pathPoints[1].x).toBe(11);
        expect(path.pathPoints[1].y).toBe(22);
    });
    it('1038509 _addBezierPoints preserves second control point coordinates', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([ [1, 2], [11, 22], [33, 44], [55, 66]]);
        expect(path.pathPoints[2].x).toBe(33);
        expect(path.pathPoints[2].y).toBe(44);
    });
    it('1038509 _addBezierPoints adds bezier points in expected order', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([[0, 0], [10, 20],[30, 40], [50, 60]]);
        expect(path.pathPoints.length).toBe(4);
        expect(path.pathPoints[0].x).toBe(0);
        expect(path.pathPoints[0].y).toBe(0);
        expect(path.pathPoints[1].x).toBe(10);
        expect(path.pathPoints[1].y).toBe(20);
        expect(path.pathPoints[2].x).toBe(30);
        expect(path.pathPoints[2].y).toBe(40);
        expect(path.pathPoints[3].x).toBe(50);
        expect(path.pathPoints[3].y).toBe(60);
    });
    it('1038509 _addBezierPoints creates consecutive bezier segments', () => {
        const path: PdfPath = new PdfPath();
        (path as any)._addBezierPoints([[0, 0], [10, 10], [20, 20], [30, 30], [40, 40], [50, 50], [60, 60]]);
        expect(path.pathPoints.length).toBe(7);
        expect(path.pathPoints[4].x).toBe(40);
        expect(path.pathPoints[4].y).toBe(40);
        expect(path.pathPoints[6].x).toBe(60);
        expect(path.pathPoints[6].y).toBe(60);
    });
    it('1038509 addPie adds center point with expected coordinates', () => {
        const path: PdfPath = new PdfPath();
        path.addPie({ x: 10, y: 20, width: 40, height: 60 }, 0, 90);
        const centerPoint: any = path.pathPoints[path.pathPoints.length - 1];
        expect(centerPoint).toBeDefined();
        expect(centerPoint.x).toBe(30);
        expect(centerPoint.y).toBe(50);
    });
    it('1038509 addPie center point uses positive half width offset', () => {
        const path: PdfPath = new PdfPath();
        path.addPie({ x: 20, y: 10, width: 40, height: 20 }, 0, 90);
        const centerPoint: any = path.pathPoints[path.pathPoints.length - 1];
        expect(centerPoint.x).toBe(40);
    });
    it('1038509 addPie center point does not use full width multiplier', () => {
        const path: PdfPath = new PdfPath();
        path.addPie( { x: 5, y: 5, width: 20, height: 20 }, 0, 90 );
        const centerPoint: any = path.pathPoints[path.pathPoints.length - 1];
        expect(centerPoint.x).toBe(15);
    });
    it('1038509 addPie center point uses positive half height offset', () => {
        const path: PdfPath = new PdfPath();
        path.addPie({ x: 10, y: 20, width: 20, height: 40 },0, 90);
        const centerPoint: any = path.pathPoints[path.pathPoints.length - 1];
        expect(centerPoint.y).toBe(40);
    });
    it('1038509 addPie center point does not use full height multiplier', () => {
        const path: PdfPath = new PdfPath();
        path.addPie({ x: 10, y: 15, width: 20, height: 10 },0, 90 );
        const centerPoint: any = path.pathPoints[path.pathPoints.length - 1];
        expect(centerPoint.y).toBe(20);
    });
    it('1038509 closeFigure with empty path does not create path type entries', () => {
        const path: any = new PdfPath();
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
        path.closeFigure();
        expect(path.pathPoints.length).toBe(0);
        expect(path.pathTypes.length).toBe(0);
        expect(path._isStart).toBe(true);
    });
    it('1038509 closeFigure with empty path does not update invalid path type index', () => {
        const path: any = new PdfPath();
        expect(path.pathTypes.length).toBe(0);
        path.closeFigure();
        expect(path.pathTypes.length).toBe(0);
        expect(path.pathTypes[-1]).toBeUndefined();
        expect(path._isStart).toBe(true);
    });
});
describe('1038509 PdfPath closeAllFigures mutations', () => {
    it('1038509 closeAllFigures closes previous figure without creating additional path type entries', () => {
        const path: any = new PdfPath();
        path._points = [{ x: 0, y: 0 },{ x: 10, y: 10 },{ x: 20, y: 20 }];
        path._pathTypes = [PathPointType.start, PathPointType.line, PathPointType.start];
        const originalLength: number = path._pathTypes.length;
        path.closeAllFigures();
        expect(path._pathTypes.length).toBe(originalLength);
        expect((path._pathTypes[1] & PathPointType.closePath) === PathPointType.closePath).toBe(true);
        expect(path._pathTypes[3]).toBeUndefined();
    });
    it('1038509 closeAllFigures does not process index beyond points length', () => {
        const path: any = new PdfPath();
        path._points = [{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.start];
        path.closeAllFigures();
        expect(path._pathTypes.length).toBe(1);
        expect(path._pathTypes[1]).toBeUndefined();
        expect(path._points[1]).toBeUndefined();
    });
    it('1038509 closeAllFigures does not close figure when start point occurs at first index', () => {
        const path: any = new PdfPath();
        path._points = [{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.start];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures does not execute xps branch after start branch executes', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 },{ x: 1, y: 1 },{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.line, PathPointType.start, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures does not close figure when xps flag is false', () => {
        const path: any = new PdfPath();
        path._isXps = false;
        path._points = [{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures evaluates xps branch only for last index', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 },{ x: 5, y: 5 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures requires last index before entering xps branch', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures requires xps flag for final branch', () => {
        const path: any = new PdfPath();
        path._isXps = false;
        path._points = [{ x: 0, y: 0 },{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.line,PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[1] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures requires last path type index before xps close', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 },{ x: 5, y: 5 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures closes xps figure only when start and end coordinates match', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 },{ x: 20, y: 30 }];
        path._pathTypes = [ PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[1] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures requires both coordinates to match', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 0, y: 0 },{ x: 0, y: 10 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[1] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures validates x coordinate match', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [ { x: 0, y: 5 },{ x: 10, y: 5 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[1] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures validates y coordinate match', () => {
        const path: any = new PdfPath();
        path._isXps = true;
        path._points = [{ x: 5, y: 0 },{ x: 5, y: 10 }];
        path._pathTypes = [PathPointType.line, PathPointType.line];
        path.closeAllFigures();
        expect((path._pathTypes[1] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
    it('1038509 closeAllFigures does not close first point when start type is at index zero', () => {
        const path: any = new PdfPath();
        path._points = [{ x: 0, y: 0 }];
        path._pathTypes = [PathPointType.start];
        path.closeAllFigures();
        expect(path._pathTypes.length).toBe(1);
        expect(path._pathTypes[0]).toBe(PathPointType.start);
        expect((path._pathTypes[0] & PathPointType.closePath)).not.toBe(PathPointType.closePath);
    });
});
