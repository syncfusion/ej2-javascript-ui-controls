import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AssistViewModel } from '@syncfusion/ej2-interactive-chat';

export let ViewsDirective =  vueDefineComponent({
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
            return 'e-views';
        }
    }
});
export const ViewsPlugin = {
    name: 'e-views',
    install(Vue: any) {
        Vue.component(ViewsPlugin.name, ViewsDirective);
    }
}

/**
 * Represents the Essential JS 2 VueJS AIAssistView Component
 * ```vue
 * <ejs-aiassistview>
 *   <e-views>
 *     <e-view>
 *     </e-view>
 *    </e-views>
 * </ejs-aiassistview>
 * ```
 */
export let ViewDirective: DefineVueDirective<AssistViewModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-view';
        }
    }
});
export const ViewPlugin = {
    name: 'e-view',
    install(Vue: any) {
        Vue.component(ViewPlugin.name, ViewDirective);
    }
}