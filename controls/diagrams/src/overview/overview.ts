import { Diagram } from '../diagram/diagram';
import { RenderingMode } from '../diagram/enum/enum';
import { DiagramRenderer } from '../diagram/rendering/renderer';
import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';
import { INotifyPropertyChanged, Component, Property, Browser, EventHandler, Event, EmitType } from '@syncfusion/ej2-base';
import { setAttributeHtml, setAttributeSvg, createHtmlElement } from '../diagram/utility/dom-util';
import { createSvgElement, getNativeLayer, hasClass } from '../diagram/utility/dom-util';
import { Rect } from '../diagram/primitives/rect';
import { Size } from '../diagram/primitives/size';
import { PointModel } from '../diagram/primitives/point-model';
import { OverviewModel } from './overview-model';
import { SvgRenderer } from '../diagram/rendering/svg-renderer';

/**
 * Overview control allows you to see a preview or an overall view of the entire content of a Diagram.
 * This helps you to look at the overall picture of a large Diagram
 * To navigate, pan, or zoom, on a particular position of the page.
 * ```html
 * <div id='diagram'/>
 * <div id="overview"></div>
 * ```
 * ```typescript
 * let overview: Overview;
 * let diagram: Diagram = new Diagram({
 * width:'1000px', height:'500px' });
 * diagram.appendTo('#diagram');
 * let options: OverviewModel = {};
 * options.sourceID = 'diagram';
 * options.width = '250px';
 * options.height = '500px';
 * overview = new Overview(options);
 * overview.appendTo('#overview');
 * ```
 */



