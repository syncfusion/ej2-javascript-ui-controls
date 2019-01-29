import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer } from '../index';
import { Dictionary } from '../../base/dictionary';
import { DocumentEditor } from '../../document-editor';
import { ImageFormat } from '../selection/selection-helper';
import { IWidget, ImageElementBox, LineWidget, Page, ParagraphWidget, TableCellWidget, TableRowWidget } from '../viewer/page';
import { Point, ImagePointInfo, HelperMethods } from './editor-helper';
import { BaseHistoryInfo } from '../editor-history/base-history-info';

/** 
 * Image resizer implementation.
 */
export class ImageResizer {
    /**
     * @private
     */
    public owner: DocumentEditor;
    private currentImageElementBoxIn: ImageElementBox;
    /**
     * @private
     */
    public resizeContainerDiv: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topLeftRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topMiddleRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topRightRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomLeftRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomMiddleRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomRightRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public leftMiddleRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public rightMiddleRect: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topLeftRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topMiddleRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public topRightRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomLeftRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomMiddleRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public bottomRightRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public leftMiddleRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public rightMiddleRectParent: HTMLDivElement = undefined;
    /**
     * @private
     */
    public resizeMarkSizeIn: number = 7;
    /**
     * @private
     */
    public selectedImageWidget: Dictionary<IWidget, SelectedImageInfo> = undefined;
    /**
     * @private
     */
    public baseHistoryInfo: BaseHistoryInfo = undefined;
    private imageResizerDiv: HTMLDivElement;
    /**
     * @private
     */
    public isImageResizing: boolean = false;
    /**
     * @private
     */
    public isImageResizerVisible: boolean = false;
    private viewer: LayoutViewer;
    /**
     * @private
     */
    public currentPage: Page;
    /**
     * @private
     */
    public isImageMoveToNextPage: boolean = false;
    /**
     * @private
     */
    public imageResizerDivElement: HTMLDivElement;
    /**
     * @private
     */
    public imageResizerPoints: ImageResizingPoints;
    /**
     * @private
     */
    public selectedResizeElement: HTMLElement = undefined;
    /**
     * @private
     */
    public topValue: number = undefined;
    /**
     * @private
     */
    public leftValue: number = undefined;
    /**
     * Gets or Sets the current image element box.
     * @private
     */
    get currentImageElementBox(): ImageElementBox {
        return this.currentImageElementBoxIn;
    }
    /**
     * @private
     */
    set currentImageElementBox(value: ImageElementBox) {
        this.currentImageElementBoxIn = value;
    }
    /**
     * Gets or Sets the resize mark size.
     * @private
     */
    get resizeMarkSize(): number {
        return this.resizeMarkSizeIn;
    }
    /**
     * @private
     */
    set resizeMarkSize(value: number) {
        this.resizeMarkSizeIn = value;
    }
    /**
     * Constructor for image resizer module.
     * @param {DocumentEditor} node 
     * @param {LayoutViewer} viewer
     * @private
     */
    constructor(node: DocumentEditor, viewer: LayoutViewer) {
        this.owner = node;
        this.selectedImageWidget = new Dictionary<IWidget, SelectedImageInfo>();
        this.viewer = viewer;
        this.imageResizerPoints = new ImageResizingPoints();
        if (isNullOrUndefined(this.imageResizerDiv) && this.viewer && this.viewer.pageContainer) {
            this.initializeImageResizer();
        }
    }
    /**
     * Gets module name.
     */
    private getModuleName(): string {
        return 'ImageResizer';
    }
    //Image Resizing Methods
    /**
     * Sets image resizer position.
     * @param {number} x - Specifies for image resizer left value.
     * @param {number} y - Specifies for image resizer top value.
     * @param {number} width - Specifies for image resizer width value.
     * @param {number} height - Specifies for image resizer height value.
     * @private
     */
    public setImageResizerPositions(x: number, y: number, width: number, height: number): void {
        this.imageResizerDivElement.style.top = y.toString() + 'px';
        this.imageResizerDivElement.style.left = x.toString() + 'px';
        this.imageResizerDivElement.style.borderWidth = '0px';
        this.imageResizerDivElement.style.height = height + 'px';
        this.imageResizerDivElement.style.width = width + 'px';
        this.imageResizerDivElement.style.backgroundColor = 'transparent';
        this.imageResizerDivElement.style.overflow = 'hidden';
        this.imageResizerDivElement.style.position = 'absolute';
    }
    /**
     * Creates image resizer DOM element.
     * @private
     */
    public initializeImageResizer(): void {
        this.imageResizerDivElement = document.createElement('div');
        this.imageResizerDivElement.style.zIndex = '1';
        this.imageResizerDivElement.style.display = 'none';
        this.viewer.pageContainer.appendChild(this.imageResizerDivElement);
    }
    /**
     * Position an image resizer
     * @param {ImageElementBox} elementBox - Specifies the image position.
     * @private
     */
    public positionImageResizer(elementBox: ImageElementBox): void {
        this.selectedImageWidget.clear();
        // Initializes the image resizer on demand, i.e at the time of selecting an image for the first time.
        let resizeDiv: HTMLElement;
        if (!isNullOrUndefined(this.viewer.currentPage)) {
            resizeDiv = this.imageResizerDivElement;
        }
        if (!isNullOrUndefined(resizeDiv) && !resizeDiv.contains(this.imageResizerDiv)) {
            this.imageResizerDiv = this.initResizeMarks(resizeDiv, this);
        }
        this.imageResizerDiv.style.width = (elementBox.width) + 'px';
        this.imageResizerDiv.style.height = (elementBox.height) + 'px';
        this.currentImageElementBox = elementBox;
        let lineWidget: LineWidget = elementBox.line;
        let top: number = this.viewer.selection.getTop(lineWidget) + elementBox.margin.top;
        let left: number = this.viewer.selection.getLeftInternal(lineWidget, elementBox, 0);
        let page: Page = this.viewer.selection.getPage(lineWidget.paragraph);
        this.currentPage = page;
        let x: number = 0;
        let y: number = 0;
        if (!isNullOrUndefined(resizeDiv)) {
            this.imageResizerDivElement.style.display = 'block';
            resizeDiv.style.width = page.boundingRectangle.width + 'px';
            resizeDiv.style.height = page.boundingRectangle.height + 'px';
            resizeDiv.style.left = page.boundingRectangle.x + 'px';
            resizeDiv.style.top = page.boundingRectangle.y + 'px';
            resizeDiv.style.borderWidth = '0px';
            resizeDiv.style.backgroundColor = 'transparent';
            resizeDiv.style.overflow = 'hidden';
            resizeDiv.style.position = 'absolute';
        }
        let horizontalWidth: number = 0;
        let pageWidth: number = this.viewer.getPageWidth(page);
        let pagelayout: PageLayoutViewer = this.viewer as PageLayoutViewer;
        // tslint:disable-next-line:max-line-length
        horizontalWidth = parseFloat(this.imageResizerDivElement.style.width);
        x = (this.viewer.visibleBounds.width - horizontalWidth * this.viewer.zoomFactor) / 2;
        if (x < 30) {
            x = 30;
        }
        if (pageWidth < horizontalWidth) {
            x += (horizontalWidth - pageWidth) * this.viewer.zoomFactor / 2;
        }
        // tslint:disable-next-line:max-line-length           
        y = page.boundingRectangle.y * this.viewer.zoomFactor + (this.viewer.pages.indexOf(page) + 1) * 20 * (1 - this.viewer.zoomFactor);
        let currentPageDiv: HTMLElement = this.imageResizerDivElement;
        let currentPageDivWidth: number = parseFloat(currentPageDiv.style.width);
        let currentPageDivHeight: number = parseFloat(currentPageDiv.style.height);
        let imageResizerDivWidth: number = parseFloat(this.imageResizerDiv.style.width);
        let imageResizerDivHeight: number = parseFloat(this.imageResizerDiv.style.height);
        let margin: number = (this.resizeMarkSize - 1) / 2;
        let width: number = imageResizerDivWidth + 2 * margin;
        let height: number = imageResizerDivHeight + 2 * margin;
        if (width > (currentPageDivWidth - left) * this.viewer.zoomFactor + margin) {
            width = (currentPageDivWidth - left) * this.viewer.zoomFactor;
        }
        if (height > (currentPageDivHeight - top) * this.viewer.zoomFactor + margin) {
            height = (currentPageDivHeight - top) * this.viewer.zoomFactor;
        }
        // if (width < imageResizerDivHeight + margin || height < imageResizerDivHeight + margin) {

        // }
        // tslint:disable-next-line:max-line-length
        this.imageResizerDivElement.style.width = parseInt(this.imageResizerDivElement.style.width.replace('px', ''), 10) * this.viewer.zoomFactor + 'px';
        this.imageResizerDivElement.style.height = parseInt(this.imageResizerDivElement.style.height.replace('px', ''), 10) * this.viewer.zoomFactor + 'px';
        height = this.viewer.render.getScaledValue(elementBox.height);
        width = this.viewer.render.getScaledValue(elementBox.width);
        left = this.viewer.render.getScaledValue(left);
        top = this.viewer.render.getScaledValue(top);
        this.setImageResizerPosition(left, top, width, height, this);
        if (!this.selectedImageWidget.containsKey(lineWidget)) {
            let selectedImageInfo: SelectedImageInfo = new SelectedImageInfo(elementBox.height, elementBox.width);
            this.selectedImageWidget.add(lineWidget, selectedImageInfo);
        }
    }
    /**
     * Shows the image resizer.
     * @private
     */
    public showImageResizer(): void {
        if (!isNullOrUndefined(this.imageResizerDivElement)) {
            this.imageResizerDivElement.style.display = '';
        }
        if (!isNullOrUndefined(this.resizeContainerDiv)) {
            this.resizeContainerDiv.style.display = '';
        }
        if (!isNullOrUndefined(this.bottomLeftRect)) {
            this.bottomLeftRect.style.display = '';
            this.bottomLeftRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.bottomRightRect)) {
            this.bottomRightRect.style.display = '';
            this.bottomRightRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.bottomMiddleRect)) {
            this.bottomMiddleRect.style.display = '';
            this.bottomMiddleRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.rightMiddleRect)) {
            this.rightMiddleRect.style.display = '';
            this.rightMiddleRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.topRightRect)) {
            this.topRightRect.style.display = '';
            this.topRightRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.topLeftRect)) {
            this.topLeftRect.style.display = '';
            this.topLeftRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.leftMiddleRect)) {
            this.leftMiddleRect.style.display = '';
            this.leftMiddleRectParent.style.display = '';
        }
        if (!isNullOrUndefined(this.topMiddleRect)) {
            this.topMiddleRect.style.display = '';
            this.topMiddleRectParent.style.display = '';
        }
        this.isImageResizerVisible = true;
    }
    /**
     * Hides the image resizer.
     * @private
     */
    public hideImageResizer(): void {
        if (!isNullOrUndefined(this.imageResizerDivElement)) {
            this.imageResizerDivElement.style.display = 'none';
        }
        if (!isNullOrUndefined(this.resizeContainerDiv)) {
            this.resizeContainerDiv.style.display = 'none';
        }
        if (!isNullOrUndefined(this.bottomLeftRect)) {
            this.bottomLeftRect.style.display = 'none';
            this.bottomLeftRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.bottomRightRect)) {
            this.bottomRightRect.style.display = 'none';
            this.bottomRightRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.bottomMiddleRect)) {
            this.bottomMiddleRect.style.display = 'none';
            this.bottomMiddleRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.rightMiddleRect)) {
            this.rightMiddleRect.style.display = 'none';
            this.rightMiddleRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.topRightRect)) {
            this.topRightRect.style.display = 'none';
            this.topRightRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.topLeftRect)) {
            this.topLeftRect.style.display = 'none';
            this.topLeftRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.leftMiddleRect)) {
            this.leftMiddleRect.style.display = 'none';
            this.leftMiddleRectParent.style.display = 'none';
        }
        if (!isNullOrUndefined(this.topMiddleRect)) {
            this.topMiddleRect.style.display = 'none';
            this.topMiddleRectParent.style.display = 'none';
        }
        this.isImageResizerVisible = false;
        this.currentPage = undefined;
    }
    /**
     * Initialize the resize marks.
     * @param {HTMLElement} resizeDiv - Specifies to appending resizer container div element.
     * @param {ImageResizer} imageResizer - Specifies to creating div element of each position.
     * @private
     */
    // tslint:disable:max-func-body-length
    public initResizeMarks(resizeDiv: HTMLElement, imageResizer: ImageResizer): HTMLDivElement {
        this.initResizeContainerDiv(imageResizer);
        resizeDiv.appendChild(imageResizer.resizeContainerDiv);

        imageResizer.topRightRectParent = document.createElement('div');
        imageResizer.topRightRectParent.style.cursor = 'ne-resize';
        imageResizer.topRightRectParent.id = this.viewer.owner.containerId + '_TopRightRectParent';
        this.applyProperties(imageResizer.topRightRectParent);
        imageResizer.topRightRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topRightRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topRightRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.topRightRectParent);

        imageResizer.topRightRect = document.createElement('div');
        imageResizer.topRightRect.id = this.viewer.owner.containerId + '_TopRightRect';
        imageResizer.topRightRect.style.cursor = 'ne-resize';
        this.applyProperties(imageResizer.topRightRect);
        resizeDiv.appendChild(imageResizer.topRightRect);

        imageResizer.topLeftRectParent = document.createElement('div');
        imageResizer.topLeftRectParent.style.cursor = 'nw-resize';
        imageResizer.topLeftRectParent.id = this.viewer.owner.containerId + '_TopLeftRectParent';
        this.applyProperties(imageResizer.topLeftRectParent);
        imageResizer.topLeftRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topLeftRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topLeftRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.topLeftRectParent);

        imageResizer.topLeftRect = document.createElement('div');
        imageResizer.topLeftRect.id = this.viewer.owner.containerId + '_TopLeftRect';
        imageResizer.topLeftRect.style.cursor = 'nw-resize';
        this.applyProperties(imageResizer.topLeftRect);
        resizeDiv.appendChild(imageResizer.topLeftRect);

        imageResizer.topMiddleRectParent = document.createElement('div');
        imageResizer.topMiddleRectParent.style.cursor = 'n-resize';
        imageResizer.topMiddleRectParent.id = this.viewer.owner.containerId + '_TopMiddleRectParent';
        this.applyProperties(imageResizer.topMiddleRectParent);
        imageResizer.topMiddleRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topMiddleRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.topMiddleRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.topMiddleRectParent);

        imageResizer.topMiddleRect = document.createElement('div');
        imageResizer.topMiddleRect.id = this.viewer.owner.containerId + '_TopMiddleRect';
        imageResizer.topMiddleRect.style.cursor = 'n-resize';
        this.applyProperties(imageResizer.topMiddleRect);
        resizeDiv.appendChild(imageResizer.topMiddleRect);

        imageResizer.bottomRightRectParent = document.createElement('div');
        imageResizer.bottomRightRectParent.style.cursor = 'se-resize';
        imageResizer.bottomRightRectParent.id = this.viewer.owner.containerId + '_BottomRightRectParent';
        this.applyProperties(imageResizer.bottomRightRectParent);
        imageResizer.bottomRightRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomRightRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomRightRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.bottomRightRectParent);

        imageResizer.bottomRightRect = document.createElement('div');
        imageResizer.bottomRightRect.id = this.viewer.owner.containerId + '_BottomRightRect';
        imageResizer.bottomRightRect.style.cursor = 'se-resize';
        this.applyProperties(imageResizer.bottomRightRect);
        resizeDiv.appendChild(imageResizer.bottomRightRect);

        imageResizer.bottomLeftRectParent = document.createElement('div');
        imageResizer.bottomLeftRectParent.style.cursor = 'sw-resize';
        imageResizer.bottomLeftRectParent.id = this.viewer.owner.containerId + '_BottomLeftRectParent';
        this.applyProperties(imageResizer.bottomLeftRectParent);
        imageResizer.bottomLeftRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomLeftRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomLeftRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.bottomLeftRectParent);

        imageResizer.bottomLeftRect = document.createElement('div');
        imageResizer.bottomLeftRect.id = this.viewer.owner.containerId + '_BottomLeftRect';
        imageResizer.bottomLeftRect.style.cursor = 'sw-resize';
        this.applyProperties(imageResizer.bottomLeftRect);
        resizeDiv.appendChild(imageResizer.bottomLeftRect);

        imageResizer.bottomMiddleRectParent = document.createElement('div');
        imageResizer.bottomMiddleRectParent.style.cursor = 's-resize';
        imageResizer.bottomMiddleRectParent.id = this.viewer.owner.containerId + '_BottomMiddleRectParent';
        this.applyProperties(imageResizer.bottomMiddleRectParent);
        imageResizer.bottomMiddleRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomMiddleRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.bottomMiddleRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.bottomMiddleRectParent);

        imageResizer.bottomMiddleRect = document.createElement('div');
        imageResizer.bottomMiddleRect.id = this.viewer.owner.containerId + '_BottomMiddleRect';
        imageResizer.bottomMiddleRect.style.cursor = 's-resize';
        this.applyProperties(imageResizer.bottomMiddleRect);
        resizeDiv.appendChild(imageResizer.bottomMiddleRect);

        imageResizer.rightMiddleRectParent = document.createElement('div');
        imageResizer.rightMiddleRectParent.style.cursor = 'e-resize';
        imageResizer.rightMiddleRectParent.id = this.viewer.owner.containerId + '_RightMiddleRectParent';
        this.applyProperties(imageResizer.rightMiddleRectParent);
        imageResizer.rightMiddleRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.rightMiddleRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.rightMiddleRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.rightMiddleRectParent);

        imageResizer.rightMiddleRect = document.createElement('div');
        imageResizer.rightMiddleRect.id = this.viewer.owner.containerId + '_RightMiddleRect';
        imageResizer.rightMiddleRect.style.cursor = 'e-resize';
        this.applyProperties(imageResizer.rightMiddleRect);
        resizeDiv.appendChild(imageResizer.rightMiddleRect);

        imageResizer.leftMiddleRectParent = document.createElement('div');
        imageResizer.leftMiddleRectParent.style.cursor = 'w-resize';
        imageResizer.leftMiddleRectParent.id = this.viewer.owner.containerId + '_LeftMiddleRectParent';
        this.applyProperties(imageResizer.leftMiddleRectParent);
        imageResizer.leftMiddleRectParent.style.width = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.leftMiddleRectParent.style.height = !this.viewer.isTouchInput ? '14px' : '30px';
        imageResizer.leftMiddleRectParent.style.opacity = '-1';
        resizeDiv.appendChild(imageResizer.leftMiddleRectParent);

        imageResizer.leftMiddleRect = document.createElement('div');
        imageResizer.leftMiddleRect.id = this.viewer.owner.containerId + '_LeftMiddleRect';
        imageResizer.leftMiddleRect.style.cursor = 'w-resize';
        this.applyProperties(imageResizer.leftMiddleRect);
        resizeDiv.appendChild(imageResizer.leftMiddleRect);
        return imageResizer.resizeContainerDiv;
    }
    /**
     * Sets the image resizer position.
     * @param {number} left - Specifies for image resizer left value.
     * @param {number} top - Specifies for image resizer top value.
     * @param {number} width - Specifies for image resizer width value.
     * @param {number} height - Specifies for image resizer height value.
     * @param {ImageResizer} imageResizer - Specifies for image resizer.
     * @private
     */
    public setImageResizerPosition(left: number, top: number, width: number, height: number, imageResizer: ImageResizer): void {
        //Positions Updating For Image Resize Div
        imageResizer.resizeContainerDiv.style.width = width + 'px';
        imageResizer.resizeContainerDiv.style.height = height + 'px';
        imageResizer.resizeContainerDiv.style.left = left - 1 + 'px';
        imageResizer.resizeContainerDiv.style.top = top + 'px';
        //Positions Updating For Image Resizing Points
        imageResizer.topRightRect.style.left = ((left + width) - 5) + 'px';
        imageResizer.topRightRect.style.top = (top - 4) + 'px';
        imageResizer.topLeftRect.style.left = (left - 5) + 'px';
        imageResizer.topLeftRect.style.top = (top - 4) + 'px';
        imageResizer.topMiddleRect.style.left = ((parseFloat(imageResizer.topLeftRect.style.left) + (width / 2)) - 4) + 'px';
        imageResizer.topMiddleRect.style.top = (top - 4) + 'px';
        imageResizer.bottomRightRect.style.left = imageResizer.topRightRect.style.left;
        imageResizer.bottomRightRect.style.top = (parseFloat(imageResizer.topRightRect.style.top) + height) + 'px';
        imageResizer.bottomLeftRect.style.left = imageResizer.topLeftRect.style.left;
        imageResizer.bottomLeftRect.style.top = (parseFloat(imageResizer.topLeftRect.style.top) + height) + 'px';
        imageResizer.bottomMiddleRect.style.left = imageResizer.topMiddleRect.style.left;
        imageResizer.bottomMiddleRect.style.top = (parseFloat(imageResizer.topMiddleRect.style.top) + height) + 'px';
        imageResizer.rightMiddleRect.style.left = ((left + width) - 4) + 'px';
        imageResizer.rightMiddleRect.style.top = (parseFloat(imageResizer.topRightRect.style.top) + (height / 2)) + 'px';
        imageResizer.leftMiddleRect.style.left = imageResizer.topLeftRect.style.left;
        imageResizer.leftMiddleRect.style.top = (parseFloat(imageResizer.topLeftRect.style.top) + (height / 2)) + 'px';
        imageResizer.topRightRectParent.style.left = !this.viewer.isTouchInput ? ((left + width) - 8) + 'px' : ((left + width) - 15) + 'px';
        imageResizer.topRightRectParent.style.top = !this.viewer.isTouchInput ? (top - 7) + 'px' : (top - 15) + 'px';
        imageResizer.topLeftRectParent.style.left = !this.viewer.isTouchInput ? (left - 8) + 'px' : (left - 15) + 'px';
        imageResizer.topLeftRectParent.style.top = !this.viewer.isTouchInput ? (top - 7) + 'px' : (top - 15) + 'px';
        imageResizer.topMiddleRectParent.style.left = ((parseFloat(imageResizer.topLeftRectParent.style.left) + (width / 2)) - 4) + 'px';
        imageResizer.topMiddleRectParent.style.top = !this.viewer.isTouchInput ? (top - 7) + 'px' : (top - 15) + 'px';
        imageResizer.bottomRightRectParent.style.left = imageResizer.topRightRectParent.style.left;
        imageResizer.bottomRightRectParent.style.top = (parseFloat(imageResizer.topRightRectParent.style.top) + height) + 'px';
        imageResizer.bottomLeftRectParent.style.left = imageResizer.topLeftRectParent.style.left;
        imageResizer.bottomLeftRectParent.style.top = (parseFloat(imageResizer.topLeftRectParent.style.top) + height) + 'px';
        imageResizer.bottomMiddleRectParent.style.left = imageResizer.topMiddleRectParent.style.left;
        imageResizer.bottomMiddleRectParent.style.top = (parseFloat(imageResizer.topMiddleRectParent.style.top) + height) + 'px';
        // tslint:disable-next-line:max-line-length 
        imageResizer.rightMiddleRectParent.style.left = !this.viewer.isTouchInput ? ((left + width) - 7) + 'px' : ((left + width) - 15) + 'px';
        imageResizer.rightMiddleRectParent.style.top = (parseFloat(imageResizer.topRightRectParent.style.top) + (height / 2)) + 'px';
        imageResizer.leftMiddleRectParent.style.left = imageResizer.topLeftRectParent.style.left;
        imageResizer.leftMiddleRectParent.style.top = (parseFloat(imageResizer.topLeftRectParent.style.top) + (height / 2)) + 'px';
        this.setImageResizingPoints(imageResizer);
        if (this.viewer.isTouchInput) {
            this.applyPropertiesForTouch();
        } else {
            this.applyPropertiesForMouse();
        }
    }
    /**
     * Sets the image resizing points.
     * @param {ImageResizer} imageResizer - Specifies for position of each resizing elements.
     * @private
     */
    public setImageResizingPoints(imageResizer: ImageResizer): void {
        this.imageResizerPoints.resizeContainerDiv.x = parseFloat(imageResizer.resizeContainerDiv.style.left);
        this.imageResizerPoints.resizeContainerDiv.y = parseFloat(imageResizer.resizeContainerDiv.style.top);
        this.imageResizerPoints.bottomLeftRectParent.x = parseFloat(imageResizer.bottomLeftRectParent.style.left);
        this.imageResizerPoints.bottomLeftRectParent.y = parseFloat(imageResizer.bottomLeftRectParent.style.top);
        this.imageResizerPoints.bottomRightRectParent.x = parseFloat(imageResizer.bottomRightRectParent.style.left);
        this.imageResizerPoints.bottomRightRectParent.y = parseFloat(imageResizer.bottomRightRectParent.style.top);
        this.imageResizerPoints.bottomMiddleRectParent.x = parseFloat(imageResizer.bottomMiddleRectParent.style.left);
        this.imageResizerPoints.bottomMiddleRectParent.y = parseFloat(imageResizer.bottomMiddleRectParent.style.top);
        this.imageResizerPoints.topLeftRectParent.x = parseFloat(imageResizer.topLeftRectParent.style.left);
        this.imageResizerPoints.topLeftRectParent.y = parseFloat(imageResizer.topLeftRectParent.style.top);
        this.imageResizerPoints.topRightRectParent.x = parseFloat(imageResizer.topRightRectParent.style.left);
        this.imageResizerPoints.topRightRectParent.y = parseFloat(imageResizer.topRightRectParent.style.top);
        this.imageResizerPoints.topMiddleRectParent.x = parseFloat(imageResizer.topMiddleRectParent.style.left);
        this.imageResizerPoints.topMiddleRectParent.y = parseFloat(imageResizer.topMiddleRectParent.style.top);
        this.imageResizerPoints.leftMiddleRectParent.x = parseFloat(imageResizer.leftMiddleRectParent.style.left);
        this.imageResizerPoints.leftMiddleRectParent.y = parseFloat(imageResizer.leftMiddleRectParent.style.top);
        this.imageResizerPoints.rightMiddleRectParent.x = parseFloat(imageResizer.rightMiddleRectParent.style.left);
        this.imageResizerPoints.rightMiddleRectParent.y = parseFloat(imageResizer.rightMiddleRectParent.style.top);
    }
    /**
     * Initialize the resize container div element.
     * @param {ImageResizer} imageResizer - Specifies for creating resize container div element.
     * @private
     */
    public initResizeContainerDiv(imageResizer: ImageResizer): void {
        imageResizer.resizeContainerDiv = document.createElement('div');
        imageResizer.resizeContainerDiv.id = this.viewer.owner.containerId + '_ResizeDivElement';
        imageResizer.resizeContainerDiv.style.position = 'absolute';
        imageResizer.resizeContainerDiv.style.border = '1px solid #bfbfbf';
        imageResizer.resizeContainerDiv.style.zIndex = '30';
        imageResizer.resizeContainerDiv.style.backgroundColor = 'transparent';
        imageResizer.resizeContainerDiv.style.display = 'block';
    }
    /**
     * Apply the properties of each resize rectangle element.
     * @param {HTMLDivElement} resizeRectElement - Specifies for applying properties to resize rectangle element.
     * @private
     */
    public applyProperties(resizeRectElement: HTMLDivElement): void {
        resizeRectElement.style.position = 'absolute';
        resizeRectElement.style.width = '8px';
        resizeRectElement.style.height = '8px';
        resizeRectElement.style.fontSize = '0px';
        resizeRectElement.style.zIndex = ' 551';
        resizeRectElement.style.backgroundColor = '#ffffff';
        resizeRectElement.style.border = '1px solid #bfbfbf';
        resizeRectElement.style.boxShadow = '0 1px 2px 0 #bfbfbf 0.35';
        resizeRectElement.style.color = '#000000';
    }
    /**
     * Handles an image resizing.
     * @param {number} x  - Specifies for left value while resizing.
     * @param {number} y - Specifies for top value while resizing.
     */
    private handleImageResizing(touchPoint: Point, prevX: number, prevY: number): void {
        prevX = prevX / this.viewer.zoomFactor;
        prevY = prevY / this.viewer.zoomFactor;
        this.leftValue = isNullOrUndefined(this.leftValue) ? prevX : this.leftValue;
        this.topValue = isNullOrUndefined(this.topValue) ? prevY : this.topValue;
        let points: LeftTopInfo;
        switch (this.selectedResizeElement.id.split('_')[1]) {
            case 'TopRightRectParent':
                points = this.topRightResizing(touchPoint);
                prevX = points.left;
                prevY = points.top;
                break;
            case 'TopLeftRectParent':
                points = this.topLeftResizing(touchPoint);
                prevX = -points.left;
                prevY = -points.top;
                break;
            case 'TopMiddleRectParent':
                prevX = 0;
                prevY = this.topMiddleResizing(touchPoint);
                break;
            case 'BottomRightRectParent':
                points = this.bottomRightResizing(touchPoint);
                prevX = points.left;
                prevY = points.top;
                break;
            case 'BottomLeftRectParent':
                points = this.bottomLeftResizing(touchPoint);
                prevX = -points.left;
                prevY = -points.top;
                break;
            case 'BottomMiddleRectParent':
                prevY = touchPoint.y - prevY;
                prevX = 0;
                break;
            case 'RightMiddleRectParent':
                prevX = touchPoint.x - prevX;
                prevY = 0;
                break;
            case 'LeftMiddleRectParent':
                prevX = this.leftMiddleResizing(touchPoint);
                prevY = 0;
                break;
            default:
                break;
        }
        if (prevX !== 0 || prevY !== 0) {
            let widget: ParagraphWidget = this.currentImageElementBox.line.paragraph;
            let image: ImageElementBox = this.currentImageElementBox as ImageElementBox;
            if (!isNullOrUndefined(widget) && (widget as ParagraphWidget).isInsideTable) {
                let cellWidget: TableCellWidget = widget.containerWidget as TableCellWidget;
                if (!isNullOrUndefined(cellWidget)) {
                    let rowWidget: TableRowWidget = cellWidget.containerWidget as TableRowWidget;
                    let imageHeight: number = HelperMethods.convertPointToPixel(image.height);
                    let widgetHeight: number = rowWidget.height - imageHeight;
                    if (prevY > 0 && rowWidget.y + widgetHeight + imageHeight + prevY > this.viewer.clientArea.bottom) {
                        this.isImageMoveToNextPage = true;
                    }
                }
            }
            // tslint:disable-next-line:max-line-length 
            if (this.owner.enableHistoryMode) {
                this.initHistoryForImageResizer(this.currentImageElementBox);
            }
            if (!isNullOrUndefined(this.currentImageElementBox)) {
                // tslint:disable-next-line:max-line-length   
                let width: number = this.currentImageElementBox.width + prevX > 10 ? this.currentImageElementBox.width + prevX : 10;
                // tslint:disable-next-line:max-line-length 
                let height: number = this.currentImageElementBox.height + prevY > 10 ? this.currentImageElementBox.height + prevY : 10;
                if (this.selectedResizeElement.id.split('_')[1] === 'BottomRightRectParent'
                    || this.selectedResizeElement.id.split('_')[1] === 'TopRightRectParent'
                    || this.selectedResizeElement.id.split('_')[1] === 'BottomLeftRectParent'
                    || this.selectedResizeElement.id.split('_')[1] === 'TopLeftRectParent') {
                    height = this.currentImageElementBox.height / this.currentImageElementBox.width * width;
                    width = this.currentImageElementBox.width / this.currentImageElementBox.height * height;
                }
                this.currentImageElementBox.width = width;
                this.currentImageElementBox.height = height;
                let owner: ParagraphWidget = this.currentImageElementBox.line.paragraph as ParagraphWidget;
                this.positionImageResizer(this.currentImageElementBox);
            }
            this.isImageResizing = true;
        }
    }
    /**
     * Handles image resizing on mouse.
     * @param {MouseEvent} event - Specifies for image resizing using mouse event.
     * @private
     */
    public handleImageResizingOnMouse(event: MouseEvent): void {
        if (!isNullOrUndefined(this.selectedResizeElement)) {
            let prevX: number = parseFloat(this.selectedResizeElement.style.left);
            let prevY: number = parseFloat(this.selectedResizeElement.style.top);
            let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            let touchPoint: Point = this.viewer.findFocusedPage(cursorPoint, true);
            this.handleImageResizing(touchPoint, prevX, prevY);
        }
    }
    private topMiddleResizing(touchPoint: Point): number {
        let prevY: number;
        if (this.topValue >= touchPoint.y) {
            prevY = this.topValue / touchPoint.y;
            this.topValue = touchPoint.y;
            if (this.viewer instanceof PageLayoutViewer) {
                if (this.topValue <= this.viewer.pageGap) {
                    prevY = 1;
                }
            }
        } else {
            prevY = -(touchPoint.y / this.topValue);
            this.topValue = touchPoint.y;
            if (this.topValue === 0) {
                prevY = -1;
            }
        }
        return prevY;
    }
    private leftMiddleResizing(touchPoint: Point): number {
        let prevX: number;
        if (this.leftValue >= touchPoint.x) {
            prevX = this.leftValue / touchPoint.x;
            this.leftValue = touchPoint.x;
            if (this.leftValue === 0) {
                prevX = 1;
                this.leftValue = parseFloat(this.selectedResizeElement.style.left);
            }
        } else {
            prevX = -(touchPoint.x / this.leftValue);
            this.leftValue = touchPoint.x;
        }
        return prevX;
    }
    private topRightResizing(touchPoint: Point): LeftTopInfo {
        let points: LeftTopInfo;
        if (this.leftValue <= touchPoint.x && this.topValue >= touchPoint.y) {
            points = this.getOuterResizingPoint(touchPoint);
        } else {
            points = this.getInnerResizingPoint(touchPoint);
        }
        return points;
    }
    private topLeftResizing(touchPoint: Point): LeftTopInfo {
        let points: LeftTopInfo;
        if (this.leftValue >= touchPoint.x && this.topValue >= touchPoint.y) {
            points = this.getOuterResizingPoint(touchPoint);
        } else {
            points = this.getInnerResizingPoint(touchPoint);
        }
        return points;
    }
    private bottomRightResizing(touchPoint: Point): LeftTopInfo {
        let points: LeftTopInfo;
        if (this.leftValue <= touchPoint.x && this.topValue <= touchPoint.y) {
            points = this.getOuterResizingPoint(touchPoint);
        } else {
            points = this.getInnerResizingPoint(touchPoint);
        }
        return points;
    }
    private bottomLeftResizing(touchPoint: Point): LeftTopInfo {
        let points: LeftTopInfo;
        if (this.leftValue >= touchPoint.x && this.topValue <= touchPoint.y) {
            points = this.getOuterResizingPoint(touchPoint);
        } else {
            points = this.getInnerResizingPoint(touchPoint);
        }
        return points;
    }
    private getOuterResizingPoint(touchPoint: Point): LeftTopInfo {
        let prevX: number; let prevY: number;
        prevX = touchPoint.x - this.leftValue;
        this.leftValue = touchPoint.x;
        prevY = touchPoint.y - this.topValue;
        this.topValue = touchPoint.y;
        return { left: prevX, top: prevY };
    }
    private getInnerResizingPoint(touchPoint: Point): LeftTopInfo {
        let prevX: number; let prevY: number;
        prevX = -(this.leftValue - touchPoint.x);
        this.leftValue = touchPoint.x;
        prevY = -(this.topValue - touchPoint.y);
        this.topValue = touchPoint.y;
        return { left: prevX, top: prevY };
    }
    /**
     * Handles image resizing on touch.
     * @param {TouchEvent} touchEvent - Specifies for image resizing using touch event.
     * @private
     */
    public handleImageResizingOnTouch(touchEvent: TouchEvent): void {
        if (!isNullOrUndefined(this.selectedResizeElement)) {
            let prevX: number = parseFloat(this.selectedResizeElement.style.left) + 24;
            let prevY: number = parseFloat(this.selectedResizeElement.style.top) + 24;
            let touch: TouchList = touchEvent.touches;
            let cursorPoint: Point = new Point(touch[0].clientX, touch[0].clientY);
            let touchPoint: Point = this.viewer.findFocusedPage(cursorPoint, true);
            if (isNullOrUndefined(this.currentImageElementBox) || isNullOrUndefined(this.currentImageElementBox)) {
                return;
            }
            this.handleImageResizing(touchPoint, prevX, prevY);
        }
    }
    /**
     * Gets the image point of mouse.
     * @param {Point} touchPoint - Specifies for resizer cursor position.
     * @private
     */
    public getImagePoint(touchPoint: Point): ImagePointInfo {
        let x: number = this.viewer.render.getScaledValue(touchPoint.x, 1);
        let y: number = this.viewer.render.getScaledValue(touchPoint.y, 2);
        touchPoint = new Point(x, y);
        let imageResizingPoints: ImageResizingPoints = this.imageResizerPoints;
        let resizePosition: string = '';
        let selectedElement: HTMLElement = undefined;
        let bottomMiddle: Point = imageResizingPoints.bottomMiddleRectParent;
        let bottomRight: Point = imageResizingPoints.bottomRightRectParent;
        let bottomLeft: Point = imageResizingPoints.bottomLeftRectParent;
        let topMiddle: Point = imageResizingPoints.topMiddleRectParent;
        let topRight: Point = imageResizingPoints.topRightRectParent;
        let topLeft: Point = imageResizingPoints.topLeftRectParent;
        let rightMiddle: Point = imageResizingPoints.rightMiddleRectParent;
        let leftMiddle: Point = imageResizingPoints.leftMiddleRectParent;
        if (!isNullOrUndefined(this.bottomMiddleRectParent) && this.bottomMiddleRectParent.style.display !== 'none') {
            // tslint:disable-next-line:max-line-length   
            if ((touchPoint.x > bottomMiddle.x && touchPoint.x <= bottomMiddle.x + 15) && (touchPoint.y > bottomMiddle.y && touchPoint.y <= bottomMiddle.y + 15)) {
                selectedElement = this.bottomMiddleRectParent;
                resizePosition = 's-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > bottomRight.x && touchPoint.x <= bottomRight.x + 15) && (touchPoint.y > bottomRight.y && touchPoint.y <= bottomRight.y + 15)) {
                selectedElement = this.bottomRightRectParent;
                resizePosition = 'se-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > bottomLeft.x && touchPoint.x <= bottomLeft.x + 15) && (touchPoint.y > bottomLeft.y && touchPoint.y <= bottomLeft.y + 15)) {
                selectedElement = this.bottomLeftRectParent;
                resizePosition = 'sw-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > topMiddle.x && touchPoint.x <= topMiddle.x + 15) && (touchPoint.y > topMiddle.y && touchPoint.y <= topMiddle.y + 15)) {
                selectedElement = this.topMiddleRectParent;
                resizePosition = 'n-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > topRight.x && touchPoint.x <= topRight.x + 15) && (touchPoint.y > topRight.y && touchPoint.y <= topRight.y + 15)) {
                selectedElement = this.topRightRectParent;
                resizePosition = 'ne-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > topLeft.x && touchPoint.x <= topLeft.x + 15) && (touchPoint.y > topLeft.y && touchPoint.y <= topLeft.y + 15)) {
                selectedElement = this.topLeftRectParent;
                resizePosition = 'nw-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > leftMiddle.x && touchPoint.x <= leftMiddle.x + 15) && (touchPoint.y > leftMiddle.y && touchPoint.y <= leftMiddle.y + 15)) {
                selectedElement = this.leftMiddleRectParent;
                resizePosition = 'w-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoint.x > rightMiddle.x && touchPoint.x <= rightMiddle.x + 15) && (touchPoint.y > rightMiddle.y && touchPoint.y <= rightMiddle.y + 15)) {
                selectedElement = this.rightMiddleRectParent;
                resizePosition = 'e-resize';
                // tslint:disable-next-line:max-line-length   
            } else if (!isNullOrUndefined(this.resizeContainerDiv) && (touchPoint.x > parseFloat(this.resizeContainerDiv.style.left)
                && touchPoint.x <= (parseFloat(this.resizeContainerDiv.style.left) + parseFloat(this.resizeContainerDiv.style.width)))
                && (touchPoint.y > parseFloat(this.resizeContainerDiv.style.top)
                    // tslint:disable-next-line:max-line-length 
                    && touchPoint.y <= (parseFloat(this.resizeContainerDiv.style.top) + parseFloat(this.resizeContainerDiv.style.height)))) {
                resizePosition = 'move';
            }
        }
        return { 'selectedElement': selectedElement, 'resizePosition': resizePosition };
    }
    private applyPropertiesForMouse(): void {
        if (!isNullOrUndefined(this.bottomLeftRectParent)) {
            this.bottomMiddleRectParent.style.width = '14px';
            this.bottomMiddleRectParent.style.height = '14px';
            this.bottomRightRectParent.style.width = '14px';
            this.bottomRightRectParent.style.height = '14px';
            this.bottomLeftRectParent.style.width = '14px';
            this.bottomLeftRectParent.style.height = '14px';
            this.topMiddleRectParent.style.width = '14px';
            this.topMiddleRectParent.style.height = '14px';
            this.topRightRectParent.style.width = '14px';
            this.topRightRectParent.style.height = '14px';
            this.topLeftRectParent.style.width = '14px';
            this.topLeftRectParent.style.height = '14px';
            this.leftMiddleRectParent.style.width = '14px';
            this.leftMiddleRectParent.style.height = '14px';
            this.rightMiddleRectParent.style.width = '14px';
            this.rightMiddleRectParent.style.height = '14px';
        }
    }

    /**
     * Gets the image point of touch.
     * @param {Point} touchPoints - Specifies for resizer cursor position.
     * @private
     */
    public getImagePointOnTouch(touchPoints: Point): ImagePointInfo {
        let x: number = this.viewer.render.getScaledValue(touchPoints.x, 1);
        let y: number = this.viewer.render.getScaledValue(touchPoints.y, 2);
        touchPoints = new Point(x, y);
        let imageResizingPointsOnTouch: ImageResizingPoints = this.imageResizerPoints;
        let resizePosition: string = '';
        let selectedElements: HTMLElement = undefined;
        let bottomMiddle: Point = imageResizingPointsOnTouch.bottomMiddleRectParent;
        let bottomRight: Point = imageResizingPointsOnTouch.bottomRightRectParent;
        let bottomLeft: Point = imageResizingPointsOnTouch.bottomLeftRectParent;
        let topMiddle: Point = imageResizingPointsOnTouch.topMiddleRectParent;
        let topRight: Point = imageResizingPointsOnTouch.topRightRectParent;
        let topLeft: Point = imageResizingPointsOnTouch.topLeftRectParent;
        let rightMiddle: Point = imageResizingPointsOnTouch.rightMiddleRectParent;
        let leftMiddle: Point = imageResizingPointsOnTouch.leftMiddleRectParent;
        if (!isNullOrUndefined(this.bottomMiddleRectParent) && this.bottomMiddleRectParent.style.display !== 'none') {
            // tslint:disable-next-line:max-line-length   
            if ((touchPoints.x > bottomMiddle.x && touchPoints.x <= bottomMiddle.x + 25) && (touchPoints.y > bottomMiddle.y && touchPoints.y <= bottomMiddle.y + 25)) {
                selectedElements = this.bottomMiddleRectParent;
                resizePosition = 's-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > bottomRight.x && touchPoints.x <= bottomRight.x + 25) && (touchPoints.y > bottomRight.y && touchPoints.y <= bottomRight.y + 25)) {
                selectedElements = this.bottomRightRectParent;
                resizePosition = 'se-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > bottomLeft.x && touchPoints.x <= bottomLeft.x + 25) && (touchPoints.y > bottomLeft.y && touchPoints.y <= bottomLeft.y + 25)) {
                selectedElements = this.bottomLeftRectParent;
                resizePosition = 'sw-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > topMiddle.x && touchPoints.x <= topMiddle.x + 25) && (touchPoints.y > topMiddle.y && touchPoints.y <= topMiddle.y + 25)) {
                selectedElements = this.topMiddleRectParent;
                resizePosition = 'n-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > topRight.x && touchPoints.x <= topRight.x + 25) && (touchPoints.y > topRight.y && touchPoints.y <= topRight.y + 25)) {
                selectedElements = this.topRightRectParent;
                resizePosition = 'ne-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > topLeft.x && touchPoints.x <= topLeft.x + 25) && (touchPoints.y > topLeft.y && touchPoints.y <= topLeft.y + 25)) {
                selectedElements = this.topLeftRectParent;
                resizePosition = 'nw-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > leftMiddle.x && touchPoints.x <= leftMiddle.x + 25) && (touchPoints.y > leftMiddle.y && touchPoints.y <= leftMiddle.y + 25)) {
                selectedElements = this.leftMiddleRectParent;
                resizePosition = 'w-resize';
                // tslint:disable-next-line:max-line-length   
            } else if ((touchPoints.x > rightMiddle.x && touchPoints.x <= rightMiddle.x + 25) && (touchPoints.y > rightMiddle.y && touchPoints.y <= rightMiddle.y + 25)) {
                selectedElements = this.rightMiddleRectParent;
                resizePosition = 'e-resize';
                // tslint:disable-next-line:max-line-length   
            } else if (!isNullOrUndefined(this.resizeContainerDiv) && (touchPoints.x > parseFloat(this.resizeContainerDiv.style.left)
                && touchPoints.x <= (parseFloat(this.resizeContainerDiv.style.left) + parseFloat(this.resizeContainerDiv.style.width)))
                && (touchPoints.y > parseFloat(this.resizeContainerDiv.style.top)
                    // tslint:disable-next-line:max-line-length 
                    && touchPoints.y <= (parseFloat(this.resizeContainerDiv.style.top) + parseFloat(this.resizeContainerDiv.style.height)))) {
                resizePosition = 'move';
            }
        }
        return { 'selectedElement': selectedElements, 'resizePosition': resizePosition };
    }
    private applyPropertiesForTouch(): void {
        if (!isNullOrUndefined(this.bottomLeftRectParent)) {
            this.bottomMiddleRectParent.style.width = '30px';
            this.bottomMiddleRectParent.style.height = '30px';
            this.bottomRightRectParent.style.width = '30px';
            this.bottomRightRectParent.style.height = '30px';
            this.bottomLeftRectParent.style.width = '30px';
            this.bottomLeftRectParent.style.height = '30px';
            this.topMiddleRectParent.style.width = '30px';
            this.topMiddleRectParent.style.height = '30px';
            this.topRightRectParent.style.width = '30px';
            this.topRightRectParent.style.height = '30px';
            this.topLeftRectParent.style.width = '30px';
            this.topLeftRectParent.style.height = '30px';
            this.leftMiddleRectParent.style.width = '30px';
            this.leftMiddleRectParent.style.height = '30px';
            this.rightMiddleRectParent.style.width = '30px';
            this.rightMiddleRectParent.style.height = '30px';
        }
    }
    /**
     * @private
     */
    public mouseUpInternal(): void {
        this.currentImageElementBox.width = parseFloat(this.imageResizerDiv.style.width) / this.viewer.zoomFactor;
        this.currentImageElementBox.height = parseFloat(this.imageResizerDiv.style.height) / this.viewer.zoomFactor;
        this.owner.isShiftingEnabled = true;
        this.owner.editorModule.setOffsetValue(this.owner.selection);
        this.viewer.layout.reLayoutParagraph(this.currentImageElementBox.line.paragraph, 0, 0);
        this.owner.editorModule.reLayout(this.owner.selection, true);
        this.viewer.updateScrollBars();
    }
    /**
     * Initialize history for image resizer.
     * @param {ImageResizer} imageResizer - Specifies for image resizer.
     * @param {WImage} imageContainer - Specifies for an image.
     * @private
     */
    public initHistoryForImageResizer(imageContainer: ImageElementBox): void {
        if (!isNullOrUndefined(this.owner) && isNullOrUndefined(this.baseHistoryInfo)) {
            this.baseHistoryInfo = new BaseHistoryInfo(this.owner);
            this.baseHistoryInfo.action = 'ImageResizing';
            this.baseHistoryInfo.updateSelection();
            this.baseHistoryInfo.modifiedProperties.push(new ImageFormat(imageContainer));
        }
    }
    /**
     * Updates histroy for image resizer.
     * @private
     */
    public updateHistoryForImageResizer(): void {
        if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.baseHistoryInfo)) {
            let imageFormat: ImageFormat = this.baseHistoryInfo.modifiedProperties[0] as ImageFormat;
            if (this.currentImageElementBox.width === imageFormat.width
                && this.currentImageElementBox.height === imageFormat.height) {
                this.baseHistoryInfo.modifiedProperties.pop();
            } else {
                //Records the image size modifications
                this.owner.editorHistory.recordChanges(this.baseHistoryInfo);
            }
            //Fires the content changed event for the image size modifications
            this.baseHistoryInfo = undefined;
        }
    }
    /**
     * Updates image resize container when applying zooming
     * @private
     */
    public updateImageResizerPosition(): void {
        if (!isNullOrUndefined(this.currentImageElementBox)) {
            let elementBox: ImageElementBox = this.currentImageElementBox;
            let lineWidget: LineWidget = elementBox.line;
            let top: number = this.viewer.selection.getTop(lineWidget) + elementBox.margin.top;
            let left: number = this.viewer.selection.getLeftInternal(lineWidget, elementBox, 0);
            let topValue: number = top * this.viewer.zoomFactor;
            let leftValue: number = left * this.viewer.zoomFactor;
            let height: number = this.viewer.render.getScaledValue(elementBox.height, 2);
            let width: number = this.viewer.render.getScaledValue(elementBox.width, 1);
            this.setImageResizerPosition(leftValue, topValue, width, height, this);
        }
    }
    /**
     * Dispose the internal objects which are maintained.
     * @private
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.resizeContainerDiv)) {
            this.resizeContainerDiv.innerHTML = '';
        }
        if (!isNullOrUndefined(this.topLeftRect)) {
            this.topLeftRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.topMiddleRect)) {
            this.topMiddleRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.topRightRect)) {
            this.topRightRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.bottomLeftRect)) {
            this.bottomLeftRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.bottomMiddleRect)) {
            this.bottomMiddleRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.bottomRightRect)) {
            this.bottomRightRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.leftMiddleRect)) {
            this.leftMiddleRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.rightMiddleRect)) {
            this.rightMiddleRect.innerHTML = '';
        }
        if (!isNullOrUndefined(this.imageResizerDiv)) {
            this.imageResizerDiv.innerHTML = '';
        }
        if (!isNullOrUndefined(this.selectedImageWidget)) {
            this.selectedImageWidget.destroy();
        }
        if (!isNullOrUndefined(this.imageResizerDivElement)) {
            this.imageResizerDivElement.innerHTML = '';
        }
        this.imageResizerDivElement = undefined;
        this.resizeContainerDiv = undefined;
        this.topLeftRect = undefined;
        this.topMiddleRect = undefined;
        this.topRightRect = undefined;
        this.bottomLeftRect = undefined;
        this.bottomMiddleRect = undefined;
        this.bottomRightRect = undefined;
        this.leftMiddleRect = undefined;
        this.rightMiddleRect = undefined;
        this.imageResizerDiv = undefined;
        this.selectedImageWidget = undefined;
        this.isImageResizing = false;
        this.isImageResizerVisible = false;
        this.currentImageElementBoxIn = undefined;
        //this.baseHistoryInfo = undefined;
        this.resizeMarkSizeIn = undefined;
        this.viewer = undefined;
        this.owner = undefined;
    }
}
/** 
 * @private
 */
