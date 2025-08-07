import { addClass, Event, attributes, BaseEventArgs, compile, Component, EmitType, EventHandler, getUniqueID, INotifyPropertyChanged, select, Browser, append } from '@syncfusion/ej2-base';
import { isNullOrUndefined, KeyboardEventArgs, KeyboardEvents, MouseEventArgs, NotifyPropertyChanges, Property, remove, removeClass, initializeCSPTemplate, closest } from '@syncfusion/ej2-base';
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
 * Defines where to position the label in rating
 */
export enum LabelPosition {
    /**
     * The label is positioned at the top center of the rating component.
     */
    Top = 'Top',
    /**
     * The label is positioned at the bottom center of the rating component.
     */
    Bottom = 'Bottom',
    /**
     * The label is positioned at the left side of the rating component.
     */
    Left = 'Left',
    /**
     * The label is positioned at the right side of the rating component.
     */
    Right = 'Right'
}

/**
 * Defines the precision type of the rating.
 * It is used to component the granularity of the rating, allowing users to provide ratings with varying levels of precision.
 */
export enum PrecisionType {
    /**
     * The rating is increased in whole number increments.
     */
    Full = 'Full',
    /**
     * The rating is increased in increments of 0.5 (half).
     */
    Half = 'Half',
    /**
     * The rating is increased in increments of 0.25 (quarter).
     */
    Quarter = 'Quarter',
    /**
     * The rating is increased in increments of 0.1.
     */
    Exact = 'Exact'
}

/**
 * Provides information about valueChanged event callback
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
 * Provides information about onItemHover event callback.
 */
export interface RatingHoverEventArgs extends BaseEventArgs {
    /**
     * Provides the rating item element reference.
     */
    element: HTMLElement;

    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides the hover value at hovered point of rating.
     */
    value: number;
}

/**
 * Provides information about beforeItemRender event callback.
 */
export interface RatingItemEventArgs extends BaseEventArgs {
    /**
     * Provides the rating item element reference.
     */
    element: HTMLElement;

    /**
     * Provides the place value of the item.
     */
    value: number;
}

