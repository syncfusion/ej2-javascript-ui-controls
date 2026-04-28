import { createElement } from '@syncfusion/ej2-base';
import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView, TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer, IRectangle } from '../../../../src/index';
import { waitFor } from '../../utils.spec';
import { HELLO_PDF_B64 } from '../../Data/pdf-data.spec';

describe('PDF_Viewer_TextMarkup_Opacity_Zero', () => {
    let pdfviewer_textmarkup: PdfViewer | null = null;

    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation,
        ThumbnailView, BookmarkView, TextSelection, TextSearch,
        Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );

    beforeAll((done: DoneFn) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_textmarkup' });
        document.body.appendChild(element);
        pdfviewer_textmarkup = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + HELLO_PDF_B64
        });
        pdfviewer_textmarkup.documentLoad = () => done();
        pdfviewer_textmarkup.appendTo('#pdfviewer_textmarkup');
    });

    afterAll(() => {
        if (pdfviewer_textmarkup) {
            pdfviewer_textmarkup.destroy();
            const el: HTMLElement | null = document.getElementById('pdfviewer_textmarkup');
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
            pdfviewer_textmarkup = null;
        }
    });
    let boundingRect: IRectangle[] = [{
        bottom: 113.0395736694336,
        height: 11.510787963867188,
        left: 98.54316711425781,
        right: 133.14927673339844,
        top: 101.5287857055664,
        width: 34.606109619140625
    }];
    it('1009739-Highlight annotation invisible when opacity=0', async () => {
        pdfviewer_textmarkup.highlightSettings.opacity = 0;
        pdfviewer_textmarkup.textSelection.selectTextRegion(1, boundingRect);
        await waitFor(() => pdfviewer_textmarkup.textSelectionModule.isTextSelection);
        pdfviewer_textmarkup.annotationModule.setAnnotationMode('Highlight');
        await waitFor(() => pdfviewer_textmarkup.annotationCollection && pdfviewer_textmarkup.annotationCollection.length > 0);
        const annotations = pdfviewer_textmarkup.annotationCollection[pdfviewer_textmarkup.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Underline annotation invisible when opacity=0', async () => {
        pdfviewer_textmarkup.underlineSettings.opacity = 0;
        pdfviewer_textmarkup.textSelection.selectTextRegion(1, boundingRect);
        await waitFor(() => pdfviewer_textmarkup.textSelectionModule.isTextSelection);
        pdfviewer_textmarkup.annotationModule.setAnnotationMode('Underline');
        await waitFor(() => pdfviewer_textmarkup.annotationCollection && pdfviewer_textmarkup.annotationCollection.length > 0);
        const annotations = pdfviewer_textmarkup.annotationCollection[pdfviewer_textmarkup.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Strikethrough annotation invisible when opacity=0', async () => {
        pdfviewer_textmarkup.strikethroughSettings.opacity = 0;
        pdfviewer_textmarkup.textSelection.selectTextRegion(1, boundingRect);
        await waitFor(() => pdfviewer_textmarkup.textSelectionModule.isTextSelection);
        pdfviewer_textmarkup.annotationModule.setAnnotationMode('Strikethrough');
        await waitFor(() => pdfviewer_textmarkup.annotationCollection && pdfviewer_textmarkup.annotationCollection.length > 0);
        const annotations = pdfviewer_textmarkup.annotationCollection[pdfviewer_textmarkup.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });

    it('1009739-Squiggly annotation invisible when opacity=0', async () => {
        pdfviewer_textmarkup.squigglySettings.opacity = 0;
        pdfviewer_textmarkup.textSelection.selectTextRegion(1, boundingRect);
        await waitFor(() => pdfviewer_textmarkup.textSelectionModule.isTextSelection);
        pdfviewer_textmarkup.annotationModule.setAnnotationMode('Squiggly');
        await waitFor(() => pdfviewer_textmarkup.annotationCollection && pdfviewer_textmarkup.annotationCollection.length > 0);
        const annotations = pdfviewer_textmarkup.annotationCollection[pdfviewer_textmarkup.annotationCollection.length - 1];
        expect(annotations).toBeDefined();
        expect(annotations.opacity).toBe(0);
    });
});
