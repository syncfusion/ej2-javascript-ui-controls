import { createElement, Browser } from '@syncfusion/ej2-base';

let Barcode: object = {
    getBarcodeSize(element: Element) {
        let bounds = element.getBoundingClientRect();
        let size: object = {};
        size["Width"] = bounds.width;
        size["Height"] = bounds.height;
        return size;
    },
    createHtmlElement(elementType: string, attribute?: Object): HTMLElement {
        let element: HTMLElement = createElement(elementType);
        if (attribute) {
            this.setAttribute(element, attribute);
        }
        return element;
    },
    setAttribute(element: HTMLElement | SVGElement, attributes: Object): void {
        let keys: string[] = Object.keys(attributes);
        for (let i: number = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], attributes[keys[i]]);
        }
    },
    createMeasureElements(): void {
        let measureElement: string = 'barcodeMeasureElement';
        if (!window[measureElement]) {
            let divElement: HTMLElement = this.createHtmlElement('div', {
                id: 'barcodeMeasureElement', class: 'barcodeMeasureElement',
                style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
            });
            let text: HTMLElement = this.createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
            divElement.appendChild(text);
            let svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            divElement.appendChild(svg);
            let tSpan: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
            svg.appendChild(tSpan);
            window[measureElement] = divElement;
            window[measureElement].usageCount = 1;
            document.body.appendChild(divElement);
        } else {
            window[measureElement].usageCount += 1;
        }
    },
    measureText(value: string, size: number, fontStyle: string): object {
        let measureElement: string = 'barcodeMeasureElement';
        window[measureElement].style.visibility = 'visible';
        let svg: SVGElement = window[measureElement].children[1];
        let text: SVGTextElement = this.getChildNode(svg)[0] as SVGTextElement;
        text.textContent = value;
        text.setAttribute('style', 'font-size:' + size + 'px; font-family:' + fontStyle + ';');
        let bounds: DOMRect = text.getBBox();
        let bBox: object = {};
        bBox["Width"] = bounds.width;
        bBox["Height"] = bounds.height;
        window[measureElement].style.visibility = 'hidden';
        return bBox;
    },
    getChildNode(node: SVGElement): SVGElement[] | HTMLCollection {
        let child: SVGElement;
        let collection: SVGElement[] | HTMLCollection = [];
        if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
            for (let i: number = 0; i < node.childNodes.length; i++) {
                child = node.childNodes[i] as SVGElement;
                if (child.nodeType === 1) {
                    collection.push(child);
                }
            }
        } else {
            collection = node.children;
        }
        return collection;
    },
    checkOverlapTextPosition: function (value: number, stringSize: number, fontStyle: string, barcodeStartX: number, barcodeWidth: number, textStartX: number, marginRight: number, options: object) {
        options = options || {}; options["stringSize"] = stringSize;
        var size = this.measureText(value, stringSize, fontStyle);
        var endValue = barcodeStartX + barcodeWidth;
        if ((endValue - (textStartX + size.Width) <= marginRight) && stringSize > 2) {
            options["stringSize"] -= .2;
            this.checkOverlapTextPosition(value, options["stringSize"], fontStyle, barcodeStartX, barcodeWidth, textStartX, marginRight, options);
        }
        return options["stringSize"];
    },
    triggerDownload(type: string, fileName: string, url: string): void {
        let anchorElement: HTMLAnchorElement = document.createElement('a');
        anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
        anchorElement.href = url;
        anchorElement.click();
    },
    async exportAsImage(exportType: string, fileName: string, element: Element, isReturnBase64: boolean): Promise<string> {
        let returnValue: Promise<string> = await this.imageExport(exportType, fileName, element, isReturnBase64);
        if (returnValue instanceof Promise) {
            returnValue.then(async function (data) {
                return data;
            });
            return returnValue;
        }
        else
            return returnValue;
    },
    async imageExport(type: string, fileName: string, element: Element, isReturnBase64: boolean): Promise<string> {
        let instance = this;
        let promise: Promise<string> = new Promise(function (resolve, reject) {
            let svgData: string = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + element.children[0].outerHTML + '</svg>';
            let url: string = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] : [new window["XMLSerializer"]().serializeToString(element)], { type: 'image/svg+xml' }));
            if (type == "SVG") {
                instance.triggerDownload(type, fileName, url);
                resolve(null);
            } else {
                let canvasElement: HTMLCanvasElement = document.createElement('canvas');
                canvasElement.height = element.clientHeight;
                canvasElement.width = element.clientWidth;
                let context: CanvasRenderingContext2D = canvasElement.getContext('2d');
                let image: HTMLImageElement = new Image();

                image.onload = function () {
                    context.drawImage(image, 0, 0);
                    window.URL.revokeObjectURL(url);
                    if (!isReturnBase64) {
                        instance.triggerDownload(type, fileName, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                        resolve(null);
                    } else {
                        let base64String: string = (type === 'JPEG') ? canvasElement.toDataURL('image/jpeg') : (type === 'PNG') ? canvasElement.toDataURL('image/png') : '';
                        resolve(base64String);
                    }
                };
                image.src = url;
            }
        });
        return promise;
    }
}

export default Barcode;