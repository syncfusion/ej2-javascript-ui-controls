/**
 * spec document for Dictionary class
 */
import { TemporaryDictionary } from "../../../../../src/implementation/collections/object-object-pair/dictionary";
import { IPdfPrimitive, PdfName, PdfStandardFont, PdfNumber, PdfFontStyle } from "../../../../../src/index";

describe('dictionary.ts', () => {
    describe('consructor implementation of dictionary class',()=> {
        let names : TemporaryDictionary<IPdfPrimitive, PdfName>;
        let name : PdfName = new PdfName('test');
        let name1 : PdfName = new PdfName('test1');
        names = new TemporaryDictionary<IPdfPrimitive, PdfName>();
        let font : PdfStandardFont = new PdfStandardFont(10, PdfFontStyle.Bold);
        let primitive : IPdfPrimitive = font.element;
        names.setValue(primitive, name);
        names.setValue(primitive, name1);
        it('-this.SetValue(IPdfPrimitive, PdfName) method calling', () => {
            expect(function (): void {names.setValue(null, name); }).toThrowError();
        })
        names.containsKey(primitive);
        it('-this.containsKey(IPdfPrimitive) method calling', () => {
            expect(function (): void {names.containsKey(null); }).toThrowError();
        })
        names.getValue(primitive);
        let font2 : PdfStandardFont = new PdfStandardFont(20, PdfFontStyle.Bold);
        it('-this.getValue(font2.element) method calling', () => {
            expect(function (): void {names.getValue(font2.element); }).toThrowError();
        })
        it('-this.getValue(IPdfPrimitive) method calling', () => {
            expect(function (): void {names.getValue(null); }).toThrowError();
        })
        it('-this.remove(font2.element) method calling', () => {
            expect(function (): void {names.remove(font2.element); }).toThrowError();
        })
        names.keys();
        names.values();
        names.remove(primitive);
        it('-this.remove(IPdfPrimitive) method calling', () => {
            expect(function (): void {names.remove(null); }).toThrowError();
        })
        names.clear();
        it('-this.Clear() method calling', () => {
            expect(names.keys).not.toBeNull();
        })
        let name2 : PdfName = new PdfName('test2');
        names.add(primitive, name2);
        it('-this.add(IPdfPrimitive, PdfName) method calling', () => {
            expect(function (): void {names.add(null, name2); }).toThrowError();
        })
        it('-this.add(primitive, PdfName) method calling : Same name', () => {
            expect(function (): void {names.add(primitive, name2); }).toThrowError();
        })
        names.size();
    })
})