import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer
} from "../../../../src/index";
import { EMPTY_PDF_B64, READONLY_FORM_PDF_B64 } from "../../Data/pdf-data.spec";
import { mouseMoveEvent, mouseDownEvent } from "../../utils.spec";

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

    describe('1007499-Restricted form fields (readOnly)', () => {
        let restrictedViewer: PdfViewer = null;

        beforeAll((done) => {
            const el: HTMLElement = createElement('div', { id: 'pdfviewer_restricted' });
            document.body.appendChild(el);
            restrictedViewer = new PdfViewer({
                resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
                documentPath: "data:application/pdf;base64," + READONLY_FORM_PDF_B64,
                textFieldSettings: { isReadOnly: true },
                radioButtonFieldSettings: { isReadOnly: true },
                DropdownFieldSettings: { isReadOnly: true },
                checkBoxFieldSettings: { isReadOnly: true },
                signatureFieldSettings: { isReadOnly: true },
                listBoxFieldSettings: { isReadOnly: true },
                passwordFieldSettings: { isReadOnly: true },
                initialFieldSettings: { isReadOnly: true },
                documentLoad: () => { done(); }
            });

            restrictedViewer.appendTo('#pdfviewer_restricted');
        });

        afterAll(() => {
            if (restrictedViewer) {
                restrictedViewer.destroy();
                const el = document.getElementById('pdfviewer_restricted');
                if (el && el.parentNode) { el.parentNode.removeChild(el); }
                restrictedViewer = null;
            }
        });

        it('1007499-loads restricted form fields and all fields are readOnly', (done) => {
            try {
                expect((restrictedViewer as any).formDesignerModule).toBeDefined();
                const len = Array.isArray(restrictedViewer.formFieldCollection) ? restrictedViewer.formFieldCollection.length : 0;
                expect(len).toBe(8);
                (restrictedViewer.formFieldCollection || []).forEach((f: any) => {
                    expect(f.isReadonly).toBe(true);
                });
                done();
            } catch (e) {
                done.fail(e);
            }
        });
    });
    it('1007846-Form Field Preview Overflows on the Right Side of the Page', function (done) {
        try {
            const target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement;
            if (!target) throw new Error('textLayer not found');
            const pageDiv = document.querySelector('#pdfviewer_formFields_pageDiv_0') as HTMLDivElement;
            if (!pageDiv) throw new Error('pageDiv not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('Textbox');
            const rect = target.getBoundingClientRect();
            const insideX = rect.left + 600;
            const insideY = rect.top + 70;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX + 100, insideY);
            const helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            const pageWidth: number = pageDiv.clientWidth;
            const helperWidth: number = helper.offsetWidth || parseInt(helper.style.width || '0', 10);
            const expectedMaxLeft = Math.max(0, pageWidth - helperWidth);
            const leftFromStyle = parseFloat(helper.style.left || '0');
            expect(leftFromStyle).toBeLessThanOrEqual(expectedMaxLeft);
            done();
        } catch (e) {
            done.fail(e);
        }
    });
    it('1007846-Form Field Preview Overflows on the Bottom Side of the Page', function (done) {
        try {
            // Prefer annotation canvas; fallback to text layer
            const target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('textLayer not found');
            const pageDiv = document.querySelector('#pdfviewer_formFields_pageDiv_0') as HTMLDivElement | null;
            if (!pageDiv) throw new Error('pageDiv not found');
            // Activate Textbox mode
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('Textbox');
            const rect = target.getBoundingClientRect();
            const insideX = rect.left + 350;   // inside page horizontally
            const insideY = rect.top + 1000;    // inside page vertically
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY+50);
            const helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            // Move BEYOND BOTTOM EDGE using viewport (client) coordinates
            const pageHeight: number = pageDiv.clientHeight;
            // Helper size
            const helperHeight: number = helper.offsetHeight || parseInt(helper.style.height || '0', 10) || 0;
            // Expected clamp: top ≤ pageHeight - helperHeight
            const expectedMaxTop: number = Math.max(0, pageHeight - helperHeight);
            // Read applied 'top' from style (fallback parse if needed)
            const topFromStyle: number = parseFloat(helper.style.top || '0');
            // Correct direction: topFromStyle ≤ expectedMaxTop
            expect(topFromStyle).toBeLessThanOrEqual(expectedMaxTop);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-Textbox Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('Textbox');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-Password Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('Password');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-Checkbox Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('CheckBox');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-RadioButton Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('RadioButton');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-DropDown Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('DropDown');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-ListBox Field Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('ListBox');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-SignatureField Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('SignatureField');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });
    it('1004712-InitialField Misplaced Near Page Gaps and Bottom Page Edge', function (done) {
        try {
            var target = document.querySelector('#pdfviewer_formFields_textLayer_0') as HTMLElement | null;
            if (!target) throw new Error('Page container not found');
            pdfviewer_formFields.formDesignerModule.setFormFieldMode('InitialField');
            var rect = target.getBoundingClientRect();
            var insideX = rect.left + 70;
            var insideY = rect.bottom - 10;
            mouseMoveEvent(target, insideX, insideY);
            mouseMoveEvent(target, insideX, insideY + 2);
            var helper = document.getElementById('FormField_helper_html_element') as HTMLElement | null;
            if (!helper) throw new Error('Helper not created inside page');
            var helperLeft = parseInt(getComputedStyle(helper).left || '0');
            mouseDownEvent(target, insideX, insideY + 2);
            var formField = document.querySelector('[id$="_html_element"]').firstElementChild;
            var leftFromStyle = parseInt(getComputedStyle(formField).left || '0');
            expect(helperLeft).toBeLessThanOrEqual(leftFromStyle);
            done();
        }
        catch (e) {
            done.fail(e);
        }
    });  
});
