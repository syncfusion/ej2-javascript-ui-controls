/**
 * spec document for PdfWriter.ts class
 */
//import fs = require('fs')
import { StreamWriter } from '@syncfusion/ej2-file-utils';
import { PdfWriter } from '../../../../src/implementation/input-output/pdf-writer';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
describe('PdfWriter.ts',()=>{
    describe('Constructor initializing',()=>{
        // let writeStream:fs.WriteStream = fs.createWriteStream("text.txt");
        let writeStream : StreamWriter = new StreamWriter();
        let t1 : PdfWriter = new PdfWriter(writeStream);
        // it('-Document == undefined', () => {
        //     expect(t1.Document).toBeUndefined();
        // })
        let t2 : PdfDocument = new PdfDocument();
        t1.document = t2;
        // it('-Document == new Document.PdfDocument()', () => {
        //     expect(t1.Document).toEqual(t2);
        // })
        it('-Position != undefined', () => {
            expect(t1.position).not.toBeUndefined();
        })
        it('-Length != undefined', () => {
            expect(t1.length).not.toBeUndefined();
        })
        it('-Stream != undefined', () => {
            expect(t1.stream).toEqual(writeStream);
        })
        //need to remove
        it('-Stream != undefined', () => {
            t1.write(10);
            expect(t1.stream).toEqual(writeStream);
        })
    })
})