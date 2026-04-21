import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfGraphics, PdfPen } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfDashStyle, PdfLineCap, PdfLineJoin } from "../src/pdf/core/enumerator";
import { PdfColor } from "../src/pdf/core/pdf-type";
import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { _ContentParser, _PdfRecord } from "../src/pdf/core/content-parser";

describe('PdfPen', () => {
    it('1010317 - Checking the assigned properties of PdfPen', () => {
        const color: PdfColor = { r: 0, g: 0, b: 0 };
        const pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 4, { dashOffset: 0.5, dashPattern: [4, 2, 1, 3], dashStyle: PdfDashStyle.custom, miterLimit: 2, lineCap: PdfLineCap.round, lineJoin: PdfLineJoin.bevel } as any);
        // color and width are set by constructor
        expect(pen.color).toEqual(color);
        expect(pen.width).toEqual(4);
        // current implementation leaves other properties at defaults
        expect(pen.dashOffset).toEqual(0.5);
        expect(pen.dashPattern).toEqual([4, 2, 1, 3]);
        expect(pen.dashStyle).toEqual(5);
        expect(pen.miterLimit).toEqual(2);
        expect(pen.lineCap).toEqual(PdfLineCap.round as any);
        expect(pen.lineJoin).toEqual(PdfLineJoin.bevel as any);
    });
    it('1010317- Worst-cases using example pen creation', () => {
        let pen: PdfPen = new PdfPen({ r: 0, g: 0, b: 0 }, 4, { dashOffset: 0.5, dashPattern: [4, 2, 1, 3], dashStyle: PdfDashStyle.custom, miterLimit: 2, lineCap: PdfLineCap.round, lineJoin: PdfLineJoin.bevel } as any);
        // color setter: only accepts null/undefined in current code
        pen.color = { r: 9, g: 9, b: 9 } as PdfColor;
        expect(pen.color.r).toEqual(9);
        pen.color = { r: 0, g: 0, b: 0 };
        expect(pen.color.b).toEqual(0);
        // width setter ignores NaN, accepts numbers
        pen.width = -5;
        expect(pen.width).toEqual(4); // width should remain unchanged since -5 is invalid
        pen.width = 6;
        expect(pen.width).toEqual(6);
        // dashOffset / dashPattern / dashStyle follow current inverted-guard behavior
        pen.dashOffset = 3;
        expect(pen.dashOffset).toEqual(3);
        pen.dashOffset = -3;
        expect(pen.dashOffset).toEqual(3);
        pen.dashPattern = [1, 2, 3];
        expect(pen.dashPattern[2]).toEqual(3);
        pen.dashStyle = PdfDashStyle.custom;
        expect(pen.dashStyle).toEqual(PdfDashStyle.custom);
        pen.dashStyle = PdfDashStyle.dot;
        expect(pen.dashStyle).toEqual(2);
        // miterLimit
        pen.miterLimit = null;
        expect(pen.miterLimit).toEqual(2);
        pen.miterLimit = 7;
        expect(pen.miterLimit).toEqual(7);
        // lineCap / lineJoin
        pen.lineCap = PdfLineCap.round;
        expect(pen.lineCap).toEqual(PdfLineCap.round);
        pen.lineJoin = PdfLineJoin.bevel;
        expect(pen.lineJoin).toEqual(2);
    });

    it('1010317: Draw rectangle with pdf pen', () => {
        let pdf = new PdfDocument();
        pdf.addPage();
        let page: PdfPage = pdf.getPage(0);
        let graphics: PdfGraphics = page.graphics;
        graphics.drawRectangle({ x: 150, y: 50, width: 50, height: 50 }, new PdfPen({ r: 0, g: 0, b: 0 }, 4, { dashOffset: 0.5, dashPattern: [4, 2, 1, 3], dashStyle: PdfDashStyle.custom, miterLimit: 2, lineCap: PdfLineCap.round, lineJoin: PdfLineJoin.bevel } as any));
        const bytes: Uint8Array = pdf.save();
        pdf.destroy();
        const parsed: PdfDocument = new PdfDocument(bytes);
        const parsedPageOne: PdfPage = parsed.getPage(0);
        let contents: any = parsedPageOne._pageDictionary.getArray('Contents');
        let stream: _PdfContentStream = contents[2];
        let parser: _ContentParser = new _ContentParser(stream.getBytes());
        let result: _PdfRecord[] = parser._readContent();
        // Validate the content stream entries produced for the drawn rectangle with the pen
        expect(result.length).toBeGreaterThanOrEqual(17);
        // 'q' - save graphics state
        expect(result[0]._operator).toEqual('q');
        expect(result[0]._operands).toEqual([]);
        // 'cm' - concatenate matrix (initial coordinate transform)
        expect(result[1]._operator).toEqual('cm');
        expect(result[1]._operands).toEqual(['1.00', '.00', '.00', '1.00', '.00', '842.00']);
        // 're' - append rectangle
        expect(result[2]._operator).toEqual('re');
        expect(result[2]._operands).toEqual(['40.000', '-40.000', '515.000', '-762.000']);
        // 'h' - close subpath
        expect(result[3]._operator).toEqual('h');
        expect(result[3]._operands).toEqual([]);
        // 'W' - clip to path (nonzero winding)
        expect(result[4]._operator).toEqual('W');
        expect(result[4]._operands).toEqual([]);
        // 'n' - end path without filling or stroking
        expect(result[5]._operator).toEqual('n');
        expect(result[5]._operands).toEqual([]);
        // second 'cm' - translate to drawing position
        expect(result[6]._operator).toEqual('cm');
        expect(result[6]._operands).toEqual(['1.00', '.00', '.00', '1.00', '40.00', '-40.00']);
        // 'CS' - set stroking color space
        expect(result[7]._operator).toEqual('CS');
        expect(result[7]._operands).toEqual(['/DeviceRGB']);
        // 'cs' - set non-stroking color space
        expect(result[8]._operator).toEqual('cs');
        expect(result[8]._operands).toEqual(['/DeviceRGB']);
        // 'd' - set dash pattern
        expect(result[9]._operator).toEqual('d');
        expect(result[9]._operands).toEqual(['[4 2 1 3]', '2']);
        // 'w' - set line width
        expect(result[10]._operator).toEqual('w');
        expect(result[10]._operands).toEqual(['4.000']);
        // 'j' - set line join style
        expect(result[11]._operator).toEqual('j');
        expect(result[11]._operands).toEqual(['2']);
        // 'J' - set line cap style
        expect(result[12]._operator).toEqual('J');
        expect(result[12]._operands).toEqual(['1']);
        // 'M' - set miter limit
        expect(result[13]._operator).toEqual('M');
        expect(result[13]._operands).toEqual(['2.000']);
        // 'RG' - set stroking color (RGB)
        expect(result[14]._operator).toEqual('RG');
        expect(result[14]._operands).toEqual(['0.000', '0.000', '0.000']);
        // inner 're' - rectangle for stroke
        expect(result[15]._operator).toEqual('re');
        expect(result[15]._operands).toEqual(['150.000', '-50.000', '50.000', '-50.000']);
        // 'S' - stroke the path
        expect(result[16]._operator).toEqual('S');
        expect(result[16]._operands).toEqual([]);
    });
});
