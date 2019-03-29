/**
 * spec document for PdfStream.ts class
 */
import { PdfDictionary, PdfReferenceHolder, PdfName } from '../../../../src/index';
import { PdfStream } from '../../../../src/implementation/primitives/pdf-stream';
import { PdfMainObjectCollection } from '../../../../src/implementation/input-output/pdf-main-object-collection';
import { PdfWriter, PdfDocument } from '../../../../src/index';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
describe('PdfStream.ts',()=>{
    describe('Constructor initializing',()=>{
        let t1 : PdfStream = new PdfStream();
        it('-Data == undefined', () => {
            expect(t1.data).not.toBeUndefined();
        })
        let t2 : PdfDictionary = new PdfDictionary();
        let t3 : PdfStream = new PdfStream(t2,[]);
        it('-Data == undefined', () => {
            t3.data = ['10','20'];
            expect(t3.data).not.toBeUndefined();
        })
        it('InternalStream != undefined', () => {
            expect(t1.internalStream).not.toBeUndefined();
        })
        it('-Set InternalStream', () => {
            t1.internalStream = ['1', '2'];
            expect(t1.internalStream).toEqual(['1', '2']);
        })
        it('Compress == true', () => {
            expect(t1.compress).toBeTruthy();
        })
        it('-Set Compress', () => {
            t1.compress = true
            expect(t1.compress).toBeTruthy();
        })
        it('-this.Write(string) method calling', () => {
            expect(function (): void {t1.write(null); }).toThrowError();
        })
        it('-this.Write(string) method calling', () => {
            expect(function (): void {t1.write(''); }).toThrowError();
        })
        PdfStream.bytesToString([1, 2, 3]);
        // t1.AddFilter('testing');
        // t1.Items.setValue(this.dictionaryProperties.filter, new PdfReferenceHolder(new PdfName('FlateDecode')));
        // t1.AddFilter('testing');

        let t4 : PdfStream = new PdfStream();
        t4.data = ['Hello', 'hi', 'testing'];
        let streamWriter : StreamWriter = new StreamWriter();
        let writer : PdfWriter = new PdfWriter(streamWriter);
        writer.document = new PdfDocument();
        t4.save(writer);
        t4.data = ['hi'];
        t4.save(writer);
        t4.data = [];
        t4.save(writer);
        t4.items.setValue('Filter', new PdfReferenceHolder(new PdfDictionary()));
        t4.addFilter('Filter');
        t4.clearStream();

        let t5 : PdfStream = new PdfStream();
        t5.data = [];
        t5.save(writer);
        it('-this.WriteBytes([]) method calling', () => {
            expect(function (): void {t5.writeBytes([]); }).toThrowError();
        })
        it('-this.WriteBytes(null) method calling', () => {
            expect(function (): void {t5.writeBytes(null); }).toThrowError();
        })
    })
})