/**
 * PdfSection.ts class for EJ2-PDF
 */
import { PdfDocument } from './../document/pdf-document';
import { PdfDocumentBase } from './../document/pdf-document-base';
import { PdfPageSettings } from './pdf-page-settings';
import { PdfPage } from './pdf-page';
import { PageAddedEventArgs } from './page-added-event-arguments';
import { PdfPageBase } from './pdf-page-base';
import { PdfPageOrientation, PdfPageRotateAngle } from './enum';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfArray } from './../primitives/pdf-array';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfName } from './../primitives/pdf-name';
import { PdfDictionary } from './../primitives/pdf-dictionary';
import { SaveSectionEventHandler } from './../primitives/pdf-dictionary';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { IPdfWriter } from './../../interfaces/i-pdf-writer';
import { PdfSectionCollection } from './pdf-section-collection';
import { PdfSectionPageCollection } from './pdf-section-page-collection';
import { PointF, RectangleF, SizeF } from './../drawing/pdf-drawing';
import { PdfSectionTemplate } from './pdf-section-templates';
import { PdfPageTemplateElement } from './pdf-page-template-element';
import { PdfPageLayer } from './pdf-page-layer';
/**
 * Represents a `section` entity. A section it's a set of the pages with similar page settings.
 */
export class PdfSection implements IPdfWrapper {
    //Fields
    //public PageAdded() : PageAddedEventArgs.PageAddedEventHandler = new PageAddedEventArgs.PageAddedEventHandler(Object,args)
    /**
     * @hidden
     * @private
     */
    private pageAdded : PageAddedEventArgs = new PageAddedEventArgs();
    /**
     * the parent `document`.
     * @private
     */
    private pdfDocument : PdfDocument;
    /**
     * Page `settings` of the pages in the section.
     * @private
     */
    private settings : PdfPageSettings;
    /**
     * Internal variable to store `initial page settings`.
     * @private
     */
    public initialSettings : PdfPageSettings;
    /**
     * @hidden
     * @private
     */
    public pagesReferences : PdfArray;
    /**
     * @hidden
     * @private
     */
    private section : PdfDictionary;
    /**
     * @hidden
     * @private
     */
    private pageCount : PdfNumber;
    /**
     * @hidden
     * @private
     */
    private sectionCollection : PdfSectionCollection;
    /**
     * @hidden
     * @private
     */
    private pdfPages : PdfPageBase[] = [];
    /**
     * Indicates if the `progress is turned on`.
     * @private
     */
    private isProgressOn : boolean;
    /**
     * Page `template` for the section.
     * @private
     */
    private pageTemplate : PdfSectionTemplate;
    /**
     * @hidden
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * A virtual `collection of pages`.
     * @private
     */
    private pagesCollection : PdfSectionPageCollection;
    /**
     * Stores the information about the page settings of the current section.
     * @private
     */
    private state : PageSettingsState;
    //constructor
    /**
     * Initializes a new instance of the `PdfSection` class.
     * @private
     */
    constructor(document : PdfDocument)
    /**
     * Initializes a new instance of the `PdfSection` class.
     * @private
     */
    constructor(document : PdfDocument, pageSettings : PdfPageSettings)
    constructor(document : PdfDocument, pageSettings? : PdfPageSettings) {
        this.pdfDocument = document;
        if (typeof pageSettings === 'undefined') {
            this.settings = document.pageSettings.clone();
            this.initialSettings = this.settings.clone();
        } else {
            this.settings = pageSettings.clone();
            this.initialSettings = this.settings.clone();
        }
        this.initialize();
    }
    //Property
    /**
     * Gets or sets the `parent`.
     * @private
     */
    public get parent() : PdfSectionCollection {
        return this.sectionCollection;
    }
    public set parent(value : PdfSectionCollection) {
        this.sectionCollection = value;
        this.section.items.setValue(this.dictionaryProperties.parent, new PdfReferenceHolder(value));
    }
    /**
     * Gets the `parent document`.
     * @private
     */
    public get parentDocument() : PdfDocumentBase {
        return this.pdfDocument;
    }
    /**
     * Gets or sets the `page settings` of the section.
     * @private
     */
    public get pageSettings() : PdfPageSettings {
        return this.settings;
    }
    public set pageSettings(value : PdfPageSettings) {
        if (value != null) {
            this.settings = value;
        } else {
            throw Error('Value can not be null.');
        }
    }
    /**
     * Gets the wrapped `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.section;
    }
    /**
     * Gets the `count` of the pages in the section.
     * @private
     */
    public get count() : number {
        return this.pagesReferences.count;
    }
    /**
     * Gets or sets a `template` for the pages in the section.
     * @private
     */
    public get template() : PdfSectionTemplate {
        if (this.pageTemplate == null) {
            this.pageTemplate = new PdfSectionTemplate();
        }
        return this.pageTemplate;
    }
    public set template(value : PdfSectionTemplate) {
        this.pageTemplate = value;
    }
    /**
     * Gets the `document`.
     * @private
     */
    public get document() : PdfDocument {
        return this.sectionCollection.document;
    }
    /**
     * Gets the collection of `pages` in a section (Read only)
     * @private
     */
    public get pages() : PdfSectionPageCollection {
        if (this.pagesCollection == null || typeof this.pagesCollection === 'undefined') {
            this.pagesCollection = new PdfSectionPageCollection(this);
        }
        return this.pagesCollection;
    }
    //methods
    /**
     * `Return the page collection` of current section.
     * @private
     */
    public getPages() : PdfPageBase[] {
        return this.pdfPages;
    }
    /**
     * `Translates` point into native coordinates of the page.
     * @private
     */
    public pointToNativePdf(page : PdfPage, point : PointF) : PointF {
        let bounds : RectangleF = this.getActualBounds(page, true);
        point.x += bounds.x;
        point.y = this.pageSettings.height - (point.y);
        return point;
    }
    /**
     * Sets the page setting of the current section.
     * @public
     * @param settings Instance of `PdfPageSettings`
     */
    public setPageSettings(settings : PdfPageSettings) : void {
        this.settings = settings;
        this.state.orientation = settings.orientation;
        this.state.rotate = settings.rotate;
        this.state.size = settings.size;
        this.state.origin = settings.origin;
    }
    /**
     * `Initializes` the object.
     * @private
     */
    private initialize() : void {
        this.pagesReferences = new PdfArray();
        this.section = new PdfDictionary();
        this.state = new PageSettingsState(this.pdfDocument);
        this.section.sectionBeginSave = new SaveSectionEventHandler(this, this.state);
        this.pageCount = new PdfNumber(0);
        this.section.items.setValue(this.dictionaryProperties.count, this.pageCount);
        this.section.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.pages));
        this.section.items.setValue(this.dictionaryProperties.kids, this.pagesReferences);
    }
    /**
     * Checks whether any template should be printed on this layer.
     * @private
     * @param document The parent document.
     * @param page The parent page.
     * @param foreground Layer z-order.
     * @returns True - if some content should be printed on the layer, False otherwise.
     */
    public containsTemplates(document : PdfDocument, page : PdfPage, foreground : boolean) : boolean {
        let documentHeaders : PdfPageTemplateElement[] = this.getDocumentTemplates(document, page, foreground);
        let sectionTemplates : PdfPageTemplateElement[] = this.getSectionTemplates(page, foreground);
        return (documentHeaders.length > 0 || sectionTemplates.length > 0);
    }
    /**
     * Returns array of the document templates.
     * @private
     * @param document The parent document.
     * @param page The parent page.
     * @param headers If true - return headers/footers, if false - return simple templates.
     * @param foreground If true - return foreground templates, if false - return background templates.
     * @returns Returns array of the document templates.
     */
    /* tslint:disable */
    private getDocumentTemplates(document : PdfDocument, page : PdfPage, foreground : boolean) : PdfPageTemplateElement[] {
        let templates : PdfPageTemplateElement[] = [];
		if (this.template.applyDocumentTopTemplate && document.template.getTop(page) != null) {
            if ((!(document.template.getTop(page).foreground || foreground)) || (document.template.getTop(page).foreground && foreground)) {
                templates.push(document.template.getTop(page));
			}
		}
		if (this.template.applyDocumentBottomTemplate && document.template.getBottom(page) != null) {
			if ((!(document.template.getBottom(page).foreground || foreground)) || (document.template.getBottom(page).foreground && foreground)) {
				templates.push(document.template.getBottom(page));
			}
		}
		if (this.template.applyDocumentLeftTemplate && document.template.getLeft(page) != null) {
			if ((!(document.template.getLeft(page).foreground || foreground)) || (document.template.getLeft(page).foreground && foreground)) {
				templates.push(document.template.getLeft(page));
			}
		}
		if (this.template.applyDocumentRightTemplate && document.template.getRight(page) != null) {
			if ((!(document.template.getRight(page).foreground || foreground)) || (document.template.getRight(page).foreground && foreground)) {
				templates.push(document.template.getRight(page));
			}
		}
        return templates;
    }
	/**
     * Returns array of the section templates.
     * @private
     * @param page The parent page.
     * @param foreground If true - return foreground templates, if false - return background templates.
     * @returns Returns array of the section templates.
     */
    /* tslint:disable */
    private getSectionTemplates(page : PdfPage, foreground : boolean) : PdfPageTemplateElement[] {
        let templates : PdfPageTemplateElement[] = [];
        if (this.template.getTop(page) != null) {
            let pageTemplate : PdfPageTemplateElement = this.template.getTop(page);
            if ((!(pageTemplate.foreground || foreground)) || (pageTemplate.foreground && foreground)) {
                templates.push(pageTemplate);
			}
		}
        if (this.template.getBottom(page) != null) {
            let pageTemplate : PdfPageTemplateElement = this.template.getBottom(page);
            if ((!(pageTemplate.foreground || foreground)) || (pageTemplate.foreground && foreground)) {
                templates.push(pageTemplate);
            }
		}
        if (this.template.getLeft(page) != null) {
            let pageTemplate : PdfPageTemplateElement = this.template.getLeft(page);
            if ((!(pageTemplate.foreground || foreground)) || (pageTemplate.foreground && foreground)) {
                templates.push(pageTemplate);
            }
        }
        if (this.template.getRight(page) != null) {
            let pageTemplate : PdfPageTemplateElement = this.template.getRight(page);
            if ((!(pageTemplate.foreground || foreground)) || (pageTemplate.foreground && foreground)) {
                templates.push(pageTemplate);
            }
        }
        return templates;
	}
    /* tslint:enable */
    /**
     * `Adds` the specified page.
     * @private
     */
    public add(page? : PdfPage) : void | PdfPage {
        if (typeof page === 'undefined') {
            let page : PdfPage = new PdfPage();
            this.add(page);
            return page;
        } else {
            let r : PdfReferenceHolder = this.checkPresence(page);
            this.pdfPages.push(page);
            this.pagesReferences.add(r);
            page.setSection(this);
            page.resetProgress();
            this.pageAddedMethod(page);
        }
    }
    /**
     * `Checks the presence`.
     * @private
     */
    private checkPresence(page : PdfPage) : PdfReferenceHolder {
        let rh : PdfReferenceHolder = new PdfReferenceHolder(page);
        let contains : boolean = false;
        let sc : PdfSectionCollection = this.parent;
        for (let index : number = 0; index < sc.section.length; index++) {
            let section : PdfSection = sc.section[index];
            contains = contains || section.contains(page);
        }
        return rh;
    }
    /**
     * `Determines` whether the page in within the section.
     * @private
     */
    public contains(page : PdfPage) : boolean {
        let index : number = this.indexOf(page);
        return (0 <= index);
    }
    /**
     * Get the `index of` the page.
     * @private
     */
    public indexOf(page : PdfPage) : number {
        for (let index : number = 0; index < this.pdfPages.length; index++) {
            if (this.pdfPages[index] === page) {
                return this.pdfPages.indexOf(page);
            }
        }
        let r : PdfReferenceHolder = new PdfReferenceHolder(page);
        return this.pagesReferences.indexOf(r);
    }
    /**
     * Call two event's methods.
     * @hidden
     * @private
     */
    private pageAddedMethod(page : PdfPage) : void {
        //Create event's arguments
        let args : PageAddedEventArgs = new PageAddedEventArgs(page);
        this.onPageAdded(args);
        let parent : PdfSectionCollection = this.parent;
        parent.document.pages.onPageAdded(args);
        this.pageCount.intValue = this.count;
    }
    /**
     * Called when the page has been added.
     * @hidden
     * @private
     */
    protected onPageAdded(args : PageAddedEventArgs) : void {
        //
    }
    /**
     * Calculates actual `bounds` of the page.
     * @private
     */
    public getActualBounds(page : PdfPage, includeMargins : boolean) : RectangleF
    /**
     * Calculates actual `bounds` of the page.
     * @private
     */
    public getActualBounds(document : PdfDocument, page : PdfPage, includeMargins : boolean) : RectangleF
    public getActualBounds(arg1 : PdfDocument | PdfPage, arg2 : PdfPage|boolean, arg3 ?: boolean) : RectangleF {
        if (arg1 instanceof PdfPage && typeof arg2 === 'boolean') {
            let result : RectangleF;
            let document : PdfDocument = this.parent.document;
            result = this.getActualBounds(document, arg1, arg2);
            return result;
        } else {
            arg1 = arg1 as PdfDocument;
            arg2 = arg2 as PdfPage;
            arg3 = arg3 as boolean;
            let bounds : RectangleF = new RectangleF(0, 0, 0, 0);
            bounds.height = (arg3) ? this.pageSettings.size.height : this.pageSettings.getActualSize().height;
            bounds.width = (arg3) ? this.pageSettings.size.width : this.pageSettings.getActualSize().width;
            let left : number = this.getLeftIndentWidth(arg1, arg2, arg3);
            let top : number = this.getTopIndentHeight(arg1, arg2, arg3);
            let right : number = this.getRightIndentWidth(arg1, arg2, arg3);
            let bottom : number = this.getBottomIndentHeight(arg1, arg2, arg3);
            bounds.x += left;
            bounds.y += top;
            bounds.width -= (left + right);
            bounds.height -= (top + bottom);
            return bounds;
        }
    }
    /**
     * Calculates width of the `left indent`.
     * @private
     */
    public getLeftIndentWidth(document : PdfDocument, page : PdfPage, includeMargins : boolean) : number {
        if (document == null) {
            throw new Error('ArgumentNullException:document');
        }
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let value : number = (includeMargins) ? this.pageSettings.margins.left : 0;
        let templateWidth : number = (this.template.getLeft(page) != null) ? this.template.getLeft(page).width : 0;
        let docTemplateWidth : number = (document.template.getLeft(page) != null) ? document.template.getLeft(page).width : 0;
        value += (this.template.applyDocumentLeftTemplate) ? Math.max(templateWidth, docTemplateWidth) : templateWidth;
        return value;
    }
    /**
     * Calculates `Height` of the top indent.
     * @private
     */
    public getTopIndentHeight(document : PdfDocument, page : PdfPage, includeMargins : boolean) : number {
        if (document == null) {
            throw new Error('ArgumentNullException:document');
        }
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let value : number = (includeMargins) ? this.pageSettings.margins.top : 0;
        let templateHeight : number = (this.template.getTop(page) != null) ? this.template.getTop(page).height : 0;
        let docTemplateHeight : number = (document.template.getTop(page) != null) ? document.template.getTop(page).height : 0;
        value += (this.template.applyDocumentTopTemplate) ? Math.max(templateHeight, docTemplateHeight) : templateHeight;
        return value;
    }
    /**
     * Calculates `width` of the right indent.
     * @private
     */
    public getRightIndentWidth(document : PdfDocument, page : PdfPage, includeMargins : boolean) : number {
        if (document == null) {
            throw new Error('ArgumentNullException:document');
        }
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let value : number = (includeMargins) ? this.pageSettings.margins.right : 0;
        let templateWidth : number = (this.template.getRight(page) != null) ? this.template.getRight(page).width : 0;
        let docTemplateWidth : number = (document.template.getRight(page) != null) ? document.template.getRight(page).width : 0;
        value += (this.template.applyDocumentRightTemplate) ? Math.max(templateWidth, docTemplateWidth) : templateWidth;
        return value;
    }
    /**
     * Calculates `Height` of the bottom indent.
     * @private
     */
    public getBottomIndentHeight(document : PdfDocument, page : PdfPage, includeMargins : boolean) : number {
        if (document == null) {
            throw new Error('ArgumentNullException:document');
        }
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let value : number = (includeMargins) ? this.pageSettings.margins.bottom : 0;
        let templateHeight : number = (this.template.getBottom(page) != null) ? this.template.getBottom(page).height : 0;
        let docTemplateHeight : number = (document.template.getBottom(page) != null) ? document.template.getBottom(page).height : 0;
        value += (this.template.applyDocumentBottomTemplate) ?  Math.max(templateHeight, docTemplateHeight) : templateHeight;
        return value;
    }
    /**
     * `Removes` the page from the section.
     * @private
     */
    public remove(page : PdfPage) : void {
        if (page == null) {
            throw Error('ArgumentNullException("page")');
        }
        let index : number = this.pdfPages.indexOf(page);
        this.pagesReferences.removeAt(index);
        let temproaryPages : PdfPageBase[] = [];
        for (let j : number = 0; j < index; j++) {
            temproaryPages.push(this.pdfPages[j]);
        }
        for (let j : number = index + 1; j < this.pdfPages.length; j++) {
            temproaryPages.push(this.pdfPages[j]);
        }
        this.pdfPages = temproaryPages;
    }
    /**
     * In fills dictionary by the data from `Page settings`.
     * @private
     */
    private applyPageSettings(container : PdfDictionary, parentSettings : PdfPageSettings, state : PageSettingsState) : void {
        let bounds : RectangleF = new RectangleF(state.origin, state.size);
        container.items.setValue(this.dictionaryProperties.mediaBox, PdfArray.fromRectangle(bounds));
        let rotate : number = 0;
        rotate = PdfSectionCollection.rotateFactor * state.rotate;
        let angle : PdfNumber = new PdfNumber(rotate);
        container.items.setValue(this.dictionaryProperties.rotate, angle);
    }
    /**
     * Catches the Save event of the dictionary.
     * @hidden
     * @private
     */
    public beginSave(state : PageSettingsState, writer : IPdfWriter) : void {
        let doc : PdfDocument = writer.document as PdfDocument;
        this.applyPageSettings(this.section, doc.pageSettings, state);
    }
    /**
     * Draws page templates on the page.
     * @private
     */
    public drawTemplates(page : PdfPage, layer : PdfPageLayer, document : PdfDocument, foreground : boolean) : void {
        let documentHeaders : PdfPageTemplateElement[] = this.getDocumentTemplates(document, page, foreground);
        let sectionHeaders : PdfPageTemplateElement[] = this.getSectionTemplates(page, foreground);
        this.drawTemplatesHelper(layer, document, documentHeaders);
        this.drawTemplatesHelper(layer, document, sectionHeaders);
    }
    /**
     * Draws page templates on the page.
     * @private
     */
    private drawTemplatesHelper(layer : PdfPageLayer, document : PdfDocument, templates : PdfPageTemplateElement[]) : void {
        if (templates != null && templates.length > 0) {
            let len : number = templates.length;
            for (let i : number = 0; i < len; i++) {
                let template : PdfPageTemplateElement = templates[i];
                template.draw(layer, document);
            }
        }
    }
}
export class PageSettingsState {
    //Private Fields
    /**
     * @hidden
     * @private
     */
    private pageOrientation : PdfPageOrientation;
    /**
     * @hidden
     * @private
     */
    private pageRotate : PdfPageRotateAngle;
    /**
     * @hidden
     * @private
     */
    private pageSize : SizeF;
    /**
     * @hidden
     * @private
     */
    private pageOrigin : PointF;
    //public Properties
    /**
     * @hidden
     * @private
     */
    public get orientation() : PdfPageOrientation {
        return this.pageOrientation;
    }
    public set orientation(value : PdfPageOrientation) {
        this.pageOrientation = value;
    }
    /**
     * @hidden
     * @private
     */
    public get rotate() : PdfPageRotateAngle {
        return this.pageRotate;
    }
    public set rotate(value : PdfPageRotateAngle) {
        this.pageRotate = value;
    }
    /**
     * @hidden
     * @private
     */
    public get size() : SizeF {
        return this.pageSize;
    }
    public set size(value : SizeF) {
        this.pageSize = value;
    }
    /**
     * @hidden
     * @private
     */
    public get origin() : PointF {
        return this.pageOrigin;
    }
    public set origin(value : PointF) {
        this.pageOrigin = value;
    }
    //Public Constructor
    /**
     * New instance to store the `PageSettings`.
     * @private
     */
    public constructor(document : PdfDocument) {
        this.pageOrientation = document.pageSettings.orientation;
        this.pageRotate = document.pageSettings.rotate;
        this.pageSize = document.pageSettings.size;
        this.pageOrigin = document.pageSettings.origin;
    }
}