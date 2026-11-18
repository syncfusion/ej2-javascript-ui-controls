import { FormNode, FormSchema } from '@syncfusion/ej2-form-renderer';
import { WidgetConfig } from '../types/component-properties';

/** @private */
export interface PendingDropContext {
    isNested: boolean;
    parentId?: string;
    cellInfo?: { row: number; col: number; tabIndex?: number };
    parentPath?: string;
    targetIndex?: number | null;
    targetPosition?: 'before' | 'after' | null;
}

/** @private */
export interface PendingWidgetSwitch {
    fieldId: string;
    originalComponent: FormNode;
    newWidgetType: string;
}

/** @private */
function has(props: Record<string, any>, key: string): boolean {
    return props[key as string] !== undefined;
}

/** @private */
function lower(value: any): any {
    return (typeof value === 'string') ? value.toLowerCase() : value;
}

/** @private */
type FormSettingsLike = {
    [key: string]: any;
};

/** @private */
export function mapPropertiesToWidget(
    baseComponent: FormNode,
    props: Record<string, any>,
    formSchema: FormSchema,
    config?: WidgetConfig
): FormNode {
    const settings: FormSettingsLike = (formSchema && formSchema.settings)
        ? formSchema.settings
        : ({} as FormSettingsLike);
    const base: any = baseComponent as any;

    const updated: any = Object.assign({}, base, {
        // Display
        label: has(props, 'label') ? props.label : base.label,
        name: has(props, 'name') ? props.name : base.name,
        description: (has(props, 'description') || props.description === '')
            ? props.description
            : undefined,
        prefix: (has(props, 'prefix') || props.prefix === '')
            ? props.prefix
            : undefined,
        suffix: (has(props, 'suffix') || props.suffix === '')
            ? props.suffix
            : undefined,
        conditions: has(props, 'conditions') ? props.conditions : undefined,
        customValidation: has(props, 'customValidation')
            ? props.customValidation
            : base.customValidation,
        pageSize: has(props, 'pageSize') ? props.pageSize : base.pageSize,
        // size — settings win
        size: (settings.size !== undefined)
            ? settings.size
            : (has(props, 'size') ? props.size : base.size),
        allowPaging: has(props, 'allowPaging') ? props.allowPaging : base.allowPaging,
        allowAdding: has(props, 'allowAdding') ? props.allowAdding : base.allowAdding,
        allowFiltering: has(props, 'allowFiltering') ? props.allowFiltering : base.allowFiltering,
        allowEditing: has(props, 'allowEditing') ? props.allowEditing : base.allowEditing,
        allowDeleting: has(props, 'allowDeleting') ? props.allowDeleting : base.allowDeleting,
        dataSource: has(props, 'dataSource') ? props.dataSource : (base.dataSource || []),
        cardTitle: has(props, 'cardTitle') ? props.cardTitle : base.cardTitle,
        cardSubtitle: has(props, 'cardSubtitle') ? props.cardSubtitle : base.cardSubtitle,
        textboxType: has(props, 'textboxType')
            ? lower(props.textboxType)
            : (base.textboxType ? base.textboxType.toLowerCase() : base.textboxType),
        hideBorders: has(props, 'hideBorders') ? props.hideBorders : base.hideBorders,
        placeholder: has(props, 'placeholder') ? props.placeholder : base.placeholder,
        defaultValue: has(props, 'defaultValue') ? props.defaultValue : base.defaultValue,
        expressionValue: has(props, 'expressionValue') ? props.expressionValue : base.expressionValue,
        disabled: has(props, 'disabled') ? props.disabled : (base.disabled || false),
        visible: has(props, 'visible') ? props.visible : (base.visible || false),
        tooltip: has(props, 'tooltip') ? props.tooltip : base.tooltip,
        cssClass: has(props, 'cssClass') ? props.cssClass : base.cssClass,
        // hideLabel — settings win
        hideLabel: (settings.hideLabel !== undefined)
            ? settings.hideLabel
            : (has(props, 'hideLabel') ? props.hideLabel : (base.hideLabel || false)),
        labelPosition: has(props, 'labelPosition')
            ? props.labelPosition
            : (base.labelPosition || 'top'),
        checkboxLabelPosition: has(props, 'checkboxLabelPosition')
            ? props.checkboxLabelPosition
            : (base.checkboxLabelPosition || 'After'),
        layoutDirection: has(props, 'layoutDirection')
            ? lower(props.layoutDirection)
            : (base.layoutDirection ? base.layoutDirection.toLowerCase() : (base.layoutDirection || 'column')),
        enableHtmlSanitizer: has(props, 'enableHtmlSanitizer')
            ? props.enableHtmlSanitizer
            : (base.enableHtmlSanitizer || 'true'),
        position: has(props, 'position') ? props.position : (base.position || 'left'),
        labelWidth: has(props, 'labelWidth')
            ? lower(props.labelWidth)
            : (base.labelWidth ? base.labelWidth.toLowerCase() : (base.labelWidth || 'auto')),
        iconCss: has(props, 'iconCss') ? props.iconCss : base.iconCss,
        iconPosition: has(props, 'iconPosition') ? props.iconPosition : base.iconPosition,
        startIndex: has(props, 'startIndex') ? props.startIndex : base.startIndex,
        style: has(props, 'style') ? lower(props.style) : (base.style ? base.style.toLowerCase() : base.style),
        buttonType: has(props, 'buttonType')
            ? lower(props.buttonType)
            : (base.buttonType ? base.buttonType.toLowerCase() : base.buttonType),
        // DatePicker-specific
        calendarMode: has(props, 'calendarMode') ? props.calendarMode : base.calendarMode,
        dayHeaderFormat: has(props, 'dayHeaderFormat') ? props.dayHeaderFormat : base.dayHeaderFormat,
        depth: has(props, 'depth') ? props.depth : base.depth,
        firstDayOfWeek: has(props, 'firstDayOfWeek') ? props.firstDayOfWeek : base.firstDayOfWeek,
        start: has(props, 'start') ? props.start : base.start,
        // DateTimePicker-specific
        allowEdit: has(props, 'allowEdit') ? props.allowEdit : base.allowEdit,
        enabled: has(props, 'enabled') ? props.enabled : base.enabled,
        timeFormat: has(props, 'timeFormat') ? props.timeFormat : base.timeFormat,
        showTodayButton: has(props, 'showTodayButton') ? props.showTodayButton : base.showTodayButton,
        // floatLabelType — settings win
        floatLabelType: (settings.floatLabelType !== undefined)
            ? settings.floatLabelType
            : (has(props, 'floatLabelType') ? props.floatLabelType : (base.floatLabelType || 'Never')),
        fieldLabelPosition: has(props, 'fieldLabelPosition')
            ? props.fieldLabelPosition
            : (base.fieldLabelPosition || 'After'),
        readOnly: has(props, 'readOnly') ? props.readOnly : (base.readOnly || false),
        autocomplete: has(props, 'autocomplete')
            ? props.autocomplete
            : (base.autocomplete !== false),
        multiline: has(props, 'multiline') ? props.multiline : base.multiline,
        showClearButton: has(props, 'showClearButton') ? props.showClearButton : (base.showClearButton || false),
        checked: has(props, 'checked') ? props.checked : (base.checked || false),
        indeterminate: has(props, 'indeterminate') ? props.indeterminate : (base.indeterminate || false),
        options: has(props, 'options') ? props.options : (base.options || ['Option 1']),
        tabOptions: has(props, 'tabOptions') ? props.tabOptions : (base.tabOptions || ['Tab 1']),
        decimals: has(props, 'decimals') ? props.decimals : base.decimals,
        currency: has(props, 'currency') ? props.currency : base.currency,
        format: has(props, 'format') ? props.format : base.format,
        numberFormat: has(props, 'numberFormat') ? props.numberFormat : base.numberFormat,
        step: has(props, 'step') ? props.step : base.step,
        enableVirtualization: has(props, 'enableVirtualization') ? props.enableVirtualization : base.enableVirtualization,
        popupHeight: has(props, 'popupHeight') ? props.popupHeight : base.popupHeight,
        popupWidth: has(props, 'popupWidth') ? props.popupWidth : base.popupWidth,
        htmlAttributes: has(props, 'htmlAttributes') ? props.htmlAttributes : base.htmlAttributes,
        buttonsGroups: has(props, 'buttonsGroups') ? props.buttonsGroups : base.buttonsGroups,
        gap: has(props, 'gap') ? props.gap : base.gap,
        cols: has(props, 'cols') ? props.cols : base.cols,
        textareaRows: has(props, 'textareaRows') ? props.textareaRows : base.textareaRows,
        offLabel: has(props, 'offLabel') ? props.offLabel : base.offLabel,
        onLabel: has(props, 'onLabel') ? props.onLabel : base.onLabel,
        startDate: has(props, 'startDate') ? props.startDate : base.startDate,
        endDate: has(props, 'endDate') ? props.endDate : base.endDate,
        separator: has(props, 'separator') ? props.separator : base.separator,
        mask: has(props, 'mask') ? props.mask : base.mask,
        customCharacters: has(props, 'customCharacters')
            ? safeJsonParse(props.customCharacters)
            : base.customCharacters,
        promptChar: has(props, 'promptChar') ? props.promptChar : base.promptChar,
        allowCustomValue: has(props, 'allowCustomValue') ? props.allowCustomValue : base.allowCustomValue,
        addTagOnBlur: has(props, 'addTagOnBlur') ? props.addTagOnBlur : base.addTagOnBlur,
        delimiterChar: has(props, 'delimiterChar') ? props.delimiterChar : base.delimiterChar,
        visualMode: has(props, 'visualMode') ? props.visualMode : base.visualMode,
        showSelectAll: has(props, 'showSelectAll') ? props.showSelectAll : base.showSelectAll,
        selectAllText: has(props, 'selectAllText') ? props.selectAllText : base.selectAllText,
        unSelectAllText: has(props, 'unSelectAllText') ? props.unSelectAllText : base.unSelectAllText,
        showDropDownIcon: has(props, 'showDropDownIcon') ? props.showDropDownIcon : base.showDropDownIcon,
        showCloseIcon: has(props, 'showCloseIcon') ? props.showCloseIcon : (base.showCloseIcon || false),
        showIcon: has(props, 'showIcon') ? props.showIcon : (base.showIcon || false),
        variant: has(props, 'variant') ? props.variant : base.variant,
        severity: has(props, 'severity') ? props.severity : base.severity,
        content: has(props, 'content') ? props.content : base.content,
        // Rating-specific
        allowReset: has(props, 'allowReset') ? props.allowReset : base.allowReset,
        itemsCount: has(props, 'itemsCount') ? props.itemsCount : base.itemsCount,
        precision: has(props, 'precision') ? props.precision : base.precision,
        showRatingTooltip: has(props, 'showRatingTooltip') ? props.showRatingTooltip : base.showRatingTooltip,
        showRatingLabel: has(props, 'showRatingLabel') ? props.showRatingLabel : base.showRatingLabel,
        ratingLabelPosition: has(props, 'ratingLabelPosition') ? props.ratingLabelPosition : base.ratingLabelPosition,
        // ImageEditor-specific
        height: has(props, 'height') ? props.height : base.height,
        width: has(props, 'width') ? props.width : base.width,
        // ColorPicker-specific
        enableOpacity: has(props, 'enableOpacity') ? props.enableOpacity : base.enableOpacity,
        showNoColor: has(props, 'showNoColor') ? props.showNoColor : base.showNoColor,
        showButtons: has(props, 'showButtons') ? props.showButtons : base.showButtons,
        showRecentColors: has(props, 'showRecentColors') ? props.showRecentColors : base.showRecentColors,
        // Signature-specific
        backgroundColor: has(props, 'backgroundColor') ? props.backgroundColor : base.backgroundColor,
        strokeColor: has(props, 'strokeColor') ? props.strokeColor : base.strokeColor,
        maximumStrokeWidth: has(props, 'maximumStrokeWidth') ? props.maximumStrokeWidth : base.maximumStrokeWidth,
        minimumStrokeWidth: has(props, 'minimumStrokeWidth') ? props.minimumStrokeWidth : base.minimumStrokeWidth,
        velocity: has(props, 'velocity') ? props.velocity : base.velocity,
        // Uploader-specific
        allowExtensions: has(props, 'allowExtensions') ? props.allowExtensions : base.allowExtensions,
        saveUrl: has(props, 'saveUrl') ? props.saveUrl : base.saveUrl,
        removeUrl: has(props, 'removeUrl') ? props.removeUrl : base.removeUrl,
        buttons: has(props, 'buttons') ? props.buttons : base.buttons,
        allowMultiple: has(props, 'allowMultiple') ? props.allowMultiple : base.allowMultiple,
        showFileList: has(props, 'showFileList') ? props.showFileList : base.showFileList,
        // Slider-specific
        orientation: has(props, 'orientation') ? props.orientation : base.orientation,
        rows: has(props, 'rows') ? props.rows : base.rows,
        columns: has(props, 'columns') ? props.columns : base.columns,
        lookUpConfig: has(props, 'lookUpConfig') ? props.lookUpConfig : base.lookUpConfig,
        enableImportFromWord: has(props, 'enableImportFromWord') ? props.enableImportFromWord : base.enableImportFromWord,
        enableExportToWord: has(props, 'enableExportToWord') ? props.enableExportToWord : base.enableExportToWord,
        enableExportToPdf: has(props, 'enableExportToPdf') ? props.enableExportToPdf : base.enableExportToPdf,
        // Structural: rebuild tableCells / tabItems based on the new size / headers
        tableCells: rebuildTableCells(base, props),
        tabItems: rebuildTabItems(base, props),
        columnWidths: resolveColumnWidths(props.columnWidths, base.columnWidths),
        // Validation
        required: has(props, 'required') ? props.required : (base.required || false),
        validateOn: has(props, 'validateOn') ? props.validateOn : (base.validateOn || 'Change'),
        min: has(props, 'minValue') ? props.minValue : base.min,
        max: has(props, 'maxValue') ? props.maxValue : base.max,
        minValue: has(props, 'minValue') ? props.minValue : base.minValue,
        maxValue: has(props, 'maxValue') ? props.maxValue : base.maxValue,
        minMaxRange: has(props, 'minMaxRange') ? props.minMaxRange : base.minMaxRange,
        minMaxTimeRange: has(props, 'minMaxTimeRange') ? props.minMaxTimeRange : base.minMaxTimeRange,
        minLength: has(props, 'minLength') ? props.minLength : base.minLength,
        maxLength: has(props, 'maxLength') ? props.maxLength : base.maxLength,
        minDate: has(props, 'minDate') ? props.minDate : base.minDate,
        maxDate: has(props, 'maxDate') ? props.maxDate : base.maxDate,
        regex: has(props, 'regex') ? props.regex : base.regex,
        minTime: has(props, 'minTime') ? props.minTime : base.minTime,
        maxTime: has(props, 'maxTime') ? props.maxTime : base.maxTime,
        validationMessage: has(props, 'validationMessage') ? props.validationMessage : base.validationMessage,
        // internal flag — same as the React source
        _configured: true
    });

    if (config) {
        const componentType: string = (baseComponent as any).type;
        const componentConfig: any = (config as any)[componentType];
        if (componentConfig && Array.isArray(componentConfig.groups)) {
            const validKeys: { [k: string]: boolean } = {};
            for (const group of componentConfig.groups) {
                if (group && Array.isArray(group.properties)) {
                    for (const prop of group.properties) {
                        if (prop && prop.key) {
                            validKeys[prop.key] = true;
                        }
                    }
                }
            }
            const propKeys: string[] = Object.keys(props);
            for (const key of propKeys) {
                if (updated[key] === undefined && validKeys[key] && props[key] !== undefined) {
                    updated[key] = props[key];
                }
            }
        }
    }

    return updated as FormNode;
}

