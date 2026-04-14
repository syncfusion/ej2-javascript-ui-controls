import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { LISTBOX_B64, OLD_PDFVIEWER_JSON } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_ListBox Without designer', () => {
    let pdfviewer_list: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_list' });
        document.body.appendChild(element);
        pdfviewer_list = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + LISTBOX_B64,
            enableFormDesigner: false
        });
        pdfviewer_list.documentLoad = () => {
            
            done();
        }
        pdfviewer_list.appendTo("#pdfviewer_list");
    });

    afterAll(() => {
        if (pdfviewer_list) {
            pdfviewer_list.destroy();
            const el = document.getElementById('pdfviewer_list');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_list = null;
        }
    });

    afterEach(() => {
    });
    

    it("1018481-ListBox with options without form designer", async(done) => {
        const select: any = document.getElementById(pdfviewer_list.formFieldCollections[10].id);
        expect(select.options[0].value).toBe('Pomme');
        expect(select.options[1].value).toBe('Orange');
        done();
    })

})