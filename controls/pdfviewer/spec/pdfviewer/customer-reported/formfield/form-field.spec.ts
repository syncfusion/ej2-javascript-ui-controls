import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, PageOrganizer,
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor } from "../../utils.spec";
import { DOC_FORM_FIELDS } from "../../Data/pdf-data.spec";

/**
 * PDF Viewer - Retrieve Form Fields spec
 * Validates correct form field name handling when Form Designer is disabled
 */
describe('PDF_Viewer_RetriveFormFields Without designer', () => {

    // PDF Viewer instance used for this spec
    let pdfviewer_retriveFormFields: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer);

    /**
     * Initialize PDF Viewer with a document containing form fields
     * Form Designer is explicitly disabled
     */
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_retriveFormFields' });
        document.body.appendChild(element);

        pdfviewer_retriveFormFields = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + DOC_FORM_FIELDS,
            enableFormDesigner: false
        });

        // Trigger spec execution only after document is fully loaded
        pdfviewer_retriveFormFields.documentLoad = () => {
            done();
        };

        pdfviewer_retriveFormFields.appendTo("#pdfviewer_retriveFormFields");
    });

    /**
     * Cleanup PDF Viewer instance and DOM element after all specs
     */
    afterAll(() => {
        if (pdfviewer_retriveFormFields) {
            pdfviewer_retriveFormFields.destroy();
            const el = document.getElementById('pdfviewer_retriveFormFields');
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
            pdfviewer_retriveFormFields = null;
        }
    });

    afterEach(() => {
        // Reserved for future per-test cleanup if required
    });

    /**
     * Bug: 1021727
     * Ensures underscore (_) in form field names is preserved
     * when retrieving fields without Form Designer module
     */
    it("1021727 - Preserve underscore in form field names when retrieving fields without Form Designer", async function (done) {

        try {
            // Wait until form fields are populated internally
            await waitFor(() =>
                pdfviewer_retriveFormFields.formFieldCollections &&
                pdfviewer_retriveFormFields.formFieldCollections.length > 0
            );

            // Retrieve form fields after page load
            const retrievedFormFields = pdfviewer_retriveFormFields.retrieveFormFields();

            // Validate retrieved form field collection
            expect(retrievedFormFields).toBeDefined();
            expect(retrievedFormFields.length).toBeGreaterThan(0);

            // Expected field names where underscore should NOT be removed
            const expectedFieldNames = {
                'Checkbox_2': 'Checkbox_2',   // Checkbox should retain underscore
                'Radio_1': 'Radio_1',         // RadioButton should retain underscore
                'Listbox_2': 'Listbox_2'      // ListBox should retain underscore
            };

            // Validate each retrieved field
            for (let i = 0; i < retrievedFormFields.length; i++) {
                const retrievedField = retrievedFormFields[i];

                // Basic field validation
                expect(retrievedField).toBeDefined();
                expect(retrievedField.id).toBeDefined();
                expect(retrievedField.name).toBeDefined();

                // Verify underscore preservation based on field type
                if (retrievedField.type === 'CheckBox') {
                    expect(retrievedField.name).toBe(expectedFieldNames['Checkbox_2']);
                } else if (retrievedField.type === 'RadioButton') {
                    expect(retrievedField.name).toBe(expectedFieldNames['Radio_1']);
                } else if (retrievedField.type === 'ListBox') {
                    expect(retrievedField.name).toBe(expectedFieldNames['Listbox_2']);
                }
            }

            done();
        }
        catch (error) {
            // Fail the spec with detailed error information
            console.error('Test failed with error:', error);
            done.fail(error);
        }
    }
    );

});