export class Overview extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the width of the overview
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the height of the overview
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the ID of the overview
     * @default ''
     */
    @Property('')
    public sourceID: string;

    /**
     * Triggers after render the diagram elements
     * @event
     */
    @Event()
    public created: EmitType<Object>;

    private parent: Diagram;

    private canvas: HTMLElement;

    private svg: SVGElement;

    /** @private */
    public mode: RenderingMode = 'Canvas';

    /** @private */
    public id: string = 'overview';

    private actionName: string = '';

    private startPoint: PointModel = null;

    private currentPoint: PointModel = null;

    private prevPoint: PointModel = null;

    private resizeDirection: string;

    private scale: PointModel = null;

    private inAction: boolean = false;

    private viewPortRatio: number = 1;

    private horizontalOffset: number = 0;

    private verticalOffset: number = 0;

    /** @private */
    public contentWidth: number;

    /** @private */
    public contentHeight: number;

    /** @private */
    public diagramLayer: HTMLCanvasElement | SVGGElement;

    private diagramLayerDiv: HTMLDivElement;

    private model: OverviewModel = {};

    private helper: SVGElement;

    private resizeTo: Object;

    private event: boolean = true;

    /**   @private  */
    public diagramRenderer: DiagramRenderer;

    constructor(options?: OverviewModel, element?: HTMLElement | string) {
        super(options, <HTMLElement | string>element);
        this.model = { width: this.width, height: this.height };
    }

    /**
     * Updates the overview control when the objects are changed
     * @param newProp Lists the new values of the changed properties
     * @param oldProp Lists the old values of the changed properties
     */

    public onPropertyChanged(newProp: OverviewModel, oldProp: OverviewModel): void {
        let objectArray: Object[] = [];
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'sourceID':
                    this.setParent(newProp.sourceID);
                    break;
                case 'width':
                case 'height':
                    this.renderCanvas();
                    this.setParent(this.sourceID);
                    break;

            }
        }
    }

    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    public getPersistData(): string {
        let keyEntity: string[] = ['loaded'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Initialize nodes, connectors and renderer
     */
    protected preRender(): void {
        this.element.style.background = 'transparent';
        this.unWireEvents();
        this.wireEvents();
    }

    protected render(): void {
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), false);
        this.renderCanvas();
        this.setParent(this.sourceID);
    }

    private getSizeValue(real: string | number): String {
        let text: string;
        if (real.toString().indexOf('px') > 0 || real.toString().indexOf('%') > 0) {
            text = real.toString();
        } else {
            text = real.toString() + 'px';
        }
        return text;
    }

    private renderCanvas(options?: OverviewModel): void {
        let canvas: HTMLElement = document.getElementById(this.element.id + '_canvas');
        if (!canvas) {
            canvas = createHtmlElement('div', {});
            this.element.appendChild(canvas);
        }
        let attribute: Object = {
            'id': this.element.id + '_canvas', 'class': 'drawing',
            'style': 'position:relative; height:' + this.getSizeValue(this.model.height) + '; width:' +
            this.getSizeValue(this.model.width) +
            ';style:-ms-touch-action: none;touch-action: none;'
        };
        setAttributeHtml(canvas, attribute);
        this.element.setAttribute('tabindex', String(0));
        this.element.style.overflow = 'hidden';
        this.element.style.height = String(this.model.height);
        this.element.style.width = String(this.model.width);
        this.canvas = canvas;
    }

    private setParent(id: string): void {
        let element: HTMLElement = document.getElementById(id);
        let instance: string = 'ej2_instances';
        if (this.parent) {
            let oldparent: Diagram = this.parent;
            this.parent = null;
            oldparent.setOverview(null, this.element.id);
            this.removeDocument(this);
        }
        this.parent = this.getDiagram(element, instance);
        if (this.parent) {
            this.parent.setOverview(this);
        }
    }

    private getDiagram(element: HTMLElement, instance: string): Diagram {
        let diagram: Diagram;
        let n: number = element[instance].length;
        for (let i: number = 0; i < n; i++) {
            if (hasClass(element[instance][i].element, 'e-diagram')) {
                diagram = element[instance][i];
                break;
            }
        }
        return diagram;
    }

    private unWireEvents(): void {
        let start: string = Browser.touchStartEvent;
        let move: string = Browser.touchMoveEvent;
        let evnt: EventHandler;
        let cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        let isIE11Pointer: Boolean = Browser.isPointer;
        let wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        let stop: string = Browser.touchEndEvent;
        EventHandler.remove(this.element, start, this.mouseDown);
        EventHandler.remove(this.element, move, this.mouseMove);
        EventHandler.remove(this.element, stop, this.mouseUp);
        EventHandler.remove(this.element, cancel, this.documentMouseUp);
        EventHandler.remove(<HTMLElement & Window>window, 'resize', this.windowResize);

        let container: HTMLElement = document.getElementById(this.sourceID + 'content');
        if (container) {
            EventHandler.remove(container, 'scroll', this.scrolled);
        }
    }

    private wireEvents(): void {
        let start: string = Browser.touchStartEvent;
        let stop: string = Browser.touchEndEvent;
        let move: string = Browser.touchMoveEvent;
        let cancel: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        let isIE11Pointer: Boolean = Browser.isPointer;
        let wheelEvent: string = Browser.info.name === 'mozilla' ?
            (isIE11Pointer ? 'mousewheel' : 'DOMMouseScroll') : 'mousewheel';

        EventHandler.add(this.element, start, this.mouseDown, this);
        EventHandler.add(this.element, move, this.mouseMove, this);
        EventHandler.add(this.element, stop, this.mouseUp, this);
        EventHandler.add(this.element, cancel, this.documentMouseUp, this);
        EventHandler.add(<HTMLElement & Window>window, 'resize', this.windowResize, this);

        let container: HTMLElement = document.getElementById(this.sourceID + 'content');
        if (container) {
            EventHandler.add(container, 'scroll', this.scrolled, this);
        }
    }

    /**
     * @private
     */

    /**
     * @private
     */
    public renderDocument(view: Overview): void {
        view.canvas = this.canvas;
        let g: HTMLElement = document.getElementById(this.canvas.id + '_svg');
        if (g) {
            g.parentNode.removeChild(g);
        }
        let attr: Object = {
            id: this.canvas.id + '_svg',
            version: '1.1',
            xlink: 'http://www.w3.org/1999/xlink',
            'class': 'overview_svg'
        };
        let svg: SVGElement = createSvgElement('svg', attr);
        this.svg = svg;
        view.svg = svg;
        view.canvas.appendChild(svg);
        let ovw: HTMLElement = document.getElementById(this.element.id);
        let element: HTMLElement = ovw;
        let eWidth: number = element.clientWidth;
        let eHeight: number = element.clientHeight;
        let bRect: ClientRect = element.getBoundingClientRect();
        // Check for the window resize
        let screenX: number = (window.screenX < 0) ? window.screenX * -1 : window.screenX;
        let screenY: number = (window.screenY < 0) ? window.screenY * -1 : window.screenY;
        if (eWidth === 0) {
            eWidth = Math.floor(((window.innerWidth - screenX) - Math.floor(bRect.left)));
        }
        if (eHeight === 0) {
            eHeight = Math.floor(((window.innerHeight - screenY) - Math.floor(bRect.top)));
        }
        svg.setAttribute('width', String(eWidth));
        svg.setAttribute('height', String(eHeight));
        this.model.width = eWidth;
        this.model.height = eHeight;
        let attributes: Object;
        if (!view.diagramLayerDiv) {
            view.diagramLayerDiv = createHtmlElement('div', {}) as HTMLDivElement;
            let container: HTMLElement = document.getElementById(this.element.id);
            view.diagramLayer = CanvasRenderer.createCanvas(this.element.id + '_diagramLayer', this.model.width, this.model.height);
            view.diagramLayer.setAttribute('style', 'position:absolute; left:0px;  top:0px ');
            view.diagramLayerDiv.appendChild(view.diagramLayer);
            view.canvas.appendChild(view.diagramLayerDiv);
        }
        attributes = {
            'id': this.element.id + '_diagramLayer_div',
            'style': 'width:' + this.model.width + 'px; height:' + this.model.height + 'px;position:absolute;top:0px;left:0px'
        };
        setAttributeHtml(view.diagramLayerDiv, attributes);
        this.renderHtmlLayer(view.canvas);
        this.renderNativeLayer(view.canvas, view);
        this.addOverviewRectPanel(view);
    }
    /** @private */
    public removeDocument(view: Overview): void {
        let svg: HTMLElement = document.getElementById(this.canvas.id + '_svg');
        this.canvas.removeChild(svg);
        let htmlLayer: HTMLElement = document.getElementById(this.element.id + '_htmlLayer');
        this.canvas.removeChild(htmlLayer);
        let diagramLayer: HTMLElement = document.getElementById(this.element.id + '_diagramLayer_div');
        this.canvas.removeChild(diagramLayer);
        view.diagramLayerDiv = null;
        view.diagramLayer = null;
    }

    private renderHtmlLayer(canvas: HTMLElement): HTMLElement {
        let htmlLayer: HTMLDivElement = createHtmlElement(
            'div', {
                'id': this.element.id + '_htmlLayer', 'class': 'e-html-layer',
                'style': 'pointer-events:none;position:absolute;top:0px;left:0px;'
            }
        ) as HTMLDivElement;
        let options: Object = {
            'id': this.element.id + '_htmlLayer_div',
            'style': 'position:absolute;top:0px;left:0px;'
        };
        let htmlDiv: HTMLDivElement = createHtmlElement('div', options) as HTMLDivElement;
        htmlLayer.appendChild(htmlDiv);
        canvas.appendChild(htmlLayer);
        return htmlLayer;
    }

    private renderNativeLayer(canvas: HTMLElement, view: Overview): void {
        let nativeLayerSvg: SVGElement = this.parent.createSvg(
            this.element.id + '_nativeLayer_svg', this.model.width, this.model.height);
        let nativeLayer: SVGElement = createSvgElement('g', { 'id': this.element.id + '_nativeLayer' });
        nativeLayerSvg.appendChild(nativeLayer);
        view.diagramLayerDiv.appendChild(nativeLayerSvg);
        setAttributeSvg(nativeLayerSvg, { 'class': 'e-native-layer' });
    }

    private addOverviewRectPanel(view: Overview): void {
        let svg: HTMLElement | SVGElement = document.getElementById(this.canvas.id + '_overviewsvg');
        if (svg) {
            svg.parentNode.removeChild(svg);
        }
        let attr: Object = ({
            id: this.canvas.id + '_overviewsvg',
            version: '1.1',
            xlink: 'http://www.w3.org/1999/xlink',
            'style': 'position:absolute;left:0px;top:0px; aria-label:Specifies overview',
            width: this.model.width,
            height: this.model.height
        });
        svg = createSvgElement('svg', attr);
        view.canvas.appendChild(svg);
        let ovw: SVGElement = createSvgElement('g', { 'id': this.element.id + '_overviewlayer', 'style': 'pointer-events:none' });
        svg.appendChild(ovw);
        let rect: SVGElement = createSvgElement('rect', {
            'fill': 'transparent', 'width': '100%', 'height': '100%', 'class': 'overviewbackrect',
            'id': this.canvas.id + 'overviewbackrect'
        });
        rect.setAttribute('style', ' pointer-events: none; ');
        ovw.appendChild(rect);
        let svgDocument: SVGElement = (ovw);
        let g: SVGElement = createSvgElement('g', { 'id': this.canvas.id + 'overviewhandle', 'style': 'pointer-events:all' });
        ovw.appendChild(g);
        let innerrect: SVGElement = createSvgElement('rect', { 'id': this.canvas.id + 'overviewrect', 'fill': 'transparent' });
        g.appendChild(innerrect);
        this.renderOverviewCorner('left', g);
        this.renderOverviewCorner('right', g);
        this.renderOverviewCorner('top', g);
        this.renderOverviewCorner('bottom', g);
        this.renderOverviewCorner('topleft', g);
        this.renderOverviewCorner('topright', g);
        this.renderOverviewCorner('bottomleft', g);
        this.renderOverviewCorner('bottomright', g);
    }

    private renderOverviewCorner(name: string, parent: SVGElement): void {
        let svg: SVGElement = this.svg;
        let shape: string;
        if (name === 'top' || name === 'bottom' || name === 'right' || name === 'left') {
            shape = 'rect';
        } else {
            shape = 'circle';
        }
        let innerrect: SVGElement = createSvgElement(shape, { 'id': this.canvas.id + 'visible' + name });
        parent.appendChild(innerrect);
        let transrect: SVGElement = createSvgElement(shape, {
            'id': this.canvas.id + name, 'class': 'overviewresizer', 'fill': 'transparent'
        });
        parent.appendChild(transrect);
    }

    private updateOverviewRectangle(): void {
        let difx: number = this.currentPoint.x - this.prevPoint.x;
        let dify: number = this.currentPoint.y - this.prevPoint.y;
        let size: Size = new Size();
        size.width = 0; size.height = 0;
        let x: number = 0;
        let y: number = 0; let w: number; let h: number;
        switch (this.resizeDirection) {
            case 'left':
                size.width -= difx;
                size.height -= difx / this.viewPortRatio;
                x = difx;
                y = difx / this.viewPortRatio;
                y /= 2;
                break;
            case 'right':
                size.width += difx;
                size.height += difx / this.viewPortRatio;
                y = difx / this.viewPortRatio;
                y /= -2;
                break;
            case 'top':
                size.height -= dify;
                size.width -= dify * this.viewPortRatio;
                y = dify;
                x = dify * this.viewPortRatio;
                x /= 2;
                break;
            case 'bottom':
                size.height += dify;
                size.width += dify * this.viewPortRatio;
                x = dify * this.viewPortRatio;
                x /= -2;
                break;
            case 'topleft':
                if (Math.abs(dify) > Math.abs(difx)) {
                    difx = dify * this.viewPortRatio;
                } else {
                    dify = difx / this.viewPortRatio;
                }
                size.width -= difx;
                size.height -= dify;
                x = difx;
                y = dify;
                break;
            case 'topright':
                if (Math.abs(dify) > Math.abs(difx)) {
                    difx = -dify * this.viewPortRatio;
                } else {
                    dify = -(difx / this.viewPortRatio);
                }
                y = dify;
                size.width += difx;
                size.height -= dify;
                break;
            case 'bottomleft':
                if (Math.abs(dify) > Math.abs(difx)) {
                    difx = -dify * this.viewPortRatio;
                } else {
                    dify = -difx / this.viewPortRatio;
                }
                x = difx;
                size.width -= difx;
                size.height += dify;
                break;
            case 'bottomright':
                if (Math.abs(dify) > Math.abs(difx)) {
                    difx = dify * this.viewPortRatio;
                } else {
                    dify = difx / this.viewPortRatio;
                }
                size.width += difx;
                size.height += dify;
                break;
        }
        this.updateHelper(x, y, size, w, h);
    }

    private updateHelper(difx?: number, dify?: number, size?: Size, width?: number, height?: number): void {
        let x: number; let y: number;
        let bounds: SVGRect;
        let svg: SVGSVGElement = this.element.getElementsByTagName('svg')[2];
        let rect: SVGRectElement = (svg as SVGSVGElement).getElementById('helper') as SVGRectElement;
        if (size) {
            bounds = rect.getBBox();
            x = bounds.x + difx;
            y = bounds.y + dify;
            width = bounds.width + size.width;
            height = bounds.height + size.height;
        } else {
            let difx: number;
            if (this.currentPoint.x > this.startPoint.x) {
                difx = this.currentPoint.x - this.prevPoint.x;
            } else {
                difx = this.prevPoint.x - this.currentPoint.x;
            }
            let dify: number;
            if (this.currentPoint.y > this.startPoint.y) {
                dify = this.currentPoint.y - this.prevPoint.y;
            } else {
                dify = this.prevPoint.y - this.currentPoint.y;
            }
            let w: boolean; let h: boolean;
            if (Math.abs(dify) > Math.abs(difx)) {
                difx = this.viewPortRatio * dify; h = true; w = false;
            } else {
                dify = difx / this.viewPortRatio; w = true; h = false;
            }
            bounds = rect.getBBox();
            x = ((this.startPoint.x > this.currentPoint.x) ?
                bounds.x - difx : bounds.x);
            y = ((this.startPoint.y > this.currentPoint.y) ? bounds.y - dify : bounds.y);
            width = bounds.width + difx;
            height = bounds.height + dify;
        }
        setAttributeSvg(this.helper, {
            'id': this.helper.id, 'x': x, 'y': y,
            'width': Math.max(0, width), 'height': Math.max(0, height)
        });
    }

    private updateOverviewrect(x: number, y: number, width: number, height: number): void {
        let rect: HTMLElement = document.getElementById(this.canvas.id + 'overviewrect');
        let attr: Object = { x: x, y: y, width: Math.max(1, width), height: Math.max(1, height) };
        setAttributeHtml(rect, attr);
        this.updateOverviewCorner('top', x + 8, y - 2, Math.max(0, width - 16), 2);
        this.updateOverviewCorner('bottom', x + 8, y + height, Math.max(0, width - 16), 2);
        this.updateOverviewCorner('left', x - 2, y + 8, 2, Math.max(0, height - 16));
        this.updateOverviewCorner('right', x + width, y + 8, 2, Math.max(0, height - 16));
        this.updateOverviewCorner('topleft', x, y, 5, 5);
        this.updateOverviewCorner('topright', x + width, y, 5, 5);
        this.updateOverviewCorner('bottomleft', x, y + height, 5, 5);
        this.updateOverviewCorner('bottomright', x + width, y + height, 5, 5);
    }

    private updateOverviewCorner(name: string, x: number, y: number, width: number, height: number): void {
        let attr: Object; let transattr: Object;
        let rectname: string = 'visible' + name;
        let rect: HTMLElement = document.getElementById(this.canvas.id + rectname);
        if (name === 'top' || name === 'bottom' || name === 'right' || name === 'left') {
            attr = { x: x, y: y, width: width, height: height, fill: '#ED1C24' };
            transattr = { x: x - 2, y: y - 2, width: width === 2 ? 4 : width, height: height === 2 ? 4 : height };
        } else {
            attr = { cx: x, cy: y, 'r': 4, fill: '#ED1C24' };
            transattr = { cx: x, cy: y, 'r': 6, fill: 'transparent' };
        }
        setAttributeHtml(rect, attr);
        let transrect: HTMLElement = document.getElementById(this.canvas.id + name);
        setAttributeHtml(transrect, transattr);
    }

    private translateOverviewRectangle(): void {
        let offwidth: number = Number(this.model.width);
        let offheight: number = Number(this.model.height);
        let difx: number = this.currentPoint.x - this.prevPoint.x;
        let dify: number = this.currentPoint.y - this.prevPoint.y;
        let viewPort: Rect;
        let zoom: number = Math.min(this.parent.scroller.viewPortWidth / offwidth, this.parent.scroller.viewPortHeight / offheight);
        let svg: SVGSVGElement = this.element.getElementsByTagName('svg')[2];
        let panel: SVGRectElement = (svg as SVGSVGElement).getElementById(this.canvas.id
            + 'overviewrect') as SVGRectElement;
        let bounds: SVGRect = panel.getBBox();
        let x: number = bounds.x + difx;
        let y: number = bounds.y + dify;
        let width: number = bounds.width;
        let height: number = bounds.height;
        this.updateOverviewrect(x, y, width, height);
        this.updateParentView(this.parent.scroller.currentZoom, x, y, width, height, null);
    }

    private renderOverviewRect(x: number, y: number, width: number, height: number): void {
        let offwidth: number = Number(this.model.width);
        let offheight: number = Number(this.model.height);
        let viewPort: Rect;
        let viewwidth: number = (width / offwidth) * this.contentWidth;
        let viewheight: number = (height / offheight) * this.contentHeight;
        let zoom: number = Math.max(this.parent.scroller.viewPortWidth / viewwidth, this.parent.scroller.viewPortHeight / viewheight);
        if (zoom >= 0.25 && zoom <= 30) {
            let point: PointModel = { x: 0, y: 0 };
            this.updateParentView(zoom, x, y, width, height, point);
            let bounds: Rect = this.scrollOverviewRect(
                this.parent.scroller.horizontalOffset, this.parent.scroller.verticalOffset, this.parent.scroller.currentZoom, true);
            if (this.helper) {
                let panel: SVGRectElement = this.element.getElementsByTagName('rect')[10];
                let svgRect: SVGRect = panel.getBBox();
                bounds.x = svgRect.x;
                bounds.y = svgRect.y;
            }
            this.updateOverviewrect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
    }

    private scrollOverviewRect(hoffset: number, voffset: number, currentZoom: number, scaled?: boolean): Rect {
        if (!(this.actionName) || scaled) {
            let offwidth: number = Number(this.model.width);
            let offheight: number = Number(this.model.height);
            let scale: number = Math.min(this.contentWidth / offwidth, this.contentHeight / offheight);
            let bounds: Rect = new Rect();
            let x: number = bounds.x = (hoffset / currentZoom) / scale;
            let y: number = bounds.y = (voffset / currentZoom) / scale;
            let viewPort: Rect;
            let width: number = bounds.width = (this.parent.scroller.viewPortWidth / currentZoom) / scale;
            let height: number = bounds.height = (this.parent.scroller.viewPortHeight / currentZoom) / scale;
            let ratio: number = this.parent.scroller.viewPortWidth / this.parent.scroller.viewPortHeight;
            if (scaled) {
                let rect: Rect = new Rect();
                rect.x = x;
                rect.y = y;
                rect.width = width;
                rect.height = height;
                return rect;
            }
            this.updateOverviewrect(-x, -y, width, height);
        }
        return null;
    }

    private updateParentView(zoom: number, x: number, y: number, width: number, height: number, focusPoint: PointModel): void {
        let offwidth: number = Number(this.model.width);
        let offheight: number = Number(this.model.height);
        let scalex: number = this.contentWidth / offwidth;
        let scaley: number = this.contentHeight / offheight;
        let hoffset: number = x * scalex * zoom;
        let voffset: number = y * scaley * zoom;
        let delx: number;
        let dely: number;
        let bounds: Rect = this.parent.scroller.getPageBounds();
        if (zoom !== 1 || this.actionName === 'pan') {
            delx = -hoffset - this.parent.scroller.horizontalOffset;
            dely = -voffset - this.parent.scroller.verticalOffset;
        }
        if (this.actionName === 'scale' || this.actionName === 'draw') {
            this.parent.scroller.zoom(zoom / this.parent.scroller.currentZoom, delx, dely, focusPoint);
        } else {
            this.parent.pan(delx, dely, focusPoint);
        }
    }

    /** @private */
    public updateView(view: Overview): void {
        let width: number; let height: number;
        let bounds: Rect = this.parent.scroller.getPageBounds();
        width = bounds.width;
        height = bounds.height;
        let offwidth: number = Number(this.model.width);
        let offheight: number = Number(this.model.height);
        let scale: number;
        let w: number = Math.max(width, this.parent.scroller.viewPortWidth);
        let h: number = Math.max(height, this.parent.scroller.viewPortHeight);
        this.contentWidth = w = Math.max(w, (offwidth / offheight) * h);
        this.contentHeight = h = Math.max(h, (offheight / offwidth) * w);
        scale = Math.min(offwidth / w, offheight / h);
        let htmlLayer: HTMLElement = document.getElementById(this.element.id + '_htmlLayer');
        htmlLayer.style.webkitTransform = 'scale(' + scale + ') translate(' + -bounds.x + 'px,' + (-bounds.y) + 'px)';
        htmlLayer.style.transform = 'scale(' + scale + ') translate(' + -bounds.x + 'px,' + (-bounds.y) + 'px)';
        let ovw: HTMLElement = document.getElementById(this.element.id + '_overviewlayer');
        ovw.setAttribute('transform', 'translate(' + (-bounds.x * scale) + ',' + (-bounds.y * scale) + ')');
        this.horizontalOffset = bounds.x * scale;
        this.verticalOffset = bounds.y * scale;
        let canvas: HTMLElement = document.getElementById(this.element.id + '_diagramLayer');
        let nativeLayer: SVGElement = getNativeLayer(this.element.id);
        let context: CanvasRenderingContext2D = (canvas as HTMLCanvasElement).getContext('2d');
        let widthratio: number = (Number(this.model.width) / this.contentWidth);
        let heightratio: number = (Number(this.model.height) / this.contentHeight);
        widthratio = Math.min(widthratio, heightratio);
        nativeLayer.setAttribute(
            'transform', 'translate('
            + (0) + ',' + (0) + '),scale('
            + widthratio + ')');
        context.setTransform(widthratio, 0, 0, widthratio, 0, 0);
        context.fillStyle = 'red';
        this.scrollOverviewRect(
            this.parent.scroller.horizontalOffset, this.parent.scroller.verticalOffset, this.parent.scroller.currentZoom);
    }


    // region - Event Handlers


    private scrolled(evt: PointerEvent): void {
        if (this.event) {
            let bounds: Rect = this.scrollOverviewRect(
                this.parent.scroller.horizontalOffset, this.parent.scroller.verticalOffset, this.parent.scroller.currentZoom, true);
            this.updateOverviewrect(-bounds.x, -bounds.y, bounds.width, bounds.height);
        }
    }


    private updateCursor(evt: PointerEvent | TouchEvent): void {
        if (hasClass(evt.target as HTMLElement, ('overviewresizer'))) {
            switch ((evt.target as HTMLElement).id) {
                case this.canvas.id + 'left':
                    this.canvas.style.cursor = 'w-resize';
                    break;
                case this.canvas.id + 'right':
                    this.canvas.style.cursor = 'e-resize'; break;
                case this.canvas.id + 'top':
                    this.canvas.style.cursor = 'n-resize'; break;
                case this.canvas.id + 'bottom':
                    this.canvas.style.cursor = 's-resize'; break;
                case this.canvas.id + 'topleft':
                    this.canvas.style.cursor = 'nw-resize'; break;
                case this.canvas.id + 'topright':
                    this.canvas.style.cursor = 'ne-resize'; break;
                case this.canvas.id + 'bottomleft':
                    this.canvas.style.cursor = 'sw-resize'; break;
                case this.canvas.id + 'bottomright':
                    this.canvas.style.cursor = 'se-resize'; break;
            }
        } else {
            this.canvas.style.cursor = 'default';
        }

    }

    private mouseMove(evt: PointerEvent | TouchEvent): void {
        this.event = false;
        this.updateCursor(evt);
        this.currentPoint = this.mousePosition(evt);
        if (this.actionName) {
            switch (this.actionName) {
                case 'draw':
                    if (!this.inAction && (this.startPoint.x !== this.currentPoint.x || this.startPoint.y !== this.currentPoint.y)) {
                        this.initHelper();
                        this.inAction = true;
                    }
                    if (this.inAction) {
                        this.updateHelper();
                    }
                    break;
                case 'scale':
                    if (!this.inAction) {
                        this.initHelper();
                        this.inAction = true;
                    }
                    this.updateOverviewRectangle();
                    break;
                case 'pan':
                    if ((this.startPoint.x !== this.currentPoint.x || this.startPoint.y === this.currentPoint.y) || this.inAction) {
                        this.inAction = true;
                        this.translateOverviewRectangle();
                    }
                    break;

            }
        }
        this.prevPoint = this.currentPoint;
    }

    private documentMouseUp(evt: PointerEvent | TouchEvent): void {
        this.inAction = false;
        this.actionName = '';
        if (this.helper) {
            this.helper.parentNode.removeChild(this.helper);
            this.helper = null;
        }
        this.event = true;
        document.getElementById(this.canvas.id + 'overviewhandle').style.pointerEvents = 'all';
    }


    private windowResize(evt: Event): boolean {
        if (this.resizeTo) {
            clearTimeout(this.resizeTo as number);
        }
        this.resizeTo = setTimeout(
            (): void => {
                let element: HTMLElement = document.getElementById(this.element.id);
                let bRect: ClientRect = element.getBoundingClientRect();
                this.model.width = bRect.width;
                this.model.height = bRect.height;
                this.renderCanvas();
                this.setParent(this.sourceID);
            },
            10);
        return false;
    }
    /** @private */
    public mouseDown(evt: PointerEvent | TouchEvent): void {
        if ((evt.target as HTMLElement).id === this.canvas.id + '_overviewsvg') {
            this.actionName = 'draw';
        }
        if ((evt.target as HTMLElement).id === this.canvas.id + 'overviewrect') {
            this.actionName = 'pan';
        }
        if (hasClass(evt.target as HTMLElement, 'overviewresizer')) {
            this.actionName = 'scale';
            switch ((evt.target as HTMLElement).id) {
                case this.canvas.id + 'left':
                    this.resizeDirection = 'left';
                    break;
                case this.canvas.id + 'right':
                    this.resizeDirection = 'right'; break;
                case this.canvas.id + 'top':
                    this.resizeDirection = 'top'; break;
                case this.canvas.id + 'bottom':
                    this.resizeDirection = 'bottom'; break;
                case this.canvas.id + 'topleft':
                    this.resizeDirection = 'topleft'; break;
                case this.canvas.id + 'topright':
                    this.resizeDirection = 'topright'; break;
                case this.canvas.id + 'bottomleft':
                    this.resizeDirection = 'bottomleft'; break;
                case this.canvas.id + 'bottomright':
                    this.resizeDirection = 'bottomright'; break;
            }
        }
        this.startPoint = this.prevPoint = this.mousePosition(evt);
        this.viewPortRatio = this.parent.scroller.viewPortWidth / this.parent.scroller.viewPortHeight;
        let overViewHandle: HTMLElement = document.getElementById(this.canvas.id + 'overviewhandle');
        overViewHandle.style.pointerEvents = 'none';
    }

    private mouseUp(evt: PointerEvent | TouchEvent): void {
        this.currentPoint = this.mousePosition(evt);
        let offwidth: number = Number(this.model.width);
        let offheight: number = Number(this.model.height);
        if (this.actionName) {
            if ((this.startPoint.x !== this.currentPoint.x || this.startPoint.y !== this.currentPoint.y)) {
                if (this.actionName === 'pan') {
                    let i: number = 0;
                } else {
                    if (this.helper) {
                        let bounds: SVGRect = (this.element.getElementsByTagName('rect')[10]).getBBox();
                        this.resizeDirection = this.resizeDirection || '';
                        let x: number = bounds.x;
                        let y: number = bounds.y;
                        let width: number = bounds.width;
                        let height: number = bounds.height;
                        let adjust: boolean = this.resizeDirection === 'topleft' || this.resizeDirection === 'topright' ||
                            this.resizeDirection === 'bottomleft' || this.resizeDirection === 'bottomright';
                        this.renderOverviewRect(x, y, width, height);
                    }
                }
            } else {
                if ((evt.target as HTMLElement).id === this.canvas.id + '_overviewsvg' || (evt.target as HTMLElement).id === 'helper') {
                    let svg: SVGSVGElement = this.element.getElementsByTagName('svg')[2];
                    let g: SVGRectElement = (svg as SVGSVGElement).getElementById(this.canvas.id
                        + 'overviewrect') as SVGRectElement;
                    let bounds: SVGRect = g.getBBox();
                    let width: number = bounds.width;
                    let height: number = bounds.height;
                    this.inAction = true;
                    this.actionName = 'pan';
                    this.renderOverviewRect(this.currentPoint.x - width / 2, this.currentPoint.y - height / 2, width, height);
                    this.inAction = false;
                }
            }
        }
        if (this.helper) {
            this.helper.parentNode.removeChild(this.helper);
            this.helper = null;
        }
        this.actionName = '';
        this.startPoint = null;
        this.currentPoint = null;
        this.prevPoint = null;
        this.helper = null;
        this.viewPortRatio = 1;
        this.resizeDirection = '';
        this.inAction = false;
        this.event = true;
        document.getElementById(this.canvas.id + 'overviewhandle').style.pointerEvents = 'all';
    }

    private initHelper(): void {
        let g: SVGElement = this.element.getElementsByTagName('svg')[2];
        let scale: number = this.parent.scroller.currentZoom;
        let x: number = this.startPoint.x;
        let y: number = this.startPoint.y; let width: number = 1; let height: number = 1;
        if (this.actionName === 'scale') {
            let rect: SVGRectElement = (g as SVGSVGElement).
                getElementById(this.canvas.id + 'overviewrect') as SVGRectElement;
            let bounds: SVGRect = rect.getBBox();
            x = bounds.x; y = bounds.y; width = bounds.width; height = bounds.height;
        }
        let selectionRect: SVGElement = createSvgElement('rect', {
            'id': 'helper', x: x, y: y, width: width, height: height,
            'fill': 'transparent', 'stroke': 'gray', 'stroke-dasharray': '2 2', 'shape-rendering': 'crispEdges'
        });
        let overviewLayer: SVGElement = (g as SVGSVGElement).getElementById(this.element.id + '_overviewlayer') as SVGElement;
        overviewLayer.appendChild(selectionRect);
        this.helper = selectionRect;
    }

    private mousePosition(evt: PointerEvent | TouchEvent | WheelEvent): PointModel {
        let touchArg: TouchEvent;
        let offsetX: number;
        let offsetY: number;
        if (evt.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>evt;
            let pageX: number = touchArg.changedTouches[0].clientX;
            let pageY: number = touchArg.changedTouches[0].clientY;
            offsetX = pageX - this.element.offsetLeft;
            offsetY = pageY - this.element.offsetTop;
        } else {
            offsetX = (evt as PointerEvent).clientX;
            offsetY = (evt as PointerEvent).clientY;
        }
        let boundingRect: ClientRect = this.element.getBoundingClientRect();
        offsetX = offsetX - boundingRect.left;
        offsetY = offsetY - boundingRect.top;
        return { x: offsetX + this.horizontalOffset, y: offsetY + this.verticalOffset };
    }

    // end region - Event handlers




    /**
     * To destroy the Overview
     * @return {void}
     * @private
     */

    public destroy(): void {
        this.unWireEvents();
        this.notify('destroy', {});
        super.destroy();
        if (document.getElementById(this.element.id)) {
            this.element.classList.remove('e-overview');
            let content: HTMLElement = document.getElementById(this.element.id + '_canvas');
            if (content) {
                this.element.removeChild(content);
            }
        }
        this.parent.views.splice(this.parent.views.indexOf(this.element.id), 1);
        this.diagramLayerDiv = null;
        this.canvas = null;
        this.parent = null;
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'Overview';

    }

}
