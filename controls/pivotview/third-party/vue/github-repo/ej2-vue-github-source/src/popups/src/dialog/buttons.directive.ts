import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ButtonPropsModel } from '@syncfusion/ej2-popups';

export let ButtonsDirective =  vueDefineComponent({
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
            return 'e-buttons';
        }
    }
});
export const ButtonsPlugin = {
    name: 'e-buttons',
    install(Vue: any) {
        Vue.component(ButtonsPlugin.name, ButtonsDirective);
    }
}

/**
 * 'e-button' directive represent a button of Vue Dialog 
 * It must be contained in a Dialog component(`ejs-dialog`). 
 * ```html
 * <ejs-Dialog id='dialog' :showCloseIcon=true> 
 *   <e-buttons>
 *    <e-dialogbutton :buttonModal='okButton'></e-dialogbutton>
 *    <e-dialogbutton :buttonModal='cancelButton'></e-dialogbutton>
 *   </e-buttons>
 * </ejs-Dialog>
 * ```
 */
export let DialogButtonDirective: DefineVueDirective<ButtonPropsModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-dialogbutton';
        }
    }
});
export const DialogButtonPlugin = {
    name: 'e-dialogbutton',
    install(Vue: any) {
        Vue.component(DialogButtonPlugin.name, DialogButtonDirective);
    }
}