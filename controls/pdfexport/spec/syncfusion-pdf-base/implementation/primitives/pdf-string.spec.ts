/**
 * spec document for PdfString.ts class
 */
import { InternalEnum, PdfString, ObjectStatus, IPdfWriter, PdfCrossTable, PdfDocumentBase, IPdfPrimitive, PdfStreamWriter, PdfStream, PdfDictionary } from "../../../../src/index";

describe('PdfString.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfString = new PdfString();
        it('-Hex == false', () => {
            expect(t1.hex).toBeFalsy();
        })
        it('-Value == undefined', () => {
            expect(t1.value).toBeUndefined();
        })
        it('-Set Value', () => {
            t1.value = ' ';
            expect(t1.value).not.toBeUndefined();
        })
        it('-Status == undefined', () => {
            expect(t1.status).toBeUndefined();
        })
        it('-Set Status', () => {
            t1.status = ObjectStatus.None;
            expect(t1.status).toEqual(ObjectStatus.None);
        })
        it('-IsSaving == false', () => {
            expect(t1.isSaving).toBeFalsy();
        })
        it('-Set IsSaving', () => {
            t1.isSaving = false;
            expect(t1.isSaving).toBeFalsy();
        })
        it('-ObjectCollectionIndex == undefined', () => {
            expect(t1.objectCollectionIndex).toBeUndefined();
        })
        it('-Set ObjectCollectionIndex', () => {
            t1.objectCollectionIndex = 1;
            expect(t1.objectCollectionIndex).not.toBeUndefined();
        })
        it('-ClonedObject != undefined', () => {
            expect(t1.clonedObject).not.toBeUndefined();
        })
        it('-Position != undefined', () => {
            expect(t1.position).not.toBeUndefined();
        })
        it('-Set Position', () => {
            t1.position = -1;
            expect(t1.position).not.toBeUndefined();
        })
        it('-CrossTable == undefined', () => {
            expect(t1.CrossTable).toBeUndefined();
        })
        let crossTable : PdfCrossTable = new PdfCrossTable();
        let clone : PdfString = t1.clone(crossTable) as PdfString;
        t1.clone(clone.CrossTable);
        let t2 : PdfString = new PdfString('test');
        let stream : PdfStream = new PdfStream();
        let writer : PdfStreamWriter = new PdfStreamWriter(stream);
        t2.save(writer);
        it('-this.Save(IPdfWriter) method calling', () => {
            expect(function (): void {t1.save(null); }).toThrowError();
        })
        PdfString.bytesToHex([1, 2]);
        it('-BytesToHex(null) == empty', () => {
            expect(PdfString.bytesToHex(null)).toEqual('');
        })
        it('-converted - get == undefined', () => {
            expect(t2.converted).toBeUndefined('');
        })
        t2.encode = InternalEnum.ForceEncoding.Ascii;
        t2.value += String.fromCharCode(13, 92);
        t2.save(writer);
        it('-toUnicodeArray(null) method calling', () => {
            expect(function (): void {PdfString.toUnicodeArray(null, false); }).toThrowError();
        })
        it('-this.byteToString(null) method calling', () => {
            expect(function (): void {PdfString.byteToString(null); }).toThrowError();
        })
        let t3 : PdfString = new PdfString(String.fromCharCode());
    })
})