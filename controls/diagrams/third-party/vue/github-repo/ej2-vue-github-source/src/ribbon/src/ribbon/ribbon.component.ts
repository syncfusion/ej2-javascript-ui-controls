import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { Ribbon, RibbonModel } from '@syncfusion/ej2-ribbon';
import { RibbonItemsDirective, RibbonItemDirective, RibbonItemsPlugin, RibbonItemPlugin } from './items.directive'
import { RibbonCollectionsDirective, RibbonCollectionDirective, RibbonCollectionsPlugin, RibbonCollectionPlugin } from './collections.directive'
import { RibbonGroupsDirective, RibbonGroupDirective, RibbonGroupsPlugin, RibbonGroupPlugin } from './groups.directive'
import { RibbonTabsDirective, RibbonTabDirective, RibbonTabsPlugin, RibbonTabPlugin } from './tabs.directive'
import { RibbonContextualTabsDirective, RibbonContextualTabDirective, RibbonContextualTabsPlugin, RibbonContextualTabPlugin } from './contextualtabs.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'activeLayout', 'backStageMenu', 'contextualTabs', 'cssClass', 'enableKeyTips', 'enablePersistence', 'enableRtl', 'fileMenu', 'helpPaneTemplate', 'hideLayoutSwitcher', 'isMinimized', 'launcherIconCss', 'layoutSwitcherKeyTip', 'locale', 'selectedTab', 'tabAnimation', 'tabs', 'width', 'created', 'launcherIconClick', 'overflowPopupClose', 'overflowPopupOpen', 'ribbonCollapsing', 'ribbonExpanding', 'ribbonLayoutSwitched', 'tabSelected', 'tabSelecting'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * Represents the Essential JS 2 VueJS Ribbon Component
 * ```
 * <ejs-ribbon></ejs-ribbon>
 * ```
 */
export let RibbonComponent: DefineVueComponent<RibbonModel> =  vueDefineComponent({
    name: 'RibbonComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new Ribbon({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: true as boolean,
            tagMapper: {"e-ribbon-tabs":{"e-ribbon-tab":{"e-ribbon-groups":{"e-ribbon-group":{"e-ribbon-collections":{"e-ribbon-collection":{"e-ribbon-items":"e-ribbon-item"}}}}}},"e-ribbon-contextual-tabs":{"e-ribbon-contextual-tab":{"e-ribbon-tabs":{"e-ribbon-tab":{"e-ribbon-groups":{"e-ribbon-group":{"e-ribbon-collections":{"e-ribbon-collection":{"e-ribbon-items":"e-ribbon-item"}}}}}}}}} as { [key: string]: Object },
            tagNameMapper: {"e-ribbon-items":"e-items","e-ribbon-collections":"e-collections","e-ribbon-groups":"e-groups","e-ribbon-tabs":"e-tabs","e-ribbon-contextual-tabs":"e-contextualTabs"} as Object,
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
        addCollection(groupId: string, collection: Object, targetId?: string, isAfter?: boolean): void {
            return this.ej2Instances.addCollection(groupId, collection, targetId, isAfter);
        },
        addGroup(tabId: string, group: Object, targetId?: string, isAfter?: boolean): void {
            return this.ej2Instances.addGroup(tabId, group, targetId, isAfter);
        },
        addItem(collectionId: string, item: Object, targetId?: string, isAfter?: boolean): void {
            return this.ej2Instances.addItem(collectionId, item, targetId, isAfter);
        },
        addTab(tab: Object, targetId?: string, isAfter?: boolean): void {
            return this.ej2Instances.addTab(tab, targetId, isAfter);
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        disableGroup(groupID: string): void {
            return this.ej2Instances.disableGroup(groupID);
        },
        disableItem(itemId: string): void {
            return this.ej2Instances.disableItem(itemId);
        },
        disableTab(tabId: string): void {
            return this.ej2Instances.disableTab(tabId);
        },
        enableGroup(groupID: string): void {
            return this.ej2Instances.enableGroup(groupID);
        },
        enableItem(itemId: string): void {
            return this.ej2Instances.enableItem(itemId);
        },
        enableTab(tabId: string): void {
            return this.ej2Instances.enableTab(tabId);
        },
        getAppendToElement(): Object {
            return this.ej2Instances.getAppendToElement();
        },
        getItem(itemId: string): Object {
            return this.ej2Instances.getItem(itemId);
        },
        hideGroup(groupID: string): void {
            return this.ej2Instances.hideGroup(groupID);
        },
        hideItem(itemId: string): void {
            return this.ej2Instances.hideItem(itemId);
        },
        hideTab(tabId: string, isContextual: boolean): void {
            return this.ej2Instances.hideTab(tabId, isContextual);
        },
        refreshLayout(): void {
            return this.ej2Instances.refreshLayout();
        },
        removeCollection(collectionId: string): void {
            return this.ej2Instances.removeCollection(collectionId);
        },
        removeGroup(groupId: string): void {
            return this.ej2Instances.removeGroup(groupId);
        },
        removeItem(itemId: string): void {
            return this.ej2Instances.removeItem(itemId);
        },
        removeTab(tabId: string): void {
            return this.ej2Instances.removeTab(tabId);
        },
        selectTab(tabId: string): void {
            return this.ej2Instances.selectTab(tabId);
        },
        showGroup(groupID: string): void {
            return this.ej2Instances.showGroup(groupID);
        },
        showItem(itemId: string): void {
            return this.ej2Instances.showItem(itemId);
        },
        showTab(tabId: string, isContextual: boolean): void {
            return this.ej2Instances.showTab(tabId, isContextual);
        },
        updateCollection(collection: Object): void {
            return this.ej2Instances.updateCollection(collection);
        },
        updateGroup(group: Object): void {
            return this.ej2Instances.updateGroup(group);
        },
        updateItem(item: Object): void {
            return this.ej2Instances.updateItem(item);
        },
        updateTab(tab: Object): void {
            return this.ej2Instances.updateTab(tab);
        },
    }
});

