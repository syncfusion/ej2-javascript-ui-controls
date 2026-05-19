import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, PageOrganizer
} from "../../../../src/index";
import { mouseDownEvent, mouseMoveEvent, mouseUpEvent, waitFor, triggerEvent } from "../../utils.spec";
import { DOC_WITH_LIST_DROPDOWN, LISTBOX_B64, OLD_PDFVIEWER_JSON } from "../../Data/pdf-data.spec";

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

/**
 * PdfViewer spec - ListBox and Dropdown selectedIndex update without Form Designer
 * Tests UI interaction bug where selectedIndex is not updated when form fields are clicked
 */
describe('PDF_Viewer_ListBox_SelectedIndex', () => {
    let pdfviewer_list_selectedIndex: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, PageOrganizer);

    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_list_selectedIndex' });
        document.body.appendChild(element);
        pdfviewer_list_selectedIndex = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + DOC_WITH_LIST_DROPDOWN,
            enableFormDesigner: false
        });
        pdfviewer_list_selectedIndex.documentLoad = () => {
            done();
        }
        pdfviewer_list_selectedIndex.appendTo("#pdfviewer_list_selectedIndex");
    });

    afterAll(() => {
        if (pdfviewer_list_selectedIndex) {
            pdfviewer_list_selectedIndex.destroy();
            const el = document.getElementById('pdfviewer_list_selectedIndex');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_list_selectedIndex = null;
        }
    });

    it('BUG-1025284- ListBox selectedIndex should update when 2nd option clicked via UI', (done) => {
        const fields: any = pdfviewer_list_selectedIndex.retrieveFormFields();
        const listBoxField: any = fields.find((f: any) => f.name === 'List Box1');
        
        // Simulate UI interaction - click on 2nd option in the ListBox
        const selectElement: any = document.getElementById(listBoxField.id);
        selectElement.selectedIndex = 1;
        
        // Trigger change event to simulate user interaction
        triggerEvent({ element: selectElement, eventName: 'change' });
        
        // Retrieve the field again to check if selectedIndex was updated
        const updatedFields: any = pdfviewer_list_selectedIndex.retrieveFormFields();
        const updatedListBoxField: any = updatedFields.find((f: any) => f.name === 'List Box1');
        
        // Assert that selectedIndex reflects the selected option (returns as array)
        expect((updatedListBoxField as any).selectedIndex).toEqual([1]);
        done();
    });

    it('BUG-1025284- ListBox selectedIndex should update when 3rd option clicked via UI', (done) => {
        const fields: any = pdfviewer_list_selectedIndex.retrieveFormFields();
        const listBoxField: any = fields.find((f: any) => f.name === 'List Box1');
        
        // Simulate UI interaction - click on 3rd option in the ListBox
        const selectElement: any = document.getElementById(listBoxField.id);
        selectElement.selectedIndex = 2;
        
        // Trigger change event to simulate user interaction
        triggerEvent({ element: selectElement, eventName: 'change' });
        
        // Retrieve the field again
        const updatedFields: any = pdfviewer_list_selectedIndex.retrieveFormFields();
        const updatedListBoxField: any = updatedFields.find((f: any) => f.name === 'List Box1');
        
        // Assert that selectedIndex reflects the 3rd option (returns as array)
        expect((updatedListBoxField as any).selectedIndex).toEqual([2]);
        done();
    });

});