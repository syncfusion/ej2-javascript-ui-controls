import { Component, INotifyPropertyChanged, ChildProperty, Collection, BaseEventArgs, Event, EmitType, NotifyPropertyChanges, Property, getUniqueID, attributes, select, compile, remove, removeClass, append, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TimelineModel, TimelineItemModel } from '../timeline';

const ITEMLISTCONTAINER: string = 'e-timeline-items';
const ITEMCONTAINER: string = 'e-timeline-item';
const OPPOSITECONTENT: string = 'e-opposite-content';
const DOTCONTAINER: string = 'e-dot-item';
const DOTCONTENT: string = 'e-dot';
const CONTENT: string = 'e-content';
const ITEMCONNECTOR: string = 'e-connector';
const VERTICAL: string = 'e-vertical';
const HORIZONTAL: string = 'e-horizontal';
const TIMELINEREVERSE: string = 'e-timeline-reverse';
const RTL: string = 'e-rtl';
const DISABLED: string = 'e-item-disabled';
const TEMPLATE: string = 'e-item-template';

/**
 * Defines the orientation type of the Timeline.
 */
export enum TimelineOrientation {
    /**
     * Items are displayed horizontally.
     */
    Horizontal = 'Horizontal',
    /**
     * Items are displayed vertically.
     */
    Vertical = 'Vertical'
}

/**
 * Specifies the alignment of item content within the Timeline.
 */
export enum TimelineAlign {
    /**
     * Aligns item content to the top and opposite content to the bottom when the Timeline is in a horizontal orientation, or the content to the left and opposite content to the right when the Timeline is in a vertical orientation.
     */
    Before = 'Before',
    /**
     * Aligns item content to the bottom and opposite content to the top when the Timeline is in a horizontal orientation, or the content to the right and opposite content to the left when the Timeline is in a vertical orientation.
     */
    After = 'After',
    /**
     * Aligns item content alternatively, regardless of the Timeline's orientation.
     */
    Alternate = 'Alternate',
    /**
     * Aligns item content in alternate reverse, regardless of the Timeline's orientation.
     */
    AlternateReverse = 'AlternateReverse'
}

/**
 * Specifies the items of the Timeline.
 */
export class TimelineItem extends ChildProperty<TimelineItem>  {
    /**
     * Defines one or more CSS classes to include an icon or image in the Timeline item.
     *
     * @default ''
     */
    @Property('')
    public dotCss: string;

    /**
     * Defines the text content or template for the Timeline item. The current itemIndex passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public content: string | Function;

    /**
     * Defines the additional text content or template to be displayed opposite side of the item. The current itemIndex passed as context to build the content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public oppositeContent: string | Function;

    /**
     * Defines whether to enable or disable the timeline item.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the CSS class to customize the Timeline item appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
}

/**
 * Provides information about beforeItemRender event callback.
 */
export interface TimelineRenderingEventArgs extends BaseEventArgs {
    /**
     * Provides the timeline element.
     */
    element: HTMLElement;

    /**
     * Provides the index of the current item.
     */
    index: number;
}

/**
 * The Timeline component presents a series of events or activities in chronological order, allowing users to track the progression of time.
 *
 * ```html
 * <div id="timeline"></div>
 * ```
 * ```typescript
 * <script>
 *   let timelineObj: Timeline = new Timeline({items : [{}, {}, {}, {}, {}]});
 *   timelineObj.appendTo('#timeline');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Timeline extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the orientation type of the Timeline.
     *
     * The possible values are:
     * * Horizontal
     * * vertical
     *
     * {% codeBlock src='timeline/orientation/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default TimelineOrientation.Vertical
     * @asptype TimelineOrientation
     */
    @Property(TimelineOrientation.Vertical)
    public orientation: string | TimelineOrientation;

    /**
     * Defines the alignment of item content within the Timeline.
     *
     * The possible values are:
     * * Before
     * * After
     * * Alternate
     * * AlternateReverse
     *
     * {% codeBlock src='timeline/align/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default TimelineAlign.After
     * @asptype TimelineAlign
     */
    @Property(TimelineAlign.After)
    public align: string | TimelineAlign;

