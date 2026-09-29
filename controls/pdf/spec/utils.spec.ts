import { _decode, _hashBytes, _parseTimestampToken } from '../src/pdf/core/utils';
describe('Utils mutation testing', () => {
    it('includes a supplied byte in the computed unsigned hash', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
    it('stops hashing immediately after processing the final byte', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
    it('starts the hash calculation with the first input byte', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
    it('updates the accumulator while processing an input byte', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
    it('preserves the calculated accumulator before returning its unsigned value', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
    it('uses additive accumulation when incorporating a byte into the hash', () => {
        const bytes: Uint8Array =
            new Uint8Array([1]);
        const result: number =
            _hashBytes(bytes);
        expect(result).toBe(177572);
    });
});