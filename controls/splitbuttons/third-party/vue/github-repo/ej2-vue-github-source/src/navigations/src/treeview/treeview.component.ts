import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { TreeView, TreeViewModel } from '@syncfusion/ej2-navigations';


export const properties: string[] = ['isLazyUpdate', 'plugins', 'allowDragAndDrop', 'allowEditing', 'allowMultiSelection', 'allowTextWrap', 'animation', 'autoCheck', 'checkDisabledChildren', 'checkOnClick', 'checkedNodes', 'cssClass', 'disableHtmlEncode', 'disabled', 'dragArea', 'enableHtmlSanitizer', 'enablePersistence', 'enableRtl', 'enableVirtualization', 'expandOn', 'expandedNodes', 'fields', 'fullRowNavigable', 'fullRowSelect', 'height', 'loadOnDemand', 'locale', 'nodeTemplate', 'selectedNodes', 'showCheckBox', 'sortOrder', 'actionFailure', 'created', 'dataBound', 'dataSourceChanged', 'destroyed', 'drawNode', 'keyPress', 'nodeChecked', 'nodeChecking', 'nodeClicked', 'nodeCollapsed', 'nodeCollapsing', 'nodeDragStart', 'nodeDragStop', 'nodeDragging', 'nodeDropped', 'nodeEdited', 'nodeEditing', 'nodeExpanded', 'nodeExpanding', 'nodeSelected', 'nodeSelecting'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the EJ2 VueJS TreeView Component.
 * ```html
 * <ejs-treeview></ejs-treeview>
 * ```
 */
export let TreeViewComponent: DefineVueComponent<TreeViewModel> =  vueDefineComponent({
    name: 'TreeViewComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new TreeView({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: false as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {} as { [key: string]: Object },
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
        addNodes(nodes: undefined[], target?: string | Object, index?: number, preventTargetExpand?: boolean): void {
            return this.ej2Instances.addNodes(nodes, target, index, preventTargetExpand);
        },
        beginEdit(node: string | Object): void {
            return this.ej2Instances.beginEdit(node);
        },
        checkAll(nodes?: string[] | Object[]): void {
            return this.ej2Instances.checkAll(nodes);
        },
        collapseAll(nodes?: string[] | Object[], level?: number, excludeHiddenNodes?: boolean): void {
            return this.ej2Instances.collapseAll(nodes, level, excludeHiddenNodes);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableNodes(nodes: string[] | Object[]): void {
            return this.ej2Instances.disableNodes(nodes);
        },
        enableNodes(nodes: string[] | Object[]): void {
            return this.ej2Instances.enableNodes(nodes);
        },
        ensureVisible(node: string | Object): void {
            return this.ej2Instances.ensureVisible(node);
        },
        expandAll(nodes?: string[] | Object[], level?: number, excludeHiddenNodes?: boolean, preventAnimation?: boolean): void {
            return this.ej2Instances.expandAll(nodes, level, excludeHiddenNodes, preventAnimation);
        },
        getAllCheckedNodes(): string[] {
            return this.ej2Instances.getAllCheckedNodes();
        },
        getDisabledNodes(): string[] {
            return this.ej2Instances.getDisabledNodes();
        },
        getNode(node: string | Object): Object {
            return this.ej2Instances.getNode(node);
        },
        getTreeData(node?: string | Object): undefined[] {
            return this.ej2Instances.getTreeData(node);
        },
        moveNodes(sourceNodes: string[] | Object[], target: string | Object, index: number, preventTargetExpand?: boolean): void {
            return this.ej2Instances.moveNodes(sourceNodes, target, index, preventTargetExpand);
        },
        refreshNode(target: string | Object, newData: undefined[]): void {
            return this.ej2Instances.refreshNode(target, newData);
        },
        removeNodes(nodes: string[] | Object[]): void {
            return this.ej2Instances.removeNodes(nodes);
        },
        uncheckAll(nodes?: string[] | Object[]): void {
            return this.ej2Instances.uncheckAll(nodes);
        },
        updateNode(target: string | Object, newText: string): void {
            return this.ej2Instances.updateNode(target, newText);
        },
    }
});

export type TreeViewComponent = typeof ComponentBase & {
    ej2Instances: TreeView;
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
    addNodes(nodes: undefined[], target?: string | Object, index?: number, preventTargetExpand?: boolean): void;
    beginEdit(node: string | Object): void;
    checkAll(nodes?: string[] | Object[]): void;
    collapseAll(nodes?: string[] | Object[], level?: number, excludeHiddenNodes?: boolean): void;
    destroy(): void;
    disableNodes(nodes: string[] | Object[]): void;
    enableNodes(nodes: string[] | Object[]): void;
    ensureVisible(node: string | Object): void;
    expandAll(nodes?: string[] | Object[], level?: number, excludeHiddenNodes?: boolean, preventAnimation?: boolean): void;
    getAllCheckedNodes(): string[];
    getDisabledNodes(): string[];
    getNode(node: string | Object): Object;
    getTreeData(node?: string | Object): undefined[];
    moveNodes(sourceNodes: string[] | Object[], target: string | Object, index: number, preventTargetExpand?: boolean): void;
    refreshNode(target: string | Object, newData: undefined[]): void;
    removeNodes(nodes: string[] | Object[]): void;
    uncheckAll(nodes?: string[] | Object[]): void;
    updateNode(target: string | Object, newText: string): void
};

export const TreeViewPlugin = {
    name: 'ejs-treeview',
    install(Vue: any) {
        Vue.component(TreeViewPlugin.name, TreeViewComponent);

    }
}