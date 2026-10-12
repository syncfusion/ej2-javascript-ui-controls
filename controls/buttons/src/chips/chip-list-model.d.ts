import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined, remove } from '@syncfusion/ej2-base';import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';import { Draggable, DragEventArgs } from '@syncfusion/ej2-base';import { EventHandler, detach, EmitType, Event, addClass, compile} from '@syncfusion/ej2-base';import { ChipModel } from './chip';
import {Selection,ClickEventArgs,DeleteEventArgs,ChipDeletedEventArgs,DragAndDropEventArgs} from "./chip-list";
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
     * Allows additional HTML attributes such as aria labels, title, name, etc., and
     * accepts n number of attributes in a key-value pair format.
     * {% codeBlock src='chiplist/htmlAttributes/index.md' %}{% endcodeBlock %}
     *
     * @default {}
     */
    htmlAttributes?: { [key: string]: string };

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
     * Specifies the leading icon url for the chip.
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
     * Specifies a boolean value that indicates whether the chip item can be dragged and reordered.
     * This enables drag-and-drop functionality within a single container or across multiple containers of chips when dragging is enabled.
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Specifies the target in which the draggable element can be moved and dropped.
     * By default, the draggable element movement occurs in the page.
     *
     * @default null
     */
    dragArea?: HTMLElement | string;

    /**
     * Triggers when the component is created successfully.
     * {% codeBlock src='chips/created/index.md' %}{% endcodeBlock %}
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * Triggers when a chip is clicked.
     * {% codeBlock src='chips/click/index.md' %}{% endcodeBlock %}
     *
     * @event click
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the click event of the chip is fired.
     * This event can be used to prevent the further process and restrict the click action over a chip.
     *
     * {% codeBlock src='chips/beforeClick/index.md' %}{% endcodeBlock %}
     *
     * @event beforeClick
     */
    beforeClick?: EmitType<ClickEventArgs>;

    /**
     * Fires before removing the chip element.
     * {% codeBlock src='chips/delete/index.md' %}{% endcodeBlock %}
     *
     * @event delete
     */
    delete?: EmitType<DeleteEventArgs>;

    /**
     * Triggers when the chip item is removed.
     * {% codeBlock src='chips/deleted/index.md' %}{% endcodeBlock %}
     *
     * @event deleted
     */
    deleted?: EmitType<ChipDeletedEventArgs>;

    /**
     * Fires when a chip item starts moving due to a drag action.
     *
     * @event dragStart
     */
    dragStart?: EmitType<DragAndDropEventArgs>;

    /**
     * Fires while a chip item is being dragged.
     *
     * @event dragging
     */
    dragging?: EmitType<DragAndDropEventArgs>;

    /**
     * Fires when a chip item is reordered after completing a drag action.
     *
     * @event dragStop
     */
    dragStop?: EmitType<DragAndDropEventArgs>;

}