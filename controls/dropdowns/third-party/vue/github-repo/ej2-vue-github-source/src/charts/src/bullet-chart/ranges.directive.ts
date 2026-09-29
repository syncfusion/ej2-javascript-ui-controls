import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RangeModel } from '@syncfusion/ej2-charts';

export let BulletRangeCollectionDirective =  vueDefineComponent({
    inject: { custom: { default: null } },
    render(createElement: any): void {
        if (!isExecute) {
            let h: any = !isExecute ? gh : createElement;
            let slots: any = null;
            if(!isNullOrUndefined((this as any).$slots.default)) {
                slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
            }
            return h('div', { class: 'e-directive' }, slots);
        }
        return;
    },
    updated(): void {
        if (!isExecute && this.custom) { this.custom() }
    },
    methods: {
        getTag(): string {
            return 'e-bullet-range-collection';
        }
    }
});
export const BulletRangeCollectionPlugin = {
    name: 'e-bullet-range-collection',
    install(Vue: any) {
        Vue.component(BulletRangeCollectionPlugin.name, BulletRangeCollectionDirective);
    }
}


export let BulletRangeDirective: DefineVueDirective<RangeModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-bullet-range';
        }
    }
});
export const BulletRangePlugin = {
    name: 'e-bullet-range',
    install(Vue: any) {
        Vue.component(BulletRangePlugin.name, BulletRangeDirective);
    }
}