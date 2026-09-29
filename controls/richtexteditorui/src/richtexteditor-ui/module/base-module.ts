import { RichTextEditorUI } from '../richtexteditor-ui';
import * as events from '../../common/constant';
import { ICssClassArgs } from '../../common/interface';
import { isNullOrUndefined as isNOU, L10n } from '@syncfusion/ej2-base';
import { RichTextEditorUIModel } from '../richtexteditor-ui-model';

export abstract class BaseModule {
    protected parent: RichTextEditorUI;
    protected locale: L10n;
    protected isDestroyed: boolean = false;
    protected isEnabled: boolean;
    constructor(parent: RichTextEditorUI, locale: L10n) {
        this.parent = parent;
        this.locale = locale;
        this.isEnabled = parent.enable;
        this.registerBaseEventListeners();
        this.addEventListener();
    }
    /** Module identifier used by the RTE module loader. */
    public abstract getModuleName(): string;

    /** Register module-specific listeners. Called once, right after base listeners. */
    protected abstract addEventListener(): void;

    /** Remove module-specific listeners. Called from destroy(), before base listeners are removed. */
    protected abstract removeEventListener(): void;

    /** Module-specific teardown (destroy dialogs/popups/components owned by the module). */
    protected abstract destroyModule(): void;

    /**
     * Override when the module owns UI with its own `cssClass` (dialog, popup, checkbox...).
     * Use `updateComponentCssClass` below to apply the diff.
     *
     * @param {ICssClassArgs}_args - ICssClassArgs
     * @returns {void}
     */
    protected onCssClassChange(_args: ICssClassArgs): void { /* no-op */ }

    /**
     * Override to react to `parent.readonly` changes (hide popups, block interaction, etc.).
     *
     * @param {boolean}_readonly - boolean
     * @returns {void}
     */
    protected onReadOnlyChange(_readonly: boolean): void { /* no-op */ }

    /**
     * Override to react to enable/disable of the module itself.
     *
     * @param {boolean}_enabled - enabled
     * @returns {void}
     */
    protected onEnabledChange(_enabled: boolean): void { /* no-op */ }

    /**
     * Override for any other model property this module cares about.
     *
     * @param {string}_prop - property
     * @param {Object}_e - object
     * @returns {void}
     */
    protected onModelPropertyChanged(_prop: string, _e: { [key: string]: RichTextEditorUIModel }): void { /* no-op */ }

    private registerBaseEventListeners(): void {
        this.parent.on(events.destroy, this.onDestroy, this);
        this.parent.on(events.bindCssClass, this.handleCssClassChange, this);
        this.parent.on(events.modelChanged, this.handleModelChanged, this);
    }

    private removeBaseEventListeners(): void {
        this.parent.off(events.destroy, this.onDestroy);
        this.parent.off(events.bindCssClass, this.handleCssClassChange);
        this.parent.off(events.modelChanged, this.handleModelChanged);
    }

    private handleCssClassChange(e: ICssClassArgs): void {
        this.onCssClassChange(e);
    }

    private handleModelChanged(e: { [key: string]: RichTextEditorUIModel }): void {
        for (const prop of Object.keys(e.newProp)) {
            switch (prop) {
            case 'enabled':
                this.isEnabled = e.newProp.enable as unknown as boolean;
                this.onEnabledChange(this.isEnabled);
                break;
            default:
                this.onModelPropertyChanged(prop, e);
                break;
            }
        }
    }

    /**
     * Shared helper: merge/replace a component's cssClass from a bindCssClass diff.
     *
     * @param component
     * @param e
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected updateComponentCssClass(component: any, e: ICssClassArgs): void {
        if (!component || !e || !e.cssClass) {
            return;
        }
        if (isNOU(e.oldCssClass)) {
            component.setProperties({ cssClass: (component.cssClass + ' ' + e.cssClass).trim() });
        } else {
            component.setProperties({
                cssClass: (component.cssClass.replace(e.oldCssClass, '').trim() + ' ' + e.cssClass).trim()
            });
        }
    }

    private onDestroy = (): void => {
        if (this.isDestroyed) {
            return;
        }
        this.removeEventListener();
        this.removeBaseEventListeners();
        this.destroyModule();
        this.isDestroyed = true;
    };

    public destroy(): void {
        this.onDestroy();
    }
}
