import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
// import { mouseDownEvent, mouseMoveEvent, mouseUpEvent } from "../../utils.spec";
import { EMPTY_PDF_B64 } from "../../Data/pdf-data.spec";
import { mouseClickEvent, mouseMoveEvent, mouseDownEvent, Keydown, waitFor } from "../../utils.spec";


describe('PDF_Viewer_FormFields', () => {
    let pdfviewer_formFields: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_formFields' });
        document.body.appendChild(element);
        pdfviewer_formFields = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_formFields.documentLoad = () => {
            done();
        }
        pdfviewer_formFields.appendTo("#pdfviewer_formFields");
    });

    afterAll(() => {
        if (pdfviewer_formFields) {
            pdfviewer_formFields.destroy();
            const el = document.getElementById('pdfviewer_formFields');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_formFields = null;
        }
    });

    afterEach(() => {
    });
    it("1013458-Read-only: Tab should not focus form field", async (done: DoneFn) => {
      try {
        // Open the form designer
        const formDesignerBtn = document.querySelector(
          "#pdfviewer_formFields_formdesigner",
        ) as HTMLElement | null;
        if (!formDesignerBtn) throw new Error("formDesignerBtn not found");
        mouseClickEvent(formDesignerBtn);
        // Click the text box
        const textBox = document.querySelector(
          "#pdfviewer_formFields_formdesigner_textbox",
        ) as HTMLElement | null;
        if (!textBox) throw new Error("textBox not found");
        mouseClickEvent(textBox);
        // Target
        const target = document.querySelector(
          "#pdfviewer_formFields_textLayer_0",
        ) as HTMLElement | null;
        if (!target) throw new Error("Page container not found");
        const rect = target.getBoundingClientRect();
        var clientX = rect.left + 50;
        var clientY = rect.top + 50;
        // Place the text box
        mouseMoveEvent(target, clientX, clientY);
        mouseDownEvent(target, clientX, clientY);
        // Create a temporary button
        const btn = document.createElement("button");
        btn.id = "test-view-button_0";
        btn.textContent = "View";
        document.body.appendChild(btn);
        // Apply read-only to all fields
        const formFields = (pdfviewer_formFields as any).retrieveFormFields();
        btn.addEventListener("click", () => {
          for (let i = 0; i < formFields.length; i++) {
            (pdfviewer_formFields as any).formDesignerModule.updateFormField(
              (pdfviewer_formFields as any).formFieldCollections[i],
              { isReadOnly: true },
            );
          }
        });
        // Trigger the click handler
        btn.click();
        // Close the form designer
        mouseClickEvent(formDesignerBtn);
        // Wait until the form field exists
        await waitFor(() => {
          const el = document.querySelector(
            'input.e-pv-formfield-input[type="text"]',
          );
          return !!el;
        });
        // Formfield (Textbox)
        const input = document.querySelector(
          'input.e-pv-formfield-input[type="text"]',
        ) as HTMLInputElement | null;
        mouseClickEvent(target);
        // Press the tab key
        Keydown(input, "Tab", "Tab");
        expect(input.disabled).toBe(true);
        // Remove all temporary buttons created for this test
        if (btn.parentNode) {
          btn.parentNode.removeChild(btn);
        }
        done();
      } catch (e) {
        done.fail(e as any);
      }
    });
});