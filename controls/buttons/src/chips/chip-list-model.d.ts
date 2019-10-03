import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined } from '@syncfusion/ej2-base';import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';import { EventHandler, detach, EmitType, Event, addClass } from '@syncfusion/ej2-base';import { ChipModel } from './chip';
import {Selection,ClickEventArgs,DeleteEventArgs} from "./chip-list";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ChipList
 */
export interface ChipListModel extends ComponentModel{

    /**
     * This chips property helps to render ChipList component.

     */
    chips?: string[] | number[] | ChipModel[];

    /**
     * This text property helps to render Chip component.

     */
    text?: string;

    /**
     * This avatarText property helps to customize avatar content.

     */
    avatarText?: string;

    /**
     * This avatarIconCss property helps to customize avatar element.

     */
    avatarIconCss?: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.

     */
    leadingIconCss?: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.

     */
    trailingIconCss?: string;

    /**
     * This cssClass property helps to customize ChipList component.

     */
    cssClass?: string;

    /**
     * This enabled property helps to enable/disable ChipList component.

     */
    enabled?: boolean;

    /**
     * This selectedChips property helps to select chip items.

     */
    selectedChips?: number[] | number;

    /**
     * This selection property enables chip selection type.

     */
    selection?: Selection;

    /**
     * This enableDelete property helps to enable delete functionality.

     */
    enableDelete?: boolean;

    /**
     * This created event will get triggered once the component rendering is completed.
     * @event

     */
    created?: EmitType<Event>;

    /**
     * This click event will get triggered once the chip is clicked.
     * @event

     */
    click?: EmitType<ClickEventArgs>;

    /**
     * This delete event will get triggered before removing the chip.
     * @event

     */
    delete?: EmitType<DeleteEventArgs>;

}