import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { EMPTY_PDF_B64, OLD_PDFVIEWER_JSON } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_StickyNotes', () => {
    let pdfviewer_listbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_listbox' });
        document.body.appendChild(element);
        pdfviewer_listbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_listbox.documentLoad = () => {
            done();
        }
        pdfviewer_listbox.appendTo("#pdfviewer_listbox");
    });

    afterAll(() => {
        if (pdfviewer_listbox) {
            pdfviewer_listbox.destroy();
            const el = document.getElementById('pdfviewer_listbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_listbox = null;
        }
    });

    afterEach(() => {
    });

    it("1017566 - Listbox with color", async (done) => {
        let addListbox;
        try {
            expect(pdfviewer_listbox.formDesignerModule).toBeDefined();
            addListbox = createElement('button', { id: 'add_sign_field' });
            document.body.appendChild(addListbox);
            addListbox.addEventListener('click', function () {
                var option = [
                    { itemName: 'Item 1', itemValue: 'item1' },
                    { itemName: 'Item 2', itemValue: 'item2' },
                    { itemName: 'Item 3', itemValue: 'item3' }
                ];
                pdfviewer_listbox.formDesignerModule.addFormField('ListBox', {
                    name: 'States',
                    pageNumber: 1,
                    bounds: { X: 100, Y: 310, Width: 220, Height: 70 },
                    options: option,
                    color: "#2196f3",
                    selectedIndex: 0
                } as any);
            });
            addListbox.click();
            //reload
            const blob = await pdfviewer_listbox.saveAsBlob();
            const reloadPromise = new Promise<void>((resolve) => {
                pdfviewer_listbox.documentLoad = () => resolve();
            });
            const reader = new FileReader();
            reader.onload = () => pdfviewer_listbox.load(reader.result as string, null);
            reader.readAsDataURL(blob);
            await reloadPromise;
            expect(pdfviewer_listbox.formFieldCollection[0].color).toBe('#2196f3ff');

        } catch (err) {
            done.fail(err);
        }
        done();
    });

})