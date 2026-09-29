import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { FileManager, FileManagerModel } from '@syncfusion/ej2-filemanager';
import { ToolbarItemsDirective, ToolbarItemDirective, ToolbarItemsPlugin, ToolbarItemPlugin } from './toolbaritems.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'ajaxSettings', 'allowDragAndDrop', 'allowMultiSelection', 'contextMenuSettings', 'cssClass', 'detailsViewSettings', 'enableHtmlSanitizer', 'enablePersistence', 'enableRangeSelection', 'enableRtl', 'enableVirtualization', 'enableWebMcp', 'fileSystemData', 'height', 'largeIconsTemplate', 'locale', 'navigationPaneSettings', 'navigationPaneTemplate', 'path', 'popupTarget', 'rootAliasName', 'searchSettings', 'selectedItems', 'showFileExtension', 'showHiddenItems', 'showItemCheckBoxes', 'showThumbnail', 'sortBy', 'sortComparer', 'sortOrder', 'toolbarItems', 'toolbarSettings', 'uploadSettings', 'view', 'width', 'beforeDelete', 'beforeDownload', 'beforeFolderCreate', 'beforeImageLoad', 'beforeMove', 'beforePopupClose', 'beforePopupOpen', 'beforeRename', 'beforeSend', 'beforeWebMcpToolExecute', 'created', 'delete', 'destroyed', 'failure', 'fileDragStart', 'fileDragStop', 'fileDragging', 'fileDropped', 'fileLoad', 'fileOpen', 'fileSelect', 'fileSelection', 'folderCreate', 'menuClick', 'menuClose', 'menuOpen', 'move', 'popupClose', 'popupOpen', 'rename', 'search', 'success', 'toolbarClick', 'toolbarCreate', 'uploadListCreate'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS FileManager Component.
 * ```
 * <ejs-filemanager showThumbnail='false'></ejs-filemanager>
 * ```
 */
export let FileManagerComponent: DefineVueComponent<FileManagerModel> =  vueDefineComponent({
    name: 'FileManagerComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new FileManager({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-toolbaritems":"e-toolbaritem"} as { [key: string]: Object },
            tagNameMapper: {"e-toolbaritems":"e-toolbarItems"} as Object,
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
        return h('div', slots);
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
        clearSelection(): void {
            return this.ej2Instances.clearSelection();
        },
        closeDialog(): void {
            return this.ej2Instances.closeDialog();
        },
        createFolder(name?: string): void {
            return this.ej2Instances.createFolder(name);
        },
        deleteFiles(ids?: string[]): void {
            return this.ej2Instances.deleteFiles(ids);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableMenuItems(items: string[]): void {
            return this.ej2Instances.disableMenuItems(items);
        },
        disableToolbarItems(items: string[]): void {
            return this.ej2Instances.disableToolbarItems(items);
        },
        downloadFiles(ids?: string[]): void {
            return this.ej2Instances.downloadFiles(ids);
        },
        enableMenuItems(items: string[]): void {
            return this.ej2Instances.enableMenuItems(items);
        },
        enableToolbarItems(items: string[]): void {
            return this.ej2Instances.enableToolbarItems(items);
        },
        filterFiles(filterData?: Object): void {
            return this.ej2Instances.filterFiles(filterData);
        },
        getMenuItemIndex(item: string): number {
            return this.ej2Instances.getMenuItemIndex(item);
        },
        getSelectedFiles(): Object[] {
            return this.ej2Instances.getSelectedFiles();
        },
        getToolbarItemIndex(item: string): number {
            return this.ej2Instances.getToolbarItemIndex(item);
        },
        openFile(id: string): void {
            return this.ej2Instances.openFile(id);
        },
        refreshFiles(): void {
            return this.ej2Instances.refreshFiles();
        },
        refreshLayout(): void {
            return this.ej2Instances.refreshLayout();
        },
        renameFile(id?: string, name?: string): void {
            return this.ej2Instances.renameFile(id, name);
        },
        restoreFocus(): void {
            return this.ej2Instances.restoreFocus();
        },
        selectAll(): void {
            return this.ej2Instances.selectAll();
        },
        traverseBackward(): void {
            return this.ej2Instances.traverseBackward();
        },
        uploadFiles(): void {
            return this.ej2Instances.uploadFiles();
        },
    }
});

export type FileManagerComponent = typeof ComponentBase & {
    ej2Instances: FileManager;
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
    clearSelection(): void;
    closeDialog(): void;
    createFolder(name?: string): void;
    deleteFiles(ids?: string[]): void;
    destroy(): void;
    disableMenuItems(items: string[]): void;
    disableToolbarItems(items: string[]): void;
    downloadFiles(ids?: string[]): void;
    enableMenuItems(items: string[]): void;
    enableToolbarItems(items: string[]): void;
    filterFiles(filterData?: Object): void;
    getMenuItemIndex(item: string): number;
    getSelectedFiles(): Object[];
    getToolbarItemIndex(item: string): number;
    openFile(id: string): void;
    refreshFiles(): void;
    refreshLayout(): void;
    renameFile(id?: string, name?: string): void;
    restoreFocus(): void;
    selectAll(): void;
    traverseBackward(): void;
    uploadFiles(): void
};

export const FileManagerPlugin = {
    name: 'ejs-filemanager',
    install(Vue: any) {
        Vue.component(FileManagerPlugin.name, FileManagerComponent);
        Vue.component(ToolbarItemPlugin.name, ToolbarItemDirective);
        Vue.component(ToolbarItemsPlugin.name, ToolbarItemsDirective);

    }
}