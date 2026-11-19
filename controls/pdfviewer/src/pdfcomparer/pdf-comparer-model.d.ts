import { PdfViewer, Magnification, Navigation, Annotation, TextSelection, FormFields, TextComparisonOptions, createSpinner, showSpinner, hideSpinner } from '../index';import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { Button } from '@syncfusion/ej2-buttons';import { DifferencePanel } from './difference-panel';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class PdfComparer
 */
export interface PdfComparerModel extends ComponentModel{

    /**
     * Specifies the file path, URL, or document source of the original PDF document
     * displayed in the left comparison viewer.
     *
     * @default ''
     */
    originalDocumentPath?: string;

    /**
     * Specifies the file path, URL, or document source of the modified PDF document
     * displayed in the right comparison viewer.
     *
     * @default ''
     */
    modifiedDocumentPath?: string;

    /**
     * Set the resource URL for assets or the public directory. The PdfComparer will load its custom resources from this URL.
     *
     * @default ''
     */
    resourceUrl?: string;

    /**
     * Configures semantic text comparison settings, including highlight colors, opacity values, and difference rendering behavior.
     *
     * @default null
     */
    comparisonOptions?: TextComparisonOptions;

    /**
     * Determines whether the interactive difference panel is displayed.
     * When enabled, users can quickly navigate detected differences.
     *
     * @default true
     */
    enableDifferencePanel?: boolean;

    /**
     * Determines whether scrolling, zooming, and navigation actions are synchronized between both PDF viewers.
     *
     * @default true
     */
    enableSyncScrolling?: boolean;

    /**
     * Specifies the culture and localization settings for the PdfComparer component.
     * Overrides the globally configured culture value.
     *
     * @default ''
     */
    locale?: string;

    /**
     * Defines the scrollable height of the PdfComparer control.
     *
     * {% codeBlock src='pdfcomparer/height/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the scrollable width of the PdfComparer control.
     *
     * {% codeBlock src='pdfcomparer/width/index.md' %}{% endcodeBlock %}
     *
     * @default '100%'
     */
    width?: string | number;

}