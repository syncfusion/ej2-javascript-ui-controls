import { Virtualization } from './virtualization';import { merge, formatUnit, isNullOrUndefined, classList, append, detach, ModuleDeclaration } from '@syncfusion/ej2-base';import { attributes, addClass, removeClass, prepend, closest, remove } from '@syncfusion/ej2-base';import { Component, EventHandler, BaseEventArgs, Property, Complex, Event } from '@syncfusion/ej2-base';import { NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty } from '@syncfusion/ej2-base';import { KeyboardEventArgs, EmitType, compile } from '@syncfusion/ej2-base';import { Animation, AnimationOptions, Effect, rippleEffect, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { createCheckBox } from '@syncfusion/ej2-buttons';import { ListBase, ListBaseOptions, SortOrder, getFieldValues, FieldsMapping } from '../common/list-base';
import {AnimationSettings,checkBoxPosition,SelectEventArgs} from "./list-view";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * ID attribute of specific list-item.
     */
    id?: string;

    /**
     * It is used to map the text value of list item from the dataSource.
     */
    text?: string;

    /**
     * This property used to check whether the list item is in checked state or not.
     */
    isChecked?: string;

    /**
     * To check whether the visibility state of list item.
     */
    isVisible?: string;

    /**
     * It is used to enable the list item
     */
    enabled?: string;

    /**
     * It is used to customize the icon to the list items dynamically.
     *  We can add specific image to the icons using iconCss property.
     */
    iconCss?: string;

    /**
     * This property used for nested navigation of list-items.
     * Refer the documentation [here](./nested-list.html)
     *  to know more about this property with demo.
     */
    child?: string;

    /**
     * It is used to display `tooltip content of text` while hovering on list items.
     */
    tooltip?: string;

    /**
     * It wraps the list view element into a group based on the value of groupBy property.
     * Refer the documentation [here](./grouping.html)
     *  to know more about this property with demo.
     */
    groupBy?: string;

    /**
     * It is used to enable the sorting of list items to be ascending or descending.
     */
    sortBy?: string;

    /**
     * Defines the HTML attributes such as id, class, etc,. for the specific list item.
     */
    htmlAttributes?: string;

    /**
     * It is used to fetch a specified named table data while using serviceUrl of DataManager
     *  in dataSource property.
     * Refer the documentation [here](https://ej2.syncfusion.com/documentation/data/getting-started.html?lang=typescript)
     *  to know more about this property with demo.
     */
    tableName?: string;

}

/**
 * Interface for a class ListView
 */
export interface ListViewModel extends ComponentModel{

    /**
     * This cssClass property helps to use custom skinning option for ListView component,
     *  by adding the mentioned class name into root element of ListView.
     * @default ''
     */
    cssClass?: string;

    /**
     * It enables UI virtualization which will increase ListView performance on loading large number of data.
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Defines the HTML attributes such as id, class, etc., for the ListView.
     * @default {}
     */
    htmlAttributes?: { [key: string]: string; };

    /**
     * It specifies enabled state of ListView component.
     * @default true
     */
    enable?: boolean;

    /**
     * It provides the data to render the ListView component which is mapped
     *  with the fields of ListView.
     *
     * {% codeBlock src="list-view/datasource-api/index.ts" %}{% endcodeBlock %}
     * @default []
     */
    dataSource?: { [key: string]: Object }[] | string[] | number[] | DataManager;

    /**
     * It is used to fetch the specific data from dataSource by using where, select key words.
     * Refer the documentation [here]
     * (./data-binding.html#bind-to-remote-data)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="list-view/query-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    query?: Query;

    /**
     * It is used to map keys from the dataSource which extracts the appropriate data from the dataSource
     *  with specified mapped with the column fields to render the ListView.
     *
     * {% codeBlock src="list-view/fields-api/index.ts" %}{% endcodeBlock %}
     * @default ListBase.defaultMappedFields
     */
    fields?: FieldSettingsModel;

    /**
     * It is used to apply the animation to sub list navigation of list items.
     * @default { effect: 'SlideLeft', duration: 400, easing: 'ease' }
     */
    animation?: AnimationSettings;

    /**
     * It is used to enable the sorting of list items to be ascending or descending.
     *
     * {% codeBlock src="list-view/sortorder-api/index.ts" %}{% endcodeBlock %}
     * @default 'None'
     */
    sortOrder?: SortOrder;

    /**
     * Using this property, we can show or hide the icon of list item.
     *
     * {% codeBlock src="list-view/showicon-api/index.ts" %}{% endcodeBlock %}
     * @default false
     */
    showIcon?: boolean;

    /**
     * Using this property, we can show or hide the `checkbox`.
     *
     * {% codeBlock src="list-view/showcheckbox-api/index.ts" %}{% endcodeBlock %}
     * @default false
     */
    showCheckBox?: boolean;

    /**
     * It is used to set the position of check box in an item.
     * @default 'Left'
     */
    checkBoxPosition?: checkBoxPosition;

    /**
     * It is used to set the title of ListView component.
     *
     * {% codeBlock src="list-view/fields-api/index.ts" %}{% endcodeBlock %}
     * @default ""
     */
    headerTitle?: string;

    /**
     * Using this property, we can show or hide the header of ListView component.
     *
     * {% codeBlock src="list-view/fields-api/index.ts" %}{% endcodeBlock %}
     * @default false
     */
    showHeader?: boolean;

    /**
     * It is used to set the height of the ListView component.
     * @default ''
     */
    height?: number | string;

    /**
     * It sets the width to the ListView component.
     * @default ''
     */
    width?: number | string;

    /**
     * The ListView supports to customize the content of each list items with the help of template property.
     * Refer the documentation [here](./customizing-templates.html)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="list-view/template-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    template?: string;

    /**
     * The ListView has an option to custom design the ListView header title with the help of headerTemplate property.
     * Refer the documentation [here]
     * (./customizing-templates.html#header-template)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="list-view/headertemplate-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    headerTemplate?: string;

    /**
     * The ListView has an option to custom design the group header title with the help of groupTemplate property.
     * Refer the documentation [here]
     * (./customizing-templates.html#group-template)
     *  to know more about this property with demo.
     *
     * {% codeBlock src="list-view/grouptemplate-api/index.ts" %}{% endcodeBlock %}
     * @default null
     */
    groupTemplate?: string;

    /**
     * We can trigger the `select` event when we select the list item in the component.
     * @event
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * We can trigger `actionBegin` event before every ListView action starts.
     * @event
     */
    actionBegin?: EmitType<Object>;

    /**
     * We can trigger `actionComplete` event for every ListView action success event
     *  with the dataSource parameter.
     * @event
     */
    actionComplete?: EmitType<Object>;

    /**
     * We can trigger `actionFailure` event for every ListView action failure event
     *  with the dataSource parameter.
     * @event
     */
    actionFailure?: EmitType<Object>;

}