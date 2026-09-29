import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WorkflowStickyNoteModel } from '@syncfusion/ej2-workflow-designer';

export let StickyNotesDirective =  vueDefineComponent({
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
            return 'e-sticky-notes';
        }
    }
});
export const StickyNotesPlugin = {
    name: 'e-sticky-notes',
    install(Vue: any) {
        Vue.component(StickyNotesPlugin.name, StickyNotesDirective);
    }
}

/**
 * `e-sticky-notes` directive represent a sticky notes of the vue workflow designer. 
 * It must be contained in a Workflow Designer component(`ejs-workflow-designer`). 
 * ```html
 * <ejs-workflow-designer>
 * <e-sticky-notes>
 * <e-sticky-note>
 * </e-sticky-note>
 * </e-sticky-notes>
 * </ejs-workflow-designer>
 * ```
 */
export let StickyNoteDirective: DefineVueDirective<WorkflowStickyNoteModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-sticky-note';
        }
    }
});
export const StickyNotePlugin = {
    name: 'e-sticky-note',
    install(Vue: any) {
        Vue.component(StickyNotePlugin.name, StickyNoteDirective);
    }
}