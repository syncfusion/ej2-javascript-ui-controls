import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CustomCursorActionModel } from '@syncfusion/ej2-diagrams';

export let CustomCursorsDirective =  vueDefineComponent({
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
            return 'e-cursormaps';
        }
    }
});
export const CustomCursorsPlugin = {
    name: 'e-cursormaps',
    install(Vue: any) {
        Vue.component(CustomCursorsPlugin.name, CustomCursorsDirective);
    }
}

/**
 * `e-custormaps` directive represent a layers of the vue diagram. 
 * It must be contained in a Diagram component(`ejs-diagram`). 
 * ```html
 * <ejs-diagram>
 * <e-custormaps>
 * <e-custormap>
 * </e-custormap>
 * </e-custormaps>
</ejs-diagram>
 * ```
 */
export let CustomCursorDirective: DefineVueDirective<CustomCursorActionModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-cursormap';
        }
    }
});
export const CustomCursorPlugin = {
    name: 'e-cursormap',
    install(Vue: any) {
        Vue.component(CustomCursorPlugin.name, CustomCursorDirective);
    }
}