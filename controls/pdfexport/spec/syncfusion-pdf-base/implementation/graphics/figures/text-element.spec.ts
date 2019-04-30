/**
 * spec document for PdfTextElement.ts class
 */

import { PdfDocument, PdfPage, PdfTextElement, PdfTextAlignment, PdfFont, PdfPen, PdfSolidBrush, PdfColor, PdfStandardFont, PdfFontFamily, PdfStringFormat } from "../../../../../src/index";

describe('PdfTextElement.ts', () => {
    describe('Constructor initializing',()=>{
        let t1 : PdfTextElement = new PdfTextElement();
        it('-Text != undefined', () => {
            expect(t1.text).not.toBeUndefined();
        })
        it('-Set Text', () => {
            let t9 : PdfTextElement = new PdfTextElement();
            t9.font = new PdfStandardFont(PdfFontFamily.Courier, 20);
            t9.text = 'test';
            t1.text = 'test';
            expect(t1.text).toEqual('test');
        })
        it('-Value != undefined', () => {
            expect(t1.value).not.toBeUndefined();
        })
        it('-Pen == undefined', () => {
            expect(t1.pen).toBeUndefined();
        })
        it('-Set Pen', () => {
            let value : PdfPen = new PdfPen(new PdfColor(0, 0, 0));
            t1.pen = value;
            expect(t1.pen).not.toBeUndefined();
        })
        it('Brush == undefined', () => {
            expect(t1.brush).toBeUndefined();
        })
         it('-Set Brush', () => {
             let color : PdfColor = new PdfColor();
             let value : PdfSolidBrush = new PdfSolidBrush(color);
            t1.brush = value;
            expect(t1.brush).not.toBeUndefined();
        })
        it('-Font == undefined', () => {
            expect(t1.font).toBeUndefined();
        })
        it('-Set Font', () => {
            let value : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
            t1.font = value;
            expect(t1.font).not.toBeUndefined();
        })
        it('StringFormat == undefined', () => {
            expect(t1.stringFormat).toBeUndefined();
        })
        it('-Set StringFormat', () => {
             let value : PdfStringFormat = new PdfStringFormat();
            t1.stringFormat = value;
            expect(t1.stringFormat).not.toBeUndefined();
        })
        it('-Set StringFormat', () => {
             let value : PdfStringFormat = new PdfStringFormat();
            t1.stringFormat = value;
            expect(t1.stringFormat).not.toBeUndefined();
        })
        it('-GetBrush != undefined', () => {
            expect(t1.getBrush()).not.toBeUndefined();
        })
        let t2 : PdfTextElement = new PdfTextElement("Hello world!!!");
        it('-constructor overload 2 - Text == Hello world!!!', () => {
            expect(t2.text).toEqual('Hello world!!!');
        })
        it('-constructor overload 2 - Value == Hello world!!!', () => {
            expect(t2.value).toEqual('Hello world!!!');
        })
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
        let t3 : PdfTextElement = new PdfTextElement("Hello world!!!", font);
        it('-constructor overload 3 - Text == Hello world!!!', () => {
            expect(t3.text).toEqual('Hello world!!!');
        })
        it('constructor overload 3 - -Value == Hello world!!!', () => {
            expect(t3.value).toEqual('Hello world!!!');
        })
        it('constructor overload 3 - -Font == font', () => {
            expect(t3.font).toEqual(font);
        })
        let t4 : PdfTextElement = new PdfTextElement("Hello world!!!", font, new PdfPen(new PdfColor(0, 0, 255)));
        it('-constructor overload 4 - Text == Hello world!!!', () => {
            expect(t4.text).toEqual('Hello world!!!');
        })
        it('constructor overload 4 - -Value == Hello world!!!', () => {
            expect(t4.value).toEqual('Hello world!!!');
        })
        it('constructor overload 4 - -Font == font', () => {
            expect(t4.font).toEqual(font);
        })
        it('constructor overload 4 - -Pen == PdfPens.Blue', () => {
            expect(t4.pen).toEqual(new PdfPen(new PdfColor(0, 0, 255)));
        })
        let t5 : PdfTextElement = new PdfTextElement("Hello world!!!", font, new PdfSolidBrush(new PdfColor(0, 0, 255)));
        it('-constructor overload 5 - Text == Hello world!!!', () => {
            expect(t5.text).toEqual('Hello world!!!');
        })
        it('constructor overload 5 - -Value == Hello world!!!', () => {
            expect(t5.value).toEqual('Hello world!!!');
        })
        it('constructor overload 5 - -Font == font', () => {
            expect(t5.font).toEqual(font);
        })
        it('constructor overload 5 - -Brush == PdfBrushes.Blue', () => {
            expect(t5.brush).toEqual(new PdfSolidBrush(new PdfColor(0, 0, 255)));
        })
        let format : PdfStringFormat = new PdfStringFormat(PdfTextAlignment.Center);
        let t6 : PdfTextElement = new PdfTextElement("Hello world!!!", font, new PdfPen(new PdfColor(0, 128, 0)), new PdfSolidBrush(new PdfColor(0, 128, 0)), format);
        it('-constructor overload 6 - Text == Hello world!!!', () => {
            expect(t6.text).toEqual('Hello world!!!');
        })
        it('constructor overload 6 - -Value == Hello world!!!', () => {
            expect(t6.value).toEqual('Hello world!!!');
        })
        it('constructor overload 6 - -Font == font', () => {
            expect(t6.font).toEqual(font);
        })
        it('constructor overload 6 - -Pen == PdfPens.Green', () => {
            expect(t6.pen).toEqual(new PdfPen(new PdfColor(0, 128, 0)));
        })
        it('constructor overload 6 - -Brush == PdfBrushes.Green', () => {
            expect(t6.brush).toEqual(new PdfSolidBrush(new PdfColor(0, 128, 0)));
        })
        it('constructor overload 6 - -StringFormat == format', () => {
            expect(t6.stringFormat).toEqual(format);
        })
        let t7 : PdfTextElement = new PdfTextElement();
        t7.font = new PdfStandardFont(PdfFontFamily.TimesRoman, 20);
        t7.text = "Testing";
        it('Value == Testing when Font = undefined', () => {
            expect(t7.value).toEqual('Testing');
        })
        let t8 : PdfTextElement = new PdfTextElement();
        t8.font = null;
        t8.text = 'test';
    })
})