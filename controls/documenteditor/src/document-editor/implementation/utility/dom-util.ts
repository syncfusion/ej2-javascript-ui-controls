import { L10n, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DocumentEditor } from '../../document-editor';
//import { DocumentEditorRulerModel } from '../ruler-settings-model';
import { Ruler } from '../ruler/index';
import { HelperMethods, Point } from '../editor/editor-helper';
import { ParagraphWidget } from '../viewer';
import { WTabStop } from '../format/paragraph-format';
import { TabJustification } from '../../base/types';
import { TableWidget, TableRowWidget, TableCellWidget, IWidget } from '../viewer/page';
import { TextPosition } from '../selection';
import { WColumnFormat, WSectionFormat } from '../format';
import { Size } from './size';
/* eslint-disable */
/**
 * defines the helper methods for the ruler
 * @private
 */
export class RulerHelper {
    private tabStopStwitch: HTMLElement;

    private currentTabStopElement: HTMLElement;

    private position: TextPosition;

    private hRulerBottom: HTMLElement;
    /**
     * @private
     */
    public vRulerBottom: HTMLElement;

    private locale: L10n;
    /**
     * @private
     */
    public hideTabStopSwitch(show: boolean): void {
        if (this.tabStopStwitch) {
            this.showHideElement(show, this.tabStopStwitch);
        }
    }
    /**
     * @private
     */
    public hideRulerBottom(show: boolean): void {
        if (this.hRulerBottom) {
            this.showHideElement(show, this.hRulerBottom);
        }
        if (this.vRulerBottom) {
            this.showHideElement(show, this.vRulerBottom);
        }
    }
    private showHideElement(show: boolean, element: HTMLElement): void {
        if (show) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
    /* eslint-enable */
    /**
     * createHtmlElement method \
     *
     * @returns {SVGSVGElement} createHtmlElement method .\
     * @param { string } elementType - provide the diagramId  value.
     * @param { Object } attribute - provide the diagramId  value.
     * @private
     */
    public createHtmlElement(elementType: string, attribute: Object): HTMLElement {
        const element: HTMLElement = createElement(elementType, attribute);
        this.setAttributeHtml(element, attribute);
        return element;
    }

    /**
     * createSvgElement method \
     *
     * @returns {SVGSVGElement} createSvgElement method .\
     * @param { string } elementType - provide the elementType  value.
     * @param { Object } attribute - provide the attribute  value.
     * @private
     */
    public createSvgElement(elementType: string, attribute: Object): SVGElement {
        const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
        this.setAttributeSvg(element, attribute);
        return element;
    }

    /**
     * applyStyleAgainstCsp method   \
     *
     * @returns {void} applyStyleAgainstCsp method .\
     * @param { SVGElement } svg - provide the svg  value.
     * @param { string } attributes - provide the boolean  value.
     * @private
     */
    public applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
        const keys: string[] = attributes.split(';');
        for (let i: number = 0; i < keys.length; i++) {
            const attribute: string[] = keys[parseInt(i.toString(), 10)].split(':');
            if (attribute.length === 2) {
                svg.style[attribute[0].trim()] = attribute[1].trim();
            }
        }
    }
    /**
     * setAttributeSvg method.
     *
     * @returns {void} setAttributeSvg method .\
     * @param { SVGElement } svg - provide the svg  value.
     * @param { Object } attributes - provide the boolean  value.
     * @private
     */
    public setAttributeSvg(svg: SVGElement, attributes: Object): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            // Added below condition to check whether svg is undefined or not
            if (svg && keys[parseInt(i.toString(), 10)] !== 'style') {
                svg.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(svg, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }

    /**
     * setAttributeHtml method   \
     *
     * @returns {void} setAttributeHtml method .\
     * @param { HTMLElement } element - provide the svg  value.
     * @param { Object } attributes - provide the boolean  value.
     * @private
     */
    public setAttributeHtml(element: HTMLElement, attributes: Object): void {
        const keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] !== 'style') {
                element.setAttribute(keys[parseInt(i.toString(), 10)], attributes[keys[parseInt(i.toString(), 10)]]);
            } else {
                this.applyStyleAgainstCsp(element, attributes[keys[parseInt(i.toString(), 10)]]);
            }
        }
    }
    /**
     * renderOverlapElement method \
     *
     * @returns {void} renderOverlapElement method .\
     * @param { DocumentEditor} documentEditor - provide the content  value.
     * @private
     */
    public renderOverlapElement(documentEditor: DocumentEditor): HTMLElement {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const attributes: Object = {
            'id': documentEditor.element.id + '_overlapRuler',
            style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;margin-left:0;margin-top:0;diplay:none',
            class: 'e-ruler-overlap'
        };
        const overlap: HTMLElement = this.createHtmlElement('div', attributes);
        const element: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        element.insertBefore(overlap, element.firstChild);
        return overlap;
    }
    public renderRulerMarkerIndicatorElement(documentEditor: DocumentEditor): void {
        if (!documentEditor.enableSelection) {
            return;
        }
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const attributes: Object = {
            'id': documentEditor.element.id + '_markIndicator',
            style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;margin-left:0;margin-top:0;z-index:5;border:1px solid #ccc;display:' + (documentEditor.layoutType === 'Pages' ? 'block;' : 'none;'),
            class: 'e-de-ruler-markIndicator'
        };
        const markIndicator: HTMLElement = this.createHtmlElement('div', attributes);
        this.tabStopStwitch = markIndicator;
        const element: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        element.insertBefore(markIndicator, element.firstChild);
        const ownerId: string = documentEditor.element.id;
        const firstLineIndent: HTMLElement = document.getElementById(ownerId + '_firstLineIndent').cloneNode(true) as HTMLElement;
        const hangingIndent: HTMLElement = document.getElementById(ownerId + '_hangingIndent').cloneNode(true) as HTMLElement;
        firstLineIndent.style.left = '1px';
        firstLineIndent.style.top = rulerSize.height / 2 - 3 + 'px';
        firstLineIndent.style.display = 'none';
        firstLineIndent.classList.add('e-de-ruler-marker');
        firstLineIndent.setAttribute('id', ownerId + '_firstLineIndent_-1');
        hangingIndent.style.left = '1px';
        hangingIndent.style.top = rulerSize.height / 2 - 3 + 'px';
        hangingIndent.style.display = 'none';
        hangingIndent.classList.add('e-de-ruler-marker');
        hangingIndent.setAttribute('id', ownerId + '_hangingIndent_-1');
        markIndicator.appendChild(hangingIndent);
        markIndicator.appendChild(firstLineIndent);
        const justification: string[] = ['Left', 'Center', 'Right', 'Decimal', 'Bar'];
        const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
        locale.setLocale(documentEditor.locale);
        for (let i: number = 0; i < 5; i++) {
            this.renderTab(documentEditor, rulerSize, undefined, justification[parseInt(i.toString(), 10)] as TabJustification, -1, locale);
            const element: HTMLElement = document.getElementById(documentEditor.element.id + '_' + justification[parseInt(i.toString(), 10)] + 'Tab_-1');
            if (!isNullOrUndefined(element)) {
                element.classList.remove('e-de-ruler-tab');
                element.classList.add('e-de-ruler-marker');
                element.style.display = i === 0 ? 'block' : 'none';
                element.style.position = 'absolute';
                element.style.margin = '4px 3px';
                markIndicator.appendChild(element);
            }

        }

        markIndicator.addEventListener('click', (event: MouseEvent) => {
            const divElements: HTMLElement = document.querySelector('.e-de-ruler-markIndicator') as HTMLElement;
            for (let i: number = 0; i < divElements.childNodes.length; i++) {
                const currentDiv: HTMLElement = divElements.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
                if (currentDiv.style.display === 'block') {
                    currentDiv.style.display = 'none';
                    const nextIndex: number = (i + 1) % divElements.childNodes.length;
                    (divElements.childNodes[parseInt(nextIndex.toString(), 10)] as HTMLElement).style.display = 'block';
                    break;
                }
            }
        });

    }

    /**
     * renderRuler method \
     *
     * @returns {void} renderRuler method .\
     * @param { DocumentEditor} documentEditor - provide the content  value.
     * @param { boolean} isHorizontal - provide the content  value.
     * @private
     */
    public renderRuler(documentEditor: DocumentEditor, isHorizontal: boolean): void {
        if (!documentEditor.enableSelection) {
            return;
        }
        let div: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        const height: number = isHorizontal ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x
            : (documentEditor.selectionModule.getPageTop(documentEditor.selectionModule.end.paragraph.bodyWidget.page));
        const margin: string = isHorizontal ? ('margin-left:' + height + 'px;') : ('margin-top:' + height + 'px;');
        if (documentEditor.selectionModule.isForward) {
            this.position = documentEditor.selectionModule.start;
        } else {
            this.position = documentEditor.selectionModule.end;
        }
        // const margin: string = isHorizontal ? ('margin-left:' + (pixelsToPoints(documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.x)) + 'px;') : ('margin-top:' + rulerSize.height + 'px;');
        if (!div) {
            const style: string = 'height:' + (isHorizontal ? rulerSize.height : rulerGeometry.height) + 'px;overflow:hidden;width:' +
                (isHorizontal ? rulerGeometry.width : rulerSize.width) + 'px;position:absolute;font-size:9px;text-align: left;z-index: 4;user-select:none;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'),
                style: style, class: (isHorizontal ? 'e-de-hRuler' : 'e-de-vRuler')
            };
            div = this.createHtmlElement('div', attributes);
        }
        div.addEventListener('dblclick', function (): void {
            documentEditor.showDialog('PageSetup');
        });
        const pageElement: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        const style: string = 'height:' + (isHorizontal ? rulerSize.height : pageElement.getBoundingClientRect().height) + 'px;overflow:hidden;width:' +
            (isHorizontal ? pageElement.getBoundingClientRect().width : rulerSize.width) + 'px;position:absolute;z-index: 3;';
        const attributes: Object = {
            'id': documentEditor.element.id + (isHorizontal ? '_hRulerBottom' : '_vRulerBottom'),
            style: style, class: (isHorizontal ? 'e-de-hRuler' : 'e-de-vRuler')
        };
        const overlap: HTMLElement = this.createHtmlElement('div', attributes);
        // isHorizontal ? (this.hRulerBottom = overlap) : (this.vRulerBottom = overlap);
        if (isHorizontal) {
            this.hRulerBottom = overlap;
        }
        else {
            this.vRulerBottom = overlap;
        }
        const parentElement: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        parentElement.insertBefore(overlap, parentElement.firstChild);
        const element: HTMLElement = isHorizontal ? document.getElementById(documentEditor.element.id + '_hRulerBottom') : document.getElementById(documentEditor.element.id + '_vRulerBottom');
        element.insertBefore(div, element.firstChild);
        this.renderRulerMargins(documentEditor, isHorizontal, div);
        //const documentEditorRuler: DocumentEditorRulerModel = isHorizontal ? documentEditor.documentEditorSettings.rulerSettings.horizontalRuler : documentEditor.documentEditorSettings.rulerSettings.verticalRuler;
        const ruler: Ruler = new Ruler(div, this);
        ruler.orientation = isHorizontal ? 'Horizontal' : 'Vertical';
        this.updateMargin(ruler, documentEditor, isHorizontal);
        // ruler.pageWidth = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.width;
        // ruler.pageHeight = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.height;
        // ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + documentEditorRuler.segmentWidth;
        ruler.length = ruler.zeroPosition * 2;
        ruler.appendTo();
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler = ruler : documentEditor.vRuler = ruler;
        this.updateRulerPosition(documentEditor, isHorizontal);
        const rulerObj: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler.element = rulerObj : documentEditor.vRuler.element = rulerObj;
        if (rulerObj) {
            // Set the scrollLeft property to the desired value (e.g., 100 pixels)
            if (isHorizontal) {
                rulerObj.scrollLeft = ruler.zeroPosition -
                    HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin);
            } else {
                rulerObj.scrollTop = ruler.zeroPosition -
                    HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin);
            }

        }
        this.locale = new L10n('documenteditor', documentEditor.defaultLocale);
        if (isHorizontal) {
            this.renderIndents(documentEditor, isHorizontal, rulerSize, rulerGeometry, this.locale);
        }
        let resizerEnabled: boolean = false;
        let isDragging: boolean = false;
        let isLeftRulerMargin: boolean = undefined;
        let isLeftMultiColumn: boolean = false;
        let isRightMultiColumn: boolean = false;
        let multiColumnElement: HTMLElement;
        const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
        let columnInitialValue: number;
        let initialValue: number;
        let currentScrollLeft: number;
        let initialRightMargin: number;
        let finalmouseXRelativeToDiv: number;
        if (isHorizontal) {
            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                const divRect: DOMRect = hRuler.getBoundingClientRect() as DOMRect;
                const leftMargin: number = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
                * documentEditor.zoomFactor;
                const rightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width) -
                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor);
                let pixelValue: number = Math.round(e.clientX - divRect.left);
                let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(pixelValue);
                if (!isDragging) {
                    if (documentEditor.isOnIndent) {
                        hRuler.style.cursor = 'default';
                        if (hRuler.hasAttribute('title')) {
                            hRuler.removeAttribute('title');
                        }
                        resizerEnabled = false;
                    } else if (((leftMargin - 3) <= mouseXRelativeToDiv) && ((leftMargin + 3) >= mouseXRelativeToDiv)) {
                        if (documentEditor.layoutType === 'Pages') {
                            hRuler.style.cursor = 'e-resize';
                            hRuler.setAttribute('title', this.locale.getConstant('Left Margin'));
                            resizerEnabled = true;
                            isLeftRulerMargin = true;
                        }
                    } else if ((((rightMargin - 3) <= mouseXRelativeToDiv) && ((rightMargin + 3) >= mouseXRelativeToDiv))) {
                        if (documentEditor.layoutType === 'Pages') {
                            hRuler.style.cursor = 'e-resize';
                            hRuler.setAttribute('title', this.locale.getConstant('Right Margin'));
                            resizerEnabled = true;
                            isLeftRulerMargin = false;
                        }
                    } else if (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns.length > 0) {
                        const columns: WColumnFormat[] = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns;
                        if (documentEditor.layoutType === 'Pages') {
                            for (let i: number = 1; i <= columns.length; i++) {
                                const rulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_Margin' + i);
                                const maginLeft: number = rulerMarginDiv.getBoundingClientRect().left;
                                const width: number = rulerMarginDiv.getBoundingClientRect().width;
                                if (((maginLeft - 3) <= e.clientX) && ((maginLeft + 3) >= e.clientX)) {
                                    hRuler.style.cursor = 'e-resize';
                                    multiColumnElement = rulerMarginDiv;
                                    hRuler.setAttribute('title', this.locale.getConstant('Left Margin'));
                                    isLeftMultiColumn = true;
                                    resizerEnabled = true;
                                    break;
                                } else if (((maginLeft + width - 3) <= e.clientX) && ((maginLeft + width + 3) >= e.clientX)) {
                                    hRuler.style.cursor = 'e-resize';
                                    multiColumnElement = rulerMarginDiv;
                                    hRuler.setAttribute('title', this.locale.getConstant('Right Margin'));
                                    isRightMultiColumn = true;
                                    resizerEnabled = true;
                                    break;
                                } else {
                                    hRuler.style.cursor = 'default';
                                    if (hRuler.hasAttribute('title')) {
                                        hRuler.removeAttribute('title');
                                    }
                                    isLeftMultiColumn = false;
                                    isRightMultiColumn = false;
                                    resizerEnabled = false;
                                }
                            }
                        }
                    }
                    else {
                        hRuler.style.cursor = 'default';
                        if (hRuler.hasAttribute('title')) {
                            hRuler.removeAttribute('title');
                        }
                        resizerEnabled = false;
                    }
                }
                if (isDragging) {
                    const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                    const pageWidth: number = documentEditor.selectionModule.sectionFormat.pageWidth;
                    const rightMarginValue: number = documentEditor.selectionModule.sectionFormat.rightMargin;
                    let rightIndentValue: number = documentEditor.selectionModule.paragraphFormat.rightIndent;
                    rightIndentValue = rightIndentValue > 0 ? rightIndentValue : 0;
                    const minimumValue: number = 42;
                    let firstLineIndent: number = documentEditor.selectionModule.paragraphFormat.firstLineIndent;
                    const leftMarginValue: number = documentEditor.selectionModule.sectionFormat.leftMargin;
                    firstLineIndent = firstLineIndent >= 0 ? firstLineIndent : 0;
                    const leftIndent: number = documentEditor.selectionModule.paragraphFormat.leftIndent;
                    if (isLeftRulerMargin) {
                        const leftMaxLimit: number = rulerZeroPoint + (
                            HelperMethods.convertPointToPixel(pageWidth - rightMarginValue -
                                rightIndentValue - minimumValue - firstLineIndent - leftIndent) * documentEditor.zoomFactor);
                        const leftMinLimit: number = rulerZeroPoint;
                        if (pixelValue + rulerZeroPoint > leftMaxLimit) {
                            pixelValue = leftMaxLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        } else if (pixelValue + rulerZeroPoint < leftMinLimit) {
                            pixelValue = leftMinLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        }
                    } else {
                        const rightMinLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                            leftMarginValue + leftIndent + firstLineIndent + minimumValue + rightIndentValue) * documentEditor.zoomFactor);
                        const rightMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                            pageWidth) * documentEditor.zoomFactor);
                        if (pixelValue + rulerZeroPoint > rightMaxLimit) {
                            pixelValue = rightMaxLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        } else if (pixelValue + rulerZeroPoint < rightMinLimit) {
                            pixelValue = rightMinLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        }
                    }
                    finalmouseXRelativeToDiv = mouseXRelativeToDiv;
                    const currentRightMargin: number = (HelperMethods.convertPixelToPoint(divRect.width)
                    - (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor));
                    if (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.numberOfColumns <= 1) {
                        this.resizeRulerMargins(isLeftRulerMargin, initialValue,
                                                currentScrollLeft, currentRightMargin, hRuler, mouseXRelativeToDiv, true, documentEditor);
                    }
                    const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                    if (isLeftRulerMargin) {
                        const difference: number = mouseXRelativeToDiv - initialValue;
                        rightIndent.style.left = (initialRightMargin - HelperMethods.convertPointToPixel(difference)) + 'px';
                    } else {
                        const difference: number = mouseXRelativeToDiv - initialValue;
                        rightIndent.style.left = (initialRightMargin + HelperMethods.convertPointToPixel(difference)) + 'px';
                    }
                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    const indicatorLineValue: number = startValue + pixelValue;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }

            });
            let mouseDownTabValue: number;
            let mouseUpTabValue: number;
            hRuler.addEventListener('mouseenter', (e: MouseEvent) => {
                if (!isNullOrUndefined(this.currentTabStopElement)) {
                    this.currentTabStopElement.style.display = 'block';
                }
            });
            hRuler.addEventListener('mouseleave', (e: MouseEvent) => {
                if (!isNullOrUndefined(this.currentTabStopElement)) {
                    this.currentTabStopElement.style.display = 'none';
                    //this.currentTabStopElement = undefined;
                }
            });
            hRuler.addEventListener('mousedown', (e: MouseEvent) => {
                if (resizerEnabled && !documentEditor.isTableMarkerDragging) {
                    isDragging = true;
                    if (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns.length > 0) {
                        if (isLeftMultiColumn) {
                            columnInitialValue = multiColumnElement.getBoundingClientRect().left;
                        } else if (isRightMultiColumn) {
                            columnInitialValue = multiColumnElement.getBoundingClientRect().left
                                + multiColumnElement.getBoundingClientRect().width;
                        }
                    }
                    const divRect: DOMRect = hRuler.getBoundingClientRect() as DOMRect;
                    initialValue = HelperMethods.convertPixelToPoint(Math.round(e.clientX - divRect.left));
                    currentScrollLeft = hRuler.scrollLeft;
                    const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                    initialRightMargin = HelperMethods.getNumberFromString(rightIndent.style.left);

                    const pixelValue: number = Math.round(e.clientX - divRect.left);
                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    const indicatorLineValue: number = startValue + pixelValue;

                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                    lineSvg.style.display = 'block';
                }
                const divRect: DOMRect  = hRuler.getBoundingClientRect() as DOMRect;

                if (divRect.y + (divRect.height / 2) <= e.clientY) {
                    mouseDownTabValue = e.clientX - hRuler.getBoundingClientRect().left;
                    if (documentEditor.layoutType === 'Pages') {
                        mouseDownTabValue = HelperMethods.convertPixelToPoint(
                            mouseDownTabValue - HelperMethods.convertPointToPixel(
                                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) *
                                documentEditor.zoomFactor);
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                            paraWidth = HelperMethods.convertPixelToPoint(paraWidth * documentEditor.zoomFactor);
                            mouseDownTabValue = paraWidth - mouseDownTabValue;
                        }
                    } else if (documentEditor.layoutType === 'Continuous') {
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            mouseDownTabValue = HelperMethods.convertPixelToPoint((mouseDownTabValue) - 20);
                            let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                            paraWidth = HelperMethods.convertPixelToPoint(paraWidth * documentEditor.zoomFactor);
                            mouseDownTabValue = paraWidth - mouseDownTabValue;
                        } else {
                            mouseDownTabValue = HelperMethods.convertPixelToPoint((mouseDownTabValue) - 20);
                        }
                    }
                }
            });
            hRuler.addEventListener('mouseup', (e: MouseEvent) => {
                const container: HTMLElement = document.getElementById(documentEditor.element.id + '_markIndicator');
                const divRect: DOMRect = hRuler.getBoundingClientRect() as DOMRect;

                if (divRect.y + (divRect.height / 2) <= e.clientY) {
                    mouseUpTabValue = e.clientX - hRuler.getBoundingClientRect().left;
                    if (documentEditor.layoutType === 'Pages') {
                        mouseUpTabValue = HelperMethods.convertPixelToPoint(mouseUpTabValue -
                            HelperMethods.convertPointToPixel(
                                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin)
                            * documentEditor.zoomFactor);
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                            paraWidth = HelperMethods.convertPixelToPoint(paraWidth * documentEditor.zoomFactor);
                            mouseUpTabValue = paraWidth - mouseUpTabValue;
                        }
                    } else if (documentEditor.layoutType === 'Continuous') {
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            mouseUpTabValue = HelperMethods.convertPixelToPoint((mouseUpTabValue) - 20);
                            let paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                            paraWidth = HelperMethods.convertPixelToPoint(paraWidth * documentEditor.zoomFactor);
                            mouseUpTabValue = paraWidth - mouseUpTabValue;
                        } else {
                            mouseUpTabValue = HelperMethods.convertPixelToPoint((mouseUpTabValue) - 20);
                        }
                    }
                    const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                    const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                    const maxValue: number = rightIndentValue;
                    if (mouseUpTabValue > 0 && mouseUpTabValue < maxValue && mouseDownTabValue === mouseUpTabValue) {
                        if (!isNullOrUndefined(container)) {
                            const visibleElement: Element = container.querySelector('.e-de-ruler-marker[style*="display: block;"]');
                            if (!isNullOrUndefined(visibleElement)) {
                                mouseUpTabValue /= documentEditor.zoomFactor;
                                const dataNameValue: string = visibleElement.getAttribute('data-name');
                                if (dataNameValue === 'LeftTab' || dataNameValue === 'CenterTab'
                                    || dataNameValue === 'RightTab' || dataNameValue === 'DecimalTab' || dataNameValue === 'BarTab') {
                                    const tabStop: WTabStop = new WTabStop();
                                    tabStop.position = mouseUpTabValue;
                                    tabStop.tabJustification = this.getTabJustification(dataNameValue);
                                    tabStop.deletePosition = 0;
                                    tabStop.tabLeader = 'None';
                                    documentEditor.editorModule.onApplyParagraphFormat('tabStop', [tabStop], false, false);
                                } else if (dataNameValue === 'FirstLineIndent' || dataNameValue === 'HangingIndent') {
                                    const property: string = 'firstLineIndent';
                                    if (dataNameValue === 'HangingIndent') {
                                        const initialValue: number = documentEditor.selectionModule.paragraphFormat.firstLineIndent;
                                        const differenceValue: number = mouseUpTabValue + initialValue;
                                        let currentValue: number =
                                            documentEditor.selectionModule.start.paragraph.paragraphFormat.firstLineIndent;
                                        documentEditor.editorModule.onApplyParagraphFormat('firstLineIndent', currentValue - differenceValue, false, false);
                                        const leftIndentCurrentValue: number =
                                            documentEditor.selectionModule.start.paragraph.paragraphFormat.leftIndent + currentValue;
                                        currentValue = currentValue - differenceValue;
                                        documentEditor.editorModule.onApplyParagraphFormat('leftIndent', leftIndentCurrentValue - currentValue, false, false, true);
                                    }
                                    else {
                                        documentEditor.editorModule.onApplyParagraphFormat(property, mouseDownTabValue, false, false);
                                    }
                                }
                            }
                        }
                    }
                }
            });

            document.addEventListener('mouseup', (e: MouseEvent) => {
                if (isDragging && !documentEditor.isTableMarkerDragging) {
                    const divRect: DOMRect = hRuler.getBoundingClientRect() as DOMRect;
                    const mouseXRelativeToDiv: number = finalmouseXRelativeToDiv; // HelperMethods.convertPixelToPoint(Math.round(e.clientX - divRect.left));
                    // const currentLeftMargin = documentEditor.hRuler.startMargin * documentEditor.zoomFactor;
                    // const currentScrollLeft = hRuler.scrollLeft;
                    // const currentRightMargin = (HelperMethods.convertPixelToPoint(divRect.width) - (documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor));
                    // resizeRulerMargins(isLeftRulerMargin, currentLeftMargin, currentScrollLeft, currentRightMargin, hRuler, mouseXRelativeToDiv, true, documentEditor);
                    // if (hRuler) {
                    //     rulerObj.scrollLeft = rulerObj.scrollLeft - HelperMethods.convertPointToPixel((documentEditor.hRuler.leftMargin < mouseXRelativeToDiv) ? (mouseXRelativeToDiv - documentEditor.hRuler.leftMargin) : (documentEditor.hRuler.leftMargin - mouseXRelativeToDiv));
                    // }
                    // updateRuler(documentEditor, documentEditor.hRuler, true);
                    if (isLeftMultiColumn || isRightMultiColumn) {
                        let finalvalue: number = 0;
                        finalvalue = e.clientX - columnInitialValue;
                        const secFormat: WSectionFormat =
                            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.cloneFormat();
                        const pageWidth: number = documentEditor.selectionModule.sectionFormat.pageWidth
                            - documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin -
                            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin;
                        const columnSpace: number = isLeftMultiColumn ? (secFormat.columns[0].space +
                            ((HelperMethods.convertPixelToPoint(finalvalue))))
                            : (secFormat.columns[0].space - ((HelperMethods.convertPixelToPoint(finalvalue))));
                        for (let i: number = 0; i < secFormat.columns.length; i++) {
                            const col: WColumnFormat = secFormat.columns[parseInt(i.toString(), 10)];
                            if (columnSpace >= 0 && col.width >= 36) {
                                const widthCal: number = HelperMethods.convertPointToPixel(
                                    (pageWidth - (HelperMethods.convertPixelToPoint(
                                        columnSpace) * (secFormat.numberOfColumns - 1))) / (secFormat.numberOfColumns));
                                col.width = widthCal;
                                if (i < secFormat.columns.length - 1) {
                                    col.space = columnSpace;
                                }
                            } else {
                                col[0].space = col[1].space;
                            }
                        }
                        documentEditor.editorModule.onApplySectionFormat(undefined, secFormat);
                        isLeftMultiColumn = false;
                        isRightMultiColumn = false;
                    } else if (isLeftRulerMargin) {
                        documentEditor.hRuler.startMargin = (mouseXRelativeToDiv / documentEditor.zoomFactor);
                        documentEditor.selectionModule.sectionFormat.leftMargin = mouseXRelativeToDiv / documentEditor.zoomFactor;
                    } else {
                        const rightMargin: number = HelperMethods.convertPixelToPoint(
                            rulerGeometry.width) - (mouseXRelativeToDiv / documentEditor.zoomFactor);
                        // documentEditor.hRuler.endMargin = rightMargin;
                        documentEditor.selectionModule.sectionFormat.rightMargin = rightMargin;
                    }

                    resizerEnabled = false;
                    isDragging = false;
                    isLeftRulerMargin = undefined;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });

        }
        //Vertical Ruler Resizing

        const vRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler');
        let isTopRulerMargin: boolean = false;
        let initialYValue: number;
        let currentScrollTop: number;
        if (!isHorizontal) {
            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                const divRect: DOMRect = vRuler.getBoundingClientRect() as DOMRect;
                const topMargin: number = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
                    * documentEditor.zoomFactor;
                const bottomMargin: number = (HelperMethods.convertPixelToPoint(
                    divRect.height) - documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin
                    * documentEditor.zoomFactor);
                const mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
                let pixelValue: number = Math.round(e.clientY - divRect.top);
                if (!isDragging) {
                    if (((topMargin - 3) <= mouseXRelativeToDiv) && ((topMargin + 3) >= mouseXRelativeToDiv)) {
                        vRuler.style.cursor = 'n-resize';
                        vRuler.setAttribute('title', this.locale.getConstant('Top Margin'));
                        resizerEnabled = true;
                        isTopRulerMargin = true;

                    } else if ((((bottomMargin - 3) <= mouseXRelativeToDiv) && ((bottomMargin + 3) >= mouseXRelativeToDiv))) {
                        vRuler.style.cursor = 'n-resize';
                        vRuler.setAttribute('title', this.locale.getConstant('Bottom Margin'));
                        resizerEnabled = true;
                        isTopRulerMargin = false;
                    }
                    else {
                        vRuler.style.cursor = 'default';
                        if (vRuler.hasAttribute('title')) {
                            vRuler.removeAttribute('title');
                        }
                        resizerEnabled = false;
                    }
                }
                if (isDragging) {
                    let mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
                    const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.topMargin)
                        * documentEditor.zoomFactor;
                    const pageHeight: number = documentEditor.selectionModule.sectionFormat.pageHeight;
                    const minimumValue: number = 12;
                    const bottomMarginValue: number = documentEditor.selectionModule.sectionFormat.bottomMargin;
                    const topMarginValue: number = documentEditor.selectionModule.sectionFormat.topMargin;
                    if (isTopRulerMargin) {
                        const topMinLimit: number = rulerZeroPoint;
                        const topMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                            pageHeight - bottomMarginValue - minimumValue) * documentEditor.zoomFactor);
                        if (pixelValue + rulerZeroPoint > topMaxLimit) {
                            pixelValue = topMaxLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        } else if (pixelValue + rulerZeroPoint < topMinLimit) {
                            pixelValue = topMinLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        }
                    } else {
                        const bottomMinLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                            topMarginValue + minimumValue) * documentEditor.zoomFactor);
                        const bottomMaxLimit: number = rulerZeroPoint + (HelperMethods.convertPointToPixel(
                            pageHeight) * documentEditor.zoomFactor);
                        if (pixelValue + rulerZeroPoint > bottomMaxLimit) {
                            pixelValue = bottomMaxLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        } else if (pixelValue + rulerZeroPoint < bottomMinLimit) {
                            pixelValue = bottomMinLimit - rulerZeroPoint;
                            mouseXRelativeToDiv = HelperMethods.convertPixelToPoint(pixelValue);
                        }
                    }
                    const currentBottomMargin: number = (HelperMethods.convertPixelToPoint(divRect.height) -
                        (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin * documentEditor.zoomFactor));
                    this.resizeVRulerMargins(isTopRulerMargin, initialYValue, currentScrollTop,
                                             currentBottomMargin, vRuler, mouseXRelativeToDiv, documentEditor);

                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.y * documentEditor.zoomFactor;
                    const indicatorLineValue: number = startValue + pixelValue; // + 15;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator_svg');
                    lineSvg.style.top = indicatorLineValue + 'px';
                }

            });
            vRuler.addEventListener('mousedown', (e: MouseEvent) => {
                if (resizerEnabled) {
                    isDragging = true;
                    const divRect: DOMRect = vRuler.getBoundingClientRect() as DOMRect;
                    initialYValue = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
                    currentScrollTop = vRuler.scrollTop;

                    const pixelValue: number = Math.round(e.clientY - divRect.top);
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator_svg');
                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.y * documentEditor.zoomFactor;
                    const indicatorLineValue: number = (startValue + pixelValue); // + 15;
                    lineSvg.style.top = indicatorLineValue + 'px';
                    lineSvg.style.display = 'block';
                }
            });

            document.addEventListener('mouseup', (e: MouseEvent) => {
                if (isDragging) {
                    const divRect: DOMRect = vRuler.getBoundingClientRect() as DOMRect;
                    const mouseXRelativeToDiv: number = HelperMethods.convertPixelToPoint(Math.round(e.clientY - divRect.top));
                    // const currentTopMargin = documentEditor.hRuler.startMargin * documentEditor.zoomFactor;
                    // const currentScrollTop = vRuler.scrollTop;
                    // const currentBottomMargin = (HelperMethods.convertPixelToPoint(divRect.height) - (documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.bottomMargin * documentEditor.zoomFactor));
                    // resizeVRulerMargins(isTopRulerMargin, currentTopMargin, currentScrollTop, currentBottomMargin, vRuler, mouseXRelativeToDiv, documentEditor);
                    // if (hRuler) {
                    //     rulerObj.scrollLeft = rulerObj.scrollLeft - HelperMethods.convertPointToPixel((documentEditor.hRuler.leftMargin < mouseXRelativeToDiv) ? (mouseXRelativeToDiv - documentEditor.hRuler.leftMargin) : (documentEditor.hRuler.leftMargin - mouseXRelativeToDiv));
                    // }
                    // updateRuler(documentEditor, documentEditor.hRuler, true);
                    if (isTopRulerMargin) {
                        documentEditor.vRuler.startMargin = (mouseXRelativeToDiv / documentEditor.zoomFactor);
                        documentEditor.selectionModule.sectionFormat.topMargin = mouseXRelativeToDiv / documentEditor.zoomFactor;
                    } else {
                        const bottomtMargin: number = HelperMethods.convertPixelToPoint(
                            rulerGeometry.height) - (mouseXRelativeToDiv / documentEditor.zoomFactor);
                        documentEditor.vRuler.endMargin = bottomtMargin;
                        documentEditor.selectionModule.sectionFormat.bottomMargin = bottomtMargin;
                    }

                    resizerEnabled = false;
                    isDragging = false;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                    isTopRulerMargin = undefined;
                }
            });

        }
    }
    public updateRulerPosition(documentEditor: DocumentEditor, isHorizontal: boolean): void {
        const rulerObj: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        // eslint-disable-next-line
        isHorizontal ? documentEditor.hRuler.element = rulerObj : documentEditor.vRuler.element = rulerObj;
        if (rulerObj) {
            // Set the scrollLeft property to the desired value (e.g., 100 pixels)
            rulerObj.scrollLeft = 2112 - HelperMethods.convertPointToPixel(
                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin);
        }
    }

    public updateIndicatorLines(documentEditor: DocumentEditor): void {
        const hRulerSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
        const hRulerLine: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator');
        const vRulerSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator_svg');
        const vRulerLine: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_indicator');

        const pageContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        const pageData: DOMRect = pageContainer.getBoundingClientRect() as DOMRect;
        const pageHeight: number = pageData.height;
        const pageWidth: number = pageData.width;

        hRulerSvg.style.height = pageHeight + 'px';
        hRulerLine.setAttribute('y2', `${pageHeight}`);
        vRulerSvg.style.width = pageWidth + 'px';
        vRulerLine.setAttribute('x2', `${pageWidth}`);
    }

    public createIndicatorLines(documentEditor: DocumentEditor): void {
        if (!documentEditor.enableSelection) {
            return;
        }
        const viewerContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_viewerContainer');
        const pageContainer: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
        // let container = document.getElementById(documentEditor.element.id);
        const data: DOMRect = viewerContainer.getBoundingClientRect() as DOMRect;
        const pageData: DOMRect = pageContainer.getBoundingClientRect() as DOMRect;
        const pageHeight: number = pageData.height;
        const pageWidth: number = pageData.width;

        const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
        const hSvgAttr: Object = {
            id: documentEditor.element.id + '_hRuler_indicator_svg',
            width: 0.5 + 'px',
            height: pageHeight + 'px',
            style: 'position:absolute;z-index:1;display:none;'
        };
        const hSvg: SVGElement = this.createSvgElement('svg', hSvgAttr);
        const verticalLineAttr: Object = { 'x1': 0, 'y1': hRuler.getBoundingClientRect().height + 5, 'x2': 0, 'y2': pageHeight, 'stroke-width': 0.5, 'stroke': 'black' };
        const vLine: SVGElement = this.createSvgElement('line', verticalLineAttr);
        vLine.setAttribute('id', documentEditor.element.id + '_hRuler_indicator');
        hSvg.appendChild(vLine);
        viewerContainer.insertBefore(hSvg, viewerContainer.firstChild);

        const vRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler');
        const vSvgAttr: Object = {
            id: documentEditor.element.id + '_vRuler_indicator_svg',
            width: pageWidth + 'px',
            height: 0.5 + 'px',
            style: 'position:absolute;z-index:1;display:none;'
        };
        const vSvg: SVGElement = this.createSvgElement('svg', vSvgAttr);
        const horizontalLineAttr: Object = { 'x1': vRuler.getBoundingClientRect().width + 5, 'y1': 0, 'x2': pageWidth, 'y2': 0, 'stroke-width': 0.5, 'stroke': 'black' };
        const hLine: SVGElement = this.createSvgElement('line', horizontalLineAttr);
        hLine.setAttribute('id', documentEditor.element.id + '_vRuler_indicator');
        vSvg.appendChild(hLine);
        viewerContainer.insertBefore(vSvg, viewerContainer.firstChild);
    }
    public updateIndentMarkers(documentEditor: DocumentEditor): void {
        if (isNullOrUndefined(documentEditor) || isNullOrUndefined(documentEditor.element)
            || isNullOrUndefined(documentEditor.element.id) || isNullOrUndefined(documentEditor.hRuler)
            || isNullOrUndefined(documentEditor.hRuler.zeroPosition)) {
            return;
        }
        let indent: HTMLElement = undefined;
        const ownerId: string = documentEditor.element.id;
        let rulerZeroPoint: number = HelperMethods.convertPointToPixel(1584 - documentEditor.selectionModule.sectionFormat.leftMargin);
        let currentIndentValue: number;
        let finalValue: number;
        let currentMargin: number;
        let pixelValue: string;
        // if (documentEditor.selection.end.paragraph.isInsideTable) {
        //     currentIndentValue = documentEditor.selection.paragraphFormat.leftIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     finalValue = HelperMethods.convertPointToPixel(currentIndentValue) + currentCell.x;
        //     pixelValue = (((rulerZeroPoint + ((finalValue))) * documentEditor.zoomFactor)) + 'px';

        //     indent = document.getElementById(ownerId + '_leftIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_hangingIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_firstLineIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.firstLineIndent;
        //     currentMargin = documentEditor.selection.paragraphFormat.leftIndent;
        //     finalValue = HelperMethods.convertPointToPixel(currentIndentValue + currentMargin) + currentCell.x;
        //     pixelValue = (((rulerZeroPoint + ((finalValue))) * documentEditor.zoomFactor)) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_rightIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.rightIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.rightMargin;
        //     finalValue = (currentCell.x + currentCell.width) - HelperMethods.convertPointToPixel(currentIndentValue);
        //     pixelValue = ((rulerZeroPoint + finalValue - 2) * documentEditor.zoomFactor) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        // }
        // else {
        //     indent = document.getElementById(ownerId + '_leftIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.leftIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     finalValue = currentMargin + currentIndentValue;
        //     pixelValue = (((rulerZeroPoint + (HelperMethods.convertPointToPixel(finalValue))) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_hangingIndent');
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_firstLineIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.firstLineIndent;
        //     let leftIndent = documentEditor.selection.paragraphFormat.leftIndent;
        //     let leftMargin = documentEditor.selection.sectionFormat.leftMargin;
        //     if (currentIndentValue < 0 && leftIndent < 0) {
        //         currentIndentValue = currentIndentValue < 0 ? 0 : currentIndentValue;
        //     }
        //     finalValue = leftMargin + leftIndent + currentIndentValue;
        //     pixelValue = (((rulerZeroPoint + HelperMethods.convertPointToPixel(finalValue)) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        //     indent = document.getElementById(ownerId + '_rightIndent');
        //     currentIndentValue = documentEditor.selection.paragraphFormat.rightIndent;
        //     currentMargin = documentEditor.selection.sectionFormat.rightMargin;
        //     finalValue = documentEditor.selection.sectionFormat.pageWidth - (currentIndentValue + currentMargin);
        //     pixelValue = (((rulerZeroPoint + HelperMethods.convertPointToPixel(finalValue)) * documentEditor.zoomFactor) - 6) + 'px';
        //     if (!isNullOrUndefined(indent)) {
        //         indent.style.left = pixelValue;
        //     }
        // }
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (this.position.paragraph.paragraphFormat.bidi || (this.position.paragraph.isInsideTable
            && this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi)) {
            const rulerMarginDivWidth: number = ((rulerGeometry.width / documentEditor.zoomFactor) -
                (HelperMethods.convertPointToPixel((this.position.paragraph.bodyWidget.sectionFormat.rightMargin)
                    + (this.position.paragraph.bodyWidget.sectionFormat.leftMargin))));
            rulerZeroPoint -= rulerMarginDivWidth;
        }

        const paraStart: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['x'].toString()) : this.position.paragraph.x;
        const paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;

        let finalValueTemp: number;
        if (this.position.paragraph.paragraphFormat.bidi) {
            rulerZeroPoint = HelperMethods.convertPointToPixel(
                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                (documentEditor.selectionModule.sectionFormat.pageWidth -
                    documentEditor.selectionModule.sectionFormat.leftMargin -
                    documentEditor.selectionModule.sectionFormat.rightMargin));
        }
        const leftIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_leftIndent');
        const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
        if (this.position.paragraph.paragraphFormat.bidi) {
            leftIndent.setAttribute('title', this.locale.getConstant('Right Indent'));
            rightIndent.setAttribute('title', this.locale.getConstant('Left Indent'));
            finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
        } else {
            leftIndent.setAttribute('title', this.locale.getConstant('Left Indent'));
            rightIndent.setAttribute('title', this.locale.getConstant('Right Indent'));
            finalValueTemp = rulerZeroPoint + paraStart;
        }
        const firstLineIndent: number = this.position.paragraph.paragraphFormat.firstLineIndent;
        indent = document.getElementById(ownerId + '_leftIndent');
        if (!isNullOrUndefined(indent)) {
            if (documentEditor.layoutType === 'Pages') {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            } else if (documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - documentEditor.viewer.clientArea.width;
                    finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
                    indent.style.left = finalValueTemp + 'px';
                } else {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    finalValueTemp = rulerZeroPoint + (paraStart * documentEditor.zoomFactor);
                    indent.style.left = finalValueTemp + 'px';
                }
            }
        }
        indent = document.getElementById(ownerId + '_hangingIndent');
        if (!isNullOrUndefined(indent)) {
            if (documentEditor.layoutType === 'Pages') {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            } else if (documentEditor.layoutType === 'Continuous') {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - documentEditor.viewer.clientArea.width;
                    finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
                    indent.style.left = finalValueTemp + 'px';
                } else {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    finalValueTemp = rulerZeroPoint + (paraStart * documentEditor.zoomFactor);
                    indent.style.left = finalValueTemp + 'px';
                }
            }
        }
        indent = document.getElementById(ownerId + '_firstLineIndent');
        if (documentEditor.layoutType === 'Pages') {
            if (!isNullOrUndefined(indent)) {
                if (this.position.paragraph.paragraphFormat.bidi) {
                    indent.style.left = (((finalValueTemp - HelperMethods.convertPointToPixel(firstLineIndent)) * documentEditor.zoomFactor) - 6) + 'px';
                } else {
                    indent.style.left = (((finalValueTemp + HelperMethods.convertPointToPixel(firstLineIndent)) * documentEditor.zoomFactor) - 6) + 'px';
                }
            }
        } else if (documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                    20 - documentEditor.viewer.clientArea.width;
                finalValueTemp = rulerZeroPoint + paraStart + paraWidth - (HelperMethods.convertPointToPixel(
                    firstLineIndent) * documentEditor.zoomFactor);
            } else {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                finalValueTemp = rulerZeroPoint + ((paraStart + HelperMethods.convertPointToPixel(
                    firstLineIndent)) * documentEditor.zoomFactor);
            }
            indent.style.left = finalValueTemp + 'px';
        }
        indent = document.getElementById(ownerId + '_rightIndent');
        if (documentEditor.layoutType === 'Pages') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                finalValueTemp = rulerZeroPoint + paraStart;
            } else {
                finalValueTemp = rulerZeroPoint + paraStart + paraWidth;
            }
            if (!isNullOrUndefined(indent)) {
                indent.style.left = ((finalValueTemp * documentEditor.zoomFactor) - 6) + 'px';
            }
        } else if (documentEditor.layoutType === 'Continuous') {
            if (this.position.paragraph.paragraphFormat.bidi) {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                    20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                finalValueTemp = rulerZeroPoint + paraStart;
                indent.style.left = finalValueTemp + 'px';
            } else {
                rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                finalValueTemp = rulerZeroPoint + ((paraStart + paraWidth) * documentEditor.zoomFactor);
                indent.style.left = finalValueTemp + 'px';
            }
        }
    }

    public updateTabStopMarkers(documentEditor: DocumentEditor): void {
        if (isNullOrUndefined(documentEditor) || isNullOrUndefined(documentEditor.element)
            || isNullOrUndefined(documentEditor.element.id) || isNullOrUndefined(documentEditor.hRuler)
            || isNullOrUndefined(documentEditor.hRuler.zeroPosition)) {
            return;
        }
        const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
        locale.setLocale(documentEditor.locale);
        const ownerId: string = documentEditor.element.id;
        const element: HTMLElement = document.getElementById(ownerId + '_markIndicator');
        element.style.display = documentEditor.layoutType === 'Pages' ? 'block' : 'none';
        const paragarph: ParagraphWidget = this.position.paragraph;
        const tabs: WTabStop[] = paragarph.paragraphFormat.tabs;
        const zoomFactor: number = documentEditor.zoomFactor;
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const RenderedTabElement: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-tab'));
        for (let i: number = 0; i < tabs.length; i++) {
            const tabStop: WTabStop = tabs[parseInt(i.toString(), 10)];
            const justification: TabJustification = tabStop.tabJustification;
            // const position: number = tabStop.position;
            const id: string = documentEditor.element.id + '_' + justification + 'Tab_' + i.toString();
            const tabMarker: HTMLElement = document.getElementById(id);
            if (!isNullOrUndefined(tabMarker)) {
                if (!isNullOrUndefined(RenderedTabElement) && RenderedTabElement.length > 0) {
                    RenderedTabElement.splice(RenderedTabElement.indexOf(tabMarker), 1);
                }
                const value: number = this.position.paragraph.paragraphFormat.bidi ?
                    (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                    : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                if (justification === 'Center' || justification === 'Decimal') {
                    tabMarker.style.left = ((value * zoomFactor) - 4) + 'px';
                }
                else if (justification === 'Right') {
                    tabMarker.style.left = ((value * zoomFactor) - 5.5) + 'px';
                }
                else {
                    tabMarker.style.left = ((value * zoomFactor) - 1.5) + 'px';
                }
            }
            else {
                if (justification !== 'List') {
                    this.renderTab(documentEditor, rulerSize, tabStop, justification, i, locale);
                }
            }
        }
        if (!isNullOrUndefined(RenderedTabElement)) {
            for (let i: number = 0; i < RenderedTabElement.length; i++) {
                const elementToRemove: HTMLElement  = RenderedTabElement[parseInt(i.toString(), 10)];
                if (!isNullOrUndefined(elementToRemove)) {
                    elementToRemove.parentNode.removeChild(elementToRemove);
                }
            }
        }
    }
    private renderRulerMargins(documentEditor: DocumentEditor, isHorizontal: boolean, rulerContainer: HTMLElement): void {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        const height: number = isHorizontal ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x
            : (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.y + rulerSize.height);
        // const margin: string = isHorizontal ? ('margin-left:' + height + 'px;') : ('margin-top:' + height + 'px;');

        //const leftMarginValue = 2112 - (HelperMethods.convertPointToPixel(documentEditor.selection.end.paragraph.bodyWidget.sectionFormat.leftMargin));
        const leftMarginValue: number = 2112 * documentEditor.zoomFactor;
        let rulerMarginDiv: HTMLElement;
        const rulerMargin: string = isHorizontal ? ('margin-left:' + leftMarginValue + 'px;') : ('margin-top:' + leftMarginValue + 'px;');
        const rulerHeight: number = (isHorizontal ? rulerSize.height : (rulerGeometry.height -
            (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
                + documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin) * documentEditor.zoomFactor)));
        // const rulerHeight =  (isHorizontal ? rulerSize.height : rulerGeometry.height);
        if (isHorizontal) {
            for (let i: number = 1; i <= 13; i++) {
                rulerMarginDiv = document.getElementById(documentEditor.element.id + '_hRuler_Margin' + i);
                if (!rulerMarginDiv) {
                    const rulerstyle: string = 'height:' + rulerHeight + 'px;overflow:hidden;width:' +
                        (rulerGeometry.width - (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin + documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) * documentEditor.zoomFactor)) + 'px;position:absolute;' + 'font-size:9px;text-align: left;z-index: -1;display: block' + rulerMargin;
                    const rulerattributes: Object = {
                        'id': documentEditor.element.id + '_hRuler_Margin' + i,
                        style: rulerstyle,
                        class: 'e-de-ruler-margin'
                    };
                    rulerMarginDiv = this.createHtmlElement('div', rulerattributes);
                }
                rulerContainer.appendChild(rulerMarginDiv);
            }
        } else {
            if (!rulerMarginDiv) {
                rulerMarginDiv = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
                const rulerstyle: string = 'height:' + rulerHeight + 'px;overflow:hidden;width:' +
                    rulerSize.width + 'px;position:absolute;' + 'font-size:9px;text-align: left;z-index: -1;' + rulerMargin;
                const rulerattributes: Object = {
                    'id': documentEditor.element.id + '_vRuler_Margin',
                    style: rulerstyle,
                    class: 'e-de-ruler-margin'
                };
                rulerMarginDiv = this.createHtmlElement('div', rulerattributes);
            }
            rulerContainer.appendChild(rulerMarginDiv);
        }
    }
    private updateRulerMargins(documentEditor: DocumentEditor): void {
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        const leftMarginValue: number = (documentEditor.hRuler.zeroPosition) * documentEditor.zoomFactor;
        this.updateHorizontalRulerMargin(documentEditor);
        const verticalRulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
        const rulerMarginDivHeight: number = rulerGeometry.height - (HelperMethods.convertPointToPixel(
            (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin
                * documentEditor.zoomFactor) + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin
                    * documentEditor.zoomFactor)));
        verticalRulerMarginDiv.style.marginTop = leftMarginValue + 'px';
        verticalRulerMarginDiv.style.height = rulerMarginDivHeight + 'px';
    }

    private updateHorizontalRulerMargin(documentEditor: DocumentEditor): void {
        const columns: WColumnFormat[] = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.columns;
        let leftMarginValue: number = (documentEditor.hRuler.zeroPosition) * documentEditor.zoomFactor;
        let skipLoop: boolean = false;
        const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
        let tableBidi: boolean = false;
        const currnLefttMargin: number = HelperMethods.convertPointToPixel(
            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin - 72);
        const currentRightMargin: number = HelperMethods.convertPointToPixel(
            documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin - 72);
        if (this.position.paragraph.isInsideTable) {
            tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
        }
        const rulerMarginDivWidth: number = (this.getRulerGeometry(documentEditor).width -
            (HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin
                * documentEditor.zoomFactor) + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
                    * documentEditor.zoomFactor))));
        if (paraBidi || tableBidi) {
            leftMarginValue = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
        }
        for (let i: number = 0; i < 13; i++) {
            const horizontalRulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_Margin' + (i + 1));
            if (horizontalRulerMarginDiv) {
                if ((columns.length === 0 && !skipLoop) || (documentEditor.layoutType === 'Continuous' && !skipLoop)) {
                    if (paraBidi || tableBidi) {
                        const startValue: number = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
                        horizontalRulerMarginDiv.style.marginLeft = startValue + 'px';
                    } else {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                    }
                    horizontalRulerMarginDiv.style.display = 'block';
                    if (documentEditor.layoutType === 'Continuous') {
                        const paraWidth: number = !isNullOrUndefined(this.position.paragraph['absoluteXPosition']) ? parseFloat(this.position.paragraph['absoluteXPosition']['width'].toString()) : this.position.paragraph.width;
                        horizontalRulerMarginDiv.style.width = (paraWidth * documentEditor.zoomFactor) + 'px';
                    } else {
                        horizontalRulerMarginDiv.style.width = rulerMarginDivWidth + 'px';
                    }
                    skipLoop = true;
                } else if ((columns.length >= i + 1) && documentEditor.layoutType === 'Pages') {
                    if (paraBidi || tableBidi) {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                        leftMarginValue -= ((currnLefttMargin + currentRightMargin) / (columns.length)) * documentEditor.zoomFactor;
                        leftMarginValue = leftMarginValue + (
                            columns[parseInt(i.toString(), 10)].width +
                            columns[parseInt(i.toString(), 10)].space) * documentEditor.zoomFactor;
                    } else {
                        horizontalRulerMarginDiv.style.marginLeft = leftMarginValue + 'px';
                        leftMarginValue -= ((currnLefttMargin + currentRightMargin) / (columns.length)) * documentEditor.zoomFactor;
                        leftMarginValue = leftMarginValue + (
                            columns[parseInt(i.toString(), 10)].width +
                            columns[parseInt(i.toString(), 10)].space) * documentEditor.zoomFactor;
                    }
                    horizontalRulerMarginDiv.style.display = 'block';
                    horizontalRulerMarginDiv.style.width = (columns[parseInt(i.toString(), 10)].width - ((currnLefttMargin + currentRightMargin) / columns.length)) * documentEditor.zoomFactor + 'px';
                } else {
                    horizontalRulerMarginDiv.style.display = 'none';
                }
            }
        }
    }

    public resizeVRulerMargins(isRulerTopMargin: boolean, currentTopMargin: number, currentScrollTop: number, currentBottomMargin: number,
                               ruler: HTMLElement, mousePosition: number, documentEditor: DocumentEditor): void {
        const rulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler_Margin');
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (isRulerTopMargin) {
            rulerMarginDiv.style.height = (rulerGeometry.height - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin * documentEditor.zoomFactor) + mousePosition)).toString() + 'px';

            if (currentTopMargin < mousePosition) {
                ruler.scrollTop = currentScrollTop - HelperMethods.convertPointToPixel(mousePosition - currentTopMargin);
            } else {
                ruler.scrollTop = currentScrollTop + HelperMethods.convertPointToPixel(currentTopMargin - mousePosition);
            }
        } else {
            const bottomMargin: number = HelperMethods.convertPixelToPoint(rulerGeometry.height) - mousePosition;
            rulerMarginDiv.style.height = (rulerGeometry.height - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin * documentEditor.zoomFactor) + (bottomMargin))).toString() + 'px';

            if (currentBottomMargin < mousePosition) {
                //  ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentRightMargin);
            } else {
                //  ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentRightMargin - mousePosition);
            }
        }
    }

    private resizeRulerMargins(isRulerLeftMargin: boolean, currentLeftMargin: number, currentScrollLeft: number, currentRightMargin: number,
                               ruler: HTMLElement, mousePosition: number, isHorizontal: boolean, documentEditor: DocumentEditor): void {
        const rulerMarginDiv: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler_Margin1' : '_vRuler_Margin'));
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        if (!isNullOrUndefined(isRulerLeftMargin) && isRulerLeftMargin) {
            rulerMarginDiv.style.width = (rulerGeometry.width - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor) + mousePosition)).toString() + 'px';

            if (currentLeftMargin < mousePosition) {
                ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentLeftMargin);
            } else {
                ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentLeftMargin - mousePosition);
            }
        } else {
            const rightMargin: number = HelperMethods.convertPixelToPoint(rulerGeometry.width) - mousePosition;
            rulerMarginDiv.style.width = (rulerGeometry.width - HelperMethods.convertPointToPixel((documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin * documentEditor.zoomFactor) + (rightMargin))).toString() + 'px';

            if (currentRightMargin < mousePosition) {
                //  ruler.scrollLeft = currentScrollLeft - HelperMethods.convertPointToPixel(mousePosition - currentRightMargin);
            } else {
                //  ruler.scrollLeft = currentScrollLeft + HelperMethods.convertPointToPixel(currentRightMargin - mousePosition);
            }
        }
    }

    public getRulerOrigin(): void {
        const range: number = 1584;
        const pixelValue: number = HelperMethods.convertPointToPixel(1584);
        //console.log('PixelValue: ', pixelValue);
        //console.log('PointsValue: ', range);
    }


    public renderIndents(documentEditor: DocumentEditor, isHorizontal: boolean, rulerSize: Size, rulerGeometry: Size, locale: L10n): void {
        const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
        let firstLineIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_firstLineIndent');
        if (!firstLineIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) * documentEditor.zoomFactor + 'px;');
            const style: string = 'height:' + ((rulerSize.height - 3) / 2) + 'px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_firstLineIndent',
                style: style,
                'data-name': 'FirstLineIndent',
                class: 'e-de-ruler-indent'
            };
            firstLineIndent = this.createHtmlElement('div', attributes);
            firstLineIndent.setAttribute('title', locale.getConstant('First Line Indent'));
            // let svg: SVGElement;
            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_firstLineIndent_svg',
                width: rulerSize.width + 'px',
                height: ((rulerSize.height - 3) / 2) + 'px',
                style: 'position:inherit;left:0px'
            };
            const svg: SVGElement = this.createSvgElement('svg', attr);
            svg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-indent-svg');
            pathElement.setAttribute('d', 'M 0.5 0.5 H 11.5 V 2.7128 L 6 5.4211 L 0.5 2.7128 V 0.5 Z');
            pathElement.setAttribute('fill', 'white');
            pathElement.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            svg.appendChild(pathElement);
            firstLineIndent.appendChild(svg);
            hRuler.append(firstLineIndent);
            firstLineIndent.addEventListener('dblclick', function (event: MouseEvent): void {
                documentEditor.showDialog('Paragraph');
                event.stopPropagation();
            });
            //Draggable for first line Indent.
            let isDragging: boolean = false;
            let firstLineOffset: number;
            let initialValue: number = HelperMethods.getNumberFromString(firstLineIndent.style.left); // for mouse up event
            const initialValue2: number = HelperMethods.getNumberFromString(firstLineIndent.style.left); // for mouse move event
            firstLineIndent.addEventListener('mouseenter', (e: MouseEvent) => {
                documentEditor.isOnIndent = true;
            });
            firstLineIndent.addEventListener('mouseleave', (e: MouseEvent) => {
                documentEditor.isOnIndent = false;
            });
            firstLineIndent.addEventListener('mousedown', (e: MouseEvent) => {
                isDragging = true;
                firstLineOffset = e.clientX - firstLineIndent.getBoundingClientRect().left;
                initialValue = HelperMethods.getNumberFromString(firstLineIndent.style.left);
                let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                    1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                if (documentEditor.selectionModule.paragraphFormat.bidi) {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                        (documentEditor.selectionModule.sectionFormat.pageWidth -
                            documentEditor.selectionModule.sectionFormat.leftMargin -
                            documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                }
                if (documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - (documentEditor.viewer.clientArea.width  * documentEditor.zoomFactor);
                    }
                }
                const value: number = rulerZeroPoint + e.clientX - firstLineOffset - hRuler.getBoundingClientRect().left;
                let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = indicatorLineValue + 'px';
                lineSvg.style.display = 'block';
                e.stopPropagation();
            });

            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (isDragging) {
                    let rulerZeroPoint: number;
                    let maxValue: number;
                    let minValue: number;
                    const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                    const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                    if (documentEditor.layoutType === 'Pages') {
                        if (documentEditor.selectionModule.paragraphFormat.bidi) {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                                (documentEditor.selectionModule.sectionFormat.pageWidth -
                                    documentEditor.selectionModule.sectionFormat.leftMargin -
                                    documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                            maxValue = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                                documentEditor.selectionModule.sectionFormat.pageWidth) * documentEditor.zoomFactor);
                            minValue = rightIndentValue + HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor;
                        } else {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin)
                                * documentEditor.zoomFactor;
                            minValue = rulerZeroPoint - 6;
                            maxValue = rightIndentValue - HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor;
                        }
                    } else if (documentEditor.layoutType === 'Continuous') {
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                                20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                            maxValue = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20 + 40 - 6;
                            minValue = rightIndentValue + (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        } else {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                            minValue = rulerZeroPoint - 6;
                            maxValue = rightIndentValue - (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        }
                    }
                    let value: number = rulerZeroPoint + e.clientX - firstLineOffset - hRuler.getBoundingClientRect().left;
                    if (value < minValue) {
                        value = minValue;
                    } else if (value > maxValue) {
                        value = maxValue;
                    }
                    firstLineIndent.style.left = value + 'px';
                    let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    let finalValue: number = HelperMethods.getNumberFromString(firstLineIndent.style.left);
                    if (parseInt(firstLineIndent.style.left.replace('px', ''), 10) < 0) {
                        finalValue *= -1;
                    }
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        documentEditor.editorModule.applyRulerMarkerValues('firstLineIndent', finalValue, initialValue);
                    } else {
                        documentEditor.editorModule.applyRulerMarkerValues('firstLineIndent', initialValue, finalValue);
                    }
                    initialValue = finalValue;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }

        //Rendering HangingIndent
        let hangingIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_hangingIndent');
        if (!hangingIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) + 'px;');
            const style: string = 'height:' + (rulerSize.height / 2) + 'px;top:' + (((rulerSize.height - 3) / 2) + 1) + 'px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_hangingIndent',
                style: style,
                'data-name': 'HangingIndent',
                class: 'e-de-ruler-indent'
            };
            hangingIndent = this.createHtmlElement('div', attributes);
            hangingIndent.setAttribute('title', locale.getConstant('Hanging Indent'));
            // let hangingIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_hangingIndent_svg',
                width: rulerSize.width + 'px',
                height: ((rulerSize.height - 3) / 2) + 'px',
                style: 'position:inherit;left:0px'
            };
            const hangingIndentSvg: SVGElement = this.createSvgElement('svg', attr);
            hangingIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-indent-svg');
            pathElement.setAttribute('d', 'M 0.5 5.3211 H 11.5 V 3.1083 L 6 0.4 L 0.5 3.1083 V 5.3211 Z');
            pathElement.setAttribute('fill', 'white');
            pathElement.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            hangingIndentSvg.appendChild(pathElement);
            hangingIndent.appendChild(hangingIndentSvg);
            hRuler.append(hangingIndent);
            hangingIndent.addEventListener('dblclick', function (event: MouseEvent): void{
                documentEditor.showDialog('Paragraph');
                event.stopPropagation();
            });
            //Draggable for hanging line Indent.
            let isDragging: boolean = false;
            let hangingLineOffset: number;
            let initialValue: number = HelperMethods.getNumberFromString(hangingIndent.style.left); // for mouse up event
            const initialValue2: number = HelperMethods.getNumberFromString(hangingIndent.style.left); // for mouse move event
            let minLimit: number;
            let maxLimit: number;
            let leftIndent: HTMLElement;
            hangingIndent.addEventListener('mouseenter', (e: MouseEvent) => {
                documentEditor.isOnIndent = true;
            });
            hangingIndent.addEventListener('mouseleave', (e: MouseEvent) => {
                documentEditor.isOnIndent = false;
            });
            hangingIndent.addEventListener('mousedown', (e: MouseEvent) => {
                isDragging = true;
                hangingLineOffset = e.clientX - hangingIndent.getBoundingClientRect().left;
                initialValue = HelperMethods.getNumberFromString(hangingIndent.style.left);
                const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                const rightPosition: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                let rulerZeroPoint: number;
                if (documentEditor.layoutType === 'Pages') {
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        rulerZeroPoint = HelperMethods.convertPointToPixel(
                            1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                            (documentEditor.selectionModule.sectionFormat.pageWidth -
                                documentEditor.selectionModule.sectionFormat.leftMargin -
                                documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                        minLimit = rightPosition + (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        maxLimit = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                            documentEditor.selectionModule.sectionFormat.pageWidth) * documentEditor.zoomFactor);
                    } else {
                        rulerZeroPoint = HelperMethods.convertPointToPixel(
                            1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                        minLimit = rulerZeroPoint - 6;
                        maxLimit = (rightPosition - HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                    }
                } else if (documentEditor.layoutType === 'Continuous') {
                    if (this.position.paragraph.paragraphFormat.bidi) {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                        20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        maxLimit = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20 + 40 - 6;
                        minLimit = rightPosition + (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                    } else {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        minLimit = rulerZeroPoint - 6;
                        maxLimit = (rightPosition - HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                    }
                }
                leftIndent = document.getElementById(documentEditor.element.id + '_leftIndent');
                const value: number = rulerZeroPoint + e.clientX - hangingLineOffset - hRuler.getBoundingClientRect().left;
                let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = indicatorLineValue + 'px';
                lineSvg.style.display = 'block';
                e.stopPropagation();
            });

            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (isDragging) {
                    let rulerZeroPoint: number;
                    if (documentEditor.layoutType === 'Pages') {
                        if (documentEditor.selectionModule.paragraphFormat.bidi) {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                                (documentEditor.selectionModule.sectionFormat.pageWidth -
                                    documentEditor.selectionModule.sectionFormat.leftMargin -
                                    documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                        } else {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                        }
                    } else if (documentEditor.layoutType === 'Continuous') {
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                                20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        } else {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        }
                    }
                    let value: number = rulerZeroPoint + e.clientX - hangingLineOffset - hRuler.getBoundingClientRect().left;
                    if ((value) > maxLimit) {
                        value = maxLimit;
                    } else if (value < minLimit) {
                        value = minLimit;
                    }
                    leftIndent.style.left = value + 'px';
                    hangingIndent.style.left = value + 'px';
                    let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    let finalValue: number = HelperMethods.getNumberFromString(hangingIndent.style.left);
                    if (parseInt(hangingIndent.style.left.replace('px', ''), 10) < 0) {
                        finalValue *= -1;
                    }
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        documentEditor.editorModule.applyRulerMarkerValues('hangingIndent', finalValue, initialValue);
                    } else {
                        documentEditor.editorModule.applyRulerMarkerValues('hangingIndent', initialValue, finalValue);
                    }
                    initialValue = finalValue;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }

        //Rendering LeftIndent
        let leftIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_leftIndent');
        if (!leftIndent) {
            const margin: string = ('left:' + (HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin) - 6) + 'px;');
            const style: string = 'height:4px;top:11px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 5;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_leftIndent',
                style: style,
                class: 'e-de-ruler-indent'
            };
            leftIndent = this.createHtmlElement('div', attributes);
            leftIndent.setAttribute('title', locale.getConstant('Left Indent'));
            // let leftIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_leftIndent_svg',
                width: rulerSize.width + 'px',
                height: '4px',
                style: 'position:inherit;left:0px'
            };
            const leftIndentSvg: SVGElement = this.createSvgElement('svg', attr);
            leftIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-indent-svg');
            pathElement.setAttribute('d', 'M 0.5 3.5 H 11.5 V 0.5 H 0.5 V 3.5 Z');
            pathElement.setAttribute('fill', 'white');
            pathElement.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            leftIndentSvg.appendChild(pathElement);
            leftIndent.appendChild(leftIndentSvg);
            hRuler.append(leftIndent);
            leftIndent.addEventListener('dblclick', function (event: MouseEvent): void {
                documentEditor.showDialog('Paragraph');
                event.stopPropagation();
            });
            //Draggable for left line Indent.
            let isDragging: boolean = false;
            let leftLineOffset: number;
            let initialValue: number = HelperMethods.getNumberFromString(leftIndent.style.left); // for mouse down event
            const initialValue2: number = HelperMethods.getNumberFromString(leftIndent.style.left); // for mouse move event
            let firstIndentInitialValue: number;

            let diff: number;
            let minLimit: number;
            let maxLimit: number;
            let isHangingIndent: boolean;
            leftIndent.addEventListener('mouseenter', (e: MouseEvent) => {
                documentEditor.isOnIndent = true;
            });
            leftIndent.addEventListener('mouseleave', (e: MouseEvent) => {
                documentEditor.isOnIndent = false;
            });
            leftIndent.addEventListener('mousedown', (e: MouseEvent) => {
                let rulerZeroPoint: number;
                isDragging = true;
                leftLineOffset = e.clientX - leftIndent.getBoundingClientRect().left;
                initialValue = HelperMethods.getNumberFromString(leftIndent.style.left);
                firstIndentInitialValue = HelperMethods.getNumberFromString(firstLineIndent.style.left);
                diff = firstIndentInitialValue - initialValue;
                firstLineIndent = document.getElementById(documentEditor.element.id + '_firstLineIndent');
                const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                const rightPosition: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                if (documentEditor.layoutType === 'Pages') {
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        rulerZeroPoint = HelperMethods.convertPointToPixel(
                            1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                            (documentEditor.selectionModule.sectionFormat.pageWidth -
                                documentEditor.selectionModule.sectionFormat.leftMargin -
                                documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                        minLimit = (rightPosition + HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        maxLimit = rulerZeroPoint - 6 + (HelperMethods.convertPointToPixel(
                            documentEditor.selectionModule.sectionFormat.pageWidth) * documentEditor.zoomFactor);
                        isHangingIndent = (HelperMethods.getNumberFromString(hangingIndent.style.left) - rightPosition)
                        <= (HelperMethods.getNumberFromString(firstLineIndent.style.left) - rightPosition);
                    } else {
                        rulerZeroPoint = HelperMethods.convertPointToPixel(
                            1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                        minLimit = rulerZeroPoint - 6;
                        maxLimit = (rightPosition - HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        isHangingIndent = (rightPosition - HelperMethods.getNumberFromString(hangingIndent.style.left))
                            <= (rightPosition - HelperMethods.getNumberFromString(firstLineIndent.style.left));
                    }
                } else if (documentEditor.layoutType === 'Continuous') {
                    if (this.position.paragraph.paragraphFormat.bidi) {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                            20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        maxLimit = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20 + 40 - 6;
                        minLimit = rightPosition + (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        isHangingIndent = (HelperMethods.getNumberFromString(hangingIndent.style.left) - rightPosition)
                            <= (HelperMethods.getNumberFromString(firstLineIndent.style.left) - rightPosition);
                    } else {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        minLimit = rulerZeroPoint - 6;
                        maxLimit = (rightPosition - HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        isHangingIndent = (rightPosition - HelperMethods.getNumberFromString(hangingIndent.style.left))
                            <= (rightPosition - HelperMethods.getNumberFromString(firstLineIndent.style.left));
                    }
                }
                const value: number = rulerZeroPoint + e.clientX - leftLineOffset - hRuler.getBoundingClientRect().left;
                let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = indicatorLineValue + 'px';
                lineSvg.style.display = 'block';
                e.stopPropagation();
            });

            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (isDragging) {
                    let rulerZeroPoint: number;
                    let value: number;
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        if (documentEditor.layoutType === 'Pages') {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                                (documentEditor.selectionModule.sectionFormat.pageWidth -
                                    documentEditor.selectionModule.sectionFormat.leftMargin
                                    - documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                        } else if (documentEditor.layoutType === 'Continuous') {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                                20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        }
                        value = rulerZeroPoint + e.clientX - leftLineOffset - hRuler.getBoundingClientRect().left;
                        if (isHangingIndent) {
                            if ((value + diff) > maxLimit) {
                                value = maxLimit - diff;
                            }
                        } else {
                            if ((value) > maxLimit) {
                                value = maxLimit;
                            }
                        }
                        if (isHangingIndent) {
                            if (value < minLimit) {
                                value = minLimit;
                            }
                        } else {
                            if ((value + diff) < minLimit) {
                                value = minLimit - diff;
                            }
                        }
                    } else {
                        if (documentEditor.layoutType === 'Pages') {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                        } else if (documentEditor.layoutType === 'Continuous') {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        }
                        value = rulerZeroPoint + e.clientX - leftLineOffset - hRuler.getBoundingClientRect().left;
                        if (isHangingIndent) {
                            if ((value) > maxLimit) {
                                value = maxLimit;
                            }
                        } else {
                            if ((value + diff) > maxLimit) {
                                value = maxLimit - diff;
                            }
                        }
                        if (isHangingIndent) {
                            if ((value + diff) < minLimit) {
                                value = minLimit - diff;
                            }
                        } else {
                            if (value < minLimit) {
                                value = minLimit;
                            }
                        }
                    }
                    hangingIndent.style.left = value + 'px';
                    leftIndent.style.left = value + 'px';
                    firstLineIndent.style.left = (firstIndentInitialValue + (value - initialValue)) + 'px';
                    let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    let finalValue: number = HelperMethods.getNumberFromString(leftIndent.style.left);
                    if (parseInt(leftIndent.style.left.replace('px', ''), 10) < 0) {
                        finalValue *= -1;
                    }
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        documentEditor.editorModule.applyRulerMarkerValues('leftIndent', finalValue, initialValue);
                    } else {
                        documentEditor.editorModule.applyRulerMarkerValues('leftIndent', initialValue, finalValue);
                    }
                    initialValue = finalValue;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }
        //Rendering RightIndent
        let rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
        if (!rightIndent) {
            const margin: string = ('left:' + (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.width - HelperMethods.convertPointToPixel(documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin) - 6) + 'px;');
            const style: string = 'height:7px;top:8px;overflow:hidden;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_rightIndent',
                style: style,
                class: 'e-de-ruler-indent'
            };
            rightIndent = this.createHtmlElement('div', attributes);
            rightIndent.setAttribute('title', locale.getConstant('Right Indent'));
            // let rightIndentSvg: SVGElement;

            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_rightIndent_svg',
                width: rulerSize.width + 'px',
                height: '7px',
                style: 'position:inherit;left:0px'
            };
            const rightIndentSvg: SVGElement = this.createSvgElement('svg', attr);
            rightIndentSvg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-indent-svg');
            pathElement.setAttribute('d', 'M 0.5 6.5 H 11.5 V 4.2872 L 6 1.5789 L 0.5 4.2872 V 6.5 Z');
            pathElement.setAttribute('fill', 'white');
            pathElement.setAttribute('stroke', '#A1A1A1');
            // Append the path element to the SVG element
            rightIndentSvg.appendChild(pathElement);
            rightIndent.appendChild(rightIndentSvg);
            hRuler.append(rightIndent);
            rightIndent.addEventListener('dblclick', function (event: MouseEvent): void {
                documentEditor.showDialog('Paragraph');
                event.stopPropagation();
            });
            //Draggable for left line Indent.
            let isDragging: boolean = false;
            let rightLineOffset: number;
            let initialValue: number = HelperMethods.getNumberFromString(rightIndent.style.left); // for mouse down event
            const initialValue2: number = HelperMethods.getNumberFromString(rightIndent.style.left); // for mouse move event
            rightIndent.addEventListener('mouseenter', (e: MouseEvent) => {
                documentEditor.isOnIndent = true;
            });
            rightIndent.addEventListener('mouseleave', (e: MouseEvent) => {
                documentEditor.isOnIndent = false;
            });
            rightIndent.addEventListener('mousedown', (e: MouseEvent) => {
                isDragging = true;
                rightLineOffset = e.clientX - rightIndent.getBoundingClientRect().left;
                initialValue = HelperMethods.getNumberFromString(rightIndent.style.left);
                let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                    1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                if (documentEditor.selectionModule.paragraphFormat.bidi) {
                    rulerZeroPoint = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                        (documentEditor.selectionModule.sectionFormat.pageWidth - documentEditor.selectionModule.sectionFormat.leftMargin -
                            documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                }
                if (documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                            20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                    }
                }
                const value: number = rulerZeroPoint + e.clientX - rightLineOffset - hRuler.getBoundingClientRect().left;
                let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = indicatorLineValue + 'px';
                lineSvg.style.display = 'block';
                e.stopPropagation();
            });

            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (isDragging) {
                    let rulerZeroPoint: number;
                    let value: number;
                    const leftIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_leftIndent');
                    const firstLineIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_firstLineIndent');
                    let maxValue: number;
                    let minValue: number;
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        if (documentEditor.layoutType === 'Pages') {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin -
                                (documentEditor.selectionModule.sectionFormat.pageWidth -
                                    documentEditor.selectionModule.sectionFormat.leftMargin -
                                    documentEditor.selectionModule.sectionFormat.rightMargin)) * documentEditor.zoomFactor;
                        } else if (documentEditor.layoutType === 'Continuous') {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor)
                                - 20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        }
                        value = rulerZeroPoint + e.clientX - rightLineOffset - hRuler.getBoundingClientRect().left;
                        const nearestElement: HTMLElement = (HelperMethods.getNumberFromString(
                            leftIndent.style.left) - value) <= (HelperMethods.getNumberFromString(
                            firstLineIndent.style.left) - value) ? leftIndent : firstLineIndent;
                        const indentValue: number = HelperMethods.getNumberFromString(nearestElement.style.left);
                        maxValue = indentValue - (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                        minValue = rulerZeroPoint - 6;
                    } else {
                        if (documentEditor.layoutType === 'Pages') {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                        } else if (documentEditor.layoutType === 'Continuous') {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        }
                        value = rulerZeroPoint + e.clientX - rightLineOffset - hRuler.getBoundingClientRect().left;
                        const nearestElement: HTMLElement = (value - HelperMethods.getNumberFromString(leftIndent.style.left))
                            <= (value - HelperMethods.getNumberFromString(firstLineIndent.style.left)) ? leftIndent : firstLineIndent;
                        const indentValue: number = HelperMethods.getNumberFromString(nearestElement.style.left);
                        maxValue = rulerZeroPoint + (documentEditor.documentHelper.currentPage.boundingRectangle.width
                            * documentEditor.zoomFactor) - 6;
                        minValue = indentValue + (HelperMethods.convertPointToPixel(42) * documentEditor.zoomFactor);
                    }
                    if (value < minValue) {
                        value = minValue;
                    } else if (value > maxValue) {
                        value = maxValue;
                    }
                    rightIndent.style.left = value + 'px';
                    let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    const finalValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                    if (documentEditor.selectionModule.paragraphFormat.bidi) {
                        documentEditor.editorModule.applyRulerMarkerValues('rightIndent', initialValue, finalValue);
                    } else {
                        documentEditor.editorModule.applyRulerMarkerValues('rightIndent', finalValue, initialValue);
                    }
                    initialValue = finalValue;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }
        this.updateIndentMarkers(documentEditor);
    }

    /**
     * updateRuler method
     *
     * @returns {void} updateRuler method.
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {boolean} rerenderRuler - provide the rerenderRuler  value.
     * @private
     */
    public updateRuler(documentEditor: DocumentEditor, rerenderRuler: boolean): void {
        if (documentEditor.rulerHelper && documentEditor.documentEditorSettings && !documentEditor.documentEditorSettings.showRuler ||
            documentEditor.isReadOnlyMode) {
            return;
        }
        // const hOffset: number = - documentEditor.scroller.horizontalOffset;
        // const vOffset: number = - documentEditor.scroller.verticalOffset;
        const hOffset: number = 0;
        // const vOffset: number = - documentEditor.scroller.verticalOffset;
        if (isNullOrUndefined(documentEditor.hRuler) && isNullOrUndefined(documentEditor.vRuler)) {
            return;
        }
        if (documentEditor.selectionModule.isForward) {
            this.position = documentEditor.selectionModule.start;
        } else {
            this.position = documentEditor.selectionModule.end;
        }
        this.updateRulerDimension(documentEditor, documentEditor.hRuler, hOffset, rerenderRuler);
        this.updateRulerDimension(documentEditor, documentEditor.vRuler, hOffset, rerenderRuler);
        this.updateRulerMargins(documentEditor);
        this.updateIndentMarkers(documentEditor);
        this.updateTabStopMarkers(documentEditor);
        if (this.position.paragraph.isInsideTable) {
            this.updateTableMarkers(documentEditor, documentEditor.hRuler);
        } else {
            this.removeTableMarkers(documentEditor, documentEditor.hRuler);
        }
        this.updateIndicatorLines(documentEditor);
    }


    private removeTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        const renderedTableMarkers: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-table-marker'));
        if (!isNullOrUndefined(renderedTableMarkers)) {
            for (let i: number = 0; i < renderedTableMarkers.length; i++) {
                const elementToRemove: HTMLElement = renderedTableMarkers[parseInt(i.toString(), 10)];
                if (!isNullOrUndefined(elementToRemove)) {
                    elementToRemove.parentNode.removeChild(elementToRemove);
                }
            }
        }
    }

    private updateTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        const renderedTableMarkers: HTMLElement[] = HelperMethods.convertNodeListToArray(document.querySelectorAll('.e-de-ruler-table-marker'));
        if (isNullOrUndefined(renderedTableMarkers)) {
            // const tablewidget: TableWidget =
            // ((documentEditor.selection.end.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
            // const tableColumns = ((documentEditor.selection.end.paragraph.containerWidget as TableCellWidget).ownerTable
            //  as TableWidget).tableHolder.columns.length;
            // const tableXPos: number = undefined;
            // const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
            this.renderTableMarkers(documentEditor, ruler);
        } else if (this.position.paragraph.isInsideTable) {
            this.renderTableMarkers(documentEditor, ruler);
        }

    }
    private renderTableMarkers(documentEditor: DocumentEditor, ruler: Ruler): void {
        this.removeTableMarkers(documentEditor, documentEditor.hRuler);
        let intialPosition: number;
        const tablewidget: TableWidget = ((this.position.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
        const tableRowWidget: TableRowWidget = (
            (this.position.paragraph.associatedCell as TableCellWidget).ownerRow as TableRowWidget).clone();
        const cellWidgets: IWidget[] = tableRowWidget.childWidgets;
        let value: number = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi ? cellWidgets.length : 0;
        if (this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
            cellWidgets.reverse();
        }
        let tableXPos: number;
        const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
        for (let i: number = 0; i <= cellWidgets.length; i++) {
            let tableMarker: HTMLElement = document.getElementById(documentEditor.element.id + '_tableMarker_' + value);
            //if (!tableMarker) {
            let margin: string;
            if (i === 0) {
                tableXPos = ((cellWidgets[parseInt(i.toString(), 10)] as TableCellWidget).x
                    - (cellWidgets[parseInt(i.toString(), 10)] as TableCellWidget).margin.left)
                    * documentEditor.zoomFactor + hRuler.scrollLeft;
                margin = ('left:' + (tableXPos - 4) + 'px;');
            }
            else {
                tableXPos = tableXPos + (((cellWidgets[i - 1] as TableCellWidget).width
                + (cellWidgets[i - 1] as TableCellWidget).margin.left
                + (cellWidgets[i - 1] as TableCellWidget).margin.right) * documentEditor.zoomFactor);
                margin = 'left:' + (tableXPos - 4) + 'px;';
            }
            const style: string = 'height:' + (ruler.thickness) + 'px;overflow:hidden;width:10px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
            const attributes: Object = {
                'id': documentEditor.element.id + '_tableMarker_' + value,
                'class': 'e-de-ruler-table-marker',
                style: style
            };
            tableMarker = this.createHtmlElement('div', attributes);
            const locale: L10n = new L10n('documenteditor', documentEditor.defaultLocale);
            tableMarker.setAttribute('title', locale.getConstant('Move Table Column'));
            // Create an SVG element
            const attr: Object = {
                'id': documentEditor.element.id + '_tableMarker_svg' + i,
                width: 9 + 'px',
                height: 11 + 'px',
                style: 'position:inherit;left:0px;top:3px;'
            };
            const svg: SVGElement = this.createSvgElement('svg', attr);
            svg.setAttribute('fill', 'none');
            const pathattr: Object = {
                style: 'position:inherit;left:0px;'
            };
            // Create a path element inside the SVG
            const pathElement: SVGElement = this.createSvgElement('path', pathattr);
            pathElement.setAttribute('class', 'e-de-ruler-table-svg');
            pathElement.setAttribute('d', 'M1 1V0H2V1H3V0H4V1H5V0H6V1H7V2H6V3H7V4H6V5H7V6H6V7H7V8H0V7H1V6H0V5H1V4H0V3H1V2H0V1H1ZM2 2V3H3V2H2ZM4 2V3H5V2H4ZM5 4H4V5H5V4ZM5 6H4V7H5V6ZM3 7V6H2V7H3ZM2 5H3V4H2V5Z');
            pathElement.setAttribute('fill', '#A1A1A1');
            // Append the path element to the SVG element
            svg.appendChild(pathElement);
            tableMarker.appendChild(svg);
            hRuler.append(tableMarker);
            // }
            if (this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
                value--;
            } else {
                value++;
            }
            tableMarker.addEventListener('dblclick', function (event: MouseEvent) : void {
                documentEditor.showDialog('TableProperties');
                event.stopPropagation();
            });

            let tableMarkerOffset: number;

            tableMarker.addEventListener('mousedown', (e: MouseEvent) => {
                tableMarkerOffset = e.clientX - tableMarker.getBoundingClientRect().left;
                documentEditor.startXPosition = HelperMethods.convertPixelToPoint(e.clientX);
                documentEditor.isTableMarkerDragging = true;
                const cursorPoint: Point = new Point(e.clientX, e.clientY);
                const touchPoint: Point = documentEditor.viewer.findFocusedPage(cursorPoint, true, true);
                let currentMarkerPostion: number;
                if (e.currentTarget instanceof HTMLElement) {
                    const parts: string[] = e.currentTarget.id.split('_');
                    const value: string = parts[parts.length - 1];
                    currentMarkerPostion = parseInt(value, 10);
                }
                const tableWidget: TableWidget = (
                    (documentEditor.selectionModule.end.paragraph.containerWidget as TableCellWidget).ownerTable as TableWidget);
                documentEditor.editorModule.tableResize.currentResizingTable = tableWidget;
                documentEditor.editorModule.tableResize.resizeNode = 0;
                documentEditor.editorModule.tableResize.resizerPosition = currentMarkerPostion;
                documentEditor.editorModule.tableResize.startingPoint.x = touchPoint.x;
                documentEditor.editorModule.tableResize.startingPoint.y = touchPoint.y;
                documentEditor.editorHistoryModule.initResizingHistory(touchPoint, documentEditor.editorModule.tableResize);

                const rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                    1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                const value: number = rulerZeroPoint + e.clientX - tableMarkerOffset - hRuler.getBoundingClientRect().left;
                const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = (indicatorLineValue - 6) + 'px';
                lineSvg.style.display = 'block';
            });
            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                if (documentEditor.isTableMarkerDragging) {
                    const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
                    let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                        1584 - documentEditor.selectionModule.sectionFormat.leftMargin) * documentEditor.zoomFactor;
                    if (documentEditor.selectionModule.end.paragraph.associatedCell.ownerTable.tableFormat.bidi) {
                        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
                        const rulerMarginDivWidth: number = (rulerGeometry.width - (HelperMethods.convertPointToPixel(
                            (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor)
                            + (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin
                                * documentEditor.zoomFactor))));
                        rulerZeroPoint -= rulerMarginDivWidth;
                    }
                    const value: number = rulerZeroPoint + e.clientX - tableMarkerOffset - hRuler.getBoundingClientRect().left;
                    tableMarker.style.left = value + 'px';

                    const startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = (indicatorLineValue - 6) + 'px';
                }
            });
            document.addEventListener('mouseup', (e: MouseEvent) => {
                if (documentEditor.isDestroyed || !documentEditor.documentEditorSettings.showRuler) {
                    return;
                }
                if (documentEditor.isTableMarkerDragging) {
                    const cursorPoint: Point = new Point(e.clientX, e.clientY);
                    const dragValue: number = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi ?
                        (documentEditor.startXPosition - HelperMethods.convertPixelToPoint(e.clientX))
                        : (HelperMethods.convertPixelToPoint(e.clientX) - documentEditor.startXPosition);
                    documentEditor.editorModule.tableResize.handleResizing(cursorPoint, true, (dragValue / documentEditor.zoomFactor));
                    documentEditor.editorModule.tableResize.updateResizingHistory(
                        documentEditor.viewer.findFocusedPage(cursorPoint, true, true));
                    documentEditor.isTableMarkerDragging = false;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                }
            });
        }
    }

    /**
     * updateRulerDimension method \
     *
     * @returns {void} updateRulerDimension method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Ruler} ruler - provide the content  value.
     * @param {number} offset - provide the content  value.
     * @param {boolean} rerenderRuler - provide the rerenderRuler  value.
     * @private
     */
    private updateRulerDimension(documentEditor: DocumentEditor, ruler: Ruler, offset: number, rerenderRuler: boolean): void {
        const isHorizontal: boolean = ruler.orientation === 'Horizontal' ? true : false;
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const rulerGeometry: Size = this.getRulerGeometry(documentEditor);
        //const documentEditorRuler: DocumentEditorRulerModel = isHorizontal ? documentEditor.documentEditorSettings.rulerSettings.horizontalRuler : documentEditor.documentEditorSettings.rulerSettings.verticalRuler;
        this.updateRulerDiv(documentEditor, rulerGeometry, isHorizontal, ruler);
        this.updateRulerSpace(documentEditor, rulerGeometry, isHorizontal, ruler);
        this.updateMargin(ruler, documentEditor, isHorizontal);
        // ruler.pageWidth = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.width * documentEditor.zoomFactor;
        // ruler.pageHeight = documentEditor.selection.end.paragraph.bodyWidget.page.boundingRectangle.height * documentEditor.zoomFactor;
        ruler.length = documentEditor.zoomFactor < 1 ?
            ((ruler.zeroPosition * 2) / documentEditor.zoomFactor)
            : ((ruler.zeroPosition * 2) * documentEditor.zoomFactor);
        const rulerObj: HTMLElement = ruler.element;
        if (isHorizontal) {
            rulerObj.style.marginLeft = (documentEditor.layoutType === 'Pages' ? documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.x : 0) + 'px';
        } else {
            rulerObj.parentElement.style.display = documentEditor.layoutType === 'Pages' ? 'block' : 'none';
            rulerObj.style.marginTop = documentEditor.selectionModule.getPageTop(documentEditor.selectionModule.end.paragraph.bodyWidget.page) + 'px';
        }
        if (rerenderRuler) {
            ruler.offset = offset;
            ruler.scale = documentEditor.zoomFactor;
            // if (documentEditor.layoutType === 'Pages') {
            ruler.length = documentEditor.zoomFactor < 1 ?
                ((ruler.zeroPosition * 2) / documentEditor.zoomFactor)
                : ((ruler.zeroPosition * 2) * documentEditor.zoomFactor);
            // } else if (documentEditor.layoutType === 'Continuous') {
            //     ruler.length = (ruler.zeroPosition * 2) / documentEditor.zoomFactor;
            // }
            ruler.updateRuler();
        }
        if (isHorizontal) {
            if (documentEditor.layoutType === 'Pages') {
                const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
                let tableBidi: boolean = false;
                if (this.position.paragraph.isInsideTable) {
                    tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
                }
                if (paraBidi || tableBidi) {
                    const rulerMarginDivWidth: number = (rulerGeometry.width - (HelperMethods.convertPointToPixel(
                        (documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin * documentEditor.zoomFactor))));
                    rulerObj.scrollLeft = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - rulerMarginDivWidth;
                } else {
                    rulerObj.scrollLeft = (ruler.zeroPosition - HelperMethods.convertPointToPixel(
                        documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin)) * documentEditor.zoomFactor;
                }
            } else {
                const paraBidi: boolean = this.position.paragraph.paragraphFormat.bidi;
                let tableBidi: boolean = false;
                if (this.position.paragraph.isInsideTable) {
                    tableBidi = this.position.paragraph.associatedCell.ownerTable.tableFormat.bidi;
                }
                if (paraBidi || tableBidi) {
                    // const rulerMarginDivWidth = (rulerGeometry.width - 40);
                    rulerObj.scrollLeft = ((ruler.zeroPosition - documentEditor.viewer.clientActiveArea.width)
                        * documentEditor.zoomFactor) - 20;
                } else {
                    // 20 is set approximately to the web layout.
                    rulerObj.scrollLeft = (ruler.zeroPosition * documentEditor.zoomFactor) - 20;
                }
            }
        } else {
            rulerObj.scrollTop = (ruler.zeroPosition - HelperMethods.convertPointToPixel(
                documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin)) * documentEditor.zoomFactor;
        }
    }


    /**
     * updateRulerSpace method \
     *
     * @returns {void} updateRulerDiv method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Size} rulerGeometry - provide the content  value.
     * @param {boolean} isHorizontal - provide the content  value.
     * @param {Ruler} ruler - provide the ruler  value.
     * @private
     */
    private updateRulerSpace(documentEditor: DocumentEditor, rulerGeometry: Size, isHorizontal: boolean, ruler: Ruler): void {
        const div: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler_ruler_space' : '_vRuler_ruler_space'));
        if (div && documentEditor && rulerGeometry) {
            div.style.width = (isHorizontal ? (rulerGeometry.width + (ruler.segmentWidth * 2)) : ruler.thickness) + 'px';
            div.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + (ruler.segmentWidth * 2))) + 'px';
        }
    }


    /**
     * updateRulerDiv method \
     *
     * @returns {void} updateRulerDiv method .\
     * @param {DocumentEditor} documentEditor - provide the documentEditor  value.
     * @param {Size} rulerGeometry - provide the content  value.
     * @param {boolean} isHorizontal - provide the content  value.
     * @param {Ruler} ruler - provide the ruler  value.
     * @private
     */
    public updateRulerDiv(documentEditor: DocumentEditor, rulerGeometry: Size, isHorizontal: boolean, ruler: Ruler): void {
        // parent div
        let div: HTMLElement = document.getElementById(documentEditor.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
        if (div && documentEditor && rulerGeometry) {
            div.style.width = (isHorizontal ? documentEditor.layoutType === 'Continuous' ? rulerGeometry.width / documentEditor.zoomFactor : rulerGeometry.width : ruler.thickness) + 'px';
            div.style.height = (isHorizontal ? ruler.thickness : rulerGeometry.height) + 'px';
            div = document.getElementById(documentEditor.element.id + '_overlapRuler');
            if (div) {
                // eslint-disable-next-line
                isHorizontal ? (div.style.height === ruler.thickness + 'px') : (div.style.width === ruler.thickness + 'px');
            }
        }
        if (isHorizontal) {
            if (this.hRulerBottom) {
                const pageElement: HTMLElement = document.getElementById(documentEditor.element.id + '_pageContainer');
                this.hRulerBottom.style.width = pageElement.getBoundingClientRect().width + 'px';
            }
        }
        // let vRulerDiv: HTMLElement = document.getElementById(documentEditor.element.id + '_vRuler');
        // if (vRulerDiv) {
        //     vRulerDiv.style.width = ruler.thickness + 'px';
        //     vRulerDiv.style.height =  rulerGeometry.height + 'px';
        // }
    }

    /**
     * getRulerGeometry method \
     *
     * @returns {void} getRulerGeometry method .\
     * @param { DocumentEditor} documentEditor - provide the documentEditor  value.
     * @private
     */
    private getRulerGeometry(documentEditor: DocumentEditor): Size {
        const rulerSize: Size = this.getRulerSize(documentEditor);
        const height: number = (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.height
            * documentEditor.zoomFactor);
        const width: number = (documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.width
            * documentEditor.zoomFactor);
        return new Size(width, height);
    }

    private getVerticalHeight(documentEditor: DocumentEditor): number {
        const pageheight: number = HelperMethods.convertPixelToPoint(
            documentEditor.selectionModule.end.paragraph.bodyWidget.page.boundingRectangle.height);
        const containerHeight: number = documentEditor.element.getBoundingClientRect().height;
        if (pageheight < containerHeight) {
            return pageheight;
        } else {
            return containerHeight - documentEditor.documentHelper.pages[0].boundingRectangle.y;
        }
    }

    public renderTab(documentEditor: DocumentEditor, rulerSize: Size, tabStop: WTabStop, tabJustification: TabJustification,
                     i: number, locale?: L10n): void {
        const hRuler: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler');
        const zoomFactor: number = documentEditor.documentHelper.zoomFactor;
        let value: number;
        switch (tabJustification) {
        case 'Left': {
            let leftTab: HTMLElement = document.getElementById(documentEditor.element.id + '_LeftTab' + '_' + i);
            if (!leftTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 1.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_LeftTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-left',
                    style: style,
                    'data-name': 'LeftTab'
                };
                leftTab = this.createHtmlElement('div', attributes);
                leftTab.setAttribute('title', locale.getConstant('Left Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_leftTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                    // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M3 5H7V7H1V1H3V5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                leftTab.appendChild(svg);
                hRuler.append(leftTab);
            }
            break;
        }
        case 'Center': {
            let centerTab: HTMLElement = document.getElementById(documentEditor.element.id + '_CenterTab' + '_' + i);
            if (!centerTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 4) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_CenterTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-center',
                    style: style,
                    'data-name': 'CenterTab'
                };
                centerTab = this.createHtmlElement('div', attributes);
                centerTab.setAttribute('title', locale.getConstant('Center Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_centerTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                    // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M5 5H8V7H0V5H3V1H5V5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                centerTab.appendChild(svg);
                hRuler.append(centerTab);
            }
            break;
        }
        case 'Right': {
            let rightTab: HTMLElement = document.getElementById(documentEditor.element.id + '_RightTab' + '_' + i);
            if (!rightTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 5.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_RightTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-right',
                    style: style,
                    'data-name': 'RightTab'
                };
                rightTab = this.createHtmlElement('div', attributes);
                rightTab.setAttribute('title', locale.getConstant('Right Tab'));
                // let svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_rightTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                    // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M5 5V1H7V7H1V5H5Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                rightTab.appendChild(svg);
                hRuler.append(rightTab);
            }
            break;
        }
        case 'Decimal': {
            let decimalTab: HTMLElement = document.getElementById(documentEditor.element.id + '_DecimalTab' + '_' + i);
            if (!decimalTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value * zoomFactor) - 4) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_DecimalTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-decimal',
                    style: style,
                    'data-name': 'DecimalTab'
                };
                decimalTab = this.createHtmlElement('div', attributes);
                decimalTab.setAttribute('title', locale.getConstant('Decimal Tab'));
                // const svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_decimalTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const pathattr: Object = {
                    style: 'position:inherit;left:0px'
                };
                    // Create a path element inside the SVG
                const pathElement: SVGElement = this.createSvgElement('path', pathattr);
                pathElement.setAttribute('class', 'e-de-ruler-tab-svg');
                pathElement.setAttribute('d', 'M6 0H4V6H0V8H4H6H10V6H6V0Z');
                pathElement.setAttribute('fill', '#605E5C');
                pathElement.setAttribute('clip-rule', 'evenodd');
                pathElement.setAttribute('fill-rule', 'evenodd');
                pathElement.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(pathElement);
                decimalTab.appendChild(svg);
                hRuler.append(decimalTab);
            }
            break;
        }
        case 'Bar': {
            let barTab: HTMLElement = document.getElementById(documentEditor.element.id + '_BarTab' + '_' + i);
            if (!barTab) {
                let style: string = '';
                if (!isNullOrUndefined(tabStop)) {
                    value = this.position.paragraph.paragraphFormat.bidi ?
                        (HelperMethods.convertPointToPixel(1584 - tabStop.position))
                        : (HelperMethods.convertPointToPixel(1584 + tabStop.position));
                    const margin: string = ('left:' + ((value - 1.5) * zoomFactor) + 'px;');
                    style = 'height:9px;overflow:hidden;top:7px;width:12px;position:absolute;font-size:11px;text-align: left;z-index: 4;' + margin;
                }
                const attributes: Object = {
                    'id': documentEditor.element.id + '_BarTab' + '_' + i,
                    'class': 'e-de-ruler-tab e-de-ruler-tab-bar',
                    style: style,
                    'data-name': 'BarTab'
                };
                barTab = this.createHtmlElement('div', attributes);
                barTab.setAttribute('title', locale.getConstant('Bar Tab'));
                // const svg: SVGElement;
                // Create an SVG element
                const attr: Object = {
                    'id': documentEditor.element.id + '_barTab_svg',
                    width: rulerSize.width / 2 + 'px',
                    height: rulerSize.height / 2 + 'px',
                    style: 'position:inherit;left:0px'
                };
                const svg: SVGElement = this.createSvgElement('svg', attr);
                svg.setAttribute('fill', 'none');
                const rectAttr: Object = {
                    style: 'position:inherit;left:0px'
                };
                const rect: SVGElement = this.createSvgElement('rect', rectAttr);
                rect.setAttribute('width', '2');
                rect.setAttribute('height', '8');
                rect.setAttribute('fill', '#605E5C');
                rect.setAttribute('stroke', '#A1A1A1');
                // Append the path element to the SVG element
                svg.appendChild(rect);
                barTab.appendChild(svg);
                hRuler.append(barTab);
            }
            break;
        }
        }
        if (!isNullOrUndefined(tabStop)) {
            const tabStopElement: HTMLElement = document.getElementById(documentEditor.element.id + '_' + tabJustification + 'Tab' + '_' + i);
            if (!isNullOrUndefined(tabStop)) {
                tabStopElement.addEventListener('dblclick', function (event: MouseEvent): void {
                    documentEditor.showTabDialog();
                    event.stopPropagation();
                });
            }
            //Draggable for tab stop.
            let isDragging: boolean = false;
            let tabStopOffset: number;
            let initialValue: number = HelperMethods.getNumberFromString(tabStopElement.style.left); // for mouse up event
            const initialValue2: number = HelperMethods.getNumberFromString(tabStopElement.style.left); // for mouse move event
            const justification: string = tabStopElement.getAttribute('data-name');
            const currrentParagraph: ParagraphWidget = this.position.paragraph;
            let tabIndex: number = 0;
            let currentTabStop: WTabStop = undefined;
            tabStopElement.addEventListener('mousedown', (e: MouseEvent) => {
                e.stopPropagation();
                isDragging = true;
                tabStopOffset = e.clientX - tabStopElement.getBoundingClientRect().left;
                initialValue = HelperMethods.getNumberFromString(tabStopElement.style.left);
                tabIndex = parseInt(tabStopElement.id.split('_')[tabStopElement.id.split('_').length - 1], 10);
                currentTabStop = currrentParagraph.paragraphFormat.tabs[parseInt(tabIndex.toString(), 10)];
                this.currentTabStopElement = tabStopElement;
                let rulerZeroPoint: number = HelperMethods.convertPointToPixel(
                    1584 - documentEditor.selectionModule.sectionFormat.leftMargin)
                    * documentEditor.zoomFactor;
                if (documentEditor.layoutType === 'Continuous') {
                    rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                    if (this.position.paragraph.paragraphFormat.bidi) {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor)
                            - 20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                    }
                }
                const value: number = rulerZeroPoint + e.clientX - tabStopOffset - hRuler.getBoundingClientRect().left;
                let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                const indicatorLineValue: number = startValue + (value - rulerZeroPoint);
                const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                lineSvg.style.left = indicatorLineValue + 'px';
                lineSvg.style.display = 'block';
            });
            tabStopElement.addEventListener('mouseup', () => {
                if (!isNullOrUndefined(this.currentTabStopElement)) {
                    this.currentTabStopElement = undefined;
                }
            });

            document.addEventListener('mousemove', (e: MouseEvent) => {
                if (isDragging) {
                    let rulerZeroPoint: number;
                    if (documentEditor.layoutType === 'Continuous') {
                        rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) - 20;
                        if (this.position.paragraph.paragraphFormat.bidi) {
                            rulerZeroPoint = (documentEditor.hRuler.zeroPosition * documentEditor.zoomFactor) -
                            20 - (documentEditor.viewer.clientArea.width * documentEditor.zoomFactor);
                        }
                    } else if (documentEditor.layoutType === 'Pages') {
                        rulerZeroPoint = HelperMethods.convertPointToPixel(1584 - documentEditor.selectionModule.sectionFormat.leftMargin)
                            * documentEditor.zoomFactor;
                        if (this.position.paragraph.bidi) {
                            rulerZeroPoint = HelperMethods.convertPointToPixel(
                                1584 + documentEditor.selectionModule.sectionFormat.rightMargin
                                - documentEditor.selectionModule.sectionFormat.pageWidth) * documentEditor.zoomFactor;
                        }
                    }
                    let value: number = rulerZeroPoint + e.clientX - tabStopOffset - hRuler.getBoundingClientRect().left;
                    let minValue: number = rulerZeroPoint;
                    const rightIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_rightIndent');
                    const rightIndentValue: number = HelperMethods.getNumberFromString(rightIndent.style.left);
                    let maxValue: number = rightIndentValue;
                    const leftIndent: HTMLElement = document.getElementById(documentEditor.element.id + '_leftIndent');
                    const leftIndentValue: number = HelperMethods.getNumberFromString(leftIndent.style.left);
                    minValue = leftIndentValue;
                    if (this.position.paragraph.paragraphFormat.bidi) {
                        minValue = rightIndentValue;
                        maxValue = leftIndentValue;
                    }
                    if (justification === 'CenterTab' || justification === 'DecimalTab') {
                        maxValue += 4;
                    }
                    else if (justification === 'RightTab') {
                        maxValue += 5.5;
                    }
                    else {
                        maxValue += 1.5;
                    }
                    if (value < minValue) {
                        value = minValue;
                    } else if (value > maxValue) {
                        value = maxValue;
                    }
                    tabStopElement.style.left = value + 'px';
                    let startValue: number = documentEditor.documentHelper.currentPage.boundingRectangle.x;
                    startValue = documentEditor.layoutType === 'Continuous' ? 0 : startValue;
                    const indicatorLineValue: number = startValue + (value - rulerZeroPoint) + 6;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.left = indicatorLineValue + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging && !isNullOrUndefined(currentTabStop)) {
                    if (!isNullOrUndefined(this.currentTabStopElement) && this.currentTabStopElement.style.display === 'none') {
                        documentEditor.editorModule.removeTabStops([currrentParagraph], [currentTabStop]);
                        this.currentTabStopElement.parentNode.removeChild(this.currentTabStopElement);
                    } else {
                        let finalValue: number = HelperMethods.getNumberFromString(tabStopElement.style.left);
                        initialValue = finalValue;
                        documentEditor.editorModule.removeTabStops([currrentParagraph], [currentTabStop]);
                        finalValue = HelperMethods.convertPixelToPoint(finalValue / documentEditor.zoomFactor) - 1584;
                        finalValue = currrentParagraph.paragraphFormat.bidi ? finalValue * -1 : finalValue;
                        currentTabStop.position = finalValue;
                        documentEditor.editorModule.updateTabStopCollection(currrentParagraph, [currentTabStop]);
                    }
                    this.updateTabStopMarkers(documentEditor);
                    isDragging = false;
                    const lineSvg: HTMLElement = document.getElementById(documentEditor.element.id + '_hRuler_indicator_svg');
                    lineSvg.style.display = 'none';
                    this.currentTabStopElement = undefined;
                }
            });
        }

    }

    public updateMargin(ruler: Ruler, documentEditor: DocumentEditor, isHorizontal: boolean): void {
        if (isHorizontal) {
            ruler.startMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.leftMargin;
            ruler.endMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.rightMargin;
        } else {
            ruler.startMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.topMargin;
            ruler.endMargin = documentEditor.selectionModule.end.paragraph.bodyWidget.sectionFormat.bottomMargin;
        }
    }


    public getTabJustification(dataNameValue: string): TabJustification {
        switch (dataNameValue) {
        case 'LeftTab':
            return 'Left';
        case 'CenterTab':
            return 'Center';
        case 'RightTab':
            return 'Right';
        case 'DecimalTab':
            return 'Decimal';
        case 'BarTab':
            return 'Bar';
        }
        return 'Left';
    }

    /**
     * getRulerSize method \
     *
     * @returns {void} getRulerSize method .\
     * @param { DocumentEditor} documentEditor - provide the documentEditor  value.
     * @private
     */
    public getRulerSize(documentEditor: DocumentEditor): Size {
        let top: number = 0;
        let left: number = 0;
        //if (diagram.rulerSettings.showRulers) {
        // top = documentEditor.documentEditorSettings.rulerSettings.horizontalRuler.thickness;
        // left = documentEditor.documentEditorSettings.rulerSettings.verticalRuler.thickness;
        top = 15;
        left = 15;
        //}
        return new Size(left, top);
    }
}
