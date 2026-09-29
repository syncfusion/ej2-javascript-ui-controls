import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { ProgressBar, ProgressBarModel } from '@syncfusion/ej2-progressbar';
import { ProgressBarAnnotationsDirective, ProgressBarAnnotationDirective, ProgressBarAnnotationsPlugin, ProgressBarAnnotationPlugin } from './annotations.directive'
import { RangeColorsDirective, RangeColorDirective, RangeColorsPlugin, RangeColorPlugin } from './rangecolors.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'animation', 'annotations', 'cornerRadius', 'enablePersistence', 'enablePieProgress', 'enableProgressSegments', 'enableRtl', 'endAngle', 'gapWidth', 'height', 'innerRadius', 'isActive', 'isGradient', 'isIndeterminate', 'isStriped', 'labelOnTrack', 'labelStyle', 'locale', 'margin', 'maximum', 'minimum', 'progressColor', 'progressThickness', 'radius', 'rangeColors', 'role', 'secondaryProgress', 'secondaryProgressColor', 'secondaryProgressThickness', 'segmentColor', 'segmentCount', 'showProgressValue', 'startAngle', 'theme', 'tooltip', 'trackColor', 'trackThickness', 'type', 'value', 'width', 'animationComplete', 'load', 'loaded', 'mouseClick', 'mouseDown', 'mouseLeave', 'mouseMove', 'mouseUp', 'progressCompleted', 'textRender', 'tooltipRender', 'valueChanged'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents Vuejs ProgressBar Component
 * ```
 * <ejs-progressbar></ejs-progressbar>
 * ```
 */
export let ProgressBarComponent: DefineVueComponent<ProgressBarModel> =  vueDefineComponent({
    name: 'ProgressBarComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new ProgressBar({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-progressbar-annotations":"e-progressbar-annotation","e-rangecolors":"e-rangecolor"} as { [key: string]: Object },
            tagNameMapper: {"e-progressbar-annotations":"e-annotations","e-rangecolors":"e-rangeColors"} as Object,
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
        calculateProgressRange(value: number, minimum?: number, maximum?: number): number {
            return this.ej2Instances.calculateProgressRange(value, minimum, maximum);
        },
        calculateSegmentSize(width: number, thickness: number): string {
            return this.ej2Instances.calculateSegmentSize(width, thickness);
        },
        createClipPath(clipPath?: Object, range?: number, d?: string, refresh?: boolean, thickness?: number, isLabel?: boolean, isMaximum?: boolean): Object {
            return this.ej2Instances.createClipPath(clipPath, range, d, refresh, thickness, isLabel, isMaximum);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        getPathLine(x: number, width: number, thickness: number): string {
            return this.ej2Instances.getPathLine(x, width, thickness);
        },
        hide(): void {
            return this.ej2Instances.hide();
        },
        removeSvg(): void {
            return this.ej2Instances.removeSvg();
        },
        requiredModules(): Object[] {
            return this.ej2Instances.requiredModules();
        },
        show(): void {
            return this.ej2Instances.show();
        },
    }
});

export type ProgressBarComponent = typeof ComponentBase & {
    ej2Instances: ProgressBar;
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
    calculateProgressRange(value: number, minimum?: number, maximum?: number): number;
    calculateSegmentSize(width: number, thickness: number): string;
    createClipPath(clipPath?: Object, range?: number, d?: string, refresh?: boolean, thickness?: number, isLabel?: boolean, isMaximum?: boolean): Object;
    destroy(): void;
    getPathLine(x: number, width: number, thickness: number): string;
    hide(): void;
    removeSvg(): void;
    requiredModules(): Object[];
    show(): void
};

export const ProgressBarPlugin = {
    name: 'ejs-progressbar',
    install(Vue: any) {
        Vue.component(ProgressBarPlugin.name, ProgressBarComponent);
        Vue.component(ProgressBarAnnotationPlugin.name, ProgressBarAnnotationDirective);
        Vue.component(ProgressBarAnnotationsPlugin.name, ProgressBarAnnotationsDirective);
        Vue.component(RangeColorPlugin.name, RangeColorDirective);
        Vue.component(RangeColorsPlugin.name, RangeColorsDirective);

    }
}