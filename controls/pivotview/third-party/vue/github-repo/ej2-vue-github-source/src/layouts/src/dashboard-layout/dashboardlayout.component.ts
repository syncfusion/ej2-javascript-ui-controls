import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { DashboardLayout, DashboardLayoutModel } from '@syncfusion/ej2-layouts';
import { PanelsDirective, PanelDirective, PanelsPlugin, PanelPlugin } from './panels.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowDragging', 'allowFloating', 'allowPushing', 'allowResizing', 'cellAspectRatio', 'cellSpacing', 'columns', 'draggableHandle', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'locale', 'mediaQuery', 'panels', 'resizableHandles', 'showGridLines', 'change', 'created', 'destroyed', 'drag', 'dragStart', 'dragStop', 'resize', 'resizeStart', 'resizeStop'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS DashboardLayout Component.
 * ```html
 * <ejs-dashboardlayout></ejs-dashboardlayout>
 * ```
 */
export let DashboardLayoutComponent: DefineVueComponent<DashboardLayoutModel> =  vueDefineComponent({
    name: 'DashboardLayoutComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new DashboardLayout({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-panels":"e-panel"} as { [key: string]: Object },
            tagNameMapper: {} as Object,
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
        addPanel(panel: Object): void {
            return this.ej2Instances.addPanel(panel);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        movePanel(id: string, row: number, col: number): void {
            return this.ej2Instances.movePanel(id, row, col);
        },
        refresh(): void {
            return this.ej2Instances.refresh();
        },
        refreshDraggableHandle(): void {
            return this.ej2Instances.refreshDraggableHandle();
        },
        removeAll(): void {
            return this.ej2Instances.removeAll();
        },
        removePanel(id: string): void {
            return this.ej2Instances.removePanel(id);
        },
        resizePanel(id: string, sizeX: number, sizeY: number): void {
            return this.ej2Instances.resizePanel(id, sizeX, sizeY);
        },
        serialize(): Object[] {
            return this.ej2Instances.serialize();
        },
        updatePanel(panel: Object): void {
            return this.ej2Instances.updatePanel(panel);
        },
    }
});

export type DashboardLayoutComponent = typeof ComponentBase & {
    ej2Instances: DashboardLayout;
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
    addPanel(panel: Object): void;
    destroy(): void;
    movePanel(id: string, row: number, col: number): void;
    refresh(): void;
    refreshDraggableHandle(): void;
    removeAll(): void;
    removePanel(id: string): void;
    resizePanel(id: string, sizeX: number, sizeY: number): void;
    serialize(): Object[];
    updatePanel(panel: Object): void
};

export const DashboardLayoutPlugin = {
    name: 'ejs-dashboardlayout',
    install(Vue: any) {
        Vue.component(DashboardLayoutPlugin.name, DashboardLayoutComponent);
        Vue.component(PanelPlugin.name, PanelDirective);
        Vue.component(PanelsPlugin.name, PanelsDirective);

    }
}