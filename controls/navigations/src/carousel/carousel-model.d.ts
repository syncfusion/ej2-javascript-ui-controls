import { Component, EventHandler, Collection, Property, Event, EmitType, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges, Browser } from '@syncfusion/ej2-base';import { ChildProperty, addClass, removeClass, setStyleAttribute, attributes, getUniqueID, compile, getInstance, L10n } from '@syncfusion/ej2-base';import { append, closest, isNullOrUndefined, remove, classList, Touch, SwipeEventArgs, KeyboardEvents, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';import { Button } from '@syncfusion/ej2-buttons';
import {CarouselAnimationEffect,CarouselIndicatorsType,CarouselButtonVisibility,CarouselSwipeMode,SlideChangingEventArgs,SlideChangedEventArgs} from "./carousel";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CarouselItem
 */
export interface CarouselItemModel {

    /**
     * Accepts single/multiple classes (separated by a space) to be used for individual carousel item customization.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Accepts the interval duration in milliseconds for individual carousel item transition.
     *
     * @default null
     */
    interval?: number;

    /**
     * Accepts the template for individual carousel item.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Accepts HTML attributes/custom attributes to add in individual carousel item.
     *
     * @default null
     */
    htmlAttributes?: Record<string, string>;

}

/**
 * Interface for a class Carousel
 */
export interface CarouselModel extends ComponentModel{

    /**
     * Allows defining the collection of carousel item to be displayed on the Carousel.
     *
     * @default []
     */
    items?: CarouselItemModel[];

    /**
     * Specifies the type of animation effects. The possible values for this property as follows
     * * `None`: The carousel item transition happens without animation.
     * * `Slide`: The carousel item transition happens with slide animation.
     * * `Fade`: The Carousel item transition happens with fade animation.
     * * `Custom`: The Carousel item transition happens with custom animation.
     *
     *  @default 'Slide'
     */
    animationEffect?: CarouselAnimationEffect;

    /**
     * Accepts the template for previous navigation button.
     *
     * @default null
     * @aspType string
     */
    previousButtonTemplate?: string | Function;

    /**
     * Accepts the template for next navigation button.
     *
     * @default null
     * @aspType string
     */
    nextButtonTemplate?: string | Function;

    /**
     * Accepts the template for indicator buttons.
     *
     * @default null
     * @aspType string
     */
    indicatorsTemplate?: string | Function;

    /**
     * Accepts the template for play/pause button.
     *
     * @default null
     * @aspType string
     */
    playButtonTemplate?: string | Function;

    /**
     * Accepts single/multiple classes (separated by a space) to be used for carousel customization.
     *
     * @default null
     */
    cssClass?: string;

    /**
     * Specifies the datasource for the carousel items.
     *
     * @isdatamanager false
     * @default []
     */
    dataSource?: Record<string, any>[];

    /**
     * Specifies the template option for carousel items.
     *
     * @default null
     * @aspType string
     */
    itemTemplate?: string | Function;

    /**
     * Specifies index of the current carousel item.
     *
     * @default 0
     */
    selectedIndex?: number;

    /**
     * Specifies the width of the Carousel in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Specifies the height of the Carousel in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Specifies the interval duration in milliseconds for carousel item transition.
     *
     * @default 5000
     */
    interval?: number;

    /**
     * Defines whether the slide transition is automatic or manual.
     *
     * @default true
     */
    autoPlay?: boolean;

    /**
     * Defines whether the slide transition gets pause on hover or not.
     *
     * @default true
     */
    pauseOnHover?: boolean;

    /**
     * Defines whether the slide transitions loop end or not. When set to false, the transition stops at last slide.
     *
     * @default true
     */
    loop?: boolean;

    /**
     * Defines whether to show play button or not.
     *
     * @default false
     */
    showPlayButton?: boolean;

    /**
     * Defines whether to enable swipe action in touch devices or not.
     *
     * @default true
     */
    enableTouchSwipe?: boolean;

    /**
     * Defines whether to show the indicator positions or not. The indicator positions allow to know the current slide position of the carousel component.
     *
     * @default true
     */
    showIndicators?: boolean;

    /**
     * Specifies the type of indicators. The available values for this property are:
     *
     * * `Default`: Displays the indicators with a bullet design.
     * * `Dynamic`: Applies a dynamic animation design to the indicators.
     * * `Fraction`: Displays the slides numerically as indicators.
     * * `Progress`: Represents the slides using a progress bar design.
     *
     * @default 'Default'
     */
    indicatorsType?: CarouselIndicatorsType;

    /**
     * Defines how to show the previous, next and play pause buttons visibility. The possible values for this property as follows
     * * `Hidden`: Navigation buttons are hidden.
     * * `Visible`: Navigation buttons are visible.
     * * `VisibleOnHover`: Navigation buttons are visible only when we hover the carousel.
     *
     * @default 'Visible'
     */
    buttonsVisibility?: CarouselButtonVisibility;

    /**
     * Enables active slide with partial previous/next slides.
     *
     * Slide animation only applicable if the partialVisible is enabled.
     *
     * @default false
     */
    partialVisible?: boolean;

    /**
     * Specifies whether the slide transition should occur while performing swiping via touch/mouse.
     * The slide swiping is enabled or disabled using bitwise operators. The swiping is disabled using ‘~’ bitwise operator.
     * * Touch - Enables or disables the swiping action in touch interaction.
     * * Mouse - Enables or disables the swiping action in mouse interaction.
     *
     * @default 'Touch'
     * @aspNumberEnum
     */
    swipeMode?: CarouselSwipeMode;

    /**
     * Accepts HTML attributes/custom attributes to add in individual carousel item.
     *
     * @default null
     */
    htmlAttributes?: Record<string, string>;

    /**
     * The event will be fired before the slide change.
     *
     * @event slideChanging
     */
    slideChanging?: EmitType<SlideChangingEventArgs>;

    /**
     * The event will be fired after the slide changed.
     *
     * @event slideChanged
     */
    slideChanged?: EmitType<SlideChangedEventArgs>;

}