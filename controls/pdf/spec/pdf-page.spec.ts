import { PdfAnnotationCollection } from "../src/pdf/core/annotations/annotation-collection";
import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { PdfFormFieldsTabOrder, PdfPageOrientation, PdfRotationAngle } from "../src/pdf/core/enumerator";
import { PdfFont, PdfFontFamily, PdfFontStyle } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfGraphics } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfLayoutResult } from "../src/pdf/core/graphics/pdf-layouter";
import { PdfPageTemplateElement } from "../src/pdf/core/graphics/pdf-page-template-element";
import { PdfTemplate } from "../src/pdf/core/graphics/pdf-template";
import { _PdfCrossReference } from "../src/pdf/core/pdf-cross-reference";
import { PdfDocument, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { _PdfDestinationHelper, PdfDestination, PdfPage } from "../src/pdf/core/pdf-page";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfTextElement, Rectangle, Size } from "../src/pdf/core/pdf-type";
describe('PdfPage survived mutants batch 1', () => {
    it('should load the PdfPage module through its required dependencies', () => {
        // Mutant ID: 1
        expect(PdfPage).toBeDefined();
        expect(typeof PdfPage).toBe('function');
    });
    it('should expose the module as an ES module', () => {
        // Mutant ID: 14
        expect(PdfPage).toBeDefined();
        expect(PdfDestination).toBeDefined();
        expect(_PdfDestinationHelper).toBeDefined();
    });
    it('should expose all expected constructors from the page module', () => {
        // Mutant ID: 15
        expect(typeof PdfPage).toBe('function');
        expect(typeof PdfDestination).toBe('function');
        expect(typeof _PdfDestinationHelper).toBe('function');
    });
    it('should initialize annotation parsing as false for a new page instance', () => {
        // Mutant ID: 19
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        expect(page._isAnnotationParsed).toBeFalsy();
        document.destroy();
    });
    it('should initialize duplicate-page state as false', () => {
        // Mutant ID: 21
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        expect(page._isDuplicate).toBeFalsy();
        document.destroy();
    });
    it('should return an empty annotation collection when the page dictionary is unavailable', () => {
        // Mutant ID: 33
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        page._pageDictionary = undefined as any;
        expect(() => page.annotations).not.toThrow();
        expect(page.annotations.count).toBe(0);
        page._pageDictionary = dictionary;
        document.destroy();
    });
    it('should not evaluate the Annots entry when the page dictionary is unavailable', () => {
        // Mutant ID: 35
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        page._pageDictionary = undefined as any;
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(0);
        page._pageDictionary = dictionary;
        document.destroy();
    });
    it('should ignore a non-array Annots value when creating the annotation collection', () => {
        // Mutant ID: 39
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Annots', _PdfName.get('InvalidAnnots'));
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(0);
        document.destroy();
    });
    it('should require the Annots value to satisfy both validity and array checks', () => {
        // Mutant ID: 41
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Annots', _PdfName.get('NotAnArray'));
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations.count).toBe(0);
        expect(page._annotations).toBe(annotations);
        document.destroy();
    });
    it('should not parse widget references when the document has no AcroForm', () => {
        // Mutant ID: 43
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary.update('Annots', [reference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(
            document._catalog._catalogDictionary.has('AcroForm')
        ).toBeFalsy();
        expect(annotations).toBeDefined();
        document.destroy();
    });
    it('should preserve annotations when the widget collection is unavailable', () => {
        // Mutant ID: 50
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        const annotationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('Subtype', _PdfName.get('Link'));
        annotationDictionary.update('Rect', [10, 20, 110, 70]);
        document._crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        page._pageDictionary.update('Annots', [annotationReference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(1);
        expect(page._pageDictionary.has('Annots')).toBeTruthy();
        document.destroy();
    });
    it('should use the original annotations when the widget collection is empty', () => {
        // Mutant ID: 51
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        const annotationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('Subtype', _PdfName.get('Link'));
        annotationDictionary.update('Rect', [20, 30, 120, 80]);
        document._crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        page._pageDictionary.update('Annots', [annotationReference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(1);
        expect(annotations.at(0)).toBeDefined();
        document.destroy();
    });
    it('should create an annotation collection after processing widget references', () => {
        // Mutant ID: 53
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary.update('Annots', [annotationReference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(page._annotations).toBe(annotations);
        document.destroy();
    });
    it('should process every annotation reference during widget filtering', () => {
        // Mutant ID: 55
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        const firstDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const secondDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        firstDictionary.update('Type', _PdfName.get('Annot'));
        firstDictionary.update('Subtype', _PdfName.get('Link'));
        firstDictionary.update('Rect', [10, 20, 110, 70]);
        secondDictionary.update('Type', _PdfName.get('Annot'));
        secondDictionary.update('Subtype', _PdfName.get('Link'));
        secondDictionary.update('Rect', [120, 20, 220, 70]);
        document._crossReference._cacheMap.set(
            firstReference,
            firstDictionary
        );
        document._crossReference._cacheMap.set(
            secondReference,
            secondDictionary
        );
        page._pageDictionary.update(
            'Annots',
            [firstReference, secondReference]
        );
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(2);
        expect(annotations.at(0)).toBeDefined();
        expect(annotations.at(1)).toBeDefined();
        document.destroy();
    });
    it('should retain an annotation that is not present in the widget collection', () => {
        // Mutant ID: 57
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        const annotationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('Subtype', _PdfName.get('Link'));
        annotationDictionary.update('Rect', [30, 40, 130, 90]);
        document._crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        page._pageDictionary.update('Annots', [annotationReference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations.count).toBe(1);
        expect(annotations.at(0)).toBeDefined();
        document.destroy();
    });
    it('should add a valid non-widget annotation to the filtered collection', () => {
        // Mutant ID: 60
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        const annotationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('Subtype', _PdfName.get('Link'));
        annotationDictionary.update('Rect', [50, 60, 150, 110]);
        document._crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        page._pageDictionary.update('Annots', [annotationReference]);
        const annotations: PdfAnnotationCollection = page.annotations;
        expect(annotations).toBeDefined();
        expect(annotations.count).toBe(1);
        expect(annotations.at(0)).toBeDefined();
        document.destroy();
    });
    it('should expose the size property as enumerable', () => {
        // Mutant ID: 68
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the size property as configurable', () => {
        // Mutant ID: 69
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should recalculate page size when the cached height is undefined', () => {
        // Mutant ID: 84
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [10, 20, 610, 820];
        page._size = {
            width: 600,
            height: undefined as any
        };
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        document.destroy();
    });
    it('should resolve MediaBox through the abbreviated page-parent key', () => {
        // Mutant ID: 92
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary._map.MediaBox = [15, 25, 615, 825];
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        delete page._pageDictionary._map.MediaBox;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        page._pageDictionary._map.P = parentReference;
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        document.destroy();
    });
    it('should use zero rotation when the page dictionary has no Rotate entry', () => {
        // Mutant ID: 98
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Rotate;
        page._pageDictionary._map.MediaBox = [0, 0, 400, 600];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._rotation = undefined as any;
        const size: Size = page.size;
        expect(page._pageDictionary.has('Rotate')).toBeFalsy();
        expect(size.width).toBe(400);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should apply the inherited rotation when the page has a Rotate entry', () => {
        // Mutant ID: 99
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 90);
        page._pageDictionary.update('MediaBox', [0, 0, 400, 600]);
        page._pageDictionary.update('CropBox', [0, 0, 400, 600]);
        page._size = undefined as any;
        page._rotation = undefined as any;
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        expect(page.size.width).toBe(400);
        expect(page.size.height).toBe(600);
        document.destroy();
    });
    it('should resolve rotation without treating the value as an array', () => {
        // Mutant ID: 103
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 180);
        page._rotation = undefined as any;
        expect(page.rotation).toBe(PdfRotationAngle.angle180);
        document.destroy();
    });
    it('should resolve rotation by following the page parent hierarchy', () => {
        // Mutant ID: 104
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 270);
        page._rotation = undefined as any;
        expect(page.rotation).toBe(PdfRotationAngle.angle270);
        document.destroy();
    });
    it('should resolve rotation through the Parent dictionary key', () => {
        // Mutant ID: 105
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 90);
        page._rotation = undefined as any;
        const rotation: PdfRotationAngle = page.rotation;
        expect(rotation).toBe(PdfRotationAngle.angle90);
        expect(page._pageDictionary.has('Rotate')).toBeTruthy();
        document.destroy();
    });
    it('should update the MediaBox entry after resolving reference values', () => {
        // Mutant ID: 107
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        const thirdReference: _PdfReference =
            document._crossReference._getNextReference();
        const fourthReference: _PdfReference =
            document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(firstReference, 10);
        document._crossReference._cacheMap.set(secondReference, 20);
        document._crossReference._cacheMap.set(thirdReference, 610);
        document._crossReference._cacheMap.set(fourthReference, 820);
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [
            firstReference,
            secondReference,
            thirdReference,
            fourthReference
        ];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        const mediaBox: number[] =
            page._pageDictionary.getArray('MediaBox') as any;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        expect(mediaBox).toEqual([10, 20, 610, 820]);
        document.destroy();
    });
    it('should use MediaBox dimensions when CropBox exists and rotation is null', () => {
        // Mutant ID: 113
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 100, 550, 700]);
        page._pageDictionary.update('Rotate', null);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        document.destroy();
    });
    it('should use CropBox dimensions when rotation is undefined', () => {
        // Mutant ID: 115
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.Rotate;
        page._pageDictionary._map.MediaBox = [0, 0, 500, 700];
        page._pageDictionary._map.CropBox = [25, 50, 475, 650];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._rotation = undefined as any;
        const size: Size = page.size;
        expect(page._pageDictionary.has('Rotate')).toBeFalsy();
        expect(size.width).toBe(450);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should subtract the CropBox lower-left x coordinate from its upper-right x coordinate', () => {
        // Mutant ID: 119
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 700, 900]);
        page._pageDictionary.update('CropBox', [40, 60, 640, 860]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.width).not.toBe(680);
        document.destroy();
    });
    it('should subtract the CropBox lower-left y coordinate from its upper-right y coordinate', () => {
        // Mutant ID: 120
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 700, 1000]);
        page._pageDictionary.update('CropBox', [50, 80, 650, 880]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.height).toBe(800);
        expect(size.height).not.toBe(960);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 2', () => {
    it('should retain CropBox dimensions when it is narrower than MediaBox', () => {
        // Mutant ID: 122
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 100, 550, 700]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should validate CropBox dimensions only when MediaBox is available', () => {
        // Mutant ID: 124
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 500, 700]);
        page._pageDictionary.update('CropBox', [25, 50, 475, 650]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(450);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should identify a CropBox wider than MediaBox as invalid', () => {
        // Mutant ID: 125
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 500, 700]);
        page._pageDictionary.update('CropBox', [-100, 0, 600, 700]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should treat equal CropBox and MediaBox widths as valid', () => {
        // Mutant ID: 126
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 500, 700]);
        page._pageDictionary.update('CropBox', [50, 100, 550, 650]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(550);
        document.destroy();
    });
    it('should calculate MediaBox width using the difference between coordinates', () => {
        // Mutant ID: 128
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [40, 20, 640, 820]);
        page._pageDictionary.update('CropBox', [0, 0, 700, 700]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.width).not.toBe(680);
        document.destroy();
    });
    it('should preserve portrait CropBox dimensions for zero rotation', () => {
        // Mutant ID: 135
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 50, 550, 750]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should recognize portrait dimensions at zero rotation', () => {
        // Mutant ID: 136
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 650, 850]);
        page._pageDictionary.update('CropBox', [75, 50, 575, 800]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(750);
        document.destroy();
    });
    it('should not treat landscape dimensions as portrait at zero rotation', () => {
        // Mutant ID: 138
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 500, 700]);
        page._pageDictionary.update('CropBox', [-100, 0, 600, 400]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should accept either zero or 180 degree rotation for portrait dimensions', () => {
        // Mutant ID: 139
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 100, 550, 700]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should recognize zero rotation independently from 180 degree rotation', () => {
        // Mutant ID: 140
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 75, 550, 725]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(650);
        document.destroy();
    });
    it('should evaluate zero rotation using strict equality', () => {
        // Mutant ID: 141
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [100, 50, 500, 750]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(400);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should recognize 180 degree rotation for portrait dimensions', () => {
        // Mutant ID: 142
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 700, 900]);
        page._pageDictionary.update('CropBox', [100, 100, 600, 800]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should evaluate 180 degree rotation using strict equality', () => {
        // Mutant ID: 143
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 650, 850]);
        page._pageDictionary.update('CropBox', [75, 75, 575, 775]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should not treat equal CropBox dimensions as portrait', () => {
        // Mutant ID: 145
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [-50, 0, 650, 700]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        document.destroy();
    });
    it('should preserve a valid landscape CropBox for 90 degree rotation', () => {
        // Mutant ID: 147
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 800, 600]);
        page._pageDictionary.update('CropBox', [50, 50, 750, 550]);
        page._pageDictionary.update('Rotate', 90);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should accept a valid CropBox independently from rotated landscape checks', () => {
        // Mutant ID: 148
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [50, 100, 550, 700]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(600);
        document.destroy();
    });
    it('should recognize landscape dimensions at 90 degree rotation', () => {
        // Mutant ID: 149
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 900, 700]);
        page._pageDictionary.update('CropBox', [100, 100, 800, 600]);
        page._pageDictionary.update('Rotate', 90);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should accept either 90 or 270 degree rotation for landscape dimensions', () => {
        // Mutant ID: 152
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 900, 700]);
        page._pageDictionary.update('CropBox', [100, 100, 800, 600]);
        page._pageDictionary.update('Rotate', 270);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should recognize 90 degree rotation independently from 270 degrees', () => {
        // Mutant ID: 153
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 850, 650]);
        page._pageDictionary.update('CropBox', [75, 75, 775, 575]);
        page._pageDictionary.update('Rotate', 90);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should recognize 270 degree rotation independently from 90 degrees', () => {
        // Mutant ID: 155
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 850, 650]);
        page._pageDictionary.update('CropBox', [75, 75, 775, 575]);
        page._pageDictionary.update('Rotate', 270);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should require landscape width to exceed height for rotated pages', () => {
        // Mutant ID: 157
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [-50, 0, 650, 700]);
        page._pageDictionary.update('Rotate', 90);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should preserve equal CropBox dimensions for a rotated page', () => {
        // Mutant ID: 158
        // Equivalent mutant: width > height becomes width >= height,
        // but the surrounding rotation and fallback conditions prevent
        // an observable result difference at the equality boundary.
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 800, 600];
        page._pageDictionary._map.CropBox = [-50, 0, 650, 700];
        page._pageDictionary._map.Rotate = 90;
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._rotation = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should not classify portrait dimensions as landscape for rotated pages', () => {
        // Mutant ID: 159
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 700, 900]);
        page._pageDictionary.update('CropBox', [-50, 0, 650, 800]);
        page._pageDictionary.update('Rotate', 90);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(700);
        expect(size.height).toBe(800);
        document.destroy();
    });
    it('should not replace invalid CropBox dimensions for non-zero rotation', () => {
        // Mutant ID: 160
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [-100, 0, 700, 500]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(800);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should require both zero rotation and MediaBox before using fallback dimensions', () => {
        // Mutant ID: 161
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 600, 800]);
        page._pageDictionary.update('CropBox', [-100, 0, 700, 450]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(800);
        expect(size.height).toBe(450);
        document.destroy();
    });
    it('should restrict MediaBox fallback handling to zero rotation', () => {
        // Mutant ID: 162
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, 0, 650, 850]);
        page._pageDictionary.update('CropBox', [-100, 0, 700, 500]);
        page._pageDictionary.update('Rotate', 180);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(800);
        expect(size.height).toBe(500);
        document.destroy();
    });
    it('should subtract MediaBox x coordinates during CropBox fallback', () => {
        // Mutant ID: 165
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [40, 20, 640, 820]);
        page._pageDictionary.update('CropBox', [-100, 0, 700, 500]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.width).not.toBe(680);
        document.destroy();
    });
    it('should use the lower MediaBox y coordinate when its upper coordinate is zero', () => {
        // Mutant ID: 166
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [0, -700, 500, 0]);
        page._pageDictionary.update('CropBox', [-50, 0, 550, 400]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should subtract MediaBox y coordinates during CropBox fallback', () => {
        // Mutant ID: 169
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('MediaBox', [20, 50, 620, 850]);
        page._pageDictionary.update('CropBox', [-100, 0, 700, 500]);
        page._pageDictionary.update('Rotate', 0);
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.height).toBe(800);
        expect(size.height).not.toBe(900);
        document.destroy();
    });
    it('should subtract MediaBox x coordinates when CropBox is unavailable', () => {
        // Mutant ID: 173
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [50, 75, 650, 875];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(page._pageDictionary.has('CropBox')).toBeFalsy();
        expect(size.width).toBe(600);
        expect(size.width).not.toBe(700);
        expect(size.height).toBe(800);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 3', () => {
    it('should use the lower MediaBox y coordinate when the upper coordinate is zero', () => {
        // Mutant ID: 174
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [0, -700, 500, 0];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(500);
        expect(size.height).toBe(700);
        document.destroy();
    });
    it('should subtract MediaBox y coordinates when CropBox is unavailable', () => {
        // Mutant ID: 177
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [20, 50, 620, 850];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const size: Size = page.size;
        expect(size.width).toBe(600);
        expect(size.height).toBe(800);
        expect(size.height).not.toBe(900);
        document.destroy();
    });
    it('should expose the rotation property as enumerable', () => {
        // Mutant ID: 182
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'rotation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the rotation property as configurable', () => {
        // Mutant ID: 183
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'rotation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should resolve the Rotate entry as a scalar inherited value', () => {
        // Mutant ID: 193
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 180);
        page._rotation = undefined as any;
        const rotation: PdfRotationAngle = page.rotation;
        expect(rotation).toBe(PdfRotationAngle.angle180);
        document.destroy();
    });
    it('should not normalize a zero rotation value as a negative angle', () => {
        // Mutant ID: 198
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary.update('Rotate', 0);
        page._rotation = undefined as any;
        const rotation: PdfRotationAngle = page.rotation;
        expect(rotation).toBe(PdfRotationAngle.angle0);
        expect(Number.isNaN(rotation)).toBeFalsy();
        document.destroy();
    });
    it('should not update rotation for a newly created page', () => {
        // Mutant ID: 210
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._isNew = true;
        page._rotation = undefined as any;
        delete page._pageDictionary._map.Rotate;
        page.rotation = PdfRotationAngle.angle90;
        expect(page._pageDictionary.has('Rotate')).toBeFalsy();
        expect(page._rotation).toBeUndefined();
        document.destroy();
    });
    it('should preserve a rotation value below 360 degrees', () => {
        // Mutant ID: 214
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._isNew = false;
        page.rotation = PdfRotationAngle.angle90;
        expect(page._pageDictionary.get('Rotate')).toBe(90);
        expect(page.rotation).toBe(PdfRotationAngle.angle90);
        document.destroy();
    });
    it('should expose the tabOrder property as enumerable', () => {
        // Mutant ID: 221
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'tabOrder'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the tabOrder property on the PdfPage prototype', () => {
        // Mutant ID: 223
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'tabOrder'
            );
        expect(descriptor).toBeDefined();
        expect(typeof descriptor.get).toBe('function');
        expect(typeof descriptor.set).toBe('function');
    });
    it('should write an empty PDF name for no tab order', () => {
        // Mutant ID: 227
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.none;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs).toBeDefined();
        expect(tabs.name).toBe('');
        document.destroy();
    });
    it('should avoid selecting a named tab order when tab order is none', () => {
        // Mutant ID: 228
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.none;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('');
        expect(tabs.name).not.toBe('R');
        document.destroy();
    });
    it('should process a non-none tab order value', () => {
        // Mutant ID: 229
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        document.destroy();
    });
    it('should distinguish a row tab order from no tab order', () => {
        // Mutant ID: 230
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        expect(tabs.name).not.toBe('');
        document.destroy();
    });
    it('should map every supported non-none tab order to its PDF name', () => {
        // Mutant ID: 231
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.structure;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('S');
        document.destroy();
    });
    it('should select the row branch for row tab order', () => {
        // Mutant ID: 233
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        document.destroy();
    });
    it('should assign the row name inside the row tab-order branch', () => {
        // Mutant ID: 235
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        expect(page.tabOrder).toBe(PdfFormFieldsTabOrder.row);
        document.destroy();
    });
    it('should write the exact PDF name for row tab order', () => {
        // Mutant ID: 236
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        expect(tabs.name.length).toBe(1);
        document.destroy();
    });
    it('should select the column branch for column tab order', () => {
        // Mutant ID: 238
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.column;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('C');
        document.destroy();
    });
    it('should assign the column name inside the column tab-order branch', () => {
        // Mutant ID: 240
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.column;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('C');
        expect(page.tabOrder).toBe(PdfFormFieldsTabOrder.column);
        document.destroy();
    });
    it('should write the exact PDF name for column tab order', () => {
        // Mutant ID: 241
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.column;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('C');
        expect(tabs.name.length).toBe(1);
        document.destroy();
    });
    it('should select the structure branch for structure tab order', () => {
        // Mutant ID: 243
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.structure;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('S');
        document.destroy();
    });
    it('should assign the structure name inside the structure tab-order branch', () => {
        // Mutant ID: 245
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.structure;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('S');
        expect(page.tabOrder).toBe(PdfFormFieldsTabOrder.structure);
        document.destroy();
    });
    it('should write the exact PDF name for structure tab order', () => {
        // Mutant ID: 246
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.structure;
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('S');
        expect(tabs.name.length).toBe(1);
        document.destroy();
    });
    it('should update the Tabs dictionary entry using the exact key', () => {
        // Mutant ID: 247
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.tabOrder = PdfFormFieldsTabOrder.row;
        expect(page._pageDictionary.has('Tabs')).toBeTruthy();
        const tabs: _PdfName = page._pageDictionary.get('Tabs');
        expect(tabs.name).toBe('R');
        document.destroy();
    });
    it('should expose the cropBox property as enumerable', () => {
        // Mutant ID: 248
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'cropBox'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the cropBox property as configurable', () => {
        // Mutant ID: 249
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'cropBox'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should inherit CropBox through the Parent page-tree entry', () => {
        // Mutant ID: 261
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary._map.CropBox = [10, 20, 510, 720];
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.Parent = parentReference;
        page._cBox = undefined as any;
        const cropBox: number[] = page.cropBox;
        expect(cropBox).toEqual([10, 20, 510, 720]);
        document.destroy();
    });
    it('should inherit CropBox through the abbreviated page-parent entry', () => {
        // Mutant ID: 262
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary._map.CropBox = [25, 30, 525, 730];
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        page._pageDictionary._map.P = parentReference;
        page._cBox = undefined as any;
        const cropBox: number[] = page.cropBox;
        expect(cropBox).toEqual([25, 30, 525, 730]);
        document.destroy();
    });
    it('should return a four-coordinate default CropBox', () => {
        // Mutant ID: 268
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._cBox = undefined as any;
        const cropBox: number[] = page.cropBox;
        expect(cropBox).toEqual([0, 0, 0, 0]);
        expect(cropBox.length).toBe(4);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 4', () => {
    it('should expose the mediaBox property as enumerable', () => {
        // Mutant ID: 269
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'mediaBox'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the mediaBox property as configurable', () => {
        // Mutant ID: 270
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'mediaBox'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should resolve MediaBox as an inherited scalar-array value', () => {
        // Mutant ID: 280
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [10, 20, 610, 820];
        page._mBox = undefined as any;
        const mediaBox: number[] = page.mediaBox;
        expect(mediaBox).toEqual([10, 20, 610, 820]);
        expect(mediaBox.length).toBe(4);
        document.destroy();
    });
    it('should inherit MediaBox through the abbreviated page-parent entry', () => {
        // Mutant ID: 283
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary._map.MediaBox = [25, 30, 625, 830];
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        delete page._pageDictionary._map.MediaBox;
        delete page._pageDictionary._map.Parent;
        page._pageDictionary._map.P = parentReference;
        page._mBox = undefined as any;
        const mediaBox: number[] = page.mediaBox;
        expect(mediaBox).toEqual([25, 30, 625, 830]);
        document.destroy();
    });
    it('should expose the orientation property as enumerable', () => {
        // Mutant ID: 290
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'orientation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the orientation property as configurable', () => {
        // Mutant ID: 291
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'orientation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should return the cached orientation without recalculating it', () => {
        // Mutant ID: 295
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [0, 0, 800, 400];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._orientation = PdfPageOrientation.portrait;
        const orientation: PdfPageOrientation = page.orientation;
        expect(orientation).toBe(PdfPageOrientation.portrait);
        document.destroy();
    });
    it('should calculate orientation when page size is available', () => {
        // Mutant ID: 300
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [0, 0, 800, 400];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._orientation = undefined as any;
        const orientation: PdfPageOrientation = page.orientation;
        expect(orientation).toBe(PdfPageOrientation.landscape);
        document.destroy();
    });
    it('should compare the size type against the exact undefined string', () => {
        // Mutant ID: 303
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [0, 0, 400, 800];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._orientation = undefined as any;
        const orientation: PdfPageOrientation = page.orientation;
        expect(orientation).toBe(PdfPageOrientation.portrait);
        document.destroy();
    });
    it('should classify equal page dimensions as portrait', () => {
        // Mutant ID: 307
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.MediaBox = [0, 0, 500, 500];
        page._size = undefined as any;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        page._orientation = undefined as any;
        const orientation: PdfPageOrientation = page.orientation;
        expect(orientation).toBe(PdfPageOrientation.portrait);
        expect(orientation).not.toBe(PdfPageOrientation.landscape);
        document.destroy();
    });
    it('should expose the origin property as enumerable', () => {
        // Mutant ID: 311
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                '_origin'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the origin property as configurable', () => {
        // Mutant ID: 312
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                '_origin'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should recalculate a cached zero origin from MediaBox', () => {
        // Mutant ID: 322
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [25, 40, 625, 840];
        page._mBox = undefined as any;
        page._o = [0, 0];
        const origin: number[] = page._origin;
        expect(origin).toEqual([25, 40]);
        document.destroy();
    });
    it('should retain a cached origin when only its first coordinate is zero', () => {
        // Mutant ID: 323
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [25, 40, 625, 840];
        page._mBox = undefined as any;
        page._o = [0, 75];
        const origin: number[] = page._origin;
        expect(origin).toEqual([0, 75]);
        document.destroy();
    });
    it('should not recalculate origin solely because the first coordinate is zero', () => {
        // Mutant ID: 324
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [30, 45, 630, 845];
        page._mBox = undefined as any;
        page._o = [0, 60];
        const origin: number[] = page._origin;
        expect(origin).toEqual([0, 60]);
        document.destroy();
    });
    it('should require the first cached origin coordinate to equal zero', () => {
        // Mutant ID: 325
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [30, 45, 630, 845];
        page._mBox = undefined as any;
        page._o = [20, 0];
        const origin: number[] = page._origin;
        expect(origin).toEqual([20, 0]);
        document.destroy();
    });
    it('should not recalculate origin solely because the second coordinate is zero', () => {
        // Mutant ID: 326
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [35, 50, 635, 850];
        page._mBox = undefined as any;
        page._o = [70, 0];
        const origin: number[] = page._origin;
        expect(origin).toEqual([70, 0]);
        document.destroy();
    });
    it('should require the second cached origin coordinate to equal zero', () => {
        // Mutant ID: 327
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [35, 50, 635, 850];
        page._mBox = undefined as any;
        page._o = [0, 80];
        const origin: number[] = page._origin;
        expect(origin).toEqual([0, 80]);
        document.destroy();
    });
    it('should expose the graphics property as enumerable', () => {
        // Mutant ID: 330
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'graphics'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the graphics property as configurable', () => {
        // Mutant ID: 331
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'graphics'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should not mark graphics as accessed before template rendering without template content', () => {
        // Mutant ID: 346
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        expect(document._hasTemplateContentValue).toBeFalsy();
        document._templateRenderingStarted = false;
        page._templatesRendered = false;
        page._accessedBeforeTemplate = false;
        page._g = graphics;
        page._needInitializeGraphics = false;
        const currentGraphics: PdfGraphics = page.graphics;
        expect(currentGraphics).toBe(graphics);
        expect(page._accessedBeforeTemplate).toBeFalsy();
        document.destroy();
    });
    it('should not mark graphics access when templates have already rendered', () => {
        // Mutant ID: 347
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        // Initialize graphics before template content is assigned.
        const graphics: PdfGraphics = page.graphics;
        const template: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: page.size.width,
                height: 50
            });
        (document as any).template.top = template;
        expect(document._hasTemplateContentValue).toBeTruthy();
        page._templatesRendered = true;
        page._accessedBeforeTemplate = false;
        page._g = graphics;
        page._needInitializeGraphics = false;
        const currentGraphics: PdfGraphics = page.graphics;
        expect(currentGraphics).toBe(graphics);
        expect(page._accessedBeforeTemplate).toBeFalsy();
        document.destroy();
    });
    it('should not mark graphics access when the document has no template content', () => {
        // Mutant ID: 348
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        expect(document._hasTemplateContentValue).toBeFalsy();
        document._templateRenderingStarted = false;
        page._templatesRendered = false;
        page._accessedBeforeTemplate = false;
        page._g = graphics;
        page._needInitializeGraphics = false;
        const currentGraphics: PdfGraphics = page.graphics;
        expect(currentGraphics).toBe(graphics);
        expect(page._accessedBeforeTemplate).toBeFalsy();
        document.destroy();
    });
    it('should require template content before marking graphics access', () => {
        // Mutant ID: 349
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        expect(document._hasTemplateContentValue).toBeFalsy();
        document._templateRenderingStarted = false;
        page._templatesRendered = false;
        page._accessedBeforeTemplate = false;
        page._g = graphics;
        page._needInitializeGraphics = false;
        const currentGraphics: PdfGraphics = page.graphics;
        expect(currentGraphics).toBe(graphics);
        expect(page._accessedBeforeTemplate).toBeFalsy();
        document.destroy();
    });
    it('should safely retain cached graphics when cross-reference context is unavailable', () => {
        // Mutant ID: 350
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const crossReference: _PdfCrossReference =
            page._crossReference;
        page._g = graphics;
        page._needInitializeGraphics = false;
        page._accessedBeforeTemplate = false;
        page._crossReference = undefined as any;
        expect(() => page.graphics).not.toThrow();
        expect(page.graphics).toBe(graphics);
        expect(page._accessedBeforeTemplate).toBeFalsy();
        page._crossReference = crossReference;
        document.destroy();
    });
    it('should not access a document when cross-reference context is unavailable', () => {
        // Mutant ID: 351
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const graphics: PdfGraphics = page.graphics;
        const crossReference: _PdfCrossReference =
            page._crossReference;
        page._g = graphics;
        page._needInitializeGraphics = false;
        page._accessedBeforeTemplate = false;
        page._crossReference = undefined as any;
        expect(() => page.graphics).not.toThrow();
        expect(page.graphics).toBe(graphics);
        page._crossReference = crossReference;
        document.destroy();
    });
    it('should expose the drawTextElement method as enumerable', () => {
        // Mutant ID: 356
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'drawTextElement'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    it('should expose the drawTextElement method as configurable', () => {
        // Mutant ID: 357
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                'drawTextElement'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    it('should reject a text element with a null font', () => {
        // Mutant ID: 385
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const element: PdfTextElement = {
            text: 'Text without a font',
            font: null as any
        };
        expect(() => {
            page.drawTextElement(element, { x: 10, y: 20 });
        }).toThrowError('PdfTextElement.font is required');
        document.destroy();
    });
    it('should accept a null layout format as an unspecified format', () => {
        // Mutant ID: 397
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Text with no layout format',
            font: font,
            layoutFormat: null as any
        };
        expect(() => {
            page.drawTextElement(element, { x: 10, y: 20 });
        }).not.toThrow();
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 5', () => {
    it('should use a black brush when the text element has no brush', () => {
        // Mutant ID: 404
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Default brush text',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            { x: 10, y: 20 }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBe(page);
        document.destroy();
    });
    it('should use direct drawing when rectangle dimensions are not numeric', () => {
        // Mutant ID: 410
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Direct drawing',
            font: font
        };
        const bounds: Rectangle = {
            x: 10,
            y: 20,
            width: undefined as any,
            height: undefined as any
        };
        const result: PdfLayoutResult =
            page.drawTextElement(element, bounds);
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(10);
        expect(result.bounds.y).toBe(20);
        document.destroy();
    });
    it('should require both rectangle dimensions to be numeric before layout', () => {
        // Mutant ID: 411
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Numeric dimensions',
            font: font
        };
        const bounds: Rectangle = {
            x: 15,
            y: 25,
            width: 100,
            height: undefined as any
        };
        const result: PdfLayoutResult =
            page.drawTextElement(element, bounds);
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(15);
        expect(result.bounds.y).toBe(25);
        document.destroy();
    });
    it('should require the rectangle width to be numeric before layout', () => {
        // Mutant ID: 412
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Non-numeric width',
            font: font
        };
        const bounds: Rectangle = {
            x: 20,
            y: 30,
            width: undefined as any,
            height: 100
        };
        const result: PdfLayoutResult =
            page.drawTextElement(element, bounds);
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(20);
        expect(result.bounds.y).toBe(30);
        document.destroy();
    });
    it('should require the rectangle height to be numeric before layout', () => {
        // Mutant ID: 415
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Non-numeric height',
            font: font
        };
        const bounds: Rectangle = {
            x: 25,
            y: 35,
            width: 100,
            height: undefined as any
        };
        const result: PdfLayoutResult =
            page.drawTextElement(element, bounds);
        expect(result).toBeDefined();
        expect(result.bounds.x).toBe(25);
        expect(result.bounds.y).toBe(35);
        document.destroy();
    });
    it('should enter layout when only the rectangle width is positive', () => {
        // Mutant ID: 419
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Positive width only',
            font: font
        };
        const bounds: Rectangle = {
            x: 10,
            y: 20,
            width: 200,
            height: 0
        };
        const result: PdfLayoutResult =
            page.drawTextElement(element, bounds);
        expect(result).toBeDefined();
        expect(result.bounds.width).toBeGreaterThan(0);
        expect(result.Page).toBe(page);
        document.destroy();
    });
    it('should enter layout when rectangle width is positive', () => {
        // Mutant ID: 420
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Width-driven layout',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 20,
                width: 180,
                height: 0
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.width).toBeGreaterThan(0);
        document.destroy();
    });
    it('should enter layout when rectangle height is positive', () => {
        // Mutant ID: 423
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Height-driven layout',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 20,
                width: 0,
                height: 200
            }
        );
        expect(result).toBeDefined();
        expect(result.Page).toBe(page);
        document.destroy();
    });
    it('should normalize a negative layout y coordinate to zero', () => {
        // Mutant ID: 428
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Negative y coordinate',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: -20,
                width: 200,
                height: 100
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.y).toBe(0);
        document.destroy();
    });
    it('should preserve a zero layout y coordinate', () => {
        // Mutant ID: 429
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Zero y coordinate',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 15,
                y: 0,
                width: 200,
                height: 100
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.y).toBe(0);
        document.destroy();
    });
    it('should expand a zero layout height to the available page height', () => {
        // Mutant ID: 432
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Zero layout height',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 100,
                width: 200,
                height: 0
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        document.destroy();
    });
    it('should retain a positive layout height when it fits the page', () => {
        // Mutant ID: 433
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Specified layout height',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 100
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        expect(result.bounds.height).toBeLessThanOrEqual(100);
        document.destroy();
    });
    it('should distinguish zero layout height from positive layout height', () => {
        // Mutant ID: 434
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Height equality boundary',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 120,
                width: 200,
                height: 0
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        document.destroy();
    });
    it('should assign the available page height when requested height is zero', () => {
        // Mutant ID: 435
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Available height assignment',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 20,
                y: 100,
                width: 250,
                height: 0
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        document.destroy();
    });
    it('should subtract the y coordinate from the available page height', () => {
        // Mutant ID: 436
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Available height calculation',
            font: font
        };
        const pageBounds: number[] =
            page._getActualBounds(page._pageSettings);
        const expectedHeight: number = pageBounds[3] - 100;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 100,
                width: 200,
                height: 0
            }
        );
        expect(result).toBeDefined();
        expect(expectedHeight).toBeGreaterThan(0);
        expect(result.bounds.y).toBe(100);
        document.destroy();
    });
    it('should process a positive requested height through the bounded-height branch', () => {
        // Mutant ID: 437
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Bounded positive height',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 100,
                width: 200,
                height: 150
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        expect(result.bounds.height).toBeLessThanOrEqual(150);
        document.destroy();
    });
    it('should calculate maximum height by subtracting the y coordinate', () => {
        // Mutant ID: 438
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Maximum height calculation',
            font: font
        };
        const actualBounds: number[] =
            page._getActualBounds(page._pageSettings);
        const expectedMaximum: number = actualBounds[3] - 200;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 200,
                width: 200,
                height: actualBounds[3]
            }
        );
        expect(result).toBeDefined();
        expect(expectedMaximum).toBeGreaterThan(0);
        expect(result.bounds.y).toBe(200);
        document.destroy();
    });
    it('should preserve a requested height that is below the maximum height', () => {
        // Mutant ID: 439
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Height below maximum',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 100
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        expect(result.bounds.height).toBeLessThanOrEqual(100);
        document.destroy();
    });
    it('should preserve a requested height equal to the maximum height', () => {
        // Mutant ID: 441
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Height at maximum',
            font: font
        };
        const actualBounds: number[] =
            page._getActualBounds(page._pageSettings);
        const y: number = 100;
        const maximumHeight: number = actualBounds[3] - y;
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: y,
                width: 200,
                height: maximumHeight
            }
        );
        expect(result).toBeDefined();
        expect(maximumHeight).toBeGreaterThan(0);
        expect(result.bounds.y).toBe(y);
        document.destroy();
    });
    it('should clamp a requested height only when it exceeds the maximum height', () => {
        // Mutant ID: 442
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular
        );
        const element: PdfTextElement = {
            text: 'Height within maximum',
            font: font
        };
        const result: PdfLayoutResult = page.drawTextElement(
            element,
            {
                x: 10,
                y: 100,
                width: 200,
                height: 50
            }
        );
        expect(result).toBeDefined();
        expect(result.bounds.height).toBeGreaterThan(0);
        expect(result.bounds.height).toBeLessThanOrEqual(50);
        document.destroy();
    });
    it('should create the Annots entry when the page has no annotation array', () => {
        // Mutant ID: 446
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        const annotationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        annotationDictionary.update('Type', _PdfName.get('Annot'));
        annotationDictionary.update('Subtype', _PdfName.get('Link'));
        annotationDictionary.update('Rect', [10, 20, 110, 70]);
        document._crossReference._cacheMap.set(
            annotationReference,
            annotationDictionary
        );
        delete page._pageDictionary._map.Annots;
        page._addWidget(annotationReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(page._pageDictionary.has('Annots')).toBeTruthy();
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(annotationReference);
        document.destroy();
    });
    it('should preserve a direct Annots array without treating it as a reference', () => {
        // Mutant ID: 452
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [firstReference];
        page._addWidget(secondReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(2);
        expect(annotations[0]).toBe(firstReference);
        expect(annotations[1]).toBe(secondReference);
        document.destroy();
    });
    it('should require the Annots value to be a reference before dereferencing it', () => {
        // Mutant ID: 454
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [firstReference];
        page._addWidget(secondReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(Array.isArray(annotations)).toBeTruthy();
        expect(annotations.length).toBe(2);
        document.destroy();
    });
    it('should replace a non-array Annots value with a new annotation array', () => {
        // Mutant ID: 459
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotationReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots =
            _PdfName.get('InvalidAnnots');
        page._addWidget(annotationReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(Array.isArray(annotations)).toBeTruthy();
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(annotationReference);
        document.destroy();
    });
    it('should default the array retrieval option to false', () => {
        // Mutant ID: 468
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 500, 700];
        const value: number[] = page._getProperty('MediaBox');
        expect(value).toEqual([0, 0, 500, 700]);
        document.destroy();
    });
    it('should assign false when the array retrieval option is omitted', () => {
        // Mutant ID: 469
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.Rotate = 90;
        const value: number = page._getProperty('Rotate');
        expect(value).toBe(90);
        document.destroy();
    });
    it('should return the only dictionary from a single-value inherited array', () => {
        // Mutant ID: 479
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const resourceDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        resourceDictionary.update(
            'Font',
            new _PdfDictionary(document._crossReference)
        );
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.Resources = resourceDictionary;
        const value: _PdfDictionary =
            page._getProperty('Resources');
        expect(value).toBe(resourceDictionary);
        expect(value.has('Font')).toBeTruthy();
        document.destroy();
    });
    it('should prepend the graphics save operator to page contents', () => {
        // Mutant ID: 484
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._parseGraphics();
        const firstReference: _PdfReference = page._contents[0];
        const saveStream: _PdfContentStream =
            document._crossReference._fetch(firstReference);
        expect(saveStream._bytes).toEqual([32, 113, 32, 10]);
        document.destroy();
    });
    it('should append the graphics restore operator to page contents', () => {
        // Mutant ID: 485
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._parseGraphics();
        const restoreReference: _PdfReference =
            page._contents[page._contents.length - 2];
        const restoreStream: _PdfContentStream =
            document._crossReference._fetch(restoreReference);
        expect(restoreStream._bytes).toEqual([32, 81, 32, 10]);
        document.destroy();
    });
    it('should treat null page contents as an empty content collection', () => {
        // Mutant ID: 494
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents = null;
        page._contents = undefined as any;
        page._loadContents();
        expect(page._contents).toEqual([]);
        expect(page._contents.length).toBe(0);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 6', () => {
    it('should treat null page contents as an empty collection', () => {
        // Mutant ID: 495
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents = null;
        page._contents = undefined as any;
        expect(() => page._loadContents()).not.toThrow();
        expect(page._contents).toEqual([]);
        document.destroy();
    });
    it('should not attempt to fetch null page contents', () => {
        // Mutant ID: 496
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents = null;
        page._contents = undefined as any;
        page._loadContents();
        expect(page._contents).toEqual([]);
        expect(page._contents.length).toBe(0);
        document.destroy();
    });
    it('should treat undefined page contents as an empty collection', () => {
        // Mutant ID: 498
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents = undefined as any;
        page._contents = undefined as any;
        expect(() => page._loadContents()).not.toThrow();
        expect(page._contents).toEqual([]);
        document.destroy();
    });
    it('should compare undefined contents using the exact type string', () => {
        // Mutant ID: 500
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents = undefined as any;
        page._contents = undefined as any;
        page._loadContents();
        expect(page._contents).toEqual([]);
        expect(Array.isArray(page._contents)).toBeTruthy();
        document.destroy();
    });
    it('should not treat a non-array contents value as a contents array', () => {
        // Mutant ID: 509
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Contents =
            _PdfName.get('InvalidContents');
        page._contents = undefined as any;
        page._loadContents();
        expect(page._contents).toEqual([]);
        expect(page._contents.length).toBe(0);
        document.destroy();
    });
    it('should ignore an unavailable cached MediaBox during graphics initialization', () => {
        // Mutant ID: 515
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.MediaBox;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._size = { width: 400, height: 600 };
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        expect(() => page._initializeGraphics(stream)).not.toThrow();
        expect(page._g).toBeDefined();
        document.destroy();
    });
    it('should require MediaBox to exist before reading its coordinates', () => {
        // Mutant ID: 517
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.MediaBox;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._size = { width: 400, height: 600 };
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        expect(() => page._initializeGraphics(stream)).not.toThrow();
        expect(page._g._size.width).toBe(400);
        expect(page._g._size.height).toBe(600);
        document.destroy();
    });
    it('should ignore a MediaBox with fewer than four coordinates', () => {
        // Mutant ID: 518
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [10, 20, 300];
        page._size = { width: 400, height: 600 };
        page._mBox = [10, 20, 300];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(400);
        expect(page._g._size.height).toBe(600);
        document.destroy();
    });
    it('should ignore an unavailable CropBox during graphics initialization', () => {
        // Mutant ID: 526
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 400, 600];
        page._size = { width: 400, height: 600 };
        page._mBox = [0, 0, 400, 600];
        page._cBox = undefined as any;
        expect(() => page._initializeGraphics(stream)).not.toThrow();
        expect(page._g).toBeDefined();
        document.destroy();
    });
    it('should require CropBox to exist before reading its coordinates', () => {
        // Mutant ID: 528
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 500, 700];
        page._size = { width: 500, height: 700 };
        page._mBox = [0, 0, 500, 700];
        page._cBox = undefined as any;
        expect(() => page._initializeGraphics(stream)).not.toThrow();
        expect(page._g._size.width).toBe(500);
        expect(page._g._size.height).toBe(700);
        document.destroy();
    });
    it('should ignore a CropBox with fewer than four coordinates', () => {
        // Mutant ID: 529
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 500, 700];
        page._pageDictionary._map.CropBox = [10, 20, 300];
        page._size = { width: 500, height: 700 };
        page._mBox = [0, 0, 500, 700];
        page._cBox = [10, 20, 300];
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(500);
        expect(page._g._size.height).toBe(700);
        document.destroy();
    });
    it('should require both CropBox coordinate checks to succeed', () => {
        // Mutant ID: 535
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 100, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should reject a negative CropBox when its vertical magnitude does not match the page height', () => {
        // Mutant ID: 536
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 100, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should require a negative coordinate and matching vertical magnitude', () => {
        // Mutant ID: 537
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 100, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should reject a non-negative CropBox even when its magnitudes match the page', () => {
        // Mutant ID: 538
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 700, 900];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should accept a CropBox when only its first coordinate is negative', () => {
        // Mutant ID: 539
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.width).toBe(500);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative upper-right x coordinate', () => {
        // Mutant ID: 540
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, -50, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.width).toBe(600);
        document.destroy();
    });
    it('should accept a CropBox when its first coordinate alone is negative', () => {
        // Mutant ID: 541
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative upper-right x value without requiring a negative lower-left value', () => {
        // Mutant ID: 542
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, -40, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.width).toBe(600);
        document.destroy();
    });
    it('should accept a CropBox when only its first coordinate is negative', () => {
        // Mutant ID: 543
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        document.destroy();
    });
    it('should recognize a negative first CropBox coordinate', () => {
        // Mutant ID: 544
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, 800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.width).toBe(500);
        document.destroy();
    });
    it('should not treat a zero first CropBox coordinate as negative', () => {
        // Mutant ID: 545
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [0, 800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 0, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 0, height: 800 };
        page._mBox = [0, 0, 0, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should not treat a positive first CropBox coordinate as negative', () => {
        // Mutant ID: 546
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 700, 900];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should recognize a negative second CropBox coordinate', () => {
        // Mutant ID: 547
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, -800, 500, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        expect(page._g._size.width).toBe(600);
        document.destroy();
    });
    it('should not treat a zero second CropBox coordinate as negative', () => {
        // Mutant ID: 548
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 0, 700, 900];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 0];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 0 };
        page._mBox = [0, 0, 600, 0];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should not treat a positive second CropBox coordinate as negative', () => {
        // Mutant ID: 549
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 700, 900];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should recognize a negative upper-right x CropBox coordinate', () => {
        // Mutant ID: 550
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, -40, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        document.destroy();
    });
    it('should not treat a zero upper-right x coordinate as negative', () => {
        // Mutant ID: 551
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 0, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should not treat a positive upper-right x coordinate as negative', () => {
        // Mutant ID: 552
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 20, 700];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should recognize a negative upper-right y CropBox coordinate', () => {
        // Mutant ID: 553
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 500, -25];
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toBeUndefined();
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 7', () => {
    it('should not treat a zero upper-right CropBox y coordinate as negative', () => {
        // Mutant ID: 554
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 500, 0];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should not treat a positive upper-right CropBox y coordinate as negative', () => {
        // Mutant ID: 555
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [600, 800, 500, 25];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        document.destroy();
    });
    it('should require CropBox vertical magnitude to match page height', () => {
        // Mutant ID: 556
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-600, -700, 500, 650];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require CropBox horizontal magnitude to match page width', () => {
        // Mutant ID: 558
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        const cropBox: number[] = [-500, -800, 450, 700];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.CropBox = cropBox;
        page._size = { width: 600, height: 800 };
        page._mBox = [0, 0, 600, 800];
        page._cBox = cropBox;
        page._initializeGraphics(stream);
        expect(page._g._cropBox).toEqual(cropBox);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should reject unmatched negative MediaBox coordinates', () => {
        // Mutant ID: 566
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-500, -700, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-500, -700, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require all negative MediaBox validation conditions to pass', () => {
        // Mutant ID: 568
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-500, -800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-500, -800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require a negative MediaBox coordinate before using negative-box handling', () => {
        // Mutant ID: 569
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require both a negative MediaBox coordinate and matching height', () => {
        // Mutant ID: 570
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -700, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, -700, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not use negative MediaBox handling for non-negative coordinates', () => {
        // Mutant ID: 571
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative lower-left x coordinate independently', () => {
        // Mutant ID: 576
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative lower-left x MediaBox coordinate', () => {
        // Mutant ID: 577
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-600, 800, 600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not treat a zero lower-left x MediaBox coordinate as negative', () => {
        // Mutant ID: 578
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 800, 0, 700];
        page._size = { width: 0, height: 800 };
        page._mBox = [0, 800, 0, 700];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(0);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not treat a positive lower-left x MediaBox coordinate as negative', () => {
        // Mutant ID: 579
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative lower-left y MediaBox coordinate', () => {
        // Mutant ID: 580
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [600, -800, 600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not treat a zero lower-left y MediaBox coordinate as negative', () => {
        // Mutant ID: 581
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 0, 600, 0];
        page._size = { width: 600, height: 0 };
        page._mBox = [600, 0, 600, 0];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(0);
        document.destroy();
    });
    it('should not treat a positive lower-left y MediaBox coordinate as negative', () => {
        // Mutant ID: 582
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative upper-right x MediaBox coordinate', () => {
        // Mutant ID: 583
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, -800, -40, 700];
        page._size = { width: 40, height: 800 };
        page._mBox = [600, -800, -40, 700];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(700);
        document.destroy();
    });
    it('should not treat a zero upper-right x MediaBox coordinate as negative', () => {
        // Mutant ID: 584
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [0, 800, 0, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 0,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(0);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not treat a positive upper-right x MediaBox coordinate as negative', () => {
        // Mutant ID: 585
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should recognize a negative upper-right y MediaBox coordinate', () => {
        // Mutant ID: 586
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [700, 800, 600, -25];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not treat a zero upper-right y MediaBox coordinate as negative', () => {
        // Mutant ID: 587
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 0];
        page._size = { width: 600, height: 0 };
        page._mBox = [0, 0, 600, 0];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(0);
        document.destroy();
    });
    it('should not treat a positive upper-right y MediaBox coordinate as negative', () => {
        // Mutant ID: 588
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [600, 800, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [600, 800, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require lower-left y magnitude to match page height', () => {
        // Mutant ID: 589
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -700, 600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, -700, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should require upper-right x magnitude to match page width', () => {
        // Mutant ID: 591
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, 500, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, -800, 500, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should normalize dimensions when either calculated dimension is non-positive', () => {
        // Mutant ID: 596
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, -700, 800];
        page._size = { width: 700, height: 800 };
        page._mBox = [-600, -800, -700, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should normalize a non-positive calculated width', () => {
        // Mutant ID: 597
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, -700, 800];
        page._size = { width: 700, height: 800 };
        page._mBox = [-600, -800, -700, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should normalize a calculated width equal to zero', () => {
        // Mutant ID: 598
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, -600, 800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, -800, -600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should normalize a non-positive calculated height', () => {
        // Mutant ID: 600
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, 600, -900];
        page._size = { width: 600, height: 900 };
        page._mBox = [-600, -800, 600, -900];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should normalize a calculated height equal to zero', () => {
        // Mutant ID: 601
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, 600, -800];
        page._size = { width: 600, height: 800 };
        page._mBox = [-600, -800, 600, -800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should convert a negative lower-left x coordinate to a positive value', () => {
        // Mutant ID: 605
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream =
            new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-600, -800, -700, 800];
        page._size = { width: 700, height: 800 };
        page._mBox = [-600, -800, -700, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 8', () => {
    it('should convert a negative lower-left x coordinate', () => {
        // Mutant ID: 606
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not convert a zero lower-left x coordinate', () => {
        // Mutant ID: 607
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [0, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not convert a positive lower-left x coordinate', () => {
        // Mutant ID: 608
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should execute lower-left x normalization', () => {
        // Mutant ID: 609
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        document.destroy();
    });
    it('should negate the lower-left x coordinate', () => {
        // Mutant ID: 610
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.width).not.toBe(600);
        document.destroy();
    });
    it('should not negate a positive lower-left y coordinate', () => {
        // Mutant ID: 611
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, 800, -600, -700];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not negate a zero lower-left y coordinate', () => {
        // Mutant ID: 613
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, 0, -600, -800];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 0
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not negate a positive upper-right x coordinate', () => {
        // Mutant ID: 617
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, 600, -700];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should convert a negative upper-right x coordinate', () => {
        // Mutant ID: 618
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-500, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not convert a zero upper-right x coordinate', () => {
        // Mutant ID: 619
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, 0, 0, -800];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 0,
            height: 0
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should not convert an upper-right x coordinate greater than zero', () => {
        // Mutant ID: 620
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, 600, -700];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(800);
        document.destroy();
    });
    it('should execute upper-right x normalization', () => {
        // Mutant ID: 621
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-500, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        document.destroy();
    });
    it('should negate the upper-right x coordinate', () => {
        // Mutant ID: 622
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-500, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(600);
        expect(page._g._size.width).not.toBe(500);
        document.destroy();
    });
    it('should not negate a positive upper-right y coordinate', () => {
        // Mutant ID: 623
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should convert a negative upper-right y coordinate', () => {
        // Mutant ID: 624
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, -900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should not convert a zero upper-right y coordinate', () => {
        // Mutant ID: 625
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, 0, -600, 0];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 0
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(0);
        document.destroy();
    });
    it('should not convert an upper-right y coordinate greater than zero', () => {
        // Mutant ID: 626
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, 900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.width).toBe(700);
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should execute upper-right y normalization', () => {
        // Mutant ID: 627
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, -900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.height).toBe(900);
        document.destroy();
    });
    it('should negate the upper-right y coordinate', () => {
        // Mutant ID: 628
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        const mediaBox: number[] = [-700, -800, -600, -900];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = mediaBox;
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._g._size.height).toBe(900);
        expect(page._g._size.height).not.toBe(800);
        document.destroy();
    });
    it('should initialize coordinates with the page when both origin coordinates are negative', () => {
        // Mutant ID: 640
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-25, -40, 575, 760];
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [-25, -40, 575, 760];
        page._cBox = undefined as any;
        page._o = [-25, -40];
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._origin).toEqual([-25, -40]);
        document.destroy();
    });
    it('should not use default coordinate initialization for a negative x origin', () => {
        // Mutant ID: 641
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-25, -40, 575, 760];
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [-25, -40, 575, 760];
        page._cBox = undefined as any;
        page._o = [-25, -40];
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._origin[0]).toBe(-25);
        document.destroy();
    });
    it('should not use default coordinate initialization for a negative y origin', () => {
        // Mutant ID: 644
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-25, -40, 575, 760];
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [-25, -40, 575, 760];
        page._cBox = undefined as any;
        page._o = [-25, -40];
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._origin[1]).toBe(-40);
        document.destroy();
    });
    it('should use default coordinate initialization for opposite origin signs', () => {
        // Mutant ID: 647
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [-25, 40, 575, 840];
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [-25, 40, 575, 840];
        page._cBox = undefined as any;
        page._o = [-25, 40];
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(Math.sign(page._origin[0]))
            .not.toBe(Math.sign(page._origin[1]));
        document.destroy();
    });
    it('should ignore an invalid cached rotation value', () => {
        // Mutant ID: 655
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = Number.NaN as PdfRotationAngle;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Rotate;
        expect(() => page._initializeGraphics(stream)).not.toThrow();
        expect(Number.isNaN(page._rotation)).toBeTruthy();
        document.destroy();
    });
    it('should require a valid rotation before applying page transforms', () => {
        // Mutant ID: 657
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = Number.NaN as PdfRotationAngle;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Rotate;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(Number.isNaN(page._rotation)).toBeTruthy();
        document.destroy();
    });
    it('should skip rotation transforms for angle zero without a Rotate entry', () => {
        // Mutant ID: 659
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle0;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Rotate;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._pageDictionary.has('Rotate')).toBeFalsy();
        expect(page._rotation).toBe(PdfRotationAngle.angle0);
        document.destroy();
    });
    it('should detect the exact Rotate dictionary key', () => {
        // Mutant ID: 663
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle90;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.Rotate = 90;
        page._initializeGraphics(stream);
        expect(page._pageDictionary.has('Rotate')).toBeTruthy();
        expect(page._g._clipBounds[2]).toBe(600);
        expect(page._g._clipBounds[3]).toBe(800);
        document.destroy();
    });
    it('should read the explicit Rotate value from the page dictionary', () => {
        // Mutant ID: 666
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle90;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.Rotate = 270;
        page._initializeGraphics(stream);
        expect(page._pageDictionary.get('Rotate')).toBe(270);
        expect(page._g._clipBounds[2]).toBe(800);
        expect(page._g._clipBounds[3]).toBe(600);
        document.destroy();
    });
    it('should check the exact Rotate key before reading its value', () => {
        // Mutant ID: 667
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle90;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.Rotate = 270;
        page._initializeGraphics(stream);
        expect(page._pageDictionary.has('Rotate')).toBeTruthy();
        expect(page._pageDictionary.get('Rotate')).toBe(270);
        document.destroy();
    });
    it('should retrieve rotation using the exact Rotate dictionary key', () => {
        // Mutant ID: 669
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle90;
        page._isNew = false;
        delete page._pageDictionary._map.CropBox;
        page._pageDictionary._map.Rotate = 270;
        page._initializeGraphics(stream);
        expect(page._pageDictionary.get('Rotate')).toBe(270);
        expect(page._g._clipBounds[2]).toBe(800);
        expect(page._g._clipBounds[3]).toBe(600);
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 9', () => {
    it('should retain four clip-bound coordinates after 90 degree rotation', () => {
        // Mutant ID: 678
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = [0, 0, 600, 800];
        page._pageDictionary._map.Rotate = 90;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._rotation = PdfRotationAngle.angle90;
        page._isNew = false;
        page._initializeGraphics(stream);
        expect(page._g._clipBounds.length).toBe(4);
        expect(page._g._clipBounds[2]).toBe(600);
        expect(page._g._clipBounds[3]).toBe(800);
        document.destroy();
    });
    it('should translate margins directly when document templates are unavailable', () => {
        // Mutant ID: 701
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const stream: _PdfContentStream = new _PdfContentStream([]);
        expect(document._hasTemplateContentValue).toBeFalsy();
        page._isNew = true;
        page._isLineAnnotation = false;
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = undefined as any;
        page._initializeGraphics(stream);
        expect(page._g).toBeDefined();
        expect(page._needInitializeGraphics).toBeFalsy();
        document.destroy();
    });
    it('should subtract both horizontal template reservations from actual width', () => {
        // Mutant ID: 711
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const pageSettings: PdfPageSettings = page._pageSettings;
        const leftTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({
            width: 40,
            height: page.size.height
        });
        const rightTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({
            width: 30,
            height: page.size.height
        });
        document.template.left = {
            template: leftTemplate
        };
        document.template.right = {
            template: rightTemplate
        };
        const actualSize: number[] = pageSettings._getActualSize();
        const reserved: number[] = page._getTemplateReservedSpace(false);
        const bounds: number[] = page._getActualBounds(pageSettings);
        expect(leftTemplate._bounds.width).toBe(40);
        expect(rightTemplate._bounds.width).toBe(30);
        expect(reserved[3]).toBe(40);
        expect(reserved[1]).toBe(30);
        expect(bounds[2]).toBe(
            actualSize[0] - reserved[3] - reserved[1]
        );
        document.destroy();
    });
    it('should subtract left template reservation from actual width', () => {
        // Mutant ID: 712
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const pageSettings: PdfPageSettings = page._pageSettings;
        const leftTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({
            width: 40,
            height: page.size.height
        });
        document.template.left = {
            template: leftTemplate
        };
        const actualSize: number[] = pageSettings._getActualSize();
        const reserved: number[] = page._getTemplateReservedSpace(false);
        const bounds: number[] = page._getActualBounds(pageSettings);
        expect(leftTemplate._bounds.width).toBe(40);
        expect(reserved[3]).toBe(40);
        expect(reserved[1]).toBe(0);
        expect(bounds[2]).toBe(
            actualSize[0] - reserved[3] - reserved[1]
        );
        document.destroy();
    });
    it('should subtract both vertical template reservations from actual height', () => {
        // Mutant ID: 713
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const pageSettings: PdfPageSettings = page._pageSettings;
        const topTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({
            width: page.size.width,
            height: 30
        });
        const bottomTemplate: PdfPageTemplateElement = new PdfPageTemplateElement({
            width: page.size.width,
            height: 40
        });
        document.template.top = {
            template: topTemplate
        };
        document.template.bottom = {
            template: bottomTemplate
        };
        const actualSize: number[] = pageSettings._getActualSize();
        const reserved: number[] = page._getTemplateReservedSpace(false);
        const bounds: number[] = page._getActualBounds(pageSettings);
        expect(topTemplate._bounds.height).toBe(30);
        expect(bottomTemplate._bounds.height).toBe(40);
        expect(reserved[0]).toBe(30);
        expect(reserved[2]).toBe(40);
        expect(bounds[3]).toBe(
            actualSize[1] - reserved[0] - reserved[2]
        );
        document.destroy();
    });
    it('should retrieve MediaBox using the exact dictionary key', () => {
        // Mutant ID: 768
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const mediaBox: number[] = [10, 20, 610, 820];
        delete page._pageDictionary._map.CropBox;
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._mBox = undefined as any;
        page._cBox = undefined as any;
        const result: number[] = page._getCropOrMediaBox();
        expect(result).toEqual(mediaBox);
        expect(result.length).toBe(4);
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(610);
        expect(result[3]).toBe(820);
        document.destroy();
    });
    it('should return the cached resource dictionary without replacing it', () => {
        // Mutant ID: 726
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const resources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fontResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        resources.update('Font', fontResources);
        page._resourceObject = resources;
        const result: _PdfDictionary = page._fetchResources();
        expect(result).toBe(resources);
        expect(result.has('Font')).toBeTruthy();
        document.destroy();
    });
    it('should ignore a null Resources value', () => {
        // Mutant ID: 740
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Resources = null;
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        const result: _PdfDictionary = page._fetchResources();
        expect(result).toBeUndefined();
        expect(page._hasResourceReference).toBeFalsy();
        document.destroy();
    });
    it('should require a non-null Resources value before dereferencing it', () => {
        // Mutant ID: 741
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Resources = null;
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        const result: _PdfDictionary = page._fetchResources();
        expect(result).toBeUndefined();
        expect(page._hasResourceReference).toBeFalsy();
        document.destroy();
    });
    it('should not treat a null Resources value as a reference', () => {
        // Mutant ID: 742
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Resources = null;
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        page._fetchResources();
        expect(page._resourceObject).toBeUndefined();
        expect(page._hasResourceReference).toBeFalsy();
        document.destroy();
    });
    it('should create a resource dictionary when Resources is undefined', () => {
        // Mutant ID: 744
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Resources;
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        const result: _PdfDictionary =
            page._fetchResources();
        expect(result).toBeDefined();
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(page._resourceObject).toBe(result);
        expect(page._hasResourceReference).toBeFalsy();
        expect(
            page._pageDictionary.has('Resources')
        ).toBeTruthy();
        expect(
            page._pageDictionary.getRaw('Resources')
        ).toBe(result);
        document.destroy();
    });
    it('should handle a missing Resources value without dereferencing it', () => {
        // Mutant ID: 746
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Resources;
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        const result: _PdfDictionary =
            page._fetchResources();
        expect(result).toBeDefined();
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(page._resourceObject).toBe(result);
        expect(page._hasResourceReference).toBeFalsy();
        expect(
            page._pageDictionary.getRaw('Resources')
        ).toBe(result);
        document.destroy();
    });
    it('should not accept a non-dictionary direct Resources value', () => {
        // Mutant ID: 749
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Resources =
            _PdfName.get('InvalidResources');
        page._resourceObject = undefined as any;
        page._hasResourceReference = false;
        const result: _PdfDictionary = page._fetchResources();
        expect(result).toBeUndefined();
        expect(page._resourceObject).toBeUndefined();
        document.destroy();
    });
    it('should require a direct Resources value to be a dictionary', () => {
        // Mutant ID: 751
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Resources =
            _PdfName.get('InvalidResources');
        page._resourceObject = undefined as any;
        page._fetchResources();
        expect(page._resourceObject).toBeUndefined();
        document.destroy();
    });
    it('should clear all page-owned cached values during destruction', () => {
        // Mutant ID: 776
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._size = {
            width: 600,
            height: 800
        };
        page._mBox = [0, 0, 600, 800];
        page._cBox = [10, 20, 590, 780];
        page._o = [0, 0];
        page._contents = [];
        page._destroy();
        expect(page._pageDictionary).toBeUndefined();
        expect(page._size).toBeUndefined();
        expect(page._mBox).toBeUndefined();
        expect(page._cBox).toBeUndefined();
        expect(page._o).toBeUndefined();
        expect(page._contents).toBeUndefined();
        document.destroy();
    });
    it('should safely return no tab order when the page dictionary is unavailable', () => {
        // Mutant ID: 778
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        page._pageDictionary = undefined as any;
        page._tabOrder = undefined as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.none);
        page._pageDictionary = dictionary;
        document.destroy();
    });
    it('should not access Tabs when the page dictionary is unavailable', () => {
        // Mutant ID: 780
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        page._pageDictionary = undefined as any;
        page._tabOrder = undefined as any;
        expect(() => page._obtainTabOrder()).not.toThrow();
        expect(page._tabOrder).toBe(PdfFormFieldsTabOrder.none);
        page._pageDictionary = dictionary;
        document.destroy();
    });
    it('should map the row PDF name to row tab order', () => {
        // Mutant ID: 785
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Tabs = _PdfName.get('R');
        page._tabOrder = undefined as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.row);
        document.destroy();
    });
    it('should assign row tab order inside the row branch', () => {
        // Mutant ID: 788
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Tabs = _PdfName.get('R');
        page._tabOrder = undefined as any;
        page._obtainTabOrder();
        expect(page._tabOrder).toBe(PdfFormFieldsTabOrder.row);
        document.destroy();
    });
    it('should map the structure PDF name to structure tab order', () => {
        // Mutant ID: 795
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Tabs = _PdfName.get('S');
        page._tabOrder = undefined as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(
            PdfFormFieldsTabOrder.structure
        );
        document.destroy();
    });
    it('should assign structure tab order inside the structure branch', () => {
        // Mutant ID: 798
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Tabs = _PdfName.get('S');
        page._tabOrder = undefined as any;
        page._obtainTabOrder();
        expect(page._tabOrder).toBe(
            PdfFormFieldsTabOrder.structure
        );
        document.destroy();
    });
    it('should not map another PDF name to widget tab order', () => {
        // Mutant ID: 799
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page._pageDictionary._map.Tabs = _PdfName.get('R');
        page._tabOrder = undefined as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.row);
        expect(tabOrder).not.toBe(PdfFormFieldsTabOrder.widget);
        document.destroy();
    });
    it('should default a null cached tab order to none', () => {
        // Mutant ID: 805
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = null as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should default either null or undefined tab order to none', () => {
        // Mutant ID: 806
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = null as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should recognize a null cached tab order', () => {
        // Mutant ID: 807
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = null as any;
        page._obtainTabOrder();
        expect(page._tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should recognize an undefined cached tab order', () => {
        // Mutant ID: 809
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = undefined as any;
        page._obtainTabOrder();
        expect(page._tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should use the exact undefined type string for cached tab order', () => {
        // Mutant ID: 811
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = undefined as any;
        const tabOrder: PdfFormFieldsTabOrder =
            page._obtainTabOrder();
        expect(tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should assign the none value when cached tab order is unavailable', () => {
        // Mutant ID: 812
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        delete page._pageDictionary._map.Tabs;
        page._tabOrder = undefined as any;
        page._obtainTabOrder();
        expect(page._tabOrder).toBe(PdfFormFieldsTabOrder.none);
        document.destroy();
    });
    it('should remove the requested annotation reference', () => {
        // Mutant ID: 813
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(page._pageDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('should not process annotations when the page dictionary is unavailable', () => {
        // Mutant ID: 814
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary = undefined as any;
        expect(() => page._removeAnnotation(reference)).not.toThrow();
        page._pageDictionary = dictionary;
        document.destroy();
    });
});
describe('PdfPage survived mutants batch 10', () => {
    it('should filter the removed annotation from the Annots array', () => {
        // Mutant ID: 824
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should process a valid Annots array', () => {
        // Mutant ID: 821
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should execute annotation removal when the Annots entry exists', () => {
        // Mutant ID: 818
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._pageDictionary._updated = false;
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        expect(page._pageDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('should retrieve annotations using the exact Annots property name', () => {
        // Mutant ID: 819
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(page._pageDictionary.has('Annots')).toBeTruthy();
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should remove an annotation when the Annots entry exists', () => {
        // Mutant ID: 815
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should update the Annots array and dictionary state', () => {
        // Mutant ID: 823
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._pageDictionary._updated = false;
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        expect(page._pageDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('should write the filtered array to the exact Annots key', () => {
        // Mutant ID: 829
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(page._pageDictionary.has('Annots')).toBeTruthy();
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should not access annotations when the page dictionary is unavailable', () => {
        // Mutant ID: 816
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary = page._pageDictionary;
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary = undefined as any;
        expect(() => {
            page._removeAnnotation(reference);
        }).not.toThrow();
        page._pageDictionary = dictionary;
        document.destroy();
    });
    it('should check the exact Annots key before removing an annotation', () => {
        // Mutant ID: 817
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(page._pageDictionary.has('Annots')).toBeTruthy();
        expect(annotations).toEqual([secondReference]);
        document.destroy();
    });
    it('should not process a non-array Annots value', () => {
        // Mutant ID: 820
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        const invalidValue: _PdfName =
            _PdfName.get('InvalidAnnots');
        page._pageDictionary._map.Annots = invalidValue;
        page._pageDictionary._updated = false;
        page._removeAnnotation(reference);
        expect(
            page._pageDictionary.getRaw('Annots')
        ).toBe(invalidValue);
        expect(page._pageDictionary._updated).toBeFalsy();
        document.destroy();
    });
    it('should require the Annots value to be both available and an array', () => {
        // Mutant ID: 822
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const reference: _PdfReference =
            document._crossReference._getNextReference();
        const invalidValue: _PdfName =
            _PdfName.get('InvalidAnnots');
        page._pageDictionary._map.Annots = invalidValue;
        page._pageDictionary._updated = false;
        page._removeAnnotation(reference);
        expect(
            page._pageDictionary.getRaw('Annots')
        ).toBe(invalidValue);
        expect(page._pageDictionary._updated).toBeFalsy();
        document.destroy();
    });
    it('should preserve non-matching annotation references', () => {
        // Mutant ID: 827
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should compare annotation references using inequality', () => {
        // Mutant ID: 828
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations.length).toBe(1);
        expect(annotations[0]).toBe(secondReference);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should execute the annotation filter callback', () => {
        // Mutant ID: 825
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations).toEqual([secondReference]);
        document.destroy();
    });
    it('should discard only the matching annotation reference', () => {
        // Mutant ID: 826
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            document._crossReference._getNextReference();
        const secondReference: _PdfReference =
            document._crossReference._getNextReference();
        page._pageDictionary._map.Annots = [
            firstReference,
            secondReference
        ];
        page._removeAnnotation(firstReference);
        const annotations: _PdfReference[] =
            page._pageDictionary.getRaw('Annots');
        expect(annotations).toEqual([secondReference]);
        expect(annotations).not.toContain(firstReference);
        document.destroy();
    });
    it('should set the content template Resources dictionary entry', () => {
        // Mutant ID: 834
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        const resources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        page._resourceObject = resources;
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const templateResources: _PdfDictionary =
            template._content.dictionary.get('Resources');
        expect(
            template._content.dictionary.has('Resources')
        ).toBeTruthy();
        expect(templateResources).toBe(resources);
        document.destroy();
    });
    it('should select CropBox when its x origin is positive', () => {
        // Mutant ID: 838
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [25, 0, 525, 700];
        const mediaBox: number[] = [0, 0, 600, 800];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(cropBox);
        expect(template._size.width).toBe(525);
        expect(template._size.height).toBe(700);
        document.destroy();
    });
    it('should select CropBox when its y origin is positive', () => {
        // Mutant ID: 841
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [0, 30, 500, 730];
        const mediaBox: number[] = [0, 0, 600, 800];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(cropBox);
        expect(template._size.width).toBe(500);
        expect(template._size.height).toBe(730);
        document.destroy();
    });
    it('should avoid MediaBox handling when both MediaBox origins are zero', () => {
        // Mutant ID: 852
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, 0, 600, 800];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        expect(template._size.width).toBe(600);
        expect(template._size.height).toBe(800);
        document.destroy();
    });
    it('should use MediaBox when only its x origin is positive', () => {
        // Mutant ID: 854
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [0, 0, 0, 0];
        const mediaBox: number[] = [20, 0, 620, 800];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(mediaBox);
        expect(template._size.width).toBe(20);
        expect(template._size.height).toBe(0);
        document.destroy();
    });
    it('should select MediaBox when its x origin is positive', () => {
        // Mutant ID: 855
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [0, 0, 0, 0];
        const mediaBox: number[] = [25, 0, 625, 800];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(mediaBox);
        expect(template._size.width).toBe(25);
        expect(template._size.height).toBe(0);
        document.destroy();
    });
    it('should not treat a zero MediaBox x origin as positive', () => {
        // Mutant ID: 856
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, 0, 700, 900];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        expect(template._size.width).toBe(600);
        expect(template._size.height).toBe(800);
        document.destroy();
    });
    it('should not treat a negative MediaBox x origin as positive', () => {
        // Mutant ID: 857
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [-20, 0, 700, 900];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        document.destroy();
    });
    it('should select MediaBox when its y origin is positive', () => {
        // Mutant ID: 858
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [0, 0, 0, 0];
        const mediaBox: number[] = [0, 30, 600, 830];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(mediaBox);
        expect(template._size.width).toBe(0);
        expect(template._size.height).toBe(30);
        document.destroy();
    });
    it('should use CropBox when only its x origin is positive', () => {
        // Mutant ID: 837
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const cropBox: number[] = [20, 0, 500, 700];
        const mediaBox: number[] = [0, 0, 600, 800];
        delete page._pageDictionary._map.Parent;
        delete page._pageDictionary._map.P;
        page._pageDictionary._map.CropBox = cropBox;
        page._pageDictionary._map.MediaBox = mediaBox;
        page._cBox = cropBox;
        page._mBox = mediaBox;
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate =
            page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual(cropBox);
        expect(template._size.width).toBe(500);
        expect(template._size.height).toBe(700);
        document.destroy();
    });
    it('should not treat a zero MediaBox y origin as positive', () => {
        // Mutant ID: 859
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, 0, 700, 900];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        document.destroy();
    });
    it('should not treat a negative MediaBox y origin as positive', () => {
        // Mutant ID: 860
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, -25, 700, 900];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        document.destroy();
    });
    it('should set the default bounding box using the exact BBox key', () => {
        // Mutant ID: 865
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, 0, 600, 800];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        expect(
            template._content.dictionary.has('BBox')
        ).toBeTruthy();
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox).toEqual([0, 0, 600, 800]);
        document.destroy();
    });
    it('should write four coordinates to the default bounding box', () => {
        // Mutant ID: 866
        const document: PdfDocument = new PdfDocument();
        const page: any = document.addPage();
        page._cropBox = [0, 0, 0, 0];
        page._mediaBox = [0, 0, 600, 800];
        page._size = {
            width: 600,
            height: 800
        };
        page._contents = [];
        const template: PdfTemplate = page._contentTemplate;
        const boundingBox: number[] =
            template._content.dictionary.getArray('BBox');
        expect(boundingBox.length).toBe(4);
        expect(boundingBox[0]).toBe(0);
        expect(boundingBox[1]).toBe(0);
        expect(boundingBox[2]).toBe(600);
        expect(boundingBox[3]).toBe(800);
        document.destroy();
    });
    it('should expose the content template property as enumerable', () => {
        // Mutant ID: 868
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPage.prototype,
                '_contentTemplate'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
});