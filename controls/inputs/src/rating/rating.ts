import { addClass, Event, attributes, BaseEventArgs, compile, Component, EmitType, EventHandler, getUniqueID, INotifyPropertyChanged, select } from '@syncfusion/ej2-base';
import { isNullOrUndefined, KeyboardEventArgs, KeyboardEvents, MouseEventArgs, NotifyPropertyChanges, Property, remove, removeClass } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { RatingModel } from './rating-model';

const ICONCSS: string = 'e-rating-icon e-icons e-star-filled';
const ITEMLIST: string = 'e-rating-item-list';
const ITEMCONTAINER: string = 'e-rating-item-container';
const SELECTED: string = 'e-rating-selected';
const INTERMEDIATE: string = 'e-rating-intermediate';
const LABEL: string = 'e-rating-label';
const RESET: string = 'e-icons e-reset';
const HIDDEN: string = 'e-rating-hidden';
const DISABLED: string = 'e-disabled';
const READONLY: string = 'e-rating-readonly';
const RTL: string = 'e-rtl';
const ANIMATION: string = 'e-rating-animation';
const FULLTEMPLATE: string = 'e-rating-full';
const EMPTYTEMPLATE: string = 'e-rating-empty';
const SELECTEDVALUE: string = 'e-selected-value';

const RATINGVALUE: string = '--rating-value';

/**
 * Defines the position of the label in the rating.
 */
export enum LabelPosition {
    /**
     * Shows the label above the rating.
     */
    Top = 'Top',
    /**
     * Shows the label below the rating.
     */
    Bottom = 'Bottom',
    /**
     * Shows the label to the left of rating.
     */
    Left = 'Left',
    /**
     * Shows the label to the right of rating.
     */
    Right = 'Right'
}

/**
 * Defines the minimum increase in the value in Rating Control.
 */
export enum PrecisionType {
    /**
     * Process the value as whole numbers.
     */
    Full = 'Full',
    /**
     * Process the value in terms of 0.5 (half).
     */
    Half = 'Half',
    /**
     * Process the value in terms of 0.25 (quarter).
     */
    Quarter = 'Quarter',
    /**
     * Process the value in terms of 0.1.
     */
    Exact = 'Exact'
}

/**
 * Event triggers whenever the value changes.
 */
export interface RatingChangedEventArgs extends BaseEventArgs {
    /**
     * Provides the original event
     */
    event: Event;

    /**
     * Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;

    /**
     * Provides the previous value.
     */
    previousValue: number;

    /**
     * Provides the current value.
     */
    value: number;
}

/**
 * Event triggers whenever a new item is hovered.
 */
export interface RatingHoverEventArgs extends BaseEventArgs {
    /**
     * Provides the hovered item element.
     */
    element: HTMLElement;

    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides the current value of the hovered item.
     */
    value: number;
}

/**
 * Event triggers before rendering each item.
 */
export interface RatingItemEventArgs extends BaseEventArgs {
    /**
     * Html element of the current item to be rendered.
     */
    element: HTMLElement;

    /**
     * Provides the place value of the item.
     */
    value: number;
}

