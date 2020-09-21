import { Browser, isBlazor } from '@syncfusion/ej2-base';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { DiagramRenderer } from './rendering/renderer';
import { ConnectorModel } from './objects/connector-model';
import { NodeModel, ImageModel } from './objects/node-model';
import { Size } from './primitives/size';
import { DiagramRegions, SnapConstraints, PageOrientation } from './enum/enum';
import { setAttributeHtml, setAttributeSvg, createHtmlElement } from './utility/dom-util';
import { Rect } from './primitives/rect';
import { MarginModel } from './core/appearance-model';
import { createSvgElement, getHTMLLayer } from './utility/dom-util';
import { getDiagramLayerSvg } from './utility/dom-util';
import { checkBrowserInfo } from './utility/diagram-util';
import { Diagram } from './diagram';
import { BackgroundModel } from './diagram/page-settings-model';
import { IExportOptions } from './objects/interface/interfaces';
import { DiagramHtmlElement } from './core/elements/html-element';
import { DiagramNativeElement } from './core/elements/native-element';
import { DiagramElement } from './core/elements/diagram-element';
import { Container } from './core/containers/container';



/**
 * Print and Export Settings
 */
export class PrintAndExport {

    private diagram: Diagram;

    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }

    /**
     * To Export the diagram
     * @private
     */
    public exportDiagram(options: IExportOptions): string | SVGElement {
        let fileType: string;
        let customBounds: boolean;
        let content: SVGElement;
        let content1: string = '';
        let data: string = 'data';
        let mode: string;
        let buffers: string[] = [];
        let margin: MarginModel = options.margin || {};
        let region: DiagramRegions = options && options.region ? options.region : 'Content';
        mode = options && options.mode ? options.mode : 'Download';
        let bounds: Rect = this.getDiagramBounds(region, options);
        if (options.bounds) {
            customBounds = true;
            bounds.x = options.bounds.x ? options.bounds.x : bounds.x;
            bounds.y = options.bounds.y ? options.bounds.y : bounds.y;
            bounds.width = options.bounds.width || bounds.width;
            bounds.height = options.bounds.height || bounds.height;
        }
        margin = {
            top: margin.top !== undefined ? margin.top : 25,
            bottom: margin.bottom !== undefined ? margin.bottom : 25,
            right: margin.right !== undefined ? margin.right : 25,
            left: margin.left !== undefined ? margin.left : 25
        };
        let nodes: NodeModel[] = this.diagram.nodes;
        if (region !== 'PageSettings') {
            bounds.x -= margin.left;
            bounds.y -= margin.top;
            bounds.width += margin.left + margin.right;
            bounds.height += margin.top + margin.bottom;
        }
        let fileName: string = options.fileName || 'diagram';
        if (options.format !== 'SVG') {
            data = this.setCanvas(options, bounds, margin, mode, customBounds, region, fileName);
            if (data !== null) {
                return data;
            }
        } else {
            fileType = options.format;
            options.bounds = bounds;
            options.margin = margin;
            let svg: SVGElement = content = this.diagramAsSvg(options, margin);
            if (mode === 'Data') {
            if (isBlazor() && options.format === 'SVG') {
                let svgData: string = new XMLSerializer().serializeToString(svg);
                return svgData;
            }
            return content;
            }
            let buffer: string = new XMLSerializer().serializeToString(svg);
            buffers.push(buffer);
        }
        if (mode === 'Download' && data !== null) {
            let browserInfo: Browser;
            // Ensure this for Safari
            // if (Browser.info.name === 'msie' && Number(Browser.info.version) < 10 || Browser.info.name === 'webkit') {
            //     let info: string = Browser.info.name === 'webkit' ? 'Safari' : 'IE-9';
            //     alert('Downloading option is not supported in ' + info + ', Please use the returned data');
            //     return content;
            // } else {
            for (let b: number = 0; b < buffers.length; b++) {
                let blob: Blob = new Blob([buffers[b]], { type: 'application/octet-stream' });
                if (Browser.info.name === 'msie') {
                    window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + fileType);
                } else {
                    let pom: HTMLAnchorElement = createHtmlElement('a', { 'download': fileName + '.' + fileType }) as HTMLAnchorElement;
                    let url: string = URL.createObjectURL(blob);
                    pom.href = url;
                    let e: MouseEvent = document.createEvent('MouseEvents');
                    e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    pom.dispatchEvent(e);
                }
            }
        }
        return null;
    }
    private setCanvas(
        options: IExportOptions, bounds: Rect, margin: MarginModel, mode: string, customBounds: boolean,
        region: DiagramRegions, fileName: string): string {
        let content: string;
        options.bounds = bounds;
        options.region = region;
        let scaleX: string = 'scaleX';
        let scaleY: string = 'scaleY';
        let scaleOffsetX: string = 'scaleOffsetX';
        let scaleOffsetY: string = 'scaleOffsetY';
        this.setScaleValueforCanvas(options, bounds);
        let canvas: HTMLCanvasElement = this.diagramAsCanvas(
            {
                bounds: bounds, margin: margin, region: region, scaleX: options[scaleX],
                scaleY: options[scaleY], scaleOffsetX: options[scaleOffsetX], scaleOffsetY: options[scaleOffsetY]
            } as IExportOptions,
            customBounds);
        let image: string;
        if (options.format === 'JPG') {
            image = content = canvas.toDataURL('image/jpeg');
        } else {
            image = content = canvas.toDataURL();
        }
        if (mode === 'Data') {
            return content;
        }
        this.canvasMultiplePage(options, canvas, margin, image, fileName);
        return null;
    }

    private canvasMultiplePage(
        options: IExportOptions, canvas: HTMLCanvasElement, margin: MarginModel, image: string, fileName: string): void {
        let images: HTMLElement | string[] = [];
        let fileType: string = options.format || 'JPG';

        if (options.multiplePage) {
            options.pageHeight = options.pageHeight ? options.pageHeight : this.diagram.pageSettings.height;
            options.pageWidth = options.pageWidth ? options.pageWidth : this.diagram.pageSettings.width;
            options.pageHeight = options.pageHeight ? options.pageHeight : canvas.width;
            options.pageWidth = options.pageWidth ? options.pageWidth : canvas.height;
            margin = options.margin || {};
            if (options.pageOrientation) {
                if ((options.pageOrientation === 'Landscape' && options.pageHeight > options.pageWidth) ||
                    options.pageOrientation === 'Portrait' && options.pageWidth > options.pageHeight) {
                    let temp: number = options.pageWidth;
                    options.pageWidth = options.pageHeight;
                    options.pageHeight = temp;
                }
            }
            options.margin = {
                top: !isNaN(margin.top) ? margin.top : 0,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
                left: !isNaN(margin.left) ? margin.left : 0,
                right: !isNaN(margin.right) ? margin.right : 0
            };
            let attr: Object = {
                'id': this.diagram.element.id + '_printImage',
                'src': image,
            };
            let img: HTMLImageElement = createHtmlElement('img', attr) as HTMLImageElement;
            img.onload = () => {
                images = this.getMultipleImage(img, options, true);
                this.exportImage(images, fileName, fileType, image);
            };
        } else {
            images = [image];
            this.exportImage(images, fileName, fileType, image);
        }
    }

    private exportImage(images: string[] | HTMLElement, fileName: string, fileType: string, image: string): void {
        let buffers: ArrayBuffer[] = [];
        let length: number = (!(images instanceof HTMLElement)) ? images.length : 0;
        for (let g: number = 0; g < length; g++) {
            image = images[g];
            image = image.replace(/^data:[a-z]*;,/, '');
            let image1: string[] = image.split(',');
            let byteString: string = atob(image1[1]);
            let buffer: ArrayBuffer = new ArrayBuffer(byteString.length);
            let intArray: Uint8Array = new Uint8Array(buffer);
            for (let i: number = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            buffers.push(buffer);
        }
        // Ensure this for safari
        // if (Browser.info.name === 'msie' && Number(Browser.info.version) < 10 || Browser.info.name === 'webkit') {
        //     let browserInfo: string = Browser.info.name === 'webkit' ? 'Safari' : 'IE-9';
        //     alert('Downloading option is not supported in ' + browserInfo + ', Please use the returned data');
        //     return content;
        // } else {
        for (let j: number = 0; j < buffers.length; j++) {
            let b: Blob = new Blob([buffers[j]], { type: 'application/octet-stream' });
            if (Browser.info.name === 'msie') {
                window.navigator.msSaveOrOpenBlob(b, fileName + '.' + fileType);
            } else {
                let htmlElement: HTMLAnchorElement = createHtmlElement('a', { 'download': fileName + '.' + fileType }) as HTMLAnchorElement;
                let urlLink: string = URL.createObjectURL(b);
                htmlElement.href = urlLink;
                let mouseEvent: MouseEvent = document.createEvent('MouseEvents');
                mouseEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                setTimeout(
                    () => {
                        htmlElement.dispatchEvent(mouseEvent);
                    },
                    ((j + 1) * 5));

            }
        }
    }
    /**   @private  */
    public getObjectsBound(options?: IExportOptions): Rect {
        let nodes: NodeModel[] = this.diagram.nodes;
        let nodebounds: Rect;
        for (let node of nodes) {
            if (node.visible) {
                if (((options.format !== 'SVG' && !(node instanceof DiagramNativeElement) && !(node instanceof DiagramHtmlElement))
                    || (options.format === 'SVG' && !(node instanceof DiagramHtmlElement)))) {
                    if (!nodebounds) {
                        nodebounds = node.wrapper.outerBounds;
                    } else {
                        nodebounds = nodebounds.uniteRect(node.wrapper.outerBounds);
                    }
                }
            }
        }
        let connectors: ConnectorModel[] = this.diagram.connectors;
        for (let connector of connectors) {
            if (connector.visible) {
                if (!nodebounds) {
                    nodebounds = connector.wrapper.outerBounds;
                } else {
                    nodebounds = nodebounds.uniteRect(connector.wrapper.outerBounds);
                }
            }
        }
        return nodebounds || new Rect(0, 0, 0, 0);
    }

    /**   @private  */
    public getDiagramBounds(mode?: string, options?: IExportOptions): Rect {
        let rect: Rect = this.getObjectsBound(options);
        let left: number = rect.left;
        let top: number = rect.top;
        let right: number = rect.right - rect.left;
        let bottom: number = rect.bottom - rect.top;
        if (mode !== 'Content') {
            if (this.diagram.pageSettings && this.diagram.pageSettings.multiplePage) {
                left = rect.left;
                top = rect.top;
                if (this.diagram.pageSettings.width) {
                    left = Math.floor(left / this.diagram.pageSettings.width) * this.diagram.pageSettings.width;
                    right = Math.ceil(
                        rect.right / this.diagram.pageSettings.width) * this.diagram.pageSettings.width - left;
                }
                if (this.diagram.pageSettings.height) {
                    top = Math.floor(top / this.diagram.pageSettings.height) * this.diagram.pageSettings.height;
                    bottom = Math.ceil(
                        rect.bottom / this.diagram.pageSettings.height) * this.diagram.pageSettings.height - top;
                }
                if ((rect.width === 0) && this.diagram.pageSettings.width !== null) {
                    right = this.diagram.pageSettings.width;
                }
                if ((rect.height === 0) && this.diagram.pageSettings.height !== null) {
                    bottom = this.diagram.pageSettings.height;
                }
            } else {
                if (this.diagram.pageSettings.width) {
                    left = 0;
                    right = this.diagram.pageSettings.width;
                }
                if (this.diagram.pageSettings.height) {
                    top = 0;
                    bottom = this.diagram.pageSettings.height;
                }
            }
        }
        let svgBounds: Rect = new Rect();
        svgBounds.x = left;
        svgBounds.y = top;
        svgBounds.width = right;
        svgBounds.height = bottom;
        return svgBounds;
    }

    private setScaleValueforCanvas(options: IExportOptions, bounds: Rect): void {
        let scaleX: string = 'scaleX';
        let scaleY: string = 'scaleY';
        let scaleOffsetX: string = 'scaleOffsetX';
        let scaleOffsetY: string = 'scaleOffsetY';
        options[scaleX] = 1;
        options[scaleY] = 1;
        options[scaleOffsetX] = 0;
        options[scaleOffsetY] = 0;
        options.pageHeight = options.pageHeight || this.diagram.pageSettings.height;
        options.pageWidth = options.pageWidth || this.diagram.pageSettings.width;
        let pageOrientation: PageOrientation = options.pageOrientation || this.diagram.pageSettings.orientation;
        if (!pageOrientation) {
            pageOrientation = 'Portrait';
        }
        if (pageOrientation === 'Portrait') {
            if (options.pageWidth > options.pageHeight) {
                let temp: number = options.pageHeight;
                options.pageHeight = options.pageWidth;
                options.pageWidth = temp;
            }
        } else {
            if (options.pageHeight > options.pageWidth) {
                let temp: number = options.pageWidth;
                options.pageWidth = options.pageHeight;
                options.pageHeight = temp;
            }
        }
        if (options.pageWidth && options.pageHeight && !options.multiplePage) {
            options.stretch = 'Meet';
        }
        let height: number = options.pageHeight || bounds.height;
        let width: number = options.pageWidth || bounds.width;
        if (options.stretch === 'Stretch' || options.stretch === 'Meet' || options.stretch === 'Slice') {
            options[scaleX] = width / bounds.width;
            options[scaleY] = height / bounds.height;
            if (options.stretch === 'Meet') {
                options[scaleX] = options[scaleY] = Math.min(options[scaleX], options[scaleY]);
                options[scaleOffsetY] = (options.pageHeight - bounds.height * options[scaleX]) / 2;
                options[scaleOffsetX] = (options.pageWidth - bounds.width * options[scaleX]) / 2;
            } else if (options.stretch === 'Slice') {
                options[scaleX] = options[scaleY] = Math.max(options[scaleX], options[scaleY]);
            }
            bounds.width = width;
            bounds.height = height;
        }
        bounds.x *= options[scaleX];
        bounds.y *= options[scaleY];
    }

    private diagramAsSvg(options: IExportOptions, margin: MarginModel): SVGElement {
        let svg: SVGElement = this.diagram.createSvg(this.diagram.element.id + '_diagram_svg', options.bounds.width, options.bounds.height);
        document.body.appendChild(svg);
        let g: SVGElement = createSvgElement('g', { 'id': this.diagram.element.id + '_pageBackground' });
        let region: DiagramRegions = options && options.region ? options.region : 'Content';
        let bounds: Rect = this.getDiagramBounds(region, options);
        let left: number = bounds.x;
        let top: number = bounds.y;
        let width: number = bounds.width;
        let height: number = bounds.height;
        svg.appendChild(g);
        let attr: Object = {
            'x': String(left),
            'y': String(top), 'width': String(width), 'height': String(height)
        };
        setAttributeSvg(g, attr);
        this.setTransform(g, options.bounds, margin);
        let gradient: HTMLElement = document.getElementById(this.diagram.element.id + 'gradient_pattern');
        if (gradient) {
            svg.appendChild(gradient);
        }
        attr = {
            'x': String(left),
            'y': String(top), 'width': String(width + margin.left + margin.right), 'height': String(height + margin.top + margin.bottom)
        };
        let backimage: SVGElement =
            document.getElementById(this.diagram.element.id + '_backgroundImageLayer').cloneNode(true) as SVGElement;
        setAttributeSvg(backimage, attr);
        svg.appendChild(backimage);
        this.setTransform(backimage, bounds, margin);
        let backRect: SVGElement = document.getElementById(this.diagram.element.id + '_backgroundLayerrect').cloneNode(true) as SVGElement;
        setAttributeSvg(backRect, attr);
        svg.appendChild(backRect);
        this.setTransform(backRect, bounds, margin);

        if (this.diagram.mode === 'SVG') {
            let element: HTMLElement;
            let i: number;
            let diagramLayerSVG: SVGSVGElement = getDiagramLayerSvg(this.diagram.element.id);
            svg.appendChild(diagramLayerSVG.getElementById(this.diagram.diagramLayer.id).cloneNode(true));
            for (i = 0; i < svg.childNodes.length; i++) {
                element = svg.childNodes[i] as HTMLElement;
                if (element.id === this.diagram.element.id + '_diagramLayer') {
                    this.setTransform(element, bounds, margin);
                }
            }
        } else {
            g = createSvgElement('g', { 'id': this.diagram.element.id + '_diagramLayer' });
            svg.appendChild(g);
            this.setTransform(g, options.bounds, margin);
            //renderLabels
            let renderer: DiagramRenderer = new DiagramRenderer('', null, true);
            let htmlLayer: HTMLElement = getHTMLLayer(this.diagram.element.id);
            this.diagram.renderDiagramElements(svg, renderer, htmlLayer, false);
        }
        document.body.removeChild(svg);
        return svg;
    }
    private setTransform(element: HTMLElement | SVGElement, bounds: Rect, margin: MarginModel): void {
        element.setAttribute('transform', 'translate(' + (-bounds.x + margin.left) + ', ' +
            (-bounds.y + margin.top) + ')');
    }
    private diagramAsCanvas(options: IExportOptions, customBounds: boolean): HTMLCanvasElement {
        let scaleX: string = 'scaleX';
        let scaleY: string = 'scaleY';
        let scaleOffsetX: string = 'scaleOffsetX';
        let scaleOffsetY: string = 'scaleOffsetY';
        let element: NodeModel | ConnectorModel;
        let elements: NodeModel[] | ConnectorModel[] = [];
        let region: Rect = options.bounds;
        let margin: MarginModel = options.margin;
        let mode: DiagramRegions = options && options.region ? options.region : 'Content';
        let pageBounds: Rect = this.getDiagramBounds(mode, options);
        let bgColor: string = this.diagram.pageSettings.background.color;
        let canvas: HTMLCanvasElement = CanvasRenderer.createCanvas(
            this.diagram.element.id + '_diagram', options.bounds.width, options.bounds.height);
        //canvas.setAttribute('style', 'position:absolute;top:135px;left:160px;');
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.translate(-region.x, -region.y);
        context.save();
        context.fillStyle = this.diagram.pageSettings.background.color;
        region = mode === 'Content' ? pageBounds : region;
        context.fillRect(region.x, region.y, region.width, region.height);
        let bgImg: BackgroundModel = this.diagram.pageSettings.background;
        if (bgImg && bgImg.source) {
            pageBounds = this.getDiagramBounds(mode, options);
            let image: HTMLImageElement = new Image();
            image.src = bgImg.source;
            let proportionX: number = pageBounds.width / image.width;
            let proportionY: number = pageBounds.height / image.height;
            let x: number = pageBounds.x;
            let y: number = pageBounds.y;
            let width: number = pageBounds.width;
            let height: number = pageBounds.height;
            let exportable: boolean = this.isImageExportable(bgImg);
            if (bgImg.scale !== 'None' && bgImg.align !== 'None') {
                let proportion: number = bgImg.scale === 'Meet' ? Math.min(proportionX, proportionY) : Math.max(proportionX, proportionY);
                width = proportion * image.width;
                height = proportion * image.height;
                if (bgImg.align.indexOf('xmid') > -1) {
                    x += (pageBounds.width - width) / 2;
                } else if (bgImg.align.indexOf('xmax') > -1) {
                    x = x + pageBounds.width - width;
                }
                if (bgImg.align.indexOf('ymid') > -1) {
                    y += (pageBounds.height - height) / 2;
                } else if (bgImg.align.indexOf('ymax') > -1) {
                    y = y + pageBounds.height - height;
                }
                if (this.diagram.pageSettings.background.color === 'none' || this.diagram.pageSettings.background.color === 'transparent') {
                    context.fillStyle = 'white';
                    context.fillRect(
                        pageBounds.x * options[scaleX], pageBounds.y * options[scaleY], pageBounds.width * options[scaleX],
                        pageBounds.height * options[scaleY]);
                }
                if (exportable) {
                    context.drawImage(image, x, y, proportion * image.width, proportion * image.height);
                }
            } else if (exportable) {
                context.drawImage(image, x, y, pageBounds.width, pageBounds.height);
            }
        } else {
            context.fillStyle = bgColor === 'transparent' ? 'white' : bgColor;
            context.fillRect(
                (pageBounds.x * options[scaleX]) - margin.left, (pageBounds.y * options[scaleY]) - margin.top,
                (pageBounds.width * options[scaleX]) + margin.left + margin.right,
                (options[scaleY] * pageBounds.height) + margin.top + margin.bottom);
        }
        let brColor: string = this.diagram.pageSettings.background.color;
        let brWidth: number = this.diagram.pageSettings.width;
        if (brWidth) {
            context.strokeStyle = brColor === 'none' ? 'transparent' : brColor;
            context.lineWidth = brWidth;
            context.strokeRect(
                pageBounds.x * options[scaleX], pageBounds.y * options[scaleY], pageBounds.width * options[scaleX],
                pageBounds.height * options[scaleY]);
        }
        context.restore();
        let htmlLayer: HTMLElement = getHTMLLayer(this.diagram.element.id);
        let renderer: DiagramRenderer = new DiagramRenderer('', null, false);
        this.updateObjectValue(options[scaleX], options[scaleOffsetX], options[scaleOffsetY], true);
        this.diagram.renderDiagramElements(canvas, renderer, htmlLayer, false, true);
        this.updateObjectValue(options[scaleX], options[scaleOffsetX], options[scaleOffsetY], false);
        return canvas;
    }

    private updateWrapper(
        canvas: Container | DiagramElement[], value: number,
        scaleOffsetX: number, scaleOffsetY: number, isExport: boolean): void {
        if (canvas && (canvas as DiagramElement[]).length > 0) {
            for (let j: number = 0; j < (canvas as DiagramElement[]).length; j++) {
                if (canvas[j].children) {
                    this.updateWrapper(canvas[j].children, value, scaleOffsetX, scaleOffsetY, isExport);
                }
                canvas[j].exportScaleValue.x = value;
                canvas[j].exportScaleValue.y = value;
                canvas[j].exportScaleOffset.x = scaleOffsetX;
                canvas[j].exportScaleOffset.y = scaleOffsetY;
                canvas[j].isExport = isExport;
            }
        }
    }

    private updateObjectValue(value: number, scaleOffsetX: number, scaleOffsetY: number, isExport: boolean): void {
        let wrapper: Container;
        for (let i: number = 0; i < this.diagram.nodes.length; i++) {
            wrapper = this.diagram.nodes[i].wrapper;
            this.updateWrapper(wrapper.children, value, scaleOffsetX, scaleOffsetY, isExport);
            wrapper.exportScaleValue.x = value;
            wrapper.exportScaleValue.y = value;
            wrapper.exportScaleOffset.x = scaleOffsetX;
            wrapper.exportScaleOffset.y = scaleOffsetY;
            wrapper.isExport = isExport;
        }
        for (let j: number = 0; j < this.diagram.connectors.length; j++) {
            wrapper = this.diagram.connectors[j].wrapper;
            for (let k: number = 0; k < wrapper.children.length; k++) {
                wrapper.children[k].isExport = isExport;
                if (isExport) {
                    wrapper.children[k].exportScaleValue.x = value;
                    wrapper.children[k].exportScaleValue.y = value;
                    wrapper.children[k].exportScaleOffset.x = scaleOffsetX;
                    wrapper.children[k].exportScaleOffset.y = scaleOffsetY;
                }
            }
        }
    }
    private isImageExportable(backgroundImage: BackgroundModel | ImageModel): boolean {
        let state: boolean = true;
        let content: string;
        let canvas: HTMLCanvasElement;
        if (backgroundImage.source) {
            try {
                canvas = CanvasRenderer.createCanvas(this.diagram.element.id + 'temp_canvas', 100, 100);
                let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
                ctx.save();
                let image: HTMLImageElement = new Image();
                image.src = backgroundImage.source;
                ctx.drawImage(image, 0, 0, 100, 100);
                ctx.restore();
                content = canvas.toDataURL();
            } catch (e) {
                state = false;
            }
        }
        return state;
    }
    private getPrintCanvasStyle(img: HTMLImageElement, options: IExportOptions): Size {
        let width: number = 0;
        let height: number = 0;
        let size: Size = new Size();
        width = img.width;
        height = img.height;
        if (options.pageHeight || options.pageWidth) {
            height = options.pageHeight ? options.pageHeight : height;
            width = options.pageWidth ? options.pageWidth : width;
        }
        if (options.pageOrientation) {
            if ((options.pageOrientation === 'Landscape' && height > width) || options.pageOrientation === 'Portrait' && width > height) {
                let temp: number = width;
                width = height;
                height = temp;
            }
        }
        size.height = height;
        size.width = width;
        return size;
    }
    private getMultipleImage(img: HTMLImageElement, options: IExportOptions, isExport?: boolean): HTMLElement | string[] {
        let imageArray: string[] = [];
        let div: HTMLElement = createHtmlElement('div', {}) as HTMLDivElement;
        let pageSize: Size = this.getPrintCanvasStyle(img, options);
        let pageWidth: number;
        let pageHeight: number;
        let margin: MarginModel = options.margin;
        let mLeft: number = margin.left;
        let mTop: number = margin.top;
        let mRight: number = margin.right;
        let mBottom: number = margin.bottom;
        let x: number = 0;
        let y: number = 0;
        pageWidth = pageSize.width + x;
        pageHeight = pageSize.height + y;
        let drawnX: number = 0;
        let drawnY: number = 0;
        if (options && options.multiplePage) {
            div.style.height = 'auto';
            div.style.width = 'auto';
            let imgHeight: number = img.height;
            let imgWidth: number = img.width;
            //if (img) {
            let i: number = 0; let j: number = 0; let url: string; let clipWidth: number = 0; let clipHeight: number = 0;
            let ctx: CanvasRenderingContext2D; let canvas: HTMLCanvasElement;
            do {
                do {
                    clipWidth = pageSize.width;
                    clipHeight = pageSize.height;
                    if ((drawnX + pageSize.width) >= imgWidth) {
                        clipWidth = (imgWidth - drawnX);
                    }
                    if ((drawnY + pageSize.height) >= imgHeight) {
                        clipHeight = (imgHeight - drawnY);
                    }
                    canvas = CanvasRenderer.createCanvas(this.diagram.element.id + '_multiplePrint', pageSize.width, pageSize.height);
                    ctx = canvas.getContext('2d');
                    ctx.drawImage(
                        img, x + drawnX + mLeft,
                        y + drawnY + mTop,
                        clipWidth - mRight - mLeft,
                        clipHeight - mBottom - mTop,
                        0 + mLeft,
                        0 + mTop,
                        clipWidth - mRight - mLeft,
                        clipHeight - mBottom - mTop);

                    if ((drawnX + pageSize.width) >= imgWidth) {
                        drawnX -= (drawnX - imgWidth);
                    }
                    url = canvas.toDataURL();
                    ctx.restore();
                    drawnX += pageWidth;
                    if (isExport) {
                        imageArray.push(url);
                    } else {
                        this.printImage(div, url, i + '' + j, pageWidth + 'px;', pageHeight + 'px;');
                    }
                    i++;
                } while (drawnX < imgWidth);
                j++;
                i = x = drawnX = 0;
                if ((drawnY + pageSize.height) >= imgHeight) {
                    drawnY -= (drawnY - imgHeight);
                }
                drawnY += pageHeight;
            } while (drawnY < imgHeight);
            //}
        } else {
            let x: number = 0; let y: number = 0;
            let pageSize: Size = this.getPrintCanvasStyle(img, options);
            let pageWidth: number; let pageHeight: number;
            pageWidth = pageSize.width;
            pageHeight = pageSize.height;
            let ctx: CanvasRenderingContext2D; let canvas: HTMLCanvasElement; let url: string;
            canvas = CanvasRenderer.createCanvas(this.diagram.element.id + '_diagram', pageWidth, pageHeight);
            ctx = canvas.getContext('2d');
            ctx.drawImage(
                img, x + mLeft, y + mTop, img.width - (mRight + mLeft), img.height - (mTop + mBottom),
                0 + mLeft, 0 + mTop, pageWidth - (mRight + mLeft), pageHeight - (mTop + mBottom));
            url = canvas.toDataURL();
            ctx.restore();
            if (isExport) {
                imageArray.push(url);
            } else {
                this.printImage(div, url, 0);
            }
        }
        if (isExport) {
            return imageArray;
        } else {
            return div;
        }
    }

    private printImage(div: HTMLElement, url: string, i: string | number, pageWidth?: string, pageHeight?: string): void {
        let attr: Object = { 'class': 'e-diagram-print-page', 'style': 'width:' + pageWidth + 'height:' + pageHeight };
        let img: HTMLImageElement = createHtmlElement('img', attr) as HTMLImageElement;
        let innerDiv: HTMLDivElement = createHtmlElement('div', attr) as HTMLDivElement;
        attr = { 'id': this.diagram.element.id + '_multiplePrint_img' + i, 'style': 'float:left', 'src': url };
        setAttributeHtml(img, attr);
        innerDiv.appendChild(img);
        div.appendChild(innerDiv);
    }

    /**
     * To print the image
     * @private
     */

    public print(options: IExportOptions): void {
        options.mode = 'Data';
        let url: string | SVGElement = this.exportDiagram(options);
        this.printImages(url, options);

    }

    private printImages(url: string | SVGElement, options: IExportOptions): void {
        let attr: Object = {
            'id': this.diagram.element.id + '_printImage',
            'src': url,
        };
        options.margin = { top: 0, bottom: 0, right: 0, left: 0 };
        let img: HTMLImageElement = createHtmlElement('img', attr) as HTMLImageElement;
        img.onload = () => {
            let div: HTMLElement | string[] = this.getMultipleImage(img, options);
            // specify window parameters
            let printWind: Window = window.open('');
            if (printWind != null) {
                if ((div instanceof HTMLElement)) {
                    printWind.document.write(
                        '<html><head><style> body{margin:0px;}  @media print { .e-diagram-print-page' +
                        '{page-break-after: left; }.e-diagram-print-page:last-child {page-break-after: avoid;}}' +
                        '</style><title></title></head>');
                    printWind.document.write('<BODY onload="setTimeout(function(){window.print();}, 100)">');
                    printWind.document.write('<center>' + div.innerHTML + '</center>');
                    printWind.document.close();
                }
            }
        };
    }

    /** @private */
    public getDiagramContent(styleSheets?: StyleSheetList): string {
        let container: HTMLElement = document.getElementById(this.diagram.element.id + 'content');
        let scrollerX: number = container.scrollLeft;
        let scrollerY: number = container.scrollTop;
        let oldZoom: number = this.diagram.scrollSettings.currentZoom;
        let oldHorizontalOffset: number = this.diagram.scroller.horizontalOffset;
        let oldVerticalOffset: number = this.diagram.scroller.verticalOffset;
        let oldWidth: number = Number(String(this.diagram.width).split('px')[0]);
        let oldHeight: number = Number(String(this.diagram.height).split('px')[0]);
        let bounds: Rect = this.getDiagramBounds('', {});
        this.diagram.scroller.zoom((1 / oldZoom));
        let scrollX: number = 0;
        let scrollY: number = 0;
        scrollX = bounds.x;
        scrollY = bounds.y;
        this.diagram.scroller.transform = {
            tx: -scrollX,
            ty: -scrollY,
            scale: this.diagram.scroller.currentZoom
        };
        this.diagram.scroller.horizontalOffset = -scrollX;
        this.diagram.scroller.verticalOffset = -scrollY;
        this.diagram.scroller.setSize();
        this.diagram.setSize(bounds.width, bounds.height);
        let snapConstraints: SnapConstraints = this.diagram.snapSettings.constraints;
        this.diagram.snapSettings.constraints = (this.diagram.snapSettings.constraints & ~SnapConstraints.ShowLines);
        this.diagram.dataBind();
        this.diagram.clearSelection();
        styleSheets = styleSheets || document.styleSheets;
        let styleSheetRef: string = '';
        for (let i: number = 0; i < styleSheets.length; i++) {
            if (styleSheets[i].href || typeof styleSheets[i] === 'string') {
                styleSheetRef += '<link href=\'' + (styleSheets[i].href || styleSheets[i]) + '\' rel=\'stylesheet\' />';
            }
        }
        let htmlData: string = document.getElementById(this.diagram.element.id + 'content').innerHTML;
        let marginStyle: string = 'margin-left:' + 0 + 'px;margin-top:' + 0 + 'px;margin-right:'
            + 0 + 'px;margin-bottom:' + 0 + 'px;';
        htmlData = styleSheetRef + '<body style="margin: 0px; padding: 0px"><div style=\'' +
            marginStyle + '\'>' + htmlData + '</div></body>';
        htmlData = htmlData.replace(/ transform: t/g, ' -webkit-transform: t');
        this.diagram.setSize(oldWidth, oldHeight);
        this.diagram.scroller.zoom(oldZoom / this.diagram.scrollSettings.currentZoom);
        this.diagram.snapSettings.constraints = snapConstraints;
        this.diagram.dataBind();
        if (scrollerX || scrollerY) {
            this.diagram.setOffset(scrollerX, scrollerY);
        } else {
            this.diagram.scroller.transform = {
                tx: (oldHorizontalOffset) / this.diagram.scroller.currentZoom,
                ty: (oldVerticalOffset) / this.diagram.scroller.currentZoom,
                scale: this.diagram.scroller.currentZoom
            };
            this.diagram.scroller.horizontalOffset = oldHorizontalOffset;
            this.diagram.scroller.verticalOffset = oldVerticalOffset;
        }
        this.diagram.renderSelector(false);
        /* tslint:disable */
        return checkBrowserInfo() ? htmlData.replace("url(" + location.protocol + '//' + location.host + location.pathname + "#diagram_pattern ", "url(#diagram_pattern)") : htmlData;
        /* tslint:enable */
    }

    /** @private */
    public exportImages(image: string, options: IExportOptions): void {
        let region: DiagramRegions = options && options.region ? options.region : 'Content';
        let margin: MarginModel = options.margin || {};
        margin = {
            top: !isNaN(margin.top) ? margin.top : 0,
            bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
            left: !isNaN(margin.left) ? margin.left : 0,
            right: !isNaN(margin.right) ? margin.right : 0
        };
        let bounds: Rect = this.getDiagramBounds(region, {});
        if (options.bounds) {
            bounds.x = (!isNaN(options.bounds.x) ? options.bounds.x : bounds.x);
            bounds.y = (!isNaN(options.bounds.y) ? options.bounds.y : bounds.y);
            bounds.width = (options.bounds.width || bounds.width);
            bounds.height = (options.bounds.height || bounds.height);
        }
        let img: HTMLImageElement = document.createElement('img');
        let attr: {} = {
            'src': image
        };
        setAttributeHtml(img, attr);
        let context: PrintAndExport = this;
        img.onload = () => {
            let canvas: HTMLCanvasElement = CanvasRenderer.createCanvas(
                context.diagram.element.id + 'innerImage', bounds.width + (margin.left + margin.right),
                bounds.height + (margin.top + margin.bottom));
            let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
            ctx.fillStyle = context.diagram.pageSettings.background.color;
            ctx.fillRect(0, 0, bounds.width + (margin.left + margin.right), bounds.height + (margin.top + margin.bottom));
            ctx.drawImage(
                img, 0, 0, bounds.width, bounds.height,
                margin.left, margin.top, bounds.width, bounds.height);
            image = canvas.toDataURL();
            if (options.printOptions) {
                context.printImages(image, options);
                return;
            }
            ctx.restore();
            let fileName: string = options.fileName || 'diagram';
            this.canvasMultiplePage(options, canvas, margin, image, fileName);
        };
    }

    /**
     * To destroy the Print and Export module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the Print and Export module
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'PrintandExport';

    }
}

