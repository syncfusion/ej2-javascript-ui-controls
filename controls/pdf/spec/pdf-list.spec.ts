import {
    _PdfListInfo,
    _PdfListLayouter,
    PdfImageMarker,
    PdfList,
    PdfOrderedList,
    PdfUnorderedList,
    PdfUnorderMarker
} from '../src/pdf/core/list/pdf-list';
import {
    PdfLayoutType,
    PdfListMarkerAlignment,
    PdfNumberStyle,
    PdfTextAlignment,
    PdfUnorderedListStyle
} from '../src/pdf/core/enumerator';
import {
    PdfFont,
    PdfFontFamily,
    PdfStandardFont
} from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat } from '../src/pdf/core/fonts/pdf-string-format';
import {
    PdfBrush,
    PdfPen
} from '../src/pdf/core/graphics/pdf-graphics';
import {
    PdfListItemCollection
} from '../src/pdf/core/list/pdf-list-item';
import {
    PdfLayoutFormat,
    PdfLayoutResult,
    _PdfLayoutParameters
} from '../src/pdf/core/graphics/pdf-layouter';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import {
    PdfListItem
} from '../src/pdf/core/list/pdf-list-item';
import { PdfBitmap } from '../src/pdf/core/graphics/images/pdf-bitmap';
import { Rectangle, Size } from '../src/pdf/core/pdf-type';
import { _PdfStringLayoutResult } from '../src/pdf/core/fonts/string-layouter';
describe('PdfList property behavior', () => {
    it('should return the assigned brush', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        const brush: PdfBrush = new PdfBrush({ r: 10, g: 20, b: 30 });
        list.brush = brush;
        expect(list.brush).toBe(brush);
    });
    it('should return the assigned pen', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        const pen: PdfPen = new PdfPen({ r: 10, g: 20, b: 30 }, 2);
        list.pen = pen;
        expect(list.pen).toBe(pen);
    });
    it('should return the assigned font', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        const font: PdfStandardFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 12);
        list.font = font;
        expect(list.font).toBe(font);
    });
    it('should return the assigned string format', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        const format: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        list.stringFormat = format;
        expect(list.stringFormat).toBe(format);
    });
    it('should return the assigned indent', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.indent = 25;
        expect(list.indent).toBe(25);
    });
    it('should return the assigned text indent', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.textIndent = 35;
        expect(list.textIndent).toBe(35);
    });
    it('should return the assigned delimiter', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.delimiter = ')';
        expect(list.delimiter).toBe(')');
    });
    it('should return the assigned suffix', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.suffix = ':';
        expect(list.suffix).toBe(':');
    });
    it('should return the assigned hierarchy state', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.enableHierarchy = true;
        expect(list.enableHierarchy).toBeTruthy();
    });
    it('should return a falsy hierarchy state when disabled', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.enableHierarchy = false;
        expect(list.enableHierarchy).toBeFalsy();
    });
    it('should return the assigned marker alignment', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.alignment = PdfListMarkerAlignment.right;
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
    });
    it('should return the assigned item collection', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One', 'Two']);
        list.items = items;
        expect(list.items).toBe(items);
        expect(list.items.count).toBe(2);
        expect(list.items.at(0).text).toBe('One');
        expect(list.items.at(1).text).toBe('Two');
    });
    it('should return true for right marker alignment', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.alignment = PdfListMarkerAlignment.right;
        const result: boolean = list._markerRightToLeft;
        expect(result).toBeTruthy();
    });
    it('should return false for left marker alignment', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.alignment = PdfListMarkerAlignment.left;
        const result: boolean = list._markerRightToLeft;
        expect(result).toBeFalsy();
    });
});
describe('PdfOrderedList property behavior', () => {
    it('should return the assigned numbering style', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.style = PdfNumberStyle.lowerLatin;
        expect(list.style).toBe(PdfNumberStyle.lowerLatin);
    });
    it('should return the assigned start number', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.startNumber = 5;
        expect(list.startNumber).toBe(5);
    });
    it('should throw for a zero start number', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        expect((): void => {
            list.startNumber = 0;
        }).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('should throw for a negative start number', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        expect((): void => {
            list.startNumber = -1;
        }).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('should return the formatted current number', () => {
        const list: PdfOrderedList = new PdfOrderedList();
        list.startNumber = 5;
        list.style = PdfNumberStyle.numeric;
        list._currentIndex = 2;
        const result: string = list._getNumber();
        expect(result).toBe('7');
    });
});
describe('PdfUnorderedList property behavior', () => {
    it('should return the assigned unordered-list style', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.style = PdfUnorderedListStyle.circle;
        expect(list.style).toBe(PdfUnorderedListStyle.circle);
    });
    it('should return the disk marker text', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.style = PdfUnorderedListStyle.disk;
        const result: string = list._getStyledText();
        expect(result).toBe('\x6C');
    });
    it('should return the square marker text', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.style = PdfUnorderedListStyle.square;
        const result: string = list._getStyledText();
        expect(result).toBe('\x6E');
    });
    it('should return the asterisk marker text', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.style = PdfUnorderedListStyle.asterisk;
        const result: string = list._getStyledText();
        expect(result).toBe('\x5D');
    });
    it('should return the circle marker text', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.style = PdfUnorderedListStyle.circle;
        const result: string = list._getStyledText();
        expect(result).toBe('\x6D');
    });
    it('should return an empty marker for an unsupported style', () => {
        const list: PdfUnorderedList = new PdfUnorderedList();
        list._style = -1 as PdfUnorderedListStyle;
        const result: string = list._getStyledText();
        expect(result).toBe('');
    });
});
type PdfListLayouterAccess = {
    _currentPage: PdfPage;
    _currentFont: PdfFont;
    _currentBrush: PdfBrush;
    _currentPen: PdfPen;
    _currentFormat: PdfStringFormat;
    _markerMaxWidth: number;
    _size: number[];
    _bounds: number[];
    _finish: boolean;
    _resultHeight: number;
    _information: _PdfListInfo[];
    _graphics: PdfPage['graphics'];
    _curList: PdfList;
    _indent: number;
    _index: number;
    _usePaginateBounds: boolean;
    _getMarkerMaxWidth(
        list: PdfOrderedList,
        information: _PdfListInfo[]
    ): number;
    _createOrderedMarkerResult(
        list: PdfOrderedList,
        item: PdfListItem,
        index: number,
        information: _PdfListInfo[],
        findMaxWidth: boolean
    ): _PdfStringLayoutResult;
    _createUnorderedMarkerResult(
        list: PdfUnorderedList,
        item: PdfListItem
    ): _PdfStringLayoutResult;
    _createMarkerResult(
        index: number,
        list: PdfList,
        information: _PdfListInfo[],
        item: PdfListItem
    ): _PdfStringLayoutResult;
    _setMarkerStringFormat(
        list: PdfList,
        format: PdfStringFormat
    ): PdfStringFormat;
    _getMarkerFont(
        list: PdfList,
        item: PdfListItem
    ): PdfFont;
    _getMarkerFormat(
        list: PdfList,
        item: PdfListItem
    ): PdfStringFormat;
    _getMarkerPen(
        list: PdfList,
        item: PdfListItem
    ): PdfPen;
    _getMarkerBrush(
        list: PdfList,
        item: PdfListItem
    ): PdfBrush;
    _getNextPage(page: PdfPage): PdfPage;
};
function createOrderedList(
    values: string[] = ['One', 'Two']
): PdfOrderedList {
    const items: PdfListItemCollection =
        new PdfListItemCollection(values);
    return new PdfOrderedList(items);
}
function createUnorderedList(
    values: string[] = ['One', 'Two']
): PdfUnorderedList {
    const items: PdfListItemCollection =
        new PdfListItemCollection(values);
    return new PdfUnorderedList(items);
}
function getListLayouterAccess(
    layouter: _PdfListLayouter
): PdfListLayouterAccess {
    return layouter as unknown as PdfListLayouterAccess;
}
describe('_createOrderedMarkerResult behavior', () => {
    it('should create an empty marker for none numbering style', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const layouter: _PdfListLayouter =
            new _PdfListLayouter(list);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(layouter);
        list.font = markerFont;
        list.style = PdfNumberStyle.none;
        list.suffix = ')';
        access._currentFont = markerFont;
        access._markerMaxWidth = 20;
        access._size = [200, 100];
        // Act
        const result: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                list,
                item,
                0,
                [],
                false
            );
        // Assert
        expect(list._currentIndex).toBe(0);
        expect(result._actualSize.width).toBe(0);
        expect(result._actualSize.height).toBe(0);
        expect(result._empty).toBeTruthy();
    });
    it('should create a nonempty marker for numeric style', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const layouter: _PdfListLayouter =
            new _PdfListLayouter(list);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(layouter);
        list.font = markerFont;
        list.style = PdfNumberStyle.numeric;
        list.startNumber = 4;
        list.suffix = ')';
        access._currentFont = markerFont;
        access._markerMaxWidth = 30;
        access._size = [200, 100];
        // Act
        const result: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                list,
                item,
                0,
                [],
                false
            );
        // Assert
        expect(list._currentIndex).toBe(0);
        expect(list._getNumber()).toBe('4');
        expect(result._empty).toBeFalsy();
        expect(result._actualSize.width).toBeGreaterThan(0);
        expect(result._actualSize.width)
            .toBeLessThanOrEqual(30);
        expect(result._actualSize.height).toBeGreaterThan(0);
    });
    it('should calculate unconstrained marker width when finding maximum width', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        list.font = markerFont;
        list.style = PdfNumberStyle.numeric;
        list.startNumber = 100;
        list.suffix = ')';
        access._currentFont = markerFont;
        access._markerMaxWidth = 1;
        access._size = [200, 100];
        // Act
        const maximumWidthResult: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                list,
                item,
                0,
                [],
                true
            );
        const constrainedResult: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                list,
                item,
                0,
                [],
                false
            );
        // Assert
        expect(maximumWidthResult._actualSize.width)
            .toBeGreaterThan(1);
        expect(constrainedResult._actualSize.width)
            .toBeLessThanOrEqual(1);
    });
    it('should include the enabled parent hierarchy number', () => {
        // Arrange
        const parent: PdfOrderedList =
            createOrderedList(['Parent']);
        const child: PdfOrderedList =
            createOrderedList(['Child']);
        const parentInformation: _PdfListInfo =
            new _PdfListInfo(parent, 0, '8');
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(child));
        parent.style = PdfNumberStyle.numeric;
        parent.delimiter = '.';
        parent.enableHierarchy = true;
        child.font = markerFont;
        child.style = PdfNumberStyle.numeric;
        child.startNumber = 2;
        child.suffix = ')';
        child.enableHierarchy = true;
        access._currentFont = markerFont;
        access._markerMaxWidth = 100;
        access._size = [200, 100];
        // Act
        const hierarchicalResult: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                child,
                child.items.at(0),
                0,
                [parentInformation],
                true
            );
        child.enableHierarchy = false;
        const flatResult: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                child,
                child.items.at(0),
                0,
                [parentInformation],
                true
            );
        // Assert
        expect(hierarchicalResult._actualSize.width)
            .toBeGreaterThan(flatResult._actualSize.width);
        expect(hierarchicalResult._empty).toBeFalsy();
        expect(flatResult._empty).toBeFalsy();
    });
    it('should stop hierarchy at a parent with hierarchy disabled', () => {
        // Arrange
        const outerList: PdfOrderedList =
            createOrderedList(['Outer']);
        const immediateParent: PdfOrderedList =
            createOrderedList(['Parent']);
        const child: PdfOrderedList =
            createOrderedList(['Child']);
        const outerInformation: _PdfListInfo =
            new _PdfListInfo(outerList, 0, '100');
        const parentInformation: _PdfListInfo =
            new _PdfListInfo(immediateParent, 0, '2');
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(child));
        outerList.enableHierarchy = true;
        outerList.delimiter = '.';
        immediateParent.enableHierarchy = false;
        immediateParent.delimiter = '.';
        child.enableHierarchy = true;
        child.font = markerFont;
        child.style = PdfNumberStyle.numeric;
        child.suffix = ')';
        access._currentFont = markerFont;
        access._markerMaxWidth = 100;
        access._size = [200, 100];
        // Act
        const stoppedHierarchy: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                child,
                child.items.at(0),
                0,
                [parentInformation, outerInformation],
                true
            );
        const immediateHierarchy: _PdfStringLayoutResult =
            access._createOrderedMarkerResult(
                child,
                child.items.at(0),
                0,
                [parentInformation],
                true
            );
        // Assert
        expect(stoppedHierarchy._actualSize.width)
            .toBe(immediateHierarchy._actualSize.width);
        expect(stoppedHierarchy._actualSize.height)
            .toBe(immediateHierarchy._actualSize.height);
    });
});
describe('_getMarkerMaxWidth behavior', () => {
    it('should return the widest ordered marker width', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList([
            'One',
            'Two',
            'Three'
        ]);
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        list.font = markerFont;
        list.startNumber = 8;
        list.style = PdfNumberStyle.numeric;
        list.suffix = ')';
        access._currentFont = markerFont;
        access._size = [200, 100];
        // Act
        const maximumWidth: number =
            access._getMarkerMaxWidth(list, []);
        // Assert
        expect(maximumWidth).toBeGreaterThan(0);
        expect(list._currentIndex).toBe(10);
    });
    it('should return negative one for an empty ordered list', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList([]);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        // Act
        const maximumWidth: number =
            access._getMarkerMaxWidth(list, []);
        // Assert
        expect(maximumWidth).toBe(-1);
    });
    it('should return zero width for none-style markers', () => {
        // Arrange
        const list: PdfOrderedList =
            createOrderedList(['One', 'Two']);
        const markerFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        list.font = markerFont;
        list.style = PdfNumberStyle.none;
        access._currentFont = markerFont;
        access._size = [200, 100];
        // Act
        const maximumWidth: number =
            access._getMarkerMaxWidth(list, []);
        // Assert
        expect(maximumWidth).toBe(0);
    });
});
describe('PdfList default values and properties', () => {
    it('should initialize marker size with two zero values', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        // Act
        const markerSize: number[] = list._size;
        // Assert
        expect(markerSize.length).toBe(2);
        expect(markerSize[0]).toBe(0);
        expect(markerSize[1]).toBe(0);
    });
    it('should return every assigned base-list property', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList();
        const brush: PdfBrush =
            new PdfBrush({ r: 10, g: 20, b: 30 });
        const pen: PdfPen =
            new PdfPen({ r: 30, g: 20, b: 10 }, 2);
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.timesRoman, 12);
        const format: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const items: PdfListItemCollection =
            new PdfListItemCollection(['Alpha', 'Beta']);
        // Act
        list.brush = brush;
        list.pen = pen;
        list.font = font;
        list.stringFormat = format;
        list.indent = 21;
        list.textIndent = 13;
        list.delimiter = ')';
        list.suffix = ':';
        list.enableHierarchy = true;
        list.alignment = PdfListMarkerAlignment.right;
        list.items = items;
        // Assert
        expect(list.brush).toBe(brush);
        expect(list.pen).toBe(pen);
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.indent).toBe(21);
        expect(list.textIndent).toBe(13);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.enableHierarchy).toBeTruthy();
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
        expect(list.items).toBe(items);
        expect(list.items.count).toBe(2);
        expect(list.items.at(0).text).toBe('Alpha');
        expect(list.items.at(1).text).toBe('Beta');
    });
    it('should return false for left marker alignment', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList();
        list.alignment = PdfListMarkerAlignment.left;
        // Act
        const markerRightToLeft: boolean =
            list._markerRightToLeft;
        // Assert
        expect(markerRightToLeft).toBeFalsy();
    });
    it('should return true for right marker alignment', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList();
        list.alignment = PdfListMarkerAlignment.right;
        // Act
        const markerRightToLeft: boolean =
            list._markerRightToLeft;
        // Assert
        expect(markerRightToLeft).toBeTruthy();
    });
});
describe('PdfList draw overload behavior', () => {
    it('should use rectangle width and height for a new page', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        const bounds: Rectangle = {
            x: 15,
            y: 25,
            width: 180,
            height: 100
        };
        // Act
        const result: PdfLayoutResult =
            list.draw(page, bounds);
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.x).toBe(15);
        expect(result.bounds.width).toBe(180);
        expect(result.bounds.height).toBeGreaterThan(0);
        document.destroy();
    });
    it('should use zero dimensions for a point location', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        // Act
        const result: PdfLayoutResult =
            list.draw(page, { x: 12, y: 18 });
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.x).toBe(12);
        expect(result.bounds.y).toBeGreaterThanOrEqual(18);
        document.destroy();
    });
    it('should distinguish a rectangle from a point when height is zero', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        const bounds: Rectangle = {
            x: 4,
            y: 6,
            width: 100,
            height: 0
        };
        // Act
        const result: PdfLayoutResult =
            list.draw(page, bounds);
        // Assert
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(4);
        expect(result.bounds.width).toBe(100);
        document.destroy();
    });
    it('should draw through page graphics without returning a layout result', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        // Act
        const result: void =
            list.draw(page.graphics, { x: 10, y: 20 });
        // Assert
        expect(result).toBeUndefined();
        document.destroy();
    });
});
describe('PdfList internal draw behavior', () => {
    it('should create default layout format for undefined width', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        // Act
        const result: PdfLayoutResult =
            list._drawInternal(page, 11, 17);
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.x).toBe(11);
        document.destroy();
    });
    it('should create default layout format for null width', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        // Act
        const result: PdfLayoutResult = list._drawInternal(
            page,
            11,
            17,
            null as unknown as number
        );
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.x).toBe(11);
        document.destroy();
    });
    it('should preserve an explicitly supplied layout format', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult =
            list._drawInternal(page, 8, 14, format);
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.x).toBe(8);
        document.destroy();
    });
    it('should use numeric width and height', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        // Act
        const result: PdfLayoutResult =
            list._drawInternal(page, 10, 20, 150, 80);
        // Assert
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(10);
        expect(result.bounds.width).toBe(150);
        document.destroy();
    });
    it('should use supplied format with numeric bounds', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList(['Item']);
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult =
            list._drawInternal(page, 10, 20, 150, 80, format);
        // Assert
        expect(result).toBeDefined();
        expect(result._page).toBe(page);
        expect(result.bounds.width).toBe(150);
        document.destroy();
    });
});
describe('PdfOrderedList constructor and numbering behavior', () => {
    it('should initialize default ordered-list values', () => {
        // Arrange and Act
        const list: PdfOrderedList = new PdfOrderedList();
        // Assert
        expect(list.items).toBeDefined();
        expect(list.items.count).toBe(0);
        expect(list.style).toBe(PdfNumberStyle.numeric);
        expect(list.startNumber).toBe(1);
    });
    it('should preserve the supplied item collection', () => {
        // Arrange
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One', 'Two']);
        // Act
        const list: PdfOrderedList = new PdfOrderedList(items);
        // Assert
        expect(list.items).toBe(items);
        expect(list.items.count).toBe(2);
    });
    it('should apply all truthy ordered-list constructor settings', () => {
        // Arrange
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One']);
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.timesRoman, 12);
        const format: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const pen: PdfPen =
            new PdfPen({ r: 10, g: 20, b: 30 }, 2);
        const brush: PdfBrush =
            new PdfBrush({ r: 30, g: 20, b: 10 });
        // Act
        const list: PdfOrderedList = new PdfOrderedList(items, {
            font: font,
            format: format,
            pen: pen,
            brush: brush,
            indent: 25,
            textIndent: 15,
            style: PdfNumberStyle.lowerLatin,
            delimiter: ')',
            suffix: ':',
            alignment: PdfListMarkerAlignment.right
        });
        // Assert
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.pen).toBe(pen);
        expect(list.brush).toBe(brush);
        expect(list.indent).toBe(25);
        expect(list.textIndent).toBe(15);
        expect(list.style).toBe(PdfNumberStyle.lowerLatin);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
    });
    it('should retain defaults for omitted ordered-list settings', () => {
        // Arrange
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One']);
        // Act
        const list: PdfOrderedList =
            new PdfOrderedList(items, {});
        // Assert
        expect(list.style).toBe(PdfNumberStyle.numeric);
        expect(list.indent).toBe(10);
        expect(list.textIndent).toBe(5);
        expect(list.delimiter).toBe('.');
        expect(list.suffix).toBe('.');
        expect(list.alignment).toBe(PdfListMarkerAlignment.left);
        expect(list.font).toBeUndefined();
        expect(list.stringFormat).toBeUndefined();
        expect(list.pen).toBeUndefined();
        expect(list.brush).toBeUndefined();
    });
    it('should directly return assigned ordered-list properties', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        // Act
        list.style = PdfNumberStyle.upperRoman;
        list.startNumber = 5;
        // Assert
        expect(list.style).toBe(PdfNumberStyle.upperRoman);
        expect(list.startNumber).toBe(5);
    });
    it('should reject zero as the start number', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        // Act and Assert
        expect((): void => {
            list.startNumber = 0;
        }).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('should reject a negative start number', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        // Act and Assert
        expect((): void => {
            list.startNumber = -1;
        }).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('should format the current numeric list index', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        list.startNumber = 5;
        list.style = PdfNumberStyle.numeric;
        list._currentIndex = 2;
        // Act
        const result: string = list._getNumber();
        // Assert
        expect(result).toBe('7');
    });
});
describe('PdfUnorderedList constructor and style behavior', () => {
    it('should initialize default unordered-list values', (): void => {
        // Arrange and Act
        const list: PdfUnorderedList = new PdfUnorderedList();
        // Assert
        expect(list.items).toBeDefined();
        expect(list.items.count).toBe(0);
        expect(list.style).toBe(PdfUnorderedListStyle.disk);
        expect(list._marker).toBeUndefined();
    });
    it('should apply all unordered-list constructor settings', () => {
        // Arrange
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One']);
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.timesRoman, 12);
        const format: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const pen: PdfPen =
            new PdfPen({ r: 10, g: 20, b: 30 }, 2);
        const brush: PdfBrush =
            new PdfBrush({ r: 30, g: 20, b: 10 });
        // Act
        const list: PdfUnorderedList =
            new PdfUnorderedList(items, {
                font: font,
                format: format,
                pen: pen,
                brush: brush,
                indent: 26,
                textIndent: 16,
                style: PdfUnorderedListStyle.square,
                delimiter: ')',
                suffix: ':',
                alignment: PdfListMarkerAlignment.right
            });
        // Assert
        expect(list.items).toBe(items);
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.pen).toBe(pen);
        expect(list.brush).toBe(brush);
        expect(list.indent).toBe(26);
        expect(list.textIndent).toBe(16);
        expect(list.style).toBe(PdfUnorderedListStyle.square);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
    });
    it('should retain defaults for omitted unordered-list settings', () => {
        // Arrange
        const items: PdfListItemCollection =
            new PdfListItemCollection(['One']);
        // Act
        const list: PdfUnorderedList =
            new PdfUnorderedList(items, {});
        // Assert
        expect(list.style).toBe(PdfUnorderedListStyle.disk);
        expect(list.indent).toBe(10);
        expect(list.textIndent).toBe(5);
        expect(list.delimiter).toBe('.');
        expect(list.suffix).toBe('.');
        expect(list.alignment).toBe(PdfListMarkerAlignment.left);
        expect(list.font).toBeUndefined();
        expect(list.stringFormat).toBeUndefined();
        expect(list.pen).toBeUndefined();
        expect(list.brush).toBeUndefined();
    });
    it('should return every supported unordered marker character', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        // Act and Assert
        list.style = PdfUnorderedListStyle.disk;
        expect(list._getStyledText()).toBe('\x6C');
        list.style = PdfUnorderedListStyle.square;
        expect(list._getStyledText()).toBe('\x6E');
        list.style = PdfUnorderedListStyle.asterisk;
        expect(list._getStyledText()).toBe('\x5D');
        list.style = PdfUnorderedListStyle.circle;
        expect(list._getStyledText()).toBe('\x6D');
    });
    it('should return empty text for an unsupported unordered style', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        list._style = -1 as PdfUnorderedListStyle;
        // Act
        const markerText: string = list._getStyledText();
        // Assert
        expect(markerText).toBe('');
    });
});
describe('PdfUnorderedList image marker behavior', () => {
    function createImage(): PdfBitmap {
        const data: string =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ' +
            'AAAADUlEQVR42mNk+M/wHwAF/gL+X4cAAAAASUVORK5CYII=';
        return new PdfBitmap(data);
    }
    it('should reject a null marker', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        // Act
        const action: () => void = (): void => {
            list.setMarker(
                null as unknown as PdfUnorderMarker
            );
        };
        // Assert
        expect(action).toThrowError(
            'Marker cannot be null or undefined.'
        );
    });
    it('should reject an undefined marker', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        // Act
        const action: () => void = (): void => {
            list.setMarker(
                undefined as unknown as PdfUnorderMarker
            );
        };
        // Assert
        expect(action).toThrowError(
            'Marker cannot be null or undefined.'
        );
    });
    it('should store an explicit image marker size', (): void => {
        // Arrange
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        const marker: PdfUnorderMarker = {
            image: image,
            size: {
                width: 16,
                height: 18
            }
        };
        // Act
        list.setMarker(marker);
        // Assert
        expect(list._marker).toBe(marker);
        expect(list._marker.image).toBe(image);
        expect(list._marker.size).toBe(marker.size);
        expect(list._marker.size.width).toBe(16);
        expect(list._marker.size.height).toBe(18);
    });
    it('should store an image marker without an explicit size', (): void => {
        // Arrange
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        const marker: PdfUnorderMarker = {
            image: image
        };
        // Act
        list.setMarker(marker);
        // Assert
        expect(list._marker).toBe(marker);
        expect(list._marker.image).toBe(image);
        expect(list._marker.size).toBeUndefined();
    });
    it('should replace an existing sized marker with a marker without size', (): void => {
        // Arrange
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.setMarker({
            image: image,
            size: {
                width: 16,
                height: 18
            }
        });
        // Act
        list.setMarker({
            image: image
        });
        // Assert
        expect(list._marker.image).toBe(image);
        expect(list._marker.size).toBeUndefined();
    });
});
describe('PdfUnorderedList marker size calculation', () => {
    function createImage(): PdfBitmap {
        const data: string =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ' +
            'AAAADUlEQVR42mNk+M/wHwAF/gL+X4cAAAAASUVORK5CYII=';
        return new PdfBitmap(data);
    }
    it('should use explicit positive marker dimensions', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.setMarker({
            image: createImage(),
            size: {
                width: 18,
                height: 22
            }
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result).toBe(list._size);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(18);
        expect(result[1]).toBe(22);
    });
    it('should use font size when explicit width is zero', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.setMarker({
            image: createImage(),
            size: {
                width: 0,
                height: 20
            }
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
    });
    it('should use font size when explicit height is zero', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.setMarker({
            image: createImage(),
            size: {
                width: 20,
                height: 0
            }
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(20);
        expect(result[1]).toBe(10);
    });
    it('should use font size for negative explicit dimensions', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.setMarker({
            image: createImage(),
            size: {
                width: -1,
                height: -2
            }
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(10);
    });
    it('should use font size for non-finite explicit dimensions', (): void => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.setMarker({
            image: createImage(),
            size: {
                width: Number.POSITIVE_INFINITY,
                height: Number.NaN
            }
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(10);
    });
    it('should use font size when no explicit marker size exists', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 11);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image
        });
        // Act
        const result: number[] =
            list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(11);
        expect(result[1]).toBe(11);
    });
});
describe('Pdf list marker resolution behavior', () => {
    it('should resolve marker font from the list first', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const listFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const itemFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.timesRoman, 8);
        const item: PdfListItem = list.items.at(0);
        const layouter: _PdfListLayouter =
            new _PdfListLayouter(list);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(layouter);
        list.font = listFont;
        item.font = itemFont;
        access._currentFont =
            new PdfStandardFont(PdfFontFamily.courier, 6);
        // Act
        const result: PdfFont =
            access._getMarkerFont(list, item);
        // Assert
        expect(result).toBe(listFont);
        expect(list.font).toBe(listFont);
    });
    it('should resolve marker font from the item second', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const itemFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.timesRoman, 8);
        const item: PdfListItem = list.items.at(0);
        const layouter: _PdfListLayouter =
            new _PdfListLayouter(list);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(layouter);
        item.font = itemFont;
        access._currentFont =
            new PdfStandardFont(PdfFontFamily.courier, 6);
        // Act
        const result: PdfFont =
            access._getMarkerFont(list, item);
        // Assert
        expect(result).toBe(itemFont);
        expect(list.font).toBe(itemFont);
    });
    it('should resolve marker font from current layout last', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const currentFont: PdfFont =
            new PdfStandardFont(PdfFontFamily.courier, 9);
        const layouter: _PdfListLayouter =
            new _PdfListLayouter(list);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(layouter);
        access._currentFont = currentFont;
        // Act
        const result: PdfFont =
            access._getMarkerFont(list, item);
        // Assert
        expect(result).toBe(currentFont);
        expect(list.font).toBe(currentFont);
    });
    it('should resolve marker format in priority order', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const listFormat: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.right);
        const itemFormat: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const currentFormat: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.left);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        access._currentFormat = currentFormat;
        // Act and Assert
        list.stringFormat = listFormat;
        item.stringFormat = itemFormat;
        expect(access._getMarkerFormat(list, item))
            .toBe(listFormat);
        list.stringFormat = undefined;
        expect(access._getMarkerFormat(list, item))
            .toBe(itemFormat);
        item.stringFormat = undefined;
        expect(access._getMarkerFormat(list, item))
            .toBe(currentFormat);
    });
    it('should resolve marker pen in priority order', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const listPen: PdfPen =
            new PdfPen({ r: 1, g: 2, b: 3 }, 1);
        const itemPen: PdfPen =
            new PdfPen({ r: 4, g: 5, b: 6 }, 2);
        const currentPen: PdfPen =
            new PdfPen({ r: 7, g: 8, b: 9 }, 3);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        access._currentPen = currentPen;
        // Act and Assert
        list.pen = listPen;
        item.pen = itemPen;
        expect(access._getMarkerPen(list, item)).toBe(listPen);
        list.pen = undefined;
        expect(access._getMarkerPen(list, item)).toBe(itemPen);
        item.pen = undefined;
        expect(access._getMarkerPen(list, item))
            .toBe(currentPen);
    });
    it('should resolve marker brush in priority order', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const listBrush: PdfBrush =
            new PdfBrush({ r: 1, g: 2, b: 3 });
        const itemBrush: PdfBrush =
            new PdfBrush({ r: 4, g: 5, b: 6 });
        const currentBrush: PdfBrush =
            new PdfBrush({ r: 7, g: 8, b: 9 });
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        access._currentBrush = currentBrush;
        // Act and Assert
        list.brush = listBrush;
        item.brush = itemBrush;
        expect(access._getMarkerBrush(list, item))
            .toBe(listBrush);
        list.brush = undefined;
        expect(access._getMarkerBrush(list, item))
            .toBe(itemBrush);
        item.brush = undefined;
        expect(access._getMarkerBrush(list, item))
            .toBe(currentBrush);
    });
});
describe('Pdf marker format behavior', () => {
    it('should align a right-to-left marker to the left', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        list.alignment = PdfListMarkerAlignment.right;
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        // Act
        const result: PdfStringFormat =
            access._setMarkerStringFormat(
                list,
                undefined
            );
        // Assert
        expect(result.alignment).toBe(PdfTextAlignment.left);
    });
    it('should not mutate a supplied marker format', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const format: PdfStringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        access._currentPage =
            new PdfDocument().addPage();
        // Act
        const result: PdfStringFormat =
            access._setMarkerStringFormat(list, format);
        // Assert
        expect(result).not.toBe(format);
        expect(format.alignment).toBe(PdfTextAlignment.center);
        expect(result.alignment).toBe(PdfTextAlignment.right);
        access._currentPage._crossReference._document.destroy();
    });
    it('should align graphics-only marker output to the left', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        list.stringFormat =
            new PdfStringFormat(PdfTextAlignment.center);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        access._currentPage = undefined;
        // Act
        const result: PdfStringFormat =
            access._setMarkerStringFormat(
                list,
                list.stringFormat
            );
        // Assert
        expect(result).not.toBe(list.stringFormat);
        expect(result.alignment).toBe(PdfTextAlignment.left);
        expect(list.stringFormat.alignment)
            .toBe(PdfTextAlignment.center);
    });
});
describe('Ordered hierarchy and marker-width behavior', () => {
    it('should create a marker with the configured suffix', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        list.font = font;
        list.startNumber = 1;
        list.suffix = ')';
        list.style = PdfNumberStyle.numeric;
        access._currentFont = font;
        access._markerMaxWidth = 25;
        access._size = [200, 100];
        // Act
        const result = access._createOrderedMarkerResult(
            list,
            item,
            0,
            [],
            false
        );
        // Assert
        expect(result).toBeDefined();
        expect(result._actualSize.width).toBeGreaterThan(0);
        expect(result._actualSize.height).toBeGreaterThan(0);
        expect(list._currentIndex).toBe(0);
    });
    it('should produce an empty marker for none numbering style', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList(['One']);
        const item: PdfListItem = list.items.at(0);
        const font: PdfFont =
            new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const access: PdfListLayouterAccess =
            getListLayouterAccess(new _PdfListLayouter(list));
        list.font = font;
        list.style = PdfNumberStyle.none;
        access._currentFont = font;
        access._size = [200, 100];
        // Act
        const result = access._createOrderedMarkerResult(
            list,
            item,
            0,
            [],
            false
        );
        // Assert
        expect(result).toBeDefined()
    });
});
function createListItems(values: string[]): PdfListItemCollection {
    return new PdfListItemCollection(values);
}
function createDocumentPage(): {
    document: PdfDocument;
    page: PdfPage;
} {
    const document: PdfDocument = new PdfDocument();
    const page: PdfPage = document.addPage();
    return { document, page };
}
function createOrderedList1(): PdfOrderedList {
    const items: PdfListItemCollection = createListItems([
        'First item',
        'Second item'
    ]);
    return new PdfOrderedList(items);
}
function createUnorderedList1(): PdfUnorderedList {
    const items: PdfListItemCollection = createListItems([
        'First item',
        'Second item'
    ]);
    return new PdfUnorderedList(items);
}
function accessLayouter(layouter: _PdfListLayouter): {
    _layoutOnPage: Function;
    _drawItem: Function;
    _createMarkerResult: Function;
    _drawMarker: Function;
    _createUnorderedMarkerResult: Function;
    _createOrderedMarkerResult: Function;
    _setMarkerStringFormat: Function;
    _getMarkerMaxWidth: Function;
} {
    return layouter as unknown as {
        _layoutOnPage: Function;
        _drawItem: Function;
        _createMarkerResult: Function;
        _drawMarker: Function;
        _createUnorderedMarkerResult: Function;
        _createOrderedMarkerResult: Function;
        _setMarkerStringFormat: Function;
        _getMarkerMaxWidth: Function;
    };
}
describe('PdfList source mutation coverage', () => {
    it('PdfList properties return directly assigned values', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        const brush: PdfBrush = new PdfBrush({ r: 10, g: 20, b: 30 });
        const pen: PdfPen = new PdfPen({ r: 40, g: 50, b: 60 }, 2);
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center);
        const items: PdfListItemCollection = createListItems(['Replacement']);
        // Act
        list.brush = brush;
        list.pen = pen;
        list.font = font;
        list.stringFormat = format;
        list.indent = 25;
        list.textIndent = 15;
        list.delimiter = ')';
        list.suffix = ':';
        list.enableHierarchy = true;
        list.alignment = PdfListMarkerAlignment.right;
        list.items = items;
        // Assert
        expect(list.brush).toBe(brush);
        expect(list.pen).toBe(pen);
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.indent).toBe(25);
        expect(list.textIndent).toBe(15);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.enableHierarchy).toBeTruthy();
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
        expect(list.items).toBe(items);
        expect(list._markerRightToLeft).toBeTruthy();
    });
    it('markerRightToLeft is false for left marker alignment', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        list.alignment = PdfListMarkerAlignment.left;
        const result: boolean = list._markerRightToLeft;
        // Assert
        expect(result).toBeFalsy();
    });
    it('draw accepts rectangle bounds and returns exact bounds', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const result: PdfLayoutResult = list.draw(
            harness.page,
            { x: 20, y: 30, width: 200, height: 300 }
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(20);
        expect(result.bounds.y).toBeGreaterThanOrEqual(30);
        expect(result.bounds.width).toBe(200);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        harness.document.destroy();
    });
    it('draw accepts point location without treating it as rectangle bounds', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const result: PdfLayoutResult = list.draw(
            harness.page,
            { x: 25, y: 35 }
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(25);
        expect(result.bounds.y).toBeGreaterThanOrEqual(35);
        expect(result.bounds.width).toBeGreaterThan(0);
        expect(result.bounds.height).toBeGreaterThanOrEqual(0);
        harness.document.destroy();
    });
    it('draw accepts point location and supplied layout format', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult = list.draw(
            harness.page,
            { x: 15, y: 25 },
            format
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(15);
        expect(result.bounds.y).toBeGreaterThanOrEqual(25);
        harness.document.destroy();
    });
    it('draw on graphics completes without returning a page layout result', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const result: void = list.draw(
            harness.page.graphics,
            { x: 10, y: 20 }
        );
        // Assert
        expect(result).toBeUndefined();
        harness.document.destroy();
    });
    it('drawInternal uses provided width height and layout format', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult = list._drawInternal(
            harness.page,
            10,
            20,
            150,
            180,
            format
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(10);
        expect(result.bounds.y).toBeGreaterThanOrEqual(20);
        expect(result.bounds.width).toBe(150);
        harness.document.destroy();
    });
    it('drawInternal uses default format when supplied format is undefined', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const result: PdfLayoutResult = list._drawInternal(
            harness.page,
            5,
            10,
            120,
            150
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(5);
        expect(result.bounds.width).toBe(120);
        harness.document.destroy();
    });
    it('drawInternal uses supplied PdfLayoutFormat as fourth argument', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult = list._drawInternal(
            harness.page,
            12,
            18,
            format
        );
        // Assert
        expect(result).toBeDefined();
        expect(result.Page).toBe(harness.page);
        expect(result.bounds.x).toBe(12);
        expect(result.bounds.y).toBeGreaterThanOrEqual(18);
        harness.document.destroy();
    });
});
describe('PdfOrderedList source mutation coverage', () => {
    it('constructor creates empty collection and numeric style', () => {
        // Arrange
        const list: PdfOrderedList = new PdfOrderedList();
        // Act
        const itemCount: number = list.items.count;
        const style: PdfNumberStyle = list.style;
        // Assert
        expect(itemCount).toBe(0);
        expect(style).toBe(PdfNumberStyle.numeric);
        expect(list.startNumber).toBe(1);
    });
    it('constructor assigns every supplied ordered-list setting', () => {
        // Arrange
        const items: PdfListItemCollection = createListItems(['One']);
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 14);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center);
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        // Act
        const list: PdfOrderedList = new PdfOrderedList(items, {
            font: font,
            format: format,
            pen: pen,
            brush: brush,
            indent: 30,
            textIndent: 40,
            style: PdfNumberStyle.lowerLatin,
            delimiter: ')',
            suffix: ':',
            alignment: PdfListMarkerAlignment.right
        });
        // Assert
        expect(list.items).toBe(items);
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.pen).toBe(pen);
        expect(list.brush).toBe(brush);
        expect(list.indent).toBe(30);
        expect(list.textIndent).toBe(40);
        expect(list.style).toBe(PdfNumberStyle.lowerLatin);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
    });
    it('constructor uses numeric style when settings omit style', () => {
        // Arrange
        const items: PdfListItemCollection = createListItems(['One']);
        // Act
        const list: PdfOrderedList = new PdfOrderedList(items, {
            indent: 20
        });
        // Assert
        expect(list.style).toBe(PdfNumberStyle.numeric);
        expect(list.indent).toBe(20);
    });
    it('style property returns directly assigned style', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        list.style = PdfNumberStyle.upperRoman;
        // Assert
        expect(list.style).toBe(PdfNumberStyle.upperRoman);
    });
    it('startNumber property returns positive assigned value', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        list.startNumber = 5;
        // Assert
        expect(list.startNumber).toBe(5);
    });
    it('startNumber rejects zero', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const operation: () => void = (): void => {
            list.startNumber = 0;
        };
        // Assert
        expect(operation).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('startNumber rejects negative value', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const operation: () => void = (): void => {
            list.startNumber = -1;
        };
        // Assert
        expect(operation).toThrowError('Start number should be greater than 0.');
        expect(list.startNumber).toBe(1);
    });
    it('getNumber includes start number and current index', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        list.startNumber = 4;
        list.style = PdfNumberStyle.numeric;
        list._currentIndex = 2;
        // Act
        const result: string = list._getNumber();
        // Assert
        expect(result).toBe('6');
    });
});
describe('PdfUnorderedList source mutation coverage', () => {
    function createImage(): PdfBitmap {
        const data: string =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ' +
            'AAAADUlEQVR42mNk+M/wHwAF/gL+X4cAAAAASUVORK5CYII=';
        return new PdfBitmap(data);
    }
    it('constructor creates empty collection and disk style', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        // Act
        const itemCount: number = list.items.count;
        const style: PdfUnorderedListStyle = list.style;
        // Assert
        expect(itemCount).toBe(0);
        expect(style).toBe(PdfUnorderedListStyle.disk);
    });
    it('constructor assigns every supplied unordered-list setting', () => {
        // Arrange
        const items: PdfListItemCollection = createListItems(['One']);
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 14);
        const format: PdfStringFormat = new PdfStringFormat(PdfTextAlignment.center);
        const pen: PdfPen = new PdfPen({ r: 255, g: 0, b: 0 }, 2);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 255, b: 0 });
        // Act
        const list: PdfUnorderedList = new PdfUnorderedList(items, {
            font: font,
            format: format,
            pen: pen,
            brush: brush,
            indent: 30,
            textIndent: 40,
            style: PdfUnorderedListStyle.square,
            delimiter: ')',
            suffix: ':',
            alignment: PdfListMarkerAlignment.right
        });
        // Assert
        expect(list.items).toBe(items);
        expect(list.font).toBe(font);
        expect(list.stringFormat).toBe(format);
        expect(list.pen).toBe(pen);
        expect(list.brush).toBe(brush);
        expect(list.indent).toBe(30);
        expect(list.textIndent).toBe(40);
        expect(list.style).toBe(PdfUnorderedListStyle.square);
        expect(list.delimiter).toBe(')');
        expect(list.suffix).toBe(':');
        expect(list.alignment).toBe(PdfListMarkerAlignment.right);
    });
    it('constructor uses disk style when settings omit style', () => {
        // Arrange
        const items: PdfListItemCollection = createListItems(['One']);
        // Act
        const list: PdfUnorderedList = new PdfUnorderedList(items, {
            indent: 20
        });
        // Assert
        expect(list.style).toBe(PdfUnorderedListStyle.disk);
        expect(list.indent).toBe(20);
    });
    it('style property returns directly assigned style', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        // Act
        list.style = PdfUnorderedListStyle.circle;
        // Assert
        expect(list.style).toBe(PdfUnorderedListStyle.circle);
    });
    it('getStyledText returns exact disk marker', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        list.style = PdfUnorderedListStyle.disk;
        // Act
        const result: string = list._getStyledText();
        // Assert
        expect(result).toBe('\x6C');
    });
    it('getStyledText returns exact square marker', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        list.style = PdfUnorderedListStyle.square;
        // Act
        const result: string = list._getStyledText();
        // Assert
        expect(result).toBe('\x6E');
    });
    it('getStyledText returns exact asterisk marker', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        list.style = PdfUnorderedListStyle.asterisk;
        // Act
        const result: string = list._getStyledText();
        // Assert
        expect(result).toBe('\x5D');
    });
    it('getStyledText returns exact circle marker', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        list.style = PdfUnorderedListStyle.circle;
        // Act
        const result: string = list._getStyledText();
        // Assert
        expect(result).toBe('\x6D');
    });
    it('calculateMarkerSize uses font size when explicit size is absent', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(12);
        expect(result[1]).toBe(12);
        expect(result).toBe(list._size);
    });
    it('calculateMarkerSize uses valid explicit image size', (): void => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image,
            size: { width: 20, height: 30 }
        });
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(20);
        expect(result[1]).toBe(30);
        expect(list._size[0]).toBe(20);
        expect(list._size[1]).toBe(30);
    });
    it('calculateMarkerSize replaces zero explicit width with font size', (): void => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image,
            size: { width: 0, height: 20 }
        });
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(12);
        expect(result[1]).toBe(20);
    });
    it('calculateMarkerSize replaces negative explicit width with font size', (): void => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image,
            size: { width: -1, height: 20 }
        });
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(12);
        expect(result[1]).toBe(20);
    });
    it('calculateMarkerSize replaces zero explicit height with font size', (): void => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image,
            size: { width: 20, height: 0 }
        });
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(20);
        expect(result[1]).toBe(12);
    });
    it('calculateMarkerSize replaces nonfinite dimensions with font size', (): void => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        const image: PdfBitmap = createImage();
        list.setMarker({
            image: image,
            size: {
                width: Number.POSITIVE_INFINITY,
                height: Number.NaN
            }
        });
        // Act
        const result: number[] = list._calculateMarkerSize(font);
        // Assert
        expect(result[0]).toBe(12);
        expect(result[1]).toBe(12);
    });
});
describe('_PdfListInfo source mutation coverage', () => {
    it('constructor stores list index and number', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const information: _PdfListInfo = new _PdfListInfo(list, 2, '3');
        // Assert
        expect(information._list).toBe(list);
        expect(information._index).toBe(2);
        expect(information._number).toBe('3');
    });
});
describe('_PdfListLayouter source mutation coverage', () => {
    it('constructor initializes mutation-sensitive default properties', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        // Act
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        // Assert
        expect(layouter._element).toBe(list);
        expect(layouter._information.length).toBe(0);
        expect(layouter._usePaginateBounds).toBeTruthy();
        expect(layouter._size.length).toBe(2);
        expect(layouter._size[0]).toBe(0);
        expect(layouter._size[1]).toBe(0);
        expect(layouter._finish).toBeFalsy();
        expect(layouter._markerMaxWidth).toBe(0);
    });
    it('layoutInternal expands zero bounds using page client size', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const parameters: _PdfLayoutParameters = new _PdfLayoutParameters();
        const pageWidth: number = harness.page.graphics.clientSize.width;
        const pageHeight: number = harness.page.graphics.clientSize.height;
        parameters._page = harness.page;
        parameters._bounds = [10, 20, 0, 0];
        parameters._format = new PdfLayoutFormat();
        parameters._format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult = layouter.layoutInternal(parameters);
        // Assert
        expect(result).toBeDefined();
        expect(layouter._bounds[0]).toBe(10);
        expect(layouter._bounds[1]).toBe(20);
        expect(layouter._bounds[2]).toBe(pageWidth - 10);
        expect(layouter._bounds[3]).toBe(pageHeight - 20);
        expect(harness.page.graphics._isLayouter).toBeTruthy();
        expect(layouter._information.length).toBe(0);
        harness.document.destroy();
    });
    it('layoutInternal preserves explicit nonzero bounds', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const parameters: _PdfLayoutParameters = new _PdfLayoutParameters();
        parameters._page = harness.page;
        parameters._bounds = [10, 20, 200, 300];
        parameters._format = new PdfLayoutFormat();
        parameters._format.layout = PdfLayoutType.onePage;
        // Act
        const result: PdfLayoutResult = layouter.layoutInternal(parameters);
        // Assert
        expect(result).toBeDefined();
        expect(layouter._bounds[0]).toBe(10);
        expect(layouter._bounds[1]).toBe(20);
        expect(layouter._bounds[2]).toBe(200);
        expect(layouter._bounds[3]).toBe(300);
        harness.document.destroy();
    });
    it('layoutInternal copies supplied bounds instead of mutating input array', () => {
        // Arrange
        const harness: {
            document: PdfDocument;
            page: PdfPage;
        } = createDocumentPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const bounds: number[] = [10, 20, 200, 300];
        const parameters: _PdfLayoutParameters = new _PdfLayoutParameters();
        parameters._page = harness.page;
        parameters._bounds = bounds;
        parameters._format = new PdfLayoutFormat();
        parameters._format.layout = PdfLayoutType.onePage;
        // Act
        layouter.layoutInternal(parameters);
        layouter._bounds[0] = 50;
        // Assert
        expect(bounds[0]).toBe(10);
        expect(bounds[1]).toBe(20);
        expect(bounds[2]).toBe(200);
        expect(bounds[3]).toBe(300);
        expect(layouter._bounds).not.toBe(bounds);
        harness.document.destroy();
    });
    it('setMarkerStringFormat sets right alignment for normal marker direction', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _setMarkerStringFormat: Function;
        } = accessLayouter(layouter);
        list.alignment = PdfListMarkerAlignment.left;
        list.stringFormat = undefined;
        layouter._currentPage = page;
        // Act
        const result: PdfStringFormat = accessibleLayouter._setMarkerStringFormat(
            list,
            undefined
        ) as PdfStringFormat;
        // Assert
        expect(result).toBeDefined();
        expect(result.alignment).toBe(PdfTextAlignment.right);
        expect(list._markerRightToLeft).toBeFalsy();
        document.destroy();
    });
    it('setMarkerStringFormat sets left alignment for right-to-left marker', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _setMarkerStringFormat: Function;
        } = accessLayouter(layouter);
        list.alignment = PdfListMarkerAlignment.right;
        list.stringFormat = undefined;
        // Act
        const result: PdfStringFormat = accessibleLayouter._setMarkerStringFormat(
            list,
            undefined
        ) as PdfStringFormat;
        // Assert
        expect(result).toBeDefined();
        expect(result.alignment).toBe(PdfTextAlignment.left);
    });
    it('setMarkerStringFormat clones supplied format without mutating input', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _setMarkerStringFormat: Function;
        } = accessLayouter(layouter);
        const sourceFormat: PdfStringFormat = new PdfStringFormat(
            PdfTextAlignment.center
        );
        list.stringFormat = sourceFormat;
        layouter._currentPage = page;
        // Act
        const result: PdfStringFormat = accessibleLayouter._setMarkerStringFormat(
            list,
            sourceFormat
        ) as PdfStringFormat;
        // Assert
        expect(result).toBeDefined();
        expect(result).not.toBe(sourceFormat);
        expect(result.alignment).toBe(PdfTextAlignment.center);
        expect(sourceFormat.alignment).toBe(PdfTextAlignment.center);
        expect(list.stringFormat).toBe(sourceFormat);
        document.destroy();
    });
    it('createMarkerResult returns ordered marker for ordered list', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        list.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _createMarkerResult: Function;
        } = accessLayouter(layouter);
        layouter._currentFont = list.font;
        layouter._size = [200, 200];
        layouter._markerMaxWidth = 50;
        const item: PdfListItem = list.items.at(0);
        const information: _PdfListInfo[] = [];
        // Act
        const result: _PdfStringLayoutResult = accessibleLayouter._createMarkerResult(
            0,
            list,
            information,
            item
        ) as _PdfStringLayoutResult;
        // Assert
        expect(result).toBeDefined();
        expect(result._actualSize.width).toBeGreaterThan(0);
        expect(result._actualSize.height).toBeGreaterThan(0);
    });
    it('createMarkerResult returns unordered marker for unordered list', () => {
        // Arrange
        const list: PdfUnorderedList = createUnorderedList1();
        list.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _createMarkerResult: Function;
        } = accessLayouter(layouter);
        layouter._currentFont = list.font;
        layouter._size = [200, 200];
        const item: PdfListItem = list.items.at(0);
        const information: _PdfListInfo[] = [];
        // Act
        const result: _PdfStringLayoutResult = accessibleLayouter._createMarkerResult(
            0,
            list,
            information,
            item
        ) as _PdfStringLayoutResult;
        // Assert
        expect(result).toBeDefined();
        expect(result._actualSize.width).toBeGreaterThan(0);
        expect(result._actualSize.height).toBeGreaterThan(0);
        expect(list._size[0]).toBe(result._actualSize.width);
        expect(list._size[1]).toBe(result._actualSize.height);
    });
    it('ordered marker hierarchy uses a copied information collection', () => {
        // Arrange
        const parentList: PdfOrderedList = createOrderedList1();
        parentList.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        parentList.enableHierarchy = true;
        parentList.startNumber = 1;
        const childList: PdfOrderedList = createOrderedList1();
        childList.font = parentList.font;
        childList.enableHierarchy = true;
        const parentInformation: _PdfListInfo = new _PdfListInfo(
            parentList,
            0,
            '1'
        );
        const information: _PdfListInfo[] = [parentInformation];
        const layouter: _PdfListLayouter = new _PdfListLayouter(childList);
        const accessibleLayouter: {
            _createOrderedMarkerResult: Function;
        } = accessLayouter(layouter);
        layouter._currentFont = childList.font;
        layouter._currentFormat = new PdfStringFormat();
        layouter._size = [200, 200];
        layouter._markerMaxWidth = 100;
        const item: PdfListItem = childList.items.at(0);
        // Act
        const result: _PdfStringLayoutResult =
            accessibleLayouter._createOrderedMarkerResult(
                childList,
                item,
                1,
                information,
                false
            ) as _PdfStringLayoutResult;
        // Assert
        expect(result).toBeDefined();
        expect(result._actualSize.width).toBeGreaterThan(0);
        expect(information.length).toBe(1);
        expect(information[0]).toBe(parentInformation);
    });
    it('getMarkerMaxWidth returns positive maximum marker width', () => {
        // Arrange
        const list: PdfOrderedList = createOrderedList1();
        list.font = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        list.startNumber = 8;
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _getMarkerMaxWidth: Function;
        } = accessLayouter(layouter);
        layouter._currentFont = list.font;
        layouter._currentFormat = new PdfStringFormat();
        layouter._size = [200, 200];
        const information: _PdfListInfo[] = [];
        // Act
        const result: number = accessibleLayouter._getMarkerMaxWidth(
            list,
            information
        ) as number;
        // Assert
        expect(result).toBeGreaterThan(0);
        expect(information.length).toBe(0);
    });
    it('getNextPage returns existing next page when available', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _getNextPage: Function;
        } = layouter as unknown as {
            _getNextPage: Function;
        };
        // Act
        const result: PdfPage = accessibleLayouter._getNextPage(
            firstPage
        ) as PdfPage;
        // Assert
        expect(result).toBe(secondPage);
        expect(document.pageCount).toBe(2);
        document.destroy();
    });
    it('getNextPage adds a new page when current page is last', () => {
        // Arrange
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const list: PdfOrderedList = createOrderedList1();
        const layouter: _PdfListLayouter = new _PdfListLayouter(list);
        const accessibleLayouter: {
            _getNextPage: Function;
        } = layouter as unknown as {
            _getNextPage: Function;
        };
        // Act
        const result: PdfPage = accessibleLayouter._getNextPage(
            firstPage
        ) as PdfPage;
        // Assert
        expect(result).toBeDefined();
        expect(result).not.toBe(firstPage);
        expect(document.pageCount).toBe(2);
        expect(result._pageIndex).toBe(1);
        document.destroy();
    });
});