    /**
     * Defines the list of items.
     *
     * @default []
     */
    @Collection<TimelineItemModel[]>([], TimelineItem)
    public items: TimelineItemModel[];

    /**
     * Defines the CSS class to customize the Timeline appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether to show the timeline items in reverse order or not.
     *
     * @default false
     */
    @Property(false)
    public reverse: boolean;

    /**
     * Defines the template content for each timeline item. The template context will contain the item model.
     *
     * {% codeBlock src='timeline/template/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Event callback that is raised after rendering the timeline.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Event triggers before rendering each item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<TimelineRenderingEventArgs>;

    /* Private variables */
    private timelineListEle: HTMLElement;
    private templateFunction: Function;

    /**
     * * Constructor for creating the Timeline component.
     *
     * @param {TimelineModel} options - Specifies the Timeline model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    constructor(options?: TimelineModel, element?: string | HTMLElement) {
        super(options, element);
    }

    protected preRender(): void {
        if (!this.element.id) { this.element.id = getUniqueID('e-' + this.getModuleName()); }
    }

    /**
     * To get component name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    public getModuleName(): string {
        return 'timeline';
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    protected render(): void {
        attributes(this.element, { 'role': 'navigation', 'aria-label': this.element.id });
        this.timelineListEle = this.createElement('ol', { className: ITEMLISTCONTAINER });
        this.updateOrientation();
        this.updateCssClass(this.cssClass);
        this.updateAlign();
        this.updateReverse();
        this.updateRtl();
        this.updateTemplateFunction();
        this.renderItems();
        this.element.appendChild(this.timelineListEle);
    }

    protected updateOrientation(): void {
        if (!(isNullOrUndefined(this.orientation))) {
            const orientation: string = this.orientation.toLowerCase();
            if (orientation === 'horizontal' || orientation === 'vertical') {
                this.element.classList.remove(HORIZONTAL, VERTICAL);
                this.element.classList.add('e-' + orientation);
            }
        }
    }

    protected updateCssClass(addCss: string, removeCss: string = ''): void {
        let cssClasses: string[];
        if (removeCss) {
            cssClasses = removeCss.trim().split(' ');
            this.element.classList.remove(...cssClasses);
        }
        if (addCss) {
            cssClasses = addCss.trim().split(' ');
            this.element.classList.add(...cssClasses);
        }
    }

    protected updateRtl(): void {
        this.element.classList[this.enableRtl ? 'add' : 'remove'](RTL);
    }

    protected updateAlign(): void {
        if (!(isNullOrUndefined(this.align))) {
            const align: string = this.align.toLowerCase();
            if (align === 'before' || align === 'after' || align === 'alternate' || align === 'alternatereverse') {
                this.element.classList.remove('e-align-before', 'e-align-after', 'e-align-alternate', 'e-align-alternatereverse');
                this.element.classList.add('e-align-' + align);
            }
        }
    }

    protected updateReverse(): void {
        this.element.classList[this.reverse ? 'add' : 'remove'](TIMELINEREVERSE);
    }

    private renderItems(): void {
        this.haveOneSidecontent();
        for (let index: number = 0; index < this.items.length; index++) {
            const item: TimelineItemModel = this.items[parseInt(index.toString(), 10)];
            const timelineItem: HTMLElement = this.createElement('li', { className: ITEMCONTAINER + ' ' + ITEMCONNECTOR });
            if (!this.template) {
                const oppositeTextEle: HTMLElement = this.createElement('div', { className: OPPOSITECONTENT });
                if (item.oppositeContent) { this.updateItemContent(false, item, index, oppositeTextEle); }
                timelineItem.appendChild(oppositeTextEle);
                const dotContainer: HTMLElement = this.createElement('div', { className: DOTCONTAINER });
                const dotEleCss: string = item.dotCss ? DOTCONTENT + ' ' + item.dotCss.trim() : DOTCONTENT;
                const dotEle: HTMLElement = this.createElement('div', { className: dotEleCss });
                dotContainer.appendChild(dotEle);
                timelineItem.appendChild(dotContainer);
                const contentEle: HTMLElement = this.createElement('div', { className: CONTENT });
                if (item.content){ this.updateItemContent(true, item, index, contentEle); }
                timelineItem.appendChild(contentEle);
                if (item.cssClass) { timelineItem.classList.add(...item.cssClass.trim().split(' ')); }
                if (item.disabled) { timelineItem.classList.add(DISABLED); }
            }
            else {
                this.renderItemContent(index, false, timelineItem);
            }
            const eventArgs: TimelineRenderingEventArgs = { element: timelineItem, index: index };
            this.trigger('beforeItemRender', eventArgs, (args: TimelineRenderingEventArgs) => { this.timelineListEle.appendChild(args.element); });
        }
    }

    private haveOneSidecontent(): void {
        let haveContent: boolean = false;
        let haveOppContent: boolean = false;
        for (let index: number = 0; index < this.items.length; index++) {
            const item: TimelineItemModel = this.items[parseInt(index.toString(), 10)];
            if (!haveContent) { haveContent = item.content.length > 0; }
            if (!haveOppContent) { haveOppContent = item.oppositeContent.length > 0; }
        }
        this.element.classList.remove('e-content-only', 'e-opposite-content-only');
        if (haveContent && !haveOppContent) { this.element.classList.add('e-content-only'); }
        if (haveOppContent && !haveContent) { this.element.classList.add('e-opposite-content-only'); }
    }

    private updateItemContent(isContent: boolean, item: TimelineItemModel, index: number, contentEle: HTMLElement): void {
        const notCompile: boolean = !(this.isReact || this.isVue);
        const ctn: string | Function = this.getTemplateFunction(isContent ? item.content : item.oppositeContent, notCompile);
        if (typeof ctn === 'string') {
            contentEle.innerText = ctn;
        } else {
            append(ctn({ item: item, itemIndex: index }, this), contentEle);
        }
    }

    private updateTemplateFunction(): void {
        this.templateFunction = this.template ? this.getTemplateFunction(this.template, false) as Function : null;
    }

    private renderItemContent(index: number, isrerender: boolean, timelineItem?: HTMLElement): void {
        const listItems: NodeListOf<Element> = this.timelineListEle.querySelectorAll('li');
        if (isrerender) {
            this.removeItemContent(listItems[parseInt((index).toString(), 10)] as HTMLElement);
        }
        if (this.template) {
            if (isrerender) { listItems[parseInt((index).toString(), 10)].classList.add(TEMPLATE); }
            else { timelineItem.classList.add(TEMPLATE); }
            const item: TimelineItemModel = this.items[parseInt(index.toString(), 10)];
            append(this.templateFunction({ item: item, itemIndex: index }, this, 'timelineTemplate', (this.element.id + '_timelineTemplate'), this.isStringTemplate), isrerender ? listItems[parseInt((index).toString(), 10)] : timelineItem);
        }
        this.renderReactTemplates();
    }

    private removeItemContent(ele: HTMLElement): void {
        ele.classList.remove(TEMPLATE);
        const firstChild: HTMLElement = ele.firstElementChild as HTMLElement;
        for (let i: number = 0; i < ele.childElementCount; i++) {
            firstChild.remove();
        }
    }

    /**
     * Gets template content based on the template property value.
     *
     * @param {string | Function} template - Template property value.
     * @param {boolean} notCompile - Compile property value.
     * @returns {Function} - Return template function.
     * @hidden
     */
    private getTemplateFunction(template: string | Function, notCompile: boolean = true): string | Function {
        if (typeof template === 'string') {
            let content: string = '';
            try {
                const tempEle: HTMLElement = select(template);
                if (tempEle) {
                    //Return innerHTML incase of jsrenderer script else outerHTML
                    content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
                    notCompile = false;
                } else {
                    content = template;
                }
            } catch (e) {
                content = template;
            }
            return notCompile ? content : compile(content);
        } else {
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            return compile(template as any);
        }
    }

