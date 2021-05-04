import { WTableHolder, Selection } from '../../../src/index';
import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { Editor } from '../../../src/document-editor/implementation/editor/editor';
import { createElement } from '@syncfusion/ej2-base';
import { WSectionFormat } from '../../../src/document-editor/implementation/format/section-format';
import { TestHelper } from '../../test-helper.spec';
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
        document.body.innerHTML = '';
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
    it('Footer distance validation', () => {
console.log('Footer distance validation');
        editor.openBlank();
        editor.selection.goToFooter();
        editor.editor.insertPageNumber();
        expect(() => { editor.selection.sectionFormat.footerDistance = 34; }).not.toThrowError();
    });
});
