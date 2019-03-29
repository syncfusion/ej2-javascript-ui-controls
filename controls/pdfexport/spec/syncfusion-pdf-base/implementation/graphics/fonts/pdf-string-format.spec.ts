/**
 * spec document for PdfStringFormat.ts class
 */
import { PdfStringFormat, PdfTextAlignment } from "../../../../../src/index";

describe('PdfStringFormat.ts', () => {
    describe('Constructor initializing',()=> {
       let t1 : PdfStringFormat = new PdfStringFormat();
       let alignment : PdfTextAlignment;
       let t2 : PdfStringFormat = new PdfStringFormat(alignment);
       let t3 : PdfStringFormat = new PdfStringFormat('test');
    //    let textAlignment : PdfTextAlignment.Center;
    //    let lineAlignment : PdfVerticalAlignment;
    //    let line : PdfVerticalAlignment.Top;
    //    let t5 : PdfStringFormat = new PdfStringFormat(textAlignment, line);
    //    let t4 : PdfStringFormat = new PdfStringFormat(textAlignment, lineAlignment);
       it('-rightToLeft == false', () => {
           expect(t1.rightToLeft).toBeFalsy();
       })
       it('-Set rightToLeft', () => {
           t1.rightToLeft = true;
           expect(t1.rightToLeft).toBeTruthy();
       })
       it('-characterSpacing == 0', () => {
           expect(t1.characterSpacing).toEqual(0);
       })
       it('-Set characterSpacing == 0', () => {
           t1.characterSpacing = 0;
           expect(t1.characterSpacing).toEqual(0);
       })
       it('-Set characterSpacing == null', () => {
           t1.characterSpacing = null;
           expect(t1.characterSpacing).toEqual(0);
       })
       it('-clipPath == false', () => {
           expect(t1.clipPath).toBeFalsy();
       })
       it('-Set clipPath', () => {
           t1.clipPath = true;
           expect(t1.clipPath).toBeTruthy();
       })
       it('-subSuperScript == 0', () => {
           expect(t1.subSuperScript).toEqual(0);
       })
       it('-Set subSuperScript', () => {
           t1.subSuperScript = 0;
           expect(t1.subSuperScript).toEqual(0);
       })
       it('-paragraphIndent == 0', () => {
           expect(t1.paragraphIndent).toEqual(0);
       })
       it('-Set paragraphIndent', () => {
           t1.paragraphIndent = 0;
           expect(t1.paragraphIndent).toEqual(0);
       })
       it('-lineLimit == true', () => {
           expect(t1.lineLimit).toBeTruthy();
       })
       it('-Set lineLimit', () => {
           t1.lineLimit = true;
           expect(t1.lineLimit).toBeTruthy();
       })
       it('-measureTrailingSpaces == false', () => {
           expect(t1.measureTrailingSpaces).toBeFalsy();
       })
       it('-Set measureTrailingSpaces', () => {
           t1.measureTrailingSpaces = true;
           expect(t1.measureTrailingSpaces).toBeTruthy();
       })
       it('-noClip == false', () => {
           expect(t1.noClip).toBeFalsy();
       })
       it('-Set noClip', () => {
           t1.noClip = true;
           expect(t1.noClip).toBeTruthy();
       })
       it('-wordWrap == 1', () => {
           expect(t1.wordWrap).toEqual(1);
       })
       it('-Set wordWrap', () => {
           t1.wordWrap = 0;
           expect(t1.wordWrap).toEqual(0);
       })
       it('-horizontalScalingFactor == 100', () => {
           expect(t1.horizontalScalingFactor).toEqual(100);
       })
       it('-Set horizontalScalingFactor', () => {
           t1.horizontalScalingFactor = 10;
           expect(t1.horizontalScalingFactor).toEqual(10);
       })
       it('-Set horizontalScalingFactor', () => {
           expect(function (): void {t1.horizontalScalingFactor = -1; }).toThrowError();
       })
       it('-firstLineIndent == 0', () => {
           expect(t1.firstLineIndent).toEqual(0);
       })
       it('-Set firstLineIndent', () => {
           t1.firstLineIndent = 0;
           expect(t1.firstLineIndent).toEqual(0);
       })
      t1.clone();
      t2.lineLimit = null;
      t2.wordWrap = null;
    //   t2.horizontalScalingFactor = null;
    })
})