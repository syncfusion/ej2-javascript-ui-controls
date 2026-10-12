import { createElement } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { Tab, TabItemModel } from '@syncfusion/ej2-navigations';
import {
    ConditionsEditor,
    ConditionAction
} from './conditions-editor';

/** @private */
export class MobileConditionsEditor extends ConditionsEditor {

    protected onDialogOpened(): void {
        const editor: any = this as any;
        const tab: Tab | null = editor.mobileTab;
        const supportedConditions: ConditionAction[] = editor.supportedConditions;
        const activeConditionType: ConditionAction = editor.activeConditionType;
        const index: number = supportedConditions.indexOf(activeConditionType);
        if (tab && index >= 0) {
            tab.select(index);
        }
    }

    public destroy(): void {
        const editor: any = this as any;
        if (editor.mobileTab) {
            try { editor.mobileTab.destroy(); } catch { /* best-effort */ }
            editor.mobileTab = null;
        }
        super.destroy();
    }

    protected createDialog(): void {
        const editor: any = this as any;
        const supportedConditions: ConditionAction[] = editor.supportedConditions;
        const dialogContent: HTMLElement = createElement('div', {
            className: 'conditions-mobile-dialog-content'
        });
        dialogContent.style.height = '100%';
        dialogContent.style.minHeight = '0';

        const dialogHost: HTMLElement = createElement('div', {
            className: 'conditions-editor-dialog'
        });
        dialogHost.style.position = 'fixed';
        dialogHost.style.top = '0';
        dialogHost.style.left = '0';
        dialogHost.style.width = '100vw';
        dialogHost.style.height = '100vh';
        document.body.appendChild(dialogHost);

        editor.dialogContent = dialogContent;
        editor.dialogHost = dialogHost;
        editor.dialog = new Dialog({
            header: (editor.l10n && editor.l10n.getConstant('conditions')) || 'Conditions',
            showCloseIcon: true,
            closeOnEscape: true,
            enableRtl: editor.enableRtl,
            isModal: true,
            width: '100%',
            height: '80vh',
            animationSettings: { effect: 'FadeZoom' },
            target: editor.parentHost,
            content: dialogContent,
            buttons: [
                {
                    click: () => editor.closeDialog(),
                    buttonModel: {
                        content: (editor.l10n && editor.l10n.getConstant('cancel')) || 'Cancel',
                        cssClass: 'e-flat'
                    }
                },
                {
                    click: () => editor.handleSaveConditions(),
                    buttonModel: {
                        content: (editor.l10n && editor.l10n.getConstant('save')) || 'Save',
                        isPrimary: true,
                        cssClass: 'e-primary import-btn'
                    }
                }
            ],
            close: () => editor.handleDialogClose()
        });
        editor.dialog.appendTo(dialogHost);

        const tabHost: HTMLElement = createElement('div', {
            className: 'conditions-mobile-tabs'
        });
        tabHost.style.height = '100%';
        dialogContent.appendChild(tabHost);

        const tabItems: TabItemModel[] = supportedConditions.map((condition: ConditionAction) => ({
            header: { text: editor.conditionLabel(condition) },
            content: ''
        }));
        editor.mobileTab = new Tab({
            items: tabItems,
            enableRtl: editor.enableRtl,
            loadOn: 'Init',
            animation: { previous: { effect: 'None' }, next: { effect: 'None' } },
            created: () => this.renderTabContents(),
            selected: (args: { selectedIndex?: number }) => {
                const index: number = typeof args.selectedIndex === 'number' ? args.selectedIndex : 0;
                editor.activeConditionType = supportedConditions[index] || editor.activeConditionType;
                this.renderMobileTabContent(index);
            }
        });
        editor.mobileTab.appendTo(tabHost);
    }

    private renderTabContents(): void {
        const editor: any = this as any;
        const supportedConditions: ConditionAction[] = editor.supportedConditions;
        for (let index: number = 0; index < supportedConditions.length; index++) {
            this.renderMobileTabContent(index);
        }
    }

    private renderMobileTabContent(index: number): void {
        const editor: any = this as any;
        const supportedConditions: ConditionAction[] = editor.supportedConditions;
        const tab: Tab | null = editor.mobileTab;
        const dialogContent: HTMLElement | null = editor.dialogContent;
        if (!tab || !dialogContent || !supportedConditions[index]) {
            return;
        }

        const contentWrapper: HTMLElement | null = dialogContent.querySelector('.e-content');
        const pane: HTMLElement | null = contentWrapper
            ? contentWrapper.children[index] as HTMLElement
            : null;
        if (!pane) {
            return;
        }

        const host: HTMLElement = createElement('div', {
            className: 'conditions-mobile-tab-content'
        });
        host.style.height = '100%';
        host.style.overflowY = 'auto';
        host.style.padding = '15px';
        pane.innerHTML = '';
        pane.appendChild(host);
        this.renderRightPane(host, supportedConditions[index]);
    }
}
