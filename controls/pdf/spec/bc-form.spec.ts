import { PdfFormFieldsTabOrder, PdfRotationAngle } from '../src/pdf/core/enumerator';
import { PdfForm } from '../src/pdf/core/form/form';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';

describe('Viewer Reported issue behavior tests', () => {
    it('rotation 270: returns page index', () => {
        // Arrange
        const form: any = Object.create((PdfForm as any).prototype);
        form._tabOrder = PdfFormFieldsTabOrder.row;
        let callCount = 0;
        form._sortItemByPageIndex = (_f: any, _b: boolean) => {
            callCount++;
            return { _pageIndex: callCount === 1 ? 2 : 1 };
        };
        const page1 = new PdfPage(null as any, 0, new _PdfDictionary(), null as any);
        const page2 = new PdfPage(null as any, 1, new _PdfDictionary(), null as any);
        page1._isNew = false; page2._isNew = false;
        page1._rotation = PdfRotationAngle.angle270;
        page2._rotation = PdfRotationAngle.angle270;
        const rect1 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [10, 5, 20, 15] };
        const rect2 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [12, 6, 22, 16] };
        const field1 = { page: page1, _dictionary: rect1 };
        const field2 = { page: page2, _dictionary: rect2 };
        // Act
        const result: number = form._compareFields(field1, field2);
        // Assert
        expect(result).toBe(1);
    });
    it('rotation 270: xDistance <= tolerance compares y values', () => {
        // Arrange
        const form: any = Object.create((PdfForm as any).prototype);
        form._tabOrder = PdfFormFieldsTabOrder.row;
        form._sortItemByPageIndex = (_f: any, _b: boolean) => ({ _pageIndex: 1 });
		const page1 = new PdfPage(null as any, 0, new _PdfDictionary(), null as any);
        const page2 = new PdfPage(null as any, 1, new _PdfDictionary(), null as any);
        page1._isNew = false; page2._isNew = false;
        page1._rotation = PdfRotationAngle.angle270;
        page2._rotation = PdfRotationAngle.angle270;
        const rect1 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [10, 5, 20, 15] };
        const rect2 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [11, 10, 21, 20] };
        const field1 = { page: page1, _dictionary: rect1 };
        const field2 = { page: page2, _dictionary: rect2 };
        // Act
        const result: number = form._compareFields(field1, field2);
        // Assert: y2 (10) vs y1 (5) => compare returns 1
        expect(result).toBe(1);
    });
    it('rotation 270: xDistance > tolerance compares x values', () => {
        // Arrange
        const form: any = Object.create((PdfForm as any).prototype);
        form._tabOrder = PdfFormFieldsTabOrder.row;
        form._sortItemByPageIndex = (_f: any, _b: boolean) => ({ _pageIndex: 1 });
		const page1 = new PdfPage(null as any, 0, new _PdfDictionary(), null as any);
        const page2 = new PdfPage(null as any, 1, new _PdfDictionary(), null as any);
        page1._isNew = false; page2._isNew = false;
        page1._rotation = PdfRotationAngle.angle270;
        page2._rotation = PdfRotationAngle.angle270;
        const rect1 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [10, 5, 20, 15] };
        const rect2 = { has: (k: string) => k === 'Rect', getArray: (k: string) => [30, 10, 40, 20] };
        const field1 = { page: page1, _dictionary: rect1 };
        const field2 = { page: page2, _dictionary: rect2 };
        // Act
        const result: number = form._compareFields(field1, field2);
        // Assert: x2 (30) vs x1 (10) => compare returns 1
        expect(result).toBe(1);
    });
    it('getItemRectangle: returns combined bounding rect from child widgets', () => {
        // Arrange
        const form: any = Object.create((PdfForm as any).prototype);
        const childWidget1 = { _dictionary: { has: (k: string) => k === 'Rect', getArray: (_: string) => [1, 2, 3, 4] } };
        const childWidget2 = { _dictionary: { has: (k: string) => k === 'Rect', getArray: (_: string) => [0, 1, 5, 6] } };
        const parentDict = {
            has: (k: string) => k === 'Kids' || k === 'Rect',
            getArray: (k: string) => (k === 'Kids' ? [{}, {}] : [7, 8, 9, 10])
        };
        const field: any = {
            _dictionary: parentDict,
            itemsCount: 2,
            itemAt: (i: number) => (i === 0 ? childWidget1 : childWidget2)
        };
        // Act
        const result: number[] = form._getItemRectangle(field);
        // Assert: combined bounds [minX, minY, maxX, maxY]
        expect(result).toEqual([1, 2, 3, 4]);
    });
});
