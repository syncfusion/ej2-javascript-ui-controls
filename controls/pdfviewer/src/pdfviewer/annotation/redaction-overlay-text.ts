import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfViewerBase } from '../base';
import { PdfAnnotationBaseModel } from '../drawing/pdf-annotation-model';
import { PdfBoundsModel } from '../drawing/pdf-annotation-model';
import { PdfViewer } from '../pdfviewer';

/**
 * Redaction Overlay Text Module
 *
 * This module provides functionality to display overlay text on redaction annotations
 * when hovering over them, similar to how hover color changes work.
 *
 * @hidden
 */
export class RedactionOverlayText {
    private pdfViewer: PdfViewer;
    private pdfViewerBase: PdfViewerBase;

    /**
     * Constructor for RedactionOverlayText
     * @param {any} pdfViewer - The PDF viewer instance
     * @param {any} pdfViewerBase - The viewer base instance
     */
    constructor(pdfViewer: any, pdfViewerBase: PdfViewerBase) {
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }

    /**
     * Renders overlay text on a redaction annotation
     * @param {PdfAnnotationBaseModel} annotation - The redaction annotation
     * @param {any} currentAnnot - current annotation
     * @private
     * @returns {void}
     */
    public renderRedactionOverlayText(annotation: PdfAnnotationBaseModel, currentAnnot?: any): void {

        if (annotation && annotation.id !== 'diagram_helper' && annotation.overlayText !== '') {
            if (!annotation || !annotation.wrapper) {
                return;
            }
            // Use existing properties from the annotation
            const text: string = annotation.overlayText || 'REDACTED';
            const textAlign: string = annotation.textAlign || 'center';
            const isRepeat: boolean = annotation.isRepeat || false;
            const fontFamily: string = annotation.fontFamily || 'Helvetica';
            const fontSize: number = annotation.fontSize || 12;
            const fontColor: string = annotation.fontColor || '#rgba(255, 0, 0, 1)'; // Red text
            // Remove any existing overlay text
            this.removeRedactionOverlayText(annotation);
            // Get the text layer for the page
            const textLayerId: string = this.pdfViewer.element.id + '_textLayer_' + annotation.pageIndex;
            const textLayer: HTMLElement | null = document.getElementById(textLayerId);
            if (!textLayer) {
                return;
            }
            // Get the annotation bounds
            const bounds: PdfBoundsModel = annotation.bounds || { x: 0, y: 0, width: 0, height: 0 };
            const zoomFactor: any = this.pdfViewer.viewerBase.getZoomFactor();
            if (currentAnnot && currentAnnot.bounds.length) {
                const combineBounds: any = this.pdfViewer.annotation.redactionAnnotationModule.combineBounds(currentAnnot);
                for (let z: number = 0; z < combineBounds.length; z++) {
                    // Create a container for the overlay text
                    const overlayDiv: HTMLDivElement = document.createElement('div');
                    overlayDiv.id = this.pdfViewer.element.id + '_redactionOverlay_' + (z + 1) + '_' + annotation.id;
                    overlayDiv.className = 'e-pv-redaction-overlay-text';
                    // Set position and size
                    overlayDiv.style.position = 'absolute';
                    overlayDiv.style.left = (combineBounds[z as number].x || 0) + 'px';
                    overlayDiv.style.top = ((combineBounds[z as number].y || 0)) + 'px';
                    overlayDiv.style.width = (combineBounds[z as number].width || 0) + 'px';
                    overlayDiv.style.height = ((combineBounds[z as number].height || 0)) + 'px';
                    // overlayDiv.style.padding = '1px';
                    overlayDiv.style.boxSizing = 'border-box';
                    overlayDiv.style.overflow = 'hidden';
                    overlayDiv.style.pointerEvents = 'none'; // Don't capture mouse events
                    // Set text styles
                    overlayDiv.style.fontFamily = fontFamily;
                    overlayDiv.style.fontSize = (fontSize * zoomFactor) + 'px';
                    overlayDiv.style.color = fontColor;
                    overlayDiv.style.textAlign = textAlign;
                    // Add the overlay to the text layer
                    textLayer.appendChild(overlayDiv);
                    // Store this element reference for updating during resize/drag
                    (annotation as any).overlayElement = overlayDiv;
                    if (isRepeat) {
                        this.renderRepeatedTextHtml(overlayDiv, text, fontSize * zoomFactor, textAlign);
                    } else {
                        // For normal text, create a content div that handles word wrapping
                        const contentDiv: HTMLDivElement = document.createElement('div');
                        contentDiv.textContent = text;
                        contentDiv.style.setProperty('overflow-wrap', 'break-word');
                        contentDiv.style.wordBreak = 'break-word';
                        contentDiv.style.width = '100%';
                        contentDiv.style.height = '100%';
                        contentDiv.style.display = 'flex';
                        contentDiv.style.flexDirection = 'column';
                        contentDiv.style.fontWeight = '550';
                        overlayDiv.appendChild(contentDiv);
                        // Apply different wrapping behavior based on the height/width ratio
                        if ((combineBounds[z as number].height || 0) > (combineBounds[z as number].width || 0) * 1.5) {
                            // For narrow rectangles, use vertical text layout
                            this.applyVerticalTextLayout(contentDiv, text, textAlign);
                        } else {
                            // For normal rectangles, use standard text layout
                            contentDiv.style.justifyContent = 'flex-start';
                            contentDiv.style.alignItems = this.getAlignStyle(textAlign);
                            contentDiv.textContent = text;
                        }
                    }
                }
            } else {
                // Create a container for the overlay text
                const overlayDiv: HTMLDivElement = document.createElement('div');
                overlayDiv.id = this.pdfViewer.element.id + '_redactionOverlay_' + annotation.id;
                overlayDiv.className = 'e-pv-redaction-overlay-text';
                // Set position and size
                overlayDiv.style.position = 'absolute';
                overlayDiv.style.left = ((bounds.x || 0) * zoomFactor) + 'px';
                overlayDiv.style.top = ((bounds.y || 0) * zoomFactor) + 'px';
                overlayDiv.style.width = ((bounds.width || 0) * zoomFactor) + 'px';
                overlayDiv.style.height = ((bounds.height || 0) * zoomFactor) + 'px';
                // overlayDiv.style.padding = '5px';
                overlayDiv.style.boxSizing = 'border-box';
                overlayDiv.style.overflow = 'hidden';
                overlayDiv.style.pointerEvents = 'none'; // Don't capture mouse events
                // Set text styles
                overlayDiv.style.fontFamily = fontFamily;
                overlayDiv.style.fontSize = (fontSize * zoomFactor) + 'px';
                overlayDiv.style.color = fontColor;
                overlayDiv.style.textAlign = textAlign;
                // Add the overlay to the text layer
                textLayer.appendChild(overlayDiv);
                // Store this element reference for updating during resize/drag
                (annotation as any).overlayElement = overlayDiv;
                if (isRepeat) {
                    this.renderRepeatedTextHtml(overlayDiv, text, fontSize * zoomFactor, textAlign);
                } else {
                    // For normal text, create a content div that handles word wrapping
                    const contentDiv: HTMLDivElement = document.createElement('div');
                    contentDiv.textContent = text;
                    contentDiv.style.setProperty('overflow-wrap', 'break-word');
                    contentDiv.style.wordBreak = 'break-word';
                    contentDiv.style.width = '100%';
                    contentDiv.style.height = '100%';
                    contentDiv.style.display = 'flex';
                    contentDiv.style.flexDirection = 'column';
                    contentDiv.style.fontWeight = '550';
                    overlayDiv.appendChild(contentDiv);
                    // Apply different wrapping behavior based on the height/width ratio
                    if ((bounds.height || 0) > (bounds.width || 0) * 1.5) {
                        // For narrow rectangles, use vertical text layout
                        this.applyVerticalTextLayout(contentDiv, text, textAlign);
                    } else {
                        // For normal rectangles, use standard text layout
                        contentDiv.style.justifyContent = 'flex-start';
                        contentDiv.style.alignItems = this.getAlignStyle(textAlign);
                        contentDiv.textContent = text;
                    }
                }
            }
        }
    }

