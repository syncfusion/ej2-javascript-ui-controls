import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";

/**
* PdfViewer spec
*/
describe('PDF_Viewer_Signature', () => {
    let pdfviewer_signature: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_signature' });
        document.body.appendChild(element);
        pdfviewer_signature = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_signature.documentLoad = () => {
            done();
        }
        pdfviewer_signature.appendTo("#pdfviewer_signature");
    });

    afterAll(() => {
        if (pdfviewer_signature) {
            pdfviewer_signature.destroy();
            const el = document.getElementById('pdfviewer_signature');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_signature = null;
        }
    });

    afterEach(() => {
    });

    it("1004716- SignatureFieldSettings: enabling Read-Only mode places the Signature field at the intended position", async (done: DoneFn) => {
      try {
        pdfviewer_signature.signatureFieldSettings.isReadOnly = true;
        pdfviewer_signature.initialFieldSettings.isReadOnly = true;
        // Resolve first page to click on
        const page = document.querySelector(
          "#pdfviewer_signature_textLayer_0",
        ) as HTMLElement | null;
        const target: HTMLElement | null = page;
        if (!target) {
          throw new Error(
            "Could not find target element to dispatch mouse events. Update selector in test.",
          );
        }
        const pageRect = target.getBoundingClientRect();
        // Click FormDesigner
        const formDesignerBtn = document.querySelector(
          "#pdfviewer_signature_formdesigner",
        ) as HTMLElement | null;
        if (!formDesignerBtn) {
          throw new Error(
            "FormDesigner button not found: #pdfviewer_signature_formdesigner",
          );
        }
        formDesignerBtn.click();
        // Click AddSignature
        const addSignatureBtn = document.querySelector(
          "#pdfviewer_signature_formfield_signature",
        ) as HTMLElement | null;
        if (!addSignatureBtn) {
          throw new Error(
            "AddSignature button not found: #pdfviewer_signature_formfield_signature",
          );
        }
        addSignatureBtn.click();
        // Choose Signature from popup: children[0].children[0].children[0]
        const popup = document.querySelector(
          "#pdfviewer_signature_formfield_signature-popup",
        ) as HTMLElement | null;
        if (!popup) {
          throw new Error(
            "Signature popup not found: #pdfviewer_signature_formfield_signature-popup",
          );
        }
        const signatureItem =
          popup.children[0] &&
          ((popup.children[0] as HTMLElement).children[0]
            .children[0] as HTMLElement | null);
        if (!signatureItem) {
          throw new Error("Initial item not found in popup");
        }
        signatureItem.click();
        // CENTER:
        const x = Math.round(pageRect.left + pageRect.width * 0.3);
        const y = Math.round(pageRect.top + pageRect.height - 800);
        // Click to place (mousedown + mouseup)
        mouseMoveEvent(target, x, y);
        mouseDownEvent(target, x, y);
        mouseUpEvent(target, x, y);
        const collection = pdfviewer_signature.formFieldCollection || [];
        const formFieldElement = document.getElementById(
          collection[collection.length - 1].id,
        ) as HTMLElement | null;
        expect(formFieldElement).toBeTruthy();
        expect(formFieldElement.style.pointerEvents).toBe("none");
        done();
      } catch (e) {
        done.fail(e as Error);
      }
    });
});