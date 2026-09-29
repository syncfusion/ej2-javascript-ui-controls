import {
    TextBox,
    NumericTextBox,
    MaskedTextBox,
    Uploader,
    TextArea,
    Slider,
    ColorPicker,
    Rating,
    Signature
} from '@syncfusion/ej2-inputs';
import {
    CheckBox,
    RadioButton,
    Switch,
    Button,
    ClickedEventArgs
} from '@syncfusion/ej2-buttons';
import { SplitButton, ItemModel, ClickEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import {
    DropDownList,
    MultiSelect,
    CheckBoxSelection,
    VirtualScroll
} from '@syncfusion/ej2-dropdowns';
import {
    DatePicker,
    DateTimePicker,
    TimePicker,
    DateRangePicker,
    Islamic
} from '@syncfusion/ej2-calendars';
import { Message } from '@syncfusion/ej2-notifications';
import { ImageEditor } from '@syncfusion/ej2-image-editor';
import {
    RichTextEditor,
    Toolbar,
    HtmlEditor,
    Link,
    QuickToolbar,
    Image as RTEImage,
    Count,
    Table,
    EmojiPicker,
    SlashMenu,
    CodeBlock,
    ClipBoardCleanup,
    AutoFormat,
    ImportExport,
    PasteCleanup
} from '@syncfusion/ej2-richtexteditor';
import { ImportWordModel, ExportWordModel, ExportPdfModel } from '@syncfusion/ej2-richtexteditor';
import { createElement, L10n } from '@syncfusion/ej2-base';

import { FormNode } from './types/form-schema';
import {
    mapButtonStyleToClass,
    mapPositionToJustifyContent,
    resolveButtonType,
    resolveConditionalData,
    resolveOptions
} from '../common/utils';
import { OptionFetcher } from '../common/option-fetcher';
import { CheckboxGroup } from '../common/checkbox-group';
import { DataGridComponent } from '../common/datagrid-component';
import { ConditionalRuleEngine } from '../common/conditional-rule-engine';
import { forwardExtras, pickUnmappedSchemaProps } from '../common/index';

/**
 * @private
 */
export interface RenderFormFieldOptions {
    component: FormNode;
    value?: any;
    onChange: (value: any) => void;
    formState?: any;
    onBlur?: () => void;
    onClick?: (event: any) => void;
    ref?: any;
    hasError?: boolean;
    locale: string;
    components?: FormNode[];
    settings?: any;
    enableRtl?: boolean;
    /** Host target element for the rendered instance (Vanilla EJ2 TS adaption). */
    target?: HTMLElement;
    initializedGrids?: Set<string>;
    l10n?: L10n;
}

/**
 * @private
 */
const normalizeAttributes = (attributes: any): Record<string, string> => {
    if (!attributes) { return {}; }
    if (Array.isArray(attributes)) {
        return attributes.reduce((acc: Record<string, string>, item: any) => {
            if (item && item.key && item.value !== undefined) {
                acc[item.key] = item.value;
            }
            return acc;
        }, {});
    }
    return attributes as Record<string, string>;
};

/**
 * @private
 */
const applyHostId = (el: HTMLElement | undefined, id?: string): void => {
    if (el && id) {
        el.setAttribute('id', id);
    }
};

/**
 * Renders a single form field component (vanilla EJ2 TS) and returns the
 * instantiated EJ2 component instance (or host element). The host owns DOM
 * attachment and ref tracking.
 *
 * @private
 */
export const renderFormField = (options: RenderFormFieldOptions): any => {
    const { component, value, onChange, onBlur, onClick, hasError = false,
        locale, formState, settings, components, enableRtl, ref, l10n } = options;
    const initializedGrids: Set<string> = options.initializedGrids || new Set<string>();
    const target: HTMLElement | undefined = options.target;

    const commonProps: any = {
        floatLabelType: (component.floatLabelType || 'Never'),
        placeholder: component.placeholder || '',
        enabled: !component.disabled
    };

    const createValidationHandlers = (getValue: (args: any) => any): any => {
        const validateOn: string = component.validateOn || 'Change';
        const handlers: any = {};
        if (!validateOn || validateOn === 'Change') {
            handlers.change = (args: any) => onChange(getValue(args));
            handlers.blur = () => { if (onBlur) { onBlur(); } };
        }
        if (validateOn === 'Blur') {
            handlers.change = (args: any) => onChange(getValue(args));
            handlers.blur = () => { if (onBlur) { onBlur(); } };
        }
        return handlers;
    };

    const htmlAttrs: Record<string, string> = normalizeAttributes(component.htmlAttributes);
    if (component.required) {
        htmlAttrs['aria-required'] = 'true';
    }
    const errorClass: string = hasError ? 'e-error' : '';
    const cssClass: string =
        `${component.cssClass || ''} ${errorClass} ${component.size === 'Small' ? ' e-small' : component.size === 'Bigger' ? ' e-bigger' : ''}`.trim();

    switch (component.type) {
        case 'textbox': {
            const tb = new TextBox({
                id: component.name,
                type: component.multiline ? 'hidden' : (component.textboxType ? component.textboxType : 'text'),
                name: component.id,
                enableRtl: enableRtl,
                locale: locale,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue || ''),
                multiline: component.multiline,
                showClearButton: component.showClearButton,
                autocomplete: component.autocomplete === false || component.autocomplete === undefined ? 'off' : 'on',
                readonly: component.readOnly || false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                appendTemplate: component.suffix,
                prependTemplate: component.prefix,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            if (target) {
                tb.appendTo(target);
            }
            forwardExtras(tb, component as any, [
                'name', 'multiline', 'textboxType', 'defaultValue',
                'showClearButton', 'autocomplete', 'readOnly', 'cssClass',
                'suffix', 'prefix', 'floatLabelType', 'placeholder', 'disabled'
            ]);
            ref(tb);
            return tb;
        }

        case 'textarea': {
            const ta = new TextArea({
                id: component.name,
                name: component.id,
                enableRtl: enableRtl,
                locale: locale,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue || ''),
                cols: component.cols || 200,
                rows: component.textareaRows || 4,
                showClearButton: component.showClearButton || false,
                readonly: component.readOnly || false,
                maxLength: component.maxLength || 255,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                appendTemplate: component.suffix,
                prependTemplate: component.prefix,
                resizeMode: 'Vertical',
                ...createValidationHandlers((args: any) => args.value || '')
            });
            if (target) {
                ta.appendTo(target);
            }
            forwardExtras(ta, component as any, [
                'name', 'defaultValue', 'cols', 'textareaRows',
                'showClearButton', 'readOnly', 'maxLength', 'cssClass',
                'suffix', 'prefix', 'floatLabelType', 'placeholder', 'disabled'
            ]);
            ref(ta);
            return ta;
        }

        case 'number': {
            const numValue: any = value === '' ? undefined : value;
            const ntb = new NumericTextBox({
                locale: locale,
                enableRtl: enableRtl,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: numValue !== undefined ? numValue : (component.defaultValue || undefined),
                decimals: component.decimals || 2,
                currency: component.currency,
                format: component.numberFormat || 'n2',
                step: component.step || 1,
                min: component.minValue || undefined,
                max: component.maxValue || undefined,
                readonly: component.readOnly || false,
                showClearButton: component.showClearButton || false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                appendTemplate: component.suffix,
                prependTemplate: component.prefix,
                change: (args: any) => onChange(args.value)
            });
            if (target) {
                applyHostId(target, component.name);
                target.setAttribute('name', component.id);
                ntb.appendTo(target);
            }
            forwardExtras(ntb, component as any, [
                'name', 'defaultValue', 'decimals', 'currency', 'numberFormat',
                'step', 'minValue', 'maxValue', 'readOnly', 'showClearButton',
                'cssClass', 'suffix', 'prefix', 'floatLabelType', 'placeholder', 'disabled'
            ]);
            ref(ntb);
            return ntb;
        }

        case 'checkbox': {
            const checkboxLabel: string = component.label && component.required
                ? `${component.label} *`
                : component.label;
            const cb = new CheckBox({
                locale: locale,
                name: component.id,
                enableRtl: enableRtl,
                label: checkboxLabel,
                labelPosition: component.checkboxLabelPosition as any,
                checked: ((component.checked !== undefined && component.checked !== null ? component.checked : false) || (value !== undefined && value !== null ? value : false)),
                indeterminate: component.indeterminate || false,
                disabled: component.disabled,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                change: (args: any) => onChange(args.checked)
            });
            if (target) {
                applyHostId(target, component.name);
                cb.appendTo(target);
            }
            forwardExtras(cb, component as any, [
                'name', 'checked', 'indeterminate',
                'checkboxLabelPosition', 'cssClass'
            ]);
            ref(cb);
            return cb;
        }

        case 'checkboxGroup': {
            const fetchedCheckboxOptions: string[] = [];
            OptionFetcher.fetch(component.options, component.id, formState ? formState.values : undefined, components)
                .then((res) => {
                    if (res.id === component.id && res.options.length > 0) {
                        fetchedCheckboxOptions.push(...res.options);
                        group.setOptions(fetchedCheckboxOptions);
                    }
                }).catch(() => { });
            const resolvedCheckboxOptions: any[] = resolveOptions(component.options, fetchedCheckboxOptions);
            const finalCheckboxOptions: string[] = resolvedCheckboxOptions.length > 0
                ? resolvedCheckboxOptions
                : (component.options || ['Option 1']) as string[];

            const group = new CheckboxGroup({
                component: { ...component, options: finalCheckboxOptions } as any,
                formState: formState,
                value: value,
                enableRtl: enableRtl,
                onChange: (v: string[]) => onChange(v),
                optionRef: options.ref,
                target: target,
                ref: ref
            });
            if (target) {
                applyHostId(target, component.name);
            }
            forwardExtras(group as any, component as any, [
                'options', 'enableRtl', 'disabled', 'readOnly', 'required',
                'checkboxLabelPosition', 'layoutDirection', 'gap', 'size',
                'cssClass', 'htmlAttributes'
            ]);
            group.render(target);
            return group;
        }

        case 'radio': {
            const radioOptions: string[] = Array.isArray(component.options) ? component.options : ['Option 1'];
            const wrapper: HTMLDivElement = createElement('div', {
                id: `${component.name}-group`,
                className: `e-radio-group ${errorClass}`
            }) as HTMLDivElement;
            const rbInstances: RadioButton[] = [];

            radioOptions.forEach((option: string, idx: number) => {
                const optionValue: string = option;
                const optionText: string = option;
                const row: HTMLDivElement = createElement('div') as HTMLDivElement;
                row.style.marginBottom = '8px';
                wrapper.appendChild(row);

                const rbHost: HTMLInputElement = createElement('input', {
                    id: `${component.name}_${idx}_${optionValue}`,
                    attrs: { type: 'radio' }
                }) as HTMLInputElement;
                row.appendChild(rbHost);

                const rb = new RadioButton({
                    name: component.id,
                    label: optionText,
                    enableRtl: enableRtl,
                    locale: locale,
                    disabled: component.disabled,
                    value: optionValue,
                    htmlAttributes: htmlAttrs,
                    labelPosition: component.fieldLabelPosition as any,
                    checked: component.defaultValue === optionValue || value === optionValue,
                    cssClass: cssClass,
                    change: (args: any) => {
                        if (args.value === optionValue) {
                            onChange(optionValue);
                        }
                    }
                });
                rb.appendTo(rbHost);
                ref(rb, idx);
                if (options.ref && typeof options.ref === 'function') {
                    (options.ref as any)(rb, idx);
                }
                rbInstances.push(rb);
                forwardExtras(rb as any, component as any, [
                    'name', 'options', 'disabled', 'defaultValue',
                    'fieldLabelPosition', 'cssClass', 'htmlAttributes'
                ]);
            });
            if (target) {
                target.appendChild(wrapper);
            }
            return rbInstances;
        }

        case 'dropdown': {
            // Same Vanilla TS fetch adaptation as checkboxGroup (see above).
            const fetchedDropdownOptions: string[] = [];
            OptionFetcher.fetch(component.options, component.id, formState ? formState.values : undefined, components)
                .then((res) => {
                    if (res.id === component.id && res.options.length > 0) {
                        fetchedDropdownOptions.push(...res.options);
                        ddl.dataSource = fetchedDropdownOptions;
                    }
                }).catch(() => { /* swallow */ });
            const resolvedDropdownOptions: any[] = resolveOptions(component.options, fetchedDropdownOptions);
            let finalDropdownOptions: any[] = resolvedDropdownOptions.length > 0
                ? resolvedDropdownOptions
                : (component.options || ['Option 1']) as string[];

            if (component.conditions && component.conditions.choiceBasedField) {
                finalDropdownOptions = ConditionalRuleEngine.getChoiceBasedOptions(
                    component.conditions.choiceBasedField,
                    finalDropdownOptions as string[],
                    formState ? formState.values : undefined,
                    component.conditions.choiceBasedField.primaryFieldId
                );

                if (finalDropdownOptions.length > 0 && value != null && (finalDropdownOptions as string[]).indexOf(value) === -1) {
                    if (formState) { 
                        formState.values[component.id] = null; 
                    }
                }
            }

            const ddl = new DropDownList({
                id: component.name,
                name: component.id,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                locale: locale,
                enableRtl: enableRtl,
                cssClass: cssClass,
                dataSource: finalDropdownOptions,
                value: formState.values[component.id] !== undefined ? formState.values[component.id] : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                showClearButton: component.showClearButton || false,
                readonly: component.readOnly || false,
                enableVirtualization: component.enableVirtualization || false,
                popupHeight: component.popupHeight || '300px',
                popupWidth: component.popupWidth || '100%',
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            // Inject services (VirtualScroll) for the virtualization path.
            DropDownList.Inject(VirtualScroll);
            if (target) {
                ddl.appendTo(target);
            }
            forwardExtras(ddl, component as any, [
                'name', 'defaultValue', 'showClearButton', 'readOnly',
                'enableVirtualization', 'popupHeight', 'popupWidth',
                'cssClass', 'htmlAttributes', 'floatLabelType', 'placeholder',
                'disabled', 'fields', 'groupBy'
            ]);
            ref(ddl);
            return ddl;
        }

        case 'multiselect': {
            const fetchedMultiSelectOptions: string[] = [];
            OptionFetcher.fetch(component.options, component.id, formState ? formState.values : undefined, components)
                .then((res) => {
                    if (res.id === component.id && res.options.length > 0) {
                        fetchedMultiSelectOptions.push(...res.options);
                        ms.dataSource = fetchedMultiSelectOptions;
                    }
                }).catch(() => { /* swallow */ });
            const resolvedMultiSelectOptions: any[] = resolveOptions(component.options, fetchedMultiSelectOptions);
            const finalMultiSelectOptions: any[] = resolvedMultiSelectOptions.length > 0
                ? resolvedMultiSelectOptions
                : (component.options || ['Option 1']) as string[];

            const ms = new MultiSelect({
                name: component.id,
                enableRtl: enableRtl,
                locale: locale,
                floatLabelType: commonProps.floatLabelType,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                placeholder: component.placeholder,
                dataSource: finalMultiSelectOptions,
                fields: { text: 'text', value: 'value' },
                showClearButton: component.showClearButton || false,
                readonly: component.readOnly || false,
                allowCustomValue: component.allowCustomValue || false,
                addTagOnBlur: component.addTagOnBlur || false,
                delimiterChar: component.delimiterChar || ',',
                showSelectAll: component.showSelectAll || false,
                mode: component.showSelectAll ? 'CheckBox' : (component.visualMode ? component.visualMode : undefined),
                selectAllText: component.selectAllText,
                unSelectAllText: component.unSelectAllText,
                showDropDownIcon: component.showDropDownIcon !== false,
                enableVirtualization: component.enableVirtualization || false,
                popupHeight: component.popupHeight || '300px',
                popupWidth: component.popupWidth || '100%',
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            MultiSelect.Inject(CheckBoxSelection, VirtualScroll);
            if (target) {
                ms.appendTo(target);
            }
            forwardExtras(ms, component as any, [
                'name', 'defaultValue', 'placeholder', 'showClearButton',
                'readOnly', 'allowCustomValue', 'addTagOnBlur',
                'delimiterChar', 'showSelectAll', 'visualMode', 'selectAllText',
                'unSelectAllText', 'showDropDownIcon', 'enableVirtualization',
                'popupHeight', 'popupWidth', 'cssClass', 'htmlAttributes',
                'floatLabelType', 'disabled'
            ]);
            ref(ms);
            return ms;
        }

        case 'date': {
            const dp = new DatePicker({
                floatLabelType: commonProps.floatLabelType,
                id: component.name,
                name: component.id,
                enableRtl: enableRtl,
                locale: locale,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                format: component.format || 'MM/dd/yyyy',
                readOnly: component.readOnly || false,
                showClearButton: component.showClearButton === undefined ? false : component.showClearButton,
                showTodayButton: component.showTodayButton !== false ? true : false,
                calendarMode: (component.calendarMode as any) || 'Gregorian',
                dayHeaderFormat: (component.dayHeaderFormat as any) || 'Short',
                depth: (component.depth as any) || 'Month',
                start: (component.start as any) || 'Month',
                firstDayOfWeek: component.firstDayOfWeek || 0,
                min: component.minDate ? new Date(component.minDate) : undefined,
                max: component.maxDate ? new Date(component.maxDate) : undefined,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            DatePicker.Inject(Islamic);
            if (target) {
                dp.appendTo(target);
            }
            forwardExtras(dp, component as any, [
                'name', 'defaultValue', 'format', 'readOnly', 'showClearButton',
                'showTodayButton', 'calendarMode', 'dayHeaderFormat',
                'depth', 'start', 'firstDayOfWeek', 'minDate', 'maxDate',
                'cssClass', 'htmlAttributes', 'floatLabelType', 'placeholder',
                'disabled'
            ]);
            ref(dp);
            return dp;
        }

        case 'dateTime': {
            const dtp = new DateTimePicker({
                id: component.name,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                locale: locale,
                enableRtl: enableRtl,
                name: component.id,
                dayHeaderFormat: (component.dayHeaderFormat as any) || 'Short',
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                format: component.format || 'MM/dd/yyyy hh:mm a',
                showClearButton: component.showClearButton === undefined ? false : component.showClearButton,
                showTodayButton: component.showTodayButton !== false ? true : false,
                depth: (component.depth as any) || 'Month',
                start: (component.start as any) || 'Month',
                step: component.step || 1,
                readonly: component.readOnly || false,
                min: component.minDate ? new Date(component.minDate) : undefined,
                max: component.maxDate ? new Date(component.maxDate) : undefined,
                minTime: component.minTime ? new Date(`2000-01-01 ${component.minTime}`) : undefined,
                maxTime: component.maxTime ? new Date(`2000-01-01 ${component.maxTime}`) : undefined,
                enableMask: false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            DateTimePicker.Inject(Islamic);
            if (target) {
                dtp.appendTo(target);
            }
            forwardExtras(dtp, component as any, [
                'name', 'defaultValue', 'format', 'showClearButton',
                'showTodayButton', 'dayHeaderFormat', 'depth', 'start', 'step',
                'minDate', 'maxDate', 'minTime', 'maxTime', 'readOnly',
                'cssClass', 'htmlAttributes', 'floatLabelType', 'placeholder',
                'disabled'
            ]);
            ref(dtp);
            return dtp;
        }

        case 'time': {
            const tp = new TimePicker({
                id: component.name,
                locale: locale,
                name: component.id,
                enableRtl: enableRtl,
                floatLabelType: commonProps.floatLabelType,
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                format: component.format || 'hh:mm a',
                showClearButton: component.showClearButton === undefined ? false : component.showClearButton,
                step: component.step || 30,
                readonly: component.readOnly || false,
                min: component.minTime ? new Date(`2000-01-01 ${component.minTime}`) : undefined,
                max: component.maxTime ? new Date(`2000-01-01 ${component.maxTime}`) : undefined,
                enableMask: false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            if (target) {
                tp.appendTo(target);
            }
            forwardExtras(tp, component as any, [
                'name', 'defaultValue', 'format', 'showClearButton',
                'step', 'minTime', 'maxTime', 'readOnly',
                'cssClass', 'htmlAttributes', 'floatLabelType', 'placeholder',
                'disabled'
            ]);
            ref(tp);
            return tp;
        }

        case 'dateRange': {
            const drp = new DateRangePicker({
                id: component.name,
                locale: locale,
                enableRtl: enableRtl,
                name: component.id,
                floatLabelType: commonProps.floatLabelType,
                dayHeaderFormat: (component.dayHeaderFormat as any) || 'Short',
                placeholder: commonProps.placeholder,
                enabled: commonProps.enabled,
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : null),
                depth: (component.depth as any) || 'Month',
                start: (component.start as any) || 'Month',
                min: component.minDate ? new Date(component.minDate) : undefined,
                max: component.maxDate ? new Date(component.maxDate) : undefined,
                format: component.format || 'MM/dd/yyyy',
                separator: component.separator || ' - ',
                showClearButton: component.showClearButton === undefined ? false : component.showClearButton,
                readonly: component.readOnly || false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            if (target) {
                drp.appendTo(target);
            }
            forwardExtras(drp, component as any, [
                'name', 'defaultValue', 'format', 'separator',
                'showClearButton', 'minDate', 'maxDate', 'readOnly',
                'dayHeaderFormat', 'depth', 'start',
                'cssClass', 'htmlAttributes', 'floatLabelType', 'placeholder',
                'disabled'
            ]);
            ref(drp);
            return drp;
        }

        case 'switch': {
            const sw = new Switch({
                locale: locale,
                enableRtl: enableRtl,
                value: component.defaultValue as string,
                name: component.id,
                checked: ((component.checked !== undefined && component.checked !== null ? component.checked : false) || (value !== undefined && value !== null ? value : false)),
                disabled: component.disabled,
                onLabel: component.onLabel || '',
                offLabel: component.offLabel || '',
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                change: (args: any) => onChange(args.checked)
            });
            if (target) {
                applyHostId(target, component.name);
                sw.appendTo(target);
            }
            forwardExtras(sw, component as any, [
                'name', 'defaultValue', 'checked', 'onLabel', 'offLabel',
                'cssClass', 'htmlAttributes'
            ]);
            ref(sw);
            return sw;
        }

        case 'button': {
            const groupButtons: any[] = (component.buttonsGroups || (component.buttons as any) || []) as any[];
            if (groupButtons && groupButtons.length > 0) {
                const groupStyleObj: any = {
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: component.gap || '8px',
                    justifyContent: mapPositionToJustifyContent(component.position),
                    width: component.width || undefined,
                    maxWidth: '100%'
                };
                const groupContainer: HTMLDivElement = createElement('div', {
                    id: component.name,
                    attrs: {
                        role: 'group',
                        'aria-label': component.label || 'Button Group',
                        className: `${cssClass} ${enableRtl ? 'e-rtl' : ''}`
                    }
                }) as HTMLDivElement;
                Object.assign(groupContainer.style, groupStyleObj);
                const btnInstances: Button[] = [];

                groupButtons.forEach((btnDef: any, idx: number) => {
                    const btnId: string = `${component.name}_${idx}`;
                    let btnCssClass: string = [mapButtonStyleToClass(btnDef.style)].filter(Boolean).join(' ');
                    btnCssClass += component.size === 'Small' ? ' e-small' : component.size === 'Bigger' ? ' e-bigger' : ''
                    const resolvedGroupType: 'submit' | 'reset' | 'button' = resolveButtonType(btnDef.type);
                    const btnHost: HTMLButtonElement = createElement('button', {
                        id: String(btnId),
                        attrs: { name: String(btnId), type: resolvedGroupType }
                    }) as HTMLButtonElement;
                    groupContainer.appendChild(btnHost);

                    const btnInst: Button = new Button({
                        locale: locale,
                        enableRtl: enableRtl,
                        cssClass: btnCssClass,
                        disabled: btnDef.disabled || false,
                        content: btnDef.label || `Button ${idx + 1}`,
                        iconCss: btnDef.iconCss,
                        iconPosition: btnDef.iconPosition
                    });
                    btnInst.appendTo(btnHost);
                    btnInst.element.onclick = (event: any): void => {
                        if (onClick) { onClick(event); }
                    };
                    ref(btnInst, idx);
                    btnInstances.push(btnInst);
                    if (options.ref && typeof options.ref === 'function') {
                        (options.ref as any)(btnInst, idx);
                    }
                });

                if (target) {
                    target.appendChild(groupContainer);
                }
                for (let bi: number = 0; bi < btnInstances.length; bi++) {
                    forwardExtras(btnInstances[bi] as any, component as any, [
                        'buttonsGroups', 'gap', 'position', 'size', 'cssClass'
                    ]);
                }

                return btnInstances;
            }

            // Fallback: single ButtonComponent when no group is configured.
            const resolvedButtonType: 'submit' | 'reset' | 'button' = resolveButtonType(component.buttonType as any);
            const buttonCssClassList: string = [
                mapButtonStyleToClass(component.style),
                resolvedButtonType === 'submit' ? 'submit-btn form-submit-type' : '',
                resolvedButtonType === 'reset' ? 'form-reset-type' : '',
                component.cssClass || 'e-primary',
                component.size === 'Small' ? ' e-small' : component.size === 'Bigger' ? ' e-bigger' : ''
            ].filter(Boolean).join(' ') || 'e-primary';

            const buttonContainerStyle: any = {
                display: 'flex',
                justifyContent: mapPositionToJustifyContent(component.position),
                width: component.width || '100%'
            };
            const container: HTMLDivElement = createElement('div', {
                id: `${component.name}-container`
            }) as HTMLDivElement;
            Object.assign(container.style, buttonContainerStyle);

            const btnHost: HTMLButtonElement = createElement('button', {
                id: component.name,
                attrs: { type: resolvedButtonType }
            }) as HTMLButtonElement;
            container.appendChild(btnHost);

            const btnInst: Button = new Button({
                enableRtl: enableRtl,
                locale: locale,
                cssClass: buttonCssClassList,
                disabled: component.disabled,
                iconCss: component.iconCss,
                iconPosition: component.iconPosition as any,
                content: component.label,
            });
            btnInst.appendTo(btnHost);
            ref(btnInst)
            btnInst.element.onclick = (event: any): void => {
                if (onClick) { onClick(event); }
            };
            if (target) {
                target.appendChild(container);
            }
            forwardExtras(btnInst, component as any, [
                'buttonType', 'style', 'iconCss', 'iconPosition',
                'cssClass', 'position', 'size', 'disabled'
            ]);
            return btnInst;
        }

        case 'splitButton': {
            const splitButtonCssClassList: string = [
                component.style === 'primary' ? 'e-primary' : '',
                component.style === 'flat' ? '' : '',
                component.style === 'information' ? 'e-info' : '',
                component.style === 'error' ? 'e-danger' : '',
                component.style === 'success' ? 'e-success' : '',
                component.style === 'warning' ? 'e-warning' : '',
                component.cssClass || '',
                component.size === 'Small' ? ' e-small' : component.size === 'Bigger' ? ' e-bigger' : ''
            ].filter(Boolean).join(' ') || (undefined as any);

            const splitButtonContainerStyle: any = {
                display: 'flex',
                justifyContent: mapPositionToJustifyContent(component.position)
            };
            const container: HTMLDivElement = createElement('div', {
                id: `${component.name}-container`,
                attrs: { 'aria-label': 'Splitbutton' }
            }) as HTMLDivElement;
            Object.assign(container.style, splitButtonContainerStyle);

            const items: ItemModel[] = (component.options && component.options.length > 0
                ? component.options.map((option: string, index: number) => (/* eslint-disable-next-line */ ({
                    text: option,
                    id: `${component.id}_option_${index}`
                } as any)))
                : [/* eslint-disable-next-line */ ({ text: 'Option 1', id: `${component.id}_option_0` } as any)]) as any;

            const sbHost: HTMLButtonElement = createElement('button', {
                id: component.name
            }) as HTMLButtonElement;
            container.appendChild(sbHost);

            const sb = new SplitButton({
                locale: locale,
                enableRtl: enableRtl,
                content: component.label || 'Split Button',
                items: items,
                cssClass: splitButtonCssClassList,
                disabled: component.disabled,
                iconCss: component.iconCss,
                iconPosition: (component.iconPosition as any) || 'Left',
                click: (args: ClickEventArgs) => {
                    if (onClick) {
                        onClick({ ...args });
                    }
                },
                select: (args: MenuEventArgs) => {
                    if (onClick) {
                        onClick({
                            ...args,
                            selectedItem: args.item.text
                        });
                    }
                }
            });
            sb.appendTo(sbHost);
            if (target) {
                target.appendChild(container);
            }
            forwardExtras(sb, component as any, [
                'options', 'style', 'iconCss', 'iconPosition',
                'cssClass', 'position', 'disabled'
            ]);
            ref(sb)
            return sb;
        }

        case 'signature': {
            const canvas: HTMLCanvasElement = createElement('canvas', {
                id: component.name,
                className: cssClass
            }) as HTMLCanvasElement;
            const sig = new Signature({
                enableRtl: enableRtl,
                locale: locale,
                backgroundColor: component.backgroundColor || '',
                strokeColor: component.strokeColor || '',
                maxStrokeWidth: component.maxValue as number,
                minStrokeWidth: component.minValue as number,
                velocity: component.velocity,
                disabled: component.disabled,
                change: () => onChange(component.name)
            });
            if (target) {
                sig.appendTo(canvas);
                target.appendChild(canvas);
            }
            forwardExtras(sig, component as any, [
                'backgroundColor', 'strokeColor', 'maxValue', 'minValue', 'velocity'
            ]);
            ref(sig)
            return sig;
        }

        case 'rating': {
            const rt = new Rating({
                enableRtl: enableRtl,
                locale: locale,
                value: value !== undefined ? value : (component.defaultValue || 0),
                disabled: component.disabled,
                cssClass: cssClass,
                allowReset: component.allowReset,
                itemsCount: component.itemsCount,
                min: component.minValue as number,
                precision: component.precision as string,
                readOnly: component.readOnly,
                showTooltip: component.showRatingTooltip || false,
                showLabel: component.showRatingLabel,
                labelPosition: component.showRatingLabel ? component.ratingLabelPosition : undefined,
                valueChanged: (args: any) => onChange(args.value)
            });
            if (target) {
                applyHostId(target, component.name);
                target.setAttribute('name', component.id);
                rt.appendTo(target);
            }
            forwardExtras(rt, component as any, [
                'defaultValue', 'allowReset', 'itemsCount', 'minValue',
                'precision', 'readOnly', 'showRatingTooltip',
                'showRatingLabel', 'ratingLabelPosition', 'cssClass', 'labelPosition'
            ]);
            ref(rt)
            return rt;
        }

        case 'colorPicker': {
            const cp = new ColorPicker({
                enableRtl: enableRtl,
                locale: locale,
                value: value !== undefined ? value : (component.defaultValue || ''),
                disabled: component.disabled,
                enableOpacity: component.enableOpacity,
                showButtons: component.showButtons,
                showRecentColors: component.showRecentColors,
                noColor: component.showNoColor,
                cssClass: cssClass,
                change: (args: any) => onChange(args.value)
            });
            if (target) {
                applyHostId(target, component.name);
                cp.appendTo(target);
            }
            forwardExtras(cp, component as any, [
                'defaultValue', 'enableOpacity', 'showButtons',
                'showRecentColors', 'showNoColor', 'cssClass'
            ]);
            ref(cp)
            return cp;
        }

        case 'inputMask': {
            const im = new MaskedTextBox({
                id: component.name,
                name: component.id,
                enableRtl: enableRtl,
                floatLabelType: component.floatLabelType || 'Never',
                placeholder: component.placeholder || '',
                enabled: !component.disabled,
                locale: locale,
                value: value !== undefined ? value : (component.defaultValue || ''),
                mask: component.mask || '000-000-0000',
                promptChar: component.promptChar || '_',
                customCharacters: component.customCharacters,
                readOnly: component.readOnly || false,
                showClearButton: component.showClearButton !== false,
                cssClass: cssClass,
                htmlAttributes: htmlAttrs,
                appendTemplate: component.suffix,
                prependTemplate: component.prefix,
                ...createValidationHandlers((args: any) => args.value || '')
            });
            if (target) {
                im.appendTo(target);
            }
            forwardExtras(im, component as any, [
                'name', 'defaultValue', 'mask', 'promptChar',
                'customCharacters', 'readOnly', 'showClearButton',
                'cssClass', 'htmlAttributes', 'suffix', 'prefix',
                'floatLabelType', 'placeholder', 'disabled'
            ]);
            ref(im)
            return im;
        }

        case 'rangeSlider': {
            const sl = new Slider({
                enableRtl: enableRtl,
                locale: locale,
                value: value !== undefined ? value : (component.defaultValue !== undefined && component.defaultValue !== null ? component.defaultValue : 0),
                min: component.minValue || 0,
                max: component.maxValue || 100,
                step: component.step || 1,
                cssClass: cssClass,
                enabled: !component.disabled,
                readonly: component.readOnly,
                showButtons: component.showButtons,
                change: (args: any) => onChange(args.value)
            });
            if (target) {
                applyHostId(target, component.name);
                sl.appendTo(target);
            }
            forwardExtras(sl, component as any, [
                'defaultValue', 'minValue', 'maxValue', 'step',
                'cssClass', 'readOnly', 'showButtons'
            ]);
            ref(sl)
            return sl;
        }

        case 'fileUpload': {
            const up = new Uploader(({
                enableRtl: enableRtl,
                locale: locale,
                type: 'file',
                enabled: !component.disabled,
                allowedExtensions: component.allowExtensions,
                asyncSettings: { saveUrl: component.saveUrl, removeUrl: component.removeUrl } as any,
                buttons: component.buttons || {
                    'browse': 'Choose File',
                    'clear': 'Clear All',
                    'upload': 'Upload All'
                },
                maxFileSize: component.maxValue as number,
                minFileSize: component.minValue as number,
                multiple: !!component.allowMultiple,
                showFileList: component.showFileList,
                htmlAttributes: htmlAttrs,
                cssClass: cssClass,
                change: (args: any) => onChange(args.file)
            } as any));
            if (target) {
                applyHostId(target, component.name);
                up.appendTo(target);
            }
            forwardExtras(up, component as any, [
                'allowExtensions', 'saveUrl', 'removeUrl',
                'buttons', 'maxValue', 'minValue',
                'allowMultiple', 'showFileList',
                'htmlAttributes', 'cssClass'
            ]);
            ref(up)
            return up;
        }

        case 'imageEditor': {
            const ie = new ImageEditor({
                locale: locale,
                enableRtl: enableRtl,
                disabled: component.disabled,
                cssClass: cssClass,
                height: ((component.height != null ? component.height : '350px') as any).toString(),
                width: ((component.width != null ? component.width : '100%') as any).toString(),
                editComplete: () => onChange(component.name),
                fileOpened: () => onChange(component.name)
            });
            if (target) {
                applyHostId(target, component.name);
                ie.appendTo(target);
            }
            forwardExtras(ie, component as any, [
                'height', 'width', 'cssClass'
            ]);
            ref(ie)
            return ie;
        }

        case 'message': {
            const msg = new Message({
                locale: locale,
                enableRtl: enableRtl,
                severity: component.severity || component.messageType || 'info',
                variant: component.variant as any,
                content: component.content || 'Message',
                showCloseIcon: component.showCloseIcon,
                showIcon: ((component.showIcon === undefined ? false : component.showIcon) || false),
                cssClass: cssClass
            });
            if (target) {
                applyHostId(target, component.name);
                msg.appendTo(target);
            }
            forwardExtras(msg, component as any, [
                'severity', 'messageType', 'variant', 'content',
                'showCloseIcon', 'showIcon', 'cssClass'
            ]);
            ref(msg)
            return msg;
        }

        case 'dataGrid': {
            const dg: any = component as any;
            const conditionalDataResult: any = resolveConditionalData(dg.conditions, (formState && formState.values) || {});
            const conditionalData: any = conditionalDataResult ? conditionalDataResult.dataSource : undefined;
            const conditionalColumns: any = conditionalDataResult ? conditionalDataResult.columns : undefined;

            const effectiveDataSource: any = conditionalData || dg.dataSource;
            const fetchedDataSource: string[] = [];
            OptionFetcher.fetch(
                conditionalData || dg.dataSource,
                dg.id,
                formState && formState.values,
                components as any
            ).then((res) => {
                if (res.id === dg.id && res.options.length > 0) {
                    const newDataSource = resolveOptions(
                        conditionalData || dg.dataSource,
                        res.options,
                        fetchedLookupDataSource
                    );
                    gridComp.setDataSource(newDataSource);
                }
            });

            const fetchedLookupDataSource: any[] = [];
            const resolvedDataSource: any[] = conditionalData
                ? resolveOptions(conditionalData, fetchedDataSource, fetchedLookupDataSource)
                : resolveOptions(dg.dataSource, fetchedDataSource, fetchedLookupDataSource);
            const finalDataSource: any[] = resolvedDataSource.length > 0 ? resolvedDataSource : (dg.dataSource !== undefined && dg.dataSource !== null ? dg.dataSource : []);
            const finalColumns: any = conditionalColumns && conditionalColumns.length > 0 ? conditionalColumns : (dg.columns !== undefined && dg.columns !== null ? dg.columns : []);

            const gridHost: HTMLElement = target || createElement('div', {
                id: dg.name,
                className: dg.cssClass
            }) as HTMLDivElement;

            if (target) {
                applyHostId(target, component.name);
            }

            const gridComp = new DataGridComponent(({
                locale: locale,
                name: dg.name || '',
                columns: finalColumns,
                enableRtl: enableRtl,
                dataSource: (finalDataSource !== undefined && finalDataSource.length > 0) ? finalDataSource : value,
                height: (dg.height != null ? dg.height : '200px') as any,
                width: (dg.width != null ? dg.width : '100%') as any,
                pageSize: dg.pageSize || 6,
                allowPaging: dg.allowPaging !== false,
                allowFiltering: dg.allowFiltering,
                allowAdding: dg.allowAdding !== false,
                allowEditing: dg.allowEditing !== false,
                allowDeleting: dg.allowDeleting !== false,
                onDataChange: (data: any[]) => onChange(data),
                cssClass: cssClass,
                target: gridHost,
                ref: ref
            } as any));
            gridComp.render(gridHost);

            if (!initializedGrids.has(component.id) && formState && Array.isArray(finalDataSource)) {
                formState.values[component.id] = finalDataSource;
                (gridComp as any).isInitialized = true;
                initializedGrids.add(component.id);
            }
            forwardExtras(gridComp as any, component as any, [
                'dataSource', 'columns', 'conditions', 'height', 'width',
                'pageSize', 'allowPaging', 'allowFiltering', 'allowAdding',
                'allowEditing', 'allowDeleting', 'cssClass'
            ]);
            if (typeof options.ref === 'function') {
                (options.ref as any)(gridComp);
            } else if (options.ref) {
                (options.ref as any).current = gridComp;
            }
            return target || gridHost;
        }

        case 'richTextEditor': {
            const toolbarSettings: { items: string[] } = {
                items: [
                    'Undo', 'Redo', '|', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'InlineCode', '|',
                    'CreateLink', 'Image', 'CreateTable', 'CodeBlock', 'HorizontalLine', 'Blockquote', 'EmojiPicker', '|',
                    'LineHeight', 'Formats', 'Alignments', '|', 'BulletFormatList', 'NumberFormatList', 'Checklist', '|',
                    'Outdent', 'Indent', '|', 'FontColor', 'BackgroundColor', 'FontName', 'FontSize', '|',
                    'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', '|', 'SourceCode', '|'
                ]
            };
            if (component.enableImportFromWord && component.enableImportFromWord.enabled) {
                toolbarSettings.items.push('ImportWord');
            }
            if (component.enableExportToWord && component.enableExportToWord.enabled) {
                toolbarSettings.items.push('ExportWord');
            }
            if (component.enableExportToPdf && component.enableExportToPdf.enabled) {
                toolbarSettings.items.push('ExportPdf');
            }
            toolbarSettings.items.push('Print');

            const hasValidService = (config: any): boolean =>
                !!config && config.enabled && typeof config.serviceUrl === 'string' && config.serviceUrl.trim() !== '';

            const importWord: ImportWordModel | undefined =
                hasValidService(component.enableImportFromWord)
                    ? {
                        // eslint-disable-next-line security/detect-unsafe-regex
                        serviceUrl: /^(https?:)?\/\//i.test(component.enableImportFromWord ? component.enableImportFromWord.serviceUrl as string : '')
                            ? (component.enableImportFromWord ? component.enableImportFromWord.serviceUrl : '')
                            : `${(settings && settings.hostUrl ? settings.hostUrl : '').replace(/\/+$/, '')}/${(component.enableImportFromWord ? (component.enableImportFromWord.serviceUrl as string) : '').replace(/^\/+/, '')}`
                    }
                    : undefined;
            const exportWord: ExportWordModel | undefined =
                hasValidService(component.enableExportToWord)
                    ? {
                        // eslint-disable-next-line security/detect-unsafe-regex
                        serviceUrl: /^(https?:)?\/\//i.test(component.enableExportToWord ? component.enableExportToWord.serviceUrl as string : '')
                            ? (component.enableExportToWord ? component.enableExportToWord.serviceUrl : '')
                            : `${(settings && settings.hostUrl ? settings.hostUrl : '').replace(/\/+$/, '')}/${(component.enableExportToWord ? (component.enableExportToWord.serviceUrl as string) : '').replace(/^\/+/, '')}`,
                        fileName: 'RichTextEditor.docx',
                        stylesheet: `
                .e-rte-content {
                  font-size: 1em;
                  font-weight: 400;
                  margin: 0;
                }
              `
                    }
                    : undefined;
            const exportPdf: ExportPdfModel | undefined =
                hasValidService(component.enableExportToPdf)
                    ? {
                        // eslint-disable-next-line security/detect-unsafe-regex
                        serviceUrl: /^(https?:)?\/\//i.test(component.enableExportToPdf ? component.enableExportToPdf.serviceUrl as string : '')
                            ? (component.enableExportToPdf ? component.enableExportToPdf.serviceUrl : '')
                            : `${(settings && settings.hostUrl ? settings.hostUrl : '').replace(/\/+$/, '')}/${(component.enableExportToPdf ? (component.enableExportToPdf.serviceUrl as string) : '').replace(/^\/+/, '')}`,
                        fileName: 'RichTextEditor.pdf',
                        stylesheet: `
                .e-rte-content {
                  font-size: 1em;
                  font-weight: 400;
                  margin: 0;
                }
              `
                    }
                    : undefined;
            const rte = new RichTextEditor({
                locale: locale,
                toolbarSettings: toolbarSettings,
                enableRtl: enableRtl,
                value: value !== undefined ? value : (component.defaultValue || ''),
                placeholder: component.placeholder || '',
                enabled: !component.disabled,
                readonly: component.readOnly || false,
                maxLength: component.maxLength || undefined,
                cssClass: cssClass || undefined,
                height: component.height || '300px',
                width: component.width || '100%',
                htmlAttributes: htmlAttrs,
                importWord: importWord,
                exportPdf: exportPdf,
                exportWord: exportWord,
                change: (args: any) => onChange(args.value)
            });
            RichTextEditor.Inject(
                Toolbar, Link, HtmlEditor, QuickToolbar, RTEImage, Count, Table,
                EmojiPicker, PasteCleanup, SlashMenu, CodeBlock, ClipBoardCleanup,
                AutoFormat, ImportExport
            );
            rte.appendTo(target);
            forwardExtras(rte, component as any, [
                'enableImportFromWord', 'enableExportToWord', 'enableExportToPdf',
                'defaultValue', 'placeholder', 'readOnly', 'maxLength', 'cssClass',
                'height', 'width', 'htmlAttributes', 'toolbarSettings'
            ]);
            ref(rte)
            return rte;
        }

        default: {
            const msg = new Message({
                locale: locale,
                enableRtl: enableRtl,
                severity: 'Warning',
                content: `${l10n.getConstant('unsupportedComponent')} : ${component.type}`,
                cssClass: cssClass
            });
            if (target) {
                applyHostId(target, component.name);
                msg.appendTo(target);
            }
            ref(msg)
            return msg;
        }
    }
};