/** @private */
function safeJsonParse(raw: any): any {
    if (typeof raw !== 'string') {
        return raw;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return raw;
    }
}

/** @private */
function rebuildTableCells(base: any, props: Record<string, any>): FormNode[][][] | undefined {
    if (base.type !== 'table') {
        return undefined;
    }
    const newRows: number = has(props, 'rows') ? props.rows : (base.rows || 2);
    const newCols: number = has(props, 'columns') ? props.columns : (base.columns || 2);
    const existingCells: FormNode[][][] = base.tableCells || [];
    const out: FormNode[][][] = [];
    for (let r: number = 0; r < newRows; r++) {
        const row: FormNode[][] = [];
        for (let c: number = 0; c < newCols; c++) {
            const existingRow: FormNode[][] | undefined = existingCells[r as number];
            const existingCell: FormNode[] | undefined = existingRow ? existingRow[c as number] : undefined;
            row.push(existingCell ? existingCell : []);
        }
        out.push(row);
    }
    return out;
}

/** @private */
function rebuildTabItems(base: any, props: Record<string, any>): Array<{ header: string; content?: FormNode[] }> | undefined {
    if (base.type !== 'tabs') {
        return undefined;
    }
    const tabHeaders: string[] = has(props, 'tabOptions')
        ? props.tabOptions
        : ((base.tabItems && base.tabItems.map(function (t: any) { return t.header; })) || ['Tab 1']);
    const existingTabs: Array<{ header: string; content?: FormNode[] }> = base.tabItems || [];
    return tabHeaders.map(function (header: string, index: number) {
        const existingTab: { header: string; content?: FormNode[] } | undefined = existingTabs[index as number];
        return {
            header: header,
            content: (existingTab && existingTab.content) ? existingTab.content : []
        };
    });
}

