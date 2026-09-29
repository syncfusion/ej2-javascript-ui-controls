import { PdfLayoutType, PdfListMarkerAlignment, PdfRotationAngle, PdfTextAlignment, PdfUnorderedListStyle } from '../src/pdf/core/enumerator';
import { PdfFontFamily, PdfStandardFont } from '../src/pdf/core/fonts/pdf-standard-font';
import { PdfStringFormat } from '../src/pdf/core/fonts/pdf-string-format';
import { PdfBitmap } from '../src/pdf/core/graphics/images/pdf-bitmap';
import { PdfImage } from '../src/pdf/core/graphics/images/pdf-image';
import { PdfGraphics, PdfBrush, PdfPen } from '../src/pdf/core/graphics/pdf-graphics';
import { PdfLayoutFormat } from '../src/pdf/core/graphics/pdf-layouter';
import { _PdfListLayouter, PdfOrderedList, PdfUnorderedList } from '../src/pdf/core/list/pdf-list';
import { PdfListItem, PdfListItemCollection } from '../src/pdf/core/list/pdf-list-item';
import { PdfDocument, PdfMargins, PdfPageSettings } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { Rectangle, Size } from '../src/pdf/core/pdf-type';
import { _PdfContentStream } from '../src/pdf/core/base-stream';
import { _ContentParser } from '../src/pdf/core/content-parser';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { imageData } from './inputs.spec';
type ContentStreamOperation = {
    _operator: string;
    _operands: string[];
};
type ImageMarkerContentCase = {
    pageIndex: number;
    pageHeight: string;
    clipOperands: string[];
    translateOperands: string[];
    texts: string[];
    imageTransforms: string[][];
};
const defaultClipOperands: string[] = ['40.000', '-40.000', '515.000', '-762.000'];
const defaultTranslateOperands: string[] = ['1.00', '.00', '.00', '1.00', '40.00', '-40.00'];
function createContentCase(texts: string[], imageTransforms: string[][], pageHeight: string = '842.00',
    clipOperands: string[] = defaultClipOperands,
    translateOperands: string[] = defaultTranslateOperands): ImageMarkerContentCase {
    return {
        pageIndex: 0,
        pageHeight: pageHeight,
        clipOperands: clipOperands,
        translateOperands: translateOperands,
        texts: texts,
        imageTransforms: imageTransforms
    };
}
const imageMarkerContentCases: { [key: string]: ImageMarkerContentCase } = {
    ac01: createContentCase(['(AC-01: Image marker assignment renders image marker)', '(Image marker assigned without explicit style)', '(Image marker should get priority over unordered)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50']]),
    ac01Ac17: createContentCase(['(AC-01 and AC-17: Constructor image marker with item collection)', '(Constructor image item 0)', '(Constructor image item 1)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50']]),
    ac02Ac19: createContentCase(['(AC-02 and AC-19: Image assigned last overrides style)', '(Image overrides style item 0)', '(Image overrides style item 1)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50']]),
    ac19StyleAfterImage: createContentCase(['(AC-19: Style assigned after image keeps image marker priority)', '(Disk marker item 0)', '(Disk marker item 1)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50']]),
    ac03: createContentCase(['(AC-03: Same image marker applies to all list items)', '(List-level image marker item 0)', '(List-level image marker item 1)', '(List-level image marker item 2)', '(List-level image marker item 3)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50'], ['1.00', '.00', '.00', '1.00', '20.00', '-92.99'], ['1.00', '.00', '.00', '1.00', '20.00', '-111.49']]),
    ac04: createContentCase(['(AC-04: Sublist image marker does not affect parent marker)', '(Parent item with default marker)', '(Sub item with image marker)'], [['1.00', '.00', '.00', '1.00', '20.00', '-96.00'], ['1.00', '.00', '.00', '1.00', '45.00', '-74.50']]),
    ac05: createContentCase(['(AC-05: Nested list image marker support)', '(Level 1 image marker)', '(Level 2 image marker)', '(Level 3 image marker)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '45.00', '-74.50'], ['1.00', '.00', '.00', '1.00', '75.00', '-92.99']]),
    ac06: createContentCase(['(AC-06: Image markers across paginated list)', '(Paginated image marker)', '(item 0 This is a long)', '(unordered list item text that)', '(should wrap across multiple)', '(lines when the list is drawn)', '(inside a narrow rectangle.)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    ac07: createContentCase(['(AC-07: Wrapped text with one image marker)', '(This is a long)', '(unordered list item)', '(text that should)', '(wrap across)', '(multiple lines)', '(when the list is)', '(drawn inside a)', '(narrow rectangle.)', '(The image marker)', '(should be)', '(rendered once for)', '(the item, and the)', '(wrapped text)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    ac08: createContentCase(['(AC-08: Image marker respects indent and textIndent)', '(Indented image marker item)', '(Second indented image marker item)'], [['1.00', '.00', '.00', '1.00', '40.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '40.00', '-74.50']]),
    ac09: createContentCase(['(AC-09: Left and right image marker alignment)', '(Left aligned image marker item)', '(Right aligned image marker item)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '260.29', '-136.00']]),
    ac10: createContentCase(['(AC-10: Text alignment should not move image marker)', '(Left text alignment item)', '(Center text alignment item)', '(Right text alignment item)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-131.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-206.00']]),
    ac11: createContentCase(['(AC-11: Image marker uses template rendering pipeline)', '(Template pipeline image marker item)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    ac12Ac14Ac23Ac24: createContentCase(['(AC-12, AC-14, AC-23, AC-24: Image scaling and padding)', '(Scaled image marker item with one pixel padding)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    ac13Ac22: createContentCase(['(AC-13 and AC-22: No public image width or height API)', '(Image marker size is controlled internally)', '(No public imageWidth, imageHeight, imageSize API)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50']]),
    ac15Null: createContentCase(['(AC-15: Null image assignment validation)', '(Assigning null image correctly throws: Image cannot be null or undefined.)'], []),
    ac15Undefined: createContentCase(['(AC-15: Undefined image assignment validation)', '(Assigning undefined image correctly throws: Image cannot be null or undefined.)'], []),
    ac16: createContentCase(['(AC-16: Same image instance reused across lists)', '(List 1 uses shared image instance)', '(List 2 uses same shared image instance)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-136.00']]),
    ac17: createContentCase(['(AC-17: Image marker with PdfListItemCollection initialization)', '(Excel)', '(Word)', '(PDF)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00'], ['1.00', '.00', '.00', '1.00', '20.00', '-74.50'], ['1.00', '.00', '.00', '1.00', '20.00', '-92.99']]),
    ac18: createContentCase(['(AC-18: Image marker stable with paginate layout bounds)', '(Layout bounds)', '(image marker item)', '(0 This is a long)', '(unordered list item)', '(text that should)', '(wrap across)', '(multiple lines)', '(when the list is)'], [['1.00', '.00', '.00', '1.00', '40.00', '-56.00']]),
    ac20: createContentCase(['(AC-20: Ordered list does not expose image marker API)', '(Ordered list item 1)', '(1.)', '(Ordered list item 2)', '(2.)', '(The ordered list is rendered with normal ordered markers. No image property is available.)'], []),
    ac21: createContentCase(['(AC-21: No per-item image marker API)', '(List item does not expose per-item image marker API)', '(The image marker is configured at list level. The PdfListItem has no image, markerImage, or marker property.)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    ac25: createContentCase(['(AC-25: Image marker and text are rendered for same item)', '(Rendering order item: image marker and text are both)', '(rendered)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    sizedExplicitMethod: createContentCase(['(Sized Marker: setImageMarker uses explicit size)', '(Explicit sized image marker through method)'], [['1.00', '.00', '.00', '1.00', '20.00', '-60.00']]),
    sizedActualMethod: createContentCase(['(Sized Marker: setImageMarker uses actual image size)', '(Actual image size marker through method)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    sizedConstructorExplicit: createContentCase(['(Sized Marker: constructor imageMarker explicit size)', '(Constructor explicit imageMarker size item 0)'], [['1.00', '.00', '.00', '1.00', '20.00', '-58.00']]),
    sizedConstructorActual: createContentCase(['(Sized Marker: constructor imageMarker actual image size)', '(Constructor actual imageMarker size item 0)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    sizedFallback: createContentCase(['(Sized Marker: fallback to marker font size)', '(Fallback image marker size item)'], [['1.00', '.00', '.00', '1.00', '20.00', '-56.00']]),
    sizedRestrictions: createContentCase(['(Sized Marker: imageMarker does not accept brush font pen)', '(Image marker object restriction)'], [['1.00', '.00', '.00', '1.00', '20.00', '-60.00']]),
    pageSizeSmallPage: createContentCase(['(Page Size: Small page image marker)', '(Small page image)', '(marker item 0)', '(Small page image)', '(marker item 1)'], [['1.00', '.00', '.00', '1.00', '40.00', '-65.00'], ['1.00', '.00', '.00', '1.00', '40.00', '-101.99']], '300.00', ['20.000', '-20.000', '260.000', '-260.000'], ['1.00', '.00', '.00', '1.00', '20.00', '-20.00']),
    marginZeroPage: createContentCase(['(Margin: Zero margin image marker)', '(Zero margin image marker item 0)'], [['1.00', '.00', '.00', '1.00', '30.00', '-60.00']], '842.00', ['0.000', '0.000', '595.000', '-842.000'], ['1.00', '.00', '.00', '1.00', '.00', '.00']),
    rotation90SinglePage: createContentCase(['(Rotation: 90 degree image marker list)', '(Rotated page image marker item 0)', '(Rotated page image marker item 1)'], [['1.00', '.00', '.00', '1.00', '60.00', '-80.00'], ['1.00', '.00', '.00', '1.00', '60.00', '-100.00']]),
    rotation90180270FirstPage: createContentCase(['(Rotation: 90 degree image marker list)', '(Rotation 90 image marker item 0)'], [['1.00', '.00', '.00', '1.00', '60.00', '-82.00']])
};
function getContentStreamResult(document: PdfDocument, pageIndex: number): { document: PdfDocument, result: ContentStreamOperation[] } {
    const update: Uint8Array = document.save();
    const parsedDocument: PdfDocument = new PdfDocument(update);
    const contentPage: PdfPage = parsedDocument.getPage(pageIndex);
    const appearance: unknown[] = contentPage._pageDictionary.getArray('Contents') as unknown[];
    expect(appearance).not.toBeUndefined();
    const stream: _PdfContentStream = appearance[2] as _PdfContentStream;
    const parser: _ContentParser = new _ContentParser(stream.getBytes());
    const result: ContentStreamOperation[] = parser._readContent() as ContentStreamOperation[];
    return { document: parsedDocument, result: result };
}
function expectCommonContentPrefix(result: ContentStreamOperation[], pageHeight: string, clipOperands: string[], translateOperands: string[]): void {
    expect(result[0]._operands).toEqual([]);
    expect(result[1]._operator).toEqual('cm');
    expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', pageHeight]);
    expect(result[2]._operator).toEqual('re');
    expect(result[2]._operands).toEqual(clipOperands);
    expect(result[3]._operator).toEqual('h');
    expect(result[3]._operands).toEqual([]);
    expect(result[4]._operator).toEqual('W');
    expect(result[4]._operands).toEqual([]);
    expect(result[5]._operator).toEqual('n');
    expect(result[5]._operands).toEqual([]);
    expect(result[6]._operator).toEqual('cm');
    expect(result[6]._operands).toEqual(translateOperands);
}
function expectTextSequence(result: ContentStreamOperation[], expectedTexts: string[]): void {
    let textIndex: number = 0;
    for (let i: number = 0; i < result.length; i++) {
        if (result[i]._operator === "'") {
            expect(result[i]._operands).toEqual([expectedTexts[textIndex]]);
            textIndex++;
        }
    }
    expect(textIndex).toBe(expectedTexts.length);
}
function expectImageMarkerTransforms(result: ContentStreamOperation[], expectedTransforms: string[][]): void {
    let imageIndex: number = 0;
    for (let i: number = 0; i < result.length; i++) {
        if (result[i]._operator === 'Do') {
            expect(result[i - 1]._operator).toEqual('cm');
            expect(result[i - 1]._operands).toEqual(expectedTransforms[imageIndex]);
            expect(result[i + 1]._operator).toEqual('Q');
            expect(result[i + 1]._operands).toEqual([]);
            imageIndex++;
        }
    }
    expect(imageIndex).toBe(expectedTransforms.length);
}
function expectImageMarkerContentStream(document: PdfDocument, contentCase: ImageMarkerContentCase): PdfDocument {
    const contentResult: { document: PdfDocument, result: ContentStreamOperation[] } = getContentStreamResult(document, contentCase.pageIndex);
    expectCommonContentPrefix(contentResult.result, contentCase.pageHeight, contentCase.clipOperands, contentCase.translateOperands);
    expectTextSequence(contentResult.result, contentCase.texts);
    expectImageMarkerTransforms(contentResult.result, contentCase.imageTransforms);
    return contentResult.document;
}
function expectContentStreamAvailable(document: PdfDocument, pageIndex: number): PdfDocument {
    const contentResult: { document: PdfDocument, result: ContentStreamOperation[] } = getContentStreamResult(document, pageIndex);
    expect(contentResult.result.length).toBeGreaterThan(0);
    expect(contentResult.result[0]._operands).toEqual([]);
    return contentResult.document;
}
function expectUnorderedListStyle(list: PdfUnorderedList, expectedStyle: PdfUnorderedListStyle): void {
    const actualStyle: PdfUnorderedListStyle = list.style;
    expect(actualStyle).toBe(expectedStyle);
}
describe('PdfUnorderedList image marker support', () => {
    let document: PdfDocument;
    let page: PdfPage;
    function createDocument(): void {
        document = new PdfDocument();
        page = document.addPage();
    }
    function destroyDocument(): void {
        if (document) {
            document.destroy();
        }
    }
    function createImage(): PdfBitmap {
        return new PdfBitmap(imageData);
    }
    function setImageSizeMetadata(image: PdfBitmap, width: number, height: number): void {
        Object.defineProperty(image, '_size', {
            value: { width: width, height: height },
            configurable: true
        });
    }
    function createItems(count: number, prefix: string): PdfListItemCollection {
        const items: PdfListItemCollection = new PdfListItemCollection();
        for (let i: number = 0; i < count; i++) {
            items.add(new PdfListItem(prefix + ' ' + i));
        }
        return items;
    }
    function createLongText(): string {
        return 'This is a long unordered list item text that should wrap across multiple lines when the list is drawn inside a narrow rectangle. ' +
            'The image marker should be rendered once for the item, and the wrapped text should align from the text start position.';
    }
    function getTitleFont(): PdfStandardFont {
        return new PdfStandardFont(PdfFontFamily.helvetica, 14);
    }
    function getListFont(): PdfStandardFont {
        return new PdfStandardFont(PdfFontFamily.helvetica, 16);
    }
    function drawTitle(text: string, y: number): void {
        page.graphics.drawString(text, getTitleFont(), { x: 0, y: y, width: 500, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
    }
    function drawNote(text: string, y: number): void {
        const font: PdfStandardFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        page.graphics.drawString(text, font, { x: 0, y: y, width: 500, height: 50 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
    }
    function createImageList(image: PdfBitmap, items: PdfListItemCollection): PdfUnorderedList {
        const list: PdfUnorderedList = new PdfUnorderedList(items);
        list.setMarker({ image: image });
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        return list;
    }
    function getFirstDrawImageBounds(drawImageSpy: jasmine.Spy): Rectangle {
        const drawImageArguments: unknown[] = drawImageSpy.calls.argsFor(0) as unknown[];
        return drawImageArguments[1] as Rectangle;
    }
    beforeEach(() => {
        createDocument();
    });
    afterEach(() => {
        destroyDocument();
    });
    it('AC-01: should render image marker when image marker is assigned', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        list.items.add(new PdfListItem('Image marker assigned without explicit style'));
        list.items.add(new PdfListItem('Image marker should get priority over unordered'));
        list.setMarker({ image: image });
        drawTitle('AC-01: Image marker assignment renders image marker', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 150 });
        expectUnorderedListStyle(list, PdfUnorderedListStyle.disk);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac01);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
    });
    it('AC-01 and AC-17: should render image marker when image marker is assigned through constructor settings', () => {
        const image: PdfBitmap = createImage();
        const items: PdfListItemCollection = createItems(2, 'Constructor image item');
        const list: PdfUnorderedList = new PdfUnorderedList(items, {
            marker: {
                image: image
            },
            font: getListFont(),
            indent: 20,
            textIndent: 10
        });
        drawTitle('AC-01 and AC-17: Constructor image marker with item collection', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 150 });
        expectUnorderedListStyle(list, PdfUnorderedListStyle.disk);
        expect(list.items.count).toBe(2);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac01Ac17);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-02 and AC-19: should render image marker when style is set first and image is assigned last', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'Image overrides style item'));
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        list.style = PdfUnorderedListStyle.square;
        list.setMarker({ image: image });
        drawTitle('AC-02 and AC-19: Image assigned last overrides style', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 150 });
        expectUnorderedListStyle(list, PdfUnorderedListStyle.square);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawImageSpy.calls.count()).toBe(2);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac02Ac19);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-19: should keep image marker priority when style is assigned after image marker', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'Disk marker item'));
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        list.setMarker({ image: image });
        list.style = PdfUnorderedListStyle.disk;
        drawTitle('AC-19: Style assigned after image keeps image marker priority', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 150 });
        expectUnorderedListStyle(list, PdfUnorderedListStyle.disk);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawImageSpy.calls.count()).toBe(2);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac19StyleAfterImage);
    });
    it('AC-03: should apply image marker to every item in the unordered list', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, createItems(4, 'List-level image marker item'));
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        drawTitle('AC-03: Same image marker applies to all list items', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 180 });
        expect(drawImageSpy.calls.count()).toBe(4);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac03);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-04: should support independent image marker for sublist without affecting parent list marker', () => {
        const image: PdfBitmap = createImage();
        const parentList: PdfUnorderedList = new PdfUnorderedList();
        const parentItem: PdfListItem = new PdfListItem('Parent item with default marker');
        const subList: PdfUnorderedList = new PdfUnorderedList();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        parentList.font = getListFont();
        parentList.indent = 20;
        parentList.textIndent = 10;
        subList.setMarker({ image: image });
        subList.font = getListFont();
        subList.indent = 25;
        subList.textIndent = 10;
        parentList.items.add(parentItem);
        subList.items.add(new PdfListItem('Sub item with image marker'));
        parentItem.subList = subList;
        drawTitle('AC-04: Sublist image marker does not affect parent marker', 10);
        parentList.draw(page, { x: 0, y: 40, width: 450, height: 180 });
        expectUnorderedListStyle(parentList, PdfUnorderedListStyle.disk);
        expectUnorderedListStyle(subList, PdfUnorderedListStyle.disk);
        expect(drawImageSpy.calls.count()).toBe(1);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac04);
        document.destroy();
    });
    it('AC-05: should render image markers independently in nested unordered lists', () => {
        const image: PdfBitmap = createImage();
        const level1: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const level2: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const level3: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const level1Item: PdfListItem = new PdfListItem('Level 1 image marker');
        const level2Item: PdfListItem = new PdfListItem('Level 2 image marker');
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        level2.indent = 25;
        level3.indent = 30;
        level1.items.add(level1Item);
        level2.items.add(level2Item);
        level3.items.add(new PdfListItem('Level 3 image marker'));
        level1Item.subList = level2;
        level2Item.subList = level3;
        drawTitle('AC-05: Nested list image marker support', 10);
        level1.draw(page, { x: 0, y: 40, width: 450, height: 220 });
        expect(drawImageSpy.calls.count()).toBe(3);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac05);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-06: should render image markers across paginated list items', () => {
        const image: PdfBitmap = createImage();
        const items: PdfListItemCollection = new PdfListItemCollection();
        const list: PdfUnorderedList = new PdfUnorderedList(items);
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        for (let i: number = 0; i < 80; i++) {
            items.add(new PdfListItem('Paginated image marker item ' + i + ' ' + createLongText()));
        }
        format.layout = PdfLayoutType.paginate;
        list.setMarker({ image: image });
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        drawTitle('AC-06: Image markers across paginated list', 10);
        list.draw(page, { x: 0, y: 40, width: 250, height: 120 }, format);
        expect(drawImageSpy.calls.count()).toBeGreaterThan(1);
        expect(document.pageCount).toBeGreaterThan(1);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac06);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-07: should render image marker once for a wrapped single item', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list.items.add(new PdfListItem(createLongText()));
        drawTitle('AC-07: Wrapped text with one image marker', 10);
        list.draw(page, { x: 0, y: 40, width: 180, height: 250 });
        expect(drawImageSpy.calls.count()).toBe(1);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac07);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-08: should respect indent and textIndent while rendering image marker', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        const markerXValues: number[] = [];
        const originalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = list._draw.bind(list);
        list.setMarker({ image: image });
        list.font = getListFont();
        list.indent = 40;
        list.textIndent = 20;
        list.items.add(new PdfListItem('Indented image marker item'));
        list.items.add(new PdfListItem('Second indented image marker item'));
        spyOn(list, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            markerXValues.push(x);
            originalDraw(graphics, x, y, brush, pen);
        });
        drawTitle('AC-08: Image marker respects indent and textIndent', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 160 });
        expect(markerXValues.length).toBe(2);
        expect(markerXValues[0]).toBeGreaterThanOrEqual(0);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac08);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-09: should adjust image marker position for right marker alignment', () => {
        const image: PdfBitmap = createImage();
        const leftList: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const rightList: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const leftMarkerXValues: number[] = [];
        const rightMarkerXValues: number[] = [];
        const leftOriginalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = leftList._draw.bind(leftList);
        const rightOriginalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = rightList._draw.bind(rightList);
        leftList.alignment = PdfListMarkerAlignment.left;
        rightList.alignment = PdfListMarkerAlignment.right;
        leftList.items.add(new PdfListItem('Left aligned image marker item'));
        rightList.items.add(new PdfListItem('Right aligned image marker item'));
        spyOn(leftList, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            leftMarkerXValues.push(x);
            leftOriginalDraw(graphics, x, y, brush, pen);
        });
        spyOn(rightList, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            rightMarkerXValues.push(x);
            rightOriginalDraw(graphics, x, y, brush, pen);
        });
        drawTitle('AC-09: Left and right image marker alignment', 10);
        leftList.draw(page, { x: 0, y: 40, width: 400, height: 80 });
        rightList.draw(page, { x: 0, y: 120, width: 400, height: 80 });
        expect(leftMarkerXValues.length).toBe(1);
        expect(rightMarkerXValues.length).toBe(1);
        expect(rightMarkerXValues[0]).not.toBe(leftMarkerXValues[0]);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac09);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-11: should use template rendering pipeline for image marker', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const drawTemplateSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawTemplate').and.callThrough();
        list.items.add(new PdfListItem('Template pipeline image marker item'));
        drawTitle('AC-11: Image marker uses template rendering pipeline', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 120 });
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawTemplateSpy).toHaveBeenCalled();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac11);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-12, AC-14, AC-23 and AC-24: should draw image inside marker bounds with one-pixel padding', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list.items.add(new PdfListItem('Scaled image marker item with one pixel padding'));
        drawTitle('AC-12, AC-14, AC-23, AC-24: Image scaling and padding', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 120 });
        expect(drawImageSpy.calls.count()).toBe(1);
        const bounds: Rectangle = getFirstDrawImageBounds(drawImageSpy);
        expect(bounds.x).toBe(1);
        expect(bounds.y).toBe(1);
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.height).toBeGreaterThan(0);
        expect(bounds.width).toBeLessThanOrEqual(16);
        expect(bounds.height).toBeLessThanOrEqual(16);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac12Ac14Ac23Ac24);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-13 and AC-22: should not expose public image width or height properties', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const listAsRecord: Record<string, unknown> = list as unknown as Record<string, unknown>;
        list.items.add(new PdfListItem('Image marker size is controlled internally'));
        list.items.add(new PdfListItem('No public imageWidth, imageHeight, imageSize API'));
        drawTitle('AC-13 and AC-22: No public image width or height API', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 150 });
        expect(listAsRecord.imageWidth).toBeUndefined();
        expect(listAsRecord.imageHeight).toBeUndefined();
        expect(listAsRecord.imageSize).toBeUndefined();
        expect(listAsRecord.markerImageSize).toBeUndefined();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac13Ac22);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
    });
    it('AC-16: should reuse same image instance across multiple unordered lists without conflict', () => {
        const image: PdfBitmap = createImage();
        const list1: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const list2: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list1.items.add(new PdfListItem('List 1 uses shared image instance'));
        list2.items.add(new PdfListItem('List 2 uses same shared image instance'));
        drawTitle('AC-16: Same image instance reused across lists', 10);
        list1.draw(page, { x: 0, y: 40, width: 450, height: 80 });
        list2.draw(page, { x: 0, y: 120, width: 450, height: 80 });
        expect(drawImageSpy.calls.count()).toBe(2);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac16);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-17: should work with PdfListItemCollection initialization', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection(['Excel', 'Word', 'PDF']));
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        drawTitle('AC-17: Image marker with PdfListItemCollection initialization', 10);
        list.draw(page, { x: 0, y: 40, width: 400, height: 150 });
        expect(drawImageSpy.calls.count()).toBe(3);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac17);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-18: should keep image marker rendering stable with paginate layout bounds', () => {
        const image: PdfBitmap = createImage();
        const items: PdfListItemCollection = new PdfListItemCollection();
        const list: PdfUnorderedList = createImageList(image, items);
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        for (let i: number = 0; i < 20; i++) {
            items.add(new PdfListItem('Layout bounds image marker item ' + i + ' ' + createLongText()));
        }
        format.layout = PdfLayoutType.paginate;
        drawTitle('AC-18: Image marker stable with paginate layout bounds', 10);
        list.draw(page, { x: 20, y: 40, width: 180, height: 160 }, format);
        expect(drawImageSpy.calls.count()).toBeGreaterThan(1);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac18);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-20: should not expose image marker API on ordered list', () => {
        const orderedList: PdfOrderedList = new PdfOrderedList();
        const orderedListAsRecord: Record<string, unknown> = orderedList as unknown as Record<string, unknown>;
        orderedList.font = getListFont();
        orderedList.indent = 20;
        orderedList.textIndent = 10;
        orderedList.items.add(new PdfListItem('Ordered list item 1'));
        orderedList.items.add(new PdfListItem('Ordered list item 2'));
        drawTitle('AC-20: Ordered list does not expose image marker API', 10);
        orderedList.draw(page, { x: 0, y: 40, width: 400, height: 120 });
        drawNote('The ordered list is rendered with normal ordered markers. No image property is available.', 170);
        expect(orderedListAsRecord.image).toBeUndefined();
        expect(orderedListAsRecord.setImageMarker).toBeUndefined();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac20);
        document.destroy();
    });
    it('AC-21: should not expose image marker API on individual list item', () => {
        const image: PdfBitmap = createImage();
        const item: PdfListItem = new PdfListItem('List item does not expose per-item image marker API');
        const itemAsRecord: Record<string, unknown> = item as unknown as Record<string, unknown>;
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        list.items.add(item);
        drawTitle('AC-21: No per-item image marker API', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 100 });
        drawNote('The image marker is configured at list level. The PdfListItem has no image, markerImage, or marker property.', 150);
        expect(itemAsRecord.image).toBeUndefined();
        expect(itemAsRecord.markerImage).toBeUndefined();
        expect(itemAsRecord.marker).toBeUndefined();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac21);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('AC-25: should render image marker and text for the same item', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = createImageList(image, new PdfListItemCollection());
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const drawTextSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, '_drawStringLayoutResult').and.callThrough();
        list.items.add(new PdfListItem('Rendering order item: image marker and text are both rendered'));
        drawTitle('AC-25: Image marker and text are rendered for same item', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 120 });
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawTextSpy).toHaveBeenCalled();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.ac25);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Sized Image Marker: should use explicit size from setImageMarker method', () => {
        const image: PdfBitmap = createImage();
        const list: PdfUnorderedList = new PdfUnorderedList();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        list.setMarker({ image, size: { width: 24, height: 20 } });
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        list.items.add(new PdfListItem('Explicit sized image marker through method'));
        drawTitle('Sized Marker: setImageMarker uses explicit size', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 120 });
        const bounds: Rectangle = getFirstDrawImageBounds(drawImageSpy);
        expectUnorderedListStyle(list, PdfUnorderedListStyle.disk);
        expect(bounds.x).toBe(1);
        expect(bounds.y).toBe(1);
        expect(bounds.width).toBe(22);
        expect(bounds.height).toBe(18);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.sizedExplicitMethod);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Sized Image Marker: should use explicit size from constructor imageMarker settings', () => {
        const image: PdfBitmap = createImage();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const list: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Constructor explicit imageMarker size item'), {
            marker: { image: image, size: { width: 30, height: 18 } },
            font: getListFont(),
            indent: 20,
            textIndent: 10
        });
        drawTitle('Sized Marker: constructor imageMarker explicit size', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 120 });
        const bounds: Rectangle = getFirstDrawImageBounds(drawImageSpy);
        expectUnorderedListStyle(list, PdfUnorderedListStyle.disk);
        expect(bounds.x).toBe(1);
        expect(bounds.y).toBe(1);
        expect(bounds.width).toBe(28);
        expect(bounds.height).toBe(16);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.sizedConstructorExplicit);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Sized Image Marker: should not treat brush, font, or pen as imageMarker-specific settings', () => {
        const image: PdfBitmap = createImage();
        const imageMarkerAsRecord: Record<string, unknown> = {
            image: image,
            size: { width: 20, height: 20 },
            brush: new PdfBrush({ r: 255, g: 0, b: 0 }),
            font: getListFont(),
            pen: new PdfPen({ r: 0, g: 0, b: 255 }, 1)
        };
        const list: PdfUnorderedList = new PdfUnorderedList(new PdfListItemCollection(['Image marker object restriction']), {
            marker: imageMarkerAsRecord as unknown as { image: PdfBitmap, size?: Size },
            font: getListFont(),
            indent: 20,
            textIndent: 10
        });
        const listAsRecord: Record<string, unknown> = list as unknown as Record<string, unknown>;
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        drawTitle('Sized Marker: imageMarker does not accept brush font pen', 10);
        list.draw(page, { x: 0, y: 40, width: 450, height: 120 });
        const bounds: Rectangle = getFirstDrawImageBounds(drawImageSpy);
        expect(bounds.width).toBe(18);
        expect(bounds.height).toBe(18);
        expect(listAsRecord.imageMarker).toBeUndefined();
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.sizedRestrictions);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Page Size: should render image markers correctly on pages with different page sizes', () => {
        destroyDocument();
        document = new PdfDocument();
        const image: PdfBitmap = createImage();
        const markerSize: Size = { width: 20, height: 20 };
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const smallPageSettings: PdfPageSettings = new PdfPageSettings();
        smallPageSettings.size = { width: 300, height: 300 };
        smallPageSettings.margins = new PdfMargins(20);
        const smallPage: PdfPage = document.addPage(smallPageSettings);
        const a4PageSettings: PdfPageSettings = new PdfPageSettings();
        a4PageSettings.size = { width: 595, height: 842 };
        a4PageSettings.margins = new PdfMargins(40);
        const a4Page: PdfPage = document.addPage(a4PageSettings);
        const landscapePageSettings: PdfPageSettings = new PdfPageSettings();
        landscapePageSettings.size = { width: 842, height: 595 };
        landscapePageSettings.margins = new PdfMargins(40);
        const landscapePage: PdfPage = document.addPage(landscapePageSettings);
        const smallList: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'Small page image marker item'));
        const a4List: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'A4 page image marker item'));
        const landscapeList: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'Landscape page image marker item'));
        smallList.setMarker({ image: image, size: markerSize });
        a4List.setMarker({ image: image, size: markerSize });
        landscapeList.setMarker({ image: image, size: markerSize });
        smallList.font = getListFont();
        a4List.font = getListFont();
        landscapeList.font = getListFont();
        smallList.indent = 20;
        a4List.indent = 20;
        landscapeList.indent = 20;
        smallList.textIndent = 10;
        a4List.textIndent = 10;
        landscapeList.textIndent = 10;
        smallPage.graphics.drawString('Page Size: Small page image marker', getTitleFont(), { x: 0, y: 10, width: 250, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        smallList.draw(smallPage, { x: 20, y: 45, width: 220, height: 120 });
        a4Page.graphics.drawString('Page Size: A4 page image marker', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        a4List.draw(a4Page, { x: 60, y: 80, width: 360, height: 150 });
        landscapePage.graphics.drawString('Page Size: Landscape page image marker', getTitleFont(), { x: 0, y: 10, width: 500, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        landscapeList.draw(landscapePage, { x: 100, y: 120, width: 500, height: 150 });
        expect(document.pageCount).toBe(3);
        expect(drawImageSpy.calls.count()).toBe(6);
        for (let i: number = 0; i < drawImageSpy.calls.count(); i++) {
            const bounds: Rectangle = drawImageSpy.calls.argsFor(i)[1] as Rectangle;
            expect(bounds.x).toBe(1);
            expect(bounds.y).toBe(1);
            expect(bounds.width).toBe(18);
            expect(bounds.height).toBe(18);
        }
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.pageSizeSmallPage);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(14, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Margin: should render image markers correctly with zero, normal, and custom page margins', () => {
        destroyDocument();
        document = new PdfDocument();
        const image: PdfBitmap = createImage();
        const markerSize: Size = { width: 20, height: 20 };
        const markerXValues: number[] = [];
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const zeroMarginSettings: PdfPageSettings = new PdfPageSettings();
        zeroMarginSettings.size = { width: 595, height: 842 };
        zeroMarginSettings.margins = new PdfMargins(0);
        const zeroMarginPage: PdfPage = document.addPage(zeroMarginSettings);
        const normalMarginSettings: PdfPageSettings = new PdfPageSettings();
        normalMarginSettings.size = { width: 595, height: 842 };
        normalMarginSettings.margins = new PdfMargins(40);
        const normalMarginPage: PdfPage = document.addPage(normalMarginSettings);
        const customMarginSettings: PdfPageSettings = new PdfPageSettings();
        customMarginSettings.size = { width: 595, height: 842 };
        customMarginSettings.margins = new PdfMargins();
        customMarginSettings.margins.left = 100;
        customMarginSettings.margins.top = 80;
        customMarginSettings.margins.right = 60;
        customMarginSettings.margins.bottom = 50;
        const customMarginPage: PdfPage = document.addPage(customMarginSettings);
        const zeroMarginList: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Zero margin image marker item'));
        const normalMarginList: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Normal margin image marker item'));
        const customMarginList: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Custom margin image marker item'));
        zeroMarginList.setMarker({image: image, size: markerSize});
        normalMarginList.setMarker({image: image, size: markerSize});
        customMarginList.setMarker({image: image, size: markerSize});
        zeroMarginList.font = getListFont();
        normalMarginList.font = getListFont();
        customMarginList.font = getListFont();
        zeroMarginList.indent = 20;
        normalMarginList.indent = 20;
        customMarginList.indent = 20;
        zeroMarginList.textIndent = 10;
        normalMarginList.textIndent = 10;
        customMarginList.textIndent = 10;
        const zeroOriginalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = zeroMarginList._draw.bind(zeroMarginList);
        const normalOriginalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = normalMarginList._draw.bind(normalMarginList);
        const customOriginalDraw: (graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen) => void = customMarginList._draw.bind(customMarginList);
        spyOn(zeroMarginList, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            markerXValues.push(x);
            zeroOriginalDraw(graphics, x, y, brush, pen);
        });
        spyOn(normalMarginList, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            markerXValues.push(x);
            normalOriginalDraw(graphics, x, y, brush, pen);
        });
        spyOn(customMarginList, '_draw').and.callFake((graphics: PdfGraphics, x: number, y: number, brush: PdfBrush, pen: PdfPen): void => {
            markerXValues.push(x);
            customOriginalDraw(graphics, x, y, brush, pen);
        });
        zeroMarginPage.graphics.drawString('Margin: Zero margin image marker', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        zeroMarginList.draw(zeroMarginPage, { x: 10, y: 40, width: 300, height: 100 });
        normalMarginPage.graphics.drawString('Margin: Normal margin image marker', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        normalMarginList.draw(normalMarginPage, { x: 20, y: 40, width: 300, height: 100 });
        customMarginPage.graphics.drawString('Margin: Custom margin image marker', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        customMarginList.draw(customMarginPage, { x: 30, y: 60, width: 300, height: 100 });
        expect(document.pageCount).toBe(3);
        expect(drawImageSpy.calls.count()).toBe(3);
        expect(markerXValues.length).toBe(3);
        expect(markerXValues[0]).toBeGreaterThanOrEqual(0);
        expect(markerXValues[1]).toBeGreaterThan(markerXValues[0]);
        expect(markerXValues[2]).toBeGreaterThan(markerXValues[1]);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.marginZeroPage);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(14, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Rotation: should render image markers correctly on a page rotated by 90 degrees', () => {
        destroyDocument();
        document = new PdfDocument();
        const image: PdfBitmap = createImage();
        const pageSettings: PdfPageSettings = new PdfPageSettings();
        pageSettings.size = { width: 595, height: 842 };
        pageSettings.margins = new PdfMargins(40);
        pageSettings.rotation = PdfRotationAngle.angle90;
        const rotatedPage: PdfPage = document.addPage(pageSettings);
        const list: PdfUnorderedList = new PdfUnorderedList(createItems(2, 'Rotated page image marker item'));
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const drawTemplateSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawTemplate').and.callThrough();
        list.setMarker({image,size: { width: 20, height: 20 }});
        list.font = getListFont();
        list.indent = 20;
        list.textIndent = 10;
        rotatedPage.graphics.drawString('Rotation: 90 degree image marker list', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        list.draw(rotatedPage, { x: 40, y: 60, width: 350, height: 160 });
        expect(document.pageCount).toBe(1);
        expect(drawImageSpy.calls.count()).toBe(2);
        expect(drawTemplateSpy).toHaveBeenCalled();
        const firstBounds: Rectangle = drawImageSpy.calls.argsFor(0)[1] as Rectangle;
        expect(firstBounds.x).toBe(1);
        expect(firstBounds.y).toBe(1);
        expect(firstBounds.width).toBe(18);
        expect(firstBounds.height).toBe(18);
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.rotation90SinglePage);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Rotation: should render image markers correctly on pages with 90, 180, and 270 degree rotation', () => {
        destroyDocument();
        document = new PdfDocument();
        const image: PdfBitmap = createImage();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const drawTemplateSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawTemplate').and.callThrough();
        const page90Settings: PdfPageSettings = new PdfPageSettings();
        page90Settings.size = { width: 595, height: 842 };
        page90Settings.margins = new PdfMargins(40);
        page90Settings.rotation = PdfRotationAngle.angle90;
        const page90: PdfPage = document.addPage(page90Settings);
        const page180Settings: PdfPageSettings = new PdfPageSettings();
        page180Settings.size = { width: 595, height: 842 };
        page180Settings.margins = new PdfMargins(40);
        page180Settings.rotation = PdfRotationAngle.angle180;
        const page180: PdfPage = document.addPage(page180Settings);
        const page270Settings: PdfPageSettings = new PdfPageSettings();
        page270Settings.size = { width: 595, height: 842 };
        page270Settings.margins = new PdfMargins(40);
        page270Settings.rotation = PdfRotationAngle.angle270;
        const page270: PdfPage = document.addPage(page270Settings);
        const list90: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Rotation 90 image marker item'));
        const list180: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Rotation 180 image marker item'));
        const list270: PdfUnorderedList = new PdfUnorderedList(createItems(1, 'Rotation 270 image marker item'));
        list90.setMarker({image, size: { width: 22, height: 22 }});
        list180.setMarker({image, size: { width: 22, height: 22 }});
        list270.setMarker({image, size: { width: 22, height: 22 }});
        list90.font = getListFont();
        list180.font = getListFont();
        list270.font = getListFont();
        list90.indent = 20;
        list180.indent = 20;
        list270.indent = 20;
        list90.textIndent = 10;
        list180.textIndent = 10;
        list270.textIndent = 10;
        page90.graphics.drawString('Rotation: 90 degree image marker list', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        list90.draw(page90, { x: 40, y: 60, width: 350, height: 120 });
        page180.graphics.drawString('Rotation: 180 degree image marker list', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        list180.draw(page180, { x: 70, y: 100, width: 350, height: 120 });
        page270.graphics.drawString('Rotation: 270 degree image marker list', getTitleFont(), { x: 0, y: 10, width: 450, height: 25 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        list270.draw(page270, { x: 100, y: 140, width: 350, height: 120 });
        expect(document.pageCount).toBe(3);
        expect(drawImageSpy.calls.count()).toBe(3);
        expect(drawTemplateSpy).toHaveBeenCalled();
        for (let i: number = 0; i < drawImageSpy.calls.count(); i++) {
            const bounds: Rectangle = drawImageSpy.calls.argsFor(i)[1] as Rectangle;
            expect(bounds.x).toBe(1);
            expect(bounds.y).toBe(1);
            expect(bounds.width).toBe(20);
            expect(bounds.height).toBe(20);
        }
        document = expectImageMarkerContentStream(document, imageMarkerContentCases.rotation90180270FirstPage);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(14, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
    it('Combined Layout: should render image markers with custom page size, margins, rotation, and pagination in 3 pages', () => {
        destroyDocument();
        document = new PdfDocument();
        const image: PdfBitmap = createImage();
        const pageSettings: PdfPageSettings = new PdfPageSettings();
        pageSettings.size = { width: 300, height: 300 };
        pageSettings.margins = new PdfMargins(20);
        pageSettings.rotation = PdfRotationAngle.angle90;
        const rotatedSmallPage: PdfPage = document.addPage(pageSettings);
        const items: PdfListItemCollection = new PdfListItemCollection();
        const list: PdfUnorderedList = new PdfUnorderedList(items);
        const format: PdfLayoutFormat = new PdfLayoutFormat();
        const drawImageSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawImage').and.callThrough();
        const drawTemplateSpy: jasmine.Spy = spyOn(PdfGraphics.prototype, 'drawTemplate').and.callThrough();
        for (let i: number = 0; i < 18; i++) {
            items.add(new PdfListItem('Combined layout image marker item ' + i));
        }
        format.layout = PdfLayoutType.paginate;
        list.setMarker({image,size: { width: 18, height: 18 }});
        list.font = new PdfStandardFont(PdfFontFamily.helvetica, 12);
        list.indent = 20;
        list.textIndent = 10;
        rotatedSmallPage.graphics.drawString('Combined: page size margin rotation pagination', getTitleFont(), { x: 0, y: 10, width: 240, height: 40 }, new PdfBrush({ r: 0, g: 0, b: 0 }));
        list.draw(rotatedSmallPage, { x: 20, y: 55, width: 180, height: 120 }, format);
        expect(drawImageSpy.calls.count()).toBe(18);
        expect(drawTemplateSpy).toHaveBeenCalled();
        const firstBounds: Rectangle = drawImageSpy.calls.argsFor(0)[1] as Rectangle;
        expect(firstBounds.x).toBe(1);
        expect(firstBounds.y).toBe(1);
        expect(firstBounds.width).toBe(16);
        expect(firstBounds.height).toBe(16);
        document = expectContentStreamAvailable(document, 0);
        const doc2 = new PdfDocument(document.save());
        const page1 = doc2.getPage(0);
        const ref = new _PdfReference(10, 0);
        const stream = page1._crossReference._fetch(ref);
        const dictionary = stream.dictionary;
        expect((dictionary.get('Subtype') as _PdfName).name).toEqual('Image');
        expect((dictionary.get('Type') as _PdfName).name).toEqual('XObject');
        expect(dictionary.get('Length') as Number).toEqual(56);
        document.destroy();
    });
});
type ImageSizeInfo = PdfBitmap & {
    width?: number;
    height?: number;
    _width?: number;
    _height?: number;
    size?: Size;
    _size?: Size | number[];
};
describe('PdfUnorderedList custom image marker uncovered coverage', () => {
    let document: PdfDocument;
    let page: PdfPage;
    beforeEach((): void => {
        document = new PdfDocument();
        page = document.addPage();
    });
    afterEach((): void => {
        document.destroy();
    });
    it('should clamp custom image marker draw width to zero when marker width is smaller than padding', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const image: PdfBitmap = {} as unknown as PdfBitmap;
        let capturedBounds: Rectangle;
        list._style = PdfUnorderedListStyle.disk;
        list._marker = {image:image};
        list._size = [1, 5];
        spyOn(PdfGraphics.prototype, 'drawImage').and.callFake((_image: PdfImage, bounds: Rectangle): void => {
            capturedBounds = bounds;
        });
        spyOn(page.graphics, 'drawTemplate').and.stub();
        // Act
        list._draw(page.graphics, 10, 10, brush, pen);
        // Assert
        expect(capturedBounds.width).toBe(0);
        expect(capturedBounds.height).toBe(3);
    });
    it('should clamp custom image marker draw height to zero when marker height is smaller than padding', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const image: PdfBitmap = {} as unknown as PdfBitmap;
        let capturedBounds: Rectangle;
        list._style = PdfUnorderedListStyle.disk;
        list._marker = {image:image};
        list._size = [5, 1];
        spyOn(PdfGraphics.prototype, 'drawImage').and.callFake((_image: PdfImage, bounds: Rectangle): void => {
            capturedBounds = bounds;
        });
        spyOn(page.graphics, 'drawTemplate').and.stub();
        // Act
        list._draw(page.graphics, 10, 10, brush, pen);
        // Assert
        expect(capturedBounds.width).toBe(3);
        expect(capturedBounds.height).toBe(0);
    });
    it('should draw custom image marker with valid image bounds', () => {
        // Arrange
        const list: PdfUnorderedList = new PdfUnorderedList();
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 1);
        const image: PdfBitmap = {} as unknown as PdfBitmap;
        let capturedBounds: Rectangle;
        list._style = PdfUnorderedListStyle.disk;
        list._marker = {image:image};
        list._size = [8, 9];
        spyOn(PdfGraphics.prototype, 'drawImage').and.callFake((_image: PdfImage, bounds: Rectangle): void => {
            capturedBounds = bounds;
        });
        spyOn(page.graphics, 'drawTemplate').and.stub();
        // Act
        list._draw(page.graphics, 10, 10, brush, pen);
        // Assert
        expect(capturedBounds.x).toBe(1);
        expect(capturedBounds.y).toBe(1);
        expect(capturedBounds.width).toBe(6);
        expect(capturedBounds.height).toBe(7);
    });
});
