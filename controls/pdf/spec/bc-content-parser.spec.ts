import { PdfRubberStampAnnotation } from "../src/pdf/core/annotations/annotation";
import { _ContentParser } from "../src/pdf/core/content-parser";
import { PdfRubberStampAnnotationIcon } from "../src/pdf/core/enumerator";
import { PdfDocument } from "../src/pdf/core/pdf-document";

describe('Content-Parser file code coverage', function () {
        it('parse object method', function () {
        let document = new PdfDocument();
        let page = document.addPage();
        const annotation1 = new PdfRubberStampAnnotation({ x: 50, y: 50, width: 100, height: 50 });
        annotation1.opacity = 0.25;
        annotation1.icon = PdfRubberStampAnnotationIcon.approved;
        annotation1.setAppearance(true);
        const annotation2 = new PdfRubberStampAnnotation({ x: 50, y: 120, width: 100, height: 50 });
        annotation2.opacity = 0.5;
        annotation2.icon = PdfRubberStampAnnotationIcon.asIs;
        annotation2.setAppearance(true);
        const annotation3 = new PdfRubberStampAnnotation({ x: 50, y: 190, width: 100, height: 50 });
        annotation3.opacity = 1;
        annotation3.icon = PdfRubberStampAnnotationIcon.completed;
        annotation3.setAppearance(true);
        const annotation4 = new PdfRubberStampAnnotation({ x: 50, y: 260, width: 100, height: 50 });
        annotation4.opacity = 2;
        annotation4.icon = PdfRubberStampAnnotationIcon.draft;
        annotation4.setAppearance(true);
        const annotation5 = new PdfRubberStampAnnotation({ x: 200, y: 50, width: 100, height: 50 });
        annotation5.opacity = 0.25;
        annotation5.icon = PdfRubberStampAnnotationIcon.departmental;
        annotation5.flatten = true;
        const annotations = [annotation1, annotation2, annotation3, annotation4, annotation5];
        annotations.forEach(annotation => {
            page.annotations.add(annotation);
        });
        let updated = document.save();
        document = new PdfDocument(updated);
        page = document.getPage(0);
        let contents: any = page._pageDictionary.getArray('Contents');
        for (let i = 0; i < contents.length; i++) {
                var parser = new _ContentParser(contents[i].getBytes());
                if (i === 0){
                    parser._lexer._currentCharacter = '-';
                }
                else if (i === 1){
                    parser._lexer._currentCharacter = '1';
                }
                else {
                    parser._lexer._currentCharacter = '\'';
                }
                var result = parser._readContent();
                expect(result).toBeDefined();
            }
        document.destroy();
    });
});