/** @private */
function resolveColumnWidths(payload: any, baseValue: any): any {
    const candidate: any = (payload && payload.widths !== undefined)
        ? payload
        : (baseValue && baseValue.widths !== undefined ? baseValue : undefined);
    if (!candidate || !Array.isArray(candidate.widths)) {
        return payload !== undefined ? payload : baseValue;
    }
    const allNull: boolean = candidate.widths.every(function (w: any) { return w === null; });
    return allNull ? undefined : (payload !== undefined ? payload : baseValue);
}

/** @private */
export function filterWidgetProperties(
    component: FormNode,
    config: WidgetConfig,
    dirtyKeys?: { fieldId: string; propertyKey: string }[]
): FormNode {
    const componentType: string = (component as any).type;
    const configData: any = config ? (config as any)[componentType as string] : null;
    if (!configData) {
        return component;
    }
    const validProps: { [k: string]: 1 } = {};
    const defaults: { [k: string]: any } = {};
    (configData.groups || []).forEach(function (group: any) {
        (group.properties || []).forEach(function (prop: any) {
            if (prop.key) {
                validProps[prop.key] = 1;
            }
            if (prop.key && prop.default !== undefined) {
                defaults[prop.key] = prop.default;
            }
        });
    });
    const coreProps: string[] = ['id', 'type', 'label', 'name', '_configured', 'templateId'];
    const dirtyKeyArr: any = (component as any).dirtyKey;
    if (Array.isArray(dirtyKeyArr)) {
        for (const dk of dirtyKeyArr) {
            if (dk && typeof dk === 'string' && coreProps.indexOf(dk) < 0) {
                coreProps.push(dk);
            }
        }
    }
    if (Array.isArray(dirtyKeys)) {
        for (const entry of dirtyKeys) {
            if (entry && entry.propertyKey && coreProps.indexOf(entry.propertyKey) < 0) {
                coreProps.push(entry.propertyKey);
            }
        }
    }
    if (componentType === 'autoNumber') {
        coreProps.push('visible', 'size');
    }
    const structuralProps: string[] = ['children', 'tableCells', 'tabItems'];
    const filtered: any = {};
    const componentKeys: string[] = Object.keys(component);
    for (let i: number = 0; i < componentKeys.length; i++) {
        const key: string = componentKeys[i as number];
        const value: any = (component as any)[key as string];
        if (coreProps.indexOf(key) !== -1 || structuralProps.indexOf(key) !== -1) {
            filtered[key as string] = value;
            continue;
        }
        if (validProps[key as string] === 1) {
            if (key === 'dataSource' && Array.isArray(value) && value.length === 0) {
                continue;
            }
            if (value !== defaults[key as string]) {
                filtered[key as string] = value;
            }
        }
    }
    if (componentType === 'panel' && filtered.children === undefined) {
        filtered.children = [];
    }
    if (componentType === 'card' && filtered.children === undefined) {
        filtered.children = [];
    }
    if (componentType === 'table' && filtered.tableCells === undefined) {
        filtered.tableCells = (component as any).tableCells || [];
    }
    if (componentType === 'tabs' && filtered.tabItems === undefined) {
        filtered.tabItems = (component as any).tabItems || [];
    }
    if (componentType === 'button' && !filtered.buttonType) {
        const btnGroups: any[] = (component as any).buttonsGroups;
        if (!btnGroups || btnGroups.length === 0) {
            filtered.buttonType = 'button';
        } else {
            const hasSubmit: boolean = btnGroups.some(function (g: any) { return g && g.type === 'submit'; });
            if (hasSubmit) {
                filtered.buttonType = 'submit';
            }
        }
    }
    return filtered as FormNode;
}

