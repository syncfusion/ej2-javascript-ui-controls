import { Virtualization } from './virtualization';
import { merge, formatUnit, isNullOrUndefined, append, detach, ModuleDeclaration, isBlazor, extend } from '@syncfusion/ej2-base';
import { attributes, addClass, removeClass, prepend, closest, remove } from '@syncfusion/ej2-base';
import { Component, EventHandler, BaseEventArgs, Property, Complex, Event } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';
import { KeyboardEventArgs, EmitType, compile } from '@syncfusion/ej2-base';
import { Animation, AnimationOptions, Effect, rippleEffect, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { ListBase, ListBaseOptions, SortOrder, getFieldValues, FieldsMapping } from '../common/list-base';
import { ListViewModel, FieldSettingsModel } from './list-view-model';
import { updateBlazorTemplate, resetBlazorTemplate, blazorTemplates } from '@syncfusion/ej2-base';

// Effect Configuration Effect[] =  [fromViewBackward,fromViewForward,toViewBackward,toviewForward];
const effectsConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideRightOut', 'SlideLeftOut', 'SlideLeftIn', 'SlideRightIn'],
    'SlideDown': ['SlideTopOut', 'SlideBottomOut', 'SlideBottomIn', 'SlideTopIn'],
    'Zoom': ['FadeOut', 'FadeZoomOut', 'FadeZoomIn', 'FadeIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

const effectsRTLConfig: { [key: string]: Effect[] } = {
    'None': [],
    'SlideLeft': ['SlideLeftOut', 'SlideRightOut', 'SlideRightIn', 'SlideLeftIn'],
    'SlideDown': ['SlideBottomOut', 'SlideTopOut', 'SlideTopIn', 'SlideBottomIn'],
    'Zoom': ['FadeZoomOut', 'FadeOut', 'FadeIn', 'FadeZoomIn'],
    'Fade': ['FadeOut', 'FadeOut', 'FadeIn', 'FadeIn']
};

// don't use space in classnames.
export const classNames: ClassNames = {
    root: 'e-listview',
    hover: 'e-hover',
    selected: 'e-active',
    focused: 'e-focused',
    parentItem: 'e-list-parent',
    listItem: 'e-list-item',
    listIcon: 'e-list-icon',
    textContent: 'e-text-content',
    listItemText: 'e-list-text',
    groupListItem: 'e-list-group-item',
    hasChild: 'e-has-child',
    view: 'e-view',
    header: 'e-list-header',
    headerText: 'e-headertext',
    headerTemplateText: 'e-headertemplate-text',
    text: 'e-text',
    disable: 'e-disabled',
    content: 'e-content',
    icon: 'e-icons',
    backIcon: 'e-icon-back',
    checkboxWrapper: 'e-checkbox-wrapper',
    checkbox: 'e-checkbox',
    checked: 'e-check',
    checklist: 'e-checklist',
    checkboxIcon: 'e-frame',
    checkboxRight: 'e-checkbox-right',
    checkboxLeft: 'e-checkbox-left',
    listviewCheckbox: 'e-listview-checkbox',
    itemCheckList: 'e-checklist'
};

const LISTVIEW_TEMPLATE_PROPERTY: string = 'Template';
const LISTVIEW_GROUPTEMPLATE_PROPERTY: string = 'GroupTemplate';
const LISTVIEW_HEADERTEMPLATE_PROPERTY: string = 'HeaderTemplate';

export interface Fields {
    /**
     * ID attribute of specific list-item.
     */
    id?: string | number;
    /**
     * It is used to map the text value of list item from the dataSource.
     */
    text?: string | number;
    /**
     * It is used to map the custom field values of list item from the dataSource.
     */
    [key: string]: Object | string | number | undefined;
}

export class FieldSettings extends ChildProperty<FieldSettings> {

    /**
     * ID attribute of specific list-item.
     */
    @Property('id')
    public id: string;
    /**
     * It is used to map the text value of list item from the dataSource.
     */
    @Property('text')
    public text: string;

    /**
     * This property used to check whether the list item is in checked state or not.
     */
    @Property('isChecked')
    public isChecked: string;
    /**
     * To check whether the visibility state of list item.
     */
    @Property('isVisible')
    public isVisible: string;
    /**
     * It is used to enable the list item
     */
    @Property('enabled')
    public enabled: string;
    /**
     * It is used to customize the icon to the list items dynamically.
     *  We can add specific image to the icons using iconCss property.
     */
    @Property('iconCss')
    public iconCss: string;
    /**
     * This property used for nested navigation of list-items.
     * Refer the documentation [here](./listview/nested-list)
     *  to know more about this property with demo.
     */
    @Property('child')
    public child: string;
    /**
     * It is used to display `tooltip content of text` while hovering on list items.
     */
    @Property('tooltip')
    public tooltip: string;

    /**
     * It wraps the list view element into a group based on the value of groupBy property.
     * Refer the documentation [here](./listview/grouping)
     *  to know more about this property with demo.
     */
    @Property('groupBy')
    public groupBy: string;

    /**
     * It is used to enable the sorting of list items to be ascending or descending.
     */
    @Property('text')
    public sortBy: string;

    /**
     * Defines the HTML attributes such as id, class, etc,. for the specific list item.
     */
    @Property('htmlAttributes')
    public htmlAttributes: string;
    /**
     * It is used to fetch a specified named table data while using serviceUrl of DataManager
     *  in dataSource property.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/data/getting-started?lang=typescript)
     *  to know more about this property with demo.
     */
    @Property('tableName')
    public tableName: string;
}

/**
 * Animation configuration settings.
 */
export interface AnimationSettings {
    /**
     * It is used to specify the effect which is shown in sub list transform.
     */
    effect?: ListViewEffect;
    /**
     * It is used to specify the time duration of transform object.
     */
    duration?: number;
    /**
     * It is used to specify the easing effect applied while transform
     */
    easing?: string;
}

/**
 * ListView animation effects
 */
export type ListViewEffect = 'None' | 'SlideLeft' | 'SlideDown' | 'Zoom' | 'Fade';

/**
 * ListView check box positions
 */
export type checkBoxPosition = 'Left' | 'Right';


/**
 * Represents the EJ2 ListView control.
 * ```html
 * <div id="listview">
 * <ul>
 * <li>Favorite</li>
 * <li>Documents</li>
 * <li>Downloads</li>
 * </ul>
 * </div>
 * ```
 * ```typescript
 *   var lvObj = new ListView({});
 *   lvObj.appendTo("#listview");
 * ```
 */
@NotifyPropertyChanges
export class ListView extends Component<HTMLElement> implements INotifyPropertyChanged {

    private ulElement: HTMLElement;
    private selectedLI: Element;
    private onUIScrolled: Function;
    private curUL: HTMLElement;
    private curDSLevel: string[];
    private curViewDS: DataSource[] | string[] | number[];
    private curDSJSON: DataSource;
    public localData: DataSource[];
    private liCollection: HTMLElement[];
    private headerEle: HTMLElement;
    private contentContainer: HTMLElement;
    private touchModule: Touch;
    private listBaseOption: ListBaseOptions;
    public virtualizationModule: Virtualization;
    private animateOptions: AnimationOptions;
    private rippleFn: Function;
    private isNestedList: boolean;
    private currentLiElements: HTMLElement[];
    private selectedData: string[] | string;
    private selectedId: string[];
    private isWindow: boolean;
    private selectedItems: SelectedItem;
    private aniObj: Animation;
    private LISTVIEW_TEMPLATE_ID: string;
    private LISTVIEW_GROUPTEMPLATE_ID: string;
    private LISTVIEW_HEADERTEMPLATE_ID: string;
    /**
     * This cssClass property helps to use custom skinning option for ListView component,
     *  by adding the mentioned class name into root element of ListView.

     */
    @Property('')
    public cssClass: string;

    /**
     * It enables UI virtualization which will increase ListView performance on loading large number of data.
     *

     */
    @Property(false)
    public enableVirtualization: boolean;

    /**
     * Defines the HTML attributes such as id, class, etc., for the ListView.

     */
    @Property({})
    public htmlAttributes: { [key: string]: string; };

    /**
     * It specifies enabled state of ListView component.

     */
    @Property(true)
    public enable: boolean;

    /**
     * It provides the data to render the ListView component which is mapped
     *  with the fields of ListView.

     * {% codeBlock src="listview/datasource-api/index.ts" %}{% endcodeBlock %}

     */
    @Property([])
    public dataSource: { [key: string]: Object }[] | string[] | number[] | DataManager;

    /**
     * It is used to fetch the specific data from dataSource by using where, select key words.
     * Refer the documentation [here]
     * (./data-binding#bind-to-remote-data)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="listview/query-api/index.ts" %}{% endcodeBlock %}

     */
    @Property()
    public query: Query;

    /**
     * It is used to map keys from the dataSource which extracts the appropriate data from the dataSource
     *  with specified mapped with the column fields to render the ListView.
     *
     * {% codeBlock src="listview/fields-api/index.ts" %}{% endcodeBlock %}

     */
    @Complex<FieldSettingsModel>(ListBase.defaultMappedFields, FieldSettings)
    public fields: FieldSettingsModel;

    /**
     * It is used to apply the animation to sub list navigation of list items.

     */
    @Property<AnimationSettings>({ effect: 'SlideLeft', duration: 400, easing: 'ease' })
    public animation: AnimationSettings;

    /**
     * It is used to enable the sorting of list items to be ascending or descending.
     *
     * {% codeBlock src="listview/sortorder-api/index.ts" %}{% endcodeBlock %}

     */
    @Property<SortOrder>('None')
    public sortOrder: SortOrder;

    /**
     * Using this property, we can show or hide the icon of list item.
     *
     * {% codeBlock src="listview/showicon-api/index.ts" %}{% endcodeBlock %}

     */
    @Property<boolean>(false)
    public showIcon: boolean;

    /**
     * Using this property, we can show or hide the `checkbox`.
     *
     * {% codeBlock src="listview/showcheckbox-api/index.ts" %}{% endcodeBlock %}

     */
    @Property<boolean>(false)
    public showCheckBox: boolean;

    /**
     * It is used to set the position of check box in an item.

     */
    @Property<string>('Left')
    public checkBoxPosition: checkBoxPosition;

    /**
     * It is used to set the title of ListView component.
     *
     * {% codeBlock src="listview/fields-api/index.ts" %}{% endcodeBlock %}

     */
    @Property<string>('')
    public headerTitle: string;

    /**
     * Using this property, we can show or hide the header of ListView component.
     *
     * {% codeBlock src="listview/fields-api/index.ts" %}{% endcodeBlock %}

     */
    @Property<boolean>(false)
    public showHeader: boolean;

    /**
     * It is used to set the height of the ListView component.

     */
    @Property('')
    public height: number | string;

    /**
     * It sets the width to the ListView component.

     */
    @Property('')
    public width: number | string;

    /**
     * The ListView supports to customize the content of each list items with the help of template property.
     * Refer the documentation [here](./listview/customizing-templates)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="listview/template-api/index.ts" %}{% endcodeBlock %}

     */
    @Property(null)
    public template: string;

    /**
     * The ListView has an option to custom design the ListView header title with the help of headerTemplate property.
     * Refer the documentation [here]
     * (./listview/customizing-templates#header-template)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="listview/headertemplate-api/index.ts" %}{% endcodeBlock %}

     */
    @Property(null)
    public headerTemplate: string;

    /**
     * The ListView has an option to custom design the group header title with the help of groupTemplate property.
     * Refer the documentation [here]
     * (./listview/customizing-templates#group-template)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="listview/grouptemplate-api/index.ts" %}{% endcodeBlock %}

     */
    @Property(null)
    public groupTemplate: string;

    /**
     * We can trigger the `select` event when we select the list item in the component.
     * @event

     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * We can trigger `actionBegin` event before every ListView action starts.
     * @event

     */
    @Event()
    public actionBegin: EmitType<Object>;

    /**
     * We can trigger `actionComplete` event for every ListView action success event
     *  with the dataSource parameter.
     * @event

     */
    @Event()
    public actionComplete: EmitType<Object>;

    /**
     * We can trigger `actionFailure` event for every ListView action failure event
     *  with the dataSource parameter.
     * @event

     */
    @Event()
    public actionFailure: EmitType<Object>;


    /**
     * Constructor for creating the widget
     */
    constructor(options?: ListViewModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    /**
     * @private
     */
    public onPropertyChanged(newProp: ListViewModel, oldProp: ListViewModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'htmlAttributes':
                    this.setHTMLAttribute();
                    break;
                case 'cssClass':
                    this.setCSSClass(oldProp.cssClass);
                    break;
                case 'enable':
                    this.setEnable();
                    break;
                case 'width':
                case 'height':
                    this.setSize();
                    break;
                case 'enableRtl':
                    this.setEnableRTL();
                    break;
                case 'fields':
                    this.listBaseOption.fields = (this.fields as ListViewModel & { properties: Object }).properties;
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    } else {
                        this.reRender();
                    }
                    break;
                case 'headerTitle':
                    if (!this.curDSLevel.length) {
                        this.header(this.headerTitle, false);
                    }
                    break;
                case 'showHeader':
                    this.header(this.headerTitle, false);
                    break;
                case 'enableVirtualization':
                    if (!isNullOrUndefined(this.contentContainer)) {
                        detach(this.contentContainer);
                    }
                    this.refresh();
                    break;
                case 'showCheckBox':
                case 'checkBoxPosition':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    } else {
                        this.setCheckbox();
                    }
                    break;
                case 'dataSource':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    } else {
                        this.reRender();
                    }
                    break;
                case 'sortOrder':
                case 'showIcon':
                    if (this.enableVirtualization) {
                        this.virtualizationModule.reRenderUiVirtualization();
                    } else {
                        this.listBaseOption.showIcon = this.showIcon;
                        this.curViewDS = this.getSubDS();
                        this.resetCurrentList();
                    }
                    break;
                default:
                    break;
            }
        }
    }

    // Model Changes
    private setHTMLAttribute(): void {
        if (Object.keys(this.htmlAttributes).length) {
            attributes(this.element, this.htmlAttributes);
        }
    }

    private setCSSClass(oldCSSClass?: string): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' ').filter((css: string) => css));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' ').filter((css: string) => css));
        }
    }

    private setSize(): void {
        this.element.style.height = formatUnit(this.height);
        this.element.style.width = formatUnit(this.width);
        this.isWindow = this.element.clientHeight ? false : true;
    }

    private setEnable(): void {
        this.enableElement(this.element, this.enable);
    }

    private setEnableRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private enableElement(element: HTMLElement, isEnabled?: boolean): void {
        if (isEnabled) {
            element.classList.remove(classNames.disable);
        } else {
            element.classList.add(classNames.disable);
        }
    }

    // Support Component Functions
    private header(text?: string, showBack?: boolean): void {
        if (this.headerEle === undefined && this.showHeader) {
            this.headerEle = this.createElement('div', { className: classNames.header });
            let innerHeaderEle: HTMLElement = this.createElement('span', { className: classNames.headerText, innerHTML: this.headerTitle });
            let textEle: HTMLElement = this.createElement('div', { className: classNames.text, innerHTML: innerHeaderEle.outerHTML });
            let hedBackButton: HTMLElement = this.createElement('div', {
                className: classNames.icon + ' ' + classNames.backIcon + ' e-but-back',
                attrs: { style: 'display:none;' }
            });
            this.headerEle.appendChild(hedBackButton);
            this.headerEle.appendChild(textEle);
            if (this.headerTemplate) {
                let compiledString: Function = compile(this.headerTemplate);
                let headerTemplateEle: HTMLElement = this.createElement('div', { className: classNames.headerTemplateText });
                append(compiledString({}, null, null, this.LISTVIEW_HEADERTEMPLATE_ID), headerTemplateEle);
                append([headerTemplateEle], this.headerEle);
                this.updateBlazorTemplates(false, true, true);
            }
            if (this.headerTemplate && this.headerTitle) {
                textEle.classList.add('header');
            }
            this.element.classList.add('e-has-header');
            prepend([this.headerEle], this.element);
        } else if (this.headerEle) {
            if (this.showHeader) {
                this.headerEle.style.display = '';
                let textEle: Element = this.headerEle.querySelector('.' + classNames.headerText);
                let hedBackButton: Element = this.headerEle.querySelector('.' + classNames.backIcon);
                textEle.innerHTML = text;
                if (this.headerTemplate && showBack) {
                    textEle.parentElement.classList.remove('header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('nested-header');
                }
                if (this.headerTemplate && !showBack) {
                    textEle.parentElement.classList.add('header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.remove('nested-header');
                    this.headerEle.querySelector('.' + classNames.headerTemplateText).classList.add('header');
                }
                if (showBack === true) {
                    (hedBackButton as HTMLElement).style.display = '';
                } else {
                    (hedBackButton as HTMLElement).style.display = 'none';
                }
            } else {
                this.headerEle.style.display = 'none';
            }
        }
    }

    // Animation Related Functions
    private switchView(fromView: HTMLElement, toView: HTMLElement, reverse?: boolean): void {
        if (fromView && toView) {
            let fPos: string = fromView.style.position;
            let overflow: string = (this.element.style.overflow !== 'hidden') ? this.element.style.overflow : '';

            fromView.style.position = 'absolute';
            fromView.classList.add('e-view');
            let anim: Effect[];
            let duration: number = this.animation.duration;
            if (this.animation.effect) {
                anim = (this.enableRtl ? effectsRTLConfig[this.animation.effect] : effectsConfig[this.animation.effect]);
            } else {
                let slideLeft: string = 'SlideLeft';
                anim = effectsConfig[slideLeft];
                reverse = this.enableRtl;
                duration = 0;
            }
            this.element.style.overflow = 'hidden';
            this.aniObj.animate(fromView, {
                name: (reverse === true ? anim[0] : anim[1]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (model: AnimationOptions): void => {
                    fromView.style.display = 'none';
                    this.element.style.overflow = overflow;
                    fromView.style.position = fPos;
                    fromView.classList.remove('e-view');
                }
            });
            toView.style.display = '';
            this.aniObj.animate(toView, {
                name: (reverse === true ? anim[2] : anim[3]),
                duration: duration,
                timingFunction: this.animation.easing,
                end: (): void => {
                    this.trigger('actionComplete');
                }
            });
            this.curUL = toView;
        }
    }

    protected preRender(): void {
        this.listBaseOption = {
            template: this.template,
            headerTemplate: this.headerTemplate,
            groupTemplate: this.groupTemplate, expandCollapse: true, listClass: '',
            ariaAttributes: {
                itemRole: 'listitem', listRole: 'list', itemText: '',
                groupItemRole: 'group', wrapperRole: 'presentation'
            },
            fields: (this.fields as ListViewModel & { properties: Object }).properties, sortOrder: this.sortOrder, showIcon: this.showIcon,
            itemCreated: this.renderCheckbox.bind(this),
            templateID: `${this.element.id}${LISTVIEW_TEMPLATE_PROPERTY}`,
            groupTemplateID: `${this.element.id}${LISTVIEW_GROUPTEMPLATE_PROPERTY}`,
            removeBlazorID: true
        };
        this.initialization();
    }

    private initialization(): void {
        this.curDSLevel = [];
        this.animateOptions = {};
        this.curViewDS = [];
        this.currentLiElements = [];
        this.isNestedList = false;
        this.selectedData = [];
        this.selectedId = [];
        this.LISTVIEW_TEMPLATE_ID = `${this.element.id}${LISTVIEW_TEMPLATE_PROPERTY}`;
        this.LISTVIEW_GROUPTEMPLATE_ID = `${this.element.id}${LISTVIEW_GROUPTEMPLATE_PROPERTY}`;
        this.LISTVIEW_HEADERTEMPLATE_ID = `${this.element.id}${LISTVIEW_HEADERTEMPLATE_PROPERTY}`;
        this.aniObj = new Animation(this.animateOptions);
        this.removeElement(this.curUL);
        this.removeElement(this.ulElement);
        this.removeElement(this.headerEle);
        this.removeElement(this.contentContainer);
        this.curUL = this.ulElement = this.liCollection = this.headerEle = this.contentContainer = undefined;
    }

    private renderCheckbox(args: ItemCreatedArgs): void {
        if (args.item.classList.contains(classNames.hasChild)) {
            this.isNestedList = true;
        }
        if (this.showCheckBox && this.isValidLI(args.item)) {
            let checkboxElement: Element;
            let fieldData: DataSource;
            checkboxElement = createCheckBox(this.createElement, false, {
                checked: false, enableRtl: this.enableRtl,
                cssClass: classNames.listviewCheckbox
            });
            checkboxElement.setAttribute('role', 'checkbox');
            let frameElement: Element = checkboxElement.querySelector('.' + classNames.checkboxIcon);
            args.item.classList.add(classNames.itemCheckList);
            args.item.firstElementChild.classList.add(classNames.checkbox);
            if (typeof (this.dataSource as string[])[0] !== 'string' && typeof (this.dataSource as number[])[0] !== 'number') {
                fieldData = <DataSource>getFieldValues(args.curData, this.listBaseOption.fields);
                if (<string>fieldData[this.listBaseOption.fields.isChecked]) {
                    this.checkInternally(args, checkboxElement);
                }
            } else if (((typeof (this.dataSource as string[])[0] === 'string' ||
                typeof (this.dataSource as number[])[0] === 'number') && this.selectedData.indexOf(args.text) !== -1)) {
                this.checkInternally(args, checkboxElement);
            }
            checkboxElement.setAttribute('aria-checked', frameElement.classList.contains(classNames.checked) ? 'true' : 'false');
            if (this.checkBoxPosition === 'Left') {
                checkboxElement.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.classList.add(classNames.checkboxLeft);
                args.item.firstElementChild.insertBefore(checkboxElement, args.item.firstElementChild.childNodes[0]);
            } else {
                checkboxElement.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.classList.add(classNames.checkboxRight);
                args.item.firstElementChild.appendChild(checkboxElement);
            }
            this.currentLiElements.push(args.item);
        }
    }

    private checkInternally(args: ItemCreatedArgs, checkboxElement: Element): void {
        args.item.classList.add(classNames.selected);
        args.item.setAttribute('aria-selected', 'true');
        checkboxElement.querySelector('.' + classNames.checkboxIcon).classList.add(classNames.checked);
        checkboxElement.setAttribute('aria-checked', 'true');
    }

    /**
     * It is used to check the checkbox of an item.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    public checkItem(item: Fields | HTMLElement | Element): void {
        this.toggleCheckBase(item, true);
    }

    private toggleCheckBase(item: Fields | Element | HTMLElement, checked: boolean): void {
        if (this.showCheckBox) {
            let liElement: Element = item as Element;
            if (item instanceof Object && (item as Object).constructor !== HTMLLIElement) {
                liElement = this.getLiFromObjOrElement(item);
            }
            if (!isNullOrUndefined(liElement)) {
                let checkboxIcon: Element = liElement.querySelector('.' + classNames.checkboxIcon);
                checked ? liElement.classList.add(classNames.selected) : liElement.classList.remove(classNames.selected);
                liElement.setAttribute('aria-selected', checked ? 'true' : 'false');
                checked ? checkboxIcon.classList.add(classNames.checked) : checkboxIcon.classList.remove(classNames.checked);
                checkboxIcon.parentElement.setAttribute('aria-checked', checked ? 'true' : 'false');
            }
            this.setSelectedItemData(liElement);
        }
    }

    /**
     * It is used to uncheck the checkbox of an item.
     * @param  {Fields | HTMLElement | Element} item - It accepts Fields or HTML list element as an argument.
     */
    public uncheckItem(item: Fields | HTMLElement | Element): void {
        this.toggleCheckBase(item, false);
    }

    /**
     * It is used to check all the items in ListView.
     */
    public checkAllItems(): void {
        this.toggleAllCheckBase(true);
    }

    /**
     * It is used to un-check all the items in ListView.
     */
    public uncheckAllItems(): void {
        this.toggleAllCheckBase(false);
    }

    private toggleAllCheckBase(checked: boolean): void {
        if (this.showCheckBox) {
            for (let i: number = 0; i < this.liCollection.length; i++) {
                let checkIcon: Element = this.liCollection[i].querySelector('.' + classNames.checkboxIcon);
                if (checkIcon) {
                    if (checked) {
                        if (!checkIcon.classList.contains(classNames.checked)) {
                            this.checkItem(this.liCollection[i]);
                        }
                    } else {
                        if (checkIcon.classList.contains(classNames.checked)) {
                            this.uncheckItem(this.liCollection[i]);
                        }
                    }
                }
            }
            if (this.enableVirtualization) {
                this.virtualizationModule.checkedItem(checked);
            }
        }
    }

    private setCheckbox(): void {
        if (this.showCheckBox) {
            let liCollection: HTMLElement[] = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
            let args: ItemCreatedArgs = {
                item: undefined, curData: undefined, dataSource: undefined, fields: undefined,
                options: undefined, text: ''
            };
            liCollection.forEach((element: HTMLElement) => {
                args.item = element;
                args.curData = this.getItemData(element);
                if (element.querySelector('.' + classNames.checkboxWrapper)) {
                    this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
                }
                this.renderCheckbox(args);
                if (args.item.classList.contains(classNames.selected)) {
                    this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
                }
            });
        } else {
            let liCollection: HTMLElement[] = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.itemCheckList));
            liCollection.forEach((element: HTMLElement) => {
                element.classList.remove(classNames.selected);
                element.firstElementChild.classList.remove(classNames.checkbox);
                this.removeElement(element.querySelector('.' + classNames.checkboxWrapper));
            });
            if (this.selectedItems) {
                this.selectedItems.item.classList.add(classNames.selected);
            }
        }
    }

    /**
     * It is used to refresh the UI list item height
     */
    public refreshItemHeight(): void {
        this.virtualizationModule.refreshItemHeight();
    }

    private clickHandler(e: MouseEvent): void {
        let target: Element = <Element>e.target;
        let classList: DOMTokenList = target.classList;
        if (classList.contains(classNames.backIcon) || classList.contains(classNames.headerText)) {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        } else {
            let li: HTMLElement = <HTMLElement>closest(target.parentNode, '.' + classNames.listItem);
            if (li === null) { li = <HTMLElement>target; }
            this.removeFocus();
            if (this.enable && this.showCheckBox && this.isValidLI(li)) {
                if ((e.target as HTMLElement).classList.contains(classNames.checkboxIcon)) {
                    li.classList.add(classNames.focused);
                    if (isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                        let args: ItemCreatedArgs = {
                            curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                            text: undefined, item: li
                        };
                        this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
                    } else {
                        this.uncheckItem(li);
                        li.classList.add(classNames.focused);
                    }
                    if (this.enableVirtualization) {
                        this.virtualizationModule.setCheckboxLI(li, e);
                    }
                    if (e) {
                        let eventArgs: Object = this.selectEventData(li, e);
                        let checkIcon: Element = li.querySelector('.' + classNames.checkboxIcon);
                        merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
                        this.trigger('select', eventArgs);
                    }
                } else if (li.classList.contains(classNames.hasChild)) {
                    this.removeHover();
                    this.removeSelect();
                    this.removeSelect(li);
                    this.setSelectLI(li, e);
                    li.classList.remove(classNames.selected);
                } else {
                    this.setCheckboxLI(li, e);
                }
            } else {
                this.setSelectLI(li, e);
            }
        }
    }

    private removeElement(element: HTMLElement | Element): HTMLElement | Element {
        return element && element.parentNode && element.parentNode.removeChild(element);
    }

    private hoverHandler(e: MouseEvent): void {
        let curLi: HTMLElement = <HTMLElement>closest((<Element>e.target).parentNode, '.' + classNames.listItem);
        this.setHoverLI(curLi);
    }

    private leaveHandler(e: MouseEvent): void {
        this.removeHover();
    };
    private homeKeyHandler(e: KeyboardEventArgs, end?: boolean): void {
        if (Object.keys(this.dataSource).length && this.curUL) {
            let li: Element[] = <NodeListOf<Element> & Element[]>this.curUL.querySelectorAll('.' + classNames.listItem);
            let focusedElement: Element = this.curUL.querySelector('.' + classNames.focused) ||
                this.curUL.querySelector('.' + classNames.selected);
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (!this.showCheckBox) {
                    focusedElement.classList.remove(classNames.selected);
                }
            }
            let index: number = !end ? 0 : li.length - 1;
            if (li[index].classList.contains(classNames.hasChild) || this.showCheckBox) {
                li[index].classList.add(classNames.focused);
            } else {
                this.setSelectLI(li[index], e);
            }
        }
    }

    private onArrowKeyDown(e: KeyboardEventArgs, prev: boolean): Element {
        let siblingLI: Element;
        let li: Element;
        let hasChild: boolean = !isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
        if (hasChild || this.showCheckBox) {
            li = this.curUL.querySelector('.' + classNames.focused) || this.curUL.querySelector('.' + classNames.selected);
            siblingLI = ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            if (!isNullOrUndefined(siblingLI)) {
                if (li) {
                    li.classList.remove(classNames.focused);
                    if (!this.showCheckBox) {
                        li.classList.remove(classNames.selected);
                    }
                }
                if (siblingLI.classList.contains(classNames.hasChild) || this.showCheckBox) {
                    siblingLI.classList.add(classNames.focused);
                } else {
                    this.setSelectLI(siblingLI, e);
                }
            }
        } else {
            li = this.curUL.querySelector('.' + classNames.selected);
            siblingLI = ListBase.getSiblingLI(this.curUL.querySelectorAll('.' + classNames.listItem), li, prev);
            this.setSelectLI(siblingLI, e);
        }
        return siblingLI;
    }

    private arrowKeyHandler(e: KeyboardEventArgs, prev?: boolean): void {
        e.preventDefault();
        if (Object.keys(this.dataSource).length && this.curUL) {
            let siblingLI: Element = this.onArrowKeyDown(e, prev);
            let elementTop: number = this.element.getBoundingClientRect().top;
            let elementHeight: number = this.element.getBoundingClientRect().height;
            let firstItemBounds: ClientRect = this.curUL.querySelector('.' + classNames.listItem).getBoundingClientRect();
            let heightDiff: number;
            let groupItemBounds: ClientRect;
            if (this.fields.groupBy) {
                groupItemBounds = this.curUL.querySelector('.' + classNames.groupListItem).getBoundingClientRect();
            }
            if (siblingLI) {
                let siblingTop: number = siblingLI.getBoundingClientRect().top;
                let siblingHeight: number = siblingLI.getBoundingClientRect().height;
                if (!prev) {
                    let height: number = this.isWindow ? window.innerHeight : elementHeight;
                    heightDiff = this.isWindow ? (siblingTop + siblingHeight) :
                        ((siblingTop - elementTop) + siblingHeight);
                    if (heightDiff > height) {
                        this.isWindow ? window.scroll(0, pageYOffset + (heightDiff - height)) :
                            this.element.scrollTop = this.element.scrollTop + (heightDiff - height);
                    }
                } else {
                    heightDiff = this.isWindow ? siblingTop : (siblingTop - elementTop);
                    if (heightDiff < 0) {
                        this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                            this.element.scrollTop = this.element.scrollTop + heightDiff;
                    }
                }
            } else if (this.enableVirtualization && prev && this.virtualizationModule.uiFirstIndex) {
                this.onUIScrolled = () => {
                    this.onArrowKeyDown(e, prev);
                    this.onUIScrolled = undefined;
                };
                heightDiff = this.virtualizationModule.listItemHeight;
                this.isWindow ? window.scroll(0, pageYOffset - heightDiff) :
                    this.element.scrollTop = this.element.scrollTop - heightDiff;
            } else if (prev) {
                if (this.showHeader && this.headerEle) {
                    let topHeight: number = groupItemBounds ? groupItemBounds.top : firstItemBounds.top;
                    let headerBounds: ClientRect = this.headerEle.getBoundingClientRect();
                    heightDiff = headerBounds.top < 0 ? (headerBounds.height - topHeight) : 0;
                    this.isWindow ? window.scroll(0, pageYOffset - heightDiff)
                        : this.element.scrollTop = 0;
                } else if (this.fields.groupBy) {
                    heightDiff = this.isWindow ? (groupItemBounds.top < 0 ? groupItemBounds.top : 0) :
                        (elementTop - firstItemBounds.top) + groupItemBounds.height;
                    this.isWindow ? window.scroll(0, pageYOffset + heightDiff) :
                        this.element.scrollTop = this.element.scrollTop - heightDiff;
                }
            }
        }
    }

    private enterKeyHandler(e: KeyboardEventArgs): void {
        if (Object.keys(this.dataSource).length && this.curUL) {
            let hasChild: boolean = !isNullOrUndefined(this.curUL.querySelector('.' + classNames.hasChild)) ? true : false;
            let li: Element = this.curUL.querySelector('.' + classNames.focused);
            if (hasChild && li) {
                li.classList.remove(classNames.focused);
                if (this.showCheckBox) {
                    this.removeSelect();
                    this.removeSelect(<HTMLElement>li);
                    this.removeHover();
                }
                this.setSelectLI(li, e);
            }
        }
    }
    private spaceKeyHandler(e: KeyboardEventArgs): void {
        if (this.enable && this.showCheckBox && Object.keys(this.dataSource).length && this.curUL) {
            let li: Element = this.curUL.querySelector('.' + classNames.focused);
            if (!isNullOrUndefined(li) && isNullOrUndefined(li.querySelector('.' + classNames.checked))) {
                let args: ItemCreatedArgs = {
                    curData: undefined, dataSource: undefined, fields: undefined, options: undefined,
                    text: undefined, item: <HTMLElement>li
                };
                this.checkInternally(args, args.item.querySelector('.' + classNames.checkboxWrapper));
            } else {
                this.uncheckItem(li);
            }
        }
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.keyCode) {
            case 36:
                this.homeKeyHandler(e);
                break;
            case 35:
                this.homeKeyHandler(e, true);
                break;
            case 40:
                this.arrowKeyHandler(e);
                break;
            case 38:
                this.arrowKeyHandler(e, true);
                break;
            case 13:
                this.enterKeyHandler(e);
                break;
            case 8:
                if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                    this.uncheckAllItems();
                }
                this.back();
                break;
            case 32:
                this.spaceKeyHandler(e);
                break;
        }
    }

    private swipeActionHandler(e: SwipeEventArgs): void {
        if (e.swipeDirection === 'Right') {
            if (this.showCheckBox && this.curDSLevel[this.curDSLevel.length - 1]) {
                this.uncheckAllItems();
            }
            this.back();
        }
    }

    private focusout(): void {
        if (Object.keys(this.dataSource).length && this.curUL) {
            let focusedElement: Element = this.curUL.querySelector('.' + classNames.focused);
            let activeElement: Element = this.curUL.querySelector('[aria-selected = true]');
            if (focusedElement) {
                focusedElement.classList.remove(classNames.focused);
                if (activeElement && !this.showCheckBox) {
                    activeElement.classList.add(classNames.selected);
                }
            }
        }
    }

    private wireEvents(): void {
        EventHandler.add(this.element, 'keydown', this.keyActionHandler, this);
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        if (!this.enableVirtualization) {
            EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
            EventHandler.add(this.element, 'mouseout', this.leaveHandler, this);
        }
        EventHandler.add(this.element, 'focusout', this.focusout, this);
        this.touchModule = new Touch(this.element, { swipe: this.swipeActionHandler.bind(this) });
    }

    private unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        if (!this.enableVirtualization) {
            EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
            EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        }
        EventHandler.remove(this.element, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.element, 'mouseout', this.leaveHandler);
        this.touchModule.destroy();
    }

    private removeFocus(): void {
        let focusedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + classNames.focused);
        for (let ele of focusedLI) {
            ele.classList.remove(classNames.focused);
        }
    }

    private removeHover(): void {
        let hoverLI: Element = this.element.querySelector('.' + classNames.hover);
        if (hoverLI) { hoverLI.classList.remove(classNames.hover); }
    }

    private removeSelect(li?: HTMLElement): void {
        if (isNullOrUndefined(li)) {
            let selectedLI: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + classNames.selected);
            for (let ele of selectedLI) {
                if (this.showCheckBox && ele.querySelector('.' + classNames.checked)) {
                    continue;
                } else {
                    ele.setAttribute('aria-selected', 'false');
                    ele.classList.remove(classNames.selected);
                }
            }
        } else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
    }

    private isValidLI(li: Element | HTMLElement): boolean {
        return (li && li.classList.contains(classNames.listItem)
            && !li.classList.contains(classNames.groupListItem)
            && !li.classList.contains(classNames.disable));
    }

    private setCheckboxLI(li: Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        if (this.isValidLI(li) && this.enable && this.showCheckBox) {
            if (this.curUL.querySelector('.' + classNames.focused)) {
                this.curUL.querySelector('.' + classNames.focused).classList.remove(classNames.focused);
            }
            li.classList.add(classNames.focused);
            let checkboxElement: Element = li.querySelector('.' + classNames.checkboxWrapper);
            let checkIcon: Element = checkboxElement.querySelector('.' + classNames.checkboxIcon + '.' + classNames.icon);
            this.removeHover();
            if (!checkIcon.classList.contains(classNames.checked)) {
                checkIcon.classList.add(classNames.checked);
                li.classList.add(classNames.selected);
                li.setAttribute('aria-selected', 'true');
            } else {
                checkIcon.classList.remove(classNames.checked);
                li.classList.remove(classNames.selected);
                li.setAttribute('aria-selected', 'false');
            }
            checkboxElement.setAttribute('aria-checked', checkIcon.classList.contains(classNames.checked) ?
                'true' : 'false');
            let eventArgs: Object = this.selectEventData(li, e);
            merge(eventArgs, { isChecked: checkIcon.classList.contains(classNames.checked) });
            if (this.enableVirtualization) {
                this.virtualizationModule.setCheckboxLI(li, e);
            }
            this.trigger('select', eventArgs);
            this.setSelectedItemData(li);
            this.renderSubList(li);
        }
    }

    private selectEventData(li: Element, e?: MouseEvent | KeyboardEvent | FocusEvent): Object {
        let data: DataSource = this.getItemData(li);
        let fieldData: DataSource = <DataSource>getFieldValues(data, this.listBaseOption.fields);
        let selectedItem: SelectedItem;
        if (!isNullOrUndefined(data)
            && typeof (this.dataSource as string[])[0] === 'string' || typeof (this.dataSource as number[])[0] === 'number') {
            selectedItem = { item: li, text: li && (li as HTMLElement).innerText.trim(), data: this.dataSource as string[] | number[] };
        } else {
            selectedItem = { item: li, text: fieldData && <string>fieldData[this.listBaseOption.fields.text], data: data };
        }
        let eventArgs: Object = {};
        merge(eventArgs, selectedItem);
        if (e) {
            merge(eventArgs, { isInteracted: true, event: e, index: Array.prototype.indexOf.call(this.curUL.children, li) });
        }
        return eventArgs;
    }

    private setSelectedItemData(li: Element): void {
        let data: DataSource = this.getItemData(li);
        let fieldData: DataSource = <DataSource>getFieldValues(data, this.listBaseOption.fields);
        if (!isNullOrUndefined(data) && ((typeof (this.dataSource as string[])[0] === 'string') ||
            (typeof (this.dataSource as number[])[0] === 'number'))) {
            this.selectedItems = {
                item: li,
                text: li && (li as HTMLElement).innerText.trim(),
                data: this.dataSource as string[]
            };
        } else {
            this.selectedItems = {
                item: li,
                text: fieldData && <string>fieldData[this.listBaseOption.fields.text],
                data: data
            };
        }
    }

    private setSelectLI(li: Element, e?: MouseEvent | KeyboardEvent | FocusEvent): void {
        if (this.isValidLI(li) && !li.classList.contains(classNames.selected) && this.enable) {
            if (!this.showCheckBox) {
                this.removeSelect();
            }
            li.classList.add(classNames.selected);
            li.setAttribute('aria-selected', 'true');
            this.removeHover();
            this.setSelectedItemData(li);
            if (this.enableVirtualization) {
                this.virtualizationModule.setSelectLI(li, e);
            }
            let eventArgs: Object = this.selectEventData(li, e);
            this.trigger('select', eventArgs);
            this.selectedLI = li;
            this.renderSubList(li);
        }
    }

    private setHoverLI(li: Element): void {
        if (this.isValidLI(li) && !li.classList.contains(classNames.hover) && this.enable) {
            let lastLi: Element[] = <NodeListOf<Element> & Element[]>this.element.querySelectorAll('.' + classNames.hover);
            if (lastLi && lastLi.length) { removeClass(lastLi, classNames.hover); }
            if (!(li as Element).classList.contains(classNames.selected) || this.showCheckBox) {
                (li as Element).classList.add(classNames.hover);
            }
        }
    }

    //Data Source Related Functions
    private getSubDS(): DataSource[] {
        let levelKeys: string[] = this.curDSLevel;
        if (levelKeys.length) {
            let ds: DataSource[] = <DataSource[]>this.localData;
            for (let key of levelKeys) {
                let field: DataSource = {};
                field[this.fields.id] = key;
                this.curDSJSON = <DataSource[] & DataSource>this.findItemFromDS(ds, field);
                let fieldData: DataSource = <DataSource>getFieldValues
                    (this.curDSJSON, this.listBaseOption.fields);
                ds = this.curDSJSON ? <DataSource[] & DataSource>fieldData[this.fields.child] : ds;
            }
            return ds;
        }
        return <DataSource[]>this.localData;
    }

    private getItemData(li: Element | HTMLElement | Fields): DataSource {
        let dataSource: DataSource[] | string[] | number[] | DataManager = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        let fields: Fields = this.getElementUID(li);
        let curDS: DataSource[];
        if (isNullOrUndefined(this.element.querySelector('.' + classNames.hasChild)) && this.fields.groupBy) {
            curDS = <DataSource[]>this.curViewDS;
        } else {
            curDS = <DataSource[]>dataSource;
        }

        return <DataSource>this.findItemFromDS(curDS, <DataSource>fields);
    }

    private findItemFromDS(
        dataSource: DataSource[],
        fields: DataSource,
        parent?: boolean): DataSource[] | DataSource {

        let resultJSON: DataSource[] | DataSource;

        if (dataSource && dataSource.length && fields) {
            dataSource.some((data: DataSource) => {
                let fieldData: DataSource = <DataSource>getFieldValues(data, this.listBaseOption.fields);
                //(!(fid) || id === fid) && (!(ftext) || text === ftext) && (!!fid || !!ftext)
                if ((fields[this.fields.id] || fields[this.fields.text]) &&
                    (!fields[this.fields.id] || (!isNullOrUndefined(fieldData[this.fields.id]) &&
                        fieldData[this.fields.id].toString()) === fields[this.fields.id].toString()) &&
                    (!fields[this.fields.text] || fieldData[this.fields.text] === fields[this.fields.text])) {
                    resultJSON = (parent ? <DataSource[] | DataSource>dataSource : data);
                } else if (typeof data !== 'object' && dataSource.indexOf(data) !== -1) {
                    resultJSON = (parent ? <DataSource[] | DataSource>dataSource : data);
                } else if (!isNullOrUndefined(fields[this.fields.id]) && isNullOrUndefined(fieldData[this.fields.id])) {
                    let li: Element = this.element.querySelector('[data-uid="'
                        + fields[this.fields.id] + '"]');
                    if (li && (li as HTMLElement).innerText.trim() === fieldData[this.fields.text]) {
                        resultJSON = data;
                    }
                } else if ((fieldData as Object).hasOwnProperty(this.fields.child) && (fieldData[this.fields.child] as Object[]).length) {
                    resultJSON = <DataSource & DataSource[]>this.findItemFromDS(
                        <DataSource[]>fieldData[this.fields.child], fields, parent);
                }
                return !!resultJSON;
            });
        } else {
            resultJSON = <DataSource[] & DataSource>dataSource;
        }

        return <DataSource[] & DataSource>resultJSON;
    }

    private getQuery(): Query {
        let columns: string[] = [];
        let query: Query = (this.query ? this.query : new Query());
        if (!this.query) {
            for (let column of Object.keys((this.fields as ListViewModel & { properties: Object }).properties)) {
                if (column !== 'tableName' && !!((this.fields as DataSource)[column]) &&
                    (this.fields as DataSource)[column] !==
                    (ListBase.defaultMappedFields as DataSource)[column]
                    && columns.indexOf((this.fields as { [key: string]: string })[column]) === -1) {

                    columns.push((this.fields as { [key: string]: string })[column]);

                }
            }
            query.select(columns);
            if ((this.fields as ListViewModel & { properties: Object }).properties.hasOwnProperty('tableName')) {
                query.from(this.fields.tableName);
            }
        }

        return query;
    }

    private setViewDataSource(dataSource: DataSource[] = <DataSource[]>this.localData): void {
        if (dataSource && this.fields.groupBy) {
            if (this.sortOrder !== 'None') {
                this.curViewDS = ListBase.groupDataSource(
                    ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, this.fields.sortBy)),
                    this.listBaseOption.fields, this.sortOrder);
            } else {
                this.curViewDS = ListBase.groupDataSource(dataSource, this.listBaseOption.fields, this.sortOrder);
            }
        } else if (dataSource && this.sortOrder !== 'None') {
            this.curViewDS = ListBase.getDataSource(dataSource, ListBase.addSorting(this.sortOrder, this.fields.sortBy));
        } else {
            this.curViewDS = dataSource;
        }
    }

    private isInAnimation(): boolean {
        return this.curUL.classList.contains('.e-animate');
    }

    private setLocalData(): void {
        this.trigger('actionBegin');
        if (this.dataSource instanceof DataManager) {
            (this.dataSource as DataManager).executeQuery(this.getQuery()).then((e: Object) => {
                if (this.isDestroyed) { return; }
                this.localData = (e as ResultData).result;
                this.removeElement(this.contentContainer);
                this.renderList();
                this.trigger('actionComplete', e);
            }).catch((e: Object) => {
                if (this.isDestroyed) { return; }
                this.trigger('actionFailure', e);
            });
        } else if (!this.dataSource || !(<DataSource[]>this.dataSource).length) {
            let ul: HTMLElement = <HTMLElement>this.element.querySelector('ul');
            if (ul) {
                remove(ul);
                this.setProperties({ dataSource: ListBase.createJsonFromElement(ul) }, true);
                this.localData = <DataSource[]>this.dataSource;
                this.renderList();
                this.trigger('actionComplete', { data: this.localData });
            }
        } else {
            this.localData = <DataSource[]>this.dataSource;
            this.renderList();
            this.trigger('actionComplete', { data: this.localData });
        }
    }

    private reRender(): void {
        this.resetBlazorTemplates();
        this.removeElement(this.headerEle);
        this.removeElement(this.ulElement);
        this.removeElement(this.contentContainer);
        if (Object.keys(window).indexOf('ejsInterop') === -1) {
            this.element.innerHTML = '';
        }
        this.headerEle = this.ulElement = this.liCollection = undefined;
        this.setLocalData();
        this.header();
    }

    private resetCurrentList(): void {
        this.resetBlazorTemplates();
        this.setViewDataSource(this.curViewDS as DataSource[]);
        this.contentContainer.innerHTML = '';
        this.createList();
        this.renderIntoDom(this.curUL);
    }

    private createList(): void {
        this.currentLiElements = [];
        this.isNestedList = false;
        this.ulElement = this.curUL = ListBase.createList(
            this.createElement, this.curViewDS as DataSource[], this.listBaseOption);
        this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
        this.updateBlazorTemplates(true);
    }

    private resetBlazorTemplates(): void {
        // tslint:disable-next-line:no-any
        let templateCollection: any = blazorTemplates;
        if (this.template) {
            templateCollection[this.LISTVIEW_TEMPLATE_ID] = [];
            resetBlazorTemplate(this.LISTVIEW_TEMPLATE_ID, LISTVIEW_TEMPLATE_PROPERTY);
        }
        if (this.groupTemplate) {
            templateCollection[this.LISTVIEW_GROUPTEMPLATE_ID] = [];
            resetBlazorTemplate(this.LISTVIEW_GROUPTEMPLATE_ID, LISTVIEW_GROUPTEMPLATE_PROPERTY);
        }
        if (this.headerTemplate) {
            resetBlazorTemplate(this.LISTVIEW_HEADERTEMPLATE_ID, LISTVIEW_HEADERTEMPLATE_PROPERTY);
        }
    }

    private updateBlazorTemplates(
        template: boolean = false,
        headerTemplate: boolean = false,
        resetExistingElements: boolean = false): void {
        if (this.template && template && !this.enableVirtualization) {
            updateBlazorTemplate(this.LISTVIEW_TEMPLATE_ID, LISTVIEW_TEMPLATE_PROPERTY, this, resetExistingElements);
        }
        if (this.groupTemplate && template && !this.enableVirtualization) {
            updateBlazorTemplate(this.LISTVIEW_GROUPTEMPLATE_ID, LISTVIEW_GROUPTEMPLATE_PROPERTY, this, resetExistingElements);
        }
        if (this.headerTemplate && headerTemplate) {
            updateBlazorTemplate(this.LISTVIEW_HEADERTEMPLATE_ID, LISTVIEW_HEADERTEMPLATE_PROPERTY, this, resetExistingElements);
        }
    }

    private renderSubList(li: Element): void {
        let uID: string = li.getAttribute('data-uid');
        if (li.classList.contains(classNames.hasChild) && uID) {
            let ul: Element = closest(li.parentNode, '.' + classNames.parentItem);
            let ele: Element = this.element.querySelector('[pid=\'' + uID + '\']');
            this.curDSLevel.push(uID);
            this.setViewDataSource(this.getSubDS());
            if (!ele) {
                let data: DataSource[] = this.curViewDS as DataSource[];
                ele = ListBase.createListFromJson(this.createElement, data, this.listBaseOption, this.curDSLevel.length);
                ele.setAttribute('pID', <string>uID);
                (ele as HTMLElement).style.display = 'none';
                this.renderIntoDom(ele);
                this.updateBlazorTemplates(true);
            }
            this.switchView(<HTMLElement>ul, <HTMLElement>ele);
            this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
            if (this.selectedItems) {
                let fieldData: DataSource = <DataSource>
                    getFieldValues(<DataSource | string>this.selectedItems.data, this.listBaseOption.fields);
                this.header(<string>(fieldData[this.listBaseOption.fields.text]), true);
            }
            this.selectedLI = undefined;
        }
    }

    private renderIntoDom(ele: Element): void {
        this.contentContainer.appendChild(ele);
    }

    private renderList(data?: DataSource[]): void {
        this.setViewDataSource(data);
        if (this.enableVirtualization) {
            if (Object.keys(this.dataSource).length) {
                if ((this.template || this.groupTemplate) && !this.virtualizationModule.isNgTemplate()) {
                    this.listBaseOption.template = null;
                    this.listBaseOption.groupTemplate = null;
                    this.listBaseOption.itemCreated = this.virtualizationModule.createUIItem.bind(this.virtualizationModule);
                }
                this.virtualizationModule.uiVirtualization();
            }
        } else {
            this.createList();
            this.contentContainer = this.createElement('div', { className: classNames.content });
            this.element.appendChild(this.contentContainer);
            this.renderIntoDom(this.ulElement);
        }
    }

    private getElementUID(obj: Fields | HTMLElement | Element): Fields {
        let fields: DataSource = {};
        if (obj instanceof Element) {
            fields[this.fields.id] = obj.getAttribute('data-uid');
        } else {
            fields = <DataSource>obj;
        }
        return fields;
    }

    /**
     * It is used to Initialize the control rendering.
     */
    public render(): void {
        this.element.classList.add(classNames.root);
        attributes(this.element, { role: 'list', tabindex: '0' });
        this.setCSSClass();
        this.setEnableRTL();
        this.setEnable();
        this.setSize();
        this.wireEvents();
        this.header();
        this.setLocalData();
        this.setHTMLAttribute();
        this.rippleFn = rippleEffect(this.element, {
            selector: '.' + classNames.listItem
        });
        this.renderComplete();
    }

    /**
     * It is used to destroy the ListView component.
     */
    public destroy(): void {
        this.resetBlazorTemplates();
        this.unWireEvents();
        let classAr: string[] = [classNames.root, classNames.disable, 'e-rtl',
            'e-has-header', 'e-lib'].concat(this.cssClass.split(' ').filter((css: string) => css));
        removeClass([this.element], classAr);
        this.rippleFn();
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.element.innerHTML = '';
        this.curUL = this.ulElement = this.liCollection = this.headerEle = undefined;
        super.destroy();
    }

    /**
     * It helps to switch back from navigated sub list.
     */
    public back(): void {
        let pID: string = this.curDSLevel[this.curDSLevel.length - 1];
        if (pID === undefined || this.isInAnimation()) { return; }
        this.curDSLevel.pop();
        this.setViewDataSource(this.getSubDS());
        let toUL: HTMLElement = <HTMLElement>this.element.querySelector('[data-uid=\'' + pID + '\']');
        let fromUL: HTMLElement = this.curUL;
        if (!toUL) {
            this.createList();
            this.renderIntoDom(this.ulElement);
            toUL = this.curUL;
        } else {
            toUL = toUL.parentElement;
        }
        let fieldData: DataSource = <DataSource>getFieldValues(this.curDSJSON, this.listBaseOption.fields);
        let text: string = <string>fieldData[this.fields.text];
        this.switchView(fromUL, toUL, true);
        this.removeFocus();
        let li: HTMLElement = <HTMLElement>this.element.querySelector('[data-uid=\'' + pID + '\']');
        li.classList.add(classNames.focused);
        if (this.showCheckBox && li.querySelector('.' + classNames.checkboxIcon).classList.contains(classNames.checked)) {
            li.setAttribute('aria-selected', 'true');
        } else {
            li.classList.remove(classNames.selected);
            li.setAttribute('aria-selected', 'false');
        }
        this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
        this.header((this.curDSLevel.length ? text : this.headerTitle), (this.curDSLevel.length ? true : false));
    }

    /**
     * It is used to select the list item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public selectItem(obj: Fields | HTMLElement | Element): void {
        if (this.enableVirtualization) {
            this.virtualizationModule.selectItem(obj);
        } else if (this.showCheckBox) {
            this.setCheckboxLI(this.getLiFromObjOrElement(obj));
        } else {
            isNullOrUndefined(obj) ? this.removeSelect() : this.setSelectLI(this.getLiFromObjOrElement(obj));

        }
    }

    private getLiFromObjOrElement(obj: Fields | HTMLElement | Element): HTMLElement {
        let li: Element;
        let dataSource: DataSource[] | string[] | number[] | DataManager = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        if (!isNullOrUndefined(obj)) {
            if (typeof (dataSource as string[])[0] === 'string' || typeof (dataSource as number[])[0] === 'number') {
                if (obj instanceof Element) {
                    let uid: string = (obj as HTMLElement).getAttribute('data-uid').toString();
                    for (let i: number = 0; i < this.liCollection.length; i++) {
                        if (this.liCollection[i].getAttribute('data-uid').toString() === uid) {
                            li = this.liCollection[i] as HTMLElement;
                            break;
                        }
                    }
                } else {
                    Array.prototype.some.call(this.curUL.querySelectorAll('.' + classNames.listItem), (item: HTMLElement) => {
                        if (item.innerText.trim() === obj.toString()) {
                            li = item;
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            } else {
                let resultJSON: DataSource[] | DataSource = this.getItemData(obj);
                let fieldData: DataSource =
                    <DataSource>getFieldValues(resultJSON, this.listBaseOption.fields);
                if (resultJSON) {
                    li = this.element.querySelector('[data-uid="'
                        + (<DataSource>fieldData)[this.fields.id] + '"]');
                    if (!this.enableVirtualization && isNullOrUndefined(li)) {
                        let curLi: NodeListOf<Element> = this.element.querySelectorAll('.' + classNames.listItem);
                        for (let i: number = 0; i < curLi.length; i++) {
                            if ((curLi[i] as HTMLElement).innerText.trim() === fieldData[this.fields.text]) {
                                li = curLi[i];
                            }
                        }
                    }
                }
            }
        }
        return <HTMLElement>li;
    }

    /**
     * It is used to select multiple list item from the ListView.
     * @param  {Fields[] | HTMLElement[] | Element[]} obj - We can pass array of elements or array of field Object with ID and Text fields.
     */
    public selectMultipleItems(obj: Fields[] | HTMLElement[] | Element[]): void {
        if (!isNullOrUndefined(obj)) {
            for (let i: number = 0; i < obj.length; i++) {
                if (!isNullOrUndefined(obj[i])) {
                    this.selectItem(obj[i]);
                }
            }
        }
    }

    private getParentId(): string[] {
        let parentId: string[] = [];
        if (this.isNestedList) {
            for (let i: number = this.curDSLevel.length - 1; i >= 0; i--) {
                parentId.push(this.curDSLevel[i]);
            }
        }
        return parentId;
    }

    /**
     * It is used to get the currently [here](./api-selectedItem)
     *  item details from the list items.

     */
    public getSelectedItems(): SelectedItem | SelectedCollection | UISelectedItem | NestedListData {
        // tslint:disable-next-line:no-any
        let finalValue: any;
        let isCompleted: boolean = false;
        this.selectedId = [];
        let dataSource: DataSource[] | string[] | number[] | DataManager = this.dataSource instanceof DataManager ?
            this.localData : this.dataSource;
        if (this.enableVirtualization && !isCompleted) {
            finalValue = this.virtualizationModule.getSelectedItems();
            isCompleted = true;
        } else if (this.showCheckBox && !isCompleted) {
            // tslint:disable-next-line:no-any
            let liCollection: any = this.curUL.getElementsByClassName(classNames.selected);
            let liTextCollection: string[] = []; let liDataCollection: DataSource[] = []; this.selectedId = [];
            let dataParent: DataAndParent[] = [];
            for (let i: number = 0; i < liCollection.length; i++) {
                if (typeof (dataSource as string[])[0] === 'string' || typeof (dataSource as number[])[0] === 'number') {
                    liTextCollection.push((liCollection[i] as HTMLElement).innerText.trim());
                } else {
                    let tempData: DataSource = this.getItemData(liCollection[i] as HTMLElement);
                    let fieldData: DataSource =
                        <DataSource>getFieldValues(tempData, this.listBaseOption.fields);
                    if (this.isNestedList) {
                        dataParent.push({ data: tempData, parentId: this.getParentId() });
                    } else {
                        liDataCollection.push(tempData);
                    }
                    if (fieldData) {
                        liTextCollection.push(<string>fieldData[this.listBaseOption.fields.text]);
                        this.selectedId.push(<string>fieldData[this.listBaseOption.fields.id]);
                    } else {
                        liTextCollection.push(undefined);
                        this.selectedId.push(undefined);
                    }
                }
            }
            if ((typeof (dataSource as string[])[0] === 'string'
                || typeof (dataSource as number[])[0] === 'number')
                && !isCompleted) {
                finalValue = { item: liCollection, data: dataSource as string[] | number[], text: liTextCollection };
                isCompleted = true;
            }
            if (this.isNestedList && !isCompleted) {
                finalValue = { item: liCollection, data: dataParent, text: liTextCollection };
                isCompleted = true;
            } else if (!isCompleted) {
                finalValue = { item: liCollection, data: liDataCollection, text: liTextCollection };
                isCompleted = true;
            }
        } else if (!isCompleted) {
            let liElement: Element = this.element.getElementsByClassName(classNames.selected)[0];
            let fieldData: DataSource =
                <DataSource>getFieldValues(this.getItemData(liElement), this.listBaseOption.fields);
            if ((typeof (dataSource as string[])[0] === 'string'
                || typeof (dataSource as number[])[0] === 'number')
                && !isCompleted) {
                finalValue = (!isNullOrUndefined(liElement)) ? {
                    item: liElement, data: dataSource as string[] | number[],
                    text: (liElement as HTMLElement).innerText.trim()
                } : undefined;
                isCompleted = true;
            } else if (!isCompleted) {
                if (isNullOrUndefined(fieldData) || isNullOrUndefined(liElement)) {
                    finalValue = undefined;
                    isCompleted = true;
                } else {
                    this.selectedId.push(<string>fieldData[this.listBaseOption.fields.id]);
                    finalValue = {
                        text: <string>fieldData[this.listBaseOption.fields.text], item: liElement,
                        data: this.getItemData(liElement)
                    };
                    isCompleted = true;
                }
            }
        }
        if (isBlazor()) {
            // tslint:disable-next-line:no-any
            return this.blazorGetSelectedItems(finalValue) as any;
        } else {
            return finalValue;
        }
    }

    // tslint:disable-next-line:no-any
    private blazorGetSelectedItems(finalGetSelectedItem: any): ListSelectedItem {
        let blazorSelectedItem: ListSelectedItem = {
            data: [],
            index: [],
            parentId: [],
            text: []
        };

        if (!isNullOrUndefined(finalGetSelectedItem)) {
            if (!isNullOrUndefined(finalGetSelectedItem.data)) {
                if (this.showCheckBox && this.isNestedList) {
                    finalGetSelectedItem.data.forEach((currentData: DataAndParent) => {
                        blazorSelectedItem.data.push(currentData.data);
                    });
                    if (!isNullOrUndefined(finalGetSelectedItem.data[0])
                        && !isNullOrUndefined(finalGetSelectedItem.data[0].parentId)) {
                        blazorSelectedItem.parentId = finalGetSelectedItem.data[0].parentId;
                    }
                } else {
                    blazorSelectedItem.data = this.convertItemsToArray(finalGetSelectedItem.data);
                }
            }
            if (!isNullOrUndefined(finalGetSelectedItem.text)) {
                blazorSelectedItem.text = this.convertItemsToArray(finalGetSelectedItem.text);
            }
            if (!isNullOrUndefined(finalGetSelectedItem.index)) {
                blazorSelectedItem.index = this.convertItemsToArray(finalGetSelectedItem.index);
            }
        }
        return blazorSelectedItem;
    }

    // tslint:disable-next-line:no-any
    private convertItemsToArray(items: any): any[] {
        return Array.isArray(items) ? [...items] : [items];
    }
    /**
     * It is used to find out an item details from the current list.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.

     */
    public findItem(obj: Fields | HTMLElement | Element): SelectedItem {
        return <SelectedItem & DataSource>this.getItemData(obj);
    }

    /**
     * A function that used to enable the disabled list items based on passed element.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public enableItem(obj: Fields | HTMLElement | Element): void {
        this.setItemState(obj, true);
        if (this.enableVirtualization) {
            this.virtualizationModule.enableItem(obj);
        }
    }

    /**
     * It is used to disable the list items based on passed element.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public disableItem(obj: Fields | HTMLElement | Element): void {
        this.setItemState(obj, false);
        if (this.enableVirtualization) {
            this.virtualizationModule.disableItem(obj);
        }
    }

    //A function that used to set state of the list item like enable, disable.
    private setItemState(obj: Fields | HTMLElement | Element, isEnable: boolean): void {
        let resultJSON: DataSource = this.getItemData(obj);
        let fieldData: DataSource = <DataSource>getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            let li: Element = this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (isEnable) {
                if (li) { li.classList.remove(classNames.disable); }
                delete resultJSON[this.fields.enabled];
            } else if (!isEnable) {
                if (li) { li.classList.add(classNames.disable); }
                resultJSON[this.fields.enabled] = false;
            }
        }
    }

    /**
     * It is used to show an list item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public showItem(obj: Fields | HTMLElement | Element): void {
        this.showHideItem(obj, false, '');
        if (this.enableVirtualization) {
            this.virtualizationModule.showItem(obj);
        }
    }

    /**
     * It is used to hide an item from the ListView.
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public hideItem(obj: Fields | HTMLElement | Element): void {
        this.showHideItem(obj, true, 'none');
        if (this.enableVirtualization) {
            this.virtualizationModule.hideItem(obj);
        }
    }

    private showHideItem(obj: Fields | HTMLElement | Element, isHide: boolean, display: string): void {
        let resultJSON: DataSource = this.getItemData(obj);
        let fieldData: DataSource = <DataSource>getFieldValues(resultJSON, this.listBaseOption.fields);
        if (resultJSON) {
            let li: HTMLElement = <HTMLElement>this.element.querySelector('[data-uid="' + fieldData[this.fields.id] + '"]');
            if (li) { li.style.display = display; }
            if (isHide) {
                resultJSON[this.fields.isVisible] = false;
            } else {
                delete resultJSON[this.fields.isVisible];
            }
        }
    }

    /**
     * It adds new item(s) to current ListView.
     * To add a new item(s) in the listview, we need to pass `data` as array of items that needs
     * to be added and `fields` as the target item to which we need to add the given item(s) as its children.
     * For example fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {{[key:string]:Object}[]} data - JSON Array Data that need to add.
     * @param  {Fields} fields - Target item to add the given data as its children (can be null).

     */
    public addItem(data: { [key: string]: Object }[], fields: Fields = undefined): void {
        const dataSource: DataSource[] = this.dataSource instanceof DataManager
            ? this.localData : this.dataSource as DataSource[];
        this.addItemInternally(data, fields, dataSource);
    }

    private addItemInternally(data: DataSource[], fields: Fields, dataSource: DataSource[]): void {
        if (data instanceof Array) {
            if (this.enableVirtualization) {
                this.virtualizationModule.addItem(data, fields, dataSource);
            } else {
                const ds: DataSource = <DataSource>this.findItemFromDS(
                    <DataSource[]>dataSource, <DataSource>fields);
                let child: DataSource[];
                if (ds) {
                    const fieldData: DataSource = <DataSource>getFieldValues(ds, this.listBaseOption.fields);
                    child = <DataSource[]>fieldData[this.fields.child];
                    if (!child) {
                        child = [];
                    }
                    child = child.concat(data);
                }
                // check for whether target is nested level or top level in list
                if (ds instanceof Array) {
                    data.forEach((currentItem: DataSource) => {
                        dataSource.push(currentItem);
                        this.setViewDataSource(dataSource);
                        // since it is top level target, get the content container's first child
                        // as it is always the top level UL
                        const targetUL: HTMLElement = this.contentContainer
                            ? <HTMLElement>this.contentContainer.children[0]
                            : null;
                        // check for whether the list was previously empty or not, if it is
                        // proceed to call initial render
                        if (this.contentContainer && targetUL) {
                            this.addItemIntoDom(currentItem, targetUL, this.curViewDS as DataSource[]);
                        } else {
                            this.reRender();
                        }
                    });
                    if (this.curUL) {
                        this.updateBlazorTemplates(true);
                    }
                    this.liCollection = <HTMLElement[] & NodeListOf<Element>>this.curUL.querySelectorAll('.' + classNames.listItem);
                } else {
                    // proceed as target item is in nested level, only if it is a valid target ds
                    if (ds) {
                        ds[this.fields.child] = child;
                        this.addItemInNestedList(ds, data);
                    }
                }
            }
        }
    }

    private addItemInNestedList(targetItemData: DataSource, itemQueue: DataSource[]): void {
        const targetItemId: string = targetItemData[this.fields.id] as string;
        const targetChildDS: DataSource[] = targetItemData[this.fields.child] as DataSource[];
        const isAlreadyRenderedUL: HTMLElement | null = this.element.querySelector('[pid=\'' + targetItemId + '\']');
        const targetLi: HTMLElement | null = this.element.querySelector('[data-uid=\'' + targetItemId + '\']');
        const targetUL: HTMLElement | null = isAlreadyRenderedUL
            ? isAlreadyRenderedUL
            : targetLi
                ? <HTMLElement>closest(targetLi, 'ul')
                : null;
        const targetDS: DataSource[] = isAlreadyRenderedUL ? targetChildDS : [targetItemData];
        const isTargetEmptyChild: boolean = targetLi ? !targetLi.classList.contains(classNames.hasChild) : false;
        let isRefreshTemplateNeeded: boolean = false;
        // if li element is already rendered, that element needs to be refreshed so that
        // it becomes child viewable due to new child items are added now
        if (isTargetEmptyChild) {
            const targetRefreshedElement: HTMLElement[] = ListBase.createListItemFromJson(
                this.createElement, targetDS, this.listBaseOption);
            targetUL.insertBefore(targetRefreshedElement[0], targetLi);
            detach(targetLi);
            isRefreshTemplateNeeded = true;
        }
        // if it is already rendered element, we need to create and append new elements
        if (isAlreadyRenderedUL && itemQueue) {
            itemQueue.forEach((currentItem: DataSource) => {
                targetDS.push(currentItem);
                this.addItemIntoDom(currentItem, targetUL, targetDS);
            });
            isRefreshTemplateNeeded = true;
        }
        if (isRefreshTemplateNeeded) {
            this.updateBlazorTemplates(true);
        }
    }

    private addItemIntoDom(currentItem: DataSource, targetUL: HTMLElement, curViewDS: DataSource[]): void {
        let index: number = curViewDS.indexOf(currentItem);
        this.addListItem(currentItem, index, targetUL, curViewDS);
        let curItemDS: DataSource = curViewDS[index - 1];
        if (curItemDS && curItemDS.isHeader && (curItemDS.items as DataSource[]).length === 1) {
            this.addListItem(curItemDS, (index - 1), targetUL, curViewDS);
        }
    }

    private addListItem(dataSource: DataSource, index: number, ulElement: HTMLElement, curViewDS: DataSource[]): void {
        let target: HTMLElement = this.getLiFromObjOrElement((curViewDS as DataSource[])[index + 1]) ||
            this.getLiFromObjOrElement((curViewDS as DataSource[])[index + 2]) || null;
        let li: HTMLElement[] = ListBase.createListItemFromJson(this.createElement, [dataSource], this.listBaseOption);
        ulElement.insertBefore(li[0], target);
    }

    /**
     * A function that removes the item from data source based on passed element like fields: { text: 'Name', tooltip: 'Name', id:'id'}
     * @param  {Fields | HTMLElement | Element} obj - We can pass element Object or Fields as Object with ID and Text fields.
     */
    public removeItem(obj: Fields | HTMLElement | Element): void {
        const listDataSource: DataSource[] = this.dataSource instanceof DataManager
            ? this.localData : this.dataSource as DataSource[];
        if (this.enableVirtualization) {
            this.virtualizationModule.removeItem(obj);
        } else {
            this.removeItemFromList(obj, listDataSource);
            this.updateBlazorTemplates(true);
        }
    }

    private removeItemFromList(obj: Fields | Element | HTMLElement, listDataSource: DataSource[]): void {
        const curViewDS: DataSource[] = this.curViewDS as DataSource[];
        let fields: Fields = obj instanceof Element ? this.getElementUID(obj) : obj;
        let dataSource: DataSource[] | DataSource;
        dataSource = this.findItemFromDS(listDataSource, <DataSource>fields, true);
        if (dataSource) {
            let data: DataSource | DataSource[];
            data = this.findItemFromDS(dataSource as DataSource[], <DataSource>fields);
            let index: number = curViewDS.indexOf(data as DataSource);
            let li: HTMLElement = this.getLiFromObjOrElement(obj);
            let groupLi: HTMLElement;
            this.validateNestedView(li);
            if (this.fields.groupBy && this.curViewDS[index - 1] &&
                curViewDS[index - 1].isHeader &&
                (curViewDS[index - 1].items as DataSource[]).length === 1) {
                if (li && (li.previousElementSibling as HTMLElement).classList.contains(classNames.groupListItem) &&
                    (isNullOrUndefined(li.nextElementSibling) || (li.nextElementSibling &&
                        (li.nextElementSibling as HTMLElement).classList.contains(classNames.groupListItem)))) {
                    groupLi = li.previousElementSibling as HTMLElement;
                }
            }
            if (li) {
                detach(li);
            }
            if (groupLi) {
                detach(groupLi);
            }
            // tslint:disable-next-line:no-any
            const foundData: any = ((<DataSource[]>dataSource).length - 1) <= 0
                ? this.findParent(
                    this.localData,
                    this.fields.id,
                    (value: string) => value === (data as DataSource)[this.fields.id],
                    null) : null;
            let dsIndex: number = (dataSource as DataSource[]).indexOf(data as DataSource);
            (dataSource as DataSource[]).splice(dsIndex, 1);
            this.setViewDataSource(listDataSource);
            if (foundData
                && foundData.parent
                && Array.isArray(foundData.parent[this.fields.child])
                && foundData.parent[this.fields.child].length <= 0) {
                const parentLi: HTMLElement | null = this.getLiFromObjOrElement(foundData.parent);
                if (parentLi) {
                    let li: HTMLElement[] = ListBase.createListItemFromJson(
                        this.createElement,
                        [foundData.parent],
                        this.listBaseOption);
                    parentLi.parentElement.insertBefore(li[0], parentLi);
                    parentLi.parentElement.removeChild(parentLi);
                }
            }
            if (dataSource.length <= 0) {
                this.back();
            }
            this.liCollection = Array.prototype.slice.call(this.element.querySelectorAll('.' + classNames.listItem));
        }
    }

    // validate before removing an element whether the current view is inside target element's child view
    private validateNestedView(li: HTMLElement | null): void {
        const liID: string = li ? li.getAttribute('data-uid').toString().toLowerCase() : null;
        if (liID && this.curDSLevel && this.curDSLevel.length > 0) {
            while (this.curDSLevel.some((id: string) => id.toString().toLowerCase() === liID)) {
                this.back();
            }
        }
    }

    /**
     * A function that removes multiple item from list view based on given input.
     * @param  {Fields[] | HTMLElement[] | Element[]} obj - We can pass array of elements or array of field Object with ID and Text fields.
     */
    public removeMultipleItems(obj: HTMLElement[] | Element[] | Fields[]): void {
        if (obj.length) {
            for (let i: number = 0; i < obj.length; i++) {
                this.removeItem(obj[i]);
            }
            this.updateBlazorTemplates(true);
        }
    }

    // tslint:disable-next-line:no-any
    private findParent(dataSource: any, id: string, callback: Function, parent: object): object {
        if (dataSource.hasOwnProperty(id) && callback(dataSource[id]) === true) {
            return extend({}, dataSource);
        }

        for (let i: number = 0; i < Object.keys(dataSource).length; i++) {
            if (dataSource[Object.keys(dataSource)[i]]
                && typeof dataSource[Object.keys(dataSource)[i]] === 'object') {
                // tslint:disable-next-line:no-any
                let result: any = this.findParent(dataSource[Object.keys(dataSource)[i]], id, callback, dataSource);
                if (result != null) {
                    if (!result.parent) { result.parent = parent; }
                    return result;
                }
            }
        }
        return null;
    }

    // Module Required function
    protected getModuleName(): string {
        return 'listview';
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.enableVirtualization) {
            modules.push({ args: [this], member: 'virtualization' });
        }

        return modules;
    }


    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['cssClass', 'enableRtl', 'htmlAttributes',
            'enable', 'fields', 'animation', 'headerTitle',
            'sortOrder', 'showIcon', 'height', 'width', 'showCheckBox', 'checkBoxPosition']);
    }

}

