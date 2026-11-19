import { L10n, createElement } from '@syncfusion/ej2-base';
import { PropertyGroup, PropertyValues } from '../types/component-properties';
import { PropertyDefinition } from '../model/base';
import { PropertyRenderer, RenderedProperty } from './property-renderer';
import { OptionsEditor } from './options-editor';
import { AttributesEditor } from './attributes-editor';
import { ColumnBuilder } from './column-builder';
import { ButtonGroupEditor } from './button-group-editor';
import { ColumnSpanEditor } from './column-span-editor';
import { MinMaxValueEditor } from './min-max-value-editor';
import { ExpressionEditor } from './expression-editor';
import { LookupConfig } from './lookup-config';
import { CustomValidationEditor } from './custom-validation-editor';
import { URLImportEditor } from './url-import-editor';
import { FormNode } from '@syncfusion/ej2-form-renderer';
import { DataSourceCollector } from './data-source-collector';
import { AsyncSettings } from '@syncfusion/ej2-inputs';

/** @private */
export interface PropertyGroupRendererOptions {
    groupName: string;
    properties: PropertyDefinition[];
    host: HTMLElement;
    existingValues: PropertyValues;
    initialValues: PropertyValues;
    onChange: (key: string, value: any) => void;
    l10n: L10n;
    enableRtl?: boolean;
    locale: string;
    mode?: 'Simple' | 'Developer';
    formSchema?: any;
    availableFields?: FormNode[];
}

/** @private */
const SPECIALISED_TYPES: { [key: string]: boolean } = {
    'options': true,
    'attributes': true,
    'datagridcolumns': true,
    'buttonGroup': true,
    'columnspaneditor': true,
    'minMaxEditor': true,
    'expression': true,
    'lookupconfig': true,
    'customValidation': true,
    'URLImport': true,
    'json': true
};

/** @private */
export class PropertyGroupRenderer {

    /** @private */
    public static render(opts: PropertyGroupRendererOptions): Map<string, RenderedProperty | { id: string; instance: any }> {
        const instances: Map<string, RenderedProperty | { id: string; instance: any }> = new Map();
        const propertyRenderer: PropertyRenderer = new PropertyRenderer();
        const {
            groupName, properties, host, existingValues,
            initialValues, onChange, l10n, locale, mode,
            formSchema, availableFields, enableRtl
        } = opts;

        const groupWrapper: HTMLElement = createElement('div', {
            className: 'property-group',
            attrs: { 'aria-label': 'property-group' }
        });
        host.appendChild(groupWrapper);

        const contentWrapper: HTMLElement = createElement('div', {
            className: 'property-group-content'
        });
        groupWrapper.appendChild(contentWrapper);

        for (const prop of properties) {
            if (groupName === 'Conditions' && prop.key === 'conditions') {
                continue;
            }

            if (mode === 'Simple' && (prop as any).componentType === 'developer') {
                continue;
            }
            if ((prop as any).mode === 'developer' && mode === 'Simple') {
                continue;
            }

            const value: any = initialValues ? initialValues[prop.key] : existingValues[prop.key];
            const propHost: HTMLElement = createElement('div', {
                className: 'property-item',
                attrs: { 'data-property-key': prop.key, 'data-property-type': prop.type }
            });
            contentWrapper.appendChild(propHost);

            if (SPECIALISED_TYPES[prop.type]) {
                const specialisedInstance: any = PropertyGroupRenderer.renderSpecialised(
                    prop, value, propHost, onChange, l10n, locale, mode, existingValues, availableFields, formSchema, enableRtl
                );
                instances.set(prop.key, { id: `prop-${prop.type}-${prop.key}`, instance: specialisedInstance });
            } else {
                const rendered: RenderedProperty = propertyRenderer.render({
                    prop: prop,
                    value: value,
                    host: propHost,
                    onChange: onChange,
                    l10n: l10n,
                    locale: locale,
                    mode: mode,
                    existingValues: existingValues,
                    enableRtl: enableRtl
                });
                instances.set(prop.key, rendered);
            }
        }

        return instances;
    }

    /** @private */
    public static destroy(instances: Map<string, any>): void {
        instances.forEach((entry: any) => {
            if (entry && entry.instance) {
                try {
                    if (typeof entry.instance.destroy === 'function') {
                        entry.instance.destroy();
                    }
                } catch {
                    // best-effort
                }
            }
        });
        instances.clear();
    }

