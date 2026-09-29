import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { AssistViewModel } from '@syncfusion/ej2-interactive-chat';

export let MentionsDirective =  vueDefineComponent({
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
            return 'e-mentions';
        }
    }
});
export const MentionsPlugin = {
    name: 'e-mentions',
    install(Vue: any) {
        Vue.component(MentionsPlugin.name, MentionsDirective);
    }
}

/**
 * Represents the Essential JS 2 VueJS AIAssistView Component
 * ```vue
 * <ejs-aiassistview>
 *   <e-mentions>
 *     <e-mention>
 *     </e-mention>
 *    </e-mentions>
 * </ejs-aiassistview>
 * ```
 */
export let MentionDirective: DefineVueDirective<AssistViewModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-mention';
        }
    }
});
export const MentionPlugin = {
    name: 'e-mention',
    install(Vue: any) {
        Vue.component(MentionPlugin.name, MentionDirective);
    }
}