interface ResultData {
    result: { [key: string]: Object }[];
}

export interface ClassNames {
    root: string;
    hover: string;
    focused: string;
    selected: string;
    parentItem: string;
    listItem: string;
    hasChild: string;
    view: string;
    header: string;
    text: string;
    headerText: string;
    headerTemplateText: string;
    listItemText: string;
    listIcon: string;
    textContent: string;
    groupListItem: string;
    disable: string;
    content: string;
    backIcon: string;
    icon: string;
    checkboxWrapper: string;
    checkbox: string;
    checked: string;
    checkboxIcon: string;
    checklist: string;
    checkboxRight: string;
    checkboxLeft: string;
    listviewCheckbox: string;
    itemCheckList: string;
}

export interface ListSelectedItem {
    /**
     * Selected Item dataSource collection.


     */
    data?: object[];
    /**
     * Selected Item text collection.
     */
    text?: string[];
    /**
     * Index of the selected element.
     * Available only in virtualization.
     */
    index?: number[];
    /**
     * Hierarchical Parent Id collection of the current view.
     * Available only in nested list with Checkbox enabled.
     */
    parentId?: string[];
}

export interface SelectedItem {
    /**
     * It denotes the Selected Item text.
     */
    text: string;

    /**
     * It denotes the Selected Item list element.

     */
    item: HTMLElement | Element;

