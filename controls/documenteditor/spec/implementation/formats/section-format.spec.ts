import { WTableHolder, Selection, DocumentEditorContainer, Toolbar } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { createElement } from '@syncfusion/ej2-base';
import { WSectionFormat } from '../../../src/document-editor/implementation/format/section-format';
import { TestHelper } from '../../test-helper.spec';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { SfdtExport } from "../../../src/document-editor/implementation/writer/sfdt-export";
import { BodyWidget} from '../../../src/index';
describe('TableHolder Validation Testing', () => {
    afterEach(() => {
        WSectionFormat.clear();
    });
    it('TableHolder destroy  Testing', () => {
console.log('TableHolder destroy  Testing');
        let holder: WTableHolder = new WTableHolder();
        holder.destroy();
        holder.destroy();
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
console.log('Section Format Copy Format Undefined Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(sectionFormat1);
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
console.log('Section Format Copy Format Undefined Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(undefined);
        expect('').toBe('')
    });
    it('Section Format Copy Format Testing', () => {
console.log('Section Format Copy Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = 50;
        sectionFormat1.headerDistance = 50;
        sectionFormat1.differentFirstPage = true;
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.differentFirstPage).toBe(true);
    });
    it('Section Format Copy Format Testing', () => {
console.log('Section Format Copy Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = undefined;
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.footerDistance).toBe(36);
    });
    it('Section Format destroy Testing', () => {
console.log('Section Format destroy Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.destroy();
        expect('').toBe('')
    });
    it('Section Format Clone Format Testing', () => {
console.log('Section Format Clone Format Testing');
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.cloneFormat();
        expect(sectionFormat.footerDistance).toBe(36);
    });
});

describe('Default section Format API Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        let defaultSectionFormat: object = {
            headerDistance: 25,
            footerDistance: 25,
            pageWidth: 500,
            pageHeight: 500,
            topMargin: 20,
            bottomMargin: 20,
            leftMargin: 20,
            rightMargin: 20,
        }
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.setDefaultSectionFormat(defaultSectionFormat);
        editor.appendTo('#container');
    });
    afterAll(() => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
    });
    it('check page width of the page', () => {
console.log('check page width of the page');
        expect(editor.selection.sectionFormat.pageWidth).toBe(500);
    });
    it('check page height of the page', () => {
console.log('check page height of the page');
        expect(editor.selection.sectionFormat.pageHeight).toBe(500);
    });
    it('check header distance', () => {
console.log('check header distance');
        expect(editor.selection.sectionFormat.headerDistance).toBe(25);
    });
    it('check footer distance', () => {
console.log('check footer distance');
        expect(editor.selection.sectionFormat.footerDistance).toBe(25);
    });
    it('check top margin', () => {
console.log('check top margin');
        expect(editor.selection.sectionFormat.topMargin).toBe(20);
    });
    it('check bottom margin', () => {
console.log('check bottom margin');
        expect(editor.selection.sectionFormat.bottomMargin).toBe(20);
    });
    it('check left margin', () => {
console.log('check left margin');
        expect(editor.selection.sectionFormat.leftMargin).toBe(20);
    });
    it('check right margin', () => {
console.log('check right margin');
        expect(editor.selection.sectionFormat.rightMargin).toBe(20);
    });
