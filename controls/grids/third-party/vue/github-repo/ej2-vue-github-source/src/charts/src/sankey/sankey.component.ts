import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Sankey, SankeyModel } from '@syncfusion/ej2-charts';
import { SankeyNodesCollectionDirective, SankeyNodeDirective, SankeyNodesCollectionPlugin, SankeyNodePlugin } from './nodes.directive'
import { SankeyLinksCollectionDirective, SankeyLinkDirective, SankeyLinksCollectionPlugin, SankeyLinkPlugin } from './links.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'accessibility', 'allowExport', 'animation', 'background', 'backgroundImage', 'border', 'enableExport', 'enablePersistence', 'enableRtl', 'focusBorderColor', 'focusBorderMargin', 'focusBorderWidth', 'height', 'labelSettings', 'legendSettings', 'linkStyle', 'links', 'locale', 'margin', 'nodeStyle', 'nodes', 'orientation', 'subTitle', 'subTitleStyle', 'theme', 'title', 'titleStyle', 'tooltip', 'width', 'afterExport', 'beforeExport', 'beforePrint', 'exportCompleted', 'labelRendering', 'legendItemHover', 'legendItemRendering', 'linkClick', 'linkEnter', 'linkLeave', 'linkRendering', 'load', 'loaded', 'nodeClick', 'nodeEnter', 'nodeLeave', 'nodeRendering', 'sizeChanged', 'tooltipRendering'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents Vuejs Sankey Component
 * ```
 * <ejs-sankey></ejs-sankey>
 * ```
 */
export let SankeyComponent: DefineVueComponent<SankeyModel> =  vueDefineComponent({
    name: 'SankeyComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Sankey({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-sankey-nodes":"e-sankey-node","e-sankey-links":"e-sankey-link"} as { [key: string]: Object },
            tagNameMapper: {"e-sankey-nodes":"e-nodes","e-sankey-links":"e-links"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

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
        custom(): void {
            this.updated();
        },

    }
});

export type SankeyComponent = typeof ComponentBase & {
    ej2Instances: Sankey;
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
    
};

export const SankeyPlugin = {
    name: 'ejs-sankey',
    install(Vue: any) {
        Vue.component(SankeyPlugin.name, SankeyComponent);
        Vue.component(SankeyNodePlugin.name, SankeyNodeDirective);
        Vue.component(SankeyNodesCollectionPlugin.name, SankeyNodesCollectionDirective);
        Vue.component(SankeyLinkPlugin.name, SankeyLinkDirective);
        Vue.component(SankeyLinksCollectionPlugin.name, SankeyLinksCollectionDirective);

    }
}