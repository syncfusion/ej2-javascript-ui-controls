/**
 * PdfDocumentTemplate.ts class for EJ2-PDF
 */
import { PdfPage } from './../pages/pdf-page';
import { TemplateType } from './../pages/enum';
import { PdfDocumentPageCollection } from './../pages/pdf-document-page-collection';
import { PdfPageTemplateElement } from './../pages/pdf-page-template-element';
// import { PdfStampCollection } from `./../Pages/PdfStampCollection`;
/**
 * `PdfDocumentTemplate` class encapsulates a page template for all the pages in the document.
 * @private
 */
export class PdfDocumentTemplate {
    // Fields
    /**
     * `Left` page template object.
     * @private
     */
    private leftTemplate : PdfPageTemplateElement;
    /**
     * `Top` page template object.
     * @private
     */
    private topTemplate : PdfPageTemplateElement;
    /**
     * `Right` page template object.
     * @private
     */
    private rightTemplate : PdfPageTemplateElement;
    /**
     * `Bottom` page template object.
     * @private
     */
    private bottomTemplate : PdfPageTemplateElement;
    /**
     * `EvenLeft` page template object.
     * @private
     */
    private evenLeft : PdfPageTemplateElement;
    /**
     * `EvenTop` page template object.
     * @private
     */
    private evenTop : PdfPageTemplateElement;
    /**
     * `EvenRight` page template object.
     * @private
     */
    private evenRight : PdfPageTemplateElement;
    /**
     * `EventBottom` page template object.
     * @private
     */
    private evenBottom : PdfPageTemplateElement;
    /**
     * `OddLeft` page template object.
     * @private
     */
    private oddLeft : PdfPageTemplateElement;
    /**
     * `OddTop` page template object.
     * @private
     */
    private oddTop : PdfPageTemplateElement;
    /**
     * `OddRight` page template object.
     * @private
     */
    private oddRight : PdfPageTemplateElement;
    /**
     * `OddBottom` page template object.
     * @private
     */
    private oddBottom : PdfPageTemplateElement;
    // private m_stamps : PdfStampCollection;
    // Properties
    /**
     * `Left` page template object.
     * @public
     */
    public get left() : PdfPageTemplateElement {
        return this.leftTemplate;
    }
    public set left(value : PdfPageTemplateElement) {
        this.leftTemplate = this.checkElement(value, TemplateType.Left);
    }
    /**
     * `Top` page template object.
     * @public
     */
    public get top() : PdfPageTemplateElement {
        return this.topTemplate;
    }
    public set top(value : PdfPageTemplateElement) {
        this.topTemplate = this.checkElement(value, TemplateType.Top);
    }
    /**
     * `Right` page template object.
     * @public
     */
    public get right() : PdfPageTemplateElement {
        return this.rightTemplate;
    }
    public set right(value : PdfPageTemplateElement) {
        this.rightTemplate = this.checkElement(value, TemplateType.Right);
    }
    /**
     * `Bottom` page template object.
     * @public
     */
    public get bottom() : PdfPageTemplateElement {
        return this.bottomTemplate;
    }
    public set bottom(value : PdfPageTemplateElement) {
        this.bottomTemplate = this.checkElement(value, TemplateType.Bottom);
    }
    /**
     * `EvenLeft` page template object.
     * @public
     */
    public get EvenLeft() : PdfPageTemplateElement {
        return this.evenLeft;
    }
    public set EvenLeft(value : PdfPageTemplateElement) {
        this.evenLeft = this.checkElement(value, TemplateType.Left);
    }
    /**
     * `EvenTop` page template object.
     * @public
     */
    public get EvenTop() : PdfPageTemplateElement {
        return this.evenTop;
    }
    public set EvenTop(value : PdfPageTemplateElement) {
        this.evenTop = this.checkElement(value, TemplateType.Top);
    }
    /**
     * `EvenRight` page template object.
     * @public
     */
    public get EvenRight() : PdfPageTemplateElement {
        return this.evenRight;
    }
    public set EvenRight(value : PdfPageTemplateElement) {
        this.evenRight = this.checkElement(value, TemplateType.Right);
    }
    /**
     * `EvenBottom` page template object.
     * @public
     */
    public get EvenBottom() : PdfPageTemplateElement {
        return this.evenBottom;
    }
    public set EvenBottom(value : PdfPageTemplateElement) {
        this.evenBottom = this.checkElement(value, TemplateType.Bottom);
    }
    /**
     * `OddLeft` page template object.
     * @public
     */
    public get OddLeft() : PdfPageTemplateElement {
        return this.oddLeft;
    }
    public set OddLeft(value : PdfPageTemplateElement) {
        this.oddLeft = this.checkElement(value, TemplateType.Left);
    }
    /**
     * `OddTop` page template object.
     * @public
     */
    public get OddTop() : PdfPageTemplateElement {
        return this.oddTop;
    }
    public set OddTop(value : PdfPageTemplateElement) {
        this.oddTop = this.checkElement(value, TemplateType.Top);
    }
    /**
     * `OddRight` page template object.
     * @public
     */
    public get OddRight() : PdfPageTemplateElement {
        return this.oddRight;
    }
    public set OddRight(value : PdfPageTemplateElement) {
        this.oddRight = this.checkElement(value, TemplateType.Right);
    }
    /**
     * `OddBottom` page template object.
     * @public
     */
    public get OddBottom() : PdfPageTemplateElement {
        return this.oddBottom;
    }
    public set OddBottom(value : PdfPageTemplateElement) {
        this.oddBottom = this.checkElement(value, TemplateType.Bottom);
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfDocumentTemplate` class.
     * @public
     */
    public constructor() {
        //
    }
    // Implementation
    /**
     * Returns `left` template.
     * @public
     */
    public getLeft(page : PdfPage) : PdfPageTemplateElement {
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let template : PdfPageTemplateElement = null;
        // if (page.Document.Pages != null) {
        let even : boolean = this.isEven(page);
        if (even) {
            template = (this.EvenLeft != null) ? this.EvenLeft : this.left;
        } else {
            template = (this.OddLeft != null) ? this.OddLeft : this.left;
        }
        // }
        return template;
    }
    /**
     * Returns `top` template.
     * @public
     */
    public getTop(page : PdfPage) : PdfPageTemplateElement {
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let template : PdfPageTemplateElement = null;
        // if (page.Document.Pages != null) {
        let even : boolean = this.isEven(page);
        if (even) {
            template = (this.EvenTop != null) ? this.EvenTop : this.top;
        } else {
            template = (this.OddTop != null) ? this.OddTop : this.top;
        }
        // }
        return template;
    }
    /**
     * Returns `right` template.
     * @public
     */
    public getRight(page : PdfPage) : PdfPageTemplateElement {
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let template : PdfPageTemplateElement = null;
        // if (page.Document.Pages != null) {
        let even : boolean = this.isEven(page);
        if (even) {
            template = (this.EvenRight != null) ? this.EvenRight : this.right;
        } else {
            template = (this.OddRight != null) ? this.OddRight : this.right;
        }
        // }
        return template;
    }
    /**
     * Returns `bottom` template.
     * @public
     */
    public getBottom(page : PdfPage) : PdfPageTemplateElement {
        if (page == null) {
            throw new Error('ArgumentNullException:page');
        }
        let template : PdfPageTemplateElement = null;
        // if (page.Document.Pages != null) {
        let even : boolean = this.isEven(page);
        if (even) {
            template = (this.EvenBottom != null) ? this.EvenBottom : this.bottom;
        } else {
            template = (this.OddBottom != null) ? this.OddBottom : this.bottom;
        }
        // }
        return template;
    }
    /**
     * Checks whether the page `is even`.
     * @private
     */
    private isEven(page : PdfPage) : boolean {
        let pages : PdfDocumentPageCollection = page.section.document.pages;
        let index : number = 0;
        if (pages.pageCollectionIndex.containsKey(page)) {
            index = pages.pageCollectionIndex.getValue(page) + 1;
        } else {
            index = pages.indexOf(page) + 1;
        }
        let even : boolean = ((index % 2) === 0);
        return even;
    }
    /**
     * Checks a `template element`.
     * @private
     */
    private checkElement(templateElement : PdfPageTemplateElement, type : TemplateType) : PdfPageTemplateElement {
        if (templateElement != null) {
            if ((typeof templateElement.type !== 'undefined') && (templateElement.type !== TemplateType.None)) {
                throw new Error('NotSupportedException:Can not reassign the template element. Please, create new one.');
            }
            templateElement.type = type;
        }
        return templateElement;
    }
}