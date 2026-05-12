import { _TextState, _GraphicState } from '../../src/pdf-data-extract/core/graphic-state';
import { PdfColor } from '@syncfusion/ej2-pdf';
describe('_TextState and _GraphicState', () => {
    // ============================================================================
    // _TextState Constructor Tests
    // ============================================================================
    it('should initialize _TextState with default identity matrix for CTM', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const expectedCtm: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const actualCtm: number[] = textState._ctm;
        // Assert
        expect(actualCtm).toEqual(expectedCtm);
        expect(actualCtm[0]).toBe(1);
        expect(actualCtm[1]).toBe(0);
        expect(actualCtm[2]).toBe(0);
        expect(actualCtm[3]).toBe(1);
        expect(actualCtm[4]).toBe(0);
        expect(actualCtm[5]).toBe(0);
    });
    it('should initialize _TextState with null fontName', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const fontName: string = textState._fontName;
        // Assert
        expect(fontName).toBeNull();
    });
    it('should initialize _TextState with fontSize 0', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const fontSize: number = textState._fontSize;
        // Assert
        expect(fontSize).toBe(0);
    });
    it('should initialize _TextState with null font', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const font: any = textState._font;
        // Assert
        expect(font).toBeNull();
    });
    it('should initialize _TextState with default font identity matrix', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const expectedFontMatrix: number[] = [0.001, 0, 0, 0.001, 0, 0];
        // Act
        const actualFontMatrix: number[] = textState._fontMatrix;
        // Assert
        expect(actualFontMatrix).toEqual(expectedFontMatrix);
        expect(actualFontMatrix[0]).toBe(0.001);
        expect(actualFontMatrix[1]).toBe(0);
        expect(actualFontMatrix[2]).toBe(0);
        expect(actualFontMatrix[3]).toBe(0.001);
        expect(actualFontMatrix[4]).toBe(0);
        expect(actualFontMatrix[5]).toBe(0);
    });
    it('should initialize _TextState with textMatrix as copy of identity matrix', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const expectedTextMatrix: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const actualTextMatrix: number[] = textState._textMatrix;
        // Assert
        expect(actualTextMatrix).toEqual(expectedTextMatrix);
        expect(actualTextMatrix).not.toBe(textState._identityMatrix);
    });
    it('should initialize _TextState with textLineMatrix as copy of identity matrix', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const expectedTextLineMatrix: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const actualTextLineMatrix: number[] = textState._textLineMatrix;
        // Assert
        expect(actualTextLineMatrix).toEqual(expectedTextLineMatrix);
        expect(actualTextLineMatrix).not.toBe(textState._identityMatrix);
    });
    it('should initialize _TextState with charSpacing 0', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const charSpacing: number = textState._charSpacing;
        // Assert
        expect(charSpacing).toBe(0);
    });
    it('should initialize _TextState with wordSpacing 0', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const wordSpacing: number = textState._wordSpacing;
        // Assert
        expect(wordSpacing).toBe(0);
    });
    it('should initialize _TextState with leading 0', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const leading: number = textState._leading;
        // Assert
        expect(leading).toBe(0);
    });
    it('should initialize _TextState with textHScale 1', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const textHScale: number = textState._textHScale;
        // Assert
        expect(textHScale).toBe(1);
    });
    it('should initialize _TextState with textRise 0', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        // Act
        const textRise: number = textState._textRise;
        // Assert
        expect(textRise).toBe(0);
    });
    // ============================================================================
    // _TextState._setTextMatrix Tests
    // ============================================================================
    it('should set text matrix with identity values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 1;
        const b: number = 0;
        const c: number = 0;
        const d: number = 1;
        const e: number = 0;
        const f: number = 0;
        // Act
        textState._setTextMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textMatrix[0]).toBe(a);
        expect(textState._textMatrix[1]).toBe(b);
        expect(textState._textMatrix[2]).toBe(c);
        expect(textState._textMatrix[3]).toBe(d);
        expect(textState._textMatrix[4]).toBe(e);
        expect(textState._textMatrix[5]).toBe(f);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });
    it('should set text matrix with translation values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 1;
        const b: number = 0;
        const c: number = 0;
        const d: number = 1;
        const e: number = 100;
        const f: number = 200;
        // Act
        textState._setTextMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textMatrix[0]).toBe(1);
        expect(textState._textMatrix[1]).toBe(0);
        expect(textState._textMatrix[2]).toBe(0);
        expect(textState._textMatrix[3]).toBe(1);
        expect(textState._textMatrix[4]).toBe(100);
        expect(textState._textMatrix[5]).toBe(200);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 100, 200]);
    });
    it('should set text matrix with scale values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 2;
        const b: number = 0;
        const c: number = 0;
        const d: number = 3;
        const e: number = 0;
        const f: number = 0;
        // Act
        textState._setTextMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textMatrix[0]).toBe(2);
        expect(textState._textMatrix[3]).toBe(3);
        expect(textState._textMatrix).toEqual([2, 0, 0, 3, 0, 0]);
    });
    it('should set text matrix with negative values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = -1;
        const b: number = -0.5;
        const c: number = -0.3;
        const d: number = -2;
        const e: number = -50;
        const f: number = -75;
        // Act
        textState._setTextMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textMatrix[0]).toBe(-1);
        expect(textState._textMatrix[1]).toBe(-0.5);
        expect(textState._textMatrix[2]).toBe(-0.3);
        expect(textState._textMatrix[3]).toBe(-2);
        expect(textState._textMatrix[4]).toBe(-50);
        expect(textState._textMatrix[5]).toBe(-75);
    });
    it('should set text matrix with decimal values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 0.866;
        const b: number = 0.5;
        const c: number = -0.5;
        const d: number = 0.866;
        const e: number = 10.5;
        const f: number = 20.3;
        // Act
        textState._setTextMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textMatrix[0]).toBe(0.866);
        expect(textState._textMatrix[1]).toBe(0.5);
        expect(textState._textMatrix[2]).toBe(-0.5);
        expect(textState._textMatrix[3]).toBe(0.866);
        expect(textState._textMatrix[4]).toBe(10.5);
        expect(textState._textMatrix[5]).toBe(20.3);
    });
    it('should overwrite previous text matrix values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 2, 3, 4, 5, 6);
        const oldMatrix: number[] = textState._textMatrix.slice();
        // Act
        textState._setTextMatrix(10, 20, 30, 40, 50, 60);
        // Assert
        expect(oldMatrix).toEqual([1, 2, 3, 4, 5, 6]);
        expect(textState._textMatrix).toEqual([10, 20, 30, 40, 50, 60]);
    });
    // ============================================================================
    // _TextState._setTextLineMatrix Tests
    // ============================================================================
    it('should set text line matrix with identity values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 1;
        const b: number = 0;
        const c: number = 0;
        const d: number = 1;
        const e: number = 0;
        const f: number = 0;
        // Act
        textState._setTextLineMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textLineMatrix[0]).toBe(a);
        expect(textState._textLineMatrix[1]).toBe(b);
        expect(textState._textLineMatrix[2]).toBe(c);
        expect(textState._textLineMatrix[3]).toBe(d);
        expect(textState._textLineMatrix[4]).toBe(e);
        expect(textState._textLineMatrix[5]).toBe(f);
        expect(textState._textLineMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });
    it('should set text line matrix with translation values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 1;
        const b: number = 0;
        const c: number = 0;
        const d: number = 1;
        const e: number = 50;
        const f: number = -12;
        // Act
        textState._setTextLineMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textLineMatrix).toEqual([1, 0, 0, 1, 50, -12]);
    });
    it('should set text line matrix with scale and rotation values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        const a: number = 1.5;
        const b: number = 0.2;
        const c: number = -0.3;
        const d: number = 1.6;
        const e: number = 15;
        const f: number = 25;
        // Act
        textState._setTextLineMatrix(a, b, c, d, e, f);
        // Assert
        expect(textState._textLineMatrix[0]).toBe(1.5);
        expect(textState._textLineMatrix[1]).toBe(0.2);
        expect(textState._textLineMatrix[2]).toBe(-0.3);
        expect(textState._textLineMatrix[3]).toBe(1.6);
        expect(textState._textLineMatrix[4]).toBe(15);
        expect(textState._textLineMatrix[5]).toBe(25);
    });
    // ============================================================================
    // _TextState._translateTextMatrix Tests
    // ============================================================================
    it('should translate text matrix with zero x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 0, 0, 1, 10, 20);
        const originalMatrix: number[] = textState._textMatrix.slice();
        // Act
        textState._translateTextMatrix(0, 0);
        // Assert
        expect(textState._textMatrix[4]).toBe(originalMatrix[4]);
        expect(textState._textMatrix[5]).toBe(originalMatrix[5]);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 10, 20]);
    });
    it('should translate text matrix with positive x translation', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextMatrix(5, 0);
        // Assert
        expect(textState._textMatrix[4]).toBe(5);
        expect(textState._textMatrix[5]).toBe(0);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 5, 0]);
    });
    it('should translate text matrix with positive y translation', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextMatrix(0, 10);
        // Assert
        expect(textState._textMatrix[4]).toBe(0);
        expect(textState._textMatrix[5]).toBe(10);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 0, 10]);
    });
    it('should translate text matrix with both positive x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextMatrix(15, 25);
        // Assert
        expect(textState._textMatrix[4]).toBe(15);
        expect(textState._textMatrix[5]).toBe(25);
        expect(textState._textMatrix).toEqual([1, 0, 0, 1, 15, 25]);
    });
    it('should translate text matrix with negative x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextMatrix(-8, -12);
        // Assert
        expect(textState._textMatrix[4]).toBe(-8);
        expect(textState._textMatrix[5]).toBe(-12);
    });
    it('should translate text matrix with scale matrix', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(2, 0, 0, 3, 0, 0);
        // Act
        textState._translateTextMatrix(5, 4);
        // Assert
        expect(textState._textMatrix[4]).toBe(10);
        expect(textState._textMatrix[5]).toBe(12);
        expect(textState._textMatrix).toEqual([2, 0, 0, 3, 10, 12]);
    });
    it('should translate text matrix with complex matrix values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(2, 1, 3, 4, 5, 6);
        // Act
        textState._translateTextMatrix(10, 20);
        // Assert
        const expectedE: number = 2 * 10 + 3 * 20 + 5;
        const expectedF: number = 1 * 10 + 4 * 20 + 6;
        expect(textState._textMatrix[4]).toBe(expectedE);
        expect(textState._textMatrix[5]).toBe(expectedF);
        expect(textState._textMatrix[4]).toBe(85);
        expect(textState._textMatrix[5]).toBe(96);
    });
    it('should translate text matrix with decimal values', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextMatrix(1.5, 0.5, 0.3, 1.2, 10, 20);
        // Act
        textState._translateTextMatrix(3.5, 2.5);
        // Assert
        const expectedE: number = 1.5 * 3.5 + 0.3 * 2.5 + 10;
        const expectedF: number = 0.5 * 3.5 + 1.2 * 2.5 + 20;
        expect(textState._textMatrix[4]).toBeCloseTo(expectedE, 5);
        expect(textState._textMatrix[5]).toBeCloseTo(expectedF, 5);
    });
    // ============================================================================
    // _TextState._translateTextLineMatrix Tests
    // ============================================================================
    it('should translate text line matrix with zero x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextLineMatrix(1, 0, 0, 1, 10, 20);
        // Act
        textState._translateTextLineMatrix(0, 0);
        // Assert
        expect(textState._textLineMatrix[4]).toBe(10);
        expect(textState._textLineMatrix[5]).toBe(20);
        expect(textState._textLineMatrix).toEqual([1, 0, 0, 1, 10, 20]);
    });
    it('should translate text line matrix with positive x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextLineMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextLineMatrix(7, 14);
        // Assert
        expect(textState._textLineMatrix[4]).toBe(7);
        expect(textState._textLineMatrix[5]).toBe(14);
    });
    it('should translate text line matrix with negative x and y', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextLineMatrix(1, 0, 0, 1, 0, 0);
        // Act
        textState._translateTextLineMatrix(-10, -15);
        // Assert
        expect(textState._textLineMatrix[4]).toBe(-10);
        expect(textState._textLineMatrix[5]).toBe(-15);
    });
    it('should translate text line matrix with scale matrix', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._setTextLineMatrix(2, 0, 0, 2.5, 0, 0);
        // Act
        textState._translateTextLineMatrix(4, 6);
        // Assert
        expect(textState._textLineMatrix[4]).toBe(8);
        expect(textState._textLineMatrix[5]).toBe(15);
    });
    // ============================================================================
    // _TextState._carriageReturn Tests
    // ============================================================================
    it('should perform carriage return with zero leading', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._leading = 0;
        textState._setTextLineMatrix(1, 0, 0, 1, 50, 100);
        textState._setTextMatrix(1, 0, 0, 1, 30, 80);
        // Act
        textState._carriageReturn();
        // Assert
        expect(textState._textLineMatrix[4]).toBe(50);
        expect(textState._textLineMatrix[5]).toBe(100);
        expect(textState._textMatrix[4]).toBe(50);
        expect(textState._textMatrix[5]).toBe(100);
    });
    it('should perform carriage return with positive leading', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._leading = 15;
        textState._setTextLineMatrix(1, 0, 0, 1, 0, 100);
        // Act
        textState._carriageReturn();
        // Assert
        expect(textState._textLineMatrix[5]).toBe(85);
        expect(textState._textMatrix).toEqual(textState._textLineMatrix);
    });
    it('should perform carriage return with negative leading', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._leading = -20;
        textState._setTextLineMatrix(1, 0, 0, 1, 0, 100);
        // Act
        textState._carriageReturn();
        // Assert
        expect(textState._textLineMatrix[5]).toBe(120);
        expect(textState._textMatrix).toEqual(textState._textLineMatrix);
    });
    it('should copy text line matrix to text matrix after carriage return', () => {
        // Arrange
        const textState: _TextState = new _TextState();
        textState._leading = 10;
        textState._setTextLineMatrix(2, 0, 0, 2, 40, 80);
        // Act
        textState._carriageReturn();
        // Assert
        expect(textState._textMatrix).toEqual(textState._textLineMatrix);
        expect(textState._textMatrix[0]).toBe(2);
        expect(textState._textMatrix[3]).toBe(2);
        expect(textState._textMatrix[4]).toBe(40);
        expect(textState._textMatrix[5]).toBe(60);
    });
    // ============================================================================
    // _TextState._clone Tests
    // ============================================================================
    it('should clone text state with copied arrays', () => {
        // Arrange
        const originalState: _TextState = new _TextState();
        originalState._setTextMatrix(2, 1, 3, 4, 100, 200);
        originalState._setTextLineMatrix(1, 0, 0, 1, 50, 75);
        originalState._fontMatrix = [0.002, 0, 0, 0.002, 0, 0];
        // Act
        const clonedState: any = originalState._clone();
        // Assert
        expect(clonedState._textMatrix).toEqual([2, 1, 3, 4, 100, 200]);
        expect(clonedState._textLineMatrix).toEqual([1, 0, 0, 1, 50, 75]);
        expect(clonedState._fontMatrix).toEqual([0.002, 0, 0, 0.002, 0, 0]);
    });
    it('should clone text state with independent array copies', () => {
        // Arrange
        const originalState: _TextState = new _TextState();
        originalState._setTextMatrix(5, 6, 7, 8, 10, 20);
        // Act
        const clonedState: any = originalState._clone();
        clonedState._textMatrix[0] = 99;
        // Assert
        expect(originalState._textMatrix[0]).toBe(5);
        expect(clonedState._textMatrix[0]).toBe(99);
        expect(clonedState._textMatrix).not.toBe(originalState._textMatrix);
    });
    it('should clone text state with independent text line matrix', () => {
        // Arrange
        const originalState: _TextState = new _TextState();
        originalState._setTextLineMatrix(1, 2, 3, 4, 5, 6);
        // Act
        const clonedState: any = originalState._clone();
        clonedState._textLineMatrix[5] = 999;
        // Assert
        expect(originalState._textLineMatrix[5]).toBe(6);
        expect(clonedState._textLineMatrix[5]).toBe(999);
    });
    it('should clone text state with independent font matrix', () => {
        // Arrange
        const originalState: _TextState = new _TextState();
        const customFontMatrix: number[] = [0.005, 0, 0, 0.005, 0, 0];
        originalState._fontMatrix = customFontMatrix;
        // Act
        const clonedState: any = originalState._clone();
        clonedState._fontMatrix[0] = 0.01;
        // Assert
        expect(originalState._fontMatrix[0]).toBe(0.005);
        expect(clonedState._fontMatrix[0]).toBe(0.01);
    });
    it('should clone text state and preserve scalar properties', () => {
        // Arrange
        const originalState: _TextState = new _TextState();
        originalState._fontName = 'Helvetica';
        originalState._fontSize = 12;
        originalState._charSpacing = 0.5;
        // Act
        const clonedState: any = originalState._clone();
        // Assert
        expect(clonedState._fontName).toBe('Helvetica');
        expect(clonedState._fontSize).toBe(12);
        expect(clonedState._charSpacing).toBe(0.5);
    });
    // ============================================================================
    // _GraphicState Constructor Tests
    // ============================================================================
    it('should construct _GraphicState with undefined parameter creating new _TextState', () => {
        // Arrange
        const currentState: undefined = undefined;
        // Act
        const graphicState: _GraphicState = new _GraphicState(currentState);
        // Assert
        expect(graphicState._state).toBeDefined();
        expect(graphicState._state instanceof _TextState).toBe(true);
        expect(graphicState._state._ctm).toEqual([1, 0, 0, 1, 0, 0]);
        expect(graphicState._state._fontSize).toBe(0);
    });
    it('should construct _GraphicState without parameter creating new _TextState (branch: !currentState TRUE)', () => {
        // Arrange - No parameter
        // Act
        const graphicState: _GraphicState = new _GraphicState();
        // Assert
        expect(graphicState._state).toBeDefined();
        expect(graphicState._state instanceof _TextState).toBe(true);
        expect(graphicState._stateStack.length).toBe(0);
    });
    it('should construct _GraphicState with provided _TextState (branch: !currentState FALSE)', () => {
        // Arrange
        const providedState: _TextState = new _TextState();
        providedState._fontSize = 24;
        providedState._fontName = 'Arial';
        // Act
        const graphicState: _GraphicState = new _GraphicState(providedState);
        // Assert
        expect(graphicState._state).toBe(providedState);
        expect(graphicState._state._fontSize).toBe(24);
        expect(graphicState._state._fontName).toBe('Arial');
    });
    it('should construct _GraphicState with empty state stack', () => {
        // Arrange
        // Act
        const graphicState: _GraphicState = new _GraphicState();
        // Assert
        expect(graphicState._stateStack).toBeDefined();
        expect(Array.isArray(graphicState._stateStack)).toBe(true);
        expect(graphicState._stateStack.length).toBe(0);
    });
    it('should construct _GraphicState preserving provided state identity', () => {
        // Arrange
        const customState: _TextState = new _TextState();
        customState._leading = 15;
        // Act
        const graphicState: _GraphicState = new _GraphicState(customState);
        // Assert
        expect(graphicState._state).toBe(customState);
        expect(graphicState._state._leading).toBe(15);
    });
    // ============================================================================
    // _GraphicState._save Tests
    // ============================================================================
    it('should save current state to stack and create clone', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        graphicState._state._fontSize = 18;
        const originalState: _TextState = graphicState._state;
        // Act
        graphicState._save();
        // Assert
        expect(graphicState._stateStack.length).toBe(1);
        expect(graphicState._stateStack[0]).toBe(originalState);
        expect(graphicState._state).not.toBe(originalState);
        expect(graphicState._state._fontSize).toBe(18);
    });
    it('should save multiple states to stack', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const state1: _TextState = graphicState._state;
        // Act
        graphicState._save();
        const state2: _TextState = graphicState._state;
        graphicState._save();
        const state3: _TextState = graphicState._state;
        // Assert
        expect(graphicState._stateStack.length).toBe(2);
        expect(graphicState._stateStack[0]).toBe(state1);
        expect(graphicState._stateStack[1]).toBe(state2);
        expect(graphicState._state).toBe(state3);
    });
    it('should create independent clone on save', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        graphicState._state._setTextMatrix(2, 0, 0, 3, 10, 20);
        // Act
        graphicState._save();
        graphicState._state._setTextMatrix(1, 0, 0, 1, 0, 0);
        // Assert
        expect(graphicState._stateStack[0]._textMatrix).toEqual([2, 0, 0, 3, 10, 20]);
        expect(graphicState._state._textMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });
    // ============================================================================
    // _GraphicState._restore Tests
    // ============================================================================
    it('should restore previous state from stack (branch: if (prev) TRUE)', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const originalState: _TextState = graphicState._state;
        originalState._fontSize = 14;
        graphicState._save();
        graphicState._state._fontSize = 28;
        // Act
        graphicState._restore();
        // Assert
        expect(graphicState._state._fontSize).toBe(14);
        expect(graphicState._state).toBe(originalState);
        expect(graphicState._stateStack.length).toBe(0);
    });
    it('should do nothing when restoring from empty stack (branch: if (prev) FALSE)', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const currentState: _TextState = graphicState._state;
        currentState._fontSize = 16;
        // Act
        graphicState._restore();
        // Assert
        expect(graphicState._state).toBe(currentState);
        expect(graphicState._state._fontSize).toBe(16);
        expect(graphicState._stateStack.length).toBe(0);
    });
    it('should restore multiple saved states in LIFO order', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const state1: _TextState = graphicState._state;
        state1._fontSize = 10;
        graphicState._save();
        graphicState._state._fontSize = 20;
        graphicState._save();
        graphicState._state._fontSize = 30;
        // Act
        graphicState._restore();
        // Assert
        expect(graphicState._state._fontSize).toBe(20);
        expect(graphicState._stateStack.length).toBe(1);
        // Act
        graphicState._restore();
        // Assert
        expect(graphicState._state._fontSize).toBe(10);
        expect(graphicState._stateStack.length).toBe(0);
    });
    // ============================================================================
    // _GraphicState._transform Tests
    // ============================================================================
    it('should apply identity transform to CTM', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        graphicState._state._ctm = [2, 0, 0, 3, 10, 20];
        const identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        graphicState._transform(identityMatrix);
        // Assert
        expect(graphicState._state._ctm).toEqual([2, 0, 0, 3, 10, 20]);
    });
    it('should apply translation transform to CTM', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        graphicState._state._ctm = [1, 0, 0, 1, 0, 0];
        const translationMatrix: number[] = [1, 0, 0, 1, 50, 75];
        // Act
        graphicState._transform(translationMatrix);
        // Assert
        expect(graphicState._state._ctm).toEqual([1, 0, 0, 1, 50, 75]);
    });
    it('should apply scale transform to CTM', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        graphicState._state._ctm = [1, 0, 0, 1, 0, 0];
        const scaleMatrix: number[] = [2, 0, 0, 3, 0, 0];
        // Act
        graphicState._transform(scaleMatrix);
        // Assert
        expect(graphicState._state._ctm).toEqual([2, 0, 0, 3, 0, 0]);
    });
    // ============================================================================
    // _GraphicState._transformMatrix Tests
    // ============================================================================
    it('should multiply identity matrix by identity matrix', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [1, 0, 0, 1, 0, 0];
        const m2: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result).toEqual([1, 0, 0, 1, 0, 0]);
    });
    it('should multiply identity matrix by translation matrix', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [1, 0, 0, 1, 0, 0];
        const m2: number[] = [1, 0, 0, 1, 100, 200];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result).toEqual([1, 0, 0, 1, 100, 200]);
    });
    it('should multiply scale matrices correctly', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [2, 0, 0, 3, 0, 0];
        const m2: number[] = [4, 0, 0, 5, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result[0]).toBe(8);
        expect(result[3]).toBe(15);
        expect(result).toEqual([8, 0, 0, 15, 0, 0]);
    });
    it('should multiply translation matrix by scale matrix', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [1, 0, 0, 1, 10, 20];
        const m2: number[] = [2, 0, 0, 3, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result[0]).toBe(2);
        expect(result[3]).toBe(3);
        expect(result[4]).toBe(10);
        expect(result[5]).toBe(20);
        expect(result).toEqual([2, 0, 0, 3, 10, 20]);
    });
    it('should multiply complex matrices with all components', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [2, 1, 3, 4, 5, 6];
        const m2: number[] = [1, 0, 0, 1, 10, 20];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        const expectedE: number = 2 * 10 + 3 * 20 + 5;
        const expectedF: number = 1 * 10 + 4 * 20 + 6;
        expect(result[4]).toBe(expectedE);
        expect(result[5]).toBe(expectedF);
        expect(result[4]).toBe(85);
        expect(result[5]).toBe(96);
    });
    it('should multiply matrices with negative values', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [-1, 0, 0, 1, 0, 0];
        const m2: number[] = [1, 0, 0, -1, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result[0]).toBe(-1);
        expect(result[3]).toBe(-1);
        expect(result).toEqual([-1, 0, -0, -1, 0, 0]);
    });
    it('should multiply rotation-like matrices', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const cos90: number = 0;
        const sin90: number = 1;
        const m1: number[] = [cos90, sin90, -sin90, cos90, 0, 0];
        const m2: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result[0]).toBe(cos90);
        expect(result[1]).toBe(sin90);
        expect(result[2]).toBe(-sin90);
        expect(result[3]).toBe(cos90);
    });
    it('should multiply matrices with decimal values', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [0.866, 0.5, -0.5, 0.866, 0, 0];
        const m2: number[] = [0.866, -0.5, 0.5, 0.866, 0, 0];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result[0]).toEqual(0.999956);     // cos(θ) * scale
        expect(result[1]).toEqual(0);    // sin(θ) * scale
        expect(result[2]).toEqual(0);   // -sin(θ) * scale
        expect(result[3]).toEqual(0.999956)     // cos(θ) * scale
    });
    it('should return array with 6 elements', () => {
        // Arrange
        const graphicState: _GraphicState = new _GraphicState();
        const m1: number[] = [1, 2, 3, 4, 5, 6];
        const m2: number[] = [7, 8, 9, 10, 11, 12];
        // Act
        const result: number[] = graphicState._transformMatrix(m1, m2);
        // Assert
        expect(result.length).toBe(6);
        expect(Array.isArray(result)).toBe(true);
    });
});
