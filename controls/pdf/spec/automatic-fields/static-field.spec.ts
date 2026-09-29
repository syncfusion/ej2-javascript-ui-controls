import { PdfFont, PdfFontFamily, PdfStandardFont } from "../../src/pdf/core/fonts/pdf-standard-font";
import { PdfStringFormat } from "../../src/pdf/core/fonts/pdf-string-format";
import { PdfAutomaticField } from "../../src/pdf/core/graphics/automatic-fields/automatic-field";
import { PdfStaticField } from "../../src/pdf/core/graphics/automatic-fields/static-field";
import { PdfBrush, PdfGraphics } from "../../src/pdf/core/graphics/pdf-graphics";
import { PdfTemplate } from "../../src/pdf/core/graphics/pdf-template";
import { Point, Rectangle, Size } from "../../src/pdf/core/pdf-type";
describe('982023 PdfStaticField survived mutants', () => {
    it('982023 - should initialize hasRendered as false', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        expect(field._hasRendered).toBe(false);
        expect(field._hasRendered).toBeFalsy();
    });
    it('982023 - should return exact empty string from _getValue', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        const graphics: PdfGraphics = {} as PdfGraphics;
        const result: string = field._getValue(graphics);
        expect(result).toBe('');
        expect(result.length).toBe(0);
        expect(result).not.toBe('Stryker was here!');
    });
    it('982023 - should draw cached template at location with current size', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        const existingTemplate: PdfTemplate = new PdfTemplate({
            x: 0,
            y: 0,
            width: 40,
            height: 10
        });
        const currentSize: Size = { width: 140, height: 36 };
        const location: Point = { x: 21, y: 42 };
        let drawnTemplate: PdfTemplate;
        let drawnBounds: Rectangle;
        field._template = existingTemplate;
        field._obtainSize = (): Size => {
            return currentSize;
        };
        const graphics: PdfGraphics = {
            drawTemplate: (template: PdfTemplate, bounds: Rectangle): void => {
                drawnTemplate = template;
                drawnBounds = bounds;
            }
        } as PdfGraphics;
        field._performDraw(graphics, location);
        expect(drawnTemplate).toBe(existingTemplate);
        expect(field._template).toBe(existingTemplate);
        expect(drawnBounds).toBeDefined();
        expect(drawnBounds.x).toBe(21);
        expect(drawnBounds.y).toBe(42);
        expect(drawnBounds.width).toBe(140);
        expect(drawnBounds.height).toBe(36);
    });
});
describe('982023 PdfStaticField survived mutants', () => {
    it('982023 - should create and store template when template is undefined', () => {
        class TestField extends PdfStaticField {
            _getValue(_graphics: PdfGraphics): string {
                return 'Static field value';
            }
        }
        const field: TestField = new TestField();
        const expectedSize: Size = { width: 120, height: 30 };
        const location: Point = { x: 15, y: 25 };
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const drawnTemplates: PdfTemplate[] = [];
        const drawnBounds: Rectangle[] = [];
        let valueCallCount: number = 0;
        let fontCallCount: number = 0;
        let brushCallCount: number = 0;
        let sizeCallCount: number = 0;
        field._bounds = { x: 0, y: 0, width: expectedSize.width, height: expectedSize.height };
        field._template = undefined;
        field._getValue = (_graphics: PdfGraphics): string => {
            valueCallCount++;
            return 'Static field value';
        };
        field._obtainFont = (): PdfFont => {
            fontCallCount++;
            return font;
        };
        field._obtainBrush = (): PdfBrush => {
            brushCallCount++;
            return brush;
        };
        field._obtainSize = (): Size => {
            sizeCallCount++;
            return expectedSize;
        };
        const graphics: PdfGraphics = {
            drawTemplate: (template: PdfTemplate, bounds: Rectangle): void => {
                drawnTemplates.push(template);
                drawnBounds.push(bounds);
            }
        } as PdfGraphics;
        field._performDraw(graphics, location);
        expect(field._template).toBeDefined();
        expect(field._template instanceof PdfTemplate).toBe(true);
        expect(field._template.size.width).toBe(120);
        expect(field._template.size.height).toBe(30);
        expect(valueCallCount).toBe(1);
        expect(fontCallCount).toBe(1);
        expect(brushCallCount).toBe(1);
        expect(sizeCallCount).toBe(2);
        expect(drawnTemplates.length).toBe(1);
        expect(drawnTemplates[0]).toBe(field._template);
        expect(drawnBounds.length).toBe(1);
        expect(drawnBounds[0].x).toBe(15);
        expect(drawnBounds[0].y).toBe(25);
        expect(drawnBounds[0].width).toBe(120);
        expect(drawnBounds[0].height).toBe(30);
    });
    it('982023 - should use the exact template rectangle dimensions', () => {
        class TestField extends PdfStaticField {
            _getValue(_graphics: PdfGraphics): string {
                return 'Template dimensions';
            }
        }
        const field: TestField = new TestField();
        const expectedSize: Size = { width: 95, height: 27 };
        const location: Point = { x: 8, y: 14 };
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        let drawnBounds: Rectangle;
        field._bounds = { x: 0, y: 0, width: expectedSize.width, height: expectedSize.height };
        field._obtainFont = (): PdfFont => font;
        field._obtainBrush = (): PdfBrush => brush;
        field._obtainSize = (): Size => expectedSize;
        const graphics: PdfGraphics = {
            drawTemplate: (_template: PdfTemplate, bounds: Rectangle): void => {
                drawnBounds = bounds;
            }
        } as PdfGraphics;
        field._performDraw(graphics, location);
        const templateSize: Size = field._template.size;
        const templateBounds: number[] = field._template._content.dictionary.getArray('BBox');
        expect(field._template).toBeDefined();
        expect(templateSize.width).toBe(95);
        expect(templateSize.height).toBe(27);
        expect(templateBounds.length).toBe(4);
        expect(templateBounds[0]).toBe(0);
        expect(templateBounds[1]).toBe(0);
        expect(templateBounds[2]).toBe(95);
        expect(templateBounds[3]).toBe(27);
        expect(drawnBounds.x).toBe(8);
        expect(drawnBounds.y).toBe(14);
        expect(drawnBounds.width).toBe(95);
        expect(drawnBounds.height).toBe(27);
    });
    it('982023 - should reuse existing template without recreating template content', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        const existingTemplate: PdfTemplate = new PdfTemplate({ x: 0, y: 0, width: 80, height: 20 });
        const expectedSize: Size = { width: 80, height: 20 };
        const location: Point = { x: 30, y: 40 };
        const drawnTemplates: PdfTemplate[] = [];
        const drawnBounds: Rectangle[] = [];
        let valueCallCount: number = 0;
        let fontCallCount: number = 0;
        let brushCallCount: number = 0;
        let sizeCallCount: number = 0;
        field._bounds = { x: 0, y: 0, width: expectedSize.width, height: expectedSize.height };
        field._template = existingTemplate;
        field._getValue = (_graphics: PdfGraphics): string => {
            valueCallCount++;
            return 'Unexpected value';
        };
        field._obtainFont = (): PdfFont => {
            fontCallCount++;
            return new PdfStandardFont(PdfFontFamily.helvetica, 10);
        };
        field._obtainBrush = (): PdfBrush => {
            brushCallCount++;
            return new PdfBrush({ r: 0, g: 0, b: 0 });
        };
        field._obtainSize = (): Size => {
            sizeCallCount++;
            return expectedSize;
        };
        const graphics: PdfGraphics = {
            drawTemplate: (template: PdfTemplate, bounds: Rectangle): void => {
                drawnTemplates.push(template);
                drawnBounds.push(bounds);
            }
        } as PdfGraphics;
        field._performDraw(graphics, location);
        expect(field._template).toBe(existingTemplate);
        expect(valueCallCount).toBe(0);
        expect(fontCallCount).toBe(0);
        expect(brushCallCount).toBe(0);
        expect(sizeCallCount).toBe(1);
        expect(drawnTemplates.length).toBe(1);
        expect(drawnTemplates[0]).toBe(existingTemplate);
        expect(drawnBounds.length).toBe(1);
        expect(drawnBounds[0].x).toBe(30);
        expect(drawnBounds[0].y).toBe(40);
        expect(drawnBounds[0].width).toBe(80);
        expect(drawnBounds[0].height).toBe(20);
    });
    it('982023 - should cache generated template across repeated draws', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        const expectedSize: Size = { width: 70, height: 18 };
        const firstLocation: Point = { x: 10, y: 20 };
        const secondLocation: Point = { x: 35, y: 45 };
        const font: PdfFont = new PdfStandardFont(PdfFontFamily.helvetica, 10);
        const brush: PdfBrush = new PdfBrush({ r: 0, g: 0, b: 0 });
        const drawnTemplates: PdfTemplate[] = [];
        const drawnBounds: Rectangle[] = [];
        let valueCallCount: number = 0;
        let fontCallCount: number = 0;
        let brushCallCount: number = 0;
        let sizeCallCount: number = 0;
        field._bounds = { x: 0, y: 0, width: expectedSize.width, height: expectedSize.height };
        field._getValue = (_graphics: PdfGraphics): string => {
            valueCallCount++;
            return 'Cached value';
        };
        field._obtainFont = (): PdfFont => {
            fontCallCount++;
            return font;
        };
        field._obtainBrush = (): PdfBrush => {
            brushCallCount++;
            return brush;
        };
        field._obtainSize = (): Size => {
            sizeCallCount++;
            return expectedSize;
        };
        const graphics: PdfGraphics = {
            drawTemplate: (template: PdfTemplate, bounds: Rectangle): void => {
                drawnTemplates.push(template);
                drawnBounds.push(bounds);
            }
        } as PdfGraphics;
        field._performDraw(graphics, firstLocation);
        const generatedTemplate: PdfTemplate = field._template;
        field._performDraw(graphics, secondLocation);
        expect(generatedTemplate).toBeDefined();
        expect(generatedTemplate instanceof PdfTemplate).toBe(true);
        expect(field._template).toBe(generatedTemplate);
        expect(valueCallCount).toBe(1);
        expect(fontCallCount).toBe(1);
        expect(brushCallCount).toBe(1);
        expect(sizeCallCount).toBe(3);
        expect(drawnTemplates.length).toBe(2);
        expect(drawnTemplates[0]).toBe(generatedTemplate);
        expect(drawnTemplates[1]).toBe(generatedTemplate);
        expect(drawnBounds.length).toBe(2);
        expect(drawnBounds[0].x).toBe(10);
        expect(drawnBounds[0].y).toBe(20);
        expect(drawnBounds[0].width).toBe(70);
        expect(drawnBounds[0].height).toBe(18);
        expect(drawnBounds[1].x).toBe(35);
        expect(drawnBounds[1].y).toBe(45);
        expect(drawnBounds[1].width).toBe(70);
        expect(drawnBounds[1].height).toBe(18);
    });
});
describe('982023 PdfStaticField survived mutants', () => {
    it('982023 - should initialize PdfStaticField with inherited state', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        expect(field).toBeDefined();
        expect(field instanceof TestField).toBe(true);
        expect(field instanceof PdfStaticField).toBe(true);
        expect(field instanceof PdfAutomaticField).toBe(true);
        expect(field._hasRendered).toBe(false);
        expect(field._hasRendered).toBeFalsy();
    });
    it('982023 - should forward font brush and string format to base initialization', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        const font: PdfFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const brush: PdfBrush = new PdfBrush({
            r: 20,
            g: 40,
            b: 60
        });
        const stringFormat: PdfStringFormat = new PdfStringFormat();
        field._initializeBase(font, brush, stringFormat);
        expect(field._font).toBe(font);
        expect(field._brush).toBe(brush);
        expect(field._stringFormat).toBe(stringFormat);
    });
    it('982023 - should draw template text using the exact text rectangle', () => {
        class TestField extends PdfStaticField {
            _getValue(_graphics: PdfGraphics): string {
                return 'Static field value';
            }
        }
        const field: TestField = new TestField();
        const expectedSize: Size = {
            width: 95,
            height: 27
        };
        const location: Point = {
            x: 8,
            y: 14
        };
        const font: PdfFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        const brush: PdfBrush = new PdfBrush({
            r: 0,
            g: 0,
            b: 0
        });
        const originalDrawString: any = PdfGraphics.prototype.drawString;
        let drawnValue: string;
        let drawnFont: PdfFont;
        let drawnTextBounds: Rectangle;
        let drawnBrush: PdfBrush;
        let drawnTemplate: PdfTemplate;
        let drawnTemplateBounds: Rectangle;
        let drawStringCallCount: number = 0;
        field._bounds = {
            x: 0,
            y: 0,
            width: expectedSize.width,
            height: expectedSize.height
        };
        field._obtainFont = (): PdfFont => {
            return font;
        };
        field._obtainBrush = (): PdfBrush => {
            return brush;
        };
        field._obtainSize = (): Size => {
            return expectedSize;
        };
        PdfGraphics.prototype.drawString = function (
            value: string,
            receivedFont: PdfFont,
            bounds: Rectangle,
            receivedBrush: PdfBrush
        ): void {
            drawStringCallCount++;
            drawnValue = value;
            drawnFont = receivedFont;
            drawnTextBounds = bounds;
            drawnBrush = receivedBrush;
        } as any;
        const graphics: PdfGraphics = {
            drawTemplate: (
                template: PdfTemplate,
                bounds: Rectangle
            ): void => {
                drawnTemplate = template;
                drawnTemplateBounds = bounds;
            }
        } as PdfGraphics;
        field._performDraw(graphics, location);
        PdfGraphics.prototype.drawString = originalDrawString;
        expect(drawStringCallCount).toBe(1);
        expect(drawnValue).toBe('Static field value');
        expect(drawnFont).toBe(font);
        expect(drawnBrush).toBe(brush);
        expect(drawnTextBounds).toBeDefined();
        expect(drawnTextBounds.x).toBe(0);
        expect(drawnTextBounds.y).toBe(0);
        expect(drawnTextBounds.width).toBe(95);
        expect(drawnTextBounds.height).toBe(27);
        expect(field._template).toBeDefined();
        expect(drawnTemplate).toBe(field._template);
        expect(drawnTemplateBounds.x).toBe(8);
        expect(drawnTemplateBounds.y).toBe(14);
        expect(drawnTemplateBounds.width).toBe(95);
        expect(drawnTemplateBounds.height).toBe(27);
    });
    it('982023 - should initialize hasRendered as false', () => {
        class TestField extends PdfStaticField { }
        const field: TestField = new TestField();
        expect(field instanceof TestField).toBe(true);
        expect(field instanceof PdfStaticField).toBe(true);
        expect(field instanceof PdfAutomaticField).toBe(true);
        expect(field._hasRendered).toBe(false);
    });
});
//----------------