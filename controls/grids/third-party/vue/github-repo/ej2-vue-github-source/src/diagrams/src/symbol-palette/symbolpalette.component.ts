import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { SymbolPalette, SymbolPaletteModel } from '@syncfusion/ej2-diagrams';
import { PalettesDirective, PaletteDirective, PalettesPlugin, PalettePlugin } from './palettes.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'accessKey', 'allowDrag', 'connectorDefaults', 'enableAnimation', 'enablePersistence', 'enableRtl', 'enableSearch', 'expandMode', 'filterSymbols', 'getConnectorDefaults', 'getNodeDefaults', 'getSymbolInfo', 'getSymbolTemplate', 'height', 'ignoreSymbolsOnSearch', 'locale', 'nodeDefaults', 'nodeTemplate', 'palettes', 'symbolDragSize', 'symbolHeight', 'symbolInfo', 'symbolMargin', 'symbolPreview', 'symbolWidth', 'width', 'paletteExpanding', 'paletteSelectionChange'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents vue SymbolPalette Component
 * ```html
 * <ej-symbol-palette></ej-symbol-palette>
 * ```
 */
export let SymbolPaletteComponent: DefineVueComponent<SymbolPaletteModel> =  vueDefineComponent({
    name: 'SymbolPaletteComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new SymbolPalette({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-palettes":"e-palette"} as { [key: string]: Object },
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
        addPaletteItem(paletteName: string, paletteSymbol: Object | Object, isChild?: boolean): void {
            return this.ej2Instances.addPaletteItem(paletteName, paletteSymbol, isChild);
        },
        addPalettes(palettes: Object[]): void {
            return this.ej2Instances.addPalettes(palettes);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        removePaletteItem(paletteName: string, symbolId: string): void {
            return this.ej2Instances.removePaletteItem(paletteName, symbolId);
        },
        removePalettes(palettes: string[]): void {
            return this.ej2Instances.removePalettes(palettes);
        },
    }
});

export type SymbolPaletteComponent = typeof ComponentBase & {
    ej2Instances: SymbolPalette;
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
    addPaletteItem(paletteName: string, paletteSymbol: Object | Object, isChild?: boolean): void;
    addPalettes(palettes: Object[]): void;
    destroy(): void;
    removePaletteItem(paletteName: string, symbolId: string): void;
    removePalettes(palettes: string[]): void
};

export const SymbolPalettePlugin = {
    name: 'ejs-symbolpalette',
    install(Vue: any) {
        Vue.component(SymbolPalettePlugin.name, SymbolPaletteComponent);
        Vue.component(PalettePlugin.name, PaletteDirective);
        Vue.component(PalettesPlugin.name, PalettesDirective);

    }
}