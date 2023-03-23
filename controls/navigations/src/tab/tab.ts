import { Component, Property, Event, EmitType, closest, Collection, Complex, attributes, detach, Instance, isNullOrUndefined } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, select, isVisible } from '@syncfusion/ej2-base';
import { KeyboardEvents, KeyboardEventArgs, MouseEventArgs, Effect, Browser, formatUnit, DomElements, L10n } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, isNullOrUndefined as isNOU, selectAll, addClass, removeClass, remove } from '@syncfusion/ej2-base';
import { EventHandler, rippleEffect, Touch, SwipeEventArgs, compile, Animation, AnimationModel, BaseEventArgs } from '@syncfusion/ej2-base';
import { getRandomId, SanitizeHtmlHelper, Draggable, DragEventArgs as DragArgs, DropEventArgs } from '@syncfusion/ej2-base';
import { Base } from '@syncfusion/ej2-base';
import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { Toolbar, OverflowMode, ClickEventArgs } from '../toolbar/toolbar';
import { TabModel, TabItemModel, HeaderModel, TabActionSettingsModel, TabAnimationSettingsModel } from './tab-model';

type HTEle = HTMLElement;
type Str = string;

/**
 * Specifies the orientation of the Tab header.
 * ```props
 * Top :- Places the Tab header on the top.
 * Bottom :- Places the Tab header on the bottom.
 * Left :- Places the Tab header on the left.
 * Right :- Places the Tab header on the right.
 * ```
 */
export type HeaderPosition = 'Top' | 'Bottom' | 'Left' | 'Right';

/**
 * Options to set the content element height adjust modes.
 * ```props
 * None :- Based on the given height property, the content panel height is set.
 * Auto :- Tallest panel height of a given Tab content is set to all the other panels.
 * Content :- Based on the corresponding content height, the content panel height is set.
 * Fill :- Content element take height based on the parent height.
 * ```
 */
export type HeightStyles = 'None' | 'Auto' | 'Content' | 'Fill';

/**
 * Specifies the options of Tab content display mode.
 * ```props
 * Demand :- The content of the selected tab alone is loaded initially. The content of the tabs which were loaded once will be maintained in the DOM.
 * Dynamic :- The content of all the tabs are rendered on the initial load and maintained in the DOM.
 * Init :- The content of all the tabs are rendered on the initial load and maintained in the DOM.
 * ```
 */

export type ContentLoad = 'Dynamic' | 'Init' | 'Demand';

const CLS_TAB: string = 'e-tab';
const CLS_HEADER: string = 'e-tab-header';
const CLS_BLA_TEM: string = 'blazor-template';
const CLS_CONTENT: string = 'e-content';
const CLS_NEST: string = 'e-nested';
const CLS_ITEMS: string = 'e-items';
const CLS_ITEM: string = 'e-item';
const CLS_TEMPLATE: string = 'e-template';
const CLS_RTL: string = 'e-rtl';
const CLS_ACTIVE: string = 'e-active';
const CLS_DISABLE: string = 'e-disable';
const CLS_HIDDEN: string = 'e-hidden';
const CLS_FOCUS: string = 'e-focused';
const CLS_ICONS: string = 'e-icons';
const CLS_ICON: string = 'e-icon';
const CLS_ICON_TAB: string = 'e-icon-tab';
const CLS_ICON_CLOSE: string = 'e-close-icon';
const CLS_CLOSE_SHOW: string = 'e-close-show';
const CLS_TEXT: string = 'e-tab-text';
const CLS_INDICATOR: string = 'e-indicator';
const CLS_WRAP: string = 'e-tab-wrap';
const CLS_TEXT_WRAP: string = 'e-text-wrap';
const CLS_TAB_ICON: string = 'e-tab-icon';
const CLS_TB_ITEMS: string = 'e-toolbar-items';
const CLS_TB_ITEM: string = 'e-toolbar-item';
const CLS_TB_POP: string = 'e-toolbar-pop';
const CLS_TB_POPUP: string = 'e-toolbar-popup';
const CLS_HOR_NAV: string = 'e-hor-nav';
const CLS_POPUP_OPEN: string = 'e-popup-open';
const CLS_POPUP_CLOSE: string = 'e-popup-close';
const CLS_PROGRESS: string = 'e-progress';
const CLS_IGNORE: string = 'e-ignore';
const CLS_OVERLAY: string = 'e-overlay';
const CLS_HSCRCNT: string = 'e-hscroll-content';
const CLS_VSCRCNT: string = 'e-vscroll-content';
const CLS_VTAB: string = 'e-vertical-tab';
const CLS_VERTICAL: string = 'e-vertical';
const CLS_VLEFT: string = 'e-vertical-left';
const CLS_VRIGHT: string = 'e-vertical-right';
const CLS_HBOTTOM: string = 'e-horizontal-bottom';
const CLS_FILL: string = 'e-fill-mode';
const TABITEMPREFIX: string = 'tabitem_';
const CLS_REORDER_ACTIVE_ITEM: string = 'e-reorder-active-item';

/** An interface that holds options to control the selected item action. */
export interface SelectEventArgs extends BaseEventArgs {
    /** Defines the previous Tab item element. */
    previousItem: HTMLElement
    /** Defines the previous Tab item index. */
    previousIndex: number
    /** Defines the selected Tab item element. */
    selectedItem: HTMLElement
    /** Defines the selected Tab item index. */
    selectedIndex: number
    /** Defines the content selection done through swiping. */
    isSwiped: boolean
    /** Defines the prevent action. */
    cancel?: boolean
    /** Defines the selected content. */
    selectedContent: HTMLElement
    /** Determines whether the event is triggered via user interaction or programmatic way. True, if the event is triggered by user interaction. */
    isInteracted?: boolean
}
/** An interface that holds options to control the selecting item action. */
export interface SelectingEventArgs extends SelectEventArgs {
    /** Defines the selecting Tab item element. */
    selectingItem: HTMLElement
    /** Defines the selecting Tab item index. */
    selectingIndex: number
    /** Defines the selecting Tab item content. */
    selectingContent: HTMLElement
    /** Defines the type of the event. */
    event?: Event
}
/** An interface that holds options to control the removing and removed item action. */
export interface RemoveEventArgs extends BaseEventArgs {
    /** Defines the removed Tab item element. */
    removedItem: HTMLElement
    /** Defines the removed Tab item index. */
    removedIndex: number
    /** Defines the prevent action. */
    cancel?: boolean
}
/** An interface that holds options to control the adding and added item action. */
export interface AddEventArgs extends BaseEventArgs {
    /** Defines the added Tab item element */
    addedItems: TabItemModel[]
    /** Defines the prevent action. */
    cancel?: boolean
}
/** An interface that holds option to control the dragging and dragged item action. */
export interface DragEventArgs extends BaseEventArgs {
    /** Defines the current dragged Tab item. */
    draggedItem: HTMLElement
    /** Defines the dropped Tab item. */
    droppedItem: HTMLElement
    /** defines the Dragged Tab item index. */
    index: number
    /** Return the actual event. */
    event: MouseEvent
    /** Return the target element */
    target: HTMLElement
    /** Return the clone element */
    clonedElement: HTMLElement
    /** Defines the prevent action. */
    cancel?: boolean
}
/**
 * Objects used for configuring the Tab selecting item action properties.
 */
export class TabActionSettings extends ChildProperty<TabActionSettings> {
    /**
     * Specifies the animation effect for displaying Tab content.
     *
     * @default 'SlideLeftIn'
     * @aspType string
     */
    @Property('SlideLeftIn')
    public effect: 'None' | Effect;
    /**
     * Specifies the time duration to transform content.
     *
     * @default 600
     */
    @Property(600)
    public duration: number;
    /**
     * Specifies easing effect applied while transforming content.
     *
     * @default 'ease'
     */
    @Property('ease')
    public easing: string;
}
/**
 * Objects used for configuring the Tab animation properties.
 */
export class TabAnimationSettings extends ChildProperty<TabAnimationSettings> {
    /**
     * Specifies the animation to appear while moving to previous Tab content.
     *
     * @default { effect: 'SlideLeftIn', duration: 600, easing: 'ease' }
     */
    @Complex<TabActionSettingsModel>({ effect: 'SlideLeftIn', duration: 600, easing: 'ease' }, TabActionSettings)
    public previous: TabActionSettingsModel;
    /**
     * Specifies the animation to appear while moving to next Tab content.
     *
     * @default { effect: 'SlideRightIn', duration: 600, easing: 'ease' }
     */
    @Complex<TabActionSettingsModel>({ effect: 'SlideRightIn', duration: 600, easing: 'ease' }, TabActionSettings)
    public next: TabActionSettingsModel;
}
/**
 * Objects used for configuring the Tab item header properties.
 */
export class Header extends ChildProperty<Header> {
    /**
     * Specifies the display text of the Tab item header.
     *
     * @default ''
     */
    @Property('')
    public text: string | HTMLElement;
    /**
     * Specifies the icon class that is used to render an icon in the Tab header.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;
    /**
     * Options for positioning the icon in the Tab item header. This property depends on `iconCss` property.
     * The possible values for this property as follows
     * * `Left`: Places the icon to the left of the item.
     * * `Top`: Places the icon on the top of the item.
     * * `Right`: Places the icon to the right end of the item.
     * * `Bottom`: Places the icon at the bottom of the item.
     *
     * @default 'left'
     */
    @Property('left')
    public iconPosition: string;
}
/**
 * An array of object that is used to configure the Tab.
 */
export class TabItem extends ChildProperty<TabItem> {
    /**
     * The object used for configuring the Tab item header properties.
     *
     * @default {}
     */
    @Complex<HeaderModel>({}, Header)
    public header: HeaderModel;
    /**
     * Specifies the header text of Tab item.
     *
     * @default null
     */
    @Property(null)
    public headerTemplate: string;
    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     *
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;
    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Sets true to disable user interactions of the Tab item.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;
    /**
     * Sets false to hide the Tab item.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Sets unique ID to Tab item.
     *
     * @default null
     */
    @Property()
    public id: string;
    /**
     * Specifies the tab order of the Tabs items. When positive values assigned, it allows to switch focus to the next/previous tabs items with Tab/ShiftTab keys.
     * By default, user can able to switch between items only via arrow keys.
     * If the value is set to 0 for all tabs items, then tab switches based on element order.
     *
     * @default -1
     */
    @Property(-1)
    public tabIndex: number
}

/** @hidden */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface EJ2Instance extends HTMLElement {
    /* eslint-disable */
    ej2_instances: Object[]
}

