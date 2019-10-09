/**
 * spec document for PdfSection.ts class
 */
import { PdfSection, PageSettingsState } from '../../../../src/implementation/pages/pdf-section';
import { PdfDocument } from '../../../../src/implementation/document/pdf-document';
import { PdfPageBase } from '../../../../src/implementation/pages/pdf-page-base';
import { PdfDictionary } from '../../../../src/implementation/primitives/pdf-dictionary';
import { DictionaryProperties } from '../../../../src/implementation/input-output/pdf-dictionary-properties';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfNumber } from '../../../../src/implementation/primitives/pdf-number';
import { PdfSectionTemplate, PdfPage, PdfSectionPageCollection, PdfPageRotateAngle, PointF, SizeF, PdfFontFamily } from "../../../../src/index";
import { PdfPageSize, PdfPageSettings, PdfWriter, PdfPageOrientation, RectangleF, PdfPageTemplateElement } from "../../../../src/index";
import { PdfFont, PdfStandardFont, PdfSolidBrush, PdfColor } from "../../../../src/index";
describe('PdfSection.ts',()=>{
    describe('Constructor initializing',()=>{
        
        // //Create a new PDF document.
        // let document2 : PdfDocument = new PdfDocument();
        // //Add a page.
        // let page1 : PdfPage = document2.pages.add();
        // //Create a header and draw the image.
        // let bounds2 : RectangleF = new RectangleF({ x : 0, y : 0}, {width : document2.pages.getPageByIndex(0).getClientSize().width, height : 100});
        // let header2 : PdfPageTemplateElement = new PdfPageTemplateElement(bounds2);
        // //Add the header at the top.
        // document2.template.left = header2;
        // document2.template.right = header2;
        // page1.section.containsTemplates(document2, page1, true);
        // page1.section.containsTemplates(document2, page1, false);
        // it('-page1.section.drawTemplates(page1, page1.layers.add(), document2, true)- throw Error', () => {
        //     expect(function (): void {page1.section.drawTemplates(page1, page1.layers.add(), document2, true);}).toThrowError();
        // })
        // it('-page1.section.drawTemplates(page1, page1.layers.add(), document2, false)- throw Error', () => {
        //     expect(function (): void {page1.section.drawTemplates(page1, page1.layers.add(), document2, false);}).toThrowError();
        // })

        let dictionaryProperties : DictionaryProperties = new DictionaryProperties();
        let t2 : PdfDocument = new PdfDocument();
        let t1 : PdfSection = new PdfSection(t2);
        it('-t1.element.Items.getValue(DictionaryProperties.DictionaryProperties.Count) == new Number.PdfNumber(0)', () => {
            expect((t1.element as PdfDictionary).items.getValue(dictionaryProperties.count)).toEqual(new PdfNumber(0));
        })
        it('-t1.element.Items.getValue(DictionaryProperties.DictionaryProperties.Count) == new Name.PdfName(DictionaryProperties.DictionaryProperties.Pages)', () => {
            expect((t1.element as PdfDictionary).items.getValue(dictionaryProperties.type)).toEqual(new PdfName(dictionaryProperties.pages));
        })
        it('-t1.element.Items.getValue(DictionaryProperties.DictionaryProperties.Count) == new Number.PdfNumber(0)', () => {
            expect((t1.element as PdfDictionary).items.getValue(dictionaryProperties.kids)).toEqual(t1.pagesReferences);
        })
        it('-Parent == undefined', () => {
            expect(t1.parent).toBeUndefined();
        })
        it('-ParentDocument != undefined', () => {
            expect(t1.parentDocument).not.toBeUndefined();
        })
        // it('-set PdfPageSettings == null trrow error', () => {
        //     expect(function (): void {t1.pageSettings == null;}).toThrowError();
        // })
        it('-PageSettings == undefined', () => {
            expect(t1.pageSettings).not.toBeUndefined();
        })
        it('-element != undefined', () => {
            expect(t1.element).not.toBeUndefined();
        })
        it('-m_pages != undefined', () => {
            expect(t1.getPages()).toEqual(new Array<PdfPageBase>());
        })
        // it('-m_pagesReferences != undefined', () => {
        //     expect(t1.m_pagesReferences).toEqual(new Array<PdfPageBase>());
        // })
        // it('-PdfSection.constructor(document,document.PageSettings)', () => {
        //     expect(t3.constructor(t2 ,t2.PageSettings)).toHaveBeenCalled();
        // })
        let t4 : PdfSection = new PdfSection(t2 ,t2.pageSettings);
        // it('-PdfSection.constructor()', () => {
        //     expect(t4.constructor()).toHaveBeenCalled();
        // })
        it('-ParentDocument == document', () => {
            expect(t4.parentDocument).toEqual(t2);
        })
        it('-PageSettings == document.PageSettings.Clone()', () => {
            expect(t1.pageSettings).not.toBeUndefined();
            // expect(t1.PageSettings).toEqual(t2.PageSettings.Clone());
        })
        it('-Set Template', () => {
            t1.template = new PdfSectionTemplate();
            expect(t1.template).not.toBeUndefined();
        })
        it('-Set Template == null & get Template != Undefined', () => {
            t1.template = null;
            expect(t1.template).not.toBeUndefined();
        })
        let page : PdfPage;
        // t4.GetActualBounds(page, true);
        it('-this.GetLeftIndentWidth(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getLeftIndentWidth( null, page, true); }).toThrowError();
        })
        it('-this.GetLeftIndentWidth(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getLeftIndentWidth( t2, null, true); }).toThrowError();
        })
        it('-this.GetTopIndentHeight(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getTopIndentHeight( null, page, true); }).toThrowError();
        })
        it('-this.GetTopIndentHeight(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getTopIndentHeight( t2, null, true); }).toThrowError();
        })
        it('-this.GetRightIndentWidth(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getRightIndentWidth( null, page, true); }).toThrowError();
        })
        it('-this.GetRightIndentWidth(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getRightIndentWidth( t2, null, true); }).toThrowError();
        })
        it('-this.GetBottomIndentHeight(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getBottomIndentHeight( null, page, true); }).toThrowError();
        })
        it('-this.GetBottomIndentHeight(PdfDocument, PdfPage, includeMargins)', () => {
            expect(function (): void {t1.getBottomIndentHeight( t2, null, true); }).toThrowError();
        })
        it('-set PdfPageSettings', () => {
            let pageSettings : PdfPageSettings = new PdfPageSettings();
            pageSettings.orientation = PdfPageOrientation.Landscape;
            t1.pageSettings = pageSettings;
            expect(t1.pageSettings).not.toBeUndefined();
            expect(function (): void {t1.pageSettings = null;}).toThrowError();
        })
        let document : PdfDocument = new PdfDocument();
        let section : PdfSection = new PdfSection(document);
        it('-section.Pages != undefined', () => {
            section.pages;
            expect(section.pages).not.toBeUndefined();
        })
        it('-section.Pages.Remove(null) throw Error', () => {
            expect(function (): void {section.remove(null);}).toThrowError();
        })
        // it('-section.Pages.Remove(page) not throw Error', () => {
        //     let page : PdfPage = section.Add() as PdfPage;
        //     expect(function (): void {section.Remove(page);}).toThrowError();
        // })

        let t5 : PdfDocument = new PdfDocument();
        t5.pageSettings.size = PdfPageSize.a3;
        t5.pageSettings.orientation = PdfPageOrientation.Landscape;
        t5.pageSettings.rotate = PdfPageRotateAngle.RotateAngle180;
        let page6 : PdfPage = t5.pages.add();
        t5.pageSettings.size = PdfPageSize.a4;
        t5.pageSettings.orientation = PdfPageOrientation.Landscape;
        t5.pageSettings.rotate = PdfPageRotateAngle.RotateAngle180;
        let page7 : PdfPage = t5.pages.add();
        t5.pageSettings.size = PdfPageSize.a5;
        t5.pageSettings.orientation = PdfPageOrientation.Portrait;
        t5.pageSettings.rotate = PdfPageRotateAngle.RotateAngle180;
        let page8 : PdfPage = t5.pages.add();

        let state : PageSettingsState = new PageSettingsState(document);
        it('-state.Orientation != undefined', () => {
            expect(state.orientation).not.toBeUndefined();
        })

        let t6 : PdfDocument = new PdfDocument();
        let t7 : PdfSection = t6.sections.add() as PdfSection;
        let testPage : PdfPage = t7.pages.add();
        let bounds1 : RectangleF = new RectangleF(0, 0, 500, 100);
        let bounds2 : RectangleF = new RectangleF(0, 0, 500, 100);
        let bounds3 : RectangleF = new RectangleF(0, 0, 500, 100);
        let bounds4 : RectangleF = new RectangleF(0, 0, 500, 100);
        let top : PdfPageTemplateElement = new PdfPageTemplateElement(bounds1);
        t6.template.top = top;
        t6.template.top.foreground = true;
        let left : PdfPageTemplateElement = new PdfPageTemplateElement(bounds2);
        t6.template.left = left;
        t6.template.left.foreground = true;
        let right : PdfPageTemplateElement = new PdfPageTemplateElement(bounds3);
        t6.template.right = right;
        t6.template.right.foreground = true;
        let bottom : PdfPageTemplateElement = new PdfPageTemplateElement(bounds4);
        t6.template.bottom = bottom;
        t6.template.bottom.foreground = true;
        it('template.top.foreground == true', () => {
            expect(t6.template.top.foreground).toBeTruthy();
        })
        t6.save();

        let t8 : PdfDocument = new PdfDocument();
        let t9 : PdfSection = t8.sections.add() as PdfSection;
        let testPage1 : PdfPage = t9.pages.add();
        let top1 : PdfPageTemplateElement = new PdfPageTemplateElement(bounds1);
        t8.template.top = top1;
        t8.template.top.foreground = false;
        let left1 : PdfPageTemplateElement = new PdfPageTemplateElement(bounds2);
        t8.template.left = left1;
        t8.template.left.foreground = false;
        let right1 : PdfPageTemplateElement = new PdfPageTemplateElement(bounds3);
        t8.template.right = right1;
        t8.template.right.foreground = false;
        let bottom1 : PdfPageTemplateElement = new PdfPageTemplateElement(bounds4);
        t8.template.bottom = bottom1;
        t8.template.bottom.foreground = false;
        it('template.top.foreground == true', () => {
            expect(t8.template.top.foreground).toBeFalsy();
        })
        t8.save();
        // it('-t7.containsTemplates(t6, testPage, true); throw Error', () => {
        //     expect(function (): void {t7.containsTemplates(t6, testPage, true);}).not.toThrowError();
        // })
        // it('-t7.containsTemplates(t6, testPage, false); throw Error', () => {
        //     expect(function (): void {t7.containsTemplates(t6, testPage, false);}).not.toThrowError();
        // })

        let sampleDocument : PdfDocument = new PdfDocument();
        let font : PdfFont = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
        let brush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        
        let section1 : PdfSection = sampleDocument.sections.add() as PdfSection;
        let settings1 : PdfPageSettings = new PdfPageSettings(40);
        settings1.size = PdfPageSize.a3;
        settings1.orientation = PdfPageOrientation.Portrait;
        settings1.rotate = PdfPageRotateAngle.RotateAngle90;
        section1.setPageSettings(settings1);

        let page1 : PdfPage = section1.pages.add();
        page1.graphics.drawString('Hello World', font, null, brush, 10, 20, null);
        let page2 : PdfPage = section1.pages.add();
        page2.graphics.drawString('Hello World', font, null, brush, 10, 20, null);
        
        let section2 : PdfSection = sampleDocument.sections.add() as PdfSection;
        let settings2 : PdfPageSettings = new PdfPageSettings(30);
        settings2.size = new SizeF(500, 750);
        settings2.orientation = PdfPageOrientation.Landscape;
        settings2.rotate = PdfPageRotateAngle.RotateAngle270;
        section2.setPageSettings(settings2);

        let page3 : PdfPage = section2.pages.add();
        page3.graphics.drawString('Hello World', font, null, brush, 10, 20, null);
    })
})