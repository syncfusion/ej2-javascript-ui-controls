/**
 * spec document for PdfAnnotationCollection.ts class
 */
import { PdfAnnotationCollection } from "../../../../src/implementation/annotations/annotation-collection";
import { PdfArray, PdfDocument, PdfPage, PdfDestination, RectangleF, PointF } from "../../../../src/index";
import { PdfUriAnnotation, PdfDocumentLinkAnnotation, SizeF } from "../../../../src/implementation/index";

describe('PdfAnnotationCollection.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : PdfAnnotationCollection = new PdfAnnotationCollection();
        it('-annotations != undefined', () => {
            expect(t1.annotations).not.toBeUndefined();
        })
        it('-Set annotations', () => {
            let value : PdfArray = new PdfArray([10, 20]);
            t1.annotations = value
            expect(t1.annotations).not.toBeUndefined();
        })
        it('-element != undefined', () => {
            expect(t1.element).not.toBeUndefined();
        })
        afterAll((): void => {
            let document : PdfDocument = new PdfDocument();
            let page : PdfPage = document.pages.add();
            let page2 : PdfPage = document.pages.add();
            let t2 : PdfAnnotationCollection = new PdfAnnotationCollection(page);
            let rectangle : RectangleF = new RectangleF(new PointF(10, 10), new SizeF(20, 40));
            let uriAnnotation : PdfUriAnnotation  = new PdfUriAnnotation(rectangle, "http://www.google.com");
            page.annotations.add(uriAnnotation);
            let docLinkAnnot : PdfDocumentLinkAnnotation  = new PdfDocumentLinkAnnotation(rectangle);
            docLinkAnnot.destination = new PdfDestination(page2);
            
        });
    })
})