/**
 * Tab is a content panel to show multiple contents in a single space, one at a time.
 * Each Tab item has an associated content, that will be displayed based on the active Tab header item.
 * ```html
 * <div id="tab"></div>
 * <script>
 *   var tabObj = new Tab();
 *   tab.appendTo("#tab");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Tab extends Component<HTMLElement> implements INotifyPropertyChanged {
    private hdrEle: HTEle;
    private cntEle: HTEle;
    private tbObj: Toolbar;
    public tabId: string;
    private tbItems: HTEle;
    private tbItem: HTEle[];
    private tbPop: HTEle;
    private isTemplate: boolean;
    private isPopup: boolean;
    private isReplace: boolean;
    private prevIndex: number;
    private prevItem: HTEle;
    private popEle: DomElements;
    private actEleId: string;
    private bdrLine: HTEle;
    private popObj: Popup;
    private btnCls: HTEle;
    private cnt: string;
    private show: object = {};
    private hide: object = {};
    private enableAnimation: boolean;
    private keyModule: KeyboardEvents;
    private tabKeyModule: KeyboardEvents;
    private touchModule: Touch;
    private maxHeight: number = 0;
    private title: Str = 'Close';
    private initRender: boolean;
    private isInteracted: boolean = false;
    private prevActiveEle: string;
    private lastIndex: number = 0;
    private isSwipeed: boolean;
    private isNested: boolean;
    private itemIndexArray: string[];
    private templateEle: string[];
    private scrCntClass: string;
    private isAdd: boolean = false;
    private content: HTEle;
    private selectedID: string;
    private selectingID: string;
    private isIconAlone: boolean = false;
    private dragItem: HTMLElement;
    private cloneElement: HTMLElement;
    private droppedIndex: number;
    private draggingItems: TabItemModel[];
    private draggableItems: Draggable[] = [];
    private tbId: string;
    private resizeContext: EventListenerObject = this.refreshActiveTabBorder.bind(this);
    /**
     * Contains the keyboard configuration of the Tab.
     */
    private keyConfigs: { [key: string]: Str } = {
        tab: 'tab',
        home: 'home',
        end: 'end',
        enter: 'enter',
        space: 'space',
        delete: 'delete',
        moveLeft: 'leftarrow',
        moveRight: 'rightarrow',
        moveUp: 'uparrow',
        moveDown: 'downarrow'
    };
    /**
     * An array of object that is used to configure the Tab component.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     *
     * @default []
     */
    @Collection<TabItemModel>([], TabItem)
    public items: TabItemModel[];
    /**
     * Specifies the width of the Tab component. Default, Tab width sets based on the width of its parent.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;
    /**
     * Specifies the height of the Tab component. By default, Tab height is set based on the height of its parent.
     * To use height property, heightAdjustMode must be set to 'None'.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Sets the CSS classes to root element of the Tab that helps to customize component styles.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;
    /**
     * Specifies the index for activating the current Tab item.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     selectedItem: 1,
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     *
     * @default 0
     */
    @Property(0)
    public selectedItem: number;
    /**
     * Specifies the orientation of Tab header.
     * The possible values for this property as follows
     * * `Top`: Places the Tab header on the top.
     * * `Bottom`: Places the Tab header at the bottom.
     * * `Left`: Places the Tab header on the left.
     * * `Right`: Places the Tab header at the right.
     *
     * @default 'Top'
     */
    @Property('Top')
    public headerPlacement: HeaderPosition;
    /**
     * Specifies the height style for Tab content.
     * The possible values for this property as follows
     * * `None`: Based on the given height property, the content panel height is set.
     * * `Auto`: Tallest panel height of a given Tab content is set to all the other panels.
     * * `Content`: Based on the corresponding content height, the content panel height is set.
     * * `Fill`: Based on the parent height, the content panel height is set.
     *
     * @default 'Content'
     */
    @Property('Content')
    public heightAdjustMode: HeightStyles;
    /**
     * Specifies the Tab display mode when Tab content exceeds the viewing area.
     * The possible modes are:
     * * `Scrollable`: All the elements are displayed in a single line with horizontal scrolling enabled.
     * * `Popup`: Tab container holds the items that can be placed within the available space and rest of the items are moved to the popup.
     * If the popup content overflows the height of the page, the rest of the elements can be viewed by scrolling the popup.
     *
     * @default 'Scrollable'
     */
    @Property('Scrollable')
    public overflowMode: OverflowMode;
    /**
     * Specifies the modes for Tab content.
     * The possible modes are:
     * * `Demand` - The content of the selected tab alone is loaded initially. The content of the tabs which were loaded once will be maintained in the DOM.
     * * `Dynamic` - The content of all the tabs are rendered on the initial load and maintained in the DOM.
     * * `Init` - The content of all the tabs are rendered on the initial load and maintained in the DOM.
     *
     * @default 'Dynamic'
     */
    @Property('Dynamic')
    protected loadOn: ContentLoad;
    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. selectedItem
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;
    /**
     * Specifies whether to show the close button for header items to remove the item from the Tab.
     *
     * @default false
     */
    @Property(false)
    public showCloseButton: boolean;
    /**
     * Determines whether to re-order tab items to show active tab item in the header area or popup when OverflowMode is Popup.
     *  True, if active tab item should be visible in header area instead of pop-up. The default value is true.
     *
     * @default true
     */
    @Property(true)
    public reorderActiveTab: boolean;
    /**
     * Specifies the scrolling distance in scroller.
     *
     * @default null
     */
    @Property()
    public scrollStep: number;
    /**
     * Defines the area in which the draggable element movement will be occurring. Outside that area will be restricted
     * for the draggable element movement. By default, the draggable element movement occurs in the toolbar. 
     * @default null
     */
    @Property()
    public dragArea: string;
    /**
     * Sets true to allow drag and drop the Tab items
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;
    /**
     * Specifies the animation configuration settings while showing the content of the Tab.
     *
     * @default
     * { previous: { effect: 'SlideLeftIn', duration: 600, easing: 'ease' },
     * next: { effect: 'SlideRightIn', duration: 600, easing: 'ease' } }
     */
    @Complex<TabAnimationSettingsModel>({}, TabAnimationSettings)
    public animation: TabAnimationSettingsModel;
    /**
     * The event will be fired once the component rendering is completed.
     *
     * @event
     */
    @Event()
    public created: EmitType<Event>;
    /**
     * The event will be fired before adding the item to the Tab.
     *
     * @event
     */
    @Event()
    public adding: EmitType<AddEventArgs>;
    /**
     * The event will be fired after adding the item to the Tab.
     *
     * @event
     */
    @Event()
    public added: EmitType<AddEventArgs>;
    /**
     * The event will be fired before the item gets selected.
     *
     * @event
     */
    @Event()
    public selecting: EmitType<SelectingEventArgs>;
    /**
     * The event will be fired after the item gets selected.
     *
     * @event
     */
    @Event()
    public selected: EmitType<SelectEventArgs>;
    /**
     * The event will be fired before removing the item from the Tab.
     *
     * @event
     */
    @Event()
    public removing: EmitType<RemoveEventArgs>;
    /**
     * The event will be fired after removing the item from the Tab.
     *
     * @event
     */
    @Event()
    public removed: EmitType<RemoveEventArgs>;
    /**
     * The event will be fired before dragging the item from Tab
     * @event
     */
    @Event()
    public onDragStart: EmitType<DragEventArgs>;
    /**
     * The event will be fired while dragging the Tab item
     * @event
     */
    @Event()
    public dragging: EmitType<DragEventArgs>;
    /**
     * The event will be fired after dropping the Tab item
     * @event
     */
    @Event()
    public dragged: EmitType<DragEventArgs>;
    /**
     * The event will be fired when the component gets destroyed.
     *
     * @event
     */
    @Event()
    public destroyed: EmitType<Event>;
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     *
     * @returns {void}
     */
    public destroy(): void {
        if ((this as any).isReact || (this as any).isAngular) {
            this.clearTemplate();
        }
        if (!isNOU(this.tbObj)) {
            this.tbObj.destroy();
            this.tbObj = null;
        }
        this.unWireEvents();
        this.element.removeAttribute('aria-disabled');
        this.expTemplateContent();
        if (!this.isTemplate) {
            while (this.element.firstElementChild) {
                remove(this.element.firstElementChild);
            }
        } else {
            const cntEle: Element = select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            this.element.classList.remove(CLS_TEMPLATE);
            if (!isNOU(cntEle)) {
                cntEle.innerHTML = this.cnt;
            }
        }

        if (this.btnCls) {
            this.btnCls = null;
        }
        this.hdrEle = null;
        this.cntEle = null;
        this.tbItems = null;
        this.tbItem = null;
        this.tbPop = null;
        this.prevItem = null;
        this.popEle = null;
        this.bdrLine = null;
        this.content = null;
        this.dragItem = null;
        this.cloneElement = null;
        this.draggingItems = [];
        if (this.draggableItems && this.draggableItems.length > 0) {
            for (let i: number = 0; i < this.draggableItems.length; i++) {
                this.draggableItems[i].destroy();
                this.draggableItems[i] = null;
            }
            this.draggableItems = [];
        }
        super.destroy();
        this.trigger('destroyed');
    }

    /**
     * Refresh the tab component
     *
     * @returns {void}
     */
    public refresh(): void {
        if ((this as any).isReact) {
            this.clearTemplate();
        }
        super.refresh();
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    /**
     * Initialize component
     *
     * @private
     * @returns {void}
     */
    protected preRender(): void {
        const nested: Element = closest(this.element, '.' + CLS_CONTENT);
        this.prevIndex = 0;
        this.isNested = false;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        this.itemIndexArray = [];
        this.templateEle = [];
        if (this.allowDragAndDrop) {
            this.dragArea = !isNOU(this.dragArea) ? this.dragArea : '#' + this.element.id + ' ' + ('.' + CLS_HEADER);
        }
        if (!isNOU(nested)) {
            nested.parentElement.classList.add(CLS_NEST);
            this.isNested = true;
        }
        const name: Str = Browser.info.name;
        const css: Str = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        setStyle(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.setCssClass(this.element, this.cssClass, true);
        attributes(this.element, {  'aria-disabled': 'false' });
        this.setCssClass(this.element, css, true);
        this.updatePopAnimationConfig();
    }
    /**
     * Initializes a new instance of the Tab class.
     *
     * @param {TabModel} options  - Specifies Tab model properties as options.
     * @param {string | HTMLElement} element  - Specifies the element that is rendered as a Tab.
     */
    public constructor(options?: TabModel, element?: string | HTMLElement) {
        super(options, <HTEle | Str>element);
    }
    /**
     * Initialize the component rendering
     *
     * @private
     * @returns {void}
     */
    protected render(): void {
        this.btnCls = this.createElement('span', { className: CLS_ICONS + ' ' + CLS_ICON_CLOSE, attrs: { title: this.title } });
        this.tabId = this.element.id.length > 0 ? ('-' + this.element.id) : getRandomId();
        this.renderContainer();
        this.wireEvents();
        this.initRender = false;
    }
    private renderContainer(): void {
        const ele: HTEle = this.element;
        this.items.forEach((item: TabItemModel, index: number) => {
            if (isNOU(item.id) && !isNOU((item as Base<HTMLElement>).setProperties)) {
                (item as Base<HTMLElement>).setProperties({ id: TABITEMPREFIX + index.toString() }, true);
            }
        });
        if (this.items.length > 0 && ele.children.length === 0) {
            ele.appendChild(this.createElement('div', { className: CLS_CONTENT }));
            this.setOrientation(this.headerPlacement, this.createElement('div', { className: CLS_HEADER }));
            this.isTemplate = false;
        } else if (this.element.children.length > 0) {
            this.isTemplate = true;
            ele.classList.add(CLS_TEMPLATE);
            const header: HTEle = <HTEle>ele.querySelector('.' + CLS_HEADER);
            if (header && this.headerPlacement === 'Bottom') {
                this.setOrientation(this.headerPlacement, header);
            }
        }
        if (!isNOU(select('.' + CLS_HEADER, this.element)) && !isNOU(select('.' + CLS_CONTENT, this.element))) {
            this.renderHeader();
            this.tbItems = <HTEle>select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS, this.element);
            if (!isNOU(this.tbItems)) {
                rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
            }
            this.renderContent();
            if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
                this.tbItems = <HTEle>select('.' + CLS_HEADER + ' .' + CLS_TB_ITEMS, this.element);
                this.bdrLine = this.createElement('div', { className: CLS_INDICATOR + ' ' + CLS_HIDDEN + ' ' + CLS_IGNORE });
                const scrCnt: HTEle = <HTEle>select('.' + this.scrCntClass, this.tbItems);
                if (!isNOU(scrCnt)) {
                    scrCnt.insertBefore(this.bdrLine, scrCnt.firstChild);
                } else {
                    this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstChild);
                }
                this.setContentHeight(true);
                this.select(this.selectedItem);
            }
            this.tbItem = selectAll('.' + CLS_TB_ITEM, this.hdrEle);
            if (!isNOU(this.tbItem)) {
                for (let i: number = 0; i < this.items.length; i++) {
                    if (this.tbItem[i]) {
                        const tabID: string = this.items[i].id;
                        this.tbItem[i].setAttribute('data-id', tabID);
                    }
                }
            }
            this.setRTL(this.enableRtl);
        }
    }
    private renderHeader(): void {
        const hdrPlace: HeaderPosition = this.headerPlacement;
        let tabItems: Object[] = [];
        this.hdrEle = this.getTabHeader();
        this.addVerticalClass();
        if (!this.isTemplate) {
            tabItems = this.parseObject(this.items, 0);
        } else {
            if (this.element.children.length > 1 && this.element.children[1].classList.contains(CLS_HEADER)) {
                this.setProperties({ headerPlacement: 'Bottom' }, true);
            }
            const count: number = this.hdrEle.children.length;
            const hdrItems: string[] = [];
            for (let i: number = 0; i < count; i++) {
                hdrItems.push(this.hdrEle.children.item(i).innerHTML);
            }
            if (count > 0) {
                while (this.hdrEle.firstElementChild) {
                    detach(this.hdrEle.firstElementChild);
                }
                const tabItems: HTMLElement = this.createElement('div', { className: CLS_ITEMS });
                this.hdrEle.appendChild(tabItems);
                hdrItems.forEach((item: string, index: number) => {
                    this.lastIndex = index;
                    const attr: object = {
                        className: CLS_ITEM, id: CLS_ITEM + this.tabId + '_' + index
                    };
                    const txt: Str = this.createElement('span', {
                        className: CLS_TEXT, innerHTML: item, attrs: { 'role': 'presentation' }
                    }).outerHTML;
                    const cont: Str = this.createElement('div', {
                        className: CLS_TEXT_WRAP, innerHTML: txt + this.btnCls.outerHTML
                    }).outerHTML;
                    const wrap: HTEle = this.createElement('div', {
                        className: CLS_WRAP, innerHTML: cont,
                        attrs: { role: 'tab', tabIndex: '-1', 'aria-selected': 'false', 'aria-controls': CLS_CONTENT + this.tabId + '_' + index, 'aria-disabled': 'false' }
                    });
                    tabItems.appendChild(this.createElement('div', attr));
                    selectAll('.' + CLS_ITEM, tabItems)[index].appendChild(wrap);
                });
            }
        }
        this.tbObj = new Toolbar({
            width: (hdrPlace === 'Left' || hdrPlace === 'Right') ? 'auto' : '100%',
            height: (hdrPlace === 'Left' || hdrPlace === 'Right') ? '100%' : 'auto',
            overflowMode: this.overflowMode,
            items: (tabItems.length !== 0) ? tabItems : [],
            clicked: this.clickHandler.bind(this),
            scrollStep: this.scrollStep,
            enableHtmlSanitizer: this.enableHtmlSanitizer,
            cssClass: this.cssClass
        });
        this.tbObj.isStringTemplate = true;
        this.tbObj.createElement = this.createElement;
        this.tbObj.appendTo(<HTEle>this.hdrEle);
        attributes(this.hdrEle, { role: 'tablist' });
        if (!isNOU(this.element.getAttribute('aria-label'))) {
            this.hdrEle.setAttribute('aria-label', this.element.getAttribute('aria-label'));
            this.element.removeAttribute('aria-label');
        } else if (!isNOU(this.element.getAttribute('aria-labelledby'))) {
            this.hdrEle.setAttribute('aria-labelledby', this.element.getAttribute('aria-labelledby'));
            this.element.removeAttribute('aria-labelledby');
        }
        this.setCloseButton(this.showCloseButton);
        const toolbarHeader: HTEle = this.tbObj.element.querySelector('.' + CLS_TB_ITEMS);
        if (!isNOU(toolbarHeader)) {
            if (isNOU(toolbarHeader.id) || toolbarHeader.id === '') {
                toolbarHeader.id = this.element.id + '_' +  'tab_header_items';
            }
        }
    }
    private renderContent(): void {
        this.cntEle = <HTEle>select('.' + CLS_CONTENT, this.element);
        const hdrItem: HTEle[] = selectAll('.' + CLS_TB_ITEM, this.element);
        if (this.isTemplate) {
            this.cnt = (this.cntEle.children.length > 0) ? this.cntEle.innerHTML : '';
            const contents: HTMLCollection = this.cntEle.children;
            for (let i: number = 0; i < hdrItem.length; i++) {
                if (contents.length - 1 >= i) {
                    addClass([contents.item(i)], CLS_ITEM);
                    attributes(contents.item(i), { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM + this.tabId + '_' + i });
                    contents.item(i).id = CLS_CONTENT + this.tabId + '_' + i;
                }
            }
        }
    }
    private reRenderItems(): void {
        this.renderContainer();
        if (!isNOU(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
    }
    private parseObject(items: TabItemModel[], index: number): object[] {
        const tbItems: HTMLElement[] = selectAll('.e-tab-header .' + CLS_TB_ITEM, this.element);
        let maxId: number = this.lastIndex;
        if (!this.isReplace && tbItems.length > 0) {
            const idList: number[] = [];
            tbItems.forEach((item: HTMLElement) => {
                idList.push(this.getIndexFromEle(item.id));
            });
            maxId = Math.max(...idList);
        }
        const tItems: Object[] = [];
        let txtWrapEle: HTEle;
        const spliceArray: number[] = [];
        const i: number = 0;
        items.forEach((item: TabItemModel, i: number) => {
            const pos: Str = (isNOU(item.header) || isNOU(item.header.iconPosition)) ? '' : item.header.iconPosition;
            const css: Str = (isNOU(item.header) || isNOU(item.header.iconCss)) ? '' : item.header.iconCss;
            if ((isNOU(item.headerTemplate)) && (isNOU(item.header) || isNOU(item.header.text) ||
                (((<string>item.header.text).length === 0)) && (css === ''))) {
                spliceArray.push(i);
                return;
            }
            let txt: Str | HTEle = item.headerTemplate || item.header.text;
            if (typeof txt === 'string' && this.enableHtmlSanitizer) {
                txt = SanitizeHtmlHelper.sanitize(<Str>txt);
            }
            let itemIndex: number;
            if (this.isReplace && !isNOU(this.tbId) && this.tbId !== '') {
                itemIndex = parseInt(this.tbId.substring(this.tbId.lastIndexOf('_') + 1), 10);
                this.tbId = '';
            } else {
                itemIndex = index + i;
            }
            this.lastIndex = ((tbItems.length === 0) ? i : ((this.isReplace) ? (itemIndex) : (maxId + 1 + i)));
            const disabled: Str = (item.disabled) ? ' ' + CLS_DISABLE + ' ' + CLS_OVERLAY : '';
            const hidden: Str = (item.visible === false) ? ' ' + CLS_HIDDEN : '';
            txtWrapEle = this.createElement('div', { className: CLS_TEXT, attrs: { 'role': 'presentation' } });
            const tHtml: Str = ((txt instanceof Object) ? (<HTEle>txt).outerHTML : txt);
            const txtEmpty: boolean = (!isNOU(tHtml) && tHtml !== '');
            if (!isNOU((<HTEle>txt).tagName)) {
                txtWrapEle.appendChild(txt as HTEle);
            } else {
                this.headerTextCompile(txtWrapEle, txt as string, i);
            }
            let tEle: HTEle;
            const icon: HTEle = this.createElement('span', {
                className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
            });
            const tCont: HTEle = this.createElement('div', { className: CLS_TEXT_WRAP });
            tCont.appendChild(txtWrapEle);
            if ((txt !== '' && txt !== undefined) && css !== '') {
                if ((pos === 'left' || pos === 'top')) {
                    tCont.insertBefore(icon, tCont.firstElementChild);
                } else {
                    tCont.appendChild(icon);
                }
                tEle = txtWrapEle;
                this.isIconAlone = false;
            } else {
                tEle = ((css === '') ? txtWrapEle : icon);
                if (tEle === icon) {
                    detach(txtWrapEle);
                    tCont.appendChild(icon);
                    this.isIconAlone = true;
                }
            }
            const tabIndex : string =  isNOU(item.tabIndex) ? '-1' : item.tabIndex.toString();
            const wrapAttrs: { [key: string]: string } = (item.disabled) ? {} : { tabIndex: tabIndex, 'data-tabindex': tabIndex , role: 'tab', 'aria-selected': 'false', 'aria-disabled': 'false' };
            tCont.appendChild(this.btnCls.cloneNode(true));
            const wrap: HTEle = this.createElement('div', { className: CLS_WRAP, attrs: wrapAttrs });
            wrap.appendChild(tCont);
            if (this.itemIndexArray === []) {
                this.itemIndexArray.push(CLS_ITEM + this.tabId + '_' + this.lastIndex);
            } else {
                this.itemIndexArray.splice((index + i), 0, CLS_ITEM + this.tabId + '_' + this.lastIndex);
            }
            const attrObj: Object = {
                id: CLS_ITEM + this.tabId + '_' + this.lastIndex
            };
            const tItem: { [key: string]: {} } = { htmlAttributes: attrObj, template: wrap };
            tItem.cssClass = ((item.cssClass !== undefined) ? item.cssClass : ' ') + ' ' + disabled + ' ' + hidden + ' '
                + ((css !== '') ? 'e-i' + pos : '') + ' ' + ((!txtEmpty) ? CLS_ICON : '');
            if (pos === 'top' || pos === 'bottom') {
                this.element.classList.add('e-vertical-icon');
            }
            tItems.push(tItem);
            i++;
        });
        if (!this.isAdd) {
            spliceArray.forEach((spliceItemIndex: number) => {
                this.items.splice(spliceItemIndex, 1);
            });
        }
        if (this.isIconAlone) {
            this.element.classList.add(CLS_ICON_TAB);
        } else {
            this.element.classList.remove(CLS_ICON_TAB);
        }
        return tItems;
    }
    private removeActiveClass(): void {
        const tabHeader: HTMLElement = this.getTabHeader();
        if (tabHeader) {
            const tabItems: HTMLElement[] = selectAll('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, tabHeader);
            [].slice.call(tabItems).forEach((node: HTMLElement) => node.classList.remove(CLS_ACTIVE));
            [].slice.call(tabItems).forEach((node: HTMLElement) => node.firstElementChild.setAttribute('aria-selected', 'false'));
        }
    }
    private checkPopupOverflow(ele: HTEle): boolean {
        this.tbPop = <HTEle>select('.' + CLS_TB_POP, this.element);
        const popIcon: HTEle = (<HTEle>select('.e-hor-nav', this.element));
        const tbrItems: HTEle = (<HTEle>select('.' + CLS_TB_ITEMS, this.element));
        const lastChild: HTEle = <HTMLElement>tbrItems.lastChild;
        let isOverflow: boolean = false;
        if (!this.isVertical() && ((this.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
            || (!this.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth))) {
            isOverflow = true;
        } else if (this.isVertical() && (popIcon.offsetTop < lastChild.offsetTop + lastChild.offsetHeight)) {
            isOverflow = true;
        }
        if (isOverflow) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(<Node>ele, selectAll('.' + CLS_TB_POPUP, this.tbPop)[0]);
        }
        return true;
    }
    private popupHandler(target: HTEle): number {
        const ripEle: HTEle = <HTEle>target.querySelector('.e-ripple-element');
        if (!isNOU(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        const lastChild: HTEle = <HTEle>this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            target.removeAttribute('style');
            this.tbItems.appendChild(target);
            this.actEleId = target.id;
            if (this.checkPopupOverflow(lastChild)) {
                const prevEle: HTEle = <HTEle>(<HTEle>this.tbItems.lastChild).previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    }
    private setCloseButton(val: boolean): void {
        const trg: Element = select('.' + CLS_HEADER, this.element);
        if (val === true) {
            trg.classList.add(CLS_CLOSE_SHOW);
        } else {
            trg.classList.remove(CLS_CLOSE_SHOW);
        }
        this.tbObj.refreshOverflow();
        this.refreshActiveTabBorder();
    }
    private prevCtnAnimation(prev: number, current: number): AnimationModel {
        let animation: AnimationModel;
        const checkRTL: boolean = this.enableRtl || this.element.classList.contains(CLS_RTL);
        if (this.isPopup || prev <= current) {
            if (this.animation.previous.effect === 'SlideLeftIn') {
                animation = {
                    name: 'SlideLeftOut',
                    duration: this.animation.previous.duration, timingFunction: this.animation.previous.easing
                };
            } else {
                animation = null;
            }
        } else {
            if (this.animation.next.effect === 'SlideRightIn') {
                animation = {
                    name: 'SlideRightOut',
                    duration: this.animation.next.duration, timingFunction: this.animation.next.easing
                };
            } else {
                animation = null;
            }
        }
        return animation;
    }
    private triggerPrevAnimation(oldCnt: HTEle, prevIndex: number): void {
        const animateObj: AnimationModel = this.prevCtnAnimation(prevIndex, this.selectedItem);
        if (!isNOU(animateObj)) {
            animateObj.begin = () => {
                setStyle(oldCnt, { 'position': 'absolute' });
                oldCnt.classList.add(CLS_PROGRESS);
                oldCnt.classList.add('e-view');
            };
            animateObj.end = () => {
                oldCnt.style.display = 'none';
                oldCnt.classList.remove(CLS_ACTIVE);
                oldCnt.classList.remove(CLS_PROGRESS);
                oldCnt.classList.remove('e-view');
                setStyle(oldCnt, { 'display': '', 'position': '' });
                if (oldCnt.childNodes.length === 0 && !this.isTemplate) {
                    detach(oldCnt);
                }
            };
            new Animation(animateObj).animate(oldCnt);
        } else {
            oldCnt.classList.remove(CLS_ACTIVE);
        }
    }
    private triggerAnimation(id: Str, value: boolean): void {
        const prevIndex: number = this.prevIndex;
        let oldCnt: HTEle;
        const itemCollection: HTMLElement[] = [].slice.call(this.element.querySelector('.' + CLS_CONTENT).children);
        itemCollection.forEach((item: HTEle) => {
            if (item.id === this.prevActiveEle) {
                oldCnt = item;
            }
        });
        const prevEle: HTEle = this.tbItem[prevIndex];
        const newCnt: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
        if (isNOU(oldCnt) && !isNOU(prevEle)) {
            const idNo: Str = this.extIndex(prevEle.id);
            oldCnt = this.getTrgContent(this.cntEle, idNo);
        }
        if (!isNOU(newCnt)) {
            this.prevActiveEle = newCnt.id;
        }
        const isPrevent: boolean = isNOU(this.animation) || this.animation.next === {} || this.animation.previous === {}
            || isNOU(this.animation.next.effect) || isNOU(this.animation.previous.effect)
            || this.animation.previous.effect == 'None' || this.animation.next.effect == 'None';
        if (this.initRender || value === false || this.animation === {} || isPrevent) {
            if (oldCnt && oldCnt !== newCnt) {
                oldCnt.classList.remove(CLS_ACTIVE);
            }
            return;
        }
        const cnt: HTEle = <HTEle>select('.' + CLS_CONTENT, this.element);
        let animateObj: AnimationModel;
        if (this.prevIndex > this.selectedItem && !this.isPopup) {
            const openEff: Effect = <Effect>this.animation.previous.effect;
            animateObj = {
                name: <Effect>((openEff === <Effect>'None') ? '' : ((openEff !== <Effect>'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.animation.previous.duration,
                timingFunction: this.animation.previous.easing
            };
        } else if (this.isPopup || this.prevIndex < this.selectedItem || this.prevIndex === this.selectedItem) {
            const clsEff: Effect = <Effect>this.animation.next.effect;
            animateObj = {
                name: <Effect>((clsEff === <Effect>'None') ? '' : ((clsEff !== <Effect>'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.animation.next.duration,
                timingFunction: this.animation.next.easing
            };
        }
        animateObj.progress = () => {
            cnt.classList.add(CLS_PROGRESS); this.setActiveBorder();
        };
        animateObj.end = () => {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE);
        };
        if (!this.initRender && !isNOU(oldCnt)) {
            this.triggerPrevAnimation(oldCnt, prevIndex);
        }
        this.isPopup = false;
        if (animateObj.name === <Effect>'') {
            newCnt.classList.add(CLS_ACTIVE);
        } else {
            new Animation(animateObj).animate(newCnt);
        }
    }
    private keyPressed(trg: HTEle): void {
        const trgParent: HTEle = <HTEle>closest(trg, '.' + CLS_HEADER + ' .' + CLS_TB_ITEM);
        const trgIndex: number = this.getEleIndex(trgParent);
        if (!isNOU(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        } else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        } else {
            if (!isNOU(trgParent) && trgParent.classList.contains(CLS_ACTIVE) === false) {
                this.selectTab(trgIndex, null, true);
                if (!isNOU(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    }
    private getTabHeader(): HTMLElement {
        if (isNOU(this.element)) {
            return undefined;
        }
        const headers: HTMLElement[] = [].slice.call(this.element.children).filter((e: HTMLElement) => e.classList.contains(CLS_HEADER));
        if (headers.length > 0) {
            return headers[0];
        } else {
            const wrap: HTMLElement =
                [].slice.call(this.element.children).filter((e: HTMLElement) => !e.classList.contains(CLS_BLA_TEM))[0];
            if (!wrap) {
                return undefined;
            }
            return [].slice.call(wrap.children).filter((e: HTMLElement) => e.classList.contains(CLS_HEADER))[0];
        }
    }
    private getEleIndex(item: HTEle): number {
        return Array.prototype.indexOf.call(selectAll('.' + CLS_TB_ITEM, this.getTabHeader()), item);
    }
    private extIndex(id: string): string {
        return id.replace(CLS_ITEM + this.tabId + '_', '');
    }
    private expTemplateContent(): void {
        this.templateEle.forEach((eleStr: Str): void => {
            if (!isNOU(this.element.querySelector(eleStr))) {
                (<HTEle>document.body.appendChild(this.element.querySelector(eleStr))).style.display = 'none';
            }
        });
    }
    private templateCompile(ele: HTEle, cnt: Str, index: number): void {
        const tempEle: HTEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content', index);
        if (tempEle.childNodes.length !== 0) {
            ele.appendChild(tempEle);
        }
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    private compileElement(ele: HTEle, val: string, prop: string, index: number): void {
        let templateFn: Function;
        if (typeof val === 'string') {
            val = val.trim();
            if ((this as any).isVue) {
                templateFn = compile(SanitizeHtmlHelper.sanitize(val));
            } else {
                ele.innerHTML = SanitizeHtmlHelper.sanitize(val);
            }
        } else {
            templateFn = compile(val);
        }
        let templateFUN: HTMLElement[];
        if (!isNOU(templateFn)) {
            templateFUN = templateFn({}, this, prop);
        }
        if (!isNOU(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach((el: HTEle): void => {
                ele.appendChild(el);
            });
        }
    }
    private headerTextCompile(element: HTEle, text: string, index: number): void {
        this.compileElement(element, text, 'headerTemplate', index);
    }
    private getContent(ele: HTEle, cnt: Str | HTEle, callType: string, index: number): void {
        let eleStr: Str;
        cnt = isNOU(cnt) ? "" : cnt;
        if (typeof cnt === 'string' || isNOU((<HTEle>cnt).innerHTML)) {
            if (typeof cnt === 'string' && this.enableHtmlSanitizer) {
                cnt = SanitizeHtmlHelper.sanitize(<Str>cnt);
            }
            if ((<Str>cnt)[0] === '.' || (<Str>cnt)[0] === '#') {
                if (document.querySelectorAll(<string>cnt).length) {
                    const eleVal: HTEle = <HTEle>document.querySelector(<string>cnt);
                    eleStr = eleVal.outerHTML.trim();
                    if (callType === 'clone') {
                        ele.appendChild(eleVal.cloneNode(true));
                    } else {
                        ele.appendChild(eleVal);
                        eleVal.style.display = '';
                    }
                } else {
                    this.templateCompile(ele, <Str>cnt, index);
                }
            } else {
                this.templateCompile(ele, <Str>cnt, index);
            }
        } else {
            ele.appendChild(cnt);
        }
        if (!isNOU(eleStr)) {
            if (this.templateEle.indexOf(cnt.toString()) === -1) {
                this.templateEle.push(cnt.toString());
            }
        }
    }
    private getTrgContent(cntEle: HTEle, no: Str): HTEle {
        let ele: HTEle;
        if (this.element.classList.contains(CLS_NEST)) {
            ele = <HTEle>select('.' + CLS_NEST + '> .' + CLS_CONTENT + ' > #' + CLS_CONTENT + this.tabId + '_' + no, this.element);
        } else {
            ele = this.findEle(cntEle.children, CLS_CONTENT + this.tabId + '_' + no);
        }
        return ele;
    }
    private findEle(items: HTMLCollection, key: Str): HTEle {
        let ele: HTEle;
        for (let i: number = 0; i < items.length; i++) {
            if (items[i].id === key) {
                ele = <HTEle>items[i];
                break;
            }
        }
        return ele;
    }
    private isVertical(): boolean {
        const isVertical: boolean = (this.headerPlacement === 'Left' || this.headerPlacement === 'Right') ? true : false;
        this.scrCntClass = (isVertical) ? CLS_VSCRCNT : CLS_HSCRCNT;
        return isVertical;
    }
    private addVerticalClass(): void {
        if (this.isVertical()) {
            const tbPos: string = (this.headerPlacement === 'Left') ? CLS_VLEFT : CLS_VRIGHT;
            addClass([this.hdrEle], [CLS_VERTICAL, tbPos]);
            if (!this.element.classList.contains(CLS_NEST)) {
                addClass([this.element], [CLS_VTAB, tbPos]);
            } else {
                addClass([this.hdrEle], [CLS_VTAB, tbPos]);
            }
        }
        if (this.headerPlacement === 'Bottom') {
            addClass([this.hdrEle], [CLS_HBOTTOM]);
        }
    }
    private updatePopAnimationConfig(): void {
        this.show = { name: (this.isVertical() ? 'FadeIn' : 'SlideDown'), duration: 100 };
        this.hide = { name: (this.isVertical() ? 'FadeOut' : 'SlideUp'), duration: 100 };
    }
    private changeOrientation(place: Str): void {
        this.setOrientation(place, this.hdrEle);
        const activeTab: HTMLElement = this.hdrEle.querySelector('.' + CLS_ACTIVE);
        const isVertical: boolean = this.hdrEle.classList.contains(CLS_VERTICAL) ? true : false;
        removeClass([this.element], [CLS_VTAB]);
        removeClass([this.hdrEle], [CLS_VERTICAL, CLS_VLEFT, CLS_VRIGHT]);
        if (isVertical !== this.isVertical()) {
            this.changeToolbarOrientation();
            if (!isNOU(activeTab) && activeTab.classList.contains(CLS_TB_POPUP)) {
                this.popupHandler(activeTab);
            }
        }
        this.addVerticalClass();
        this.setActiveBorder();
        this.focusItem();
    }

    private focusItem(): void {
        const curActItem: HTEle = <HTEle>select(' #' + CLS_ITEM + this.tabId + '_' + this.selectedItem, this.hdrEle);
        if (!isNOU(curActItem)) {
            (<HTEle>curActItem.firstElementChild).focus();
        }
    }

    private changeToolbarOrientation(): void {
        this.tbObj.setProperties({ height: (this.isVertical() ? '100%' : 'auto'), width: (this.isVertical() ? 'auto' : '100%') }, true);
        this.tbObj.changeOrientation();
        this.updatePopAnimationConfig();
    }

    private setOrientation(place: Str, ele: HTEle): void {
        const headerPos: number = Array.prototype.indexOf.call(this.element.children, ele);
        const contentPos: number = Array.prototype.indexOf.call(this.element.children, this.element.querySelector('.' + CLS_CONTENT));
        if (place === 'Bottom' && (contentPos > headerPos)) {
            this.element.appendChild(ele);
        } else {
            removeClass([ele], [CLS_HBOTTOM]);
            this.element.insertBefore(ele, select('.' + CLS_CONTENT, this.element));
        }
    }
    private setCssClass(ele: HTEle, cls: Str, val: boolean): void {
        if (cls === '') {
            return;
        }
        const list: Str[] = cls.split(' ');
        for (let i: number = 0; i < list.length; i++) {
            if (val) {
                ele.classList.add(list[i]);
            } else {
                ele.classList.remove(list[i]);
            }
        }
    }
    private setContentHeight(val: boolean): void {
        if (this.element.classList.contains(CLS_FILL)) {
            removeClass([this.element], [CLS_FILL]);
        }
        if (isNOU(this.cntEle)) {
            return;
        }
        const hdrEle: HTEle = this.getTabHeader();
        if (this.heightAdjustMode === 'None') {
            if (this.height === 'auto') {
                return;
            } else {
                if (!this.isVertical()) {
                    setStyle(this.cntEle, { 'height': (this.element.clientHeight - hdrEle.offsetHeight) + 'px' });
                }
            }
        } else if (this.heightAdjustMode === 'Fill') {
            addClass([this.element], [CLS_FILL]);
            setStyle(this.element, { 'height': '100%' });
            this.cntEle.style.height = 'calc(100% - ' + this.hdrEle.offsetHeight + 'px)';
        } else if (this.heightAdjustMode === 'Auto') {
            if (this.isTemplate === true) {
                const cnt: HTEle[] = selectAll('.' + CLS_CONTENT + ' > .' + CLS_ITEM, this.element);
                for (let i: number = 0; i < cnt.length; i++) {
                    cnt[i].setAttribute('style', 'display:block; visibility: visible');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(cnt[i]));
                    cnt[i].style.removeProperty('display');
                    cnt[i].style.removeProperty('visibility');
                }
            } else {
                this.cntEle = <HTEle>select('.' + CLS_CONTENT, this.element);
                if (val === true) {
                    this.cntEle.appendChild(this.createElement('div', {
                        id: (CLS_CONTENT + this.tabId + '_' + 0), className: CLS_ITEM + ' ' + CLS_ACTIVE,
                        attrs: { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM + this.tabId + '_' + 0 }
                    }));
                }
                const ele: HTEle = <HTEle>this.cntEle.children.item(0);
                for (let i: number = 0; i < this.items.length; i++) {
                    this.getContent(ele, this.items[i].content, 'clone', i);
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(ele));
                    while (ele.firstChild) {
                        ele.removeChild(ele.firstChild);
                    }
                }
                if ((this as any).isReact) {
                    this.clearTemplate(['content']);
                }
                this.templateEle = [];
                this.getContent(ele, this.items[0].content, 'render', 0);
                if (this.prevIndex !== this.selectedItem) {
                    ele.classList.remove(CLS_ACTIVE);
                }
            }
            setStyle(this.cntEle, { 'height': this.maxHeight + 'px' });
        } else {
            setStyle(this.cntEle, { 'height': 'auto' });
        }
    }
    private getHeight(ele: HTEle): number {
        const cs: CSSStyleDeclaration = window.getComputedStyle(ele);
        return ele.offsetHeight + parseFloat(cs.getPropertyValue('padding-top')) + parseFloat(cs.getPropertyValue('padding-bottom')) +
            parseFloat(cs.getPropertyValue('margin-top')) + parseFloat(cs.getPropertyValue('margin-bottom'));
    }
    private setActiveBorder(): void {
        const trgHdrEle: Element = this.getTabHeader();
        const trg: HTEle = <HTEle>select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE, trgHdrEle);
        if (isNOU(trg)) {
            return;
        }
        if (!this.reorderActiveTab) {
            if (trg.classList.contains(CLS_TB_POPUP) && !this.bdrLine.classList.contains(CLS_HIDDEN)) {
                this.bdrLine.classList.add(CLS_HIDDEN);
            }
            if (trgHdrEle && !trgHdrEle.classList.contains(CLS_REORDER_ACTIVE_ITEM)) {
                trgHdrEle.classList.add(CLS_REORDER_ACTIVE_ITEM);
            }
        } else if (trgHdrEle) {
            trgHdrEle.classList.remove(CLS_REORDER_ACTIVE_ITEM);
        }
        const root: HTEle = <HTEle>closest(trg, '.' + CLS_TAB);
        if (this.element !== root) {
            return;
        }
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, trgHdrEle);
        const bar: HTEle = <HTEle>select('.' + CLS_INDICATOR, trgHdrEle);
        const scrollCnt: HTEle = <HTEle>select('.' + CLS_TB_ITEMS + ' .' + this.scrCntClass, trgHdrEle);
        if (this.isVertical()) {
            setStyle(bar, { 'left': '', 'right': '' });
            const tbHeight: number = (isNOU(scrollCnt)) ? this.tbItems.offsetHeight : scrollCnt.offsetHeight;
            if (tbHeight !== 0) {
                setStyle(bar, { 'top': trg.offsetTop + 'px', 'height': trg.offsetHeight + 'px' });
            } else {
                setStyle(bar, { 'top': 0, 'height': 0 });
            }
        } else {
            if (this.overflowMode === 'MultiRow') {
                const top: number = this.headerPlacement === 'Bottom' ? trg.offsetTop : trg.offsetHeight + trg.offsetTop;
                setStyle(bar, { 'top': top + 'px', 'height': '' });
            } else {
                setStyle(bar, { 'top': '', 'height': '' });
            }
            let tbWidth: number = (isNOU(scrollCnt)) ? this.tbItems.offsetWidth : scrollCnt.offsetWidth;
            if (tbWidth !== 0) {
                setStyle(bar, { 'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px' });
            } else {
                setStyle(bar, { 'left': 'auto', 'right': 'auto' });
            }
        }
        if (!isNOU(this.bdrLine) && !trg.classList.contains(CLS_TB_POPUP)) {
            this.bdrLine.classList.remove(CLS_HIDDEN);
        }
    }
    private setActive(value: number, skipDataBind: boolean = false, isInteracted: boolean = false): void {
        this.tbItem = selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
        const trg: HTEle = this.tbItem[value];
        if (value < 0 || isNaN(value) || this.tbItem.length === 0) {
            return;
        }
        if (value >= 0 && !skipDataBind) {
            this.allowServerDataBinding = false;
            this.setProperties({ selectedItem: value }, true);
            this.allowServerDataBinding = true;
            if (!this.initRender) {
                this.serverDataBind();
            }
        }
        if (trg.classList.contains(CLS_ACTIVE)) {
            this.setActiveBorder();
            return;
        }
        if (!this.isTemplate) {
            attributes(trg.firstElementChild, { 'aria-controls': CLS_CONTENT + this.tabId + '_' + value });
        }
        const id: Str = trg.id;
        this.removeActiveClass();
        trg.classList.add(CLS_ACTIVE);
        trg.firstElementChild.setAttribute('aria-selected', 'true');
        const no: number = Number(this.extIndex(id));
        if (isNOU(this.prevActiveEle)) {
            this.prevActiveEle = CLS_CONTENT + this.tabId + '_' + no;
        }
        if (this.isTemplate) {
            if (select('.' + CLS_CONTENT, this.element).children.length > 0) {
                const trg: HTEle = this.findEle(select('.' + CLS_CONTENT, this.element).children, CLS_CONTENT + this.tabId + '_' + no);
                if (!isNOU(trg)) {
                    trg.classList.add(CLS_ACTIVE);
                }
                this.triggerAnimation(id, this.enableAnimation);
            }
        } else {
            this.cntEle = <HTEle>select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
            const item: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNOU(item)) {
                this.cntEle.appendChild(this.createElement('div', {
                    id: CLS_CONTENT + this.tabId + '_' + this.extIndex(id), className: CLS_ITEM + ' ' + CLS_ACTIVE,
                    attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM + this.tabId + '_' + this.extIndex(id) }
                }));
                const eleTrg: HTEle = this.getTrgContent(this.cntEle, this.extIndex(id));
                const itemIndex: number = Array.prototype.indexOf.call(this.itemIndexArray, id);
                this.getContent(eleTrg, this.items[itemIndex].content, 'render', itemIndex);
            } else {
                item.classList.add(CLS_ACTIVE);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        this.refreshItemVisibility(trg);
        if (!this.initRender && !skipDataBind) {
            (<HTEle>trg.firstElementChild).focus();
            const eventArg: SelectEventArgs = {
                previousItem: this.prevItem,
                previousIndex: this.prevIndex,
                selectedItem: trg,
                selectedIndex: value,
                selectedContent: <HTEle>select('#' + CLS_CONTENT + this.tabId + '_' + this.selectingID, this.content),
                isSwiped: this.isSwipeed,
                isInteracted: isInteracted
            };
            this.trigger('selected', eventArg);
        }
    }
    private setItems(items: object[]): void {
        this.isReplace = true;
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, this.getTabHeader());
        this.tbObj.items = this.parseObject(items, 0);
        this.tbObj.dataBind();
        this.isReplace = false;
    }
    private setRTL(value: boolean): void {
        this.tbObj.enableRtl = value;
        this.tbObj.dataBind();
        this.setCssClass(this.element, CLS_RTL, value);
        this.refreshActiveBorder();
    }
    private refreshActiveBorder(): void {
        if (!isNOU(this.bdrLine)) {
            this.bdrLine.classList.add(CLS_HIDDEN);
        }
        this.setActiveBorder();
    }
    private showPopup(config: object): void {
        const tbPop: HTEle = <HTEle>select('.e-popup.e-toolbar-pop', this.hdrEle);
        if (tbPop.classList.contains('e-popup-close')) {
            const tbPopObj: Popup = (<PopupModel>(tbPop && (<Instance>tbPop).ej2_instances[0])) as Popup;
            tbPopObj.position.X = (this.headerPlacement === 'Left') ? 'left' : 'right';
            tbPopObj.dataBind();
            tbPopObj.show(config);
        }
    }
    private bindDraggable(): void {
        if (this.allowDragAndDrop) {
            const tabHeader: Element = this.element.querySelector('.' + CLS_HEADER);
            if (tabHeader){
                const items: NodeList = tabHeader.querySelectorAll('.' + CLS_TB_ITEM);
                items.forEach((element: HTMLElement) => {
                    this.initializeDrag(element as HTMLElement);
                });
            }
        }
    }
    private wireEvents(): void {
        this.bindDraggable();
        window.addEventListener('resize', this.resizeContext);
        EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.element, 'keydown', this.spaceKeyDown, this);
        if (!isNOU(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    }
    private unWireEvents(): void {
        if (!isNOU(this.keyModule)) {
            this.keyModule.destroy();
        }
        if (!isNOU(this.tabKeyModule)) {
            this.tabKeyModule.destroy();
        }
        if (!isNOU(this.cntEle) && !isNOU(this.touchModule)) {
            this.touchModule.destroy();
            this.touchModule = null;
        }
        window.removeEventListener('resize', this.resizeContext);
        EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.element, 'keydown', this.spaceKeyDown);
        this.element.classList.remove(CLS_RTL);
        this.element.classList.remove(CLS_FOCUS);
    }
    private clickHandler(args: ClickEventArgs): void {
        this.element.classList.remove(CLS_FOCUS);
        const trg: HTEle = <HTEle>args.originalEvent.target;
        const trgParent: HTEle = <HTEle>closest(trg, '.' + CLS_TB_ITEM);
        const trgIndex: number = this.getEleIndex(trgParent);
        if (trg.classList.contains(CLS_ICON_CLOSE)) {
            this.removeTab(trgIndex);
        } else if (this.isVertical() && closest(trg, '.' + CLS_HOR_NAV)) {
            this.showPopup(this.show);
        } else {
            this.isPopup = false;
            if (!isNOU(trgParent) && (trgIndex !== this.selectedItem || trgIndex !== this.prevIndex)) {
                this.selectTab(trgIndex, args.originalEvent, true);
            }
        }
    }
    private swipeHandler(e: SwipeEventArgs): void {
        if (e.velocity < 3 && isNOU(e.originalEvent.changedTouches)) {
            return;
        }
        if (this.isNested) {
            this.element.setAttribute('data-swipe', 'true');
        }
        const nestedTab: HTMLElement = this.element.querySelector('[data-swipe="true"]');
        if (nestedTab) {
            nestedTab.removeAttribute('data-swipe');
            return;
        }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right' && this.selectedItem !== 0) {
            for (let k: number = this.selectedItem - 1; k >= 0; k--) {
                if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                    this.selectTab(k, null, true);
                    break;
                }
            }
        } else if (e.swipeDirection === 'Left' && (this.selectedItem !== selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
            for (let i: number = this.selectedItem + 1; i < this.tbItem.length; i++) {
                if (!this.tbItem[i].classList.contains(CLS_HIDDEN)) {
                    this.selectTab(i, null, true);
                    break;
                }
            }
        }
        this.isSwipeed = false;
    }
    private spaceKeyDown(e: KeyboardEvent): void {
        if ((e.keyCode === 32 && e.which === 32) || (e.keyCode === 35 && e.which === 35)) {
            const clstHead: HTEle = <HTEle>closest(<Element>e.target, '.' + CLS_HEADER);
            if (!isNOU(clstHead)) {
                e.preventDefault();
            }
        }
    }
    private keyHandler(e: KeyboardEventArgs): void {
        if (this.element.classList.contains(CLS_DISABLE)) {
            return;
        }
        this.element.classList.add(CLS_FOCUS);
        const trg: HTEle = <HTEle>e.target;
        const tabHeader: HTMLElement = this.getTabHeader();
        const actEle: HTEle = <HTEle>select('.' + CLS_ACTIVE, tabHeader);
        this.popEle = <DomElements>select('.' + CLS_TB_POP, tabHeader);
        if (!isNOU(this.popEle)) {
            this.popObj = <Popup>this.popEle.ej2_instances[0];
        }
        const item: HTEle = <HTEle>closest(document.activeElement, '.' + CLS_TB_ITEM);
        const trgParent: HTEle = <HTEle>closest(trg, '.' + CLS_TB_ITEM);
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE)) {
                    return;
                }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) {
                    this.showPopup(this.show);
                    break;
                }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && (<HTEle>closest(trg, '.' + CLS_TB_ITEM)).classList.contains(CLS_ACTIVE) === false) {
                    trg.setAttribute('tabindex', trg.getAttribute('data-tabindex'));
                }
                if (this.popObj && isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                if (!isNOU(actEle) && actEle.children.item(0).getAttribute('tabindex') === '-1') {
                    actEle.children.item(0).setAttribute('tabindex', '0');
                }
                break;
            case 'moveLeft':
            case 'moveRight':
                if (!isNOU(item)) {
                    this.refreshItemVisibility(item);
                }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!isNOU(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) {
                    this.popObj.show(this.show);
                }
                break;
            case 'delete':
                if (this.showCloseButton === true && !isNOU(trgParent)) {
                    const nxtSib: HTEle = <HTEle>trgParent.nextSibling;
                    if (!isNOU(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) {
                        (<HTEle>nxtSib.firstElementChild).focus();
                    }
                    this.removeTab(this.getEleIndex(trgParent));
                }
                this.setActiveBorder();
                break;
        }
    }
    private refreshItemVisibility(target: HTEle): void {
        const scrCnt: HTEle = <HTEle>select('.' + this.scrCntClass, this.tbItems);
        if (!this.isVertical() && !isNOU(scrCnt)) {
            const scrBar: HTEle = <HTEle>select('.e-hscroll-bar', this.tbItems);
            scrBar.removeAttribute('tabindex');
            const scrStart: number = scrBar.scrollLeft;
            const scrEnd: number = scrStart + scrBar.offsetWidth;
            const eleStart: number = target.offsetLeft;
            const eleWidth: number = target.offsetWidth;
            const eleEnd: number = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                const eleViewRange: number = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            } else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    const eleViewRange: number = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        } else {
            return;
        }
    }
    private getIndexFromEle (id: string): number {
        return parseInt(id.substring(id.lastIndexOf('_') + 1), 10);
    }
    private hoverHandler(e: MouseEventArgs): void {
        const trg: HTEle = <HTEle>e.target;
        if (!isNOU(trg.classList) && trg.classList.contains(CLS_ICON_CLOSE)) {
            trg.setAttribute('title', new L10n('tab', { closeButtonTitle: this.title }, this.locale).getConstant('closeButtonTitle'));
        }
    }
    private evalOnPropertyChangeItems(newProp: TabModel, oldProp: TabModel): void {
        if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
            const changedProp: Object[] = Object.keys(newProp.items);
            for (let i: number = 0; i < changedProp.length; i++) {
                const index: number = parseInt(Object.keys(newProp.items)[i], 10);
                const properties: string[] = Object.keys(newProp.items[index]);
                for (let j: number = 0; j < properties.length; j++) {
                    const oldVal: Str = Object(oldProp.items[index])[properties[j]];
                    const newVal: Str | Object = Object(newProp.items[index])[properties[j]];
                    const hdr: HTEle = <HTEle>this.element.querySelectorAll('.' + CLS_TB_ITEM)[index];
                    let itemIndex: number;
                    if (hdr && !isNOU(hdr.id) && hdr.id !== '') {
                        itemIndex = this.getIndexFromEle(hdr.id);
                    } else {
                        itemIndex = index;
                    }
                    const hdrItem: HTEle = <HTEle>select('.' + CLS_TB_ITEMS + ' #' + CLS_ITEM + this.tabId + '_' + itemIndex, this.element);
                    const cntItem: HTEle = <HTEle>select('.' + CLS_CONTENT + ' #' + CLS_CONTENT + this.tabId + '_' + itemIndex, this.element);
                    if (properties[j] === 'header' || properties[j] === 'headerTemplate') {
                        const icon: Str | Object = (isNOU(this.items[index].header) ||
                            isNOU(this.items[index].header.iconCss)) ? '' : this.items[index].header.iconCss;
                        const textVal: Str | Object = this.items[index].headerTemplate || this.items[index].header.text;
                        if ((textVal === '') && (icon === '')) {
                            this.removeTab(index);
                        } else {
                            this.tbId = hdr.id;
                            const arr: Object[] = [];
                            arr.push(<TabItemModel>this.items[index]);
                            this.items.splice(index, 1);
                            this.itemIndexArray.splice(index, 1);
                            this.tbObj.items.splice(index, 1);
                            const isHiddenEle: boolean = hdrItem.classList.contains(CLS_HIDDEN);
                            detach(hdrItem);
                            this.isReplace = true;
                            this.addTab(arr, index);
                            if (isHiddenEle) {
                                this.hideTab(index);
                            }
                            this.isReplace = false;
                        }
                    }
                    if (properties[j] === 'content' && !isNOU(cntItem)) {
                        const strVal: boolean = typeof newVal === 'string' || isNOU((<HTEle>newVal).innerHTML);
                        if (strVal && ((<Str>newVal)[0] === '.' || (<Str>newVal)[0] === '#') && (<Str>newVal).length) {
                            const eleVal: HTEle = <HTEle>document.querySelector(<Str>newVal);
                            cntItem.appendChild(eleVal);
                            eleVal.style.display = '';
                        } else if (newVal === '' && oldVal[0] === '#') {
                            (<HTEle>document.body.appendChild(this.element.querySelector(oldVal))).style.display = 'none';
                            cntItem.innerHTML = <Str>newVal;
                        } else if ((this as any).isReact) {
                            cntItem.innerHTML = '';
                            this.templateCompile(cntItem, <Str>newVal, index);
                        } else if (typeof newVal !== 'function') {
                            cntItem.innerHTML = <Str>newVal;
                        }
                    }
                    if (properties[j] === 'cssClass') {
                        if (!isNOU(hdrItem)) {
                            hdrItem.classList.remove(oldVal);
                            hdrItem.classList.add(<Str>newVal);
                        }
                        if (!isNOU(cntItem)) {
                            cntItem.classList.remove(oldVal);
                            cntItem.classList.add(<Str>newVal);
                        }
                    }
                    if (properties[j] === 'disabled') {
                        this.enableTab(index, ((newVal === true) ? false : true));
                    }
                    if (properties[j] === 'visible') {
                        this.hideTab(index, ((newVal === true) ? false : true));
                    }
                }
            }
        } else {
            this.lastIndex = 0;
            if (isNOU(this.tbObj)) {
                this.reRenderItems();
            } else {
                if ((this as any).isReact || (this as any).isAngular) {
                    this.clearTemplate();
                }
                this.setItems(<TabItemModel[]>newProp.items);
                if (this.templateEle.length > 0) {
                    this.expTemplateContent();
                }
                this.templateEle = [];
                const selectElement: HTEle = <HTEle>select('.' + CLS_TAB + ' > .' + CLS_CONTENT, this.element);
                while (selectElement.firstElementChild) {
                    detach(selectElement.firstElementChild);
                }
                this.select(this.selectedItem);
                this.draggableItems = [];
                this.bindDraggable();
            }
        }
    }

    private initializeDrag(target: HTEle): void {
        let dragObj: Draggable = new Draggable(target, {
            dragArea: this.dragArea,
            dragTarget: '.' + CLS_TB_ITEM,
            clone: true,
            helper: this.helper.bind(this),
            dragStart: this.itemDragStart.bind(this),
            drag: (e: DragArgs) => {
                let dragIndex: number = this.getEleIndex(this.dragItem);
                let dropIndex: number;
                let dropItem: HTMLElement;
                let dragArgs: DragEventArgs = {
                    draggedItem: <HTMLElement>this.dragItem,
                    event: e.event,
                    target: e.target,
                    droppedItem: <HTMLElement>e.target.closest('.' + CLS_TB_ITEM),
                    clonedElement: this.cloneElement,
                    index: dragIndex
                };
                if (!isNOU(e.target.closest('.' + CLS_TAB)) && !e.target.closest('.' + CLS_TAB).isEqualNode(this.element) &&
                    this.dragArea !== '.' + CLS_HEADER) {
                    this.trigger('dragging', dragArgs);
                } else {
                    if (!(e.target.closest(this.dragArea)) && this.overflowMode !== 'Popup') {
                        document.body.style.cursor = 'not-allowed';
                        addClass([this.cloneElement], CLS_HIDDEN);
                        if (this.dragItem.classList.contains(CLS_HIDDEN)) {
                            removeClass([this.dragItem], CLS_HIDDEN);
                        }
                        (<HTEle>this.dragItem.querySelector('.' + CLS_WRAP)).style.visibility = 'visible';
                    } else {
                        document.body.style.cursor = '';
                        (<HTEle>this.dragItem.querySelector('.' + CLS_WRAP)).style.visibility = 'hidden';
                        if (this.cloneElement.classList.contains(CLS_HIDDEN)) {
                            removeClass([this.cloneElement], CLS_HIDDEN);
                        }
                    }
                    if (this.overflowMode === 'Scrollable' && !isNOU(this.element.querySelector('.e-hscroll'))) {
                        let scrollRightNavEle: HTMLElement = this.element.querySelector('.e-scroll-right-nav');
                        let scrollLeftNavEle: HTMLElement = this.element.querySelector('.e-scroll-left-nav');
                        let hscrollBar: HTMLElement = this.element.querySelector('.e-hscroll-bar');
                        if (!isNOU(scrollRightNavEle) && Math.abs((scrollRightNavEle.offsetWidth / 2) +
                            scrollRightNavEle.offsetLeft) > this.cloneElement.offsetLeft + this.cloneElement.offsetWidth) {
                            hscrollBar.scrollLeft -= 10;
                        }
                        if (!isNOU(scrollLeftNavEle) && Math.abs((scrollLeftNavEle.offsetLeft + scrollLeftNavEle.offsetWidth) -
                            this.cloneElement.offsetLeft) > (scrollLeftNavEle.offsetWidth / 2)) {
                            hscrollBar.scrollLeft += 10;
                        }
                    }
                    this.cloneElement.style.pointerEvents = 'none';
                    dropItem = <HTMLElement>closest(e.target, '.' + CLS_TB_ITEM + '.e-draggable');
                    let scrollContentWidth: number = 0;
                    if (this.overflowMode === 'Scrollable' && !isNOU(this.element.querySelector('.e-hscroll'))) {
                        scrollContentWidth = (<HTMLElement>this.element.querySelector('.e-hscroll-content')).offsetWidth;
                    }
                    if (dropItem != null && !dropItem.isSameNode(this.dragItem) &&
                        dropItem.closest('.' + CLS_TAB).isSameNode(this.dragItem.closest('.' + CLS_TAB))) {
                        dropIndex = this.getEleIndex(dropItem);
                        if (dropIndex < dragIndex &&
                            (Math.abs((dropItem.offsetLeft + dropItem.offsetWidth) -
                                this.cloneElement.offsetLeft) > (dropItem.offsetWidth / 2))) {
                            this.dragAction(dropItem, dragIndex, dropIndex);
                        }
                        if (dropIndex > dragIndex &&
                            (Math.abs(dropItem.offsetWidth / 2) + dropItem.offsetLeft -
                                scrollContentWidth) < this.cloneElement.offsetLeft + this.cloneElement.offsetWidth) {
                            this.dragAction(dropItem, dragIndex, dropIndex);
                        }
                    }
                    this.droppedIndex = this.getEleIndex(this.dragItem);
                    this.trigger('dragging', dragArgs);
                }
            },
            dragStop: this.itemDragStop.bind(this)
        });
        this.draggableItems.push(dragObj);
    }

    private helper(e: { sender: MouseEvent & TouchEvent, element: HTMLElement }): HTMLElement {
        this.cloneElement = this.createElement('div');
        if (e.element) {
            this.cloneElement = <HTMLElement>(e.element.cloneNode(true));
            addClass([this.cloneElement], 'e-tab-clone-element');
            if (this.element.querySelector('.' + CLS_HEADER).classList.contains(CLS_CLOSE_SHOW)) {
                addClass([this.cloneElement], CLS_CLOSE_SHOW);
            }
            removeClass([this.cloneElement.querySelector('.' + CLS_WRAP)], 'e-ripple');
            if (!isNOU(this.cloneElement.querySelector('.e-ripple-element'))) {
                remove(this.cloneElement.querySelector('.e-ripple-element'));
            }
            document.body.appendChild(this.cloneElement);
        }
        return this.cloneElement;
    }

    private itemDragStart(e: DragArgs): void {
        this.draggingItems = this.items.map((x: TabItemModel) => x);
        this.dragItem = e.element;
        let dragArgs: DragEventArgs = {
            draggedItem: e.element,
            event: e.event,
            target: e.target,
            droppedItem: null,
            index: this.getEleIndex(this.dragItem),
            clonedElement: this.cloneElement,
            cancel: false
        };
        this.trigger('onDragStart', dragArgs, (tabitemDragArgs: DragEventArgs) => {
            if (tabitemDragArgs.cancel) {
                detach(this.cloneElement);
            } else {
                this.removeActiveClass();
                addClass([this.tbItems.querySelector('.' + CLS_INDICATOR)], CLS_HIDDEN);
                (<HTEle>this.dragItem.querySelector('.' + CLS_WRAP)).style.visibility = 'hidden';
            }
        });
    }

    private dragAction(dropItem: HTMLElement, dragsIndex: number, dropIndex: number): void {
        if (this.items.length > 0) {
            let item: TabItemModel = this.draggingItems[dragsIndex];
            this.draggingItems.splice(dragsIndex, 1);
            this.draggingItems.splice(dropIndex, 0, item);
        }
        if (this.overflowMode === 'MultiRow') {
            dropItem.parentNode.insertBefore(this.dragItem, dropItem.nextElementSibling);
        }
        if (dragsIndex > dropIndex) {
            if (!(this.dragItem.parentElement).isSameNode(dropItem.parentElement)) {
                if (this.overflowMode === 'Extended') {
                    if (dropItem.isSameNode(dropItem.parentElement.lastChild)) {
                        let popupContainer: Node = this.dragItem.parentNode;
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                        popupContainer.insertBefore(dropItem.parentElement.lastChild, popupContainer.childNodes[0]);
                    } else {
                        this.dragItem.parentNode.insertBefore(
                            (dropItem.parentElement.lastChild), this.dragItem.parentElement.childNodes[0]);
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                    }
                } else {
                    let lastEle: HTMLElement = <HTEle>(dropItem.parentElement).lastChild;
                    if (dropItem.isSameNode(lastEle)) {
                        let popupContainer: Node = <HTEle>this.dragItem.parentNode;
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                        popupContainer.insertBefore(lastEle, popupContainer.childNodes[0]);
                    } else {
                        this.dragItem.parentNode.insertBefore(
                            (dropItem.parentElement).lastChild, this.dragItem.parentElement.childNodes[0]);
                        dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                    }
                }
            } else {
                this.dragItem.parentNode.insertBefore(this.dragItem, dropItem);
            }
        }
        if (dragsIndex < dropIndex) {
            if (!(this.dragItem.parentElement).isSameNode(dropItem.parentElement)) {
                if (this.overflowMode === 'Extended') {
                    this.dragItem.parentElement.appendChild(dropItem.parentElement.firstElementChild);
                    dropItem.parentNode.insertBefore(this.dragItem, dropItem.nextSibling);
                } else {
                    this.dragItem.parentNode.insertBefore(
                        (dropItem.parentElement).lastChild, this.dragItem.parentElement.childNodes[0]);
                    dropItem.parentNode.insertBefore(this.dragItem, dropItem);
                }
            } else {
                this.dragItem.parentNode.insertBefore(this.dragItem, dropItem.nextElementSibling);
            }
        }
    }

    private itemDragStop(e: DropEventArgs): void {
        detach(this.cloneElement);
        this.cloneElement = null;
        (<HTEle>this.dragItem.querySelector('.' + CLS_WRAP)).style.visibility = 'visible';
        document.body.style.cursor = '';
        let dragStopArgs: DragEventArgs = {
            draggedItem: <HTEle>this.dragItem,
            event: e.event,
            target: e.target,
            droppedItem: this.tbItem[this.droppedIndex],
            clonedElement: null,
            index: this.droppedIndex,
            cancel: false
        };
        this.trigger('dragged', dragStopArgs, (tabItemDropArgs: DragEventArgs) => {
            if (tabItemDropArgs.cancel) {
                this.refresh();
            } else {
                if (this.items.length > 0 && this.draggingItems.length > 0) {
                    this.items = this.draggingItems;
                    this.selectedItem = this.droppedIndex;
                    this.refresh();
                } else {
                    (<HTEle>this.dragItem.querySelector('.' + CLS_WRAP)).style.visibility = '';
                    removeClass([<HTEle>this.tbItems.querySelector('.' + CLS_INDICATOR)], CLS_HIDDEN);
                    this.selectTab(this.droppedIndex, null, true);
                }
            }
        });
        this.dragItem = null;
    }

    /**
     * Enables or disables the specified Tab item. On passing value as `false`, the item will be disabled.
     *
     * @param {number} index - Index value of target Tab item.
     * @param {boolean} value - Boolean value that determines whether the command should be enabled or disabled.
     * By default, isEnable is true.
     * @returns {void}.
     */
    public enableTab(index: number, value: boolean): void {
        const tbItems: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(tbItems)) {
            return;
        }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstElementChild).setAttribute('tabindex',(<HTEle>tbItems.firstElementChild).getAttribute('data-tabindex'));
        } else {
            tbItems.classList.add(CLS_DISABLE, CLS_OVERLAY);
            (<HTEle>tbItems.firstElementChild).removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE)) {
                this.select(index + 1);
            }
        }
        if (!isNOU(this.items[index])) {
            this.items[index].disabled = !value;
            this.dataBind();
        }
        tbItems.firstElementChild.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    }
    /**
     * Adds new items to the Tab that accepts an array as Tab items.
     *
     * @param {TabItemModel[]} items - An array of item that is added to the Tab.
     * @param {number} index - Number value that determines where the items to be added. By default, index is 0.
     * @returns {void}.
     */
    public addTab(items: TabItemModel[], index?: number): void {
        const addArgs: AddEventArgs = { addedItems: items, cancel: false };
        if (!this.isReplace) {
            this.trigger('adding', addArgs, (tabAddingArgs: AddEventArgs) => {
                if (!tabAddingArgs.cancel) {
                    this.addingTabContent(items, index);
                }
            });
        } else {
            this.addingTabContent(items, index);
        }
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    private addingTabContent(items: TabItemModel[], index?: number): void {
        let lastEleIndex: number = 0;
        this.hdrEle = <HTEle>select('.' + CLS_HEADER, this.element);
        if (isNOU(this.hdrEle)) {
            this.items = items;
            this.reRenderItems();
            this.bindDraggable();
        } else {
            const itemsCount: number = selectAll('.e-tab-header .' + CLS_TB_ITEM, this.element).length;
            if (itemsCount !== 0) {
                lastEleIndex = this.lastIndex + 1;
            }
            if (isNOU(index)) {
                index = itemsCount - 1;
            }
            if (itemsCount < index || index < 0 || isNaN(index)) {
                return;
            }
            if (itemsCount === 0 && !isNOU(this.hdrEle)) {
                this.hdrEle.style.display = '';
            }
            if (!isNOU(this.bdrLine)) {
                this.bdrLine.classList.add(CLS_HIDDEN);
            }
            this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, this.getTabHeader());
            this.isAdd = true;
            const tabItems: object[] = this.parseObject(items, index);
            this.isAdd = false;
            let i: number = 0;
            let textValue: string | HTEle;
            items.forEach((item: TabItemModel, place: number) => {
                textValue = item.headerTemplate || item.header.text;
                if (!(isNOU(item.headerTemplate || item.header) || isNOU(textValue) ||
                    ((<string>textValue).length === 0) && !isNOU(item.header) && isNOU(item.header.iconCss))) {
                    if (tabItems[place]) {
                        if (isNOU(item.id)) {
                            item.id = CLS_ITEM + this.tabId + '_' + TABITEMPREFIX + (lastEleIndex + place).toString();
                        }
                        (tabItems[place] as Record<string, any>).htmlAttributes['data-id'] = item.id;
                    }
                    this.items.splice((index + i), 0, item);
                    i++;
                }
                if (this.isTemplate && !isNOU(item.header) && !isNOU(item.header.text)) {
                    const no: number = lastEleIndex + place;
                    const ele: HTEle = this.createElement('div', {
                        id: CLS_CONTENT + this.tabId + '_' + no, className: CLS_ITEM,
                        attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM + '_' + no }
                    });
                    this.cntEle.insertBefore(ele, this.cntEle.children[(index + place)]);
                    const eleTrg: HTEle = this.getTrgContent(this.cntEle, no.toString());
                    this.getContent(eleTrg, item.content, 'render', index);
                }
            });
            this.tbObj.addItems(tabItems, index);
            if (!this.isReplace) {
                this.trigger('added', { addedItems: items });
            }
            if (this.selectedItem === index) {
                this.select(index);
            } else {
                this.setActiveBorder();
                this.tbItem = selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
            }
            this.bindDraggable();
        }
    }
    /**
     * Removes the items in the Tab from the specified index.
     *
     * @param {number} index - Index of target item that is going to be removed.
     * @returns {void}.
     */
    public removeTab(index: number): void {
        const trg: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(trg)) {
            return;
        }
        const removeArgs: RemoveEventArgs = { removedItem: trg, removedIndex: index, cancel: false };
        this.trigger('removing', removeArgs, (tabRemovingArgs: RemoveEventArgs) => {
            if (!tabRemovingArgs.cancel) {
                this.tbObj.removeItems(index);
                if (this.allowDragAndDrop && (index !== Array.prototype.indexOf.call(this.itemIndexArray, trg.id))) {
                    index = Array.prototype.indexOf.call(this.itemIndexArray, trg.id);
                }
                const targetEleIndex: number = this.itemIndexArray.indexOf(trg.id);
                this.items.splice(targetEleIndex, 1);
                this.itemIndexArray.splice(targetEleIndex, 1);
                this.refreshActiveBorder();
                const cntTrg: HTEle =
                    <HTEle>select('#' + CLS_CONTENT + this.tabId + '_' + this.extIndex(trg.id), select('.' + CLS_CONTENT, this.element));
                if (!isNOU(cntTrg)) {
                    const registeredTemplate = (this as any).registeredTemplate;
                    const portal = (this as any).portals;
                    if (registeredTemplate && registeredTemplate.content) {
                        var templateToClear = [];
                        for (let i = 0; i < registeredTemplate.content.length; i++) {
                            let registeredItem = registeredTemplate.content[i].rootNodes[0];
                            let closestItem = closest(registeredItem, '.' + CLS_ITEM);
                            if (!isNullOrUndefined(registeredItem) && closestItem === cntTrg) {
                                templateToClear.push(registeredTemplate.content[i]);
                                break;
                            }
                        }
                        if (templateToClear.length > 0) {
                            this.clearTemplate(['content'], templateToClear);
                        }
                    }
                    else if (portal) {
                        for (var i = 0; i < portal.length; i++) {
                            var portalItem = portal[i];
                            var closestItem = closest(portalItem.containerInfo, '.' + CLS_ITEM);
                            if (!isNullOrUndefined(portalItem) && closestItem === cntTrg) {
                                this.clearTemplate(['content'], i);
                                break;
                            }
                        }
                    }
                    detach(cntTrg);
                }
                this.trigger('removed', tabRemovingArgs);
                if (this.draggableItems && this.draggableItems.length > 0) {
                    this.draggableItems[index].destroy();
                    this.draggableItems[index] = null;
                    this.draggableItems.splice(index, 1);
                }
                if (trg.classList.contains(CLS_ACTIVE)) {
                    index = (index > selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element).length - 1) ? index - 1 : index;
                    this.enableAnimation = false;
                    this.selectedItem = index;
                    this.select(index);
                } else if (index !== this.selectedItem) {
                    if (index < this.selectedItem) {
                        index = this.itemIndexArray.indexOf(this.tbItem[this.selectedItem].id);
                        this.setProperties({ selectedItem: index > -1 ? index : this.selectedItem }, true);
                        this.prevIndex = this.selectedItem;
                    }
                    this.tbItem = selectAll('.' + CLS_TB_ITEM, this.getTabHeader());
                }
                if (selectAll('.' + CLS_TB_ITEM, this.element).length === 0) {
                    this.hdrEle.style.display = 'none';
                }
                this.enableAnimation = true;
            }
        });
    }
    /**
     * Shows or hides the Tab that is in the specified index.
     *
     * @param {number} index - Index value of target item.
     * @param {boolean} value - Based on this Boolean value, item will be hide (false) or show (true). By default, value is true.
     * @returns {void}.
     */
    public hideTab(index: number, value?: boolean): void {
        let items: HTMLElement[];
        const item: HTEle = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNOU(item)) {
            return;
        }
        if (isNOU(value)) {
            value = true;
        }
        this.bdrLine.classList.add(CLS_HIDDEN);
        if (value === true) {
            item.classList.add(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            if (items.length !== 0 && item.classList.contains(CLS_ACTIVE)) {
                if (index !== 0) {
                    for (let i: number = index - 1; i >= 0; i--) {
                        if (!this.tbItem[i].classList.contains(CLS_HIDDEN)) {
                            this.select(i);
                            break;
                        } else if (i === 0) {
                            for (let k: number = index + 1; k < this.tbItem.length; k++) {
                                if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                                    this.select(k);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    for (let k: number = index + 1; k < this.tbItem.length; k++) {
                        if (!this.tbItem[k].classList.contains(CLS_HIDDEN)) {
                            this.select(k);
                            break;
                        }
                    }
                }
            } else if (items.length === 0) {
                this.element.classList.add(CLS_HIDDEN);
            }
        } else {
            this.element.classList.remove(CLS_HIDDEN);
            items = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_HIDDEN + ')', this.tbItems);
            item.classList.remove(CLS_HIDDEN);
            if (items.length === 0) {
                this.select(index);
            }
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
        if (this.overflowMode === 'Popup' && this.tbObj) {
            this.tbObj.refreshOverflow();
        }
    }

    private selectTab(args: number | HTEle, event: Event = null, isInteracted: boolean = false): void {
        this.isInteracted = isInteracted;
        this.select(args, event);
    }

    /**
     * Specifies the index or HTMLElement to select an item from the Tab.
     *
     * @param {number | HTMLElement} args - Index or DOM element is used for selecting an item from the Tab.
     * @param {Event} event - An event which takes place in DOM.
     * @returns {void}
     */

    public select(args: number | HTEle, event?: Event): void {
        const tabHeader: HTMLElement = this.getTabHeader();
        this.tbItems = <HTEle>select('.' + CLS_TB_ITEMS, tabHeader);
        this.tbItem = selectAll('.' + CLS_TB_ITEM, tabHeader);
        this.content = <HTEle>select('.' + CLS_CONTENT, this.element);
        this.prevItem = this.tbItem[this.prevIndex];
        if (isNOU(this.selectedItem) || (this.selectedItem < 0) || (this.tbItem.length <= this.selectedItem) || isNaN(this.selectedItem)) {
            this.selectedItem = 0;
        } else {
            this.selectedID = this.extIndex(this.tbItem[this.selectedItem].id);
        }
        const trg: HTEle = this.tbItem[args as number];
        if (isNOU(trg)) {
            this.selectedID = '0';
        } else {
            this.selectingID = this.extIndex(trg.id);
        }
        if (!isNOU(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE)) {
            this.prevItem.children.item(0).setAttribute('tabindex', this.prevItem.firstElementChild.getAttribute('tabindex'));
        }
        const eventArg: SelectingEventArgs = {
            event: event,
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: this.tbItem[this.selectedItem],
            selectedIndex: this.selectedItem,
            selectedContent: !isNOU(this.content) ?
                <HTEle>select('#' + CLS_CONTENT + this.tabId + '_' + this.selectedID, this.content) : null,
            selectingItem: trg,
            selectingIndex: args as number,
            selectingContent: !isNOU(this.content) ?
                <HTEle>select('#' + CLS_CONTENT + this.tabId + '_' + this.selectingID, this.content) : null,
            isSwiped: this.isSwipeed,
            isInteracted: this.isInteracted,
            cancel: false
        };
        if (!this.initRender) {
            this.trigger('selecting', eventArg, (selectArgs: SelectingEventArgs) => {
                if (!selectArgs.cancel) {
                    this.selectingContent(args, this.isInteracted);
                }
            });
        } else {
            this.selectingContent(args, this.isInteracted);
        }
        this.isInteracted = false;
    }

    private selectingContent(args: number | HTEle, isInteracted?: boolean): void {
        if (typeof args === 'number') {
            if (!isNOU(this.tbItem[args]) && (this.tbItem[<number>args].classList.contains(CLS_DISABLE) ||
                this.tbItem[<number>args].classList.contains(CLS_HIDDEN))) {
                for (let i: number = <number>args + 1; i < this.items.length; i++) {
                    if (this.items[i].disabled === false && this.items[i].visible === true) {
                        args = i; break;
                    } else {
                        args = 0;
                    }
                }
            }
            if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
                this.prevIndex = this.selectedItem;
                this.prevItem = this.tbItem[this.prevIndex];
                if (this.tbItem[args].classList.contains(CLS_TB_POPUP) && this.reorderActiveTab) {
                    this.setActive(this.popupHandler(this.tbItem[args]), null, isInteracted);
                    if ((!isNOU(this.items) && this.items.length > 0) && this.allowDragAndDrop) {
                        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
                        let item: TabItemModel = this.items[args];
                        this.items.splice(args, 1);
                        this.items.splice(this.tbItem.length - 1, 0, item);
                        let itemId: string = this.itemIndexArray[args];
                        this.itemIndexArray.splice(args, 1);
                        this.itemIndexArray.splice(this.tbItem.length - 1, 0, itemId);
                    }
                } else {
                    this.setActive(args, null, isInteracted);
                }
            } else {
                this.setActive(0, null, isInteracted);
            }
        } else if (args instanceof (HTMLElement)) {
            this.setActive(this.getEleIndex(args), null, isInteracted);
        }
    }
    /**
     * Gets the item index from the Tab.
     *
     * @param  {string} tabItemId - Item ID is used for getting index from the Tab.
     * @returns {number} - It returns item index.
     */
    public getItemIndex(tabItemId: string): number {
        let tabIndex: number;
        for (let i: number = 0; i < this.tbItem.length; i++) {
            const value: string = this.tbItem[i].getAttribute('data-id');
            if (tabItemId === value) {
                tabIndex = i;
                break;
            }
        }
        return tabIndex;
    }
    /**
     * Specifies the value to disable/enable the Tab component.
     * When set to `true`, the component will be disabled.
     *
     * @param  {boolean} value - Based on this Boolean value, Tab will be enabled (false) or disabled (true).
     * @returns {void}.
     */
    public disable(value: boolean): void {
        this.setCssClass(this.element, CLS_DISABLE, value);
        this.element.setAttribute('aria-disabled', '' + value);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} - It returns the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['selectedItem', 'actEleId']);
    }
    /**
     * Returns the current module name.
     *
     * @returns {string} - It returns the current module name.
     * @private
     */
    protected getModuleName(): string {
        return 'tab';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     *
     * @param  {TabModel} newProp - It contains the new value of data.
     * @param  {TabModel} oldProp - It contains the old value of data.
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: TabModel, oldProp: TabModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyle(this.element, { width: formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyle(this.element, { height: formatUnit(newProp.height) });
                    this.setContentHeight(false);
                    break;
                case 'cssClass':
                    const headerEle: HTMLElement = this.element.querySelector('.' + CLS_HEADER);
                    if (oldProp.cssClass !== '' && !isNullOrUndefined(oldProp.cssClass)) {
                        this.setCssClass(this.element, oldProp.cssClass, false);
                        this.setCssClass(this.element, newProp.cssClass, true);
                        if (!isNullOrUndefined(headerEle)) {
                            this.setCssClass(headerEle, oldProp.cssClass, false);
                            this.setCssClass(headerEle, newProp.cssClass, true);
                        }
                    } else {
                        this.setCssClass(this.element, newProp.cssClass, true);
                        if (!isNullOrUndefined(headerEle)) {
                            this.setCssClass(headerEle, newProp.cssClass, true);
                        }
                    }
                    break;
                case 'items':
                    this.evalOnPropertyChangeItems(newProp, oldProp);
                    break;
                case 'showCloseButton':
                    this.setCloseButton(newProp.showCloseButton);
                    break;
                case 'reorderActiveTab':
                    this.refreshActiveTabBorder();
                    break;
                case 'selectedItem':
                    this.selectedItem = oldProp.selectedItem;
                    this.select(newProp.selectedItem);
                    break;
                case 'headerPlacement':
                    this.changeOrientation(newProp.headerPlacement);
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
                case 'overflowMode':
                    this.tbObj.overflowMode = newProp.overflowMode;
                    this.tbObj.dataBind();
                    this.refreshActiveTabBorder();
                    break;
                case 'heightAdjustMode':
                    this.setContentHeight(false);
                    this.select(this.selectedItem);
                    break;
                case 'scrollStep':
                    if (this.tbObj) {
                        this.tbObj.scrollStep = this.scrollStep;
                    }
                    break;
                case 'allowDragAndDrop':
                    this.bindDraggable();
                    break;
                case 'dragArea':
                    if (this.allowDragAndDrop) {
                        this.draggableItems.forEach((item: Draggable) => {
                            item.dragArea = this.dragArea;
                        });
                        this.refresh();
                    }
                    break;
            }
        }
    }
    /**
     * To refresh the active tab contents.
     * 
     * @returns {void}
     */
    public refreshActiveTab(): void {
        if ((this as any).isReact && this.isTemplate) {
            this.clearTemplate();
        }
        if (!this.isTemplate) {
            if (this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE)) {
                detach(this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE).children[0]);
                detach(this.element.querySelector('.' + CLS_CONTENT).querySelector('.' + CLS_ACTIVE).children[0]);
                const item: TabItemModel = this.items[this.selectedItem];
                const pos: Str = (isNOU(item.header) || isNOU(item.header.iconPosition)) ? '' : item.header.iconPosition;
                const css: Str = (isNOU(item.header) || isNOU(item.header.iconCss)) ? '' : item.header.iconCss;
                const text: Str | HTEle = item.headerTemplate || item.header.text;
                const txtWrap: HTEle = this.createElement('div', { className: CLS_TEXT, attrs: { 'role': 'presentation' } });
                if (!isNOU((<HTEle>text).tagName)) {
                    txtWrap.appendChild(text as HTEle);
                } else {
                    this.headerTextCompile(txtWrap, text as string, this.selectedItem);
                }
                let tEle: HTEle;
                const icon: HTEle = this.createElement('span', {
                    className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
                });
                const tConts: HTEle = this.createElement('div', { className: CLS_TEXT_WRAP });
                tConts.appendChild(txtWrap);
                if ((text !== '' && text !== undefined) && css !== '') {
                    if ((pos === 'left' || pos === 'top')) {
                        tConts.insertBefore(icon, tConts.firstElementChild);
                    } else {
                        tConts.appendChild(icon);
                    }
                    tEle = txtWrap;
                    this.isIconAlone = false;
                } else {
                    tEle = ((css === '') ? txtWrap : icon);
                    if (tEle === icon) {
                        detach(txtWrap); tConts.appendChild(icon); this.isIconAlone = true;
                    }
                }
                const tabIndex: string = isNOU(item.tabIndex) ? '-1' : item.tabIndex.toString();
                const wrapAtt: { [key: string]: string } = (item.disabled) ? {} : { tabIndex: tabIndex, 'data-tabindex': tabIndex, role: 'tab', 'aria-selected': 'true', 'aria-disabled': 'false' };
                tConts.appendChild(this.btnCls.cloneNode(true));
                const wraper: HTEle = this.createElement('div', { className: CLS_WRAP, attrs: wrapAtt });
                wraper.appendChild(tConts);
                if (pos === 'top' || pos === 'bottom') {
                    this.element.classList.add('e-vertical-icon');
                }
                this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE).appendChild(wraper);
                const crElem: HTEle = this.createElement('div');
                let cnt: string | HTMLElement = item.content; let eleStr: string;
                if (typeof cnt === 'string' || isNOU((<HTEle>cnt).innerHTML)) {
                    if (typeof cnt === 'string' && this.enableHtmlSanitizer) {
                        cnt = SanitizeHtmlHelper.sanitize(<Str>cnt);
                    }
                    if ((<Str>cnt)[0] === '.' || (<Str>cnt)[0] === '#') {
                        if (document.querySelectorAll(<string>cnt).length) {
                            const eleVal: HTEle = <HTEle>document.querySelector(<string>cnt);
                            eleStr = eleVal.outerHTML.trim();
                            crElem.appendChild(eleVal);
                            eleVal.style.display = '';
                        } else {
                            this.compileElement(crElem, <Str>cnt, 'content', this.selectedItem);
                        }
                    } else {
                        this.compileElement(crElem, <Str>cnt, 'content', this.selectedItem);
                    }
                } else {
                    crElem.appendChild(cnt);
                }
                if (!isNOU(eleStr)) {
                    if (this.templateEle.indexOf(cnt.toString()) === -1) {
                        this.templateEle.push(cnt.toString());
                    }
                }
                this.element.querySelector('.' + CLS_ITEM + '.' + CLS_ACTIVE).appendChild(crElem);
            }
        } else {
            const tabItems: HTMLElement = this.element.querySelector('.' + CLS_TB_ITEMS);
            const element: HTMLElement = this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE);
            const index: number = this.getIndexFromEle(element.id);
            const header: string = element.innerText;
            const detachContent: Element = this.element.querySelector('.' + CLS_CONTENT).querySelector('.' + CLS_ACTIVE).children[0];
            const mainContents: string = detachContent.innerHTML;
            detach(element);
            detach(detachContent);
            const attr: object = {
                className: CLS_TB_ITEM + ' ' + CLS_TEMPLATE + ' ' + CLS_ACTIVE, id: CLS_ITEM + this.tabId + '_' + index
            };
            const txtString: Str = this.createElement('span', {
                className: CLS_TEXT, innerHTML: header, attrs: { 'role': 'presentation' }
            }).outerHTML;
            const conte: Str = this.createElement('div', {
                className: CLS_TEXT_WRAP, innerHTML: txtString + this.btnCls.outerHTML
            }).outerHTML;
            const tabIndex: string = element.firstElementChild.getAttribute('data-tabindex'); 
            const wrap: HTEle = this.createElement('div', {
                className: CLS_WRAP, innerHTML: conte,
                attrs: { tabIndex: tabIndex, 'data-tabindex': tabIndex, role: 'tab', 'aria-controls': CLS_CONTENT + this.tabId + '_' + index, 'aria-selected': 'true', 'aria-disabled': 'false' }
            });
            tabItems.insertBefore(this.createElement('div', attr), tabItems.children[index + 1]);
            this.element.querySelector('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE).appendChild(wrap);
            const crElem: HTEle = this.createElement('div', { innerHTML: mainContents });
            this.element.querySelector('.' + CLS_CONTENT).querySelector('.' + CLS_ACTIVE).appendChild(crElem);
        }
        if ((this as any).isReact) {
            this.renderReactTemplates();
        }
    }
    /**
     * To refresh the active tab indicator.
     *
     * @returns {void}
     */
     public refreshActiveTabBorder(): void {
        const activeEle: Element = select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE, this.element);
        if (!isNOU(activeEle) && this.reorderActiveTab) {
            this.select(this.getEleIndex(<HTEle>activeEle));
        }
        this.refreshActiveBorder();
    }
}
