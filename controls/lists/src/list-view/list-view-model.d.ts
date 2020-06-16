import { Virtualization } from './virtualization';import { merge, formatUnit, isNullOrUndefined, append, detach, ModuleDeclaration, isBlazor, extend } from '@syncfusion/ej2-base';import { attributes, addClass, removeClass, prepend, closest, remove } from '@syncfusion/ej2-base';import { Component, EventHandler, BaseEventArgs, Property, Complex, Event } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';import { KeyboardEventArgs, EmitType, compile, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { Animation, AnimationOptions, Effect, rippleEffect, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { createCheckBox } from '@syncfusion/ej2-buttons';import { ListBase, ListBaseOptions, SortOrder, getFieldValues, FieldsMapping } from '../common/list-base';import { updateBlazorTemplate, resetBlazorTemplate, blazorTemplates } from '@syncfusion/ej2-base';
import {AnimationSettings,checkBoxPosition,SelectEventArgs} from "./list-view";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies the id field mapped in dataSource.
     */
    id?: string;

    /**
     * The `text` property is used to map the text value from the data source for each list item.
     */
    text?: string;

    /**
     * The `isChecked` property is used to check whether the list items are in checked state or not.
     */
    isChecked?: string;

    /**
     * The `isVisible` property is used to check whether the list items are in visible state or not.
     */
    isVisible?: string;

    /**
     * Specifies the enabled state of the ListView component. 
     * And, we can disable the component using this property by setting its value as false.
     */
    enabled?: string;

    /**
     * The `iconCss` is used to customize the icon to the list items dynamically. 
     *  We can add a specific image to the icons using `iconCss` property.
     */
    iconCss?: string;

    /**
     * The `child` property is used for nested navigation of listed items.
     */
    child?: string;

    /**
     * The `tooltip` is used to display the information about the target element while hovering on list items.
     */
    tooltip?: string;

    /**
     * The `groupBy` property is used to wraps the ListView elements into a group.
     */
    groupBy?: string;

    /**
     * The `sortBy` property used to enable the sorting of list items to be ascending or descending order.
     */
    sortBy?: string;

    /**
     * The `htmlAttributes` allows additional attributes such as id, class, etc., and 
     *  accepts n number of attributes in a key-value pair format.
     */
    htmlAttributes?: string;

    /**
     * Specifies the `tableName` used to fetch data from a specific table in the server.
     */
    tableName?: string;

}

/**
 * Interface for a class ListView
 */
export interface ListViewModel extends ComponentModel{

    /**
     * The `cssClass` property is used to add a user-preferred class name in the root element of the ListView, 
     *  using which we can customize the component (both CSS and functionality customization)
     *   
     * {% codeBlock src='listview/cssClass/index.md' %}{% endcodeBlock %}   
     * 
     * @default ''
     */
    cssClass?: string;

    /**
     * If `enableVirtualization` set to true, which will increase the ListView performance, while loading a large amount of data.
     *
     * {% codeBlock src='listview/enableVirtualization/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * The `htmlAttributes` allows additional attributes such as id, class, etc., and 
     *  accepts n number of attributes in a key-value pair format.
     *      
     * {% codeBlock src='listview/htmlAttributes/index.md' %}{% endcodeBlock %}
     * 
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * If `enable` set to true, the list items are enabled. 
     * And, we can disable the component using this property by setting its value as false.
     *      
     * {% codeBlock src='listview/enable/index.md' %}{% endcodeBlock %}
     * 
     * @default true
     */
    enable?: boolean;

    /**
     * The `dataSource` provides the data to render the ListView component which is mapped with the fields of ListView.
     * @isGenericType true
     * 
     * {% codeBlock src='listview/dataSource/index.md' %}{% endcodeBlock %}
     *      
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | string[] | number[] | DataManager;

    /**
     * The `query` is used to fetch the specific data from dataSource by using where and select keywords.
     *     
     * {% codeBlock src='listview/query/index.md' %}{% endcodeBlock %}
     * 
     * @default null
     * @blazorType Data.Query
     */
    query?: Query;