export class ImageResizingPoints {

    /**
     * @private
     */ public resizeContainerDiv: Point = new Point(0, 0);
    /**
     * @private
     */
    public topLeftRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public topMiddleRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public topRightRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public bottomLeftRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public bottomMiddleRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public bottomRightRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public leftMiddleRectParent: Point = new Point(0, 0);
    /**
     * @private
     */
    public rightMiddleRectParent: Point = new Point(0, 0);
    /**
     * Constructor for image resizing points class.
     */
    constructor() {
        let text: string = 'DocumentEditor';
    }
}
/** 
 * @private
 */
export class SelectedImageInfo {
    private heightIn: number = 0;
    private widthIn: number = 0;
    /**
     * Gets or Sets the height value.
     * @private
     */
    get height(): number {
        return this.heightIn;
    }
    /**
     * @private
     */
    set height(value: number) {
        this.heightIn = value;
    }
    /**
     * Gets or Sets the width value.
     * @private
     */
    get width(): number {
        return this.widthIn;
    }
    /**
     * @private
     */
    set width(value: number) {
        this.widthIn = value;
    }
    /**
     * Constructor for selected image info class.
     * @param {number} height - Specifies for height value.
     * @param {number} width - Specifies for width value.
     */
    constructor(height: number, width: number) {
        this.heightIn = height;
        this.widthIn = width;
    }
}
/** 
 * @private
 */
export interface LeftTopInfo {
    left: number;
    top: number;
}