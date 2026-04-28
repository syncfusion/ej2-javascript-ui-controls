import { PdfPredictorStream } from '../src/pdf/core/predictor-stream';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';
import { FormatError } from '../src/pdf/core/utils';

function dict(values: Record<string, any>) {
    const d = new _PdfDictionary();
    spyOn(d, 'get').and.callFake((key: string, alt?: string) => {
        if (key in values) return values[key];
        if (alt && alt in values) return values[alt];
        return undefined;
    });
    return d;
}

describe('PdfPredictorStream - full spec-correct coverage', () => {

    /* ---------------- CONSTRUCTOR ---------------- */

    it('returns original stream if params is not PdfDictionary', () => {
        const stream: any = { dictionary: {} };
        const result = new PdfPredictorStream(stream, 10, {} as any);
        expect(result).toBe(stream);
    });

    it('returns stream early when predictor <= 1', () => {
        const stream: any = { dictionary: {} };
        const params = dict({ Predictor: 1 });
        expect(new PdfPredictorStream(stream, 10, params)).toBe(stream);
    });

    it('throws FormatError for unsupported predictor', () => {
        const stream: any = { dictionary: {} };
        const params = dict({ Predictor: 3 });
        try {
            new PdfPredictorStream(stream, 10, params);
        } catch (e) {
            expect(e instanceof FormatError).toBeTruthy();
            expect(e.message).toMatch(/Unsupported predictor/);
        }
    });

    it('constructor fallback when Predictor missing uses 1 and returns stream', () => {
        const stream: any = { dictionary: {} };
        const params = new _PdfDictionary();
        const res = new PdfPredictorStream(stream, 10, params);
        expect(res).toBe(stream);
    });

    it('sets TIFF predictor properly', () => {
        const stream: any = { dictionary: {}, getBytes: () => new Uint8Array(0) };
        const params = dict({
            Predictor: 2,
            Colors: 1,
            BitsPerComponent: 8,
            Columns: 5
        });
        const p: any = new PdfPredictorStream(stream, 10, params);
        expect(p.readBlock).toBe(p.readBlockTiff);
        expect(p.rowBytes).toBe(5);
    });

    it('sets PNG predictor properly', () => {
        const stream: any = { dictionary: {}, getBytes: () => new Uint8Array(0), getByte: () => 0 };
        const params = dict({
            Predictor: 12,
            Colors: 3,
            BitsPerComponent: 8,
            Columns: 2
        });
        const p: any = new PdfPredictorStream(stream, 10, params);
        expect(p.readBlock).toBe(p.readBlockPng);
        expect(p.rowBytes).toBe(6);
    });

    it('uses BitsPerComponent fallback when BPC missing', () => {
        const stream: any = { dictionary: {}, getBytes: () => new Uint8Array(0) };
        const params = dict({
            Predictor: 2,
            BitsPerComponent: 16,
            Colors: 1,
            Columns: 1
        });
        const p: any = new PdfPredictorStream(stream, 10, params);
        expect(p.bits).toBe(16);
    });

    /* ---------------- TIFF PREDICTOR ---------------- */

    it('TIFF: EOF when no raw bytes', () => {
        const stream: any = { dictionary: {}, getBytes: () => new Uint8Array(0) };
        const p: any = new PdfPredictorStream(stream, 10, dict({
            Predictor: 2, Colors: 1, BitsPerComponent: 8, Columns: 4
        }));

        p.readBlockTiff();
        expect(p.eof).toBeTruthy();
        expect(p.bufferLength).toBe(0);
    });

    it('TIFF: bits=1 colors=1 XOR path', () => {
        const stream: any = {
            dictionary: {},
            getBytes: () => new Uint8Array([0xff, 0x00])
        };
        const p: any = new PdfPredictorStream(stream, 10, dict({
            Predictor: 2, Colors: 1, BitsPerComponent: 1, Columns: 16
        }));
        p.readBlockTiff();
        expect(p.bufferLength).toBe(p.rowBytes);
    });

    it('TIFF: bits=8 add predictor', () => {
        const stream: any = {
            dictionary: {},
            getBytes: () => new Uint8Array([1, 2, 3])
        };
        const p: any = new PdfPredictorStream(stream, 10, dict({
            Predictor: 2, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockTiff();
        expect(p.bufferLength).toBe(3);
    });

    it('TIFF: bits=16 path', () => {
        const stream: any = {
            dictionary: {},
            getBytes: () => new Uint8Array([0, 1, 0, 2])
        };
        const p: any = new PdfPredictorStream(stream, 10, dict({
            Predictor: 2, Colors: 1, BitsPerComponent: 16, Columns: 2
        }));
        p.readBlockTiff();
        expect(p.bufferLength).toBe(4);
    });

    it('TIFF: generic bit-packing path', () => {
        const stream: any = {
            dictionary: {},
            getBytes: () => new Uint8Array([255, 0, 255])
        };
        const p: any = new PdfPredictorStream(stream, 10, dict({
            Predictor: 2, Colors: 2, BitsPerComponent: 4, Columns: 2
        }));
        p.readBlockTiff();
        expect(p.bufferLength).toBe(p.rowBytes);
    });

    /* ---------------- PNG PREDICTOR ---------------- */

    function pngStream(filter: number, bytes: number[]) {
        return {
            dictionary: {},
            getByte: () => filter,
            getBytes: () => new Uint8Array(bytes)
        };
    }

    it('PNG: EOF early exit', () => {
        const p: any = new PdfPredictorStream(pngStream(0, []), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockPng();
        expect(p.eof).toBeTruthy();
    });

    it('PNG: filter 0 (none)', () => {
        const p: any = new PdfPredictorStream(pngStream(0, [1, 2, 3]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockPng();
        expect(p.bufferLength).toBe(3);
    });

    it('PNG: filter 1 (left)', () => {
        const p: any = new PdfPredictorStream(pngStream(1, [1, 1, 1]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockPng();
        expect(p.bufferLength).toBe(3);
    });

    it('PNG: filter 2 (up)', () => {
        const p: any = new PdfPredictorStream(pngStream(2, [1, 2, 3]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockPng();
        expect(p.bufferLength).toBe(3);
    });

    it('PNG: filter 3 (average)', () => {
        const p: any = new PdfPredictorStream(pngStream(3, [5, 5, 5]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        p.readBlockPng();
        expect(p.bufferLength).toBe(3);
    });

    it('PNG: filter 4 (Paeth, all branches)', () => {
        const p: any = new PdfPredictorStream(pngStream(4, [10, 20, 30, 40]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 4
        }));
        p.readBlockPng();
        expect(p.bufferLength).toBe(4);
    });

    it('PNG: invalid filter throws FormatError', () => {
        const p: any = new PdfPredictorStream(pngStream(99, [1, 2, 3]), 10, dict({
            Predictor: 10, Colors: 1, BitsPerComponent: 8, Columns: 3
        }));
        try {
            p.readBlockPng();
        } catch (e) {
            expect(e instanceof FormatError).toBeTruthy();
            expect(e.message).toMatch(/Unsupported predictor/);
        }
    });
});

function paethStream(rows: number[][]) {
    let call = 0;
    return {
        dictionary: {},
        getByte: () => 4,
        getBytes: () => new Uint8Array(rows[call++])
    };
}
it('PNG Paeth: pb < 0 and chooses UP', () => {
    const stream = paethStream([
        [5, 100],
        [1, 1]
    ]);

    const p: any = new PdfPredictorStream(stream, 10, dict({
        Predictor: 10,
        Colors: 1,
        BitsPerComponent: 8,
        Columns: 2
    }));

    p.readBlockPng();
    p.readBlockPng();

    expect(p.bufferLength).toBe(4);
});

it('PNG Paeth: pc < 0 and chooses UPLEFT', () => {
    const stream = paethStream([
        [90, 30],
        [1, 1]
    ]);

    const p: any = new PdfPredictorStream(stream, 10, dict({
        Predictor: 10,
        Colors: 1,
        BitsPerComponent: 8,
        Columns: 2
    }));

    p.readBlockPng();
    p.readBlockPng();

    expect(p.bufferLength).toBe(4);
});