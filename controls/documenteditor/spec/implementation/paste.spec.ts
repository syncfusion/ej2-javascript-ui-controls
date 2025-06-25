import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { WListLevel } from '../../src/document-editor/implementation/list/list-level';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, FieldElementBox, BodyWidget, ParagraphWidget, HeaderFooters, TextElementBox, TableCellWidget, TableWidget, TableRowWidget, Widget } from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';
import { HyperlinkDialog } from '../../src/document-editor/implementation/dialogs/hyperlink-dialog';
import { JsonAdaptor } from '@syncfusion/ej2-data';
import { BookmarkDialog } from '../../src/document-editor/implementation/dialogs/bookmark-dialog';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * Editor Spec
 */

describe('PasteMethod', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory,SfdtExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            
            done();
        }, 1000);
    });

    //Paste only Table

    it('NestTable as pasteOption , SFDT with Table',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'NestTable');
        expect(editor.selection.currentPasteAction).toBe('NestTable');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(2);
    });

    it('InsertAsRows as pasteOption , SFDT with Table',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'InsertAsRows');
        expect(editor.selection.currentPasteAction).toBe('InsertAsRows');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(6);
    });

    it('InsertAsColumns as pasteOption , SFDT with Table',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'InsertAsColumns');
        expect(editor.selection.currentPasteAction).toBe('InsertAsColumns');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(4);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(5);
    });

    it('OverwriteCells as pasteOption , SFDT with Table',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        editor.selection.handleDownKey();
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'OverwriteCells');
        expect(editor.selection.currentPasteAction).toBe('OverwriteCells');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(5);
    });

    it('No pasteOption for first row , SFDT with Table ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt);
        expect(editor.selection.currentPasteAction).toBe('InsertAsColumns');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(4);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(5);
    });

    it('No pasteOption for first row , SFDT with Table ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        editor.selection.handleDownKey();
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt);
        expect(editor.selection.currentPasteAction).toBe('OverwriteCells');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(5);
        
    });

    it('KeepSourceFormatting pasteOption for first row , SFDT with Table ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'KeepSourceFormatting');
        expect(editor.selection.currentPasteAction).toBe('InsertAsColumns');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(4);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(5);
    });

    it('MergeWithExistingFormatting pasteOption for first row , SFDT with Table ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'MergeWithExistingFormatting');
        expect(editor.selection.currentPasteAction).toBe('InsertAsColumns');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(4);
        expect(((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets[0] as TableRowWidget).childWidgets.length).toBe(5);
    });

    it('KeepTextOnly pasteOption for first row , SFDT with Table ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        editor.selection.handleDownKey();
        var optimizeSfdt = '{"sfdt":"UEsDBBQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAc2ZkdOyaXW/bNhSG/wrBXezGNfQZWb5r43jYxbqg9a62XJASZROjKIGkkqaB//sOSdlxsnirGw/rMMaAeEQefj9+eRzpAXe94S3/zD42tcFzowY2wZpVeP7rA6buqtzVqB6MB0yo+h3P4wne1MqneB5NI0ihOiS0Vtr6CeOu2vmIu9FJb5yT7neVJDhE2wlW65PcTX+SOz1tMLcneW9O8q7r09yHE9zBX7Q2a5ZHaZkWsKxPb83TW3p4C5UPd71qbMfU9dvoz5AmtidKOZjg27tyTYnz0MSnhvhS7pkRMEB8SQZNBFqSynQKT/6m5e3N9gbaqTxtVSfsJMFT3Y1Gf+dBu/U9/pm3aLdQRX5spdxU8XfvFvazXOInAH5d/Uciv64+feX4/8PMatc8Xbs5XUX24+dUQd04j6ZZUpZlclHkxSxOcqhyfkjfKc4acY9qpivFKUM/ypr1DC7SoKtbuAZyA7nfIrkfWMMUkxVDpkOk7wWvCBUM9R1Y96gniqwV6TcacYkW1z+hOAsoB5RfjfKNhfnlqDAKUeG3tblnjgr3gvFMin4ejOY1Q12DfvmIruSarFlrD9AVI+33Gl120qhOoDfoUnCb3ynUmQ1TSHbyzWKFVhuuanRNlLnfa9RjZ0GV/neq9IXn6DEgA1IBqTMjtQ+34oBTwCmERyE8Ond4pCE+eg/xEPgsmOi4MQwtuWpREJwgOK8+v14iK4AVwDpfYJQEnAJOITAKgdEXB0Yuurn6xKrB8E7OfbTzw8BrAnIyQdeKVIZXDL3ltZ4gImu06kBCgs4EnXn1sfWUvYBUQOp8kVAacAo4/VUkZEmAdZGDENAs09XONlSMAdLQGNdP5fCYZnGRJsmsyKKLMonT8tkZDe0mUV6W2bPD+iDfHMmnR/IFl+OM7NPn6BHQEJv9q1TZJ/U2oydj6jycSFkxcnBtrPiAr2aj3vTQbl7mU0virCjKpLyYzWBLoZdZFk/LKIqSLIuBriT3aBXuvQC1t8zeonurbno3hrpj3hjHpnrpidE+ZRLGk0xwY1Nbzncp835rOzv8VhHKK9BOalXgPbu7JmuGt3ZC1MHjxGE5/llx0Obe669rRrp/c6iWCGhDfjq8e6bGMBTIwCveMo2gI/Sha4kNAsDDvQkx+pCXnZqGHSmQR0o4MBFHaWot6xJH+czarrNoPGP8F97OYsEaMghjH1/5lzjQspMG25WoDWxleuHG1/p5m8qvonlcbLspG9MKZxGj/I+spvGUNdKuhnZLd3iA/TYAByn2AlUdKc925XJffmN/3EHH/0SrVdd6tmCvQR1h/Ns/AAAA//8DAFBLAQItABQAAAAIAEgv/1i7Bcos3gMAAL0qAAAEAAAAAAAAAAAAIAAAAAAAAABzZmR0UEsFBgAAAAABAAEAMgAAAAAEAAAAAA=="}';
        editor.editorModule.paste(optimizeSfdt,'KeepTextOnly');
        expect(editor.selection.currentPasteAction).toBe('OverwriteCells');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(5);
    });

    //Paste Table and Content

    it('No pasteOption and  SFDT with both Table and Content ',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"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"}';
        editor.editorModule.paste(optimizeSfdt);
        expect(editor.selection.currentPasteAction).toBe('DefaultPaste');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(2);
    });

    it('MergeWithExistingFormatting paste options and SFDT with both Table and Content',() =>{
        editor.openBlank();
        editor.editorModule.insertTable(2,2);
        var optimizeSfdt = '{"sfdt":"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"}';
        editor.editorModule.paste(optimizeSfdt,'MergeWithExistingFormatting');
        expect(editor.selection.currentPasteAction).toBe('DefaultPaste');
        expect((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).childWidgets.length).toBe(2);
    });
});

 
