import { gh, isExecute, vueDefineComponent, DefineVueDirective } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FilesPropModel } from '@syncfusion/ej2-inputs';

export let FilesDirective =  vueDefineComponent({
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
            return 'e-files';
        }
    }
});
export const FilesPlugin = {
    name: 'e-files',
    install(Vue: any) {
        Vue.component(FilesPlugin.name, FilesDirective);
    }
}

/**
 * 'files' directive represent a file of vue uploader 
 * It must be contained in a Uploader component(`ejs-uploader`). 
 * ```html
 * <ejs-uploader id='fileupload' v-bind:multiple='true'> 
 *   <e-files>
 *    <e-file name='Java' size=23000 type='pdf'></e-file>
 *    <e-file name='C++' size=30000 type='.docx'></e-file>
 *   </e-files>
 * </ejs-uploader>
 * ```
 */
export let UploadedFilesDirective: DefineVueDirective<FilesPropModel> =  vueDefineComponent({
    render(): void {
        return;
    },
    methods: {
        getTag(): string {
            return 'e-uploadedfiles';
        }
    }
});
export const UploadedFilesPlugin = {
    name: 'e-uploadedfiles',
    install(Vue: any) {
        Vue.component(UploadedFilesPlugin.name, UploadedFilesDirective);
    }
}