    /**
     * It denotes the Selected Item dataSource JSON object.

     */
    data: { [key: string]: Object } | string[] | number[];

}

export interface SelectedCollection {
    /**
     * It denotes the Selected Item text data or collection.
     */
    text: string | string[];

    /**
     * It denotes the Selected Item list element or element collection.
     */
    item: HTMLElement | Element[] | NodeList;

    /**
     * It denotes the Selected Item dataSource JSON object or object collection.

     */
    data: { [key: string]: Object } | { [key: string]: Object }[] | string[] | number[];
}

export interface UISelectedItem {
    /**
     * It denotes the Selected Item text data or collection.
     */
    text: string | number | string[] | number[];

    /**
     * It denotes the Selected Item list element or element collection.
     */
    item?: HTMLElement | Element[] | NodeList;

    /**
     * It denotes the Selected Item dataSource JSON object or object collection.

     */
    data: { [key: string]: Object } | { [key: string]: Object }[] | string | number | string[] | number[];
    /**
     * It is used to denote the index of the selected element.
     */
    index?: number | number[];
    /**
     * It is used to check whether the element is checked or not.
     */
    isChecked?: boolean;
}

export interface DataAndParent {
    /**
     * It denotes the Selected Item dataSource JSON object or object collection.

     */
    data: { [key: string]: Object } | { [key: string]: Object }[] | string[];
    /**
     * It denotes the Selected Item's parent id;
     */
    parentId: string[];
}

export interface NestedListData {
    /**
     * It denotes the Selected Item text data or collection.
     */
    text: string | string[];
    /**
     * It denotes the Selected Item list element or element collection.
     */
    item: HTMLElement | Element[] | NodeList;
    /**
     * It denotes the Selected Item dataSource JSON object with it's parent ID.
     */
    data: DataAndParent[];
}

export interface SelectEventArgs extends BaseEventArgs, SelectedItem {
    /**
     * Specifies that event has triggered by user interaction.
     */
    isInteracted: boolean;
    /**
     * Specifies that event argument when event raised by other event.
     */
    event: MouseEvent | KeyboardEvent;
    /**
     * It is used to denote the index of the selected element.
     */
    index: number;
    /**
     * It is used to check whether the element is checked or not.
     */
    isChecked?: boolean;
}
export interface ItemCreatedArgs {
    curData: { [key: string]: Object };
    dataSource: { [key: string]: Object } | string[];
    fields: FieldsMapping;
    item: HTMLElement;
    options: ListBaseOptions;
    text: string;
}

interface DataSource {
    [key: string]: Object;
}
