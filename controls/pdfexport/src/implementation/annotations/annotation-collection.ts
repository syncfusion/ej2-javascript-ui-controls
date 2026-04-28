import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { PdfPage } from './../pages/pdf-page';
import { PdfArray } from './../primitives/pdf-array';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfAnnotation } from './../annotations/annotation';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
import { SizeF, RectangleF, PointF } from './../drawing/pdf-drawing';
import { PdfStringLayouter, PdfStringLayoutResult } from './../graphics/fonts/string-layouter';
import { PdfDocumentLinkAnnotation } from './document-link-annotation';
import { PdfColorSpace } from './../graphics/enum';
/**
 * `PdfAnnotationCollection` class represents the collection of 'PdfAnnotation' objects.
 * @private
 */
export class PdfAnnotationCollection implements IPdfWrapper {
    // Constants
    /**
     * `Error` constant message.
     * @private
     */
    private alreadyExistsAnnotationError : string = 'This annotatation had been already added to page';
    /**
     * `Error` constant message.
     * @private
     */
    private missingAnnotationException : string = 'Annotation is not contained in collection.';
    /**
     * Specifies the Internal variable to store fields of `PdfDictionaryProperties`.
     * @private
     */
    protected dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Parent `page` of the collection.
     * @private
     */
    private page : PdfPage;
    /**
     * Array of the `annotations`.
     * @private
     */
    private internalAnnotations : PdfArray = new PdfArray();
    /**
     * privte `list` for the annotations.
     * @private
     */
    public lists : PdfAnnotation[] = [];
    /**
     * Gets the `PdfAnnotation` object at the specified index. Read-Only.
     * @private
     */
    public get annotations() : PdfArray {
        return this.internalAnnotations;
    }
    public set annotations(value : PdfArray) {
        this.internalAnnotations = value;
    }
    // Constructors
    /**
     * Initializes a new instance of the `PdfAnnotationCollection` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfAnnotationCollection` class with the specified page.
     * @private
     */
    public constructor(page : PdfPage)
    public constructor(page ?: PdfPage) {
        if (typeof page !== 'undefined') {
            this.page = page;
        }
    }
    // Public methods
    /**
     * `Adds` a new annotation to the collection. 
     * @private
     */
    public add(annotation : PdfAnnotation) : void | number {
        // this.SetPrint(annotation);
        this.doAdd(annotation);
    }
    /**
     * `Adds` a Annotation to collection.
     * @private
     */
    /* tslint:disable */
    protected doAdd(annotation : PdfAnnotation) : void | number {
        if (typeof (annotation as PdfDocumentLinkAnnotation).destination !== 'undefined') {
            let layout : PdfStringLayouter = new PdfStringLayouter();
            let layoutResult : PdfStringLayoutResult = layout.layout(annotation.text, annotation.font, annotation.stringFormat, new SizeF((annotation.bounds.width), 0), false, new SizeF(0, 0));
            let lastPosition : number = annotation.bounds.y;
            if (layoutResult.lines.length === 1) {
                let size : SizeF = annotation.font.measureString(layoutResult.lines[0].text);
                annotation.bounds = new RectangleF(new PointF(annotation.bounds.x, lastPosition), size);
                annotation.text = layoutResult.lines[0].text;
                //Draw Annotation Text.
                this.page.graphics.drawString(annotation.text, annotation.font, null, annotation.brush, annotation.bounds.x, annotation.bounds.y, annotation.bounds.width, annotation.bounds.height, null);
                //Add annotation to dictionary.
                annotation.setPage(this.page);
                this.setColor(annotation);
                this.internalAnnotations.add(new PdfReferenceHolder(annotation));
                this.lists.push(annotation);
            } else {
                for (let i : number = 0; i < layoutResult.lines.length; i++) {
                    let size : SizeF = annotation.font.measureString(layoutResult.lines[i].text);
                    if (i === 0) {
                        annotation.bounds = new RectangleF(annotation.bounds.x, lastPosition, size.width, size.height);
                        annotation.text = layoutResult.lines[i].text;
                        //Draw Annotation Text.
                        this.page.graphics.drawString(annotation.text, annotation.font, null, annotation.brush, annotation.bounds.x, lastPosition, size.width, size.height, null);
                        //Add annotation to dictionary.
                        annotation.setPage(this.page);
                        this.setColor(annotation);
                        this.internalAnnotations.add(new PdfReferenceHolder(annotation));
                        this.lists.push(annotation);
                        //Update y for drawing next line of the text.
                        lastPosition += annotation.bounds.height;
                    } else {
                        let annot : PdfDocumentLinkAnnotation = (annotation as PdfDocumentLinkAnnotation).clone();
                        annot.bounds = new RectangleF(new PointF(annotation.bounds.x, lastPosition), size);
                        annot.text = layoutResult.lines[i].text;
                        //Draw Annotation Text.
                        this.page.graphics.drawString(annot.text, annot.font, null, annot.brush, annot.bounds.x, annot.bounds.y, annot.bounds.width, annot.bounds.height, null);
                        //Add annotation to dictionary.
                        annot.setPage(this.page);
                        this.setColor(annot);
                        this.internalAnnotations.add(new PdfReferenceHolder(annot));
                        this.lists.push(annot);
                        //Update y for drawing next line of the text.
                        lastPosition += annot.bounds.height;
                    }
                }
            }
        } else {
            annotation.setPage(this.page);
            this.internalAnnotations.add(new PdfReferenceHolder(annotation));
            return this.lists.push(annotation);
        }
    }
    /* tslint:enable */
    /**
     * `Set a color of an annotation`.
     * @private
     */
    private setColor(annotation : PdfAnnotation) : void {
        let cs : PdfColorSpace = PdfColorSpace.Rgb;
        let colours : PdfArray = annotation.color.toArray(cs);
        annotation.dictionary.items.setValue(this.dictionaryProperties.c, colours);
    }
    // IPdfWrapper Members
    /**
     * Gets the `Element` representing this object.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.internalAnnotations;
    }
}