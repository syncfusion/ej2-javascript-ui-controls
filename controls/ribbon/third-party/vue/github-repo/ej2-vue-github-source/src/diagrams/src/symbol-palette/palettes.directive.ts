import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PaletteModel } from '@syncfusion/ej2-diagrams';

export let PalettesDirective =  vueDefineComponent({
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
            return 'e-palettes';
        }
    }
});
export const PalettesPlugin = {
    name: 'e-palettes',
    install(Vue: any) {
        Vue.component(PalettesPlugin.name, PalettesDirective);
    }
}

/**
 * `Palette` directive represent a axis palette of the vue SymbolPalette. 
 * It must be contained in a SymbolPalette component(`SymbolPaletteComponent`). 
 * ```html
 * <e-palettes><e-palette></e-palette><e-palettes>
 * ```
 */
export let PaletteDirective: DefineVueDirective<PaletteModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-palette';
        }
    }
});
export const PalettePlugin = {
    name: 'e-palette',
    install(Vue: any) {
        Vue.component(PalettePlugin.name, PaletteDirective);
    }
}