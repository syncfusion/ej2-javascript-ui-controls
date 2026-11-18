import { WidgetConfig } from '../types/component-properties';

/** @private */
const config: WidgetConfig =
{
    "textbox": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Text Input"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "prefix",
                        "label": "prefix",
                        "type": "text",
                        "placeholder": "providePrefix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "suffix",
                        "label": "suffix",
                        "type": "text",
                        "placeholder": "provideSuffix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "autocomplete",
                        "label": "autocomplete",
                        "type": "boolean",
                        "mode": "developer",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "multiline",
                        "label": "multiline",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "textboxType",
                        "label": "type",
                        "type": "dropdown",
                        "default": "Text",
                        "options": [
                            "text",
                            "password",
                            "email",
                            "number",
                            "url"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "regex",
                        "label": "regularExpressionPattern",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minLength",
                        "label": "minimumLength",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "maxLength",
                        "label": "maximumLength",
                        "type": "number",
                        "default": 255
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    }, 
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "textarea": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Text Area"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer", 
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "prefix",
                        "label": "prefix",
                        "type": "text",
                        "placeholder": "providePrefix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "suffix",
                        "label": "suffix",
                        "type": "text",
                        "placeholder": "provideSuffix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cols",
                        "label": "cols",
                        "type": "number",
                        "default": 200
                    },
                    {
                        "visible": true,
                        "key": "textareaRows",
                        "label": "rows",
                        "type": "number",
                        "default": 4
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "regex",
                        "label": "regularExpressionPattern",
                        "type": "text",
                        "mode": "developer", 
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minLength",
                        "label": "minimumLength",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "maxLength",
                        "label": "maximumLength",
                        "type": "number",
                        "default": 255
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation",
                        "mode": "developer"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "number": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "number"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "prefix",
                        "label": "prefix",
                        "type": "text",
                        "placeholder": "providePrefix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "suffix",
                        "label": "suffix",
                        "type": "text",
                        "placeholder": "provideSuffix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minMaxRange",
                        "label": "range",
                        "type": "minMaxEditor",
                        "editorMode": "number",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "step",
                        "label": "step",
                        "type": "number",
                        "mode": "developer",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "numberFormat",
                        "label": "format",
                        "type": "text",
                        "default": "n2",
                        "mode": "developer",
                        "placeholder": "numberFormatExample"
                    },
                    {
                        "visible": true,
                        "key": "currency",
                        "label": "currencyCode",
                        "type": "text",
                        "default": "",
                        "mode": "developer",
                        "placeholder": "currencyCodeExample"
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "checkbox": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Checkbox"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer", 
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "checkboxLabelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "After",
                        "options": [
                            "before",
                            "after"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "checked",
                        "label": "checked",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "indeterminate",
                        "label": "indeterminate",
                        "mode": "developer", 
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "checkboxGroup": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Checkbox Group"
                    },
                    {
                        "visible": true,
                        "key": "options",
                        "label": "checkboxOptions",
                        "type": "options",
                        "componentType" :"fromurl",
                        "default": [
                            "defaultOptionValue"
                        ],
                        "description": "configureCheckboxGroupOptions"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "array",
                        "default": [],
                        "placeholder": "e.g., [\"item1\", \"item2\"]"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "checkboxLabelPosition",
                        "label": "checkboxLabelPosition",
                        "type": "dropdown",
                        "default": "After",
                        "options": [
                            "before",
                            "after"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "layoutDirection",
                        "label": "layoutDirection",
                        "type": "dropdown",
                        "default": "Column",
                        "options": [
                            "row",
                            "column"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "gap",
                        "label": "spacingBetweenItems",
                        "type": "text",
                        "default": "2px",
                        "placeholder": "spacingFormatExample1"
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "default": "",
                        "placeholder": "provideCustomValidationMessage"
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample1"
                    }
                ]
            }
        ]
    },
    "radio": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Radio Button"
                    },
                     {
                        "visible": true,
                        "key": "options",
                        "label": "options",
                        "type": "options",
                        "default": [
                            "defaultOptionValue"
                        ],
                        "description": "configureRadioButtonOptions"
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer", 
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "fieldLabelPosition",
                        "label": "fieldLabelPosition",
                        "type": "dropdown",
                        "default": "After",
                        "options": [
                            "before",
                            "after"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "dropdown": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Dropdown List"
                    },
                    {
                        "visible": true,
                        "key": "options",
                        "label": "options",
                        "type": "options",
                        "componentType" :"fromurl",
                        "default": [
                            "defaultOptionValue"
                        ],
                        "description": "configureDropdownOptions"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "enableVirtualization",
                        "label": "enableVirtualization",
                        "type": "boolean",
                        "default": false,
                        "mode": "developer",
                        "description": "enableVirtualScrollingForLargeData"
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "popupHeight",
                        "label": "popupHeight",
                        "type": "text",
                        "default": "300px",
                        "mode": "developer",
                        "placeholder": "dimensionFormatExample3"
                    },
                    {
                        "visible": true,
                        "key": "popupWidth",
                        "label": "popupWidth",
                        "type": "text",
                        "default": "100%",
                        "mode": "developer",
                        "placeholder": "widthFormatFlexible"
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen",
                            "choiceBasedField"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "switch": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "switch"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "checked",
                        "label": "checked",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "offLabel",
                        "label": "offText",
                        "mode": "developer",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "onLabel",
                        "label": "onText",
                        "mode": "developer",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "button": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "allowMultiple",
                        "label": "enableMultiple",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "content",
                        "type": "text",
                        "default": "Button"
                    },
                    {
                        "visible": true,
                        "key": "buttonType",
                        "label": "buttonType",
                        "type": "dropdown",
                        "default": "Button",
                        "options": [
                            "submit",
                            "button",
                            "reset"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "iconCss",
                        "label": "iconCssClass",
                        "type": "text",
                        "default": "",
                        "placeholder": "cssIconExample"
                    },
                    {
                        "visible": true,
                        "key": "iconPosition",
                        "label": "iconPosition",
                        "type": "dropdown",
                        "default": "Left",
                        "options": [
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "style",
                        "label": "style",
                        "type": "dropdown",
                        "default": "Primary",
                        "options": [
                            "primary",
                            "flat",
                            "information",
                            "error",
                            "success",
                            "warning"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "buttonsGroups",
                        "label": "buttonsConfiguration",
                        "type": "buttonGroup",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "gap",
                        "label": "gapBetweenButtons",
                        "type": "text",
                        "default": "8px",
                        "placeholder": "spacingFormatExample2"
                    },
                    {
                        "visible": true,
                        "key": "width",
                        "label": "containerWidth",
                        "type": "text",
                        "default": "100%",
                        "placeholder": "widthFormatExample1"
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "position",
                        "label": "alignment",
                        "type": "dropdown",
                        "default": "Left",
                        "options": [
                            "left",
                            "right",
                            "center"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "splitButton": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Split Button"
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "options",
                        "label": "items",
                        "type": "options",
                        "default": [
                            "defaultOptionValue"
                        ],
                        "description": "configureSplitButtonItems"
                    },
                    {
                        "visible": true,
                        "key": "iconCss",
                        "label": "iconCssClass",
                        "type": "text",
                        "default": "",
                        "placeholder": "cssIconExample"
                    },
                    {
                        "visible": true,
                        "key": "iconPosition",
                        "label": "iconPosition",
                        "type": "dropdown",
                        "default": "Left",
                        "options": [
                            "left",
                            "top"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "style",
                        "label": "style",
                        "type": "dropdown",
                        "default": "flat",
                        "options": [
                            "primary",
                            "flat",
                            "information",
                            "error",
                            "success",
                            "warning"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "position",
                        "label": "alignment",
                        "type": "dropdown",
                        "default": "Left",
                        "options": [
                            "left",
                            "right",
                            "center"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "date": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Date Picker"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "day",
                        "default": "",
                        "placeholder": "selectDatePlaceholder"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minMaxRange",
                        "label": "range",
                        "type": "minMaxEditor",
                        "editorMode": "date",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "calendarMode",
                        "label": "calendarMode",
                        "type": "dropdown",
                        "mode": "developer",
                        "default": "Gregorian",
                        "options": [
                            "gregorian",
                            "islamic"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "start",
                        "label": "initialView",
                        "type": "dropdown",
                        "mode": "developer",
                        "default": "Month",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "depth",
                        "label": "calendarViewDepth",
                        "type": "dropdown",
                        "default": "Month",
                        "mode": "developer",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "dayHeaderFormat",
                        "label": "dayHeaderFormat",
                        "type": "dropdown",
                        "default": "Short",
                        "mode": "developer",
                        "options": [
                            "short",
                            "narrow",
                            "abbreviated",
                            "wide"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showTodayButton",
                        "label": "showTodayButton",
                        "type": "boolean",
                        "mode": "developer",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "dateTime": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Date Time Picker"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "datetime",
                        "default": "",
                        "placeholder": "selectInitialDateTime"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minMaxRange",
                        "label": "dateRange",
                        "type": "minMaxEditor",
                        "editorMode": "date",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "minMaxTimeRange",
                        "label": "timeRange",
                        "type": "minMaxEditor",
                        "editorMode": "time",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "start",
                        "label": "initialView",
                        "type": "dropdown",
                        "default": "Month",
                        "mode": "developer",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "depth",
                        "label": "calendarViewDepth",
                        "type": "dropdown",
                        "default": "Month",
                        "mode": "developer",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "dayHeaderFormat",
                        "label": "dayHeaderFormat",
                        "type": "dropdown",
                        "default": "Short",
                        "mode": "developer",
                        "options": [
                            "short",
                            "narrow",
                            "abbreviated",
                            "wide"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "step",
                        "label": "step",
                        "type": "number",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showTodayButton",
                        "label": "showTodayButton",
                        "type": "boolean",
                        "mode": "developer",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "time": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Time Picker"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "time",
                        "default": "",
                        "placeholder": "selectInitialTime"
                    },
                    {
                        "visible": true,
                        "key": "minMaxRange",
                        "label": "range",
                        "type": "minMaxEditor",
                        "editorMode": "time",
                        "default": []
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "step",
                        "label": "step",
                        "type": "number",
                        "default": 30
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "dateRange": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Date Range Picker"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "daterange",
                        "default": "",
                        "placeholder": "selectStartEndDates"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minDate",
                        "label": "minimumDate",
                        "type": "day",
                        "default": "",
                        "placeholder": "selectMinimumDate"
                    },
                    {
                        "visible": true,
                        "key": "maxDate",
                        "label": "maximumDate",
                        "type": "day",
                        "default": "",
                        "placeholder": "selectMaximumDate"
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "start",
                        "label": "initialView",
                        "type": "dropdown",
                        "default": "Month",
                        "mode": "developer",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "depth",
                        "label": "calendarViewDepth",
                        "type": "dropdown",
                        "default": "Month",
                        "mode": "developer",
                        "options": [
                            "month",
                            "year",
                            "decade"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "dayHeaderFormat",
                        "label": "dayHeaderFormat",
                        "type": "dropdown",
                        "default": "Short",
                        "mode": "developer",
                        "options": [
                            "short",
                            "narrow",
                            "abbreviated",
                            "wide"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "inputMask": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Masked TextBox"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "mask",
                        "label": "mask",
                        "type": "text",
                        "default": "000-000-0000",
                        "placeholder": "phoneFormatExample"
                    },
                    {
                        "visible": true,
                        "key": "promptChar",
                        "label": "promptCharacter",
                        "type": "text",
                        "default": "_",
                        "length": 1,
                        "placeholder": "charForPlaceholder"
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "prefix",
                        "label": "prefix",
                        "type": "text",
                        "placeholder": "providePrefix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "suffix",
                        "label": "suffix",
                        "type": "text",
                        "placeholder": "provideSuffix",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "multiselect": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "MultiSelect"
                    },
                    {
                        "visible": true,
                        "key": "options",
                        "label": "options",
                        "type": "options",
                        "componentType" :"fromurl",
                        "default": [
                            "defaultOptionValue"
                        ],
                        "description": "configureMultiselectOptions"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "array",
                        "default": [],
                        "placeholder": "e.g., [\"item1\", \"item2\"]"
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "addTagOnBlur",
                        "label": "addTagOnBlur",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "allowCustomValue",
                        "label": "allowCustomValue",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "enableVirtualization",
                        "label": "enableVirtualization",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showSelectAll",
                        "label": "showSelectAll",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "selectAllText",
                        "label": "selectAllText",
                        "type": "text",
                        "default": "selectAll"
                    },
                    {
                        "visible": true,
                        "key": "unSelectAllText",
                        "label": "unselectAllText",
                        "type": "text",
                        "default": "unselectAll"
                    },
                    {
                        "visible": true,
                        "key": "delimiterChar",
                        "label": "delimiterCharacter",
                        "type": "text",
                        "default": ",",
                        "mode": "developer",
                        "length": 1
                    },
                    {
                        "visible": true,
                        "key": "visualMode",
                        "label": "visualMode",
                        "type": "dropdown",
                        "mode": "developer",
                        "default": "Default",
                        "options": [
                            "default",
                            "delimiter",
                            "box"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "floatLabelType",
                        "label": "floatLabelType",
                        "type": "dropdown",
                        "default": "Never",
                        "mode": "developer",
                        "options": [
                            "never",
                            "always",
                            "auto"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "popupHeight",
                        "label": "popupHeight",
                        "type": "text",
                        "default": "300px",
                        "mode": "developer",
                        "placeholder": "dimensionFormatExample3"
                    },
                    {
                        "visible": true,
                        "key": "popupWidth",
                        "label": "popupWidth",
                        "type": "text",
                        "mode": "developer",
                        "default": "100%"
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showClearButton",
                        "label": "showClearButton",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showDropDownIcon",
                        "label": "showDropdownIcon",
                        "type": "boolean",
                        "mode": "developer",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Validation",
                "properties": [
                    {
                        "visible": true,
                        "key": "required",
                        "label": "required",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "validationMessage",
                        "label": "validationMessage",
                        "type": "text",
                        "mode": "developer",
                        "placeholder": "provideCustomValidationMessage",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "customValidation",
                        "label": "customValidation",
                        "type": "customValidation"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "requiredWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "message": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "content",
                        "label": "content",
                        "type": "text",
                        "default": "message"
                    },
                    {
                        "visible": true,
                        "key": "severity",
                        "label": "severity",
                        "type": "dropdown",
                        "default": "Information",
                        "options": [
                            "information",
                            "success",
                            "warning",
                            "error"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "variant",
                        "label": "variant",
                        "type": "dropdown",
                        "default": "Standard",
                        "options": [
                            "standard",
                            "filled",
                            "outlined"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "showIcon",
                        "label": "showIcon",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showCloseIcon",
                        "label": "showCloseIcon",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "panel": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Panel"
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideBorders",
                        "label": "hideBorder",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "card": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "cardTitle",
                        "label": "cardTitle",
                        "type": "text",
                        "default": "cardTitle"
                    },
                    {
                        "visible": true,
                        "key": "cardSubtitle",
                        "label": "cardSubtitle",
                        "type": "text",
                        "default": "",
                        "required": false
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "table": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "rows",
                        "label": "rows",
                        "type": "number",
                        "default": 2,
                        "min": 1
                    },
                    {
                        "visible": true,
                        "key": "columns",
                        "label": "columns",
                        "type": "number",
                        "default": 2,
                        "min": 1,
                        "max": 12
                    },
                    {
                        "visible": true,
                        "key": "hideBorders",
                        "label": "hideBorder",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "columnWidths",
                        "label": "Column Widths",
                        "type": "columnspaneditor",
                        "description": "setTableColumnWidth"
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "tabs": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "tabOptions",
                        "label": "addTabs",
                        "type": "options",
                        "componentType": "tabs",
                        "default": [
                            "defaultTabValue"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "rating": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Rating"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "minValue",
                        "label": "minimum",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "itemsCount",
                        "label": "itemsCount",
                        "type": "number",
                        "default": 5
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "allowReset",
                        "label": "allowReset",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showRatingTooltip",
                        "label": "showRatingTooltip",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showRatingLabel",
                        "label": "showRatingLabel",
                        "mode": "developer",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "ratingLabelPosition",
                        "label": "ratingLabelPosition",
                        "type": "dropdown",
                        "mode": "developer",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "readOnlyWhen",
                            "setValueWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "imageEditor": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Image Editor"
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "height",
                        "label": "height",
                        "type": "text",
                        "placeholder": "dimensionFormatExample3"
                    },
                    {
                        "visible": true,
                        "key": "width",
                        "label": "width",
                        "type": "text",
                        "placeholder": "dimensionFormatExample3"
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "colorPicker": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Color Picker"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "color",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "enableOpacity",
                        "label": "enableOpacity",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "showNoColor",
                        "label": "showNoColor",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showButtons",
                        "label": "showButtons",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showRecentColors",
                        "label": "showRecentColors",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "fileUpload": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Uploader"
                    },
                    {
                        "visible": true,
                        "key": "saveUrl",
                        "label": "saveUrl",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "removeUrl",
                        "label": "removeUrl",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "buttons",
                        "label": "buttons",
                        "type": "object",
                        "mode": "developer",
                        "default": {
                            "browse": "Choose File",
                            "clear": "Clear All",
                            "upload": "Upload All"
                        }
                    },
                    {
                        "visible": true,
                        "key": "allowExtensions",
                        "label": "allowExtensions",
                        "type": "text",
                        "placeholder": "Pass allowedExtensions as â€œ.jpg,.pngâ€.",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "maxValue",
                        "label": "maximumFileSize",
                        "type": "number",
                        "default": 30000000
                    },
                    {
                        "visible": true,
                        "key": "minValue",
                        "label": "minimumFileSize",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "allowMultiple",
                        "label": "allowMultiple",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "showFileList",
                        "label": "showFileList",
                        "mode": "developer",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "rangeSlider": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Slider"
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "expressionValue",
                        "label": "expression",
                        "type": "expression",
                        "placeholder": "expressionPlaceholder",
                        "description": "expressionDesc",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "maxValue",
                        "label": "maximumValue",
                        "type": "number",
                        "default": 100
                    },
                    {
                        "visible": true,
                        "key": "minValue",
                        "label": "minimumValue",
                        "type": "number",
                        "default": 0
                    },
                    {
                        "visible": true,
                        "key": "step",
                        "label": "step",
                        "type": "number",
                        "mode": "developer",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "showButtons",
                        "label": "showButtons",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "setValueWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "signature": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Signature"
                    },
                    {
                        "visible": true,
                        "key": "backgroundColor",
                        "label": "backgroundColor",
                        "type": "color",
                        "default": "#fff"
                    },
                    {
                        "visible": true,
                        "key": "strokeColor",
                        "label": "strokeColor",
                        "type": "color",
                        "default": "#000"
                    },
                    {
                        "visible": true,
                        "key": "velocity",
                        "label": "velocity",
                        "type": "number",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "maxValue",
                        "label": "maximumStrokeWidth",
                        "type": "number",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "minValue",
                        "label": "minimumStrokeWidth",
                        "type": "number",
                        "default": 1
                    },
                    {
                        "visible": true,
                        "key": "labelPosition",
                        "label": "labelPosition",
                        "type": "dropdown",
                        "default": "Top",
                        "options": [
                            "top",
                            "bottom",
                            "left",
                            "right"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "labelWidth",
                        "label": "labelWidth",
                        "type": "text",
                        "default": "auto",
                        "placeholder": "percentageCalculationHint"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    },
    "dataGrid": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Data Grid"
                    },
                    {
                        "visible": true,
                        "key": "height",
                        "label": "height",
                        "type": "text",
                        "default": "200px",
                        "placeholder": "dimensionFormatExample1"
                    },
                    {
                        "visible": true,
                        "key": "width",
                        "label": "width",
                        "type": "text",
                        "default": "100%",
                        "placeholder": "widthFormatExample2"
                    },
                    {
                        "visible": true,
                        "key": "pageSize",
                        "label": "pageSize",
                        "type": "number",
                        "default": 6
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "allowPaging",
                        "label": "allowPaging",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "allowAdding",
                        "label": "allowAdding",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "allowEditing",
                        "label": "allowEditing",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "allowDeleting",
                        "label": "allowDeleting",
                        "type": "boolean",
                        "default": true
                    },
                    {
                        "visible": true,
                        "key": "allowFiltering",
                        "label": "allowFiltering",
                        "type": "boolean",
                        "default": false
                    }
                ]
            },
            {
                "name": "Data",
                "properties": [
                    {
                        "visible": true,
                        "key": "dataSource",
                        "label": "dataSource",
                        "type": "json",
                        "default": [],
                        "placeholder": "pasteJsonArrayRecords"
                    },
                     {
                        "visible": true,
                        "key": "columns",
                        "label": "columnDefinitions",
                        "type": "datagridcolumns",
                        "default": []
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen", 
                            "conditionalData"
                        ]
                    }
                ]
            }
        ]
    },
    "richTextEditor": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "label",
                        "label": "label",
                        "type": "text",
                        "default": "Rich Text Editor"
                    },
                    {
                        "visible": true,
                        "key": "description",
                        "label": "description",
                        "type": "text",
                        "placeholder": "provideDescription",
                        "mode": "developer",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "tooltip",
                        "label": "tooltip",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "value",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "placeholder",
                        "label": "placeholder",
                        "type": "text",
                        "placeholder": "providePlaceholder",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "maxLength",
                        "label": "maximumLength",
                        "type": "number",
                        "default": 1000
                    },
                    {
                        "visible": true,
                        "key": "width",
                        "label": "width",
                        "type": "text",
                        "placeholder": "dimensionFormatExample4",
                        "default": "100%"
                    },
                    {
                        "visible": true,
                        "key": "height",
                        "label": "height",
                        "type": "text",
                        "placeholder": "dimensionFormatExample2",
                        "default": "300px"
                    },
                    {
                        "visible": true,
                        "key": "hideLabel",
                        "label": "hideLabel",
                        "type": "boolean",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "disabled",
                        "label": "disabled",
                        "type": "boolean",
                        "mode": "developer",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "readOnly",
                        "label": "readOnly",
                        "type": "boolean",
                        "mode": "developer",   
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "cssClass",
                        "label": "cssClass",
                        "type": "text",
                        "mode": "developer",
                        "default": ""
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen",
                            "readOnlyWhen",
                            "disabledWhen"
                        ]
                    }
                ]
            },
            {
                "name": "importexport",
                "properties": [
                    {
                        "visible": true,
                        "key": "enableImportFromWord",
                        "label": "enableImportFromWord",
                        "type": "URLImport",
                        "componentType": "enableImportFromWord",
                        "description": "importFromWordUrlPlaceholder",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "enableExportToWord",
                        "label": "enableExportToWord",
                        "type": "URLImport",
                        "componentType": "enableExportToWord",
                        "description": "exportToWordUrlPlaceholder",
                        "default": false
                    },
                    {
                        "visible": true,
                        "key": "enableExportToPdf",
                        "label": "enableExportToPdf",
                        "type": "URLImport",
                        "componentType": "enableExportToPdf",
                        "description": "exportToPdfUrlPlaceholder",
                        "default": false
                    }
                ]
            },
            {
                "name": "Layout",
                "properties": [
                    {
                        "visible": true,
                        "key": "size",
                        "label": "size",
                        "type": "dropdown",
                        "default": "Default",
                        "mode": "developer",
                        "options": [
                            "default",
                            "small",
                            "bigger"
                        ]
                    },
                    {
                        "visible": true,
                        "key": "htmlAttributes",
                        "label": "htmlAttributes",
                        "type": "attributes",
                        "placeholder": "dataAttributeExample2",
                        "mode": "developer"
                    }
                ]
            }
        ]
    },
    "staticHtml": {
        "groups": [
            {
                "name": "Display",
                "properties": [
                    {
                        "visible": true,
                        "key": "name",
                        "label": "name",
                        "type": "text",
                        "default": ""
                    },
                    {
                        "visible": true,
                        "key": "defaultValue",
                        "label": "htmlContent",
                        "type": "html",
                        "default": "<p>HTML content</p>",
                        "placeholder": "enterHtmlCode"
                    },
                    {
                        "visible": true,
                        "key": "enableHtmlSanitizer",
                        "label": "enableHtmlSanitizer",
                        "type": "boolean",
                        "default": false
                    }
                ]
            },
            {
                "name": "Conditions",
                "properties": [
                    {
                        "visible": true,
                        "key": "conditions",
                        "label": "Conditional Behaviors",
                        "type": "conditions",
                        "supportedConditions": [
                            "visibleWhen"
                        ]
                    }
                ]
            }
        ]
    }
}
;
export default config;