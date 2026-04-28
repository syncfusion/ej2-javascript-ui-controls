import { _bytesToString, _MD5, _PdfDictionary, _PdfReference, _Sha1, _Sha256, PdfBitmap, PdfDocument, PdfPage, PdfRotationAngle } from '@syncfusion/ej2-pdf';
import { PdfRedactionRegion } from '../src/pdf-data-extract/core/redaction/pdf-redaction-region';
import { PdfRedactor } from '../src/pdf-data-extract/core/redaction/pdf-redactor';
import { image } from './inputs.spec';
import { base64, img, largeImage } from './image.spec';

describe('Pdf Redaction', async() => {
    it('966167 - 1', () => {
        let document: PdfDocument = new PdfDocument(image);
        let redactor: PdfRedactor = new PdfRedactor(document);
        const hashList: Uint8Array[] = [];
        const hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        const hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(document, hashList);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [
            { x: 40, y: 82.54399999999998, width: 70.03200000000001, height: 12},
            { x: 40, y: 397.544, width: 64.01999999999998, height: 12},
            { x: 90.000001100000105, y: 110, width: 200, height: 100},
            { x: 40.000001100000105, y: 405, width: 100, height: 150}
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            region.isTextOnly = true;
            redactions.push(region);
        }
        redactor.add(redactions);
        redactor.redactSync();
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it('966167 - 2', async () => {
        let document: PdfDocument = new PdfDocument(image);
        const hashList: Uint8Array[] = [];
        const hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        const hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(document, hashList);
        let redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [
            { x: 40, y: 82.54399999999998, width: 70.03200000000001, height: 12},
            { x: 40, y: 397.544, width: 64.01999999999998, height: 12},
            {x: 90.000001100000105, y: 110, width: 200, height: 100},
            {x: 40.000001100000105, y: 405, width: 100, height: 150}
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            region.isTextOnly = true;
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(canvasRenderCallback);
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output)
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it('966167 - 3', () => {
        let document: PdfDocument = new PdfDocument(image);
        let redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [];
        let hashList: Uint8Array[] = [];
        let hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        let hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(document, hashList);
        const boundsList = [
            { x: 40, y: 82.54399999999998, width: 70.03200000000001, height: 12},
            { x: 40, y: 397.544, width: 64.01999999999998, height: 12},
            {x: 90.000001100000105, y: 110, width: 200, height: 100},
            {x: 40.000001100000105, y: 405, width: 100, height: 150}
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        redactor.redactSync();
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        hashList = [];
        hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it('966167 - 5 without callback', async () => {
        let document: PdfDocument = new PdfDocument(image);
        const hashList: Uint8Array[] = [];
        const hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        const hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(document, hashList);
        let redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [
            { x: 40, y: 82.54399999999998, width: 70.03200000000001, height: 12},
            { x: 40, y: 397.544, width: 64.01999999999998, height: 12},
            {x: 90.000001100000105, y: 110, width: 200, height: 100},
            {x: 40.000001100000105, y: 405, width: 100, height: 150}
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(Callback);
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it ('966167 - 8 draw image with page graphics rotation', async() => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        page.rotation = PdfRotationAngle.angle180;
        let bitmap: PdfBitmap = new PdfBitmap(base64);
        page.graphics.rotateTransform(90);
        page.graphics.drawImage(bitmap, {x: 150, y: 150, width: 200, height: 200});
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        let hashList: Uint8Array[] = [];
        let hash1 = new Uint8Array([207, 217, 5, 250, 218, 108, 46, 91, 135, 216, 236, 62, 123, 198, 246, 20, 14, 196, 42, 71, 171, 185, 145, 164, 222, 191, 1, 228, 211, 5, 112, 247]);      
        hashList.push(hash1);
        validateImageStreamHashes(ldoc, hashList)
        let redactor: PdfRedactor = new PdfRedactor(ldoc);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [
            {x: 170, y: 150, width: 200, height: 200}
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(canvasRenderCallback);
        output = ldoc.save();
        ldoc.destroy();
        ldoc = new PdfDocument(output);
        hashList = [];
        hash1 = new Uint8Array([207, 217, 5, 250, 218, 108, 46, 91, 135, 216, 236, 62, 123, 198, 246, 20, 14, 196, 42, 71, 171, 185, 145, 164, 222, 191, 1, 228, 211, 5, 112, 247]);      
        hashList.push(hash1);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it ('966167 - 10 Multiple redaction on same image ', async() =>{
        let document: PdfDocument = new PdfDocument(image);
        let hashList: Uint8Array[] = [];
        let hash1 = new Uint8Array([27, 63, 45, 165, 74, 113, 26, 37, 238, 24, 44, 135, 73, 152, 197, 237, 183, 4, 12, 105, 126, 255, 100, 47, 94, 92, 0, 8, 62, 184, 179, 83]);
        let hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]);        
        hashList.push(hash1);
        hashList.push(hash2);
        validateImageStreamHashes(document, hashList)
        let redactor: PdfRedactor = new PdfRedactor(document);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [
            {x: 40.000001100000105, y: 110, width: 515, height: 215},
            {x: 40.000001100000105, y: 110, width: 515, height: 215},
            {x: 40.000001100000105, y: 110, width: 515, height: 215},
            {x: 40.000001100000105, y: 110, width: 515, height: 215},
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(canvasRenderCallback);
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
		hashList = [];
        hash1 = new Uint8Array([225, 239, 31, 41, 250, 91, 164, 173, 203, 253, 155, 52, 65, 177, 116, 141, 52, 96, 229, 207, 201, 206, 159, 112, 139, 45, 246, 223, 76, 70, 247, 161]); 
        hash2 = new Uint8Array([0, 12, 218, 174, 1, 195, 165, 146, 7, 114, 190, 66, 130, 105, 8, 111, 179, 224, 153, 222, 162, 61, 71, 239, 135, 31, 26, 54, 65, 4, 0, 134]); 		
        hashList.push(hash1);
		hashList.push(hash2);        
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it ('966167 - 12  outside of page content area', async() => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let bitmap: PdfBitmap = new PdfBitmap(img);
        page.graphics.drawImage(bitmap, { x: page.size.width, y: page.size.height, width: 200, height: 100 });
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        let hashList: Uint8Array[] = [];
        let hash1 = new Uint8Array([82, 176, 242, 187, 237, 6, 196, 237, 28, 253, 243, 89, 249, 40, 50, 148, 41, 43, 83, 22, 99, 17, 136, 229, 206, 51, 51, 119, 164, 6, 125, 98]);
        hashList.push(hash1); 
        let redactor: PdfRedactor = new PdfRedactor(ldoc);
        page = ldoc.getPage(0);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [           
            { x: page.size.width, y: page.size.height, width: 200, height: 100 },
            { x: 0, y: 0, width: page.size.width, height: page.size.height }
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(canvasRenderCallback);
        output = ldoc.save();
        ldoc.destroy();
        ldoc = new PdfDocument(output);
        hashList = [];
        hash1 = new Uint8Array([60, 79, 53, 61, 18, 252, 203, 3, 159, 81, 253, 63, 46, 212, 141, 98, 171, 2, 121, 242, 173, 96, 60, 79, 63, 200, 188, 170, 180, 91, 47, 29]);
        hashList.push(hash1);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
    it ('966167 - 13  Larger physical dimension', async() => {
        let document: PdfDocument = new PdfDocument();
        let page = document.addPage();
        let bitmap: PdfBitmap = new PdfBitmap(largeImage);
        page.graphics.drawImage(bitmap, { x: 0, y: 0, width: 50, height: 100 });
        let output = document.save();
        document.destroy();
        let ldoc = new PdfDocument(output);
        let hashList: Uint8Array[] = [];
        let hash1 = new Uint8Array([92, 130, 59, 67, 49, 34, 1, 135, 161, 214, 31, 248, 35, 226, 232, 114, 84, 112, 218, 198, 225, 214, 127, 68, 253, 247, 88, 95, 255, 104, 214, 145]);
        hashList.push(hash1);
        validateImageStreamHashes(ldoc, hashList);
        let redactor: PdfRedactor = new PdfRedactor(ldoc);
        const redactions: PdfRedactionRegion[] = [];
        const boundsList = [           
            { x: 0, y: 0, width: 50, height: 100 }
        ];
        for (const bounds of boundsList) {
            const region = new PdfRedactionRegion(0, bounds);
            redactions.push(region);
        }
        redactor.add(redactions);
        await redactor.redact(canvasRenderCallback);
        output = ldoc.save();
        ldoc.destroy();
        ldoc = new PdfDocument(output);
        hashList = [];
        hash1 = new Uint8Array([10, 225, 138, 210, 68, 192, 39, 174, 120, 70, 60, 78, 237, 111, 226, 239, 86, 215, 45, 147, 224, 134, 19, 106, 209, 189, 112, 105, 35, 7, 74, 20]);      
        hashList.push(hash1);
        validateImageStreamHashes(ldoc, hashList);
        ldoc.destroy();
    });
});
function canvasRenderCallback(): any {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    return { canvas: canvas, applicationPlatform: undefined};
}
function Callback(): any {
    
}
function validateImageStreamHashes(document: PdfDocument, hashList: Uint8Array[]): void {
    let page: PdfPage = document.getPage(0);
    let resources: any = page._pageDictionary.get('Resources'); 
    let xObjects: _PdfDictionary = resources.get('XObject') as _PdfDictionary;
    let index: number = 0;
    xObjects.forEach((key: any, value: any) => { 
        if (value instanceof _PdfReference) {
            let xobject = document._crossReference._fetch(value);
            let values = xobject.getBytes();
            let hash = new _Sha256()._hash(values, 0, values.length)
            expect(hash).toEqual(hashList[index]);
            index++;
        }
    });
}
