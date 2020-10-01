import { BlazorDotnetObject, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';

const SELECTION: string = 'Selection';
const HIGHLIGHT: string = 'Highlight';
const TREEMAPHIGHLIGHT: string = 'treeMapHighlight';
const TREEMAPSELECTION: string = 'treeMapSelection';
const RECTPATH: string = '_RectPath';
const LEGENDHIGHLIGHT: string = 'LegendHighlight';
const TEXT: string = '_Text';

class SfTreemap {
    public element: BlazorTreemapElement;
    public dotNetRef: BlazorDotnetObject;
    constructor(element: BlazorTreemapElement, dotNetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }

    public initializeEvents(): void {
        EventHandler.add(this.element, 'mouseup', this.mouseUp.bind(this), this);
        EventHandler.add(this.element, 'mousemove', this.mouseMove.bind(this), this);
        EventHandler.add(this.element, 'mousedown', this.mouseDown.bind(this), this);
        EventHandler.add(this.element, 'mouseleave', this.mouseLeave.bind(this), this);
        EventHandler.add(this.element, 'contextmenu', this.contextMenuEvent.bind(this), this);
        window.addEventListener('resize', this.reSize.bind(this));
    }

    private contextMenuEvent(): void {
        this.dotNetRef.invokeMethodAsync('TriggerRightClick');
    }

    private reSize(): void {
        let width: number;
        let height: number;
        if (this.element != null) {
            width = this.element.getBoundingClientRect().width;
            height = this.element.getBoundingClientRect().height;
        }
        this.dotNetRef.invokeMethodAsync('TriggerReSize', width, height);
    }

    private mouseDown(event: MouseEvent): void {
        event.preventDefault();
        let contentText: string = this.getElementId((event.target as HTMLElement).id);
        this.dotNetRef.invokeMethodAsync('TriggerMouseDown', (event.target as HTMLElement).id, contentText);
    }

    private mouseUp(event: MouseEvent): void {
        let contentText: string = this.getElementId((event.target as HTMLElement).id);
        this.dotNetRef.invokeMethodAsync('TriggerMouseUp', (event.target as HTMLElement).id, contentText, event.which === 3);
    }

    private mouseMove(event: MouseEvent): void {
        let mouseX: number;
        let mouseY: number;
        if (this.element != null) {
            let element: Element = this.element.children[1];
            let elementRect: ClientRect = element.getBoundingClientRect();
            let pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
            let pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
            let clientTop: number = element.ownerDocument.documentElement.clientTop;
            let clientLeft: number = element.ownerDocument.documentElement.clientLeft;
            let positionX: number = elementRect.left + pageXOffset - clientLeft;
            let positionY: number = elementRect.top + pageYOffset - clientTop;
            mouseX = event.pageX - positionX;
            mouseY = event.pageY - positionY;
        }
        this.dotNetRef.invokeMethodAsync('TriggerMouseMove', (event.target as HTMLElement).id, mouseX, mouseY);
    }

    private mouseLeave(event: MouseEvent): void {
        this.dotNetRef.invokeMethodAsync('TriggerMouseLeave');
    }

    public getElementId(id: string): string {
        let contentText: string;
        if (!isNullOrUndefined(id) && id !== '') {
            contentText = document.getElementById(id).textContent;
        } else {
            contentText = '';
        }
        return contentText;
    }
}

interface BlazorTreemapElement extends HTMLElement {
    blazor__instance: SfTreemap;
}

// tslint:disable
let Treemap: object = {
    initialize(element: BlazorTreemapElement, dotNetRef: BlazorDotnetObject): any {
        let layout: SfTreemap = new SfTreemap(element, dotNetRef);
        layout.initializeEvents();
        return this.getElementSize(element);
    },
    getElementSize(element: BlazorTreemapElement): any {
        let elementWidth: number;
        let elementHeight: number;
        if (element != null) {
            let elementRect: ClientRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
        }
        return { width: elementWidth, height: elementHeight };
    },
    setElementAttribute (dotNetRef: BlazorDotnetObject, legendItems: any, items: any, fill: string, opacity: string, borderColor: string, borderWidth: string, type: string, blazorElement: BlazorTreemapElement): void {
        for (let j: number = 0; j < items.length; j++) {
            let element: HTMLElement = document.getElementById(items[j] + RECTPATH);
            if (element != null) {
                if (type === SELECTION && element.classList.contains(TREEMAPHIGHLIGHT)) {
                    element.classList.remove(TREEMAPHIGHLIGHT);
                }
                if (!element.classList.contains(TREEMAPSELECTION)) {
                    for (let i: number = 0; i < legendItems.length; i++) {
                        let legendElement: HTMLElement = document.getElementById(legendItems[i]);
                        if (legendElement != null) {
                            legendElement.setAttribute('fill', fill);
                            legendElement.setAttribute('opacity', opacity);
                            legendElement.setAttribute('stroke', borderColor);
                            legendElement.setAttribute('stroke-width', borderWidth);
                        }
                    }
                    element.setAttribute('fill', fill);
                    element.setAttribute('opacity', opacity);
                    element.setAttribute('stroke', borderColor);
                    element.setAttribute('stroke-width', borderWidth);
                    if (type === HIGHLIGHT || type === LEGENDHIGHLIGHT) {
                        element.classList.add(TREEMAPHIGHLIGHT);
                    } else {
                        element.classList.add(TREEMAPSELECTION);
                    }
                    let contentText: string = blazorElement.blazor__instance.getElementId(items[j] + TEXT);
                    if (type === SELECTION) {
                        dotNetRef.invokeMethodAsync('TriggerItemSelect', contentText);
                    } else if (type === HIGHLIGHT) {
                        dotNetRef.invokeMethodAsync('TriggerItemHighlight');
                    }
                }
            }
        }
    },
    removeElementAttribute(legendItems: any, legendFill: string, legendOpacity: string, legendBorderColor: string, legendBorderWidth: string, items: any, fill: string, opacity: string, borderColor: string, borderWidth: string, type: string): void {
        for (let j: number = 0; j < items.length; j++) {
            let element: HTMLElement = document.getElementById(items[j] + RECTPATH);
            if (element != null) {
                if (type === HIGHLIGHT && !element.classList.contains(TREEMAPSELECTION) ||
                    type === SELECTION && element.classList.contains(TREEMAPSELECTION)) {
                    for (let i: number = 0; i < legendItems.length; i++) {
                        let legendElement: HTMLElement = document.getElementById(legendItems[i]);
                        if (legendElement != null) {
                            legendElement.setAttribute('fill', legendFill);
                            legendElement.setAttribute('opacity', legendOpacity);
                            legendElement.setAttribute('stroke', legendBorderColor);
                            legendElement.setAttribute('stroke-width', legendBorderWidth);
                        }
                    }
                    element.setAttribute('fill', fill[j]);
                    element.setAttribute('opacity', opacity[j]);
                    element.setAttribute('stroke', borderColor[j]);
                    element.setAttribute('stroke-width', borderWidth[j]);
                    if (type === HIGHLIGHT) {
                        element.classList.remove(TREEMAPHIGHLIGHT);
                    } else {
                        element.classList.remove(TREEMAPSELECTION);
                    }
                }
            }
        }
    },
    templateElementSize(id: string, position: string): void {
        let templateElement: HTMLElement = document.getElementById(id);
        let width: number = templateElement.clientWidth;
        let height: number = templateElement.clientHeight;
        let textSizeWidth: number; let textSizeHeight: number;
        let styleProp: string[] = templateElement.getAttribute('style').split(';');
        let stylePropChanged: string; let stylePropJoin: string;
        for (let i: number = 0; i < styleProp.length; i++) {
            if (styleProp[i].indexOf('left') !== -1) {
                let itemLeftSplit: string[] = styleProp[i].split(':');
                let leftValue: number = parseFloat(itemLeftSplit[(itemLeftSplit.length - 1)]);
                textSizeWidth = position.indexOf('Left') != -1 ? leftValue : position.indexOf('Right') === -1 ? leftValue - (width / 2) : leftValue - width;
                styleProp[i] = 'left:' + textSizeWidth + 'px';
            } else if (styleProp[i].indexOf('top') !== -1) {
                let itemTopSplit: string[] = styleProp[i].split(':');
                let topValue: number = parseFloat(itemTopSplit[(itemTopSplit.length - 1)]);
                textSizeHeight = position.indexOf('Top') !== -1 ? topValue : position.indexOf('Bottom') === -1 ?
                    (topValue) - (height / 2) : topValue - height;
                styleProp[i] = 'top:' + textSizeHeight + 'px';
            }
            stylePropJoin = styleProp[i] + ';';
            if (i === 0) {
                stylePropChanged = stylePropJoin;
            } else {
                stylePropChanged = stylePropChanged.concat(stylePropJoin);
            }
        }
        templateElement.setAttribute('style', stylePropChanged);
    }
};
export default Treemap;