import { Component, Collection, Property, Event, EmitType, NotifyPropertyChanges, enableRipple, createElement, ChildProperty, isNullOrUndefined, L10n, getComponent, addClass, compile, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { Tab, Toolbar } from '@syncfusion/ej2-navigations';import { Tooltip } from '@syncfusion/ej2-popups';import { FormValidator, Signature } from '@syncfusion/ej2-inputs';import { FormLayout, FormNode, Schema } from './types/form-schema';import { renderFormField } from './render-form-field';import { resolveCustomWidget, ResolvedCustomWidget } from './custom-widget-resolver';import { mergeSchema, UnifiedSchema } from '../common/json-converter';import { UniversalJsonParser } from '../common/parser';import { VALIDATION_REGEX, formatDateValues, splitWidths } from '../common/utils';import StaticHtmlRenderer from '../common/static-html-renderer';import { ConditionalRuleEngine, FormValueType } from '../common/index';import { ExpressionEngine, DependencyGraph } from '../common/expressions/expression-engine';import { MinMaxRuleEngine } from '../common/minmax-rule-engine';import { CustomValidationEngine } from '../common/custom-validation-engine';import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';import { ImageEditor } from '@syncfusion/ej2-image-editor';
import {FieldDataType,SubmitEventArgs,ChangeEventArgs,ButtonClickEventArgs,FailureEventArgs} from "./form-renderer";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class CustomWidgetSetting
 */
export interface CustomWidgetSettingModel {

    /**
     * Specifies the template content to be used.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | HTMLElement | Function;

    /**
     * Specifies the type of the widget to which the template must be bound. The values will be FormComponentType.
     *
     * @default ''
     */
    type?: string;

    /**
     * Specifies an optional template identifier. When set, the template is rendered to the JSON object whose templateId matches this value, irrespective of the type.
     *
     * @default ''
     */
    templateId?: string;

    /**
     * Specifies the name of the field to which the template must be bound. When set, the template is rendered to the control with the matching name, irrespective of the type property value.
     *
     * @default ''
     */
    fieldName?: string;

}

/**
 * Interface for a class FormRenderer
 */
export interface FormRendererModel extends ComponentModel{

    /**
     * Specifies the data schema of the form that needs to be rendered in the Form Renderer.
     */
    schema?: Schema | string | Record<string, unknown> | null;

    /**
     * Specifies initial values for form fields by field name.
     *
     * @default null
     */
    dataModel?: Record<string, FieldDataType> | null;

    /**
     * Specifies the form layout configuration (only applies when layout details are NOT available in the schema). Determines how form fields are arranged in columns.
     * 
     * @default 'SingleColumn'
     */
    layout?: FormLayout | string;

    /**
     * Specifies the CSS class name to apply to the root form container element. This property supports space-separated multiple classes.
     * 
     * @default "" 
     */
    className?: string;

    /**
     * Specifies the custom widget settings to bind and render custom templates for form fields.
     *
     * @default null
     */
    customWidgetSettings?: CustomWidgetSettingModel[];

    /**
     * Specifies whether to enable the sanitization of untrusted HTML in custom widget string/script templates (`customWidgetSettings[].template`).
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Event triggered when the form is submitted.
     * This event provides form data and validation status in the event argument.
     *
     * @event
     */
    submit?: EmitType<SubmitEventArgs>;

    /**
     * Event triggered when any form field value changes. Fired on user input for tracked fields.
     *
     * @event
     */
    change?: EmitType<ChangeEventArgs>;

    /**
     * Event triggered when a button in the form is clicked. Applies to all button types (button, submit, splitButton).
     *
     * @event
     */
    buttonClick?: EmitType<ButtonClickEventArgs>;

    /**
     * Event triggered when an error is thrown in the form rendering or schema parsing.
     *
     * @event
     */
    failure?: EmitType<FailureEventArgs>;

    /**
     * Event triggered when all form elements are rendered and ready for interaction. Useful for performing post-render initialization or setup.
     *
     * @event
     */
    created?: EmitType<Object>;

}