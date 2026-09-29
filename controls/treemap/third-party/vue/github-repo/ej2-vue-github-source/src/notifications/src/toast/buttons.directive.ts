import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ButtonModelPropsModel } from '@syncfusion/ej2-notifications';

export let ButtonModelPropsDirective =  vueDefineComponent({
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
            return 'e-buttonmodelprops';
        }
    }
});
export const ButtonModelPropsPlugin = {
    name: 'e-buttonmodelprops',
    install(Vue: any) {
        Vue.component(ButtonModelPropsPlugin.name, ButtonModelPropsDirective);
    }
}

/**
 * 'e-button' directive represent a button of Vue toast 
 * It must be contained in a Toast component(`ejs-toast`). 
 * ```html
 * <ejs-toast id='toast' :showCloseIcon=true> 
 *   <e-buttons>
 *    <e-button :content='Ok' :isPrimary=true></e-button>
 *    <e-button :content='Cancel'></e-button>
 *   </e-buttons>
 * </ejs-toast>
 * ```
 */
export let ButtonModelPropDirective: DefineVueDirective<ButtonModelPropsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-buttonmodelprop';
        }
    }
});
export const ButtonModelPropPlugin = {
    name: 'e-buttonmodelprop',
    install(Vue: any) {
        Vue.component(ButtonModelPropPlugin.name, ButtonModelPropDirective);
    }
}