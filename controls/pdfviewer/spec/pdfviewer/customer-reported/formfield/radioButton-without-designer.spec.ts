import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { RADIOBUTTON_B64, OLD_PDFVIEWER_JSON } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_RadioButton', () => {
    let pdfviewer_radioButton: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_radioButton' });
        document.body.appendChild(element);
        pdfviewer_radioButton = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + RADIOBUTTON_B64,
            enableFormDesigner: false
        });
        pdfviewer_radioButton.documentLoad = () => {
            
            done();
        }
        pdfviewer_radioButton.appendTo("#pdfviewer_radioButton");
    });

    afterAll(() => {
        if (pdfviewer_radioButton) {
            pdfviewer_radioButton.destroy();
            const el = document.getElementById('pdfviewer_radioButton');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_radioButton = null;
        }
    });

    afterEach(() => {
    });
    

    it("1018634 - Radio Button value updating programmatically without form designer", async function(done) {
        const field = pdfviewer_radioButton.retrieveFormFields();
        field[0].isSelected = true;
        pdfviewer_radioButton.updateFormFieldsValue(field[0]);
        var target: any = document.getElementById(field[0].id);
        expect(target.checked).toBe(true);

        //Download and Reload
        const blob = await pdfviewer_radioButton.saveAsBlob();
        const reloadPromise = new Promise<void>((resolve) => {
            pdfviewer_radioButton.documentLoad = () => resolve();
        });
        const reader = new FileReader();
        reader.onload = () => pdfviewer_radioButton.load(reader.result as string, null);
        reader.readAsDataURL(blob);
        await reloadPromise;

        const field1 = pdfviewer_radioButton.retrieveFormFields();
        var target1: any = document.getElementById(field1[0].id);
        expect(target1.checked).toBe(true);
        done();
    })

})