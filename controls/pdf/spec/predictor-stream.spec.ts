import { _PdfStream } from "../src/pdf/core/base-stream";
import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
import { PdfPredictorStream } from "../src/pdf/core/predictor-stream";
describe('PdfPredictorStream survived mutants batch 01', () => {
    // Mutant ID: 533
    it('should include the rounding offset when calculating pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 2);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    0
                ]),
                2,
                params
            );
        expect(predictor.pixBytes).toBe(1);
        expect(predictor.pixBytes).not.toBe(-1);
    });
    // Mutant ID: 549
    it('should use the generic TIFF branch when one-bit data has two colors', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update(
            'BitsPerComponent',
            1
        );
        params.update('Columns', 4);
        const stream: _PdfStream =
            new _PdfStream([
                0x12
            ]);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                stream,
                1,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0x17);
        expect(result[0]).toBe(23);
        expect(predictor.bufferLength).toBe(1);
    });
    // Mutant ID: 550
    it('should use the monochrome TIFF path when colors equals one', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 1);
        params.update('Columns', 16);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x55,
                    0x55
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0x66);
        expect(result[1]).toBe(0x66);
    });
    // Mutant ID: 551
    it('should execute the one-bit monochrome TIFF decoding block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 1);
        params.update('Columns', 8);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x55
                ]),
                1,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0x66);
        expect(result[0]).not.toBe(0x00);
    });
    // Mutant ID: 552
    it('should iterate through every byte in a one-bit TIFF row', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 1);
        params.update('Columns', 16);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x55,
                    0xaa
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0x66);
        expect(result[1]).toBe(0xcc);
    });
    // Mutant ID: 557
    it('should advance the output position while decoding one-bit TIFF bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 1);
        params.update('Columns', 16);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x55,
                    0x0f
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0x66);
        expect(result[1]).toBe(0x0a);
        expect(predictor.bufferLength).toBe(2);
    });
    // Mutant ID: 558
    it('should select the eight-bit TIFF decoding branch only for eight-bit data', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    5,
                    0,
                    2
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            5,
            0,
            7
        ]);
    });
    // Mutant ID: 561
    it('should execute the eight-bit TIFF horizontal differencing block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    10,
                    1,
                    2,
                    3
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            10,
            11,
            13,
            16
        ]);
    });
    // Mutant ID: 562
    it('should copy the initial color components for eight-bit TIFF data', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 3);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    10,
                    20,
                    30,
                    1,
                    2,
                    3
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(30);
    });
    // Mutant ID: 564
    it('should enter the initial color loop while the index is less than colors', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    8,
                    16,
                    1,
                    2
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            8,
            16,
            9,
            18
        ]);
    });
    // Mutant ID: 566
    it('should retain the first pixel components before TIFF reconstruction', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 3);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    5,
                    15,
                    25,
                    2,
                    3,
                    4
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            5,
            15,
            25,
            7,
            18,
            29
        ]);
    });
    // Mutant ID: 567
    it('should advance the output position while copying initial TIFF components', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    4,
                    9,
                    2,
                    3
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(result.length).toBe(4);
        expect(result[0]).toBe(4);
        expect(result[1]).toBe(9);
        expect(result[2]).toBe(6);
        expect(result[3]).toBe(12);
    });
    // Mutant ID: 568
    it('should reconstruct all remaining eight-bit TIFF components', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 5);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    2,
                    3,
                    4,
                    5,
                    6
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(5);
        expect(Array.from(result)).toEqual([
            2,
            5,
            9,
            14,
            20
        ]);
    });
    // Mutant ID: 570
    it('should continue the TIFF reconstruction loop while the index is below row bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    10,
                    20,
                    1,
                    2,
                    3,
                    4
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            10,
            20,
            11,
            22,
            14,
            26
        ]);
    });
    // Mutant ID: 572
    it('should execute the remaining-component TIFF reconstruction block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    7,
                    1,
                    1,
                    1
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            7,
            8,
            9,
            10
        ]);
    });
    // Mutant ID: 573
    it('should add the previous pixel component during eight-bit TIFF decoding', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    20,
                    5,
                    3
                ]),
                3,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(3);
        expect(Array.from(result)).toEqual([
            20,
            25,
            28
        ]);
    });
    // Mutant ID: 574
    it('should read the previous component from position minus the color count', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    6,
                    12,
                    1,
                    2,
                    3,
                    4
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            6,
            12,
            7,
            14,
            10,
            18
        ]);
    });
    // Mutant ID: 575
    it('should increment the output position after each reconstructed TIFF byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    3,
                    4,
                    5,
                    6
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(result.length).toBe(4);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(7);
        expect(result[2]).toBe(12);
        expect(result[3]).toBe(18);
    });
    // Mutant ID: 579
    it('should execute the sixteen-bit TIFF reconstruction block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    0,
                    5
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            10,
            0,
            15
        ]);
    });
    // Mutant ID: 581
    it('should copy every byte of the first sixteen-bit TIFF pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    5,
                    0,
                    10,
                    0,
                    1,
                    0,
                    2
                ]),
                8,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(5);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(10);
    });
    // Mutant ID: 583
    it('should enter the first-pixel loop while the index is below bytes per pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    2,
                    0,
                    3
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            1,
            2,
            1,
            5
        ]);
    });
    // Mutant ID: 589
    it('should enter the sixteen-bit reconstruction loop for remaining pixels', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    4,
                    0,
                    2,
                    0,
                    3
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            0,
            4,
            0,
            6,
            0,
            9
        ]);
    });
    // Mutant ID: 591
    it('should execute the sixteen-bit sum reconstruction block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x01,
                    0x00,
                    0x00,
                    0x02
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0x01,
            0x00,
            0x01,
            0x02
        ]);
    });
    // Mutant ID: 592
    it('should add the low byte of the previous sixteen-bit pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    0,
                    5
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(10);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(15);
    });
    // Mutant ID: 593
    it('should add the high word of the previous sixteen-bit pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x01,
                    0x00,
                    0x01,
                    0x00
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0x01,
            0x00,
            0x02,
            0x00
        ]);
    });
});
describe('PdfPredictorStream survived mutants batch 02', () => {
    // Mutant ID: 595
    it('should read the low source byte from the next index during sixteen-bit TIFF decoding', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    0,
                    5
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            10,
            0,
            15
        ]);
    });
    // Mutant ID: 597
    it('should read the previous low byte at the positive low-byte offset', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    20,
                    0,
                    7
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(27);
    });
    // Mutant ID: 600
    it('should advance the output position after writing the sixteen-bit low byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 16);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    4,
                    0,
                    2,
                    0,
                    3
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            0,
            4,
            0,
            6,
            0,
            9
        ]);
        expect(predictor.bufferLength).toBe(6);
    });
    // Mutant ID: 616
    it('should load another source byte only when available bits are below the component width', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 4);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x12
                ]),
                1,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0x13);
    });
    // Mutant ID: 619
    it('should advance the source index after loading a packed TIFF byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 4);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x12,
                    0x34
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(Array.from(result)).toEqual([
            0x13,
            0x6a
        ]);
    });
    // Mutant ID: 629
    it('should write packed TIFF output whenever at least eight output bits are available', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 4);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x12,
                    0x34
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0x12);
        expect(result[1]).toBe(0x46);
    });
    // Mutant ID: 631
    it('should shift packed TIFF output by the number of bits above eight', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 4);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x12
                ]),
                1,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(1);
        expect(result[0]).toBe(0x13);
        expect(result[0]).not.toBe(0);
    });
    // Mutant ID: 632
    it('should subtract eight after emitting a packed TIFF output byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 4);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x12,
                    0x34
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(result[0]).toBe(0x13);
        expect(result[1]).toBe(0x6a);
        expect(predictor.bufferLength).toBe(2);
    });
    // Mutant ID: 638
    it('should advance the packed TIFF output index after writing partial output bits', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 2);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 2);
        params.update('Columns', 5);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0x1b,
                    0x00
                ]),
                2,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(2);
        expect(result.length).toBe(2);
        expect(predictor.bufferLength).toBe(2);
        expect(result[0]).toBeDefined();
        expect(result[1]).toBeDefined();
    });
    // Mutant ID: 647
    it('should return immediately when a PNG row has no raw bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0
                ]),
                1,
                params
            );
        predictor.readBlockPng();
        expect(predictor.eof).toBeTruthy();
        expect(predictor.bufferLength).toBe(0);
    });
    // Mutant ID: 648
    it('should not allocate a decoded PNG row after reaching end of stream', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0
                ]),
                1,
                params
            );
        predictor.readBlockPng();
        expect(predictor.eof).toBeTruthy();
        expect(predictor.bufferLength).toBe(0);
        const result: Uint8Array =
            predictor.getBytes(1);
        expect(result.length).toBe(0);
    });
    // Mutant ID: 656
    it('should iterate through every byte of a PNG None-filter row', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    3,
                    6,
                    9,
                    12
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            3,
            6,
            9,
            12
        ]);
    });
    // Mutant ID: 660
    it('should execute the PNG None-filter byte-copy block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    11,
                    22,
                    33
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(3);
        expect(result[0]).toBe(11);
        expect(result[1]).toBe(22);
        expect(result[2]).toBe(33);
    });
    // Mutant ID: 661
    it('should advance the output index while copying PNG None-filter bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    5,
                    10,
                    15
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(3);
        expect(Array.from(result)).toEqual([
            5,
            10,
            15
        ]);
        expect(predictor.bufferLength).toBe(3);
    });
    // Mutant ID: 663
    it('should copy the first PNG Sub-filter pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 3);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    10,
                    20,
                    30,
                    1,
                    2,
                    3
                ]),
                7,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(20);
        expect(result[2]).toBe(30);
    });
    // Mutant ID: 664
    it('should stop the initial PNG Sub-filter loop at the pixel-byte count', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    8,
                    16,
                    1,
                    2
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            8,
            16,
            9,
            18
        ]);
    });
    // Mutant ID: 665
    it('should enter the initial PNG Sub-filter loop when the index starts below pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    7,
                    2,
                    3
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(3);
        expect(Array.from(result)).toEqual([
            7,
            9,
            12
        ]);
    });
    // Mutant ID: 667
    it('should retain the initial PNG Sub-filter pixel without reconstruction', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    12,
                    1,
                    1,
                    1
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(result[0]).toBe(12);
        expect(result[1]).toBe(13);
        expect(result[2]).toBe(14);
        expect(result[3]).toBe(15);
    });
    // Mutant ID: 668
    it('should advance the PNG Sub-filter output index while copying the first pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    4,
                    9,
                    2,
                    3
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            4,
            9,
            6,
            12
        ]);
    });
    // Mutant ID: 669
    it('should reconstruct PNG Sub-filter bytes after the first pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 5);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(5);
        expect(Array.from(result)).toEqual([
            2,
            5,
            9,
            14,
            20
        ]);
    });
    // Mutant ID: 671
    it('should enter the remaining PNG Sub-filter loop for undecoded row bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    10,
                    20,
                    1,
                    2,
                    3,
                    4
                ]),
                7,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            10,
            20,
            11,
            22,
            14,
            26
        ]);
    });
    // Mutant ID: 673
    it('should execute the PNG Sub-filter reconstruction block', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    5,
                    1,
                    2,
                    3
                ]),
                5,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            5,
            6,
            8,
            11
        ]);
    });
    // Mutant ID: 674
    it('should add the previous pixel value to the current PNG Sub-filter byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    20,
                    5,
                    3
                ]),
                4,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(3);
        expect(Array.from(result)).toEqual([
            20,
            25,
            28
        ]);
    });
    // Mutant ID: 675
    it('should read the PNG Sub-filter left value from output index minus pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    1,
                    6,
                    12,
                    1,
                    2,
                    3,
                    4
                ]),
                7,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            6,
            12,
            7,
            14,
            10,
            18
        ]);
    });
    // Mutant ID: 685
    it('should keep the PNG Average filter separate from the Paeth filter', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    3,
                    1,
                    2,
                    3,
                    4
                ]),
                10,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            40,
            6,
            15,
            25,
            36
        ]);
    });
});
describe('PdfPredictorStream survived mutants batch 03', () => {
    // Mutant ID: 686
    it('should execute the initial-pixel loop for the PNG Average filter', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    3,
                    1,
                    2,
                    3,
                    4
                ]),
                10,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            40,
            6,
            15,
            25,
            36
        ]);
    });
    // Mutant ID: 687
    it('should stop the initial PNG Average loop at the pixel-byte count', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    3,
                    1,
                    2,
                    3
                ]),
                8,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            6,
            15,
            25
        ]);
    });
    // Mutant ID: 688
    it('should enter the initial PNG Average loop when the index is below pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    3,
                    2,
                    4,
                    6,
                    8
                ]),
                10,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            40,
            7,
            14,
            24,
            35
        ]);
    });
    // Mutant ID: 691
    it('should advance the output index while writing the initial Average-filter pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    3,
                    2,
                    4,
                    6,
                    8
                ]),
                10,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(result[4]).toBe(7);
        expect(result[5]).toBe(14);
        expect(result[6]).toBe(24);
        expect(result[7]).toBe(35);
    });
    // Mutant ID: 692
    it('should add the raw byte to half the previous-row byte for the first Average pixel', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    3,
                    3,
                    4
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            10,
            20,
            8,
            18
        ]);
    });
    // Mutant ID: 693
    it('should reconstruct the remaining PNG Average-filter bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 4);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    3,
                    1,
                    2,
                    3,
                    4
                ]),
                10,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(8);
        expect(result[4]).toBe(6);
        expect(result[5]).toBe(15);
        expect(result[6]).toBe(25);
        expect(result[7]).toBe(36);
    });
    // Mutant ID: 699
    it('should add the previous-row value to the left value before averaging', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    3,
                    2,
                    4,
                    6
                ]),
                8,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            7,
            17,
            29
        ]);
    });
    // Mutant ID: 700
    it('should read the Average-filter left value from output index minus pixel bytes', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 2);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 3);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    10,
                    20,
                    30,
                    40,
                    50,
                    60,
                    3,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12
                ]),
                14,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(12);
        expect(Array.from(result)).toEqual([
            10,
            20,
            30,
            40,
            50,
            60,
            7,
            14,
            24,
            35,
            47,
            59
        ]);
    });
    // Mutant ID: 719
    it('should subtract the left byte when calculating the Paeth left distance', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    0,
                    0,
                    4,
                    5,
                    1
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            0,
            5,
            6
        ]);
    });
    // Mutant ID: 720
    it('should negate the Paeth left distance only when the distance is negative', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    0,
                    5,
                    4,
                    0,
                    1
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            5,
            0,
            6
        ]);
    });
    // Mutant ID: 747
    it('should select the left Paeth value when the left and upper-left distances are equal', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    5,
                    0,
                    4,
                    10,
                    1
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            5,
            0,
            15,
            16
        ]);
    });
    // Mutant ID: 753
    it('should select the upper Paeth value when its distance is not greater than upper-left', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    0,
                    5,
                    4,
                    0,
                    1
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            5,
            0,
            6
        ]);
    });
    // Mutant ID: 756
    it('should execute the upper-value branch of the Paeth predictor', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update('BitsPerComponent', 8);
        params.update('Columns', 2);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    0,
                    0,
                    5,
                    4,
                    0,
                    2
                ]),
                6,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(4);
        expect(Array.from(result)).toEqual([
            0,
            5,
            0,
            7
        ]);
    });
    // Mutant ID: 757
    it('should advance the output index after writing the upper Paeth value', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update(
            'BitsPerComponent',
            8
        );
        params.update('Columns', 3);
        const stream: _PdfStream =
            new _PdfStream([
                0,
                0,
                5,
                10,
                4,
                0,
                1,
                2
            ]);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                stream,
                8,
                params
            );
        const result: Uint8Array =
            predictor.getBytes(6);
        expect(result.length).toBe(6);
        expect(Array.from(result)).toEqual([
            0,
            5,
            10,
            0,
            6,
            12
        ]);
        expect(predictor.bufferLength)
            .toBe(6);
    });
    // Mutant ID: 762
    it('should throw for an unsupported PNG predictor byte', () => {
        const params: _PdfDictionary =
            new _PdfDictionary();
        params.update('Predictor', 12);
        params.update('Colors', 1);
        params.update(
            'BitsPerComponent',
            8
        );
        params.update('Columns', 1);
        const predictor: PdfPredictorStream =
            new PdfPredictorStream(
                new _PdfStream([
                    5,
                    1
                ]),
                2,
                params
            );
        expect(() => {
            predictor.getBytes(1);
        }).toThrow();
    });
});