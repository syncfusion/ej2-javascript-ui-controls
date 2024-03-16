import { Ribbon } from '../base/ribbon';
import { RibbonTabModel } from '../models';
import * as constants from '../base/constant';
import { RibbonContextualTabSettingsModel } from '../models/ribbon-contextual-tab-settings-model';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Defines the ribbon contextual tab.
 */
export class RibbonContextualTab {
    private parent: Ribbon;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonContextualTab';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates Contextual tab.
     *
     * @returns {void}
     * @hidden
     */
    public addContextualTabs(): void {
        let isSelected: boolean = false;
        for (let n: number = 0; n < this.parent.contextualTabs.length; n++) {
            for (let i: number = 0; i < this.parent.contextualTabs[parseInt(n.toString(), 10)].tabs.length; i++) {
                this.parent.addTab(this.parent.contextualTabs[parseInt(n.toString(), 10)].tabs[parseInt(i.toString(), 10)]);
                const index: number = this.parent.tabs.length - 1;
                const tabEle: HTMLElement = this.parent.tabObj.element;
                const toolbarEle: HTMLElement = tabEle.querySelectorAll('.e-toolbar-item')[parseInt(index.toString(), 10)] as HTMLElement;
                toolbarEle.classList.add(constants.RIBBON_CONTEXTUAL_TAB);
                toolbarEle.classList.add('e-hidden');
                if (this.parent.contextualTabs[parseInt(n.toString(), 10)].visible) {
                    this.parent.showTab(this.parent.contextualTabs[parseInt(n.toString(), 10)].tabs[parseInt(i.toString(), 10)].id, true);
                    if (this.parent.contextualTabs[parseInt(n.toString(), 10)].isSelected && !isSelected) {
                        this.parent.selectTab(this.parent.contextualTabs[parseInt(n.toString(), 10)].tabs[0].id);
                        isSelected = true;
                    }
                }
            }
        }
    }

    /**
     * Updates Contextual tab.
     *
     * @param {RibbonContextualTabSettingsModel} newProp - Specifies new properties.
     * @param {RibbonContextualTabSettingsModel} contextualTab - Gets the property of contextual tab.
     * @returns {void}
     * @hidden
     */
    public updateContextualTabs(newProp: RibbonContextualTabSettingsModel, contextualTab: RibbonContextualTabSettingsModel): void {
        if (!(isNullOrUndefined(newProp.visible))) {
            for (let i: number = 0; i < contextualTab.tabs.length; i++) {
                if (newProp.visible) {
                    this.parent.showTab(contextualTab.tabs[parseInt(i.toString(), 10)].id, true);
                }
                else {
                    this.parent.hideTab(contextualTab.tabs[parseInt(i.toString(), 10)].id, true);
                }
            }
        }
        if (!(isNullOrUndefined(newProp.isSelected))) {
            if (newProp.isSelected && contextualTab.visible) {
                this.parent.selectTab(contextualTab.tabs[0].id);
            }
            else {
                const tabEle: HTMLElement = this.parent.tabObj.element;
                for (let i: number = 0; i < this.parent.tabs.length; i++) {
                    const toolbarEle: HTMLElement = tabEle.querySelectorAll('.e-toolbar-item')[parseInt(i.toString(), 10)] as HTMLElement;
                    if (!(toolbarEle.classList.contains('e-hidden') || toolbarEle.classList.contains('e-disable'))) {
                        this.parent.selectTab(this.parent.tabs[parseInt(i.toString(), 10)].id);
                        break;
                    }
                }
            }
        }
        if (newProp.tabs) {
            for (const key in newProp.tabs) {
                let index: number = parseInt(key, 10);
                const tab: RibbonTabModel = this.parent.tabs.filter((e: RibbonTabModel) => e.id === contextualTab.tabs[parseInt(index.toString(), 10)].id)[0];
                this.parent.updateTab(tab);
            }
        }
    }
}
