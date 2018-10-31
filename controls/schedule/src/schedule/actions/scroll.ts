import { formatUnit } from '@syncfusion/ej2-base';
import { contentReady, uiUpdate, scrollUiUpdate } from '../base/constant';
import { NotifyEventArgs } from '../base/interface';
import { Schedule } from '../base/schedule';
/**
 * `Scroll` module
 */
export class Scroll {
    private parent: Schedule;
    /**
     * Constructor for the scrolling.
     * @hidden
     */
    constructor(parent?: Schedule) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'scroll';
    }
    /**
     * @hidden
     */
    public setWidth(): void {
        this.parent.element.style.width = formatUnit(this.parent.width);
    }
    /**
     * @hidden
     */
    public setHeight(): void {
        this.parent.element.style.height = formatUnit(this.parent.height);
    }
    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(contentReady, this.setDimensions, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    }
    /**
     * @hidden
     */
    public removeEventListener(): void {
        this.parent.off(contentReady, this.setDimensions);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    }
    /**
     * @hidden
     */
    private setDimensions(): void {
        this.setWidth();
        this.setHeight();
        let data: NotifyEventArgs = { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() };
        this.parent.notify(scrollUiUpdate, data);
    }
    /** 
     * @hidden
     */
    private onPropertyChanged(e: NotifyEventArgs): void {
        this.setDimensions();
    }
    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}
