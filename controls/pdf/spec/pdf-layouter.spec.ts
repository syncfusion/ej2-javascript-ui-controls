import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfLayoutBreakType, PdfLayoutType } from "../src/pdf/core/enumerator";
import { _PageLayoutResult, PdfLayoutFormat, PdfLayoutResult } from "../src/pdf/core/graphics/pdf-layouter";

describe('pdf-layouter PdfLayoutFormat class mutation testing', () => {
    it('kills mutant: layout setter should update internal _layout field', () => {
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        expect(format.layout).toBe(0);
        format.layout = PdfLayoutType.onePage;
        expect(format.layout).toEqual(PdfLayoutType.onePage);
        format.layout = PdfLayoutType.paginate;
        expect(format.layout).toEqual(PdfLayoutType.paginate);
        const descriptor = Object.getOwnPropertyDescriptor(PdfLayoutFormat.prototype, 'layout');
        expect(descriptor).toBeDefined();
        expect(descriptor.get).toBeDefined();
        expect(descriptor.set).toBeDefined();
    });
    it('kills mutant: break setter should update internal _break field', () => {
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.break = PdfLayoutBreakType.fitElement;
        expect(format.break).toEqual(PdfLayoutBreakType.fitElement);
        format.break = PdfLayoutBreakType.fitPage;
        expect(format.break).toEqual(PdfLayoutBreakType.fitPage);
        const descriptor = Object.getOwnPropertyDescriptor(PdfLayoutFormat.prototype, 'break');
        expect(descriptor).toBeDefined();
        expect(descriptor.get).toBeDefined();
        expect(descriptor.set).toBeDefined();
    });
    it('kills mutant: column setter should update internal column field', () => {
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        expect(format.columns).toBeUndefined();
        format.columns = 3;
        expect(format.columns).toEqual(3);
        format.columns = 2;
        expect(format.columns).toEqual(2);
        const descriptor = Object.getOwnPropertyDescriptor(PdfLayoutFormat.prototype, 'columns');
        expect(descriptor).toBeDefined();
        expect(descriptor.get).toBeDefined();
        expect(descriptor.set).toBeDefined();
    });
    it('kills mutant: columnGutter setter should update internal columnGutter field', () => {
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        expect(format.columnGutter).toBeUndefined();
        format.columnGutter = 3;
        expect(format.columnGutter).toEqual(3);
        format.columnGutter = 2;
        expect(format.columnGutter).toEqual(2);
        const descriptor = Object.getOwnPropertyDescriptor(PdfLayoutFormat.prototype, 'columnGutter');
        expect(descriptor).toBeDefined();
        expect(descriptor.get).toBeDefined();
        expect(descriptor.set).toBeDefined();
    });
});
describe('pdf-layouter PdfLayoutResult and _PageLayoutResult class mutation testing', () => {
    it('kills mutant: _hasRenderedContent is false', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const result = new PdfLayoutResult(page, { x: 100, y: 100, width: 100, height:100});
        expect(result._hasRenderedContent).toBeFalsy();
    });
    it('kills mutant: _PageLayoutResult constructor initializes default values', () => {
        const result: _PageLayoutResult = new _PageLayoutResult();
        expect(result.markerWrote).toBe(false);
        expect(result.markerWidth).toBe(0);
        expect(result.markerX).toBe(0);
    });
});