    private removeItemElements(): void {
        const listItems: NodeListOf<Element> = this.timelineListEle.querySelectorAll('li');
        for (let i: number = 0; i < listItems.length; i++) {
            remove(listItems[parseInt(i.toString(), 10)]);
        }
    }

    private updateElementClassArray(): void {
        const classArray: string[] = [RTL, 'e-align-before', 'e-align-after', 'e-outline', 'e-fill', 'e-align-alternate',
            'e-align-alternatereverse', TIMELINEREVERSE, HORIZONTAL, VERTICAL];
        removeClass([this.element], classArray);
    }

    private updateContent(): void {
        if (this.isReact) { this.clearTemplate(['timelineTemplate']); }
        for (let i: number = 0; i < this.items.length; i++) {
            this.renderItemContent(i, true);
        }
    }

    public destroy(): void {
        super.destroy();
        // unwires the events and detach the li elements
        this.removeItemElements();
        this.element.removeAttribute('role');
        this.element.removeAttribute('aria-label');
        this.clearTemplate();
        if (this.timelineListEle) { remove(this.timelineListEle); }
        this.timelineListEle = null;
        this.updateElementClassArray();
    }

    private updateItems(newProp: string, oldPropItems: TimelineItemModel, index: number, item: TimelineItemModel): void {
        const timelineItemElements: NodeListOf<Element> = this.timelineListEle.querySelectorAll('li');
        let dotEle: HTMLElement;
        let contentEle: HTMLElement;
        let oppositeEle: HTMLElement;
        switch (newProp) {
        case 'dotCss':
            dotEle = timelineItemElements[parseInt(index.toString(), 10)].querySelector('.' + DOTCONTENT);
            if (oldPropItems.dotCss !== '') { dotEle.classList.remove(...oldPropItems.dotCss.trim().split(' ')); }
            if (item.dotCss !== '') { dotEle.classList.add(...this.items[parseInt(index.toString(), 10)].dotCss.trim().split(' ')); }
            break;
        case 'content':
            contentEle = timelineItemElements[parseInt(index.toString(), 10)].querySelector('.' + CONTENT);
            contentEle.innerText = '';
            this.updateItemContent(true, item, index, contentEle);
            this.haveOneSidecontent();
            break;
        case 'oppositeContent':
            oppositeEle = timelineItemElements[parseInt(index.toString(), 10)].querySelector('.' + OPPOSITECONTENT);
            oppositeEle.innerText = '';
            this.updateItemContent(false, item, index, oppositeEle);
            this.haveOneSidecontent();
            break;
        case 'disabled':
            timelineItemElements[parseInt(index.toString(), 10)].classList[this.items[parseInt(index.toString(), 10)].disabled ? 'add' : 'remove'](DISABLED);
            break;
        case 'cssClass':
            if (oldPropItems.cssClass !== '') {
                timelineItemElements[parseInt(index.toString(), 10)].classList.remove(...oldPropItems.cssClass.trim().split(' '));
            }
            if (item.cssClass !== '') {
                timelineItemElements[parseInt(index.toString(), 10)].classList.add(...item.cssClass.trim().split(' '));
            }
            break;
        }
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {TimelineModel} newProp - Specifies new properties
     * @param  {TimelineModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TimelineModel, oldProp?: TimelineModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'items':
                if (Array.isArray(newProp.items)) {
                    this.removeItemElements();
                    this.renderItems();
                } else {
                    const itemLength: number = Object.keys(newProp.items).length;
                    for (let i: number = 0; i < itemLength; i++) {
                        const itemPropLength: number = parseInt(Object.keys(newProp.items)[i as number], 10);
                        for (let j: number = 0; j < Object.keys(newProp.items[itemPropLength as number]).length; j++) {
                            const property: string = Object.keys(newProp.items[itemPropLength as number])[j as number];
                            this.updateItems(property, oldProp.items[itemPropLength as number], itemPropLength,
                                             newProp.items[itemPropLength as number]);
                        }
                    }
                }
                break;
            case 'orientation':
                this.updateOrientation();
                break;
            case 'align':
                this.updateAlign();
                break;
            case 'enableRtl':
                this.updateRtl();
                break;
            case 'cssClass':
                this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                break;
            case 'reverse':
                this.element.classList[this.reverse ? 'add' : 'remove'](TIMELINEREVERSE);
                break;
            case 'template':
                this.updateTemplateFunction();
                this.updateContent();
                break;
            }
        }
    }
}
