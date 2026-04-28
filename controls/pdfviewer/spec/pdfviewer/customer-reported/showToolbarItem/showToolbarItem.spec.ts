import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer,
    AnnotationDataFormat
} from "../../../../src/index";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

describe('PDF_Viewer_ShowToolItem', () => {
    let pdfviewer_showToolbarItem: PdfViewer = null;

    // Inject required PdfViewer modules
    PdfViewer.Inject(
        Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer
    );
    var toolItem1: any = {tooltipText: 'Paste',text: 'Paste',cssClass: 'custom-tool'}
    var toolItem2: any = { prefixIcon: 'e-pv-open-document', tooltipText: 'Open', id: 'openButton'}

    // Setup PdfViewer instance before running tests
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_showToolbarItem' });
        document.body.appendChild(element);
        pdfviewer_showToolbarItem = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_showToolbarItem.documentLoad = () => done();
        
        pdfviewer_showToolbarItem.toolbarSettings.toolbarItems = [toolItem1, toolItem2];
        pdfviewer_showToolbarItem.appendTo('#pdfviewer_showToolbarItem');
    });

    // Cleanup PdfViewer instance after all tests complete
    afterAll(() => {
        if (pdfviewer_showToolbarItem) {
            pdfviewer_showToolbarItem.destroy();
            const el = document.getElementById('pdfviewer_showToolbarItem');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_showToolbarItem = null;
        }
    });

    it("1020202- Custom Toolbar items show or hide", (done) => {
        //hide custom toolbar items.
        pdfviewer_showToolbarItem.toolbar.showToolbarItem([toolItem1], false);
        var id1 = toolItem1.template.id;
        var el1 = document.getElementById(`${id1}`);
        expect(el1.parentElement.classList.contains('e-hidden')).toBe(true);

        pdfviewer_showToolbarItem.toolbar.showToolbarItem([toolItem2], false);
        var id2 = toolItem2.id;
        var el2 = document.getElementById(`${id2}`);
        expect(el2.parentElement.classList.contains('e-hidden')).toBe(true);

        //show custom toolbar items.
        pdfviewer_showToolbarItem.toolbar.showToolbarItem([toolItem1], true);
        var id3 = toolItem1.template.id;
        var el3 = document.getElementById(`${id3}`);
        expect(el3.parentElement.classList.contains('e-hidden')).toBe(false);

        pdfviewer_showToolbarItem.toolbar.showToolbarItem([toolItem2], true);
        var id4 = toolItem2.id;
        var el4 = document.getElementById(`${id4}`);
        expect(el4.parentElement.classList.contains('e-hidden')).toBe(false);
        done();
    })
})