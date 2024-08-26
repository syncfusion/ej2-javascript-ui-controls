/**
 * spec document for PdfDocumentTemplate.ts class
 */
import { TemplateType, PdfDocumentTemplate, PdfPageTemplateElement, PdfDocument, PdfPage } from '../../../../src/index';
import { RectangleF } from '../../../../src/index';

describe('PdfDocumentTemplate.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let document : PdfDocument = new PdfDocument();
        let page : PdfPage = document.pages.add();
        let rectangle : RectangleF = new RectangleF();
        it('-Left == undefined', () => {
            expect(t1.left).toBeUndefined();
        })
        it('-Set Left', () => {
            let value : PdfPageTemplateElement;
            t1.left = value;
            expect(t1.left).toBeUndefined();
        })
        it('-Set Left', () => {
            expect(function (): void {t1.left = new PdfPageTemplateElement(rectangle)}).not.toThrowError();
        })
        it('-Top == undefined', () => {
            expect(t1.top).toBeUndefined();
        })
        it('-Set Top', () => {
            let value : PdfPageTemplateElement;
            t1.top = value;
            expect(t1.top).toBeUndefined();
        })
        it('-Right == undefined', () => {
            expect(t1.right).toBeUndefined();
        })
        it('-Set Right', () => {
            let value : PdfPageTemplateElement;
            t1.right = value;
            expect(t1.right).toBeUndefined();
        })
        it('-Bottom == undefined', () => {
            expect(t1.bottom).toBeUndefined();
        })
        it('-Set Bottom', () => {
            let value : PdfPageTemplateElement;
            t1.bottom = value;
            expect(t1.bottom).toBeUndefined();
        })
        it('-EvenLeft != null', () => {
            expect(t1.EvenLeft).not.toBeNull();
        })
        it('-Set EvenLeft', () => {
            let value : PdfPageTemplateElement;
            t1.EvenLeft = value;
            expect(t1.EvenLeft).toBeUndefined();
        })
        it('-EvenTop == undefined', () => {
            expect(t1.EvenTop).toBeUndefined();
        })
        it('-Set EvenTop', () => {
            let value : PdfPageTemplateElement;
            t1.EvenTop = value;
            expect(t1.EvenTop).toBeUndefined();
        })
        it('-EvenRight == undefined', () => {
            expect(t1.EvenRight).toBeUndefined();
        })
        it('-Set EvenRight', () => {
            let value : PdfPageTemplateElement;
            t1.EvenRight = value;
            expect(t1.EvenRight).toBeUndefined();
        })
        it('-EvenBottom == undefined', () => {
            expect(t1.EvenBottom).toBeUndefined();
        })
        it('-Set EvenBottom', () => {
            let value : PdfPageTemplateElement;
            t1.EvenBottom = value;
            expect(t1.EvenBottom).toBeUndefined();
        })
        it('-OddLeft == undefined', () => {
            expect(t1.OddLeft).toBeUndefined();
        })
        it('-Set OddLeft', () => {
            let value : PdfPageTemplateElement;
            t1.OddLeft = value;
            expect(t1.OddLeft).toBeUndefined();
        })
        it('-OddTop == undefined', () => {
            expect(t1.OddTop).toBeUndefined();
        })
        it('-Set OddTop', () => {
            let value : PdfPageTemplateElement;
            t1.OddTop = value;
            expect(t1.OddTop).toBeUndefined();
        })
        it('-OddRight == undefined', () => {
            expect(t1.OddRight).toBeUndefined();
        })
        it('-Set OddRight', () => {
            let value : PdfPageTemplateElement;
            t1.OddRight = value;
            expect(t1.OddRight).toBeUndefined();
        })
        it('-OddBottom == undefined', () => {
            expect(t1.OddBottom).toBeUndefined();
        })
        it('-Set OddBottom', () => {
            let value : PdfPageTemplateElement;
            t1.OddBottom = value;
            expect(t1.OddBottom).toBeUndefined();
        })
        t1.getLeft(page);
        it('-this.getLeft(PdfPage) method calling', () => {
            expect(function (): void { t1.getLeft(null); }).toThrowError();
        })
        t1.getTop(page);
        it('-this.getTop(PdfPage) method calling', () => {
            expect(function (): void { t1.getTop(null); }).toThrowError();
        })
        t1.getRight(page);
        it('-this.getRight(PdfPage) method calling', () => {
            expect(function (): void { t1.getRight(null); }).toThrowError();
        })
        t1.getBottom(page);
        it('-this.getBottom(PdfPage) method calling', () => {
            expect(function (): void { t1.getBottom(null); }).toThrowError();
        })

        let t2 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let document2 : PdfDocument = new PdfDocument();
        let page1 : PdfPage = document2.pages.add();
        let page2 : PdfPage = document2.pages.add();
        t2.getLeft(page2);
        t2.getTop(page2);
        t2.getRight(page2);
        t2.getBottom(page2);

        it('-this.getBottom(PdfPage) method calling', () => {
            page2.section.document.pages.pageCollectionIndex.setValue(page2, 1);
            t2.getLeft(page2);
        })
        it('-Set OddRight', () => {
            let page3 : PdfPage = document2.pages.add();
            let value : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
            value.type = TemplateType.None;
            t2.OddRight = value;
            expect(t2.getRight(page1)).toBeUndefined();
        })

        let t7 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template5 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template5.type = TemplateType.None;
        t7.OddBottom = template5;
        let document4 : PdfDocument = new PdfDocument();
        let page5 : PdfPage = document4.pages.add();
        t7.getBottom(page5);

        let t8 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template6 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template6.type = TemplateType.None;
        t8.OddLeft = template6;
        t8.getLeft(page5);

        let t9 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template7 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template7.type = TemplateType.None;
        t9.OddRight = template7;
        t9.getRight(page5);

        let t10 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template8 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template8.type = TemplateType.None;
        t10.OddTop = template8;
        t10.getTop(page5);

        let document3 : PdfDocument = new PdfDocument();
        let page3 : PdfPage = document3.pages.add();
        let page4 : PdfPage = document3.pages.add();

        let t3 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template1 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template1.type = TemplateType.None;
        t3.EvenBottom = template1;
        t3.getBottom(page4);

        let t4 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template2 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template2.type = TemplateType.None;
        t4.EvenLeft = template2;
        t4.getLeft(page4);

        let t5 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template3 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template3.type = TemplateType.None;
        t5.EvenRight = template3;
        t5.getRight(page4);

        let t6 : PdfDocumentTemplate = new PdfDocumentTemplate();
        let template4 : PdfPageTemplateElement = new PdfPageTemplateElement(rectangle);
        template4.type = TemplateType.None;
        t6.EvenTop = template4;
        t6.getTop(page4);
    })
})