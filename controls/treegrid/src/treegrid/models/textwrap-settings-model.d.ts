import { Property, ChildProperty } from '@syncfusion/ej2-base';import { WrapMode } from '../enum';

/**
 * Interface for a class TextWrapSettings
 */
export interface TextWrapSettingsModel {

    /**
     * Defines the `wrapMode` of the TreeGrid. The available modes are:
     * * `Both`: Wraps both the header and content.
     * * `Content`: Wraps the header alone.
     * * `Header`: Wraps the content alone.
     *
     * @default Both
     */
    wrapMode?: WrapMode;

}