import { Diagram } from '../../diagram';
import { createHtmlElement, removeElement } from '../utility/dom-util';
import { DiagramRulerModel } from '../diagram/ruler-settings-model';
import { Ruler } from '../../ruler/index';
import { Size } from '../primitives/size';
import { PointModel } from '../primitives/point-model';
import { getFunction } from '../utility/base-util';
/**
 * defines the helper methods for the ruler
 */

/**
 * renderOverlapElement method \
 *
 * @returns {void} renderOverlapElement method .\
 * @param { Diagram} diagram - provide the content  value.
 * @private
 */
export function renderOverlapElement(diagram: Diagram): void {
    const rulerSize: Size = getRulerSize(diagram);
    const attributes: Object = {
        'id': diagram.element.id + '_overlapRuler',
        style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;left:0;top:0',
        class: 'e-ruler-overlap'
    };
    const overlap: HTMLElement = createHtmlElement('div', attributes);
    diagram.element.insertBefore(overlap, diagram.element.firstChild);
}

/**
 * renderRuler method \
 *
 * @returns {void} renderRuler method .\
 * @param { Diagram} diagram - provide the content  value.
 * @param { boolean} isHorizontal - provide the content  value.
 * @private
 */
export function renderRuler(diagram: Diagram, isHorizontal: boolean): void {
    let div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    const rulerSize: Size = getRulerSize(diagram);
    const rulerGeometry: Size = getRulerGeometry(diagram);
    const margin: string = isHorizontal ? ('margin-left:' + rulerSize.width + 'px;') : ('margin-top:' + rulerSize.height + 'px;');
    if (!div) {
        const style: string = 'height:' + (isHorizontal ? rulerSize.height : (rulerGeometry.height + 100)) + 'px;overflow:hidden;width:' +
            (isHorizontal ? (rulerGeometry.width + 100) : rulerSize.width) + 'px;position:absolute;font-size:11px;' + margin;
        const attributes: Object = {
            'id': diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'),
            style: style
        };
        div = createHtmlElement('div', attributes);
    }
    diagram.element.insertBefore(div, diagram.element.firstChild);
    const diagramRuler: DiagramRulerModel = isHorizontal ? diagram.rulerSettings.horizontalRuler : diagram.rulerSettings.verticalRuler;
    const ruler: Ruler = new Ruler(diagramRuler);
    ruler.orientation = isHorizontal ? 'Horizontal' : 'Vertical';
    ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + diagramRuler.segmentWidth;
    ruler.appendTo('#' + diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    // eslint-disable-next-line
    isHorizontal ? diagram.hRuler = ruler : diagram.vRuler = ruler;
    const rulerObj: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    // eslint-disable-next-line
    isHorizontal ? diagram.hRuler.element = rulerObj : diagram.vRuler.element = rulerObj;
}

/**
 * updateRuler method \
 *
 * @returns {void} updateRuler method .\
 * @param { Diagram} diagram - provide the diagram  value.
 * @private
 */
export function updateRuler(diagram: Diagram): void {
    const hOffset: number = - diagram.scroller.horizontalOffset;
    const vOffset: number = - diagram.scroller.verticalOffset;
    if (diagram && diagram.rulerSettings.showRulers) {
        diagram.hRuler.length = 0;
        diagram.vRuler.length = 0;
        if (hOffset !== undefined && diagram.hRuler.element) {
            updateRulerDimension(diagram, diagram.hRuler, hOffset, true);
        }
        if (vOffset !== undefined && diagram.vRuler.element) {
            updateRulerDimension(diagram, diagram.vRuler, vOffset, false);
        }
    } else {
        removeRulerElements(diagram);
    }
}

/**
 * removeRulerElements method \
 *
 * @returns {void} removeRulerElements method .\
 * @param { Diagram} diagram - provide the diagram  value.
 * @private
 */
export function removeRulerElements(diagram: Diagram): void {
    removeElement(diagram.element.id + '_hRuler');
    removeElement(diagram.element.id + '_vRuler');
    removeElement(diagram.element.id + '_overlapRuler');
}



/**
 * getRulerSize method \
 *
 * @returns {void} getRulerSize method .\
 * @param { Diagram} diagram - provide the diagram  value.
 * @private
 */
export function getRulerSize(diagram: Diagram): Size {
    let top: number = 0;
    let left: number = 0;
    if (diagram.rulerSettings.showRulers) {
        top = diagram.rulerSettings.horizontalRuler.thickness;
        left = diagram.rulerSettings.verticalRuler.thickness;
    }
    return new Size(left, top);
}

/**
 * getRulerGeometry method \
 *
 * @returns {void} getRulerGeometry method .\
 * @param { Diagram} diagram - provide the diagram  value.
 * @private
 */
export function getRulerGeometry(diagram: Diagram): Size {
    const rulerSize: Size = getRulerSize(diagram);
    let height: number = diagram.scroller.viewPortHeight;
    let width: number = diagram.scroller.viewPortWidth;
    if (width < diagram.element.clientWidth - rulerSize.width) {
        width = diagram.element.clientWidth - rulerSize.width;
    }
    if (height < diagram.element.clientHeight - rulerSize.height) {
        height = diagram.element.clientHeight - rulerSize.height;
    }
    if (diagram.hRuler && diagram.hRuler.length) {
        width = diagram.hRuler.length;
    }
    if (diagram.vRuler && diagram.vRuler.length) {
        height = diagram.vRuler.length;
    }
    return new Size(width, height);
}

/**
 * removeRulerMarkers method \
 *
 * @returns {void} removeRulerMarkers method .\
 * @private
 */
export function removeRulerMarkers(): void {
    const markers: HTMLCollection = document.getElementsByClassName('e-d-ruler-marker');
    let marker: HTMLElement;
    let i: number;
    if (markers && markers.length > 0) {
        for (i = markers.length - 1; i >= 0; i--) {
            marker = markers[i] as HTMLElement;
            if (marker) {
                marker.parentNode.removeChild(marker);
            }
        }
    }
}

/**
 * drawRulerMarkers method \
 *
 * @returns {void} drawRulerMarkers method .\
 * @param { Diagram} diagram - provide the content  value.
 * @param { PointModel} currentPoint - provide the content  value.
 * @private
 */
export function drawRulerMarkers(diagram: Diagram, currentPoint: PointModel): void {
    if (diagram.rulerSettings.showRulers) {
        diagram.hRuler.drawRulerMarker(diagram.hRuler.element, currentPoint, diagram.scroller.horizontalOffset);
        diagram.vRuler.drawRulerMarker(diagram.vRuler.element, currentPoint, diagram.scroller.verticalOffset);
    }
}

/**
 * updateRulerDimension method \
 *
 * @returns {void} updateRulerDimension method .\
 * @param { Diagram} diagram - provide the content  value.
 * @param { Ruler} ruler - provide the content  value.
 * @param { number} offset - provide the content  value.
 * @param { boolean} isHorizontal - provide the content  value.
 * @private
 */
function updateRulerDimension(diagram: Diagram, ruler: Ruler, offset: number, isHorizontal: boolean): void {
    const rulerSize: Size = getRulerSize(diagram);
    const rulerGeometry: Size = getRulerGeometry(diagram);
    const diagramRuler: DiagramRulerModel = isHorizontal ? diagram.rulerSettings.horizontalRuler : diagram.rulerSettings.verticalRuler;
    updateRulerDiv(diagram, rulerGeometry, isHorizontal);
    updateRulerSpace(diagram, rulerGeometry, isHorizontal);
    ruler.offset = offset;
    ruler.scale = diagram.scroller.currentZoom;
    ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + 100;
    ruler.arrangeTick = getFunction(diagramRuler.arrangeTick);
    ruler.dataBind();
    const rulerObj: HTMLElement = isHorizontal ? diagram.hRuler.element : diagram.vRuler.element;
    if (isHorizontal) {
        rulerObj.style.marginLeft = (rulerSize.width - ruler.hRulerOffset) + 'px';
    } else {
        rulerObj.style.marginTop = (rulerSize.height - ruler.vRulerOffset) + 'px';
    }
}
/**
 * updateRulerSpace method \
 *
 * @returns {void} updateRulerSpace method .\
 * @param { Diagram} diagram - provide the content  value.
 * @param { Size} rulerGeometry - provide the content  value.
 * @param { boolean} isHorizontal - provide the content  value.
 * @private
 */
function updateRulerSpace(diagram: Diagram, rulerGeometry: Size, isHorizontal: Boolean): void {
    const div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler_ruler_space' : '_vRuler_ruler_space'));
    const ruler: Ruler = isHorizontal ? diagram.hRuler : diagram.vRuler;
    if (div && diagram && rulerGeometry) {
        div.style.width = (isHorizontal ? (rulerGeometry.width + (ruler.segmentWidth * 2)) : ruler.thickness) + 'px';
        div.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + (ruler.segmentWidth * 2))) + 'px';
    }
}

/**
 * updateRulerDiv method \
 *
 * @returns {void} updateRulerDiv method .\
 * @param { Diagram} diagram - provide the content  value.
 * @param { Size} rulerGeometry - provide the content  value.
 * @param { boolean} isHorizontal - provide the content  value.
 * @private
 */
function updateRulerDiv(diagram: Diagram, rulerGeometry: Size, isHorizontal: boolean): void {
    let div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    const ruler: Ruler = isHorizontal ? diagram.hRuler : diagram.vRuler;
    if (div && diagram && rulerGeometry) {
        div.style.width = (isHorizontal ? (rulerGeometry.width + ruler.segmentWidth) : ruler.thickness) + 'px';
        div.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + ruler.segmentWidth)) + 'px';
        // eslint-disable-next-line
        div = document.getElementById(diagram.element.id + '_overlapRuler');
        if (div) {
            // eslint-disable-next-line
            isHorizontal ? (div.style.height = ruler.thickness + 'px') : (div.style.width = ruler.thickness + 'px');
        }
    }
}
