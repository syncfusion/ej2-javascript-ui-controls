import { createElement } from "@syncfusion/ej2-base";
import {
    PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
    TextSelection, TextSearch, Print, Annotation, FormFields, AnnotationDataFormat, FormDesigner, PageOrganizer, CheckBoxFieldSettings
} from "../../../../src/index";
import { EMPTY_PDF_B64, READONLY_FORM_PDF_B64 } from "../../Data/pdf-data.spec";


describe('PDFViewer_CheckBox_With_FormDesigner', () => {
    let pdfviewer_checkbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_checkbox' });
        document.body.appendChild(element);
        pdfviewer_checkbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_checkbox.documentLoad = () => {
            done();
        }
        pdfviewer_checkbox.appendTo("#pdfviewer_checkbox");
    });
    afterAll(() => {
        if (pdfviewer_checkbox) {
            pdfviewer_checkbox.destroy();
            const el = document.getElementById('pdfviewer_checkbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_checkbox = null;
        }
    });
    afterEach(() => {
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on Undo and Redo', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'ChkBoxNumber',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 500, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: '11', isChecked: false, toolTip: 'First' });
            addField({ x: 130, value: '22', isChecked: true, toolTip: 'Second' });
            addField({ x: 160, value: '11', isChecked: false, toolTip: 'Third' });
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'ChkBoxNumber');
            const firstInput = document.getElementById(keys[0] + '_input');
            firstInput.click();
            const secondInput = document.getElementById(keys[1] + '_input');
            secondInput.click();
            const undo = document.getElementById("pdfviewer_checkbox_undo");
            const redo = document.getElementById("pdfviewer_checkbox_redo");
            undo.click();
            const tableAfter_1: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "11");
            var firstgroupUnCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "22");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            undo.click();
            const tableAfter_2: any = viewer.nameTable;
            var secondgroupAllUnCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "11");
            secondgroupAllUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            redo.click();
            redo.click();
            const tableAfter_3: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_3).filter((val: any) => val.value === "22");
            var firstgroupUnCheck = objectValues(tableAfter_3).filter((val: any) => val.value === "11");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on same name and same value', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'CheckBox',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 100, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: '1', isChecked: false, toolTip: 'First checkbox' });
            addField({ x: 130, value: '1', isChecked: true, toolTip: 'Second checkbox' });
            addField({ x: 160, value: '1', isChecked: false, toolTip: 'Third checkbox' });
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'CheckBox');
            const firstKey = keys[0];
            const firstInput = document.getElementById(firstKey + '_input');
            firstInput.click();
            const tableAfter: any = viewer.nameTable;
            const groupAfter = objectValues(tableAfter).filter((val: any) => val.value === "1");
            groupAfter.forEach((e: any) => expect(e.isChecked).toBe(true));
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on same name and different value', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'ChkNumber',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 300, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: 'one', isChecked: false, toolTip: 'First' });
            addField({ x: 130, value: 'two', isChecked: true, toolTip: 'Second' });
            addField({ x: 160, value: 'one', isChecked: false, toolTip: 'Third' });
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'ChkNumber');
            const firstInput = document.getElementById(keys[0] + '_input');
            firstInput.click();
            const tableAfter_1: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "one");
            var firstgroupUnCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "two");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            const secondInput = document.getElementById(keys[1] + '_input');
            secondInput.click();
            const tableAfter_2: any = viewer.nameTable;
            var secondgroupCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "two");
            var secondgroupUnCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "one");
            secondgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            secondgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on download and reload', async (done: DoneFn) => {
        try {
            const formDesigner = pdfviewer_checkbox.formDesigner || pdfviewer_checkbox.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            var addField = function (opts: any) {
                return pdfviewer_checkbox.formDesignerModule.addFormField('CheckBox', {
                    name: 'CheckBox',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 500, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            };
            addField({ x: 100, value: 'first', isChecked: false, toolTip: 'First checkbox' });
            addField({ x: 130, value: 'second', isChecked: true, toolTip: 'Second checkbox' });
            const blob = await pdfviewer_checkbox.saveAsBlob();
            const prevHandler = pdfviewer_checkbox.documentLoad;
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string
                pdfviewer_checkbox.load(dataUrl, "");
                const tableAfter: any = (pdfviewer_checkbox).nameTable;
                var groupId1 = objectValues(tableAfter).filter(function (val: any) { return val.value === "first"; });
                var groupId2 = objectValues(tableAfter).filter(function (val: any) { return val.value === "second"; });
                expect(groupId1.length).toBeGreaterThanOrEqual(1);
                expect(groupId2.length).toBeGreaterThanOrEqual(1);
            };
            reader.onerror = () => {
                pdfviewer_checkbox.documentLoad = prevHandler;
                if (typeof done === 'function' && done.fail) {
                    done.fail('FileReader failed while reading the saved PDF blob');
                } else {
                    console.error('FileReader failed while reading the saved PDF blob');
                }
            };
            reader.readAsDataURL(blob);
            done();
        }
        catch (e) {
            done.fail(e as any);
        }
    });
});
describe('PDFViewer_CheckBox_With_FormDesigner', () => {
    let pdfviewer_checkbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_checkbox' });
        document.body.appendChild(element);
        pdfviewer_checkbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_checkbox.documentLoad = () => {
            done();
        }
        pdfviewer_checkbox.appendTo("#pdfviewer_checkbox");
    });
    afterAll(() => {
        if (pdfviewer_checkbox) {
            pdfviewer_checkbox.destroy();
            const el = document.getElementById('pdfviewer_checkbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_checkbox = null;
        }
    });
    afterEach(() => {
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on Undo and Redo after checkbox name change', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'ChkBoxNumber',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 500, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: '11', isChecked: false, toolTip: 'First' });
            addField({ x: 130, value: '22', isChecked: true, toolTip: 'Second' });
            addField({ x: 160, value: '11', isChecked: false, toolTip: 'Third' });
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'ChkBoxNumber');
            const firstInput = document.getElementById(keys[0] + '_input');
            firstInput.click();
            const secondInput = document.getElementById(keys[1] + '_input');
            secondInput.click();
            const undo = document.getElementById("pdfviewer_checkbox_undo");
            const redo = document.getElementById("pdfviewer_checkbox_redo");
            undo.click();
            const tableAfter_1: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "11");
            var firstgroupUnCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "22");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            undo.click();
            const tableAfter_2: any = viewer.nameTable;
            var secondgroupAllUnCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "11");
            secondgroupAllUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            redo.click();
            redo.click();
            const tableAfter_3: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_3).filter((val: any) => val.value === "22");
            var firstgroupUnCheck = objectValues(tableAfter_3).filter((val: any) => val.value === "11");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
});
describe('PDFViewer_CheckBox_Without_FormDesigner_Download_Reload', () => {
    let pdfviewer_checkbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_checkbox' });
        document.body.appendChild(element);
        pdfviewer_checkbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_checkbox.documentLoad = () => {
            done();
        }
        pdfviewer_checkbox.appendTo("#pdfviewer_checkbox");
    });
    afterAll(() => {
        if (pdfviewer_checkbox) {
            pdfviewer_checkbox.destroy();
            const el = document.getElementById('pdfviewer_checkbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_checkbox = null;
        }
    });
    afterEach(() => {
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on download and reload', async (done: DoneFn) => {
        try {
            const formDesigner = pdfviewer_checkbox.formDesigner || pdfviewer_checkbox.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            var addField = function (opts: any) {
                return pdfviewer_checkbox.formDesignerModule.addFormField('CheckBox', {
                    name: 'CheckBox',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 500, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            };
            addField({ x: 100, value: 'first', isChecked: false, toolTip: 'First checkbox' });
            addField({ x: 130, value: 'second', isChecked: true, toolTip: 'Second checkbox' });
            pdfviewer_checkbox.enableFormDesigner = false;
            const blob = await pdfviewer_checkbox.saveAsBlob();
            const prevHandler = pdfviewer_checkbox.documentLoad;
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string
                pdfviewer_checkbox.load(dataUrl, "");
                const tableAfter: any = (pdfviewer_checkbox).nameTable;
                var groupId1 = objectValues(tableAfter).filter(function (val: any) { return val.value === "first"; });
                var groupId2 = objectValues(tableAfter).filter(function (val: any) { return val.value === "second"; });
                expect(groupId1.length).toBeGreaterThanOrEqual(1);
                expect(groupId2.length).toBeGreaterThanOrEqual(1);
            };
            reader.onerror = () => {
                pdfviewer_checkbox.documentLoad = prevHandler;
                if (typeof done === 'function' && done.fail) {
                    done.fail('FileReader failed while reading the saved PDF blob');
                } else {
                    console.error('FileReader failed while reading the saved PDF blob');
                }
            };
            reader.readAsDataURL(blob);
            done();
        }
        catch (e) {
            done.fail(e as any);
        }
    });
});
describe('PDFViewer_CheckBox_Without_FormDesigner_SameName_SameValue', () => {
    let pdfviewer_checkbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_checkbox' });
        document.body.appendChild(element);
        pdfviewer_checkbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_checkbox.documentLoad = () => {
            done();
        }
        pdfviewer_checkbox.appendTo("#pdfviewer_checkbox");
    });
    afterAll(() => {
        if (pdfviewer_checkbox) {
            pdfviewer_checkbox.destroy();
            const el = document.getElementById('pdfviewer_checkbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_checkbox = null;
        }
    });
    afterEach(() => {
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on same name and same value', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'CheckBox',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 100, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: '1', isChecked: false, toolTip: 'First checkbox' });
            addField({ x: 130, value: '1', isChecked: true, toolTip: 'Second checkbox' });
            addField({ x: 160, value: '1', isChecked: false, toolTip: 'Third checkbox' });
            viewer.enableFormDesigner = false;
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'CheckBox');
            const firstKey = keys[0];
            const firstInput = document.getElementById(firstKey + '_input');
            firstInput.click();
            const tableAfter: any = viewer.nameTable;
            const groupAfter = objectValues(tableAfter).filter((val: any) => val.value === "1");
            groupAfter.forEach((e: any) => expect(e.isChecked).toBe(true));
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
});
describe('PDFViewer_CheckBox_Without_FormDesigner_SameName_DifferentValues', () => {
    let pdfviewer_checkbox: PdfViewer = null;
    PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, ThumbnailView, BookmarkView,
        TextSelection, TextSearch, Print, Annotation, FormFields, FormDesigner, PageOrganizer);
    beforeAll((done) => {
        const element: HTMLElement = createElement('div', { id: 'pdfviewer_checkbox' });
        document.body.appendChild(element);
        pdfviewer_checkbox = new PdfViewer({
            resourceUrl: window.location.origin + '/base/src/pdfviewer/ej2-pdfviewer-lib',
            documentPath: "data:application/pdf;base64," + EMPTY_PDF_B64
        });
        pdfviewer_checkbox.documentLoad = () => {
            done();
        }
        pdfviewer_checkbox.appendTo("#pdfviewer_checkbox");
    });
    afterAll(() => {
        if (pdfviewer_checkbox) {
            pdfviewer_checkbox.destroy();
            const el = document.getElementById('pdfviewer_checkbox');
            if (el && el.parentNode) { el.parentNode.removeChild(el); }
            pdfviewer_checkbox = null;
        }
    });
    afterEach(() => {
    });
    it('1010948-Retrieve grouped checkbox values with Form Designer on same name and different value', (done) => {
        try {
            const viewer: any = pdfviewer_checkbox;
            const formDesigner = viewer.formDesigner || viewer.formDesignerModule;
            expect(formDesigner).toBeTruthy('FormDesigner module must be injected.');
            const addField = (opts: any) =>
                viewer.formDesignerModule.addFormField('CheckBox', {
                    name: 'ChkNumber',
                    pageNumber: 1,
                    bounds: { X: opts.x, Y: 300, Width: 18, Height: 18 },
                    isChecked: opts.isChecked,
                    tooltip: opts.toolTip || '',
                    value: opts.value
                } as CheckBoxFieldSettings);
            addField({ x: 100, value: 'one', isChecked: false, toolTip: 'First' });
            addField({ x: 130, value: 'two', isChecked: true, toolTip: 'Second' });
            addField({ x: 160, value: 'one', isChecked: false, toolTip: 'Third' });
            viewer.enableFormDesigner = false;
            const nameTable: any = viewer.nameTable;
            const keys = Object.keys(nameTable).filter(k => nameTable[k].formFieldAnnotationType === 'Checkbox' && nameTable[k].name === 'ChkNumber');
            const firstInput = document.getElementById(keys[0] + '_input');
            firstInput.click();
            const tableAfter_1: any = viewer.nameTable;
            var firstgroupCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "one");
            var firstgroupUnCheck = objectValues(tableAfter_1).filter((val: any) => val.value === "two");
            firstgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            firstgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            const secondInput = document.getElementById(keys[1] + '_input');
            secondInput.click();
            const tableAfter_2: any = viewer.nameTable;
            var secondgroupCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "two");
            var secondgroupUnCheck = objectValues(tableAfter_2).filter((val: any) => val.value === "one");
            secondgroupCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(true); });
            secondgroupUnCheck.forEach(function (e: any) { return expect(e.isChecked).toBe(false); });
            done();
        } catch (e) {
            done.fail(e as any);
        }
    });
});
function objectValues<T extends object>(o: T): any[] {
  const result: any[] = [];
  for (const k in o) {
    if (Object.prototype.hasOwnProperty.call(o, k)) {
      result.push((o as any)[k]);
    }
  }
  return result;
}