/**
 * The Rating component allows the user to rate something by clicking on a set of symbols on a numeric scale.
 * This allows users to provide feedback or ratings for products, services, or content.
 *
 * ```html
 * <input id="rating">
 * ```
 * ```typescript
 * <script>
 *   let ratingObj: Rating = new Rating();
 *   ratingObj.appendTo('#rating');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Rating extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines whether to show or hide the reset button in a rating component.
     * When set to "true", the reset button will be visible to the user, and they will be able to click it to reset the rating value to its default value.
     *
     * {% codeBlock src='rating/allowReset/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowReset: boolean;

    /**
     * Defines one or more CSS classes that can be used to customize the appearance of a rating component.
     * One or more CSS classes to customize the appearance of the rating component, such as by changing its colors, fonts, sizes, or other visual aspects.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether a rating component is enabled or disabled.
     * A disabled rating component may have a different visual appearance than an enabled one.
     * When set to "true", the rating component will be disabled, and the user will not be able to interact with it.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the template that defines the appearance of each un-rated item in a rating component.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public emptyTemplate: string | Function;

    /**
     * Defines whether to add animation (to provide visual feedback to the user) when an item in a rating component is hovered.
     * When set to "true", an animation will be added when the user hovers their cursor over an item in the rating component.
     *
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Defines whether to select all the items before the selected item should be in selected state in a rating component.
     * When set to "true", only the selected item will be in the selected state, and all other items will be un-selected.
     * When set to "false", all items before the selected one will be in the selected state.
     *
     * @default false
     */
    @Property(false)
    public enableSingleSelection: boolean;

    /**
     * Defines the template that defines the appearance of each rated item in a rating component.
     *
     * {% codeBlock src='rating/fullTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public fullTemplate: string | Function;

    /**
     * Defines the specific number of items (symbols) in rating component.
     * The rating component typically consists of a number of items, such as stars or other symbols, that represent the rating value.
     *
     * @default 5
     * @aspType int
     */
    @Property(5)
    public itemsCount: number;

    /**
     * Defines the position of the label in rating component.
     *
     * The possible values are:
     * * Top
     * * Bottom
     * * Left
     * * Right
     *
     * {% codeBlock src='rating/labelPosition/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default LabelPosition.Right
     * @asptype LabelPosition
     */
    @Property(LabelPosition.Right)
    public labelPosition: string | LabelPosition;

    /**
     * Defines the template that used as label over default label of the rating. The current value of rating passed as context to build the content.
     *
     * {% codeBlock src='rating/labelTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public labelTemplate: string | Function;

    /**
     * Defines the value that specifies minimum rating that a user can select.
     * The value is set to 0, which means that the minimum possible rating is 0.
     *
     * @default 0.0
     * @aspType double
     */
    @Property(0.0)
    public min: number;

    /**
     * Defines the precision type of the rating which used to component the granularity of the rating,
     * allowing users to provide ratings with varying levels of precision.
     *
     * The possible values are:
     * * Full
     * * Half
     * * Quarter
     * * Exact
     *
     * {% codeBlock src='rating/precision/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default PrecisionType.Full
     * @asptype PrecisionType
     */
    @Property(PrecisionType.Full)
    public precision: string | PrecisionType;

    /**
     * Defines a boolean value that specifies whether the read-only mode is enabled for a rating component,
     * which prevents the user from modifying or interacting with the rating value but allows them to read it.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * Defines a value that specifies whether to display a label that shows the current value of a rating.
     * When set to "true", a label will be displayed that shows the current value of the rating; otherwise false.
     *
     * {% codeBlock src='rating/showLabel/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public showLabel: boolean;

    /**
     * Defines a value that defines whether to show tooltip for the items.
     * When set to "true", show tooltip for the items.
     *
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * Defines the template that used as tooltip content over default tooltip content of the rating.
     * The current value of rating passed as context to build the content.
     *
     * {% codeBlock src='rating/tooltipTemplate/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public tooltipTemplate: string | Function;

    /**
     * Defines the current rating value which used to display and update the rating selected by the user.
     * Based on "PrecisionType", users can select ratings with varying levels of precision.
     * The "value" is a decimal value that ranges from the minimum value to the items count,
     * as specified by the "min" and "itemsCount" properties of the rating.
     *
     * {% codeBlock src='rating/value/index.md' %}{% endcodeBlock %}
     *
     * @default 0.0
     * @aspType double
     */
    @Property(0.0)
    public value: number;

    /**
     * Defines a value that indicates whether the rating component is visible or hidden.
     * When set to "true", if the rating component is visible.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Event callback that is raised before rendering each item.
     *
     * {% codeBlock src='rating/beforeItemRenderEvent/index.md' %}{% endcodeBlock %}
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<RatingItemEventArgs>;

    /**
     * Event callback that is raised after rendering the rating.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event callback that is raised when a user hovers over an item.
     *
     * {% codeBlock src='rating/onItemHoverEvent/index.md' %}{% endcodeBlock %}
     *
     * @event onItemHover
     */
    @Event()
    public onItemHover: EmitType<RatingHoverEventArgs>;

    /**
     * Event callback that is raised when the value is changed.
     *
     * {% codeBlock src='rating/valueChangedEvent/index.md' %}{% endcodeBlock %}
     *
     * @event valueChanged
     */
    @Event()
    public valueChanged: EmitType<RatingChangedEventArgs>;

    /* Private variables */
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
    private tooltipOpen: boolean;
    private isTouchSelected: boolean;

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
        this.tooltipOpen = false;
        this.isTouchSelected = false;
        if (closest(this.element, 'form') && this.element.getAttribute('value')) {
            this.setProperties({ value: this.element.getAttribute('value') }, true);
        }
    }

    public render(): void {
        this.initialize();
        this.updateMinValue();
        this.updateTemplateFunction();
        this.triggerChange(null, this.value, false, true);
        this.renderItems();
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
        if (this.readOnly) {
            this.wrapper.classList.add(READONLY);
        }
        if (!this.visible) {
            this.wrapper.classList.add(HIDDEN);
        }
        if (this.enableRtl) {
            this.wrapper.classList.add(RTL);
        }
        if (this.enableAnimation) {
            this.wrapper.classList.add(ANIMATION);
        }
        if (this.cssClass) {
            addClass([this.wrapper], this.cssClass.split(' '));
        }
        this.updateTooltip();
        this.wireKeyboardEvent();
        this.updateDisabled();
    }

    private updateDisabled(): void {
        this.wrapper.classList[this.disabled ? 'add' : 'remove'](DISABLED);
        attributes(this.ratingItemList, { 'tabindex': (this.disabled) ? '-1' : '0' });
        this.updateResetButton();
    }

    private updateResetButton(): void {
        if (this.allowReset) {
            if (this.resetElement) {
                this.resetElement.blur();
            }
            const isDisabled: boolean = (this.value <= this.min) || this.disabled;
            this.resetElement.classList[isDisabled ? 'add' : 'remove'](DISABLED);
            attributes(this.resetElement, { 'tabindex': (isDisabled ? '-1' : '0'), 'aria-hidden': isDisabled.toString() });
        }
    }

    private renderItemList(): void {
        this.ratingItemList = this.createElement('div', {
            className: ITEMLIST,
            id: this.element.id + '_item-list'
        });
        attributes(this.ratingItemList, { 'aria-label': 'rating', 'role': 'slider' });
        this.wrapper.appendChild(this.ratingItemList);
        EventHandler.add(this.ratingItemList, 'touchmove', (e: Event) => this.touchMoveHandler(e), this);
        EventHandler.add(this.ratingItemList, Browser.touchEndEvent, this.touchEndHandler, this);
    }

    private touchMoveHandler(e: Event): void {
        if (!this.isTouchSelected) {
            this.wrapper.classList.add('e-rating-touch');
            this.isTouchSelected = true;
        }
        this.wrapper.classList.add('e-touch-select');
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
        this.triggerChange(e, currValue);
        this.updateCurrentValue(currValue);
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
        this.wrapper.classList.remove('e-touch-select');
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
            this.renderItemContent(spanItem, ratingValue, i , false);
            ratingItemContainer.appendChild(spanItem);
            this.wireItemsEvents(ratingItemContainer, i + 1);
            this.itemElements.push(ratingItemContainer);
            const eventArgs: RatingItemEventArgs = { element: ratingItemContainer, value: i + 1 };
            this.trigger('beforeItemRender', eventArgs, (args: RatingItemEventArgs) => {
                this.ratingItemList.appendChild(args.element);
            });
        }
        attributes(this.ratingItemList, { 'aria-valuemax': this.itemsCount.toString() });
        this.updateItemValue(false);
    }

    private renderItemContent(spanEle: HTMLElement, val: number, index: number, isrerender: boolean): void {
        if (isrerender) {
            this.removeItemContent(spanEle);
        }
        if (this.fullTemplate && val === 1) {
            spanEle.classList.add(FULLTEMPLATE);
            append(this.fullTemplateFunction({ index: index, ratingValue: val }, this, 'ratingFullTemplate', (this.element.id + 'fullTemplate'), this.isStringTemplate), spanEle);
        }
        else if (this.emptyTemplate) {
            spanEle.classList.add(EMPTYTEMPLATE);
            append(this.emptyTemplateFunction({ index: index, ratingValue: val }, this, 'ratingEmptyTemplate', (this.element.id + 'emptyTemplate'), this.isStringTemplate), spanEle);
        }
        else {
            addClass([spanEle], ICONCSS.split(' '));
        }
    }

    private removeItemContent(spanEle: HTMLElement): void {
        spanEle.classList.remove(FULLTEMPLATE, EMPTYTEMPLATE);
        removeClass([spanEle], ICONCSS.split(' '));
        if (spanEle.firstChild) {
            spanEle.innerHTML = '';
        }
    }

    private updateTooltip(): void {
        if (this.showTooltip) {
            this.tooltipObj = new Tooltip({
                target: '.e-rating-item-container', windowCollision: true,
                opensOn: 'Custom', cssClass: this.cssClass ? ('e-rating-tooltip ' + this.cssClass) : 'e-rating-tooltip'
            });
            this.tooltipObj.appendTo(this.ratingItemList);
        }
        else {
            if (!isNullOrUndefined(this.tooltipObj)) {
                this.tooltipObj.destroy();
                this.tooltipObj = null;
            }
        }
    }

    private updateMinValue(): void {
        this.setProperties({min: this.validateValue(this.min)}, true);
        if (this.min > 0 && this.value < this.min) {
            this.triggerChange(null, this.min, false);
        }
        attributes(this.ratingItemList, { 'aria-valuemin': this.min.toString() });
    }

    private validateValue(currentValue: number): number {
        if (currentValue > this.itemsCount) {
            currentValue = this.itemsCount;
        }
        else if (currentValue < 0) {
            currentValue = 0;
        }
        else {
            currentValue = ((this.precision === PrecisionType.Full) || this.enableSingleSelection) ? Math.round(currentValue) :
                (this.precision === PrecisionType.Half) ? (Math.round(currentValue * 2) / 2) :
                    (this.precision === PrecisionType.Quarter) ? (Math.round(currentValue * 4) / 4) : (Math.round(currentValue * 10) / 10);
        }
        return currentValue;
    }

    private getRatingValue(value: number, i: number): number {
        return (this.enableSingleSelection) ? (((value > i) && (value <= i + 1)) ? 1 : 0) :
            (value >= i + 1) ? 1 : ((value < i) ? 0 : (value - i));
    }

    private updateItemValue(isUpdate: boolean = true): void {
        for (let i: number = 0; i < this.itemsCount; i++) {
            const itemElement: HTMLElement = this.itemElements[parseInt(i.toString(), 10)];
            itemElement.classList.remove(SELECTED, INTERMEDIATE, SELECTEDVALUE);
            const ratingValue: number = this.getRatingValue(this.currentValue, i);
            if (ratingValue === 1) { itemElement.classList.add(SELECTED); }
            else if (ratingValue > 0) { itemElement.classList.add(INTERMEDIATE); }
            else if ((this.precision === PrecisionType.Full) && (i + 1 <= this.value) && (!this.enableSingleSelection)) {
                itemElement.classList.add(SELECTEDVALUE);
            }
            if (isUpdate) { this.updateItemContent(ratingValue, i); }
            itemElement.style.setProperty(RATINGVALUE, (ratingValue * 100) + '%');
            itemElement.classList[((this.value === 0) && (i === 0)) || (this.value === i + 1) || ((ratingValue > 0) && (ratingValue < 1)) ? 'add' : 'remove']('e-rating-focus');
        }
        if (isUpdate) { this.renderReactTemplates(); }
        this.updateResetButton();
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
            append(this.fullTemplateFunction({ ratingValue: ratingValue, index: index }, this, 'ratingFullTemplate', (this.element.id + 'fullTemplate' + index), this.isStringTemplate), spanEle);
        }
        else if (this.emptyTemplate) {
            if (spanEle.classList.contains(EMPTYTEMPLATE)) { return; }
            this.removeItemContent(spanEle as HTMLElement);
            spanEle.classList.add(EMPTYTEMPLATE);
            append(this.emptyTemplateFunction({ ratingValue: ratingValue, index: index }, this, 'ratingEmptyTemplate', (this.element.id + 'emptyTemplate' + index), this.isStringTemplate), spanEle);
        }
        else {
            this.removeItemContent(spanEle as HTMLElement);
            addClass([spanEle], ICONCSS.split(' '));
        }
    }

    private updateTooltipContent(isChange: boolean): void {
        if (this.showTooltip) {
            if (this.isReact) { this.clearTemplate(['ratingTooltipTemplate']); }
            let content: string | HTMLElement;
            if (this.tooltipTemplate) {
                content = this.createElement('span', { className: 'e-rating-tooltip-content' });
                const templateFunction: Function = this.getTemplateString(this.tooltipTemplate);
                append(templateFunction({ value: this.currentValue }, this, 'ratingTooltipTemplate', (this.element.id + 'tooltipTemplate'), this.isStringTemplate), (content as HTMLElement));
                this.tooltipObj.setProperties({ content: content }, isChange);
                if (this.isAngular) {
                    setTimeout(() => {
                        const ratingSpan: NodeListOf<HTMLElement> = this.ratingItemList.querySelectorAll('.' + ITEMCONTAINER + '.' + SELECTED);
                        this.tooltipObj.refresh(ratingSpan[ratingSpan.length - 1]);
                    });
                }
            }
            else {
                content = this.currentValue.toString();
                this.tooltipObj.setProperties({ content: initializeCSPTemplate( () => { return content; }) }, isChange);
            }
            this.renderReactTemplates();
        }
    }

    private getTemplateString(template: string | Function): Function {
        let stringContent: string | Function = '';
        try {
            if (typeof template !== 'function') {
                const tempEle: HTMLElement = select(template);
                if (tempEle) {
                    //Return innerHTML incase of jsrenderer script else outerHTML
                    stringContent = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
                } else {
                    stringContent = template;
                }
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
                if (this.isReact) { this.clearTemplate(['ratingLabelTemplate']); }
                if (this.spanLabel.firstChild) {
                    this.spanLabel.innerHTML = '';
                }
                const templateFunction: Function = this.getTemplateString(this.labelTemplate);
                append(templateFunction({ value: this.currentValue }, this, 'ratingLabelTemplate', (this.element.id + 'labelTemplate'), this.isStringTemplate), this.spanLabel);
                this.renderReactTemplates();
            }
            else {
                this.spanLabel.textContent = this.currentValue + ' / ' + this.itemsCount;
            }
        }
    }

    private updateReset(): void {
        if (this.allowReset) {
            this.resetElement = this.createElement('span', {
                className: RESET,
                attrs: {'aria-label': 'resetbutton', 'role': 'button'}
            });
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
        this.updateResetButton();
    }

    private updateValueChange(e: Event, val: number, isInteracted: boolean = true): void{
        this.triggerChange(e, val, isInteracted);
        this.updateItemValue();
        this.updateLabel();
    }

    private triggerChange(e: Event, val: number, isInteracted: boolean = true, isInitial: boolean = false): void {
        const ratingObj: any = null || this;
        val = this.validateValue(val);
        this.currentValue = val;
        if (this.currentValue === this.value) { return; }
        const eventArgs: RatingChangedEventArgs = { event: e, isInteracted: isInteracted, value: val, previousValue: this.value };
        this.setProperties({ value: val }, true);
        if (this.isAngular && !isInitial) {
            ratingObj.localChange({ value: val });
        }
        if (!isInitial) {
            this.trigger('valueChanged', eventArgs);
        }
    }

    private mouseMoveHandler(index: number, e: Event): void {
        if (this.isTouchSelected) {
            this.wrapper.classList.remove('e-rating-touch');
            this.isTouchSelected = false;
        }
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
                this.tooltipObj.open(element);
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
        if (!(this.enableSingleSelection || (this.precision === PrecisionType.Full))) {
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
     * {% codeBlock src='rating/reset/index.md' %}{% endcodeBlock %}
     *
     * @returns {void}
     */
    public reset(): void {
        this.resetClicked(null, false);
    }

    private resetClicked(e: Event, isInteracted: boolean = true): void {
        this.updateValueChange(e, this.min, isInteracted);
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
        e.preventDefault();
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
            let currentValue: number = (this.precision === PrecisionType.Full || this.enableSingleSelection) ? 1 :
                (this.precision === PrecisionType.Half) ? 0.5 : (this.precision === PrecisionType.Quarter) ? 0.25 :
                    Math.round(0.1 * 10) / 10;
            currentValue = isIncrease ? this.value + currentValue : this.value - currentValue;
            this.updateValueChange(e, (currentValue));
            this.updateResetButton();
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
        this.clearTemplate();
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
        this.keyboardModuleRating = null;
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
                this.updateValueChange(null, (this.value > this.min) ? this.value : this.min, false);
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
                if (this.tooltipObj) {
                    this.tooltipObj.setProperties({ cssClass: this.cssClass ? ('e-rating-tooltip ' + this.cssClass) : 'e-rating-tooltip'});
                }
                break;
            case 'labelPosition':
                this.updateLabelPosition();
                break;
            case 'showTooltip':
                this.updateTooltip();
                break;
            case 'precision':
                this.updateMinValue();
                this.triggerChange(null, this.value, false);
                this.updateItemValue();
                this.updateLabel();
                break;
            case 'enableSingleSelection':
                //To validate the value against single selection and update the items, label + trigger change event if value changed
                this.updateValueChange(null, this.currentValue, false);
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
                this.updateLabel();
                break;
            }
        }
    }
}