    private static renderSpecialised(
        prop: PropertyDefinition,
        value: any,
        propHost: HTMLElement,
        onChange: (key: string, value: any) => void,
        l10n: L10n,
        locale: string,
        mode: 'Simple' | 'Developer' | undefined,
        existingValues: PropertyValues | undefined,
        availableFields: FormNode[] | undefined,
        formSchema: any,
        enableRtl?: boolean
    ): any {
        const boundOnChange: (val: any) => void = (val: any) => onChange(prop.key, val);
        const fieldShell: HTMLElement = createElement('div', { className: 'property-field' });

        if (prop.label && prop.type !== 'customValidation' && prop.type !== 'json' && prop.type !== 'datagridcolumns') {
            const label: HTMLElement = createElement('label', {
                className: 'property-label',
                attrs: { 'for': `prop-${prop.type}-${prop.key}` }
            });
            label.textContent = l10n.getConstant(prop.label as any) || prop.label;
            fieldShell.appendChild(label);
        }

        if (prop.description) {
            const description: HTMLElement = createElement('p', {
                className: 'property-description'
            });
            description.textContent = l10n.getConstant(prop.description as any) || prop.description;
            fieldShell.appendChild(description);
        }

        const contentHost: HTMLElement = createElement('div', {
            className: 'property-field-content'
        });
        fieldShell.appendChild(contentHost);
        propHost.appendChild(fieldShell);

        switch (prop.type) {
            case 'options': {
                const componentType: string = prop.componentType || 'options';
                const useDataSourceCollector: boolean = mode !== 'Simple' && ['fromurl'].indexOf(componentType.toLowerCase()) !== -1;

                if (useDataSourceCollector) {
                    const editor: any = new DataSourceCollector({
                        enableRtl: enableRtl,
                        host: contentHost,
                        datakey: 'data',
                        value: value ||  [],
                        onChange: boundOnChange,
                        type: componentType,
                        isAccordion: false,
                        l10n: l10n
                    });
                    editor.render();
                    return editor;
                } else {
                    const editor: OptionsEditor = new OptionsEditor({
                        enableRtl: enableRtl,
                        host: contentHost,
                        options: Array.isArray(value) ? value : [l10n.getConstant('defaultOptionValue')],
                        type: componentType,
                        l10n: l10n,
                        onChange: boundOnChange
                    });
                    editor.render();
                    return editor;
                }
            }

            case 'attributes': {
                const editor: AttributesEditor = new AttributesEditor({
                    enableRtl: enableRtl,
                    host: contentHost,
                    attributes: Array.isArray(value) ? value : [],
                    l10n: l10n,
                    onChange: boundOnChange
                });
                editor.render();
                return editor;
            }

            case 'datagridcolumns': {
                const columnFieldSuggestions: string[] = (availableFields || [])
                    .map((field: any) => field && field.name ? field.name : '')
                    .filter((fieldName: string) => !!fieldName);
                const editor: ColumnBuilder = new ColumnBuilder({
                    enableRtl: enableRtl,
                    host: contentHost,
                    columns: Array.isArray(value) ? value : [],
                    l10n: l10n,
                    onChange: boundOnChange,
                    fieldSuggestions: columnFieldSuggestions,
                    formSchema: formSchema,
                    name: existingValues.name
                });
                editor.render();
                return editor;
            }

            case 'buttonGroup': {
                const editor: ButtonGroupEditor = new ButtonGroupEditor({
                    enableRtl: enableRtl,
                    host: contentHost,
                    buttons: Array.isArray(value) ? value : (prop.default || []),
                    l10n: l10n,
                    onChange: boundOnChange
                });
                editor.render();
                return editor;
            }

            case 'columnspaneditor': {
                var columnCount: number = (existingValues && (existingValues as any).columns) ? (existingValues as any).columns : 2;
                var initialWidths: (number | null)[] | undefined = value && (value as any).widths ? (value as any).widths : undefined;
                var wrappedOnChange: (widths: (number | null)[]) => void = (widths: (number | null)[]) => {
                    boundOnChange({ widths: widths });
                };
                const editor: ColumnSpanEditor = new ColumnSpanEditor({
                    enableRtl: enableRtl,
                    host: contentHost,
                    columnCount: columnCount,
                    initialWidths: initialWidths,
                    l10n: l10n,
                    onChange: wrappedOnChange
                });
                editor.render();
                return editor;
            }

            case 'minMaxEditor': {
                const editor: MinMaxValueEditor = new MinMaxValueEditor({
                    enableRtl: enableRtl,
                    host: contentHost,
                    label: l10n.getConstant(prop.label as any) || prop.label,
                    initialValue: Array.isArray(value) ? value : (prop.default || []),
                    editorMode: prop.editorMode || 'number',
                    l10n: l10n,
                    locale: locale,
                    onChange: boundOnChange,
                    disabled: false,
                    currentFieldId: existingValues && (existingValues as any).name ? (existingValues as any).name : undefined,
                    builderMode: mode,
                    availableFields: (availableFields || []) as any
                });
                editor.render();
                return editor;
            }

            case 'expression': {
                const editor: ExpressionEditor = new ExpressionEditor({
                    host: contentHost,
                    expression: value || prop.default || '',
                    availableFields: (availableFields || []) as any,
                    l10n: l10n,
                    onExpressionChange: boundOnChange
                });
                editor.render();
                return editor;
            }

            // case 'lookupconfig': {
            //     const editor: LookupConfig = new LookupConfig({
            //         host: contentHost,
            //         value: value,
            //         l10n: l10n,
            //         onChange: boundOnChange
            //     });
            //     editor.render();
            //     return editor;
            // }

            case 'customValidation': {
                const editor: CustomValidationEditor = new CustomValidationEditor(contentHost,{
                    enableRtl: enableRtl,
                    componentFields: availableFields || [],
                    excludeFieldId: existingValues ? existingValues['name'] : undefined,
                    values: prop,
                    existingRules: existingValues ? existingValues['customValidation'] : undefined,
                    l10n: l10n,
                    onChange: boundOnChange
                });
                return editor;
            }

            case 'json': {
                const editor: any = new DataSourceCollector({
                    enableRtl: enableRtl,
                    host: contentHost,
                    datakey: 'data',
                    value: value !== undefined ? value : (prop.default || '[]'),
                    onChange: boundOnChange,
                    type: 'grid',
                    isAccordion: true,
                    l10n: l10n
                });
                editor.render();
                return editor;
            }

            case 'URLImport': {
                const editor: URLImportEditor = new URLImportEditor({
                    host: contentHost,
                    value: value,
                    l10n: l10n,
                    onChange: boundOnChange
                });
                editor.render();
                return editor;
            }

            default:
                return null;
        }
    }
}
