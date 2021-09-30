import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined } from '@syncfusion/ej2-base';import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';import { EventHandler, detach, EmitType, Event, addClass, getElement } from '@syncfusion/ej2-base';import { ChipModel } from './chip';
import {Selection,ClickEventArgs,DeleteEventArgs} from "./chip-list";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ChipList
 */
export interface ChipListModel extends ComponentModel{

    /**
     * This chips property helps to render ChipList component.
     * {% codeBlock src='chips/chips/index.md' %}{% endcodeBlock %}
     *
     * @default []
     *
     */
    chips?: string[] | number[] | ChipModel[];

    /**
     * Specifies the text content for the chip.
     * {% codeBlock src='chips/text/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * {% codeBlock src='chips/avatarText/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    avatarText?: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * {% codeBlock src='chips/avatarIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     * {% codeBlock src='chips/leadingIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * {% codeBlock src='chips/trailingIconCss/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * Specifies the trailing icon url for the chip.
     *
     * @default ''
     */
    leadingIconUrl?: string;

    /**
     * Specifies the trailing icon url for the chip.
     *
     * @default ''
     */
    trailingIconUrl?: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * {% codeBlock src='chips/cssClass/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Sets or gets the selected chip items in the chip list.
     * {% codeBlock src='chips/selectedChips/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    selectedChips?: string[] | number[] | number;

    /**
     * Defines the selection type of the chip. The available types are:
     *   1. Input chip
     *   2. Choice chip
     *   3. Filter chip
     *   4. Action chip
     *
     * @default 'None'
     */
    selection?: Selection;

    /**
     * Enables or disables the delete functionality of a chip.
     * {% codeBlock src='chips/enableDelete/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableDelete?: boolean;

    /**
     * Triggers when the component is created successfully.
     * {% codeBlock src='chips/created/index.md' %}{% endcodeBlock %}
     *
     * @event
     */
    created?: EmitType<Event>;

    /**
     * Triggers when a chip is clicked.
     * {% codeBlock src='chips/click/index.md' %}{% endcodeBlock %}
     *
     * @event
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the click event of the chip is fired.
     * This event can be used to prevent the further process and restrict the click action over a chip.
     *
     * {% codeBlock src='chips/beforeClick/index.md' %}{% endcodeBlock %}
     *
     * @event
     */
    beforeClick?: EmitType<ClickEventArgs>;

    /**
     * Fires before removing the chip element.
     * {% codeBlock src='chips/delete/index.md' %}{% endcodeBlock %}
     *
     * @event
     */
    delete?: EmitType<DeleteEventArgs>;

}