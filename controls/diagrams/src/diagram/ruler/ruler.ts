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
 * @private
 */
export function renderOverlapElement(diagram: Diagram): void {
    let rulerSize: Size = getRulerSize(diagram);
    let attributes: Object = {
        'id': diagram.element.id + '_overlapRuler',
        style: 'height:' + rulerSize.height + 'px;width:' + rulerSize.width + 'px;position:absolute;left:0;top:0',
        class: 'e-ruler-overlap'
    };
    let overlap: HTMLElement = createHtmlElement('div', attributes);
    diagram.element.insertBefore(overlap, diagram.element.firstChild);
}

/**
 * @private
 */
export function renderRuler(diagram: Diagram, isHorizontal: Boolean): void {
    let div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    let rulerSize: Size = getRulerSize(diagram);
    let rulerGeometry: Size = getRulerGeometry(diagram);
    let margin: string = isHorizontal ? ('margin-left:' + rulerSize.width + 'px;') : ('margin-top:' + rulerSize.height + 'px;');
    if (!div) {
        let style: string = 'height:' + (isHorizontal ? rulerSize.height : (rulerGeometry.height + 100)) + 'px;overflow:hidden;width:' +
            (isHorizontal ? (rulerGeometry.width + 100) : rulerSize.width) + 'px;position:absolute;font-size:11px;' + margin;
        let attributes: Object = {
            'id': diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'),
            style: style
        };
        div = createHtmlElement('div', attributes);
    }
    diagram.element.insertBefore(div, diagram.element.firstChild);
    let diagramRuler: DiagramRulerModel = isHorizontal ? diagram.rulerSettings.horizontalRuler : diagram.rulerSettings.verticalRuler;
    let ruler: Ruler = new Ruler(diagramRuler);
    ruler.orientation = isHorizontal ? 'Horizontal' : 'Vertical';
    ruler.length = (isHorizontal ? rulerGeometry.width : rulerGeometry.height) + diagramRuler.segmentWidth;
    ruler.appendTo('#' + diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    isHorizontal ? diagram.hRuler = ruler : diagram.vRuler = ruler;
    let rulerObj: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    isHorizontal ? diagram.hRuler.element = rulerObj : diagram.vRuler.element = rulerObj;
}

/**
 * @private
 */
export function updateRuler(diagram: Diagram): void {
    let hOffset: number = - diagram.scroller.horizontalOffset;
    let vOffset: number = - diagram.scroller.verticalOffset;
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
 * @private
 */
export function removeRulerElements(diagram: Diagram): void {
    removeElement(diagram.element.id + '_hRuler');
    removeElement(diagram.element.id + '_vRuler');
    removeElement(diagram.element.id + '_overlapRuler');
}



/** @private */
export function getRulerSize(diagram: Diagram): Size {
    let top: number = 0;
    let left: number = 0;
    if (diagram.rulerSettings.showRulers) {
        top = diagram.rulerSettings.horizontalRuler.thickness;
        left = diagram.rulerSettings.verticalRuler.thickness;
    }
    return new Size(left, top);
}

/** @private */
export function getRulerGeometry(diagram: Diagram): Size {
    let rulerSize: Size = getRulerSize(diagram);
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
 * @private
 */
export function removeRulerMarkers(): void {
    let markers: HTMLCollection = document.getElementsByClassName('e-d-ruler-marker');
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

export function drawRulerMarkers(diagram: Diagram, currentPoint: PointModel): void {
    if (diagram.rulerSettings.showRulers) {
        diagram.hRuler.drawRulerMarker(diagram.hRuler.element, currentPoint, diagram.scroller.horizontalOffset);
        diagram.vRuler.drawRulerMarker(diagram.vRuler.element, currentPoint, diagram.scroller.verticalOffset);
    }
}

function updateRulerDimension(diagram: Diagram, ruler: Ruler, offset: number, isHorizontal: Boolean): void {
    let rulerSize: Size = getRulerSize(diagram);
    let rulerGeometry: Size = getRulerGeometry(diagram);
    let diagramRuler: DiagramRulerModel = isHorizontal ? diagram.rulerSettings.horizontalRuler : diagram.rulerSettings.verticalRuler;
    updateRulerDiv(diagram, rulerGeometry, isHorizontal);
    updateRulerSpace(diagram, rulerGeometry, isHorizontal);
    ruler.offset = offset;
    ruler.scale = diagram.scroller.currentZoom;
    ruler.length = rulerGeometry.width + 100;
    ruler.arrangeTick = getFunction(diagramRuler.arrangeTick);
    ruler.dataBind();
    let rulerObj: HTMLElement = isHorizontal ? diagram.hRuler.element : diagram.vRuler.element;
    if (isHorizontal) {
        rulerObj.style.marginLeft = (rulerSize.width - ruler.hRulerOffset) + 'px';
    } else {
        rulerObj.style.marginTop = (rulerSize.height - ruler.vRulerOffset) + 'px';
    }
}

function updateRulerSpace(diagram: Diagram, rulerGeometry: Size, isHorizontal: Boolean): void {
    let div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler_ruler_space' : '_vRuler_ruler_space'));
    let ruler: Ruler = isHorizontal ? diagram.hRuler : diagram.vRuler;
    if (div && diagram && rulerGeometry) {
        div.style.width = (isHorizontal ? (rulerGeometry.width + (ruler.segmentWidth * 2)) : ruler.thickness) + 'px';
        div.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + (ruler.segmentWidth * 2))) + 'px';
    }
}

function updateRulerDiv(diagram: Diagram, rulerGeometry: Size, isHorizontal: Boolean): void {
    let div: HTMLElement = document.getElementById(diagram.element.id + (isHorizontal ? '_hRuler' : '_vRuler'));
    let ruler: Ruler = isHorizontal ? diagram.hRuler : diagram.vRuler;
    if (div && diagram && rulerGeometry) {
        div.style.width = (isHorizontal ? (rulerGeometry.width + ruler.segmentWidth) : ruler.thickness) + 'px';
        div.style.height = (isHorizontal ? ruler.thickness : (rulerGeometry.height + ruler.segmentWidth)) + 'px';
        div = document.getElementById(diagram.element.id + '_overlapRuler');
        if (div) {
            isHorizontal ? (div.style.height = ruler.thickness + 'px') : (div.style.width = ruler.thickness + 'px');
        }
    }
}