    private setAttributeHtml(element: HTMLElement, attributes: any): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] !== 'style') {
                element.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(element, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }

    private applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: any[] = keys[parseInt(i.toString(), 10)].split(':');
            if (attribute.length === 2) {
                svg.style[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }

    /**
     * Removes overlay text from a redaction annotation
     * @param {any} annotation - The redaction annotation
     * @private
     * @returns {void} - void
     */
    public removeRedactionOverlayText(annotation: any): void {
        if (!annotation) {
            return;
        }

        if (annotation.annotationAddMode === 'TextRedaction' || annotation.annotType === 'TextRedaction') {
            for (let z: number = 0; z < 5000; z++) {
                const overlayId: string = this.pdfViewer.element.id + '_redactionOverlay_' + (z + 1) + '_' + annotation.id;
                const overlayElement: HTMLElement | null = document.getElementById(overlayId);

                if (overlayElement && overlayElement.parentNode) {
                    overlayElement.parentNode.removeChild(overlayElement);
                } else {
                    break;
                }
            }
        } else {
            const overlayId: string = this.pdfViewer.element.id + '_redactionOverlay_' + annotation.id;
            const overlayElement: HTMLElement | null = document.getElementById(overlayId);

            if (overlayElement && overlayElement.parentNode) {
                overlayElement.parentNode.removeChild(overlayElement);
            }
        }
    }

    /**
     * Gets the CSS align style based on text alignment
     * @param {string} textAlign - The text alignment (left, right, center)
     * @returns {string} The CSS align style
     */
    private getAlignStyle(textAlign: string): string {
        switch (textAlign.toLowerCase()) {
        case 'left': return 'flex-start';
        case 'right': return 'flex-end';
        case 'center': return 'center';
        default: return 'flex-start';
        }
    }

    /**
     * Applies vertical text layout for narrow redaction annotations
     * @param {HTMLElement} container - The container element
     * @param {string} text - The text to display
     * @param {string} textAlign - The text alignment
     * @returns {void}
     */
    private applyVerticalTextLayout(container: HTMLElement, text: string, textAlign: string): void {
        // Clear any existing content
        container.innerHTML = '';

        // Set alignment
        container.style.alignItems = this.getAlignStyle(textAlign);
        container.style.fontWeight = '550';

        // Break text into characters if needed for very narrow columns
        const containerWidth: number = container.parentElement ? parseFloat(container.parentElement.style.width) : 0;
        const words: string[] = text.split(' ');

        if (containerWidth < 30) {
            // For extremely narrow containers, stack letters vertically
            for (let i: number = 0; i < text.length; i++) {
                const charSpan: HTMLDivElement = document.createElement('div');
                charSpan.textContent = text[i as number];
                charSpan.style.textAlign = textAlign;
                container.appendChild(charSpan);
            }
        } else {
            // For somewhat narrow containers, use word wrapping
            container.textContent = text;
            container.style.wordBreak = 'break-all';
        }
    }

    /**
     * Renders repeated text in a redaction annotation
     * @param {HTMLElement} container - The container element
     * @param {string} text - The text to repeat
     * @param {number} fontSize - The font size
     * @param {string} textAlign - The text alignment
     * @returns {void} - void
     */
    private renderRepeatedTextHtml(container: HTMLElement, text: string, fontSize: number, textAlign: string): void {
        // Clear existing content
        container.innerHTML = '';

        // Create a wrapper for the repeated text
        const wrapperDiv: HTMLDivElement = document.createElement('div');
        wrapperDiv.style.display = 'flex';
        wrapperDiv.style.flexDirection = 'column';
        wrapperDiv.style.width = '100%';
        wrapperDiv.style.height = '100%';
        wrapperDiv.style.justifyContent = 'space-between';
        // wrapperDiv.style.fontWeight = '550';

        // Calculate approximate number of lines that can fit
        const lineHeight: number = fontSize;
        const containerHeight: number = parseFloat(container.style.height);
        const containerWidth: number = parseFloat(container.style.width);

        // Determine if annotation is narrow (vertical) or wide (horizontal)
        const isVertical: boolean = containerHeight > containerWidth * 1.5;

        // Calculate the number of lines and words per line
        const availableHeight: number = containerHeight - 10; // account for padding
        const lines: number = Math.max(1, Math.floor(availableHeight / lineHeight));
        const availableWidth: number = containerWidth - 10; // account for padding

        // Create a temporary element to measure text width
        const measureElement: HTMLSpanElement = document.createElement('span');
        measureElement.style.visibility = 'hidden';
        measureElement.style.position = 'absolute';
        measureElement.style.whiteSpace = 'nowrap';
        measureElement.style.fontFamily = container.style.fontFamily;
        measureElement.style.fontSize = fontSize + 'px';
        // measureElement.style.fontWeight = '550';
        measureElement.textContent = text; // Include space after word
        document.body.appendChild(measureElement);

        // Get the actual width of the text
        const textWidth: number = measureElement.getBoundingClientRect().width;
        document.body.removeChild(measureElement);

        // Calculate how many repetitions fit in the available width
        let repetitionsPerLine: number = Math.floor(availableWidth / textWidth);
        if (repetitionsPerLine === 0) {
            repetitionsPerLine = 1;
        }
        // For vertical layouts, adjust text display
        if (isVertical) {
            // Create a full container with wrapped text
            const verticalDiv: HTMLDivElement = document.createElement('div');
            verticalDiv.style.width = '100%';
            verticalDiv.style.height = '100%';
            verticalDiv.style.display = 'flex';
            verticalDiv.style.flexDirection = 'column';
            verticalDiv.style.justifyContent = 'flex-start';
            verticalDiv.style.textAlign = textAlign;

            // Add text content that will be wrapped
            let verticalText: string = '';
            for (let i: number = 0; i < lines * 2; i++) {
                verticalText += text + ' ';
            }
            verticalDiv.textContent = verticalText;

            wrapperDiv.appendChild(verticalDiv);
        } else {
            // For each line, create a div
            for (let i: number = 0; i < lines; i++) {
                const lineDiv: HTMLDivElement = document.createElement('div');
                const requiredAttributes: Record<string, string> = {
                    style: `width:100%; text-align:${textAlign}; white-space:nowrap; line-height:${lineHeight}px; overflow:hidden;`
                };
                this.setAttributeHtml(lineDiv, requiredAttributes);

                // Calculate total width of repeated text
                const totalTextWidth: number = repetitionsPerLine * textWidth;
                // Calculate remaining space in the container
                //const remainingSpace: number = availableWidth - totalTextWidth;

                // Repeat text to fill the line based on alignment
                let lineText: string = '';

                // Add appropriate spacing based on alignment
                if (textAlign.toLowerCase() === 'right') {
                    // For right alignment, add space at the beginning
                    //lineDiv.style.paddingLeft = remainingSpace + 'px';
                } else if (textAlign.toLowerCase() === 'center') {
                    // For center alignment, add half the space at the beginning
                    //lineDiv.style.paddingLeft = (remainingSpace / 2) + 'px';
                }

                // Add the repeated text
                for (let j: number = 0; j < repetitionsPerLine; j++) {
                    lineText += text;
                }

                // Trim the last space
                if (lineText.length > 0) {
                    lineText = lineText.substring(0, lineText.length - 1);
                }

                lineDiv.textContent = lineText;
                wrapperDiv.appendChild(lineDiv);
            }
        }

        container.appendChild(wrapperDiv);
    }

    /**
     * Updates the redaction annotation after editing (resize/drag)
     * @param {PdfAnnotationBaseModel} annotation - The redaction annotation
     * @private
     * @returns {void} -void
     */
    public updateRedactionAfterEdit(annotation: PdfAnnotationBaseModel): void {
        if (annotation && annotation.shapeAnnotationType === 'Redaction') {
            // Remove any existing overlay
            this.removeRedactionOverlayText(annotation);

            // Re-render the overlay with updated position
            this.renderRedactionOverlayText(annotation);

            // Update the rendering
            if (this.pdfViewer) {
                this.pdfViewer.renderDrawing(null, annotation.pageIndex);
            }
        }
    }
}
