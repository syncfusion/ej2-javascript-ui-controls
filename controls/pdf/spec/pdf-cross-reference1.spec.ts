import { PdfCrossReferenceType } from "../src/pdf/core/enumerator";
import { PdfDocument } from "../src/pdf/core/pdf-document";

describe('PdfCrossReference survived mutant behaviors group 1', () => {
    // Mutant ID: 1
    it('should preserve the expected branch behavior in cross-reference operation at source line 1', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2
    it('should preserve the combined condition behavior in cross-reference operation at source line 1', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3
    it('should preserve the expected branch behavior in cross-reference operation at source line 1', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 24
    it('should preserve the expected branch behavior in cross-reference operation at source line 9', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 25
    it('should preserve the combined condition behavior in cross-reference operation at source line 9', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 26
    it('should preserve the expected branch behavior in cross-reference operation at source line 9', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 143
    it('should preserve the required serialized text in define at source line 36', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 155
    it('should preserve the required serialized text in define at source line 38', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 156
    it('should preserve the required object state in define at source line 38', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 157
    it('should preserve the expected boolean state in define at source line 38', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 161
    it('should preserve the required serialized text in define at source line 42', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 166
    it('should preserve the expected boolean state in define at source line 48', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 168
    it('should preserve the required collection contents in define at source line 50', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 199
    it('should preserve the expected branch behavior in if at source line 84', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 201
    it('should preserve the boundary condition behavior in if at source line 84', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 204
    it('should preserve the expected branch behavior in if at source line 85', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 206
    it('should preserve the boundary condition behavior in if at source line 85', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 212
    it('should preserve the required serialized text in if at source line 90', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 213
    it('should preserve the required serialized text in if at source line 90', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 216
    it('should preserve the required serialized text in if at source line 93', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 217
    it('should preserve the expected branch behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 219
    it('should preserve the combined condition behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 220
    it('should preserve the expected branch behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 222
    it('should preserve the expected branch behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 223
    it('should preserve the boundary condition behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 225
    it('should preserve the expected branch behavior in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 228
    it('should preserve the required collection contents in if at source line 94', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 229
    it('should preserve the expected boolean state in if at source line 95', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 237
    it('should execute the required cross-reference operation in if at source line 105', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 244
    it('should preserve the required serialized text in if at source line 114', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 2', () => {
    // Mutant ID: 245
    it('should preserve the required serialized text in if at source line 114', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 250
    it('should execute the required cross-reference operation in catch at source line 122', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 252
    it('should preserve the required serialized text in catch at source line 123', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 258
    it('should preserve the expected branch behavior in if at source line 128', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 262
    it('should execute the required cross-reference operation in catch at source line 133', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 263
    it('should preserve the required serialized text in catch at source line 134', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 264
    it('should preserve the required serialized text in catch at source line 134', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 325
    it('should preserve the expected boolean state in if at source line 198', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 333
    it('should preserve the expected branch behavior in if at source line 203', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 335
    it('should preserve the expected branch behavior in if at source line 203', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 337
    it('should preserve the required serialized text in if at source line 203', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 356
    it('should preserve the expected branch behavior in if at source line 219', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 374
    it('should preserve the expected boolean state in if at source line 236', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 396
    it('should preserve the required collection contents in if at source line 253', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 398
    it('should preserve the boundary condition behavior in if at source line 254', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 402
    it('should preserve the expected branch behavior in if at source line 255', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 404
    it('should preserve the boundary condition behavior in if at source line 255', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 406
    it('should preserve the calculated cross-reference value in if at source line 255', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 416
    it('should preserve the expected boolean state in if at source line 259', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 427
    it('should preserve the expected branch behavior in if at source line 267', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 443
    it('should preserve the expected branch behavior in if at source line 282', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 445
    it('should execute the required cross-reference operation in if at source line 282', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 452
    it('should preserve the boundary condition behavior in if at source line 288', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 458
    it('should preserve iteration and index progression in if at source line 296', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 459
    it('should preserve the calculated cross-reference value in if at source line 297', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 465
    it('should preserve the expected branch behavior in if at source line 302', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 480
    it('should preserve the expected branch behavior in if at source line 313', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 483
    it('should preserve the expected branch behavior in if at source line 319', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 486
    it('should preserve the expected branch behavior in if at source line 320', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 491
    it('should preserve the expected boolean state in if at source line 322', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 3', () => {
    // Mutant ID: 494
    it('should preserve the combined condition behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 495
    it('should preserve the expected branch behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 496
    it('should preserve the combined condition behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 497
    it('should preserve the expected branch behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 498
    it('should preserve the combined condition behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 499
    it('should preserve the expected branch behavior in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 501
    it('should preserve the required serialized text in if at source line 327', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 507
    it('should preserve the required serialized text in if at source line 331', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 515
    it('should execute the required cross-reference operation in if at source line 337', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 516
    it('should preserve the required serialized text in if at source line 338', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 518
    it('should preserve the required serialized text in if at source line 342', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 528
    it('should execute the required cross-reference operation in catch at source line 358', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 536
    it('should preserve the expected branch behavior in while at source line 372', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 562
    it('should preserve the boundary condition behavior in while at source line 387', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 577
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 578
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 580
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 582
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 584
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 585
    it('should preserve token matching behavior in indexObjects at source line 404', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 589
    it('should preserve token matching behavior in indexObjects at source line 406', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 593
    it('should preserve token matching behavior in indexObjects at source line 406', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 597
    it('should preserve token matching behavior in indexObjects at source line 406', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 599
    it('should preserve token matching behavior in indexObjects at source line 406', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 601
    it('should preserve token matching behavior in indexObjects at source line 406', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 609
    it('should preserve the boundary condition behavior in while at source line 421', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 615
    it('should preserve the expected branch behavior in if at source line 423', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 616
    it('should preserve the combined condition behavior in if at source line 423', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 625
    it('should preserve the expected branch behavior in if at source line 423', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 632
    it('should execute the required cross-reference operation in if at source line 427', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 4', () => {
    // Mutant ID: 635
    it('should preserve the expected branch behavior in if at source line 430', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 637
    it('should preserve the boundary condition behavior in if at source line 430', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 640
    it('should preserve the expected branch behavior in if at source line 434', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 643
    it('should preserve the boundary condition behavior in if at source line 434', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 644
    it('should preserve the expected branch behavior in if at source line 434', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 647
    it('should preserve the expected branch behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 648
    it('should preserve the combined condition behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 649
    it('should preserve the method result in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 650
    it('should preserve the required serialized text in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 651
    it('should preserve the expected branch behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 652
    it('should preserve the combined condition behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 653
    it('should preserve the expected branch behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 654
    it('should preserve the boundary condition behavior in if at source line 439', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 664
    it('should preserve the expected boolean state in if at source line 451', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 670
    it('should preserve the expected branch behavior in if at source line 455', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 682
    it('should preserve the calculated cross-reference value in if at source line 469', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 685
    it('should preserve the expected boolean state in if at source line 474', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 687
    it('should preserve the boundary condition behavior in while at source line 476', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 694
    it('should preserve the expected branch behavior in if at source line 481', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 697
    it('should execute the required cross-reference operation in if at source line 484', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 699
    it('should preserve the expected branch behavior in if at source line 486', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 700
    it('should preserve the combined condition behavior in if at source line 486', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 706
    it('should preserve the combined condition behavior in if at source line 495', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 708
    it('should preserve the boundary condition behavior in if at source line 495', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 710
    it('should preserve the expected branch behavior in if at source line 495', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 711
    it('should preserve the boundary condition behavior in if at source line 495', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 715
    it('should preserve the calculated cross-reference value in if at source line 496', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 716
    it('should preserve the calculated cross-reference value in if at source line 497', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 720
    it('should preserve the combined condition behavior in if at source line 501', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 722
    it('should preserve the required serialized text in if at source line 501', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 5', () => {
    // Mutant ID: 723
    it('should preserve the expected branch behavior in if at source line 501', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 744
    it('should preserve the expected boolean state in if at source line 517', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 753
    it('should preserve the expected branch behavior in if at source line 523', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 754
    it('should execute the required cross-reference operation in if at source line 523', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 759
    it('should preserve the expected branch behavior in if at source line 528', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 760
    it('should execute the required cross-reference operation in if at source line 528', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 764
    it('should preserve the expected branch behavior in if at source line 532', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 765
    it('should execute the required cross-reference operation in if at source line 532', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 770
    it('should preserve the expected branch behavior in if at source line 536', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 772
    it('should preserve the required serialized text in if at source line 536', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 775
    it('should execute the required cross-reference operation in catch at source line 540', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 789
    it('should preserve the expected branch behavior in if at source line 557', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 806
    it('should preserve the expected branch behavior in if at source line 575', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 867
    it('should preserve the required serialized text in if at source line 625', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 875
    it('should preserve the expected branch behavior in if at source line 627', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 918
    it('should preserve the required serialized text in if at source line 676', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 929
    it('should preserve the required serialized text in if at source line 679', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 972
    it('should preserve the expected branch behavior in switch at source line 715', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 987
    it('should preserve the expected boolean state in if at source line 731', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1009
    it('should preserve the expected branch behavior in if at source line 766', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1011
    it('should preserve the combined condition behavior in if at source line 766', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1012
    it('should preserve the expected branch behavior in if at source line 766', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1013
    it('should preserve the boundary condition behavior in if at source line 766', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1017
    it('should preserve the expected branch behavior in if at source line 767', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1019
    it('should preserve the expected branch behavior in if at source line 770', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1020
    it('should preserve the expected branch behavior in if at source line 770', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1021
    it('should execute the required cross-reference operation in if at source line 770', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1031
    it('should preserve the expected branch behavior in if at source line 781', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1033
    it('should preserve the combined condition behavior in if at source line 781', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1035
    it('should preserve the expected branch behavior in if at source line 785', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 6', () => {
    // Mutant ID: 1037
    it('should preserve the boundary condition behavior in if at source line 785', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1042
    it('should preserve the expected branch behavior in if at source line 792', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1046
    it('should preserve the expected branch behavior in if at source line 798', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1058
    it('should preserve the expected branch behavior in if at source line 810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1060
    it('should preserve the combined condition behavior in if at source line 810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1070
    it('should preserve the expected boolean state in if at source line 817', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1072
    it('should preserve the expected branch behavior in if at source line 817', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1092
    it('should preserve the expected branch behavior in if at source line 842', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1093
    it('should preserve the combined condition behavior in if at source line 842', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1103
    it('should preserve the expected branch behavior in if at source line 849', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1105
    it('should preserve the boundary condition behavior in if at source line 849', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1122
    it('should preserve the expected branch behavior in if at source line 858', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1126
    it('should preserve the expected branch behavior in if at source line 865', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1130
    it('should preserve the combined condition behavior in if at source line 865', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1132
    it('should preserve the expected branch behavior in if at source line 867', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1134
    it('should preserve the boundary condition behavior in if at source line 867', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1137
    it('should preserve the expected branch behavior in if at source line 872', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1145
    it('should preserve the expected branch behavior in if at source line 874', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1146
    it('should preserve the combined condition behavior in if at source line 874', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1152
    it('should preserve the expected branch behavior in if at source line 876', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1154
    it('should preserve the boundary condition behavior in if at source line 876', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1164
    it('should preserve the boundary condition behavior in if at source line 895', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1166
    it('should execute the required cross-reference operation in if at source line 895', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1168
    it('should preserve the calculated cross-reference value in if at source line 899', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1170
    it('should preserve the calculated cross-reference value in if at source line 902', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1171
    it('should preserve the required serialized text in if at source line 904', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1178
    it('should preserve the expected branch behavior in if at source line 912', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1180
    it('should preserve the boundary condition behavior in if at source line 912', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1188
    it('should preserve the expected branch behavior in if at source line 919', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1190
    it('should preserve the boundary condition behavior in if at source line 919', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 7', () => {
    // Mutant ID: 1199
    it('should preserve the required serialized text in if at source line 934', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1207
    it('should preserve the required serialized text in if at source line 941', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1208
    it('should preserve the expected branch behavior in if at source line 942', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1215
    it('should preserve the calculated cross-reference value in updatedDictionary at source line 948', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1216
    it('should preserve the expected boolean state in updatedDictionary at source line 950', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1218
    it('should preserve the required serialized text in writeXrefTable at source line 954', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1221
    it('should preserve the required serialized text in writeXrefTable at source line 958', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1222
    it('should preserve the expected branch behavior in if at source line 959', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1229
    it('should execute the required cross-reference operation in if at source line 962', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1231
    it('should preserve the required serialized text in if at source line 963', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1233
    it('should preserve the calculated cross-reference value in if at source line 966', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1251
    it('should preserve the required serialized text in writeXref at source line 982', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1267
    it('should preserve the combined condition behavior in if at source line 997', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1268
    it('should preserve the expected branch behavior in if at source line 997', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1270
    it('should preserve the required serialized text in if at source line 997', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1271
    it('should preserve the expected branch behavior in if at source line 997', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1282
    it('should preserve the expected branch behavior in if at source line 1001', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1285
    it('should preserve the required serialized text in if at source line 1002', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1293
    it('should preserve the expected branch behavior in if at source line 1005', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1300
    it('should preserve the expected branch behavior in if at source line 1008', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1301
    it('should preserve the boundary condition behavior in if at source line 1008', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1307
    it('should preserve the calculated cross-reference value in computeMessageDigest at source line 1018', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1308
    it('should preserve the required collection contents in computeMessageDigest at source line 1019', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1309
    it('should preserve the required serialized text in computeMessageDigest at source line 1019', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1310
    it('should preserve the required serialized text in computeMessageDigest at source line 1020', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1312
    it('should preserve the expected branch behavior in if at source line 1022', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1314
    it('should execute the required cross-reference operation in if at source line 1022', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1315
    it('should execute the required cross-reference operation in if at source line 1023', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1316
    it('should preserve the expected branch behavior in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1317
    it('should preserve the expected branch behavior in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 8', () => {
    // Mutant ID: 1318
    it('should preserve the combined condition behavior in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1319
    it('should preserve the expected branch behavior in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1320
    it('should preserve the boundary condition behavior in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1321
    it('should preserve the required serialized text in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1322
    it('should execute the required cross-reference operation in if at source line 1024', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1323
    it('should execute the required cross-reference operation in if at source line 1029', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1324
    it('should preserve the required collection contents in if at source line 1032', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1325
    it('should execute the required cross-reference operation in if at source line 1033', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1332
    it('should preserve the combined condition behavior in if at source line 1045', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1355
    it('should preserve the required serialized text in if at source line 1061', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1358
    it('should preserve the expected branch behavior in if at source line 1063', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1359
    it('should execute the required cross-reference operation in if at source line 1063', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1360
    it('should preserve the required serialized text in if at source line 1064', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1361
    it('should preserve the required serialized text in if at source line 1064', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1362
    it('should preserve the expected branch behavior in if at source line 1066', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1366
    it('should execute the required cross-reference operation in if at source line 1069', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1367
    it('should preserve the required serialized text in if at source line 1070', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1368
    it('should preserve the required serialized text in if at source line 1073', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1374
    it('should preserve the expected branch behavior in if at source line 1078', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1375
    it('should execute the required cross-reference operation in if at source line 1078', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1381
    it('should preserve the expected branch behavior in if at source line 1082', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1385
    it('should preserve the required serialized text in if at source line 1086', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1387
    it('should execute the required cross-reference operation in if at source line 1089', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1388
    it('should preserve the required serialized text in if at source line 1090', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1416
    it('should preserve the expected branch behavior in if at source line 1110', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1419
    it('should preserve the required serialized text in if at source line 1110', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1426
    it('should preserve the combined condition behavior in if at source line 1116', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1431
    it('should preserve the expected branch behavior in if at source line 1122', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1432
    it('should execute the required cross-reference operation in if at source line 1122', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1433
    it('should preserve the expected branch behavior in if at source line 1125', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 9', () => {
    // Mutant ID: 1434
    it('should preserve the expected branch behavior in if at source line 1125', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1435
    it('should execute the required cross-reference operation in if at source line 1125', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1442
    it('should preserve the expected branch behavior in if at source line 1129', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1443
    it('should preserve the boundary condition behavior in if at source line 1129', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1447
    it('should preserve the expected branch behavior in if at source line 1131', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1450
    it('should preserve the expected branch behavior in if at source line 1133', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1458
    it('should preserve the expected branch behavior in if at source line 1145', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1469
    it('should preserve the required serialized text in if at source line 1153', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1470
    it('should preserve the required serialized text in if at source line 1154', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1471
    it('should preserve the required serialized text in if at source line 1155', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1472
    it('should preserve the required serialized text in if at source line 1156', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1473
    it('should execute the required cross-reference operation in createFontReference at source line 1158', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1474
    it('should preserve the expected branch behavior in if at source line 1159', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1475
    it('should preserve the expected branch behavior in if at source line 1159', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1476
    it('should execute the required cross-reference operation in if at source line 1159', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1477
    it('should preserve the expected boolean state in if at source line 1161', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1478
    it('should preserve the expected branch behavior in if at source line 1161', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1479
    it('should preserve the expected branch behavior in if at source line 1161', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1480
    it('should execute the required cross-reference operation in if at source line 1161', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1486
    it('should preserve the expected branch behavior in if at source line 1164', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1513
    it('should preserve the expected branch behavior in if at source line 1198', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1516
    it('should preserve the required serialized text in if at source line 1198', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1520
    it('should preserve the expected branch behavior in if at source line 1201', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1564
    it('should preserve the boundary condition behavior in if at source line 1227', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1597
    it('should preserve the expected branch behavior in if at source line 1252', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1648
    it('should preserve the expected branch behavior in if at source line 1314', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1651
    it('should preserve the expected branch behavior in if at source line 1318', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1654
    it('should preserve the expected branch behavior in if at source line 1321', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1658
    it('should preserve the expected branch behavior in if at source line 1324', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1659
    it('should execute the required cross-reference operation in if at source line 1324', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 10', () => {
    // Mutant ID: 1660
    it('should preserve the expected branch behavior in if at source line 1327', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1664
    it('should preserve the required collection contents in if at source line 1331', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1668
    it('should preserve the expected branch behavior in if at source line 1350', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1669
    it('should preserve the expected branch behavior in if at source line 1350', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1670
    it('should preserve the boundary condition behavior in if at source line 1350', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1671
    it('should preserve the boundary condition behavior in if at source line 1350', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1672
    it('should execute the required cross-reference operation in if at source line 1350', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1673
    it('should preserve the expected branch behavior in if at source line 1354', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1675
    it('should preserve the boundary condition behavior in if at source line 1354', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1680
    it('should preserve the expected branch behavior in if at source line 1356', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1683
    it('should preserve the expected branch behavior in if at source line 1358', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1684
    it('should preserve the expected branch behavior in if at source line 1358', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1685
    it('should preserve the boundary condition behavior in if at source line 1358', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1686
    it('should preserve the boundary condition behavior in if at source line 1358', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1687
    it('should execute the required cross-reference operation in if at source line 1358', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1713
    it('should preserve the expected branch behavior in if at source line 1388', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1724
    it('should preserve iteration and index progression in if at source line 1393', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1725
    it('should preserve the expected branch behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1726
    it('should preserve the expected branch behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1727
    it('should preserve the combined condition behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1728
    it('should preserve the expected branch behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1729
    it('should preserve the boundary condition behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1730
    it('should preserve the boundary condition behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1731
    it('should preserve the expected branch behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1732
    it('should preserve the boundary condition behavior in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1733
    it('should preserve the calculated cross-reference value in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1734
    it('should execute the required cross-reference operation in if at source line 1394', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1740
    it('should preserve the expected branch behavior in if at source line 1403', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1741
    it('should preserve the expected branch behavior in if at source line 1403', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1742
    it('should preserve the boundary condition behavior in if at source line 1403', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 11', () => {
    // Mutant ID: 1743
    it('should preserve the boundary condition behavior in if at source line 1403', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1744
    it('should execute the required cross-reference operation in if at source line 1403', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1746
    it('should preserve the expected branch behavior in if at source line 1408', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1752
    it('should preserve the expected branch behavior in if at source line 1408', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1753
    it('should preserve the boundary condition behavior in if at source line 1408', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1772
    it('should preserve the expected branch behavior in if at source line 1430', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1775
    it('should preserve the expected branch behavior in if at source line 1430', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1783
    it('should preserve the expected branch behavior in if at source line 1432', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1786
    it('should preserve the expected boolean state in if at source line 1432', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1795
    it('should preserve the expected branch behavior in if at source line 1448', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1798
    it('should preserve the expected branch behavior in if at source line 1449', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1800
    it('should preserve the combined condition behavior in if at source line 1449', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1803
    it('should preserve the expected branch behavior in if at source line 1450', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1806
    it('should preserve the expected boolean state in if at source line 1453', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1807
    it('should preserve the expected branch behavior in if at source line 1456', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1809
    it('should preserve the combined condition behavior in if at source line 1456', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1810
    it('should preserve the expected branch behavior in if at source line 1456', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1811
    it('should preserve the combined condition behavior in if at source line 1456', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1824
    it('should preserve the expected branch behavior in if at source line 1463', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1826
    it('should preserve the required serialized text in if at source line 1463', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1827
    it('should preserve the expected branch behavior in if at source line 1463', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1829
    it('should preserve the required serialized text in if at source line 1463', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1833
    it('should preserve the calculated cross-reference value in writeToBuffer at source line 1471', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1836
    it('should preserve the boundary condition behavior in if at source line 1474', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1863
    it('should preserve the required collection contents in switch at source line 1508', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1865
    it('should preserve the calculated cross-reference value in switch at source line 1509', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1866
    it('should preserve the required serialized text in switch at source line 1509', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1867
    it('should preserve the expected branch behavior in switch at source line 1510', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1872
    it('should preserve the expected branch behavior in switch at source line 1517', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1873
    it('should preserve the expected branch behavior in switch at source line 1517', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 12', () => {
    // Mutant ID: 1875
    it('should preserve the combined condition behavior in switch at source line 1517', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1876
    it('should preserve the expected branch behavior in switch at source line 1517', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1877
    it('should preserve the boundary condition behavior in switch at source line 1517', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1880
    it('should preserve the expected branch behavior in if at source line 1518', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1883
    it('should preserve the expected branch behavior in if at source line 1521', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1884
    it('should preserve the expected branch behavior in if at source line 1521', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1885
    it('should execute the required cross-reference operation in if at source line 1521', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1895
    it('should preserve the expected boolean state in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1896
    it('should preserve the expected branch behavior in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1897
    it('should preserve the expected branch behavior in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1898
    it('should preserve the expected branch behavior in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1899
    it('should preserve the expected branch behavior in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1900
    it('should preserve the boundary condition behavior in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1901
    it('should preserve the calculated cross-reference value in if at source line 1530', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1905
    it('should preserve the expected branch behavior in if at source line 1532', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1906
    it('should preserve the expected branch behavior in if at source line 1535', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1919
    it('should preserve the expected branch behavior in if at source line 1545', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1920
    it('should preserve the expected branch behavior in if at source line 1545', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1922
    it('should preserve the boundary condition behavior in if at source line 1545', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1926
    it('should preserve the expected branch behavior in if at source line 1547', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1931
    it('should preserve the expected branch behavior in if at source line 1555', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1934
    it('should preserve the expected branch behavior in if at source line 1555', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1938
    it('should preserve the expected branch behavior in if at source line 1557', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1942
    it('should preserve the expected branch behavior in if at source line 1561', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1946
    it('should preserve the expected branch behavior in if at source line 1565', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1947
    it('should preserve the expected branch behavior in if at source line 1565', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1949
    it('should preserve the boundary condition behavior in if at source line 1565', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1953
    it('should preserve the expected branch behavior in if at source line 1567', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1965
    it('should preserve the expected branch behavior in if at source line 1581', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1966
    it('should preserve the expected branch behavior in if at source line 1581', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 13', () => {
    // Mutant ID: 1968
    it('should preserve the combined condition behavior in if at source line 1581', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1969
    it('should preserve the expected branch behavior in if at source line 1581', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1970
    it('should preserve the boundary condition behavior in if at source line 1581', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 1983
    it('should preserve the expected branch behavior in if at source line 1589', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 1984
    it('should preserve the expected branch behavior in if at source line 1592', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 1988
    it('should preserve the expected boolean state in if at source line 1596', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 1989
    it('should preserve the expected branch behavior in if at source line 1596', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 1990
    it('should preserve the expected branch behavior in if at source line 1596', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 1991
    it('should execute the required cross-reference operation in if at source line 1596', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 1992
    it('should preserve the required collection contents in if at source line 1601', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2004
    it('should preserve the boundary condition behavior in switch at source line 1616', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2007
    it('should preserve the expected boolean state in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2008
    it('should preserve the expected branch behavior in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2009
    it('should preserve the expected branch behavior in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2010
    it('should preserve the expected branch behavior in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2011
    it('should preserve the expected branch behavior in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2012
    it('should preserve the boundary condition behavior in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2013
    it('should preserve the calculated cross-reference value in switch at source line 1618', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2017
    it('should preserve the expected branch behavior in switch at source line 1620', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2018
    it('should preserve the expected branch behavior in switch at source line 1623', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2027
    it('should preserve the required collection contents in switch at source line 1639', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2032
    it('should preserve the expected boolean state in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2033
    it('should preserve the expected branch behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2034
    it('should preserve the expected branch behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2035
    it('should preserve the expected branch behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2036
    it('should preserve the expected branch behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2037
    it('should preserve the boundary condition behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2038
    it('should preserve the boundary condition behavior in switch at source line 1648', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2041
    it('should preserve the expected branch behavior in switch at source line 1650', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2042
    it('should preserve the expected branch behavior in switch at source line 1653', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 14', () => {
    // Mutant ID: 2043
    it('should preserve the expected boolean state in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2044
    it('should preserve the expected branch behavior in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2045
    it('should preserve the expected branch behavior in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2046
    it('should preserve the expected branch behavior in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2047
    it('should preserve the expected branch behavior in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2048
    it('should preserve the boundary condition behavior in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2049
    it('should preserve the calculated cross-reference value in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2050
    it('should preserve iteration and index progression in switch at source line 1654', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2053
    it('should execute the required cross-reference operation in switch at source line 1655', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2054
    it('should preserve the expected branch behavior in switch at source line 1656', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2055
    it('should preserve the expected branch behavior in switch at source line 1659', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2063
    it('should preserve the expected branch behavior in switch at source line 1667', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2066
    it('should preserve the expected boolean state in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2067
    it('should preserve the expected branch behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2068
    it('should preserve the expected branch behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2069
    it('should preserve the expected branch behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2070
    it('should preserve the expected branch behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2071
    it('should preserve the boundary condition behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2072
    it('should preserve the boundary condition behavior in switch at source line 1669', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2075
    it('should preserve the expected branch behavior in switch at source line 1671', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2076
    it('should preserve the expected branch behavior in switch at source line 1674', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2077
    it('should preserve the expected boolean state in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2078
    it('should preserve the expected branch behavior in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2079
    it('should preserve the expected branch behavior in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2080
    it('should preserve the expected branch behavior in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2081
    it('should preserve the expected branch behavior in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2082
    it('should preserve the boundary condition behavior in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2083
    it('should preserve the calculated cross-reference value in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2084
    it('should preserve iteration and index progression in switch at source line 1675', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2087
    it('should execute the required cross-reference operation in switch at source line 1676', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 15', () => {
    // Mutant ID: 2088
    it('should preserve the expected branch behavior in switch at source line 1677', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2089
    it('should preserve the expected branch behavior in switch at source line 1680', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2103
    it('should preserve the expected branch behavior in switch at source line 1692', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2115
    it('should preserve the boundary condition behavior in if at source line 1708', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2141
    it('should preserve the expected branch behavior in switch at source line 1752', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2145
    it('should preserve the expected branch behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2146
    it('should preserve the expected branch behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2148
    it('should preserve the combined condition behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2149
    it('should preserve the expected branch behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2150
    it('should preserve the combined condition behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2151
    it('should preserve the expected branch behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2152
    it('should preserve the combined condition behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2153
    it('should preserve the expected branch behavior in switch at source line 1754', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2158
    it('should preserve the expected branch behavior in if at source line 1756', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2164
    it('should preserve the expected branch behavior in if at source line 1761', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2165
    it('should preserve the expected branch behavior in if at source line 1761', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2167
    it('should preserve the boundary condition behavior in if at source line 1761', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2171
    it('should preserve the expected branch behavior in if at source line 1763', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2172
    it('should preserve the expected branch behavior in if at source line 1766', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2173
    it('should preserve the expected boolean state in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2174
    it('should preserve the expected branch behavior in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2175
    it('should preserve the expected branch behavior in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2176
    it('should preserve the expected branch behavior in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2177
    it('should preserve the expected branch behavior in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2178
    it('should preserve the boundary condition behavior in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2179
    it('should preserve the calculated cross-reference value in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2180
    it('should preserve iteration and index progression in if at source line 1767', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2183
    it('should execute the required cross-reference operation in if at source line 1768', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2184
    it('should preserve the expected branch behavior in if at source line 1769', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2185
    it('should preserve the expected branch behavior in if at source line 1772', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 16', () => {
    // Mutant ID: 2216
    it('should preserve the expected branch behavior in if at source line 1791', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2217
    it('should preserve the expected branch behavior in if at source line 1791', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2219
    it('should preserve the combined condition behavior in if at source line 1791', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2220
    it('should preserve the expected branch behavior in if at source line 1791', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2221
    it('should preserve the combined condition behavior in if at source line 1791', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2223
    it('should preserve the expected boolean state in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2224
    it('should preserve the expected branch behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2225
    it('should preserve the expected branch behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2226
    it('should preserve the expected branch behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2227
    it('should preserve the expected branch behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2228
    it('should preserve the boundary condition behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2229
    it('should preserve the boundary condition behavior in if at source line 1793', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2232
    it('should preserve the expected branch behavior in if at source line 1795', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2233
    it('should preserve the expected branch behavior in if at source line 1798', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2238
    it('should preserve the expected branch behavior in if at source line 1800', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2246
    it('should preserve the expected branch behavior in if at source line 1802', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2247
    it('should preserve the combined condition behavior in if at source line 1802', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2248
    it('should preserve the expected branch behavior in if at source line 1802', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2249
    it('should preserve the combined condition behavior in if at source line 1802', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2250
    it('should preserve the expected branch behavior in if at source line 1802', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2260
    it('should preserve the boundary condition behavior in if at source line 1804', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2264
    it('should preserve the expected branch behavior in if at source line 1806', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2265
    it('should preserve the expected branch behavior in if at source line 1809', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2266
    it('should preserve the expected boolean state in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2267
    it('should preserve the expected branch behavior in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2268
    it('should preserve the expected branch behavior in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2269
    it('should preserve the expected branch behavior in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2270
    it('should preserve the expected branch behavior in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2271
    it('should preserve the boundary condition behavior in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2272
    it('should preserve the calculated cross-reference value in if at source line 1810', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 17', () => {
    // Mutant ID: 2276
    it('should execute the required cross-reference operation in if at source line 1811', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2278
    it('should preserve the expected branch behavior in if at source line 1815', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2287
    it('should preserve the required serialized text in switch at source line 1836', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2295
    it('should preserve the expected branch behavior in if at source line 1847', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2300
    it('should preserve the expected branch behavior in if at source line 1850', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2304
    it('should preserve the expected branch behavior in if at source line 1851', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2305
    it('should preserve the expected branch behavior in if at source line 1851', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2309
    it('should preserve the combined condition behavior in if at source line 1851', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2310
    it('should preserve the expected branch behavior in if at source line 1851', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2317
    it('should preserve the calculated cross-reference value in if at source line 1854', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2318
    it('should preserve the required serialized text in if at source line 1854', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2319
    it('should preserve the required serialized text in if at source line 1854', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2320
    it('should preserve the required serialized text in if at source line 1854', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2321
    it('should preserve iteration and index progression in if at source line 1856', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2324
    it('should preserve the expected branch behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2325
    it('should preserve the expected branch behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2326
    it('should preserve the expected branch behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2327
    it('should preserve the combined condition behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2328
    it('should preserve the expected branch behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2329
    it('should preserve the boundary condition behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2330
    it('should preserve the boundary condition behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2331
    it('should preserve the expected branch behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2332
    it('should preserve the boundary condition behavior in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2333
    it('should preserve the calculated cross-reference value in if at source line 1857', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2336
    it('should preserve the expected branch behavior in if at source line 1859', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2337
    it('should preserve the expected branch behavior in if at source line 1862', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2338
    it('should preserve the expected boolean state in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2339
    it('should preserve the expected branch behavior in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2340
    it('should preserve the expected branch behavior in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2341
    it('should preserve the expected branch behavior in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 18', () => {
    // Mutant ID: 2342
    it('should preserve the expected branch behavior in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2343
    it('should preserve the boundary condition behavior in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2344
    it('should preserve the calculated cross-reference value in if at source line 1863', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2347
    it('should execute the required cross-reference operation in if at source line 1864', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2348
    it('should preserve the expected branch behavior in if at source line 1865', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2349
    it('should preserve the expected branch behavior in if at source line 1868', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2351
    it('should preserve the calculated cross-reference value in if at source line 1872', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2352
    it('should preserve the calculated cross-reference value in if at source line 1872', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2354
    it('should preserve the required serialized text in if at source line 1873', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2355
    it('should preserve the required serialized text in if at source line 1873', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2356
    it('should preserve the required serialized text in if at source line 1873', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2362
    it('should preserve the expected branch behavior in if at source line 1879', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2363
    it('should preserve the expected branch behavior in if at source line 1879', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2365
    it('should preserve the boundary condition behavior in if at source line 1879', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2369
    it('should preserve the expected branch behavior in if at source line 1881', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2382
    it('should preserve the expected branch behavior in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2383
    it('should preserve the boundary condition behavior in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2384
    it('should preserve the boundary condition behavior in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2385
    it('should preserve the expected branch behavior in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2386
    it('should preserve the boundary condition behavior in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2387
    it('should preserve the required serialized text in createEncryptDictionary at source line 1900', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2389
    it('should preserve the expected boolean state in createEncryptDictionary at source line 1903', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2397
    it('should preserve the expected branch behavior in if at source line 1911', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2402
    it('should preserve the expected branch behavior in if at source line 1914', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2408
    it('should preserve the required serialized text in if at source line 1916', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2409
    it('should preserve the expected branch behavior in if at source line 1918', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2410
    it('should preserve the expected branch behavior in if at source line 1918', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2411
    it('should preserve the boundary condition behavior in if at source line 1918', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2412
    it('should execute the required cross-reference operation in if at source line 1918', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2413
    it('should preserve the required serialized text in if at source line 1919', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 19', () => {
    // Mutant ID: 2415
    it('should preserve the required serialized text in if at source line 1920', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2418
    it('should preserve the required serialized text in if at source line 1924', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2419
    it('should preserve the required serialized text in if at source line 1924', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2424
    it('should preserve the expected branch behavior in if at source line 1928', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2426
    it('should preserve the boundary condition behavior in if at source line 1928', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2433
    it('should preserve the expected boolean state in if at source line 1929', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2434
    it('should preserve the expected boolean state in if at source line 1929', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2440
    it('should preserve the required serialized text in if at source line 1930', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2441
    it('should preserve the expected boolean state in if at source line 1930', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2442
    it('should preserve the expected boolean state in if at source line 1930', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2450
    it('should preserve the expected branch behavior in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2451
    it('should preserve the expected branch behavior in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2452
    it('should preserve the combined condition behavior in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2453
    it('should preserve the expected branch behavior in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2454
    it('should preserve the boundary condition behavior in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2455
    it('should preserve the required serialized text in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2456
    it('should execute the required cross-reference operation in if at source line 1939', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2467
    it('should preserve the expected branch behavior in if at source line 1948', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2468
    it('should preserve the boundary condition behavior in if at source line 1948', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2469
    it('should preserve the required serialized text in if at source line 1948', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2470
    it('should execute the required cross-reference operation in if at source line 1948', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2478
    it('should preserve the expected branch behavior in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2479
    it('should preserve the expected branch behavior in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2480
    it('should preserve the combined condition behavior in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2481
    it('should preserve the expected branch behavior in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2482
    it('should preserve the boundary condition behavior in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2483
    it('should preserve the required serialized text in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2484
    it('should execute the required cross-reference operation in if at source line 1957', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2496
    it('should preserve the expected boolean state in if at source line 1975', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2499
    it('should preserve the expected branch behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 20', () => {
    // Mutant ID: 2500
    it('should preserve the expected branch behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2501
    it('should preserve the combined condition behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2502
    it('should preserve the expected branch behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2503
    it('should preserve the boundary condition behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2504
    it('should preserve the required serialized text in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2505
    it('should preserve the expected branch behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2506
    it('should preserve the boundary condition behavior in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2507
    it('should execute the required cross-reference operation in if at source line 1982', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2557
    it('should preserve the expected branch behavior in if at source line 2025', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2559
    it('should preserve the combined condition behavior in if at source line 2025', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2560
    it('should preserve the expected branch behavior in if at source line 2025', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2567
    it('should preserve the expected branch behavior in if at source line 2028', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2570
    it('should preserve the expected branch behavior in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2571
    it('should preserve the expected branch behavior in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2572
    it('should preserve the combined condition behavior in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2574
    it('should preserve the expected branch behavior in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2575
    it('should preserve the boundary condition behavior in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2576
    it('should execute the required cross-reference operation in if at source line 2031', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2592
    it('should preserve the expected branch behavior in if at source line 2048', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2595
    it('should preserve the expected branch behavior in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2596
    it('should preserve the expected branch behavior in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2597
    it('should preserve the combined condition behavior in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2599
    it('should preserve the expected branch behavior in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2600
    it('should preserve the boundary condition behavior in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2601
    it('should execute the required cross-reference operation in if at source line 2051', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2606
    it('should preserve the expected branch behavior in if at source line 2055', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2607
    it('should preserve the expected branch behavior in if at source line 2055', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2617
    it('should preserve the combined condition behavior in if at source line 2064', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2639
    it('should preserve the expected boolean state in if at source line 2087', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2651
    it('should preserve the expected branch behavior in if at source line 2091', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 21', () => {
    // Mutant ID: 2653
    it('should preserve the required serialized text in if at source line 2091', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2664
    it('should preserve the expected boolean state in if at source line 2096', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2679
    it('should preserve the expected branch behavior in if at source line 2115', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2779
    it('should preserve the expected branch behavior in if at source line 2177', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 2807
    it('should preserve the expected branch behavior in if at source line 2184', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 2808
    it('should preserve the boundary condition behavior in if at source line 2184', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 2827
    it('should preserve the expected branch behavior in if at source line 2204', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 2909
    it('should preserve the expected branch behavior in if at source line 2287', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 2937
    it('should preserve the expected branch behavior in if at source line 2304', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 2987
    it('should preserve the combined condition behavior in areEqual at source line 2325', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2990
    it('should preserve the expected branch behavior in if at source line 2328', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2991
    it('should preserve the combined condition behavior in if at source line 2328', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 2998
    it('should preserve the expected branch behavior in if at source line 2333', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3028
    it('should preserve the expected branch behavior in if at source line 2347', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3029
    it('should preserve the expected branch behavior in if at source line 2347', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3030
    it('should preserve the boundary condition behavior in if at source line 2347', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3031
    it('should preserve the required serialized text in if at source line 2347', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3034
    it('should preserve the expected branch behavior in if at source line 2348', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3035
    it('should execute the required cross-reference operation in if at source line 2348', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3043
    it('should preserve the expected branch behavior in if at source line 2354', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3054
    it('should preserve the expected branch behavior in if at source line 2354', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3055
    it('should preserve the boundary condition behavior in if at source line 2354', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3056
    it('should preserve the required serialized text in if at source line 2354', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3065
    it('should preserve the expected branch behavior in if at source line 2356', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3084
    it('should preserve the expected branch behavior in if at source line 2372', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3086
    it('should preserve the required serialized text in if at source line 2372', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3087
    it('should execute the required cross-reference operation in if at source line 2372', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3112
    it('should preserve the expected branch behavior in if at source line 2391', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3113
    it('should preserve the combined condition behavior in if at source line 2391', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3114
    it('should execute the required cross-reference operation in if at source line 2391', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 22', () => {
    // Mutant ID: 3138
    it('should preserve the combined condition behavior in if at source line 2397', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3140
    it('should preserve the expected branch behavior in if at source line 2402', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3142
    it('should preserve the combined condition behavior in if at source line 2402', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3144
    it('should preserve the expected boolean state in if at source line 2403', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3145
    it('should preserve the expected branch behavior in if at source line 2405', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3150
    it('should preserve the combined condition behavior in if at source line 2407', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3158
    it('should preserve the boundary condition behavior in if at source line 2411', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3170
    it('should preserve the combined condition behavior in if at source line 2418', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3172
    it('should preserve the expected boolean state in if at source line 2419', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3174
    it('should preserve the expected branch behavior in if at source line 2421', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3183
    it('should preserve the expected branch behavior in if at source line 2429', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3184
    it('should preserve the combined condition behavior in if at source line 2429', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3187
    it('should execute the required cross-reference operation in if at source line 2429', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3189
    it('should preserve the expected branch behavior in if at source line 2432', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3191
    it('should preserve the combined condition behavior in if at source line 2432', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3194
    it('should preserve the expected branch behavior in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3196
    it('should preserve the expected branch behavior in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3197
    it('should preserve the combined condition behavior in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3198
    it('should preserve the expected branch behavior in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3199
    it('should preserve the combined condition behavior in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3200
    it('should preserve the required serialized text in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3201
    it('should preserve the required serialized text in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3202
    it('should execute the required cross-reference operation in if at source line 2433', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3213
    it('should preserve the expected branch behavior in if at source line 2448', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3214
    it('should preserve the combined condition behavior in if at source line 2448', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3219
    it('should execute the required cross-reference operation in if at source line 2448', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3232
    it('should preserve the expected branch behavior in if at source line 2457', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3234
    it('should execute the required cross-reference operation in if at source line 2457', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3238
    it('should preserve the combined condition behavior in if at source line 2460', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3250
    it('should preserve the boundary condition behavior in if at source line 2466', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 23', () => {
    // Mutant ID: 3259
    it('should preserve the expected branch behavior in if at source line 2471', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3261
    it('should preserve the expected branch behavior in if at source line 2471', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3262
    it('should preserve the combined condition behavior in if at source line 2471', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3263
    it('should preserve the expected boolean state in if at source line 2471', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3264
    it('should preserve the expected boolean state in if at source line 2471', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3272
    it('should preserve the expected branch behavior in if at source line 2478', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3273
    it('should preserve the required serialized text in if at source line 2478', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3274
    it('should execute the required cross-reference operation in if at source line 2478', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3275
    it('should preserve the required serialized text in if at source line 2479', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3300
    it('should preserve the expected branch behavior in if at source line 2496', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3301
    it('should preserve the expected branch behavior in if at source line 2496', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3302
    it('should preserve the boundary condition behavior in if at source line 2496', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3303
    it('should execute the required cross-reference operation in if at source line 2496', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3316
    it('should preserve the boundary condition behavior in if at source line 2505', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3318
    it('should preserve iteration and index progression in if at source line 2505', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3321
    it('should preserve the expected branch behavior in if at source line 2507', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3322
    it('should execute the required cross-reference operation in if at source line 2507', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3323
    it('should preserve the expected boolean state in if at source line 2510', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3324
    it('should preserve the expected branch behavior in if at source line 2510', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3325
    it('should preserve the expected branch behavior in if at source line 2510', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3329
    it('should preserve the expected branch behavior in if at source line 2515', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3333
    it('should preserve the expected boolean state in if at source line 2519', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3334
    it('should preserve the expected branch behavior in if at source line 2519', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3335
    it('should preserve the expected branch behavior in if at source line 2519', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3363
    it('should preserve the expected boolean state in if at source line 2535', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3364
    it('should preserve the expected branch behavior in if at source line 2535', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3365
    it('should preserve the expected branch behavior in if at source line 2535', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3368
    it('should preserve the expected branch behavior in if at source line 2538', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3369
    it('should preserve the expected branch behavior in if at source line 2538', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3370
    it('should preserve the boundary condition behavior in if at source line 2538', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 24', () => {
    // Mutant ID: 3371
    it('should preserve the required serialized text in if at source line 2538', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3374
    it('should preserve the expected boolean state in if at source line 2542', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3420
    it('should preserve the expected branch behavior in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3421
    it('should preserve the expected branch behavior in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3422
    it('should preserve the combined condition behavior in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3423
    it('should preserve the required serialized text in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3424
    it('should preserve the required serialized text in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3425
    it('should execute the required cross-reference operation in if at source line 2580', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3426
    it('should preserve the required serialized text in if at source line 2581', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3427
    it('should preserve the required serialized text in if at source line 2582', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3429
    it('should preserve the expected branch behavior in if at source line 2583', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3432
    it('should preserve the combined condition behavior in if at source line 2583', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3433
    it('should preserve the expected branch behavior in if at source line 2583', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3434
    it('should preserve the boundary condition behavior in if at source line 2583', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3435
    it('should execute the required cross-reference operation in if at source line 2583', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3439
    it('should preserve the expected branch behavior in if at source line 2589', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3445
    it('should preserve the combined condition behavior in if at source line 2589', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3446
    it('should preserve the expected branch behavior in if at source line 2589', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3448
    it('should preserve the expected branch behavior in if at source line 2590', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3449
    it('should preserve the combined condition behavior in if at source line 2590', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3450
    it('should preserve the expected branch behavior in if at source line 2590', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3451
    it('should preserve the boundary condition behavior in if at source line 2590', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3483
    it('should preserve the expected branch behavior in if at source line 2603', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3504
    it('should preserve the expected branch behavior in if at source line 2616', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3506
    it('should preserve the boundary condition behavior in if at source line 2616', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3516
    it('should preserve the combined condition behavior in if at source line 2619', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3517
    it('should preserve the expected branch behavior in if at source line 2619', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3518
    it('should preserve the combined condition behavior in if at source line 2619', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3519
    it('should preserve the expected branch behavior in if at source line 2621', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3528
    it('should preserve the expected branch behavior in if at source line 2626', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 25', () => {
    // Mutant ID: 3529
    it('should execute the required cross-reference operation in if at source line 2626', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3538
    it('should preserve the expected branch behavior in if at source line 2634', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3543
    it('should preserve the required serialized text in if at source line 2636', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3544
    it('should preserve the expected branch behavior in if at source line 2637', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3547
    it('should preserve the method result in if at source line 2638', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3553
    it('should preserve the expected branch behavior in if at source line 2639', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3565
    it('should preserve the expected branch behavior in if at source line 2643', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3571
    it('should preserve the expected branch behavior in if at source line 2646', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3576
    it('should preserve the expected branch behavior in if at source line 2649', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3578
    it('should preserve the combined condition behavior in if at source line 2649', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3579
    it('should preserve the expected branch behavior in if at source line 2649', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3580
    it('should preserve the combined condition behavior in if at source line 2649', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3586
    it('should preserve the required serialized text in if at source line 2657', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3587
    it('should preserve the required serialized text in if at source line 2659', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3590
    it('should preserve the combined condition behavior in if at source line 2661', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3592
    it('should preserve the expected branch behavior in if at source line 2662', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3610
    it('should preserve the boundary condition behavior in checkFormFieldRemoved at source line 2678', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3612
    it('should preserve iteration and index progression in checkFormFieldRemoved at source line 2678', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3618
    it('should preserve the expected branch behavior in if at source line 2681', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3627
    it('should preserve the expected branch behavior in if at source line 2687', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3636
    it('should preserve the expected branch behavior in if at source line 2698', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3638
    it('should execute the required cross-reference operation in if at source line 2698', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3642
    it('should preserve the combined condition behavior in if at source line 2701', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3654
    it('should preserve the boundary condition behavior in arrayContains at source line 2707', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3663
    it('should preserve the expected branch behavior in if at source line 2712', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3665
    it('should preserve the expected branch behavior in if at source line 2712', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3666
    it('should preserve the combined condition behavior in if at source line 2712', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3667
    it('should preserve the expected boolean state in if at source line 2712', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3668
    it('should preserve the expected boolean state in if at source line 2712', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3676
    it('should preserve the expected branch behavior in checkSubTypeSingle at source line 2721', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 26', () => {
    // Mutant ID: 3697
    it('should preserve the expected branch behavior in if at source line 2729', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3738
    it('should preserve the required serialized text in if at source line 2772', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3740
    it('should preserve the required collection contents in if at source line 2777', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3748
    it('should preserve the required collection contents in if at source line 2787', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3749
    it('should preserve the required serialized text in if at source line 2791', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3750
    it('should preserve the required serialized text in if at source line 2791', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3753
    it('should preserve the required serialized text in if at source line 2794', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3766
    it('should preserve the required collection contents in if at source line 2812', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3769
    it('should preserve the expected branch behavior in if at source line 2818', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3773
    it('should preserve the combined condition behavior in if at source line 2818', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3776
    it('should preserve the expected boolean state in if at source line 2820', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3778
    it('should preserve the expected branch behavior in if at source line 2823', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3780
    it('should preserve the required serialized text in if at source line 2823', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3781
    it('should execute the required cross-reference operation in if at source line 2823', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3782
    it('should preserve the required serialized text in if at source line 2824', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3784
    it('should preserve the expected branch behavior in if at source line 2825', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3786
    it('should execute the required cross-reference operation in if at source line 2825', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3787
    it('should preserve the expected branch behavior in if at source line 2827', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3788
    it('should preserve the expected branch behavior in if at source line 2827', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3789
    it('should preserve the combined condition behavior in if at source line 2827', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3790
    it('should execute the required cross-reference operation in if at source line 2827', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3791
    it('should preserve the expected boolean state in if at source line 2828', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3792
    it('should preserve the expected branch behavior in if at source line 2832', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3793
    it('should preserve the expected branch behavior in if at source line 2832', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3794
    it('should preserve the combined condition behavior in if at source line 2832', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3795
    it('should execute the required cross-reference operation in if at source line 2832', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3796
    it('should preserve the expected boolean state in if at source line 2833', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3800
    it('should preserve the expected branch behavior in if at source line 2845', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3807
    it('should preserve the boundary condition behavior in while at source line 2854', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3817
    it('should preserve the expected branch behavior in if at source line 2873', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 27', () => {
    // Mutant ID: 3818
    it('should execute the required cross-reference operation in if at source line 2873', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3825
    it('should preserve the expected branch behavior in if at source line 2879', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3826
    it('should preserve the boundary condition behavior in if at source line 2879', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3829
    it('should preserve the method result in if at source line 2880', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3830
    it('should execute the required cross-reference operation in if at source line 2880', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3832
    it('should preserve the expected branch behavior in if at source line 2881', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3840
    it('should preserve the expected branch behavior in if at source line 2890', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3842
    it('should preserve the combined condition behavior in if at source line 2890', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3843
    it('should preserve the expected branch behavior in if at source line 2890', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3848
    it('should preserve the expected branch behavior in if at source line 2895', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3853
    it('should preserve the expected branch behavior in if at source line 2896', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3855
    it('should preserve the combined condition behavior in if at source line 2896', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3856
    it('should preserve the expected branch behavior in if at source line 2896', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3862
    it('should preserve the required collection contents in if at source line 2903', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3865
    it('should preserve the expected branch behavior in if at source line 2905', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3877
    it('should preserve the expected branch behavior in if at source line 2922', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3879
    it('should preserve the combined condition behavior in if at source line 2922', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3881
    it('should preserve the expected branch behavior in if at source line 2922', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3889
    it('should preserve the expected branch behavior in if at source line 2927', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3903
    it('should preserve the expected branch behavior in if at source line 2943', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3904
    it('should execute the required cross-reference operation in if at source line 2943', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3909
    it('should preserve the expected branch behavior in if at source line 2955', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3911
    it('should preserve the combined condition behavior in if at source line 2955', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3912
    it('should preserve the expected branch behavior in if at source line 2955', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3921
    it('should preserve the combined condition behavior in if at source line 2960', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3924
    it('should preserve the expected branch behavior in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3927
    it('should preserve the combined condition behavior in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3928
    it('should preserve the expected branch behavior in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3930
    it('should preserve the expected branch behavior in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3931
    it('should preserve the boundary condition behavior in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

});

describe('PdfCrossReference survived mutant behaviors group 28', () => {
    // Mutant ID: 3932
    it('should preserve the required serialized text in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3935
    it('should preserve the required serialized text in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3936
    it('should execute the required cross-reference operation in if at source line 2962', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3937
    it('should preserve the expected boolean state in if at source line 2963', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3939
    it('should preserve the expected branch behavior in if at source line 2967', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3946
    it('should preserve the expected branch behavior in if at source line 2967', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

    // Mutant ID: 3951
    it('should preserve the expected branch behavior in if at source line 2967', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeLong(258, 2, buffer);
        expect(buffer).toEqual([1, 2]);
        document.destroy();
    });

    // Mutant ID: 3952
    it('should preserve the boundary condition behavior in if at source line 2967', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([97, 98, 99, 10]);
        expect(crossReference._readToken(data, 0)).toBe('abc');
        document.destroy();
    });

    // Mutant ID: 3953
    it('should preserve the required serialized text in if at source line 2967', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const data: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
        const target: Uint8Array = new Uint8Array([3, 4]);
        expect(crossReference._skipUntil(data, 0, target)).toBe(2);
        document.destroy();
    });

    // Mutant ID: 3954
    it('should preserve the expected branch behavior in if at source line 2968', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(data.length > 8).toBeTruthy();
        expect(loaded.pageCount).toBe(1);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3959
    it('should preserve the expected branch behavior in if at source line 2968', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.table;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3960
    it('should preserve the boundary condition behavior in if at source line 2968', () => {
        const document: PdfDocument = new PdfDocument();
        document.fileStructure.crossReferenceType = PdfCrossReferenceType.stream;
        document.addPage();
        const first: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(first);
        loaded.fileStructure.isIncrementalUpdate = true;
        loaded.addPage();
        const updated: Uint8Array = loaded.save();
        const verified: PdfDocument = new PdfDocument(updated);
        expect(verified.pageCount).toBe(2);
        expect(updated.length > first.length).toBeTruthy();
        verified.destroy();
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3961
    it('should preserve the required serialized text in if at source line 2968', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        const data: Uint8Array = document.save();
        const loaded: PdfDocument = new PdfDocument(data);
        expect(loaded.pageCount).toBe(3);
        expect(data[0]).toBe(37);
        expect(data[1]).toBe(80);
        expect(data[2]).toBe(68);
        expect(data[3]).toBe(70);
        loaded.destroy();
        document.destroy();
    });

    // Mutant ID: 3963
    it('should execute the required cross-reference operation in if at source line 2971', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        const buffer: number[] = [];
        crossReference._writeString('xref', buffer);
        expect(buffer).toEqual([120, 114, 101, 102]);
        document.destroy();
    });

    // Mutant ID: 3964
    it('should preserve the expected boolean state in if at source line 2972', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._processString('42', 5)).toBe('00042');
        expect(crossReference._processString('12345', 5)).toBe('12345');
        document.destroy();
    });

    // Mutant ID: 3965
    it('should preserve the expected boolean state in if at source line 2973', () => {
        const document: PdfDocument = new PdfDocument();
        const crossReference: any = (document as any)._crossReference;
        expect(crossReference._escapeString('(value)\nnext\r\\')).toBe('\\(value\\)\\nnext\\r\\\\');
        document.destroy();
    });

});
