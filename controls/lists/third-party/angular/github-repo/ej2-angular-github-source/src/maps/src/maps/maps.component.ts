import { Component, ElementRef, ViewContainerRef, ChangeDetectionStrategy, QueryList, Renderer2, Injector, ValueProvider, ContentChild } from '@angular/core';
import { ComponentBase, IComponentBase, applyMixins, ComponentMixins, PropertyCollectionInfo, setValue } from '@syncfusion/ej2-angular-base';
import { Maps } from '@syncfusion/ej2-maps';

import { LayersDirective } from './layers.directive';
import { AnnotationsDirective } from './annotations.directive';

export const inputs: string[] = ['allowImageExport','allowPdfExport','allowPrint','annotations','background','baseLayerIndex','border','centerPosition','description','enablePersistence','enableRtl','format','height','layers','legendSettings','locale','mapsArea','margin','projectionType','tabIndex','theme','titleSettings','tooltipDisplayMode','useGroupingSeparator','width','zoomSettings'];
export const outputs: string[] = ['animationComplete','annotationRendering','beforePrint','bubbleClick','bubbleMouseMove','bubbleRendering','click','dataLabelRendering','doubleClick','itemHighlight','itemSelection','layerRendering','legendRendering','load','loaded','markerClick','markerClusterClick','markerClusterMouseMove','markerClusterRendering','markerDragEnd','markerDragStart','markerMouseMove','markerRendering','mouseMove','onclick','pan','panComplete','resize','rightClick','shapeHighlight','shapeRendering','shapeSelected','tooltipRender','tooltipRenderComplete','zoom','zoomComplete','dataSourceChange'];
export const twoWays: string[] = ['dataSource'];

/**
 * Represents the Angular Maps component.
 * It is ideal for rendering maps from GeoJSON data or other map providers like OpenStreetMap, Google Maps, Bing Maps, etc that has rich feature set that includes markers, labels, bubbles and much more. 
 * ```html
 * <ej-maps></ej-maps>
 * ```
 */
@Component({
    selector: 'ejs-maps',
    inputs: inputs,
    outputs: outputs,
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    queries: {
        childLayers: new ContentChild(LayersDirective),
        childAnnotations: new ContentChild(AnnotationsDirective)
    }
})
@ComponentMixins([ComponentBase])
export class MapsComponent extends Maps implements IComponentBase {
    public declare context : any;
    public declare tagObjects: any;
	declare animationComplete: any;
	declare annotationRendering: any;
	declare beforePrint: any;
	declare bubbleClick: any;
	declare bubbleMouseMove: any;
	declare bubbleRendering: any;
	declare click: any;
	declare dataLabelRendering: any;
	declare doubleClick: any;
	declare itemHighlight: any;
	declare itemSelection: any;
	declare layerRendering: any;
	declare legendRendering: any;
	declare load: any;
	declare loaded: any;
	declare markerClick: any;
	declare markerClusterClick: any;
	declare markerClusterMouseMove: any;
	declare markerClusterRendering: any;
	declare markerDragEnd: any;
	declare markerDragStart: any;
	declare markerMouseMove: any;
	declare markerRendering: any;
	declare mouseMove: any;
	declare onclick: any;
	declare pan: any;
	declare panComplete: any;
	declare resize: any;
	declare rightClick: any;
	declare shapeHighlight: any;
	declare shapeRendering: any;
	declare shapeSelected: any;
	declare tooltipRender: any;
	declare tooltipRenderComplete: any;
	declare zoom: any;
	declare zoomComplete: any;
	public declare dataSourceChange: any;
    public declare childLayers: QueryList<LayersDirective>;
    public declare childAnnotations: QueryList<AnnotationsDirective>;
    public tags: string[] = ['layers', 'annotations'];

    constructor(private ngEle: ElementRef, private srenderer: Renderer2, private viewContainerRef:ViewContainerRef, private injector: Injector) {
        super();
        this.element = this.ngEle.nativeElement;
        this.injectedModules = this.injectedModules || [];
        try {
                let mod = this.injector.get('MapsBubble');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsLegend');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsMarker');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsHighlight');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsSelection');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsMapsTooltip');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsZoom');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsDataLabel');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsNavigationLine');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsAnnotations');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsPrint');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsPdfExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsImageExport');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }
        try {
                let mod = this.injector.get('MapsPolygon');
                if(this.injectedModules.indexOf(mod) === -1) {
                    this.injectedModules.push(mod)
                }
            } catch { }

        this.registerEvents(outputs);
        this.addTwoWay.call(this, twoWays);
        setValue('currentInstance', this, this.viewContainerRef);
        this.context  = new ComponentBase();
    }

    public ngOnInit() {
        this.context.ngOnInit(this);
    }

    public ngAfterViewInit(): void {
        this.context.ngAfterViewInit(this);
    }

    public ngOnDestroy(): void {
        this.context.ngOnDestroy(this);
    }

    public ngAfterContentChecked(): void {
        this.tagObjects[0].instance = this.childLayers;
        if (this.childAnnotations) {
                    this.tagObjects[1].instance = this.childAnnotations as any;
                }
        this.context.ngAfterContentChecked(this);
    }

    public declare registerEvents: (eventList: string[]) => void;
    public declare addTwoWay: (propList: string[]) => void;
}