/** @private */
export function updateWidgetById(
    components: FormNode[],
    targetId: string,
    replacement: FormNode
): FormNode[] {
    return components.map(function (comp: FormNode) {
        if (comp.id === targetId) {
            return replacement;
        }
        const out: any = Object.assign({}, comp);
        if (comp.children) {
            out.children = updateWidgetById(comp.children, targetId, replacement);
        }
        if (comp.tabItems) {
            out.tabItems = comp.tabItems.map(function (tab: any) {
                return {
                    ...tab,
                    content: tab.content ? updateWidgetById(tab.content, targetId, replacement) : tab.content
                };
            });
        }
        if (comp.tableCells) {
            out.tableCells = comp.tableCells.map(function (row: FormNode[][]) {
                return row.map(function (cell: FormNode[]) {
                    return updateWidgetById(cell, targetId, replacement);
                });
            });
        }
        return out as FormNode;
    });
}

/** @private */
export function mapComponentsForWidgetSwitch(
    components: FormNode[],
    fieldId: string,
    replacement: FormNode
): FormNode[] {
    return updateWidgetById(components, fieldId, replacement);
}

/** @private */
export const ACTIVE_FIELD_WRAPPER_CLASS: string = 'form-field-wrapper';
/** @private */
export const ACTIVE_FIELD_CHILD_CLASS: string = 'form-field';
/** @private */
export const ACTIVE_FIELD_CLASS: string = 'is-active';

