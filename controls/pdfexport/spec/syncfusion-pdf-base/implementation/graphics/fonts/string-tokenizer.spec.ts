/**
 * spec document for StringTokenizer.ts class
 */
import { StringTokenizer } from "../../../../../src/index";

describe('StringTokenizer.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : StringTokenizer = new StringTokenizer('test\r\n@#');
        // t1.Eof();
        it('-this.constructor(string)', () => {
            expect(function (): void {t1 = new StringTokenizer(null); }).toThrowError();
        })
        it('Position == 0', () => {
            expect(t1.position).toEqual(3);
        })
        it('-Set Position', () => {
            t1.position = 2;
            expect(t1.position).toEqual(2);
        })
        t1.peekLine();
        t1.peekWord();
        t1.peek();
        t1.read();
        t1.read(2);
        t1.close();
        // let t2 : StringTokenizer = new StringTokenizer('test\t@#');
        // t2.ReadWord();
        let t3 : StringTokenizer = new StringTokenizer(' ');
        t3.readWord();

        it('GetCharsCount(%$^##*\t, #) == 2', () => {
            expect(StringTokenizer.getCharsCount('%$^##*\t', '#')).toEqual(2);
        })
        it('GetCharsCount(%$^##*\t, [#,*]) == 3', () => {
            expect(StringTokenizer.getCharsCount('%$^##*\t', ['#', '*'])).toEqual(3);
        })
        it('GetCharsCount(null, *) == Error', () => {
            expect(function (): void {let test = StringTokenizer.getCharsCount(null, '*')}).toThrowError();
        })
        it('GetCharsCount(%$^##*\t, null) == Error', () => {
            expect(function (): void {let test = StringTokenizer.getCharsCount('%$^##*\t', null)}).toThrowError();
        })
        it('GetCharsCount(null, [#,*]) == error', () => {
            expect(function (): void {let test = StringTokenizer.getCharsCount(null, ['#', '*'])}).toThrowError();
        })

        let t4 : StringTokenizer = new StringTokenizer('%$^##*');
        t4.readWord();
        t4.readWord();
        let t5 : StringTokenizer = new StringTokenizer('%$^##*\t');
        t5.readWord();
        let t6 : StringTokenizer = new StringTokenizer('%$^##*\r');
        t6.readWord();
    })
})