export type RibbonComponent = typeof ComponentBase & {
    ej2Instances: Ribbon;
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
    addCollection(groupId: string, collection: Object, targetId?: string, isAfter?: boolean): void;
    addGroup(tabId: string, group: Object, targetId?: string, isAfter?: boolean): void;
    addItem(collectionId: string, item: Object, targetId?: string, isAfter?: boolean): void;
    addTab(tab: Object, targetId?: string, isAfter?: boolean): void;
    destroy(): void;
    disableGroup(groupID: string): void;
    disableItem(itemId: string): void;
    disableTab(tabId: string): void;
    enableGroup(groupID: string): void;
    enableItem(itemId: string): void;
    enableTab(tabId: string): void;
    getAppendToElement(): Object;
    getItem(itemId: string): Object;
    hideGroup(groupID: string): void;
    hideItem(itemId: string): void;
    hideTab(tabId: string, isContextual: boolean): void;
    refreshLayout(): void;
    removeCollection(collectionId: string): void;
    removeGroup(groupId: string): void;
    removeItem(itemId: string): void;
    removeTab(tabId: string): void;
    selectTab(tabId: string): void;
    showGroup(groupID: string): void;
    showItem(itemId: string): void;
    showTab(tabId: string, isContextual: boolean): void;
    updateCollection(collection: Object): void;
    updateGroup(group: Object): void;
    updateItem(item: Object): void;
    updateTab(tab: Object): void
};

export const RibbonPlugin = {
    name: 'ejs-ribbon',
    install(Vue: any) {
        Vue.component(RibbonPlugin.name, RibbonComponent);
        Vue.component(RibbonTabPlugin.name, RibbonTabDirective);
        Vue.component(RibbonTabsPlugin.name, RibbonTabsDirective);
        Vue.component(RibbonGroupPlugin.name, RibbonGroupDirective);
        Vue.component(RibbonGroupsPlugin.name, RibbonGroupsDirective);
        Vue.component(RibbonCollectionPlugin.name, RibbonCollectionDirective);
        Vue.component(RibbonCollectionsPlugin.name, RibbonCollectionsDirective);
        Vue.component(RibbonItemPlugin.name, RibbonItemDirective);
        Vue.component(RibbonItemsPlugin.name, RibbonItemsDirective);
        Vue.component(RibbonContextualTabPlugin.name, RibbonContextualTabDirective);
        Vue.component(RibbonContextualTabsPlugin.name, RibbonContextualTabsDirective);

    }
}