import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { FormBuilder, FormBuilderModel } from '@syncfusion/ej2-form-builder';
import { ToolboxItemSettingsDirective, ToolboxItemSettingDirective, ToolboxItemSettingsPlugin, ToolboxItemSettingPlugin } from './toolboxitems.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowExport', 'enableHtmlSanitizer', 'enablePersistence', 'enablePreview', 'enableRtl', 'formTemplates', 'locale', 'mode', 'schema', 'toolboxCategories', 'toolboxItems', 'onFieldDragOver', 'onFieldDragStarted', 'onFieldDropped', 'onFieldPropertyChanged'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Form Builder Component
 * ```html
 * <ejs-form-builder></ejs-form-builder>
 * ```
 */
export let FormBuilderComponent: DefineVueComponent<FormBuilderModel> =  vueDefineComponent({
    name: 'FormBuilderComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new FormBuilder({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-toolboxitemsettings":"e-toolboxitemsetting"} as { [key: string]: Object },
            tagNameMapper: {"e-toolboxitemsettings":"e-toolboxItems"} as Object,
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
        getProperty(componentType: Object, propertyName: string): Object | undefined {
            return this.ej2Instances.getProperty(componentType, propertyName);
        },
        setFieldValue(fieldName: string, value: any): void {
            return this.ej2Instances.setFieldValue(fieldName, value);
        },
        setProperty(componentType: Object, property: Object): void {
            return this.ej2Instances.setProperty(componentType, property);
        },
    }
});

export type FormBuilderComponent = typeof ComponentBase & {
    ej2Instances: FormBuilder;
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
    getProperty(componentType: Object, propertyName: string): Object | undefined;
    setFieldValue(fieldName: string, value: any): void;
    setProperty(componentType: Object, property: Object): void
};

export const FormBuilderPlugin = {
    name: 'ejs-formbuilder',
    install(Vue: any) {
        Vue.component(FormBuilderPlugin.name, FormBuilderComponent);
        Vue.component(ToolboxItemSettingPlugin.name, ToolboxItemSettingDirective);
        Vue.component(ToolboxItemSettingsPlugin.name, ToolboxItemSettingsDirective);

    }
}