//     it('Footer distance validation', () => {
// console.log('Footer distance validation');
//         editor.openBlank();
//         editor.selection.goToFooter();
//         editor.editor.insertPageNumber();
//         expect(() => { editor.selection.sectionFormat.footerDistance = 34; }).not.toThrowError();
//     });
});
describe('container document default section format validation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let defaultSectionFormat: any;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ enableToolbar: false });
        defaultSectionFormat = {
        pageWidth: 500,
        pageHeight: 800,
        headerDistance: 56,
        footerDistance: 48,
        leftMargin: 12,
        rightMargin: 12,
        topMargin: 0,
        bottomMargin: 0,
        };
        container.setDefaultSectionFormat(defaultSectionFormat);
        container.appendTo(element);
    });
    afterAll(() => {
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        
        element = undefined;
        container = undefined;
    });
    it('Set document defalut section format API validation', () => {
        console.log('Set section format API validation');
        container.documentEditor.openBlank();
        container.setDefaultSectionFormat(defaultSectionFormat);
        expect(container.documentEditor.selection.sectionFormat.pageWidth).toBe(500);
        expect(container.documentEditor.selection.sectionFormat.pageHeight).toBe(800);
        expect(container.documentEditor.selection.sectionFormat.headerDistance).toBe(56);
        expect(container.documentEditor.selection.sectionFormat.footerDistance).toBe(48);
        expect(container.documentEditor.selection.sectionFormat.leftMargin).toBe(12);
        expect(container.documentEditor.selection.sectionFormat.rightMargin).toBe(12);
        expect(container.documentEditor.selection.sectionFormat.topMargin).toBe(0);
        expect(container.documentEditor.selection.sectionFormat.bottomMargin).toBe(0);
    });
    it('Get document defalut section format API validation', () => {
        console.log('Get section format API validation');
        // Container API
        let format: any = container.getDefaultSectionFormat();
        expect(format.pageWidth).toBe(500);
        expect(format.pageHeight).toBe(800);
        expect(format.headerDistance).toBe(56);
        expect(format.footerDistance).toBe(48);
        expect(format.leftMargin).toBe(12);
        expect(format.rightMargin).toBe(12);
        expect(format.topMargin).toBe(0);
        expect(format.bottomMargin).toBe(0);
        // Editor API
        format = container.documentEditor.getDefaultSectionFormat();
        expect(format.pageWidth).toBe(500);
        expect(format.pageHeight).toBe(800);
        expect(format.headerDistance).toBe(56);
        expect(format.footerDistance).toBe(48);
        expect(format.leftMargin).toBe(12);
        expect(format.rightMargin).toBe(12);
        expect(format.topMargin).toBe(0);
        expect(format.bottomMargin).toBe(0);
    });
});

describe('container document default section format validation', () => {
    let container: DocumentEditorContainer;
    let element: HTMLElement;
    let defaultSectionFormat: any;
    beforeAll(() => {
        element = createElement('div');
        document.body.appendChild(element);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ enableToolbar: false });
        defaultSectionFormat = {
        pageWidth: 500,
        pageHeight: 800,
        headerDistance: 56,
        footerDistance: 48,
        leftMargin: 12,
        rightMargin: 12,
        topMargin: 0,
        bottomMargin: 0,
        };
        container.setDefaultSectionFormat(defaultSectionFormat);
        container.appendTo(element);
    });
    afterAll(() => {
        expect(() => { container.destroy(); }).not.toThrowError();
        expect(element.childNodes.length).toBe(0);
        document.body.removeChild(element);
        
        element = undefined;
        container = undefined;
    });

    it('Set document defalut section format API validation', () => {
        console.log('Set section format API validation');
        container.documentEditor.openBlank();
        container.setDefaultSectionFormat(defaultSectionFormat);
        expect(container.documentEditor.selection.sectionFormat.pageWidth).toBe(500);
        expect(container.documentEditor.selection.sectionFormat.pageHeight).toBe(800);
        expect(container.documentEditor.selection.sectionFormat.headerDistance).toBe(56);
        expect(container.documentEditor.selection.sectionFormat.footerDistance).toBe(48);
        expect(container.documentEditor.selection.sectionFormat.leftMargin).toBe(12);
        expect(container.documentEditor.selection.sectionFormat.rightMargin).toBe(12);
        expect(container.documentEditor.selection.sectionFormat.topMargin).toBe(0);
        expect(container.documentEditor.selection.sectionFormat.bottomMargin).toBe(0);
    });
    it('Get document defalut section format API validation', () => {
        console.log('Get section format API validation');
        // Container API
        let format: any = container.getDefaultSectionFormat();
        expect(format.pageWidth).toBe(500);
        expect(format.pageHeight).toBe(800);
        expect(format.headerDistance).toBe(56);
        expect(format.footerDistance).toBe(48);
        expect(format.leftMargin).toBe(12);
        expect(format.rightMargin).toBe(12);
        expect(format.topMargin).toBe(0);
        expect(format.bottomMargin).toBe(0);
        // Editor API
        format = container.documentEditor.getDefaultSectionFormat();
        expect(format.pageWidth).toBe(500);
        expect(format.pageHeight).toBe(800);
        expect(format.headerDistance).toBe(56);
        expect(format.footerDistance).toBe(48);
        expect(format.leftMargin).toBe(12);
        expect(format.rightMargin).toBe(12);
        expect(format.topMargin).toBe(0);
        expect(format.bottomMargin).toBe(0);
    });
    
});

