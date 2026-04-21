import { Component, getUniqueID, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges, Property, attributes, removeClass, addClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import {SkeletonType,ShimmerEffect} from "./skeleton";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Skeleton
 */
export interface SkeletonModel extends ComponentModel{

    /**
     * Defines the width of the Skeleton.
     * Width will be prioritized and used as dimension when shape is "Circle" and "Square".
     *
     * @default ""
     * @aspType string
     */
    width?: string | number;

    /**
     * Defines the height of the Skeleton.
     * Height is not required when shape is "Circle" and "Square".
     *
     * @default ""
     * @aspType string
     */
    height?: string | number;

    /**
     * Defines the visibility state of Skeleton.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Defines the shape of the Skeleton.
     * {% codeBlock src='skeleton/shape/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default SkeletonType.Text
     * @asptype SkeletonType
     */
    shape?: string | SkeletonType;

    /**
     * Defines the animation effect of the Skeleton.
     * {% codeBlock src='skeleton/shimmerEffect/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default ShimmerEffect.Wave
     * @asptype ShimmerEffect
     */
    shimmerEffect?: string | ShimmerEffect;

    /**
     * Defines the 'aria-label' for Skeleton accessibility.
     *
     * @default "Loading..."
     */
    label?: string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of Skeleton.
     *
     * @default ""
     */
    cssClass?: string;

}