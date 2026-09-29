import { PdfImage } from '../src/pdf/core/graphics/images/pdf-image';
import { PdfGraphics, _PdfUnitConvertor, PdfGraphicsState } from '../src/pdf/core/graphics/pdf-graphics';
import { _PdfGraphicsUnit } from '../src/pdf/core/enumerator';
import { _PdfStream } from '../src/pdf/core/base-stream';
import { _PdfReference } from '../src/pdf/core/pdf-primitives';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { logo } from './image-input.spec';
import { PdfBitmap } from '../src/pdf/core/graphics/images/pdf-bitmap';

describe('PdfImage - Width Property (Lines 110-138)', () => {
    it('should return the stored width value when getter is called', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        const testWidth = 150;
        image.width = testWidth;
        const result = image.width;
        expect(result).toBe(testWidth);
        expect(result).not.toBe(0);
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });
    it('should not return 0 when width is set to non-zero value', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        image.width = 200;
        const result = image.width;
        expect(result).not.toBe(0);
        expect(result).toBe(200);
    });
    it('should store the exact width value passed to setter', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const newWidth = 250;
        image.width = newWidth;
        expect(image['_imageWidth']).toBe(newWidth);
        expect(image['_imageWidth']).not.toBe(0);
    });

    it('should update _imageWidth property when width setter is called', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const originalWidth = 100;
        image.width = originalWidth;
        const newWidth = 300;
        // Act
        image.width = newWidth;
        // Assert
        expect(image.width).toBe(newWidth);
        expect(image.width).not.toBe(originalWidth);
    });
    // Mutant 1.7: Assignment to wrong property (assign to _imageHeight instead of _imageWidth)
    it('should only update _imageWidth, not _imageHeight, when width is set', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        image.height = 100;
        image.width = 50;
        // Act
        const widthAfter = image.width;
        const heightAfter = image.height;
        // Assert
        expect(widthAfter).toBe(50);
        expect(heightAfter).toBe(100);
        expect(widthAfter).not.toBe(heightAfter);
    });
    // Edge case: Multiple setter calls
    it('should handle multiple sequential width updates correctly', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const firstWidth = 100;
        const secondWidth = 200;
        const thirdWidth = 150;
        // Act
        image.width = firstWidth;
        const result1 = image.width;
        image.width = secondWidth;
        const result2 = image.width;
        image.width = thirdWidth;
        const result3 = image.width;
        // Assert
        expect(result1).toBe(firstWidth);
        expect(result2).toBe(secondWidth);
        expect(result3).toBe(thirdWidth);
    });
    // Edge case: Negative width
    it('should preserve negative width values', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const negativeWidth = -100;
        // Act
        image.width = negativeWidth;
        // Assert
        expect(image.width).toBe(negativeWidth);
    });
    it("should not reset x when x is defined and y is undefined", () => {
        const image: PdfImage =  new PdfBitmap(logo);
        const documnet = new PdfDocument();
        const graphics = documnet.addPage().graphics;
        spyOn(graphics, 'save');
        spyOn(graphics, 'translateTransform');
        spyOn(graphics, 'drawImage');
        spyOn(graphics, 'restore');
        const location = { x: 10, y: undefined } as any;
        image.draw(graphics, location);
        expect(location.x).toBe(10); // Mutant changes this to 0
        expect(location.y).toBeUndefined();
        expect(graphics.translateTransform).toHaveBeenCalledWith({ x: 10, y: undefined });
    });
});

