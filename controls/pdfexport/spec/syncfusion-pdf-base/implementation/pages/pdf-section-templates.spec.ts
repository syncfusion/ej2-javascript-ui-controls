/**
 * spec document for PdfSectionTemplate.ts class
 */
import { PdfSectionTemplate } from '../../../../src/index';

describe('PdfSectionTemplate.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfSectionTemplate = new PdfSectionTemplate();
        it('-applyDocumentLeftTemplate == true', () => {
            expect(t1.applyDocumentLeftTemplate).toBeTruthy();
        })
        it('-Set applyDocumentLeftTemplate == false', () => {
            t1.applyDocumentLeftTemplate = false;
            expect(t1.applyDocumentLeftTemplate).toBeFalsy();
        })
        it('-applyDocumentTopTemplate == true', () => {
            expect(t1.applyDocumentTopTemplate).toBeTruthy();
        })
        it('-Set applyDocumentTopTemplate == false', () => {
            t1.applyDocumentTopTemplate = false;
            expect(t1.applyDocumentTopTemplate).toBeFalsy();
        })
        it('-applyDocumentRightTemplate == true', () => {
            expect(t1.applyDocumentRightTemplate).toBeTruthy();
        })
        it('-Set applyDocumentRightTemplate == false', () => {
            t1.applyDocumentRightTemplate = false;
            expect(t1.applyDocumentRightTemplate).toBeFalsy();
        })
        it('-applyDocumentBottomTemplate == true', () => {
            expect(t1.applyDocumentBottomTemplate).toBeTruthy();
        })
        it('-Set applyDocumentBottomTemplate == false', () => {
            t1.applyDocumentBottomTemplate = false;
            expect(t1.applyDocumentBottomTemplate).toBeFalsy();
        })
        it('-applyDocumentStamps == true', () => {
            expect(t1.applyDocumentStamps).toBeTruthy();
        })
        it('-Set applyDocumentStamps == false', () => {
            t1.applyDocumentStamps = false;
            expect(t1.applyDocumentStamps).toBeFalsy();
        })
    })
})