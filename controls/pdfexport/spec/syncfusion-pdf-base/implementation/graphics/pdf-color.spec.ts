/**
 * spec document for PdfColor.ts class
 */
import { PdfArray, PdfColor, PdfColorSpace } from "../../../../src/index";

describe('PdfColor.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfColor = new PdfColor(240, 250, 250, 100);
        it('-Set gray >1', () => {
            t1.gray = 50;
            expect(t1.gray).toEqual(1);
        })
        it('-Set gray <1', () => {
            t1.gray = -5;
            expect(t1.gray).toEqual(0);
        })
        it('-Set gray == 0', () => {
            t1.gray = 0;
            expect(t1.gray).toEqual(0);
        })
        it('-Set a >=0', () => {
            t1.a = 50;
            expect(t1.a).toEqual(50);
        })
        it('-Set a <0', () => {
            t1.a = -5;
            expect(t1.a).toEqual(0);
        })
        it('-ToString(PdfColorSpace.Cmyk, false) != Undefined', () => {
            expect(t1.toString(PdfColorSpace.Cmyk, false)).not.toBeUndefined();
        })

        let t2 : PdfColor = new PdfColor(t1);
        // t2.a = 0;
        // let t3 : PdfColor = new PdfColor(t2);
        // it('-when a == 0, calling ToString(PdfColorSpace.Rgb, false) == empty', () => {
        //     expect(t3.toString(PdfColorSpace.Rgb, false)).toEqual('');
        // })
        // let Cmyk : PdfArray =  t3.toArray(PdfColorSpace.Cmyk);
        // let Rgb :  PdfArray =  t3.toArray(PdfColorSpace.Rgb);
        // let gray :  PdfArray =  t3.toArray(PdfColorSpace.GrayScale);
        // it('- Default value- Error in ToArray()', () => {
        //     expect(function (): void { t3.toArray(PdfColorSpace.Indexed); }).toThrowError(); 
        // })
    })
})