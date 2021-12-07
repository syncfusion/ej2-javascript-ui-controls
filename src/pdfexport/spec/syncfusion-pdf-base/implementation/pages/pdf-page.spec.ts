/**
 * spec document for PdfPage.ts class
 */
import { PdfPage } from '../../../../src/implementation/pages/pdf-page';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfPageSize } from '../../../../src/implementation/pages/pdf-page-size';
import { PdfSection } from '../../../../src/implementation/pages/pdf-section';
describe('PdfPage.ts',()=> {
    describe('Constructor initializing',()=> {
        let dictionaryProperties : DictionaryProperties = new DictionaryProperties();
        let t1 : PdfPage = new PdfPage()
        it('-t1.dictionary.Items.getValue(DictionaryProperties.DictionaryProperties.Type) == new Name.PdfName("Page"))', () => {
            expect(t1.dictionary.items.getValue(dictionaryProperties.type)).toEqual(new PdfName("Page"));
        })
        it('-t1.section == undefined', () => {
            expect(t1.section).toBeUndefined();
        })
        it('-Set section == null, get creoss table - error', () => {
            t1.section = null;
            expect(t1.section).toBeNull();
            expect(function (): void {t1.crossTable}).toThrowError();
        })
        it('-t1.Document == null', () => {
            t1.beginSave = null;
            t1.pageBeginSave();
            expect(t1.document).toBeNull();
        })
        // let t2 : PdfSection = new PdfSection();
        // t1.section = t2;
        // it('-CrossTable == undefined', () => {
        //     expect(function (): void {t1.section = null; }).toThrowError();
        // })
        // it('-t1.Size == PdfPageSize.a4', () => {
        //     expect(t1.Size).toBeNull();
        // })
        // if(t1.section != null && t1.section.Parent != null) {
        //     it('-t1.Size == t1.section.Parent.Document', () => {
        //         expect(t1.Size).toEqual(t1.section.Parent.Document);
        //     })
        // }
        // else {
        //     it('-t1.Size == null', () => {
        //         expect(t1.Size).toBeNull();
        //     })
        // }
        // if(t1.section != null)
        // {
        //     let IsTrue:boolean = false
        //     if(typeof t1.section != undefined)
        //     {
        //         if(typeof t1.section.Parent != undefined)
        //         {
        //             if(t1.CrossTable == t1.section.ParentDocument.CrossTable || t1.CrossTable == t1.section.Parent.Document.CrossTable) {
        //                 IsTrue = true;
        //             }
        //             it('-(t1.CrossTable == t1.m_section.ParentDocument.CrossTable || t1.CrossTable == t1.m_section.Parent.Document.CrossTable) == true', () => {
        //                 expect(IsTrue).toBeTruthy();
        //             })
        //         }
        //     }
        // }
    })
})