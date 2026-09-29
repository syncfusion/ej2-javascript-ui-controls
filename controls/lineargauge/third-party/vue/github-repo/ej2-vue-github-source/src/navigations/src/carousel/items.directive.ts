import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CarouselItemModel } from '@syncfusion/ej2-navigations';

export let CarouselItemsDirective =  vueDefineComponent({
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
            return 'e-carousel-items';
        }
    }
});
export const CarouselItemsPlugin = {
    name: 'e-carousel-items',
    install(Vue: any) {
        Vue.component(CarouselItemsPlugin.name, CarouselItemsDirective);
    }
}

/**
 * `e-carousel-item` directive represent a item of the Vue Carousel.
 * It must be contained in a Carousel component(`ejs-carousel`).
 * ```html
 * <ejs-carousel>
 *   <e-carousel-items>
 *    <e-carousel-item template='itemTemplate'></e-carousel-item>
 *    <e-carousel-item template='secondItemTemplate'></e-carousel-item>
 *   </e-carousel-items>
 * </ejs-carousel>
 * ```
 */
export let CarouselItemDirective: DefineVueDirective<CarouselItemModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-carousel-item';
        }
    }
});
export const CarouselItemPlugin = {
    name: 'e-carousel-item',
    install(Vue: any) {
        Vue.component(CarouselItemPlugin.name, CarouselItemDirective);
    }
}