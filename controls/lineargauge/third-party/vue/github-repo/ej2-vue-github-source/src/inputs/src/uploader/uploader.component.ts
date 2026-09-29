import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Uploader, UploaderModel } from '@syncfusion/ej2-inputs';
import { FilesDirective, UploadedFilesDirective, FilesPlugin, UploadedFilesPlugin } from './files.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowedExtensions', 'asyncSettings', 'autoUpload', 'buttons', 'cssClass', 'directoryUpload', 'dropArea', 'dropEffect', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'enabled', 'files', 'htmlAttributes', 'locale', 'maxFileSize', 'minFileSize', 'multiple', 'sequentialUpload', 'showFileList', 'template', 'actionComplete', 'beforeRemove', 'beforeUpload', 'canceling', 'change', 'chunkFailure', 'chunkSuccess', 'chunkUploading', 'clearing', 'created', 'failure', 'fileListRendering', 'pausing', 'progress', 'removing', 'rendering', 'resuming', 'selected', 'success', 'uploading'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Uploader Component
 * ```html
 * <ejs-uploader id='fileUpload' v-bind:multiple='true'></ejs-uploader>
 * ```
 */
export let UploaderComponent: DefineVueComponent<UploaderModel> =  vueDefineComponent({
    name: 'UploaderComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Uploader({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-files":"e-uploadedfiles"} as { [key: string]: Object },
            tagNameMapper: {} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('input', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },
        custom(): void {
            this.updated();
        },
        bytesToSize(bytes: number): string {
            return this.ej2Instances.bytesToSize(bytes);
        },
        cancel(fileData?: Object[]): void {
            return this.ej2Instances.cancel(fileData);
        },
        clearAll(): void {
            return this.ej2Instances.clearAll();
        },
        createFileList(fileData: Object[]): void {
            return this.ej2Instances.createFileList(fileData);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        getFilesData(index?: number): Object[] {
            return this.ej2Instances.getFilesData(index);
        },
        pause(fileData?: Object | Object[], custom?: boolean): void {
            return this.ej2Instances.pause(fileData, custom);
        },
        remove(fileData?: Object | Object[], customTemplate?: boolean, removeDirectly?: boolean, postRawFile?: boolean, args?: Object | Object | Object): void {
            return this.ej2Instances.remove(fileData, customTemplate, removeDirectly, postRawFile, args);
        },
        resume(fileData?: Object | Object[], custom?: boolean): void {
            return this.ej2Instances.resume(fileData, custom);
        },
        retry(fileData?: Object | Object[], fromcanceledStage?: boolean, custom?: boolean): void {
            return this.ej2Instances.retry(fileData, fromcanceledStage, custom);
        },
        sortFileList(filesData?: Object): Object[] {
            return this.ej2Instances.sortFileList(filesData);
        },
        traverseFileTree(item: any, event?: Object | Object | Object | Object): void {
            return this.ej2Instances.traverseFileTree(item, event);
        },
        upload(files?: Object | Object[], custom?: boolean): void {
            return this.ej2Instances.upload(files, custom);
        },
    }
});

export type UploaderComponent = typeof ComponentBase & {
    ej2Instances: Uploader;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    bytesToSize(bytes: number): string;
    cancel(fileData?: Object[]): void;
    clearAll(): void;
    createFileList(fileData: Object[]): void;
    destroy(): void;
    getFilesData(index?: number): Object[];
    pause(fileData?: Object | Object[], custom?: boolean): void;
    remove(fileData?: Object | Object[], customTemplate?: boolean, removeDirectly?: boolean, postRawFile?: boolean, args?: Object | Object | Object): void;
    resume(fileData?: Object | Object[], custom?: boolean): void;
    retry(fileData?: Object | Object[], fromcanceledStage?: boolean, custom?: boolean): void;
    sortFileList(filesData?: Object): Object[];
    traverseFileTree(item: any, event?: Object | Object | Object | Object): void;
    upload(files?: Object | Object[], custom?: boolean): void
};

export const UploaderPlugin = {
    name: 'ejs-uploader',
    install(Vue: any) {
        Vue.component(UploaderPlugin.name, UploaderComponent);
        Vue.component(UploadedFilesPlugin.name, UploadedFilesDirective);
        Vue.component(FilesPlugin.name, FilesDirective);

    }
}