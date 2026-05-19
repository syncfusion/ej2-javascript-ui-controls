import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer
} from "../../../../src/index";
import { triggerEvent } from "../../utils.spec";
import { DOC_WITH_LIST_DROPDOWN } from "../../Data/pdf-data.spec";

/**
 * PdfViewer spec - ListBox and Dropdown selectedIndex update without Form Designer
 * Tests UI interaction bug where selectedIndex is not updated when form fields are clicked
 */
describe('PDF_Viewer__Dropdown_SelectedIndex', () => {
    let pdfviewer_dropdown_selectedIndex: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_dropdown_selectedIndex' });
        document.body.appendChild(element);
        pdfviewer_dropdown_selectedIndex = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + DOC_WITH_LIST_DROPDOWN,
            enableFormDesigner: false
        });
        pdfviewer_dropdown_selectedIndex.documentLoad = () => {
            done();
        }
        pdfviewer_dropdown_selectedIndex.appendTo("#pdfviewer_dropdown_selectedIndex");
    });

    afterAll(() => {
        if (pdfviewer_dropdown_selectedIndex) {
            pdfviewer_dropdown_selectedIndex.destroy();
            const el = document.getElementById('pdfviewer_dropdown_selectedIndex');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_dropdown_selectedIndex = null;
        }
    });

    it('BUG-1025284 - Dropdown selectedIndex should update when 2nd option clicked via UI', (done) => {
        const fields: any = pdfviewer_dropdown_selectedIndex.retrieveFormFields();
        const dropdownField: any = fields.find((f: any) => f.name === 'Dropdown2');
        
        // Simulate UI interaction - click on 2nd option in the Dropdown
        const selectElement: any = document.getElementById(dropdownField.id);
        selectElement.selectedIndex = 1;
        
        // Trigger change event to simulate user interaction
        triggerEvent({ element: selectElement, eventName: 'change' });
        
        // Retrieve the field again to check if selectedIndex was updated
        const updatedFields: any = pdfviewer_dropdown_selectedIndex.retrieveFormFields();
        const updatedDropdownField: any = updatedFields.find((f: any) => f.name === 'Dropdown2');
        
        // Assert that selectedIndex reflects the selected option (returns as array)
        expect((updatedDropdownField as any).selectedIndex).toEqual([1]);
        done();
    });


    it('BUG-1025284- Dropdown selectedIndex should update when 3rd option clicked via UI', (done) => {
        const fields: any = pdfviewer_dropdown_selectedIndex.retrieveFormFields();
        const dropdownField: any = fields.find((f: any) => f.name === 'Dropdown2');
        
        // Simulate UI interaction - click on 3rd option in the Dropdown
        const selectElement: any = document.getElementById(dropdownField.id);
        selectElement.selectedIndex = 2;
        
        // Trigger change event to simulate user interaction
        triggerEvent({ element: selectElement, eventName: 'change' });
        
        // Retrieve the field again
        const updatedFields: any = pdfviewer_dropdown_selectedIndex.retrieveFormFields();
        const updatedDropdownField: any = updatedFields.find((f: any) => f.name === 'Dropdown2');
        
        // Assert that selectedIndex reflects the 3rd option (returns as array)
        expect((updatedDropdownField as any).selectedIndex).toEqual([2]);
        done();
    });

});
