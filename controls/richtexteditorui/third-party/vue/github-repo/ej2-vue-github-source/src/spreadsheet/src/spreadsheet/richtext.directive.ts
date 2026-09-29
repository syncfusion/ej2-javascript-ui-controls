import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { RichTextModel } from '@syncfusion/ej2-spreadsheet';

export let RichTextsDirective =  vueDefineComponent({
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
            return 'e-richtexts';
        }
    }
});
export const RichTextsPlugin = {
    name: 'e-richtexts',
    install(Vue: any) {
        Vue.component(RichTextsPlugin.name, RichTextsDirective);
    }
}


export let RichTextDirective: DefineVueDirective<RichTextModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-richtext';
        }
    }
});
export const RichTextPlugin = {
    name: 'e-richtext',
    install(Vue: any) {
        Vue.component(RichTextPlugin.name, RichTextDirective);
    }
}