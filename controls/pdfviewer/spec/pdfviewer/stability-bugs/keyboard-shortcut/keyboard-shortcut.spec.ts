import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
// import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";
import { Keydown, waitFor } from "../../utils.spec";


describe('PDF_Viewer_Searchbar', () => {
    let pdfviewer_Searchbar: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_Searchbar' });
        document.body.appendChild(element);
        pdfviewer_Searchbar = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_Searchbar.documentLoad = () => {
            done();
        }
        pdfviewer_Searchbar.appendTo("#pdfviewer_Searchbar");
    });

    afterAll(() => {
        if (pdfviewer_Searchbar) {
            pdfviewer_Searchbar.destroy();
            const el = document.getElementById('pdfviewer_Searchbar');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_Searchbar = null;
        }
    });

    afterEach(() => {
    });
    it('1012367 - Ctrl+F should NOT open search when SearchOption is missing', (done: DoneFn) => {
        try {
            (pdfviewer_Searchbar as any).toolbarSettings = {
                showTooltip: true,
                toolbarItems: ['OpenOption', 'PageNavigationTool', 'MagnificationTool', 'PanTool', 'PrintOption']
            };
            (pdfviewer_Searchbar as any).enableTextSearch = true;

            const target: HTMLElement = (pdfviewer_Searchbar && (pdfviewer_Searchbar as any).element) || (document.body as HTMLElement);
            target.tabIndex = target.tabIndex || 0;
            if (target.focus) { target.focus(); }
            const dispatched = Keydown(target, 'f', 'KeyF', { ctrlKey: true, metaKey: false });
            expect(dispatched).toBe(false);
            waitFor(() => {
                const box = document.getElementById('pdfviewer_Searchbar_search_box');
                if (!box) return true;
                const cs = getComputedStyle(box);
                return cs.display === 'none';
            })
                .then(() => {
                    const box = document.getElementById('pdfviewer_Searchbar_search_box');
                    if (box) {
                        const cs = getComputedStyle(box);
                        expect(cs.display === 'none').toBe(true);
                    } else {
                        expect(box).toBe(null);
                    }
                    done();
                })
                .catch((err: any) => done.fail(err as any));
        } catch (e) {
            done.fail(e as any);
        }
    });
});