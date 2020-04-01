import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined } from '@syncfusion/ej2-base';import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';import { EventHandler, detach, EmitType, Event, addClass, isBlazor, getElement } from '@syncfusion/ej2-base';import { ChipModel } from './chip';
import {Selection,ClickEventArgs,DeleteEventArgs} from "./chip-list";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ChipList
 */
export interface ChipListModel extends ComponentModel{

    /**
     * This chips property helps to render ChipList component.
     * @default []
     * @blazorType List<ChipListChip>
     */
    chips?: string[] | number[] | ChipModel[];

    /**
     * Specifies the text content for the chip.
     * @default ''
     */
    text?: string;

    /**
     * Specifies the customized text value for the avatar in the chip.
     * @default ''
     */
    avatarText?: string;

    /**
     * Specifies the icon CSS class for the avatar in the chip.
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * Specifies the leading icon CSS class for the chip.
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * Specifies the trailing icon CSS class for the chip.
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * Specifies the custom classes to be added to the chip element used to customize the ChipList component.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies a value that indicates whether the chip component is enabled or not.
     * @default true
     * @blazorDefaultValue null
     * @blazorType bool?
     */
    enabled?: boolean;

    /**
     * Sets or gets the selected chip items in the chip list.
     * @default []
     */
    selectedChips?: string[] | number[] | number;

    /**
     * Defines the selection type of the chip. The available types are:
     *   1. Input chip
     *   2. Choice chip
     *   3. Filter chip
     *   4. Action chip
     * @default 'None'
     */
    selection?: Selection;

    /**
     * Enables or disables the delete functionality of a chip.
     * @default false
     */
    enableDelete?: boolean;

    /**
     * Triggers when the component is created successfully.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Triggers when a chip is clicked.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the click event of the chip is fired. 
     * This event can be used to prevent the further process and restrict the click action over a chip.
     * @event
     * @blazorProperty 'OnBeforeClick'
     */
    beforeClick?: EmitType<ClickEventArgs>;

    /**
     * Fires before removing the chip element.
     * @event
     * @blazorProperty 'OnDelete'
     */
    delete?: EmitType<DeleteEventArgs>;

}