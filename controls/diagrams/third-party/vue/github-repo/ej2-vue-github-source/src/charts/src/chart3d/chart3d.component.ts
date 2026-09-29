import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { isUndefined } from '@syncfusion/ej2-base';

import { Chart3D, Chart3DModel } from '@syncfusion/ej2-charts';
import { Chart3DSeriesCollectionDirective, Chart3DSeriesDirective, Chart3DSeriesCollectionPlugin, Chart3DSeriesPlugin } from './series.directive'
import { Chart3DAxesDirective, Chart3DAxisDirective, Chart3DAxesPlugin, Chart3DAxisPlugin } from './axes.directive'
import { Chart3DRowsDirective, Chart3DRowDirective, Chart3DRowsPlugin, Chart3DRowPlugin } from './rows.directive'
import { Chart3DColumnsDirective, Chart3DColumnDirective, Chart3DColumnsPlugin, Chart3DColumnPlugin } from './columns.directive'
import { Chart3DSelectedDataIndexesDirective, Chart3DSelectedDataIndexDirective, Chart3DSelectedDataIndexesPlugin, Chart3DSelectedDataIndexPlugin } from './selecteddataindexes.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'axes', 'background', 'backgroundImage', 'border', 'columns', 'currencyCode', 'dataSource', 'depth', 'description', 'enableExport', 'enablePersistence', 'enableRotation', 'enableRtl', 'enableSideBySidePlacement', 'height', 'highlightColor', 'highlightMode', 'highlightPattern', 'isMultiSelect', 'isTransposed', 'legendSettings', 'locale', 'margin', 'palettes', 'perspectiveAngle', 'primaryXAxis', 'primaryYAxis', 'rotation', 'rows', 'selectedDataIndexes', 'selectionMode', 'selectionPattern', 'series', 'subTitle', 'subTitleStyle', 'theme', 'tilt', 'title', 'titleStyle', 'tooltip', 'useGroupingSeparator', 'wallColor', 'wallSize', 'width', 'afterExport', 'axisLabelRender', 'beforeExport', 'beforePrint', 'beforeResize', 'chart3DMouseClick', 'chart3DMouseDown', 'chart3DMouseLeave', 'chart3DMouseMove', 'chart3DMouseUp', 'legendClick', 'legendRender', 'load', 'loaded', 'pointClick', 'pointMove', 'pointRender', 'resized', 'selectionComplete', 'seriesRender', 'textRender', 'tooltipRender'];
export const modelProps: string[] = ['dataSource'];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents Vuejs 3D Chart Component
 * ```
 * <ejs-chart3d></ejs-chart3d>
 * ```
 */
export let Chart3DComponent: DefineVueComponent<Chart3DModel> =  vueDefineComponent({
    name: 'Chart3DComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    model: { event: 'modelchanged' },
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Chart3D({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-chart3d-series-collection":"e-chart3d-series","e-chart3daxes":"e-chart3daxis","e-chart3d-rows":"e-chart3d-row","e-chart3d-columns":"e-chart3d-columns","e-chart3d-selecteddataindexes":"e-chart3d-selecteddataindex"} as { [key: string]: Object },
            tagNameMapper: {"e-chart3d-series-collection":"e-series","e-chart3daxes":"e-axes","e-chart3d-rows":"e-rows","e-chart3d-columns":"e-columns","e-chart3d-selecteddataindexes":"e-selectedDataIndexes"} as Object,
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
        addSeries(seriesCollection: Object[]): void {
            return this.ej2Instances.addSeries(seriesCollection);
        },
        createChartSvg(): void {
            return this.ej2Instances.createChartSvg();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        export(type: Object, fileName: string): void {
            return this.ej2Instances.export(type, fileName);
        },
        highlightAnimation(element: Object, index: number, duration: number, startOpacity: number): void {
            return this.ej2Instances.highlightAnimation(element, index, duration, startOpacity);
        },
        print(id?: string[] | string | Object): void {
            return this.ej2Instances.print(id);
        },
        removeSeries(index: number): void {
            return this.ej2Instances.removeSeries(index);
        },
        stopElementAnimation(element: Object, index: number): void {
            return this.ej2Instances.stopElementAnimation(element, index);
        },
    }
});

export type Chart3DComponent = typeof ComponentBase & {
    ej2Instances: Chart3D;
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
    addSeries(seriesCollection: Object[]): void;
    createChartSvg(): void;
    destroy(): void;
    export(type: Object, fileName: string): void;
    highlightAnimation(element: Object, index: number, duration: number, startOpacity: number): void;
    print(id?: string[] | string | Object): void;
    removeSeries(index: number): void;
    stopElementAnimation(element: Object, index: number): void
};

export const Chart3DPlugin = {
    name: 'ejs-chart3d',
    install(Vue: any) {
        Vue.component(Chart3DPlugin.name, Chart3DComponent);
        Vue.component(Chart3DSeriesPlugin.name, Chart3DSeriesDirective);
        Vue.component(Chart3DSeriesCollectionPlugin.name, Chart3DSeriesCollectionDirective);
        Vue.component(Chart3DAxisPlugin.name, Chart3DAxisDirective);
        Vue.component(Chart3DAxesPlugin.name, Chart3DAxesDirective);
        Vue.component(Chart3DRowPlugin.name, Chart3DRowDirective);
        Vue.component(Chart3DRowsPlugin.name, Chart3DRowsDirective);
        Vue.component(Chart3DColumnPlugin.name, Chart3DColumnDirective);
        Vue.component(Chart3DColumnsPlugin.name, Chart3DColumnsDirective);
        Vue.component(Chart3DSelectedDataIndexPlugin.name, Chart3DSelectedDataIndexDirective);
        Vue.component(Chart3DSelectedDataIndexesPlugin.name, Chart3DSelectedDataIndexesDirective);

    }
}