    /**
     * The `fields` is used to map keys from the dataSource which extracts the appropriate data from the dataSource
     *  with specified mapped with the column fields to render the ListView.
     *     
     * {% codeBlock src='listview/fields/index.md' %}{% endcodeBlock %}
     * 
     * @default ListBase.defaultMappedFields
     */
    fields?: FieldSettingsModel;

    /**
     * The `animation` property provides an option to apply the different 
     *  animations on the ListView component.
     * 
     * {% codeBlock src='listview/animation/index.md' %}{% endcodeBlock %}
     *      
     * @default { effect: 'SlideLeft', duration: 400, easing: 'ease' }
     */
    animation?: AnimationSettings;

    /**
     * The `sortOrder` is used to sort the data source. The available type of sort orders are,
     * * `None` - The data source is not sorting.
     * * `Ascending` - The data source is sorting with ascending order.
     * * `Descending` - The data source is sorting with descending order.
     *     
     * {% codeBlock src='listview/sortOrder/index.md' %}{% endcodeBlock %}
     * 
     * @default 'None'
     */
    sortOrder?: SortOrder;

    /**
     * If `showIcon` set to true, which will show or hide the icon of the list item.
     *     
     * {% codeBlock src='listview/showIcon/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    showIcon?: boolean;

    /**
     * If `showCheckBox` set to true, which will show or hide the checkbox.
     * 
     * {% codeBlock src='listview/showCheckBox/index.md' %}{% endcodeBlock %}
     *     
     * @default false
     */
    showCheckBox?: boolean;

    /**
     * The `checkBoxPosition` is used to set the position of check box in a list item.
     * By default, the `checkBoxPosition` is Left, which will appear before the text content in a list item.
     *      
     * {% codeBlock src='listview/checkBoxPosition/index.md' %}{% endcodeBlock %}
     * 
     * @default 'Left'
     */
    checkBoxPosition?: checkBoxPosition;

    /**
     * The `headerTitle` is used to set the title of the ListView component.
     *  
     * {% codeBlock src='listview/headerTitle/index.md' %}{% endcodeBlock %}
     *    
     * @default ""
     */
    headerTitle?: string;

    /**
     * If `showHeader` set to true, which will show or hide the header of the ListView component.
     *     
     * {% codeBlock src='listview/showHeader/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    showHeader?: boolean;

    /**
     * If `enableHtmlSanitizer` set to true, allows the cross-scripting site.
     *      
     * {% codeBlock src='listview/enableHtmlSanitizer/index.md' %}{% endcodeBlock %}
     * 
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Defines the height of the ListView component which accepts both string and number values.
     *      
     * {% codeBlock src='listview/height/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     */
    height?: number | string;

    /**
     * Defines the width of the ListView component which accepts both string and number values.
     *      
     * {% codeBlock src='listview/width/index.md' %}{% endcodeBlock %}
     * 
     * @default ''
     */
    width?: number | string;

    /**
     * The ListView component supports to customize the content of each list items with the help of `template` property.
     *     
     * {% codeBlock src='listview/template/index.md' %}{% endcodeBlock %}
     * 
     * @default null
     * @deprecated
     */
    template?: string;

    /**
     * The ListView has an option to custom design the ListView header title with the help of `headerTemplate` property.
     *     
     * {% codeBlock src="listview/headerTemplate/index.md" %}{% endcodeBlock %}
     * 
     * @default null
     * @deprecated
     */
    headerTemplate?: string;

    /**
     * The ListView has an option to custom design the group header title with the help of `groupTemplate` property.
     *     
     * {% codeBlock src="listview/groupTemplate/index.md" %}{% endcodeBlock %}
     * 
     * @default null
     * @deprecated
     */
    groupTemplate?: string;

    /**
     * Triggers when we select the list item in the component.
     * @event
     * @blazorProperty 'Selected'
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers when every ListView action starts.
     * @event
     * @blazorProperty 'OnActionBegin'
     */
    actionBegin?: EmitType<Object>;

    /**
     * Triggers when every ListView actions completed.
     * @event
     * @blazorProperty 'OnActionComplete'
     */
    actionComplete?: EmitType<Object>;

    /**
     * Triggers, when the data fetch request from the remote server, fails.
     * @event
     * @blazorProperty 'OnActionFailure'
     */
    actionFailure?: EmitType<Object>;

}