import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { Maps, MapsModel } from '@syncfusion/ej2-maps';
import { InitialShapeSelectionsDirective, InitialShapeSelectionDirective, InitialShapeSelectionsPlugin, InitialShapeSelectionPlugin } from './initialshapeselection.directive'
import { MarkersDirective, MarkerDirective, MarkersPlugin, MarkerPlugin } from './markersettings.directive'
import { ColorMappingsDirective, ColorMappingDirective, ColorMappingsPlugin, ColorMappingPlugin } from './colormapping.directive'
import { BubblesDirective, BubbleDirective, BubblesPlugin, BubblePlugin } from './bubblesettings.directive'
import { NavigationLinesDirective, NavigationLineDirective, NavigationLinesPlugin, NavigationLinePlugin } from './navigationlinesettings.directive'
import { LayersDirective, LayerDirective, LayersPlugin, LayerPlugin } from './layers.directive'
import { AnnotationsDirective, AnnotationDirective, AnnotationsPlugin, AnnotationPlugin } from './annotations.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowImageExport', 'allowPdfExport', 'allowPrint', 'annotations', 'background', 'baseLayerIndex', 'border', 'centerPosition', 'description', 'enablePersistence', 'enableRtl', 'format', 'height', 'layers', 'legendSettings', 'locale', 'mapsArea', 'margin', 'projectionType', 'tabIndex', 'theme', 'titleSettings', 'tooltipDisplayMode', 'useGroupingSeparator', 'width', 'zoomSettings', 'animationComplete', 'annotationRendering', 'beforePrint', 'bubbleClick', 'bubbleMouseMove', 'bubbleRendering', 'click', 'dataLabelRendering', 'doubleClick', 'itemHighlight', 'itemSelection', 'layerRendering', 'legendRendering', 'load', 'loaded', 'markerClick', 'markerClusterClick', 'markerClusterMouseMove', 'markerClusterRendering', 'markerDragEnd', 'markerDragStart', 'markerMouseMove', 'markerRendering', 'mouseMove', 'onclick', 'pan', 'panComplete', 'resize', 'rightClick', 'shapeHighlight', 'shapeRendering', 'shapeSelected', 'tooltipRender', 'tooltipRenderComplete', 'zoom', 'zoomComplete'];
export const modelProps: string[] = ['dataSource'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Vue Maps component.
 * It is ideal for rendering maps from GeoJSON data or other map providers like OpenStreetMap, Google Maps, Bing Maps, etc that has rich feature set that includes markers, labels, bubbles and much more. 
 * ```vue
 * <ejs-maps></ejs-maps>
 * ```
 */
export let MapsComponent: DefineVueComponent<MapsModel> =  vueDefineComponent({
    name: 'MapsComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Maps({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-layers":{"e-layer":{"e-initialShapeSelections":"e-initialShapeSelection","e-markerSettings":"e-markerSetting","e-bubbleSettings":{"e-bubbleSetting":{"e-colorMappings":"e-colorMapping"}},"e-navigationLineSettings":"e-navigationLineSetting"}},"e-maps-annotations":"e-maps-annotation"} as { [key: string]: Object },
            tagNameMapper: {"e-initialShapeSelections":"e-initialShapeSelection","e-colorMappings":"e-colorMapping","e-maps-annotations":"e-annotations"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {
        this.ej2Instances._trigger = this.ej2Instances.trigger;
        this.ej2Instances.trigger = this.trigger;
        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },        
        trigger(eventName: string, eventProp: {[key:string]:Object}, successHandler?: Function): void {
            if(!isExecute) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if ((eventName === 'change' || eventName === 'input') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/checked|value/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('update:modelValue', eventProp[propKey]);
                    } else {
                        if (eventName === 'change' || ((this as any).$props && !(this as any).$props.isLazyUpdate)) {
                            (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                            (this as any).$emit('modelchanged', eventProp[propKey]);
                        }
                    }
                }
            } else if ((eventName === 'actionBegin' && eventProp.requestType === 'dateNavigate') && this.models && (this.models.length !== 0)) {
                let key: string[] = this.models.toString().match(/currentView|selectedDate/) || [];
                let propKey: string = key[0];
                if (eventProp && key && !isUndefined(eventProp[propKey])) {
                    if (!isExecute) {
                        this.ej2Instances.vueInstance.$emit('update:' + propKey, eventProp[propKey]);
                        this.ej2Instances.vueInstance.$emit('modelchanged', eventProp[propKey]);
                    } else {
                        (this as any).$emit('update:'+ propKey, eventProp[propKey]);
                        (this as any).$emit('modelchanged', eventProp[propKey]);
                    }
                }
            }
            if ((this.ej2Instances && this.ej2Instances._trigger)) {
                this.ej2Instances._trigger(eventName, eventProp, successHandler); 
            }
        },

        custom(): void {
            this.updated();
        },
        addLayer(layer: Object): void {
            return this.ej2Instances.addLayer(layer);
        },
        addMarker(layerIndex?: number, markerCollection?: Object[]): void {
            return this.ej2Instances.addMarker(layerIndex, markerCollection);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        export(type: Object, fileName: string, orientation?: Object, allowDownload?: boolean): Object {
            return this.ej2Instances.export(type, fileName, orientation, allowDownload);
        },
        getBingUrlTemplate(url: string): Object {
            return this.ej2Instances.getBingUrlTemplate(url);
        },
        getGeoLocation(layerIndex: number, x: number, y: number): Object {
            return this.ej2Instances.getGeoLocation(layerIndex, x, y);
        },
        getMinMaxLatitudeLongitude(): Object {
            return this.ej2Instances.getMinMaxLatitudeLongitude();
        },
        getTileGeoLocation(x: number, y: number): Object {
            return this.ej2Instances.getTileGeoLocation(x, y);
        },
        mapsOnResize(e: Object): boolean {
            return this.ej2Instances.mapsOnResize(e);
        },
        panByDirection(direction: Object, mouseLocation?: Object | Object): void {
            return this.ej2Instances.panByDirection(direction, mouseLocation);
        },
        pointToLatLong(pageX: number, pageY: number): Object {
            return this.ej2Instances.pointToLatLong(pageX, pageY);
        },
        print(id?: string[] | string | Object): void {
            return this.ej2Instances.print(id);
        },
        removeLayer(index: number): void {
            return this.ej2Instances.removeLayer(index);
        },
        shapeSelection(layerIndex: number, propertyName: string | string[], name: string, enable?: boolean): void {
            return this.ej2Instances.shapeSelection(layerIndex, propertyName, name, enable);
        },
        zoomByPosition(centerPosition: undefined, zoomFactor: number): void {
            return this.ej2Instances.zoomByPosition(centerPosition, zoomFactor);
        },
        zoomToCoordinates(minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number): void {
            return this.ej2Instances.zoomToCoordinates(minLatitude, minLongitude, maxLatitude, maxLongitude);
        },
    }
});

export type MapsComponent = typeof ComponentBase & {
    ej2Instances: Maps;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addLayer(layer: Object): void;
    addMarker(layerIndex?: number, markerCollection?: Object[]): void;
    destroy(): void;
    export(type: Object, fileName: string, orientation?: Object, allowDownload?: boolean): Object;
    getBingUrlTemplate(url: string): Object;
    getGeoLocation(layerIndex: number, x: number, y: number): Object;
    getMinMaxLatitudeLongitude(): Object;
    getTileGeoLocation(x: number, y: number): Object;
    mapsOnResize(e: Object): boolean;
    panByDirection(direction: Object, mouseLocation?: Object | Object): void;
    pointToLatLong(pageX: number, pageY: number): Object;
    print(id?: string[] | string | Object): void;
    removeLayer(index: number): void;
    shapeSelection(layerIndex: number, propertyName: string | string[], name: string, enable?: boolean): void;
    zoomByPosition(centerPosition: undefined, zoomFactor: number): void;
    zoomToCoordinates(minLatitude: number, minLongitude: number, maxLatitude: number, maxLongitude: number): void
};

export const MapsPlugin = {
    name: 'ejs-maps',
    install(Vue: any) {
        Vue.component(MapsPlugin.name, MapsComponent);
        Vue.component(LayerPlugin.name, LayerDirective);
        Vue.component(LayersPlugin.name, LayersDirective);
        Vue.component(InitialShapeSelectionPlugin.name, InitialShapeSelectionDirective);
        Vue.component(InitialShapeSelectionsPlugin.name, InitialShapeSelectionsDirective);
        Vue.component(MarkerPlugin.name, MarkerDirective);
        Vue.component(MarkersPlugin.name, MarkersDirective);
        Vue.component(BubblePlugin.name, BubbleDirective);
        Vue.component(BubblesPlugin.name, BubblesDirective);
        Vue.component(ColorMappingPlugin.name, ColorMappingDirective);
        Vue.component(ColorMappingsPlugin.name, ColorMappingsDirective);
        Vue.component(NavigationLinePlugin.name, NavigationLineDirective);
        Vue.component(NavigationLinesPlugin.name, NavigationLinesDirective);
        Vue.component(AnnotationPlugin.name, AnnotationDirective);
        Vue.component(AnnotationsPlugin.name, AnnotationsDirective);

    }
}