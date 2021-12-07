/**
 * spec document for PdfResources.ts class
 */
import { PdfSection, PdfTemplate, DictionaryProperties, PdfSolidBrush, PdfColor} from "../../../../src/index";
import { PdfReferenceHolder, Guid, PdfStandardFont, RectangleF } from "../../../../src/index";
import { PdfDocument, IPdfWrapper, PdfCrossTable, PdfName, PdfReference } from "../../../../src/index";
import { PdfFontFamily, PdfImage, PdfBitmap, PdfBlendMode, PdfResources, PdfDictionary } from "../../../../src/index";
import { IPdfPrimitive, PdfGraphics, PdfPage, PdfTransparency, PdfPen } from "../../../../src/index";

describe('PdfResources.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfResources = new PdfResources();
        let dictionary : PdfDictionary = new PdfDictionary();
        let t2 : PdfResources = new PdfResources(dictionary);
        let dictionaryProperties : DictionaryProperties = new DictionaryProperties();
        it('-Document == undefined', () => {
            expect(t1.document).toBeUndefined();
        })
        it('-Set Document', () => {
            let document : PdfDocument = new PdfDocument();
            t1.document = document;
            expect(t1.document).not.toBeUndefined();
        })
        let fontFamily : PdfFontFamily.Helvetica;
        let font : PdfStandardFont = new PdfStandardFont(fontFamily, 10);
        let obj : IPdfWrapper = font;
        // t1.GetName(obj);
        it('-this.GetName(IPdfWrapper) method calling', () => {
            expect(function (): void {t1.getName(null); }).toThrowError();
        })
        t1.getNames();
        it('-this.GetNames() method calling', () => {
            let fonts : IPdfPrimitive = font.element;
            expect(fonts).not.toBeUndefined();
        })
        // t1.RequireProcedureSet('test');
        it('-this.RequireProcedureSet(string) method calling', () => {
            expect(function (): void {t1.requireProcedureSet(null); }).toThrowError();
        })
        t1.removeFont('test');
        let reference : PdfReference = new PdfReference(10,0);
        let referenceHolder : PdfReferenceHolder = new PdfReferenceHolder(reference);
        let name : PdfName = new PdfName('test');
        let color : PdfColor = new PdfColor();
        let brush : PdfSolidBrush = new PdfSolidBrush(color);
        t1.add(brush, name);
        let template : PdfTemplate = new PdfTemplate();
        it('-t1.Add(template, name)', () => {
            expect(function (): void {t1.add(template, name); }).toThrowError();
        })
        let transparency : PdfTransparency = new PdfTransparency(2, 2, PdfBlendMode.Normal)
        t1.add(transparency, new PdfName('transparency'));
        t1.removeFont('font');
        let document : PdfDocument = new PdfDocument();
        let pages : PdfPage = document.pages.add();
        let graphics : PdfGraphics = pages.graphics;
        graphics.setTransparency(0.2);
        graphics.drawRectangle(new PdfPen(new PdfColor(255, 0, 0)), new PdfSolidBrush(new PdfColor(0, 0, 255)), 290, 120, 30, 30);
    })
})
describe('Guid.ts', () => {
    describe('Create a new GUID',()=> {
        let obj : Guid = new Guid();
        let guid = Guid.getNewGuidString();
        let index : number;
        it('-Length test', () => {
            expect(guid.length).toEqual(36);
        })
        it('-token matching 1', () => {
            index = guid.indexOf('-');
            expect(index).toEqual(8);
        })
        it('-token matching 2', () => {
            index = guid.indexOf('-', 9);
            expect(index).toEqual(13);
        })
        it('-token matching 3', () => {
            index = guid.indexOf('-', 14);
            expect(index).toEqual(18);
        })
        it('-token matching 4', () => {
            index = guid.indexOf('-', 19);
            expect(index).toEqual(23);
        })
        it('-token matching 5', () => {
            expect(guid[14]).toEqual('4');
        })
    })
})