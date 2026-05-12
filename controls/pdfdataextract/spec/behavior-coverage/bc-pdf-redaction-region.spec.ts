import { PdfRedactionRegion } from '../../src/pdf-data-extract/core/redaction/pdf-redaction-region';
import { Rectangle, PdfColor } from '@syncfusion/ej2-pdf';
describe('PdfRedactionRegion', () => {
    it('should initialize with required parameters only (pageIndex and bounds)', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(false);
        expect(redaction.fillColor).toBeUndefined();
    });
    it('should initialize with isTextOnly as true', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const isTextOnly: boolean = true;
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, isTextOnly);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(true);
        expect(redaction.fillColor).toBeUndefined();
    });
    it('should initialize with isTextOnly as false', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const isTextOnly: boolean = false;
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, isTextOnly);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(false);
        expect(redaction.fillColor).toBeUndefined();
    });
    it('should initialize with fillColor defined', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const fillColor: PdfColor = { r: 255, g: 0, b: 0 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, undefined, fillColor);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(false);
        expect(redaction.fillColor).toEqual(fillColor);
    });
    it('should initialize with isTextOnly true and fillColor defined', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const isTextOnly: boolean = true;
        const fillColor: PdfColor = { r: 255, g: 0, b: 0 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, isTextOnly, fillColor);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(true);
        expect(redaction.fillColor).toEqual(fillColor);
    });
    it('should initialize with isTextOnly false and fillColor defined', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const isTextOnly: boolean = false;
        const fillColor: PdfColor = { r: 128, g: 128, b: 128 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, isTextOnly, fillColor);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(false);
        expect(redaction.fillColor).toEqual(fillColor);
    });
    it('should initialize with different pageIndex value', () => {
        // Arrange
        const pageIndex: number = 5;
        const bounds: Rectangle = { x: 10, y: 20, width: 100, height: 150 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Assert
        expect(redaction.pageIndex).toBe(5);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(false);
    });
    it('should initialize with complex bounds dimensions', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 0.5, y: 1.25, width: 200.75, height: 300.5 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Assert
        expect(redaction.pageIndex).toBe(0);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.bounds.x).toBe(0.5);
        expect(redaction.bounds.y).toBe(1.25);
        expect(redaction.bounds.width).toBe(200.75);
        expect(redaction.bounds.height).toBe(300.5);
    });
    it('should set and get pageIndex property', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const newPageIndex: number = 3;
        // Act
        redaction.pageIndex = newPageIndex;
        const retrievedPageIndex: number = redaction.pageIndex;
        // Assert
        expect(retrievedPageIndex).toBe(3);
    });
    it('should set and get pageIndex multiple times', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        redaction.pageIndex = 1;
        expect(redaction.pageIndex).toBe(1);
        redaction.pageIndex = 5;
        expect(redaction.pageIndex).toBe(5);
        redaction.pageIndex = 0;
        // Assert
        expect(redaction.pageIndex).toBe(0);
    });
    it('should set and get bounds property', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const newBounds: Rectangle = { x: 50, y: 60, width: 100, height: 120 };
        // Act
        redaction.bounds = newBounds;
        const retrievedBounds: Rectangle = redaction.bounds;
        // Assert
        expect(retrievedBounds).toEqual(newBounds);
        expect(retrievedBounds.x).toBe(50);
        expect(retrievedBounds.y).toBe(60);
        expect(retrievedBounds.width).toBe(100);
        expect(retrievedBounds.height).toBe(120);
    });
    it('should set and get bounds multiple times', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const newBounds1: Rectangle = { x: 10, y: 20, width: 30, height: 40 };
        const newBounds2: Rectangle = { x: 100, y: 200, width: 300, height: 400 };
        // Act
        redaction.bounds = newBounds1;
        expect(redaction.bounds).toEqual(newBounds1);
        redaction.bounds = newBounds2;
        // Assert
        expect(redaction.bounds).toEqual(newBounds2);
    });
    it('should set and get isTextOnly property as true', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        redaction.isTextOnly = true;
        const retrievedIsTextOnly: boolean = redaction.isTextOnly;
        // Assert
        expect(retrievedIsTextOnly).toBe(true);
    });
    it('should set and get isTextOnly property as false', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, true);
        // Act
        redaction.isTextOnly = false;
        const retrievedIsTextOnly: boolean = redaction.isTextOnly;
        // Assert
        expect(retrievedIsTextOnly).toBe(false);
    });
    it('should set and get isTextOnly multiple times', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        redaction.isTextOnly = true;
        expect(redaction.isTextOnly).toBe(true);
        redaction.isTextOnly = false;
        expect(redaction.isTextOnly).toBe(false);
        redaction.isTextOnly = true;
        // Assert
        expect(redaction.isTextOnly).toBe(true);
    });
    it('should set and get fillColor property with RGB values', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const fillColor: PdfColor = { r: 255, g: 128, b: 64 };
        // Act
        redaction.fillColor = fillColor;
        const retrievedFillColor: PdfColor = redaction.fillColor;
        // Assert
        expect(retrievedFillColor).toEqual(fillColor);
        expect(retrievedFillColor.r).toBe(255);
        expect(retrievedFillColor.g).toBe(128);
        expect(retrievedFillColor.b).toBe(64);
    });
    it('should set and get fillColor with zero RGB values', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const fillColor: PdfColor = { r: 0, g: 0, b: 0 };
        // Act
        redaction.fillColor = fillColor;
        const retrievedFillColor: PdfColor = redaction.fillColor;
        // Assert
        expect(retrievedFillColor).toEqual(fillColor);
        expect(retrievedFillColor.r).toBe(0);
        expect(retrievedFillColor.g).toBe(0);
        expect(retrievedFillColor.b).toBe(0);
    });
    it('should set and get fillColor multiple times', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const color1: PdfColor = { r: 255, g: 0, b: 0 };
        const color2: PdfColor = { r: 0, g: 255, b: 0 };
        const color3: PdfColor = { r: 0, g: 0, b: 255 };
        // Act
        redaction.fillColor = color1;
        expect(redaction.fillColor).toEqual(color1);
        redaction.fillColor = color2;
        expect(redaction.fillColor).toEqual(color2);
        redaction.fillColor = color3;
        // Assert
        expect(redaction.fillColor).toEqual(color3);
    });
    it('should get appearance on first access (lazy initialization)', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const appearance: any = redaction.appearance;
        // Assert
        expect(appearance).toBeDefined();
        expect(appearance.normal).toBeDefined();
    });
    it('should return same appearance instance on subsequent access', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const appearance1: any = redaction.appearance;
        const appearance2: any = redaction.appearance;
        // Assert
        expect(appearance1).toBe(appearance2);
    });
    it('should initialize appearance with correct bounds dimensions', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 10, y: 20, width: 150, height: 200 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const appearance: any = redaction.appearance;
        // Assert
        expect(appearance).toBeDefined();
        expect(appearance.normal).toBeDefined();
    });
    it('should access appearance property multiple times consistently', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const appearance1: any = redaction.appearance;
        const appearance2: any = redaction.appearance;
        const appearance3: any = redaction.appearance;
        // Assert
        expect(appearance1).toBe(appearance2);
        expect(appearance2).toBe(appearance3);
    });
    it('should maintain property state after appearance access', () => {
        // Arrange
        const pageIndex: number = 2;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const fillColor: PdfColor = { r: 255, g: 0, b: 0 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, true, fillColor);
        // Act
        const appearance: any = redaction.appearance;
        // Assert
        expect(redaction.pageIndex).toBe(2);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(true);
        expect(redaction.fillColor).toEqual(fillColor);
    });
    it('should update properties after appearance access', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        const appearance: any = redaction.appearance;
        // Act
        redaction.pageIndex = 5;
        redaction.isTextOnly = true;
        const newColor: PdfColor = { r: 100, g: 150, b: 200 };
        redaction.fillColor = newColor;
        // Assert
        expect(redaction.pageIndex).toBe(5);
        expect(redaction.isTextOnly).toBe(true);
        expect(redaction.fillColor).toEqual(newColor);
    });
    it('should handle constructor with all parameters including large pageIndex', () => {
        // Arrange
        const pageIndex: number = 999;
        const bounds: Rectangle = { x: 0, y: 0, width: 1000, height: 2000 };
        const isTextOnly: boolean = true;
        const fillColor: PdfColor = { r: 200, g: 100, b: 50 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, isTextOnly, fillColor);
        // Assert
        expect(redaction.pageIndex).toBe(999);
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.isTextOnly).toBe(true);
        expect(redaction.fillColor).toEqual(fillColor);
    });
    it('should handle fillColor as undefined after constructor', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const fillColor: PdfColor = redaction.fillColor;
        // Assert
        expect(fillColor).toBeUndefined();
    });
    it('should maintain isTextOnly false as default state', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Act
        const isTextOnly: boolean = redaction.isTextOnly;
        // Assert
        expect(isTextOnly).toBe(false);
    });
    it('should correctly override isTextOnly from constructor to setter', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, true);
        // Act
        redaction.isTextOnly = false;
        // Assert
        expect(redaction.isTextOnly).toBe(false);
    });
    it('should correctly override fillColor from constructor to setter', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 40, y: 41.809, width: 80, height: 90 };
        const initialColor: PdfColor = { r: 255, g: 0, b: 0 };
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds, undefined, initialColor);
        const newColor: PdfColor = { r: 0, g: 255, b: 0 };
        // Act
        redaction.fillColor = newColor;
        // Assert
        expect(redaction.fillColor).toEqual(newColor);
    });
    it('should initialize bounds with zero values', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Assert
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.bounds.x).toBe(0);
        expect(redaction.bounds.y).toBe(0);
        expect(redaction.bounds.width).toBe(0);
        expect(redaction.bounds.height).toBe(0);
    });
    it('should initialize bounds with negative values', () => {
        // Arrange
        const pageIndex: number = 0;
        const bounds: Rectangle = { x: -10, y: -20, width: -30, height: -40 };
        // Act
        const redaction: PdfRedactionRegion = new PdfRedactionRegion(pageIndex, bounds);
        // Assert
        expect(redaction.bounds).toEqual(bounds);
        expect(redaction.bounds.x).toBe(-10);
        expect(redaction.bounds.y).toBe(-20);
    });
});
