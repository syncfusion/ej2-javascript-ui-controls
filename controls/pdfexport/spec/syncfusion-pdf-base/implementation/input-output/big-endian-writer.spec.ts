/**
 * spec document for BigEndianWriter.ts class
 */
import { BigEndianWriter } from '../../../../src/implementation/input-output/big-endian-writer';
describe('BigEndianWriter.ts',()=>{
    let t1 : BigEndianWriter = new BigEndianWriter(10);
    it('-writeString(null)', () => {
        expect(function (): void {t1.writeString(null); }).toThrowError();
    })
    it('-writeBytes(null)', () => {
        expect(function (): void {t1.writeBytes(null); }).toThrowError();
    })
});