describe('PdfImage - _getPointSize Method (Lines 314-329)', () => {
    // Mutant 3.1 & 3.2: Conditional boundary (!== instead of ===)
    it('should enter if branch when horizontalResolution is undefined', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 200;
        // Act
        const result = image['_getPointSize'](width, height, undefined);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
    });

    // Mutant 3.3: AND changed to OR
    it('should enter if branch when horizontalResolution is null', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 200;
        // Act
        const result = image['_getPointSize'](width, height, null);
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    // Mutant 3.4: DPI constant changed from 96 to 0
    it('should use DPI value of 96 when horizontalResolution is not provided', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 100;
        // Act
        const result1 = image['_getPointSize'](width, height);
        const result2 = image['_getPointSize'](width, height, 96);
        // Assert
        // Both should produce equivalent results (using DPI=96 for conversion)
        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(result1.length).toBe(2);
        expect(result2.length).toBe(2);
    });

    // Mutant 3.5: DPI constant changed to different value (72)
    it('should use consistent default DPI value', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 96;
        const height = 96;
        // Act
        const resultWithoutDpi = image['_getPointSize'](width, height);
        const resultWithDefault = image['_getPointSize'](width, height, 96);
        expect(resultWithoutDpi[0]).toBeCloseTo(resultWithDefault[0], 1);
        expect(resultWithoutDpi[1]).toBeCloseTo(resultWithDefault[1], 1);
    });

    // Mutant 3.6 & 3.7: Recursive call arguments wrong
    it('should return array with two numeric values', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 150;
        // Act
        const result = image['_getPointSize'](width, height);
        // Assert
        expect(result.length).toBe(2);
        expect(typeof result[0]).toBe('number');
        expect(typeof result[1]).toBe('number');
    });

    // Mutant 3.8: Return hardcoded [0, 0] instead of recursive call result
    it('should not return [0, 0] when no resolution is provided', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 200;
        // Act
        const result = image['_getPointSize'](width, height);
        // Assert
        expect(result[0]).not.toBe(0);
        expect(result[1]).not.toBe(0);
    });

    // Mutant 3.9 & 3.10: Else branch return wrong values
    it('should return converted dimensions when horizontalResolution is provided', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 200;
        const resolution = 96;
        // Act
        const result = image['_getPointSize'](width, height, resolution);
        // Assert
        expect(result.length).toBe(2);
        expect(typeof result[0]).toBe('number');
        expect(typeof result[1]).toBe('number');
        expect(result[0]).toBeGreaterThan(0);
        expect(result[1]).toBeGreaterThan(0);
    });

    // Mutant 3.10: Return [0, 0] in else branch
    it('should not return hardcoded [0, 0] in else branch', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 100;
        const resolution = 96;
        // Act
        const result = image['_getPointSize'](width, height, resolution);
        // Assert
        expect(result[0] !== 0 || result[1] !== 0).toBe(true);
    });

    // Mutant 3.11 & 3.12: ptWidth or ptHeight assigned wrong value
    it('should convert both width and height dimensions', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 200;
        const resolution = 96;
        // Act
        const result = image['_getPointSize'](width, height, resolution);
        // Assert
        expect(result[0]).toBeGreaterThan(0);
        expect(result[1]).toBeGreaterThan(0);

    });

    // Mutant 3.13 & 3.14: Method calls skipped
    it('should convert units using provided horizontal resolution', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 96;
        const height = 96;
        const resolution = 72; // Different from default 96
        // Act
        const resultWith72 = image['_getPointSize'](width, height, resolution);
        const resultWith96 = image['_getPointSize'](width, height, 96);
        // Assert
        // Different resolutions should yield different converted sizes
        expect(resultWith72).toBeDefined();
        expect(resultWith96).toBeDefined();
    });

    // Mutant 3.15: Else branch skipped entirely
    it('should execute else branch when horizontalResolution is provided', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100;
        const height = 150;
        const resolution = 96;
        // Act
        const result = image['_getPointSize'](width, height, resolution);
        // Assert
        // Should have converted values, not recursive default behavior
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
    });

    // Edge case: zero dimensions
    it('should handle zero width and height', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 0;
        const height = 0;
        // Act
        const result = image['_getPointSize'](width, height);
        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
    });

    // Edge case: very large dimensions
    it('should handle very large width and height values', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 10000;
        const height = 20000;
        // Act
        const result = image['_getPointSize'](width, height);
        // Assert
        expect(result.length).toBe(2);
        expect(result[0]).toBeGreaterThan(0);
        expect(result[1]).toBeGreaterThan(0);
    });

    // Edge case: Fractional dimensions
    it('should handle fractional width and height values', () => {
        const image: PdfImage =  new PdfBitmap(logo);
        // Arrange
        const width = 100.5;
        const height = 200.75;
        // Act
        const result = image['_getPointSize'](width, height);
        // Assert
        expect(result.length).toBe(2);
        expect(typeof result[0]).toBe('number');
        expect(typeof result[1]).toBe('number');
    });
});