@NotifyPropertyChanges
export class Rating extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines whether to show or hide the reset button.
     * If min is not zero, then reset button won’t be displayed regardless of allowReset value.
     *
     * @default false
     */
    @Property(false)
    public allowReset: boolean;

    /**
     * Defines the CSS class to customize the rating appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether the rating is enabled or disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines whether to add animation when an item is hovered.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Defines the template content for each item when it is not selected.
     * The template context will contain the current item value for customization.
     *
     * @default ''
     */
    @Property('')
    public emptyTemplate: string;

    /**
     * Defines whether to enable single selection like radio button or not.
     * If not enabled all the items before the selected item will also be in the selected state.
     *
     * @default false
     */
    @Property(false)
    public enableSingleSelection: boolean;

    /**
     * Defines the template content for each item when it is selected.
     * The template context will contain the current item value for customization.
     *
     * @default ''
     */
    @Property('')
    public fullTemplate: string;

    /**
     * Defines the number of rating items.
     *
     * @default 5
     * @aspType int
     */
    @Property(5)
    public itemsCount: number;

    /**
     * Defines the position of the label in the rating.
     * *Top
     * *Bottom
     * *Left
     * *Right
     *
     * @isenumeration true
     * @default LabelPosition.Right
     * @asptype LabelPosition
     */
    @Property(LabelPosition.Right)
    public labelPosition: string | LabelPosition;

    /**
     * Defines the template content for the label.
     * The template context will contain the current value and maximum value for customization.
     *
     * @default ''
     */
    @Property('')
    public labelTemplate: string;

    /**
     * Defines the minimum value of the rating.
     *
     * @default 0.0
     * @aspType double
     */
    @Property(0.0)
    public min: number;

    /**
     * Defines the minimum increase in the value.
     * *Full
     * *Half
     * *Quarter
     * *Exact
     *
     * @isenumeration true
     * @default PrecisionType.Full
     * @asptype PrecisionType
     */
    @Property(PrecisionType.Full)
    public precision: string | PrecisionType;

    /**
     * Defines whether the read only mode is enabled or not where interaction is disabled without any UI change.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * Defines whether to show a label which display the current value.
     *
     * @default false
     */
    @Property(false)
    public showLabel: boolean;

    /**
     * Defines whether to show tooltip for the items.
     *
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * Defines the template content for the tooltip.
     * The template context will contain the current value for customization.
     *
     * @default ''
     */
    @Property('')
    public tooltipTemplate: string;

    /**
     * Defines the rating value.
     *
     * @default 0.0
     * @aspType double
     */
    @Property(0.0)
    public value: number;

    /**
     * Defines whether the rating is visible or hidden.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Event triggers before rendering each item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<RatingItemEventArgs>;

    /**
     * Event triggers after the creation of Rating.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers whenever a new item is hovered.
     *
     * @event onItemHover
     */
    @Event()
    public onItemHover: EmitType<RatingHoverEventArgs>;

    /**
     * Event triggers whenever the value changes.
     *
     * @event valueChanged
     */
    @Event()
    public valueChanged: EmitType<RatingChangedEventArgs>;

    private wrapper: HTMLElement;
    private ratingItemList: HTMLElement;
    private spanLabel: HTMLElement;
    private itemElements: HTMLElement[] = [];
    private resetElement: HTMLSpanElement;
    private keyboardModuleRating: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private tooltipObj: Tooltip;
    private currentValue: number;
    private emptyTemplateFunction: Function;
    private fullTemplateFunction: Function;
    private tooltipOpen: boolean = false;

    /**
     * Constructor for creating the widget
     *
     * @param  {RatingModel} options - Specifies the rating model
     * @param  {string|HTMLButtonElement} element - Specifies the target element
     */
    constructor(options?: RatingModel, element?: string | HTMLInputElement) {
        super(options, <string | HTMLInputElement>element);
    }

    protected preRender(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        this.keyConfigs = {
            downarrow: 'downarrow',
            leftarrow: 'leftarrow',
            rightarrow: 'rightarrow',
            uparrow: 'uparrow',
            space: 'space'
        };
    }

    public render(): void {
        this.initialize();
        this.updateMinValue();
        this.updateTemplateFunction();
        this.renderItems();
        this.updatePrecision();
        this.displayLabel();
    }

    private initialize(): void {
        this.wrapper = this.createElement('div', { className: 'e-' + this.getModuleName() + '-container ' });
        this.element.parentNode.insertBefore(this.wrapper, this.element);
        this.wrapper.appendChild(this.element);
        if ((this.element.getAttribute('name') == null)) {
            this.element.setAttribute('name', this.element.id);
        }
        attributes(this.element, { 'aria-label': 'rating' });
        this.renderItemList();
        this.updateReset();
        this.updateDisabled();
        this.wrapper.classList[this.readOnly ? 'add' : 'remove'](READONLY);
        this.wrapper.classList[!this.visible ? 'add' : 'remove'](HIDDEN);
        this.wrapper.classList[this.enableRtl ? 'add' : 'remove'](RTL);
        this.wrapper.classList[this.enableAnimation ? 'add' : 'remove'](ANIMATION);
        if (this.cssClass) {
            addClass([this.wrapper], this.cssClass.split(' '));
        }
        this.updateTooltip();
        this.wireKeyboardEvent();
    }

    private updateDisabled(): void {
        this.wrapper.classList[this.disabled ? 'add' : 'remove'](DISABLED);
        attributes(this.ratingItemList, { 'tabindex': (this.disabled) ? '-1' : '0' });
        if (this.allowReset) {
            this.updateResetButton();
        }
    }

    private updateResetButton(): void {
        const isDisabled: boolean = (this.value <= this.min) || this.disabled;
        this.resetElement.classList[isDisabled ? 'add' : 'remove'](DISABLED);
        attributes(this.resetElement, { 'aria-label': 'resetbutton', 'role': 'button',
            'tabindex': (isDisabled ? '-1' : '0'), 'aria-hidden': isDisabled.toString() });
    }

    private renderItemList(): void {
        this.ratingItemList = this.createElement('div', {
            className: ITEMLIST,
            id: this.element.id + '_item-list',
            attrs: { 'tabindex': '0' }
        });
        attributes(this.ratingItemList, { 'aria-label': 'rating', 'role': 'slider' });
        this.wrapper.appendChild(this.ratingItemList);
        EventHandler.add(this.ratingItemList, 'touchmove', (e: Event) => this.touchMoveHandler(e), this);
        EventHandler.add(this.ratingItemList, 'touchend', this.touchEndHandler, this);
    }

    private touchMoveHandler(e: Event): void {
        const rect: DOMRect = this.ratingItemList.getBoundingClientRect() as DOMRect;
        const x: number = (e as TouchEvent).touches[0].clientX - rect.x;
        let currValue: number = (x / rect.width) * this.itemsCount;
        currValue = (this.enableRtl) ? (this.itemsCount - currValue) : currValue;
        currValue = currValue < this.min ? this.min : currValue > this.itemsCount ? this.itemsCount : currValue;
        currValue = this.validateValue(currValue);
        const element: HTMLElement = currValue === 0 ? null : this.itemElements[parseInt((Math.ceil(currValue) - 1).toString(), 10)];
        if (currValue === this.currentValue) {
            if (this.showTooltip && element) {
                this.openRatingTooltip(element, false);
            }
            return;
        }
        const previousValue: number = this.currentValue;
        this.updateCurrentValue(currValue);
        this.triggerChange(e, currValue);
        if (this.showTooltip) {
            if (element) {
                if (Math.ceil(currValue) !== Math.ceil(previousValue)) { this.closeRatingTooltip(); }
                this.openRatingTooltip(element, true);
            } else {
                this.closeRatingTooltip();
            }
        }
    }

    private touchEndHandler(): void {
        this.closeRatingTooltip();
    }

    private updateTemplateFunction(): void {
        this.emptyTemplateFunction = this.emptyTemplate ? this.getTemplateString(this.emptyTemplate) : null;
        this.fullTemplateFunction = this.fullTemplate ? this.getTemplateString(this.fullTemplate) : null;
    }

    private renderItems(): void {
        for (let i: number = 0; i < this.itemsCount; i++) {
            const ratingItemContainer: HTMLElement = this.createElement('span', { className: ITEMCONTAINER });
            const spanItem: HTMLElement = this.createElement('span', { className: 'e-rating-item' });
            const ratingValue: number = this.getRatingValue(this.value, i);
            this.renderItemContent(spanItem, ratingValue, i);
            ratingItemContainer.appendChild(spanItem);
            this.wireItemsEvents(ratingItemContainer, i + 1);
            this.itemElements.push(ratingItemContainer);
            const eventArgs: RatingItemEventArgs = { element: ratingItemContainer, value: i + 1 };
            this.trigger('beforeItemRender', eventArgs, (args: RatingItemEventArgs) => {
                this.ratingItemList.appendChild(args.element);
            });
        }
        attributes(this.ratingItemList, { 'aria-valuemax': this.itemsCount.toString() });
        if (this.disabled) {
            attributes(this.ratingItemList, { 'tabindex': '-1' });
        }
    }

    private renderItemContent(spanEle: HTMLElement, val: number, index: number, isrerender: boolean = false): void {
        if (isrerender) {
            this.removeItemContent(spanEle);
        }
        if (this.fullTemplate && val === 1) {
            spanEle.classList.add(FULLTEMPLATE);
            spanEle.append(this.fullTemplateFunction({ index: index, ratingValue: val }, this, 'ratingFullTemplate', (this.element.id + 'fullTemplate'), this.isStringTemplate)[0]);
        }
        else if (this.emptyTemplate) {
            spanEle.classList.add(EMPTYTEMPLATE);
            spanEle.append(this.emptyTemplateFunction({ index: index, ratingValue: val }, this, 'ratingEmptyTemplate', (this.element.id + 'emptyTemplate'), this.isStringTemplate)[0]);
        }
        else {
            addClass([spanEle], ICONCSS.split(' '));
        }
    }

    private removeItemContent(spanEle: HTMLElement): void {
        spanEle.classList.remove(FULLTEMPLATE, EMPTYTEMPLATE);
        removeClass([spanEle], ICONCSS.split(' '));
        if (spanEle.firstChild) {
            spanEle.removeChild(spanEle.firstChild);
        }
    }

    private updateTooltip(): void {
        if (this.showTooltip) {
            this.tooltipObj = new Tooltip({
                target: '.e-rating-item-container', windowCollision: true,
                opensOn: 'Custom', cssClass: 'e-rating-tooltip'
            });
            this.tooltipObj.appendTo('#' + this.ratingItemList.id);
        }
        else {
            if (!isNullOrUndefined(this.tooltipObj)) {
                this.tooltipObj.destroy();
                this.tooltipObj = null;
            }
        }
    }

    private updateMinValue(): void {
        this.min = this.validateValue(this.min);
        if (this.min > 0 && this.value < this.min) {
            this.triggerChange(null, this.min, false);
        }
        attributes(this.ratingItemList, { 'aria-valuemin': this.min.toString() });
    }

    private updatePrecision(): void {
        this.min = this.validateValue(this.min);
        this.triggerChange(null, this.validateValue(this.value), false);
        this.updateItemValue();
    }

    private validateValue(currentValue: number): number {
        if (currentValue > this.itemsCount) {
            currentValue = this.itemsCount;
        }
        else if (currentValue < 0) {
            currentValue = 0;
        }
        else {
            currentValue = (this.precision === PrecisionType.Full) ? Math.round(currentValue) :
                (this.precision === PrecisionType.Half) ? (Math.round(currentValue * 2) / 2) :
                    (this.precision === PrecisionType.Quarter) ? (Math.round(currentValue * 4) / 4) : (Math.round(currentValue * 10) / 10);
        }
        return currentValue;
    }

    private getRatingValue(value: number, i: number): number {
        return (this.enableSingleSelection && this.precision === PrecisionType.Full) ? ((value === i + 1) ? 1 : 0) :
            (value >= i + 1) ? 1 : ((value < i) ? 0 : (value - i));
    }

    private updateItemValue(): void {
        for (let i: number = 0; i < this.itemsCount; i++) {
            const itemElement: HTMLElement = this.itemElements[parseInt(i.toString(), 10)];
            itemElement.classList.remove(SELECTED, INTERMEDIATE, SELECTEDVALUE);
            const ratingValue: number = this.getRatingValue(this.currentValue, i);
            if (ratingValue === 1) { itemElement.classList.add(SELECTED); }
            else if (ratingValue > 0) { itemElement.classList.add(INTERMEDIATE); }
            else if ((this.precision === PrecisionType.Full) && (i + 1 <= this.value) && (!this.enableSingleSelection)) {
                itemElement.classList.add(SELECTEDVALUE);
            }
            this.updateItemContent(ratingValue, i);
            itemElement.style.setProperty(RATINGVALUE, (ratingValue * 100) + '%');
            itemElement.classList[((this.value === 0) && (i === 0)) || (this.value === i + 1) || ((ratingValue > 0) && (ratingValue < 1)) ? 'add' : 'remove']('e-rating-focus');
        }
        if (this.allowReset) {
            this.updateResetButton();
        }
        attributes(this.ratingItemList, { 'aria-valuenow': this.currentValue.toString() });
        attributes(this.element, { 'value': this.value.toString() });
    }

    private updateItemContent(ratingValue: number, index: number): void {
        if (!this.fullTemplate && !this.emptyTemplate) { return; }
        const spanEle: HTMLElement = this.itemElements[parseInt(index.toString(), 10)].querySelector('.e-rating-item');
        if (this.fullTemplate && ratingValue === 1) {
            if (spanEle.classList.contains(FULLTEMPLATE)) { return; }
            this.removeItemContent(spanEle as HTMLElement);
            spanEle.classList.add(FULLTEMPLATE);
            spanEle.append(this.fullTemplateFunction({ ratingValue: ratingValue, index: index }, this, 'ratingFullTemplate', (this.element.id + 'fullTemplate'), this.isStringTemplate)[0]);
        }
        else if (this.emptyTemplate) {
            this.removeItemContent(spanEle as HTMLElement);
            spanEle.classList.add(EMPTYTEMPLATE);
            spanEle.append(this.emptyTemplateFunction({ ratingValue: ratingValue, index: index }, this, 'ratingFullTemplate', (this.element.id + 'fullTemplate'), this.isStringTemplate)[0]);
        }
        else {
            this.removeItemContent(spanEle as HTMLElement);
            addClass([spanEle], ICONCSS.split(' '));
        }
        this.renderReactTemplates();
    }

    private updateTooltipContent(isChange: boolean): void {
        if (this.showTooltip) {
            let content: string | HTMLElement;
            if (this.tooltipTemplate) {
                const templateFunction: Function = this.getTemplateString(this.tooltipTemplate);
                content = templateFunction({ value: this.currentValue }, this, 'ratingTooltipTemplate', (this.element.id + 'tooltipTemplate'), this.isStringTemplate)[0];
            }
            else {
                content = this.currentValue.toString();
            }
            this.tooltipObj.setProperties({ content: content }, isChange);
            this.renderReactTemplates();
        }
    }

    private getTemplateString(template: string): Function {
        let stringContent: string = '';
        try {
            const tempEle: HTMLElement = select(template);
            if (tempEle) {
                //Return innerHTML incase of jsrenderer script else outerHTML
                stringContent = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
            } else {
                stringContent = template;
            }
        } catch (e) {
            stringContent = template;
        }
        return compile(stringContent);
    }

    private displayLabel(): void {
        if (this.showLabel) {
            this.spanLabel = this.createElement('span', { className: LABEL });
            this.updateLabel();
            this.updateLabelPosition();
        }
        else {
            if (this.wrapper.contains(this.spanLabel)) {
                remove(this.spanLabel);
                this.spanLabel = null;
            }
        }
    }

    private updateLabel(): void {
        if (this.showLabel) {
            if (this.labelTemplate) {
                if (this.spanLabel.firstChild) {
                    this.spanLabel.removeChild(this.spanLabel.firstChild);
                }
                const templateFunction: Function = this.getTemplateString(this.labelTemplate);
                this.spanLabel.append(templateFunction({ value: this.currentValue }, this, 'ratingLabelTemplate', (this.element.id + 'labelTemplate'), this.isStringTemplate)[0]);
            }
            else {
                this.spanLabel.textContent = this.currentValue + ' / ' + this.itemsCount;
            }
            this.renderReactTemplates();
        }
    }

    private updateReset(): void {
        if (this.allowReset) {
            this.resetElement = this.createElement('span', { className: RESET });
            this.updateResetButton();
            EventHandler.add(this.resetElement, 'click', this.resetClicked, this);
            this.wrapper.insertBefore(this.resetElement, this.ratingItemList);
        }
        else {
            if (this.wrapper.contains(this.resetElement)) {
                remove(this.resetElement);
                this.resetElement = null;
            }
        }
    }

    private updateLabelPosition(): void {
        this.clearLabelPosition();
        this.spanLabel.classList.add('e-label-' + this.labelPosition.toLowerCase());
        if (this.labelPosition === 'Left' || this.labelPosition === 'Top') {
            this.wrapper.firstChild.after(this.spanLabel);
        }
        else {
            this.wrapper.appendChild(this.spanLabel);
        }
    }

    private clearLabelPosition(): void {
        const removeCss: string[] = this.spanLabel.classList.value.match(/(e-label-[top|bottom|right|left]+)/g);
        if (removeCss) {
            removeClass([this.spanLabel], removeCss);
        }
    }

    private wireItemsEvents(itemElement: HTMLElement, index: number): void {
        EventHandler.add(itemElement, 'click', (e: Event) => this.clickHandler(e), this);
        EventHandler.add(itemElement, 'mousemove', (e: Event) => this.mouseMoveHandler(index, e), this);
        EventHandler.add(itemElement, 'mouseleave', this.mouseLeaveHandler, this);
    }

    private clickHandler(e: Event): void {
        this.currentValue = (this.min > 0 && this.currentValue < this.min) ? this.min : this.currentValue;
        this.triggerChange(e, this.currentValue);
        this.updateItemValue();
        this.updateLabel();
        if (this.allowReset) {
            this.updateResetButton();
        }
    }

    private triggerChange(e: Event, val: number, isInteracted: boolean = true): void {
        val = this.validateValue(val);
        this.currentValue = val;
        if (this.currentValue === this.value) { return; }
        const eventArgs: RatingChangedEventArgs = { event: e, isInteracted: isInteracted, value: val, previousValue: this.value };
        this.setProperties({ value: val }, true);
        this.trigger('valueChanged', eventArgs);
    }

    private mouseMoveHandler(index: number, e: Event): void {
        let currValue: number = this.calculateCurrentValue(index, e as MouseEventArgs);
        currValue = this.validateValue(currValue);
        const element: HTMLElement = this.itemElements[parseInt((index - 1).toString(), 10)];
        if (currValue === this.currentValue) {
            this.openRatingTooltip(element, false);
            return;
        }
        this.updateCurrentValue(currValue);
        this.openRatingTooltip(element, true);
        const eventArgs: RatingHoverEventArgs = { element: element, event: e, value: currValue };
        this.trigger('onItemHover', eventArgs);
    }

    private openRatingTooltip(element: HTMLElement, isChange: boolean): void {
        if (this.showTooltip) {
            if (!this.tooltipOpen) {
                this.updateTooltipContent(false);
                this.tooltipObj.open(element); //eslint-disable-line
                this.tooltipOpen = true;
            } else if (isChange) {
                this.updateTooltipContent(true);
                this.tooltipObj.refresh(element);
            }
        }
    }

    private closeRatingTooltip(): void {
        if (this.tooltipOpen) {
            this.tooltipObj.close();
            this.tooltipOpen = false;
        }
    }

    private updateCurrentValue(currValue: number): void {
        this.currentValue = currValue;
        this.updateItemValue();
        this.updateLabel();
    }

    private mouseLeaveHandler(): void {
        this.closeRatingTooltip();
        this.updateCurrentValue(this.value);
    }

    private calculateCurrentValue(index: number, args: MouseEventArgs): number {
        let currentValue: number = index;
        if (this.precision !== PrecisionType.Full) {
            currentValue = args.offsetX / this.itemElements[index - 1].clientWidth;
            currentValue = (this.enableRtl) ? (1 - currentValue) : currentValue;
            if (this.precision === PrecisionType.Quarter) {
                currentValue = currentValue <= 0.25 ? 0.25 : currentValue <= 0.5 ? 0.5 : currentValue < 0.75 ? 0.75 : 1.0;
            }
            else if (this.precision === PrecisionType.Half) {
                currentValue = currentValue <= 0.5 ? 0.5 : 1;
            }
            currentValue = currentValue + index - 1;
        }
        return currentValue;
    }

    /**
     * Reset’s the value to minimum.
     *
     * @returns {void}
     */
    public reset(): void {
        this.resetClicked(null, false);
    }

    private resetClicked(e: Event, isInteracted: boolean = true): void {
        this.triggerChange(e, this.min, isInteracted);
        this.updateItemValue();
        this.updateLabel();
        this.updateResetButton();
    }

    private wireKeyboardEvent(): void {
        this.keyboardModuleRating = new KeyboardEvents(this.wrapper, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        if (this.disabled || this.readOnly) { return; }
        if ((e.target as HTMLElement).classList.contains(ITEMLIST)) {
            switch (e.action) {
            case 'uparrow':
                this.handleNavigation(e, true);
                break;
            case 'downarrow':
                this.handleNavigation(e, false);
                break;
            case 'leftarrow':
                this.handleNavigation(e, this.enableRtl);
                break;
            case 'rightarrow':
                this.handleNavigation(e, !this.enableRtl);
                break;
            }
        }
        if (this.allowReset && (e.target as HTMLElement).classList.contains('e-reset')) {
            switch (e.action) {
            case 'space':
                this.resetClicked(e);
                break;
            }
        }
    }

    private handleNavigation(e: Event, isIncrease: boolean): void {
        if ((!isIncrease && (this.value > this.min)) || (isIncrease && (this.value < this.itemsCount))) {
            let currentValue: number = (this.precision === PrecisionType.Full) ? 1 : (this.precision === PrecisionType.Half) ? 0.5 :
                (this.precision === PrecisionType.Quarter) ? 0.25 : Math.round(0.1 * 10) / 10;
            currentValue = isIncrease ? this.value + currentValue : this.value - currentValue;
            this.triggerChange(e, (currentValue));
            this.updateItemValue();
            this.updateLabel();
            if (this.allowReset) {
                this.updateResetButton();
            }
        }
    }

    private updateContent(): void {
        for (let i: number = 0; i < this.itemsCount; i++) {
            const itemElement: HTMLElement = this.itemElements[parseInt(i.toString(), 10)].firstElementChild as HTMLElement;
            this.renderItemContent(itemElement, this.getRatingValue(this.value, i), i, true);
        }
    }

    /**
     * To get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'rating';
    }

    /**
     * To get the properties to be maintained in the persisted state.
     *
     * @returns {string} - Persist data
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    private removeItemElements(): void {
        for (let i: number = 0; i < this.itemElements.length; i++) {
            remove(this.itemElements[parseInt(i.toString(), 10)]);
        }
        this.itemElements = [];
    }

    /**
     * Destroys the Rating instance.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        // unwires the events and detach the li elements
        this.removeItemElements();
        if (this.spanLabel) {
            remove(this.spanLabel);
            this.spanLabel = null;
        }
        if (this.resetElement) {
            remove(this.resetElement);
            this.resetElement = null;
        }
        if (this.showTooltip) {
            this.tooltipObj.destroy();
            this.tooltipObj = null;
        }
        remove(this.ratingItemList);
        this.ratingItemList = null;
        this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
        remove(this.wrapper);
        this.wrapper = null;
        this.keyboardModuleRating.destroy();
        ['value', 'aria-label', 'name'].forEach((attr: string) => {
            this.element.removeAttribute(attr);
        });
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {RatingModel} newProp - Specifies new properties
     * @param  {RatingModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: RatingModel, oldProp?: RatingModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'value':
                this.triggerChange(null, (this.value > this.min) ? this.value : this.min, false);
                this.updateItemValue();
                this.updateLabel();
                break;
            case 'min':
                this.updateMinValue();
                this.updateItemValue();
                this.updateLabel();
                break;
            case 'showLabel':
                this.displayLabel();
                break;
            case 'visible':
                this.wrapper.classList[!this.visible ? 'add' : 'remove'](HIDDEN);
                break;
            case 'disabled':
                this.updateDisabled();
                break;
            case 'readOnly':
                this.wrapper.classList[this.readOnly ? 'add' : 'remove'](READONLY);
                break;
            case 'allowReset':
                this.updateReset();
                break;
            case 'enableRtl':
                this.wrapper.classList[this.enableRtl ? 'add' : 'remove'](RTL);
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.wrapper], oldProp.cssClass.split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.wrapper], newProp.cssClass.split(' '));
                }
                break;
            case 'labelPosition':
                this.updateLabelPosition();
                break;
            case 'showTooltip':
                this.updateTooltip();
                break;
            case 'precision':
                this.updatePrecision();
                this.updateLabel();
                break;
            case 'enableSingleSelection':
                this.updateItemValue();
                break;
            case 'enableAnimation':
                this.wrapper.classList[this.enableAnimation ? 'add' : 'remove'](ANIMATION);
                break;
            case 'emptyTemplate':
            case 'fullTemplate':
                this.updateTemplateFunction();
                this.updateContent();
                break;
            case 'labelTemplate':
                this.updateLabel();
                break;
            case 'itemsCount':
                this.removeItemElements();
                this.renderItems();
                this.updateItemValue();
                this.updateLabel();
                break;
            }
        }
    }
}
