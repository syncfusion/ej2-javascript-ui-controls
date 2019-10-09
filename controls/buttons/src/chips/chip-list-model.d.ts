import { Component, NotifyPropertyChanges, INotifyPropertyChanged, Property, append, isNullOrUndefined } from '@syncfusion/ej2-base';import { removeClass, KeyboardEventArgs, rippleEffect, closest, MouseEventArgs } from '@syncfusion/ej2-base';import { EventHandler, detach, EmitType, Event, addClass } from '@syncfusion/ej2-base';import { ChipModel } from './chip';
import {Selection,ClickEventArgs,DeleteEventArgs} from "./chip-list";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ChipList
 */
export interface ChipListModel extends ComponentModel{

    /**
     * This chips property helps to render ChipList component.
     * @default []
     */
    chips?: string[] | number[] | ChipModel[];

    /**
     * This text property helps to render Chip component.
     * @default ''
     */
    text?: string;

    /**
     * This avatarText property helps to customize avatar content.
     * @default ''
     */
    avatarText?: string;

    /**
     * This avatarIconCss property helps to customize avatar element.
     * @default ''
     */
    avatarIconCss?: string;

    /**
     * This leadingIconCss property helps to customize leading icon element.
     * @default ''
     */
    leadingIconCss?: string;

    /**
     * This trailingIconCss property helps to customize trailing icon element.
     * @default ''
     */
    trailingIconCss?: string;

    /**
     * This cssClass property helps to customize ChipList component.
     * @default ''
     */
    cssClass?: string;

    /**
     * This enabled property helps to enable/disable ChipList component.
     * @default true
     */
    enabled?: boolean;

    /**
     * This selectedChips property helps to select chip items.
     * @default []
     */
    selectedChips?: number[] | number;

    /**
     * This selection property enables chip selection type.
     * @default 'None'
     */
    selection?: Selection;

    /**
     * This enableDelete property helps to enable delete functionality.
     * @default false
     */
    enableDelete?: boolean;

    /**
     * This created event will get triggered once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * This click event will get triggered once the chip is clicked.
     * @event
     * @blazorProperty 'OnClick'
     */
    click?: EmitType<ClickEventArgs>;

    /**
     * This delete event will get triggered before removing the chip.
     * @event
     * @blazorProperty 'OnDelete'
     */
    delete?: EmitType<DeleteEventArgs>;

}