/** @private */
export function findFieldWrapperByFieldId(
    fieldId: string | null | undefined,
    scope?: HTMLElement | null
): HTMLElement | null {
    if (!fieldId) {
        return null;
    }
    const root: Document | HTMLElement = scope || document;
    let needle: HTMLElement | null = null;
    try {
        needle = root.querySelector(
            '[' + ACTIVE_FIELD_CHILD_CLASS + '][data-component-id="' + fieldId + '"]'
        ) as HTMLElement;
        if (!needle && (root as any).querySelectorAll) {
            const byAttr: HTMLElement | null = root.querySelector(
                '[data-component-id="' + fieldId + '"]'
            ) as HTMLElement;
            if (byAttr) {
                needle = byAttr;
            }
        }
    } catch (e) {
        needle = null;
    }
    if (!needle) {
        return null;
    }
    let wrapper: HTMLElement | null = needle.closest('.' + ACTIVE_FIELD_WRAPPER_CLASS) as HTMLElement;
    if (!wrapper) {
        wrapper = needle;
    }
    return wrapper;
}

/** @private */
export function clearAllActiveFieldWrappers(
    previousWrapper?: HTMLElement | null,
    scope?: HTMLElement | null
): void {
    const root: Document | HTMLElement = scope || document;
    let builderRoot: HTMLElement | null = null;
    if (previousWrapper && previousWrapper.closest) {
        builderRoot = previousWrapper.closest('.builder-container') as HTMLElement;
    }
    if (!builderRoot && root && (root as any).querySelector) {
        builderRoot = (root as HTMLElement).closest
            ? ((root as HTMLElement).closest('.builder-container') as HTMLElement)
            : null;
    }
    const searchRoot: HTMLElement = builderRoot || (root as HTMLElement);
    if (!searchRoot || !(searchRoot as any).querySelectorAll) {
        return;
    }
    const nodes: NodeListOf<Element> = searchRoot.querySelectorAll(
        '.' + ACTIVE_FIELD_WRAPPER_CLASS + '.' + ACTIVE_FIELD_CLASS
    );
    for (let i: number = 0; i < nodes.length; i++) {
        nodes[i as number].classList.remove(ACTIVE_FIELD_CLASS);
    }
}

/** @private */
export function setActiveFieldWrapper(
    fieldId: string | null | undefined,
    previousWrapper?: HTMLElement | null,
    scope?: HTMLElement | null
): HTMLElement | null {
    clearAllActiveFieldWrappers(previousWrapper ? previousWrapper : null, scope);
    if (!fieldId) {
        return null;
    }
    const wrapper: HTMLElement | null = findFieldWrapperByFieldId(fieldId, scope);
    if (!wrapper) {
        return null;
    }
    if (previousWrapper && previousWrapper === wrapper) {
        return wrapper;
    }
    wrapper.classList.add(ACTIVE_FIELD_CLASS);
    return wrapper;
}

