import { InPlaceEditor } from '../base/inplace-editor';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as events from '../base/events';
import { NotifyParams, IComponent } from '../base/interface';

/**
 * The `Base` module.
 */
export class Base {
    protected parent: InPlaceEditor;
    protected module: IComponent;

    public constructor(parent: InPlaceEditor, module: IComponent) {
        this.parent = parent;
        this.module = module;
        this.addEventListener();
    }

    private render(e: NotifyParams): void {
        this.module.render(e);
    }

    private showPopup(): void {
        this.module.showPopup();
    }

    private focus(): void {
        this.module.focus();
    }

    private update(e: NotifyParams): void {
        this.module.updateValue(e);
    }

    private getValue(): void {
        this.module.getRenderValue();
    }

    private destroyComponent(): void {
        if (isNOU(this.module.compObj)) {
            return;
        }
        this.module.compObj.destroy();
        this.module.compObj = undefined;
    }

    public destroy(): void {
        this.destroyComponent();
        this.removeEventListener();
    }

    protected addEventListener(): void {
        this.parent.on(events.render, this.render, this);
        this.parent.on(events.setFocus, this.focus, this);
        this.parent.on(events.showPopup, this.showPopup, this);
        this.parent.on(events.update, this.update, this);
        this.parent.on(events.accessValue, this.getValue, this);
        this.parent.on(events.destroyModules, this.destroyComponent, this);
        this.parent.on(events.destroy, this.destroy, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.render, this.render);
        this.parent.off(events.setFocus, this.focus);
        this.parent.off(events.showPopup, this.showPopup);
        this.parent.off(events.update, this.update);
        this.parent.off(events.accessValue, this.getValue);
        this.parent.off(events.destroyModules, this.destroyComponent);
        this.parent.off(events.destroy, this.destroy);
    }
}