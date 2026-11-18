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
     *
     * @param {Schedule} parent Accepts the Schedule instance
     */
    constructor(parent?: Schedule) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} Returns the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'scroll';
    }

    /**
     * Internal method to set the element width
     *
     * @returns {void}
     * @private
     */
    public setWidth(): void {
        this.parent.element.style.width = formatUnit(this.parent.width);
    }

    /**
     * Internal method to set the element height
     *
     * @returns {void}
     * @private
     */
    public setHeight(): void {
        this.parent.element.style.height = formatUnit(this.parent.height);
    }

    /**
     * Internal method to bind events
     *
     * @returns {void}
     * @private
     */
    public addEventListener(): void {
        this.parent.on(contentReady, this.setDimensions, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    }

    /**
     * Internal method to unbind events
     *
     * @returns {void}
     * @private
     */
    public removeEventListener(): void {
        this.parent.off(contentReady, this.setDimensions);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    }

    /**
     * Internal method to set the dimensions
     *
     * @returns {void}
     * @private
     */
    private setDimensions(): void {
        this.setWidth();
        this.setHeight();
        const data: NotifyEventArgs = { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() };
        this.parent.notify(scrollUiUpdate, data);
    }

    /**
     * Internal method to set the dimensions dynamically
     *
     * @returns {void}
     * @private
     */
    private onPropertyChanged(): void {
        this.setDimensions();
    }

    /**
     * Destroy the scroll module
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.removeEventListener();
    }

}
