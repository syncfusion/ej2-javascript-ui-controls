import { _PdfStreamWriter } from "../src/pdf/core/graphics/pdf-stream-writer";
import {_PdfContentStream, _PdfStream} from  '../src/pdf/core/base-stream';

describe("pdf-stream-writter file mutation test scripts", () => {
    it('static files level check', () => {
        const stream =  new _PdfContentStream([]);
        const writter =  new _PdfStreamWriter(stream);
        expect(writter._whiteSpace).toEqual(' ');
    });
    it("_writeComment should not write an operator for an empty comment", () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const spy = spyOn(writer as any, "_writeOperator");
        (writer as any)._writeComment("");
        expect(spy).not.toHaveBeenCalled();
    });

    it("_writeComment should write an operator for a non-empty comment", () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const spy = spyOn(writer as any, "_writeOperator");
        (writer as any)._writeComment("test");
        expect(spy).toHaveBeenCalledWith("% test");
    });
    it("should write matrix values followed by a whitespace", () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const matrix = {
            _toString: () => "1 0 0 1 10 20"
        };
        const writeSpy = spyOn((writer as any)._stream, "write");
        const operatorSpy = spyOn(writer as any, "_writeOperator");
        (writer as any)._modifyTM(matrix);
        expect(writeSpy).toHaveBeenCalledWith("1 0 0 1 10 20 ");
        expect(operatorSpy).toHaveBeenCalledWith("Tm");
    });
});
describe('_setColorSpace mutation tests', () => {

    it('should not execute string branch when value is not a string', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setColorSpace(123, true);
        expect(writeSpy).not.toHaveBeenCalled();
        expect(operatorSpy).not.toHaveBeenCalled();
    });

    it('should not execute string branch when arg2 is not boolean', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        (writer as any)._setColorSpace('DeviceRGB', 1);
        expect(writeSpy).not.toHaveBeenCalled();
    });

    it('should not execute any branch for completely invalid arguments', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const colorSpy = spyOn(writer as any, '_setColor');
        const writeSpy = spyOn((writer as any)._stream, 'write');
        (writer as any)._setColorSpace({}, {}, {});
        expect(writeSpy).not.toHaveBeenCalled();
        expect(colorSpy).not.toHaveBeenCalled();
    });

    it('should not execute array branch when only arg3 is boolean', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const colorSpy = spyOn(writer as any, '_setColor');
        (writer as any)._setColorSpace({}, 'test', true);
        expect(colorSpy).not.toHaveBeenCalled();
    });

    it('should not execute array branch when value is array but arg2 is not a number', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const colorSpy = spyOn(writer as any, '_setColor');
        (writer as any)._setColorSpace([255, 0, 0], 'rgb', true);
        expect(colorSpy).not.toHaveBeenCalled();
    });

    it('should not execute array branch when arg3 is not boolean', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const colorSpy = spyOn(writer as any, '_setColor');
        (writer as any)._setColorSpace([255, 0, 0], 0, 'invalid');
        expect(colorSpy).not.toHaveBeenCalled();
    });

    it('should write DeviceRGB and call setColor for valid RGB input', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        const colorSpy = spyOn(writer as any, '_setColor');
        (writer as any)._setColorSpace([255, 0, 0], 0, true);
        expect(writeSpy).toHaveBeenCalledWith('/DeviceRGB ');
        expect(operatorSpy).toHaveBeenCalledWith('CS');
        expect(colorSpy).toHaveBeenCalledWith([255, 0, 0], true);
    });

    it('should write named color space when value is string and arg2 is boolean', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setColorSpace('DeviceRGB', true);
        expect(writeSpy).toHaveBeenCalledWith('/DeviceRGB ');
        expect(operatorSpy).toHaveBeenCalledWith('CS');
    });

});
describe('_setFont and _setTextScaling mutation tests', () => {

    it('should write font name, size and trailing whitespace', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setFont('F1', 12);
        expect(writeSpy).toHaveBeenCalledWith('/F1 12.000 ');
        expect(operatorSpy).toHaveBeenCalledWith('Tf');
    });

    it('should write text scaling with trailing whitespace', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setTextScaling(125);
        expect(writeSpy).toHaveBeenCalledWith('125.000 ');
        expect(operatorSpy).toHaveBeenCalledWith('Tz');
    });

});
describe('_setLeading mutation tests', () => {

    it('should write leading value with trailing whitespace and TL operator', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn(writer as any, '_write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setLeading(10);
        expect(writeSpy.calls.argsFor(0)).toEqual(['10.000 ']);
        expect(writeSpy.calls.argsFor(1)).toEqual([writer._whiteSpace]);
        expect(operatorSpy).toHaveBeenCalledWith('TL');
    });
});
describe('_setTextRenderingMode, _setCharacterSpacing and _setWordSpacing mutation tests', () => {
    it('should write rendering mode with trailing whitespace and Tr operator', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setTextRenderingMode(2);
        expect(writeSpy).toHaveBeenCalledWith('2 ');
        expect(operatorSpy).toHaveBeenCalledWith('Tr');
    });

    it('should write character spacing with trailing whitespace and Tc operator', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setCharacterSpacing(5);
        expect(writeSpy).toHaveBeenCalledWith('5.000 ');
        expect(operatorSpy).toHaveBeenCalledWith('Tc');
    });

    it('should write word spacing with trailing whitespace and Tw operator', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setWordSpacing(10);
        expect(writeSpy).toHaveBeenCalledWith('10.000 ');
        expect(operatorSpy).toHaveBeenCalledWith('Tw');
    });

});
describe('_showNextLineText mutation tests', () => {

    it('should use _writeText when unicode is true', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeTextSpy = spyOn(writer as any, '_writeText');
        const streamWriteSpy = spyOn((writer as any)._stream, 'write');
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._showNextLineText('Hello', true);
        expect(writeTextSpy).toHaveBeenCalledWith('Hello');
        expect(streamWriteSpy).not.toHaveBeenCalled();
        expect(operatorSpy).toHaveBeenCalledWith("'");
    });

    it('should use stream.write when unicode is null', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeTextSpy = spyOn(writer as any, '_writeText');
        const streamWriteSpy = spyOn((writer as any)._stream, 'write');
        (writer as any)._showNextLineText('Hello', null);
        expect(streamWriteSpy).toHaveBeenCalledWith('Hello');
        expect(writeTextSpy).not.toHaveBeenCalled();
    });

    it('should use stream.write when unicode is undefined', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeTextSpy = spyOn(writer as any, '_writeText');
        const streamWriteSpy = spyOn((writer as any)._stream, 'write');
        (writer as any)._showNextLineText('Hello', undefined);
        expect(streamWriteSpy).toHaveBeenCalledWith('Hello');
        expect(writeTextSpy).not.toHaveBeenCalled();
    });

    it('should use stream.write when unicode is false', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const writeTextSpy = spyOn(writer as any, '_writeText');
        const streamWriteSpy = spyOn((writer as any)._stream, 'write');
        (writer as any)._showNextLineText('Hello', false);
        expect(streamWriteSpy).toHaveBeenCalledWith('Hello');
        expect(writeTextSpy).not.toHaveBeenCalled();
    });

});
describe('_setLineDashPattern mutation tests', () => {

    it('should handle a single dash pattern element', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setLineDashPattern([3], 0);
        expect(operatorSpy).toHaveBeenCalledWith('[3] 0 d');
    });

    it('should handle an empty dash pattern', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setLineDashPattern([], 2);
        expect(operatorSpy).toHaveBeenCalledWith('[] 2 d');
    });

    it('should handle multiple dash pattern elements', () => {
        const stream = new _PdfContentStream([]);
        const writer = new _PdfStreamWriter(stream);
        const operatorSpy = spyOn(writer as any, '_writeOperator');
        (writer as any)._setLineDashPattern([3, 1, 2], 0);
        expect(operatorSpy).toHaveBeenCalledWith('[3 1 2] 0 d');
    });

});