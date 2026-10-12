import { createElement, enableRtl, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { FormNode } from '@syncfusion/ej2-form-renderer';
import { Tooltip } from '@syncfusion/ej2-popups';

/**
 * @private
 */
export interface FormFieldWrapperProps {
    /** @private */
    component: FormNode;
    /** @private */
    isActive: boolean;
    /** @private */
    index?: number;
    /** @private */
    totalCount?: number;
    /** @private */
    mode?: 'Simple' | 'Developer';
    /** @private */
    enableRtl?: boolean;
    /** @private */
    registerRenderedInstance?: (instance: any) => void;
    /** @private */
    hasClipboardData?: boolean;
    /** @private */
    isNested?: boolean;
    /** @private */
    nestingContext?: {
        parentId: string;
        parentPath: string;
        cellInfo?: { row?: number; col?: number; tabIndex?: number };
    };
    /** @private */
    onEdit: (id: string) => void;
    /** @private */
    onCopy: (field: FormNode) => void;
    /** @private */
    onPaste: (targetId: string) => void;
    /** @private */
    onDelete: (id: string) => void;
    /** @private */
    onSwitchWidget?: (id: string, type: string) => void;
    /** @private */
    onMoveUp?: (id: string) => void;
    /** @private */
    onMoveDown?: (id: string) => void;
    /** @private */
    onNestedMoveUp?: (
        id: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ) => void;
    /** @private */
    onNestedMoveDown?: (
        id: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ) => void;
    /** @private */
    nestedContainerClass?: 'panel-child-field-draggable' | 'tab-child-field-draggable' | 'table-cell-child-draggable';
}

/**
 * @private
 */
const inputTargetTypes: string[] = [
    'textbox',
    'number',
    'checkbox',
    'dropdown',
    'multiselect',
    'date',
    'dateTime',
    'time',
    'dateRange',
    'switch',
    'rating',
    'colorPicker',
    'inputMask',
    'fileUpload'
];

/**
 * @private
 */
interface MenuItemConfig {
  text: string;
  data?: string;
  items?: MenuItemConfig[];
}

/**
 * @private
 */
interface UITypeMapping {
    type: 'string' | 'numeric' | 'boolean' | 'date' | 'array';
    displayText?: string;
}

/**
 * @private
 */
const UI_TYPE: { [key: string]: UITypeMapping | null } = {
    textbox: { type: 'string', displayText: 'Text Box' },
    textarea: { type: 'string', displayText: 'Text Area' },
    inputMask: { type: 'string', displayText: 'Input Mask' },
    number: { type: 'numeric', displayText: 'Number' },
    rangeSlider: { type: 'numeric', displayText: 'Range Slider' },
    rating: { type: 'numeric', displayText: 'Rating' },
    checkbox: { type: 'boolean', displayText: 'Checkbox' },
    switch: { type: 'boolean', displayText: 'Switch' },
    date: { type: 'date', displayText: 'Date' },
    dateTime: { type: 'date', displayText: 'Date / Time' },
    time: { type: 'date', displayText: 'Time' },
    dateRange: { type: 'date', displayText: 'Date Range' },
    multiselect: { type: 'array', displayText: 'Multi Select' },
    checkboxGroup: { type: 'array', displayText: 'Checkbox Group' },
    dropdown: { type: 'string', displayText: 'Dropdown List' },
    radio: { type: 'string', displayText: 'Radio Button' },
    colorPicker: { type: 'string', displayText: 'Color Picker' }
};

/**
 * @private
 */
function generateWidgetMenuItems(currentWidgetType: string): { items: MenuItemConfig[]; hasValidType: boolean } {
    const currentMapping: UITypeMapping | null = UI_TYPE[currentWidgetType as string] || null;
    if (!currentMapping || !currentMapping.type) {
        return { items: [], hasValidType: false };
    }
    const currentSemantic: string = currentMapping.type;
    const grouped: { [key: string]: string[] } = {};
    Object.keys(UI_TYPE).forEach(function (widget: string) {
        const mapping: UITypeMapping | null = UI_TYPE[widget as string];
        if (mapping && mapping.type) {
            if (!grouped[mapping.type]) {
                grouped[mapping.type] = [];
            }
            grouped[mapping.type].push(widget);
        }
    });
    const items: MenuItemConfig[] = [];
    const matching: string[] = grouped[currentSemantic as string] || [];
    for (let i: number = 0; i < matching.length; i++) {
        const widget: string = matching[i as number];
        if (widget === currentWidgetType) {
            continue;
        }
        const m: UITypeMapping | null = UI_TYPE[widget as string];
        items.push({
            text: (m && m.displayText) ? m.displayText : widget,
            data: widget
        });
    }
    const otherKeys: string[] = Object.keys(grouped)
        .filter(function (k: string) { return k !== currentSemantic; })
        .sort();
    for (let j: number = 0; j < otherKeys.length; j++) {
        const sem: string = otherKeys[j as number];
        const subItems: MenuItemConfig[] = [];
        const widgets: string[] = grouped[sem as string] || [];
        for (let k: number = 0; k < widgets.length; k++) {
            const widget: string = widgets[k as number];
            const m: UITypeMapping | null = UI_TYPE[widget as string];
            subItems.push({
                text: (m && m.displayText) ? m.displayText : widget,
                data: widget
            });
        }
        items.push({
            text: sem.charAt(0).toUpperCase() + sem.slice(1),
            items: subItems
        });
    }
    return { items: items, hasValidType: true };
}

/**
 * @private
 */
export class FormFieldWrapper {

    private host: HTMLElement;
    private props: FormFieldWrapperProps;
    private l10n: L10n;
    private activeClass: string = 'e-form-builder-field-active';
    private errorClass: string = 'e-form-builder-field-error';
    private wrapperEl: HTMLElement | null = null;
    private labelEl: HTMLElement | null = null;
    private actionsEl: HTMLElement | null = null;
    private errorEl: HTMLElement | null = null;
    private descriptionEl: HTMLElement | null = null;
    private fieldHostEl: HTMLElement | null = null;
    private clickHandler: ((e: MouseEvent) => void) | null = null;
    private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
    private actionHandler: ((e: Event) => void) | null = null;
    private switchMenuObj: Menu | null = null;

    /**
     * @private
     */
    constructor(host: HTMLElement, props: FormFieldWrapperProps, l10n: L10n) {
        this.host = host;
        this.props = props;
        this.l10n = l10n;
        this.render();
    }

    /**
     * @private
     */
    public update(props: FormFieldWrapperProps): void {
        this.props = props;
        this.render();
    }

    public updatePreserved(
        component: FormNode,
        isActive: boolean,
        index: number,
        totalCount: number,
        isNested: boolean,
        nestingContext?: FormFieldWrapperProps['nestingContext']
    ): void {
        this.props = {
            ...this.props,
            component,
            isActive,
            index,
            totalCount,
            isNested,
            nestingContext
        };
        if (this.wrapperEl) {
            this.host.classList.toggle('is-active', isActive);
            this.host.setAttribute('aria-label', (component.label || component.name || '') + ' ' + (component.type || ''));
            this.host.setAttribute('role', 'group');
            const field: HTMLElement | null = this.host.querySelector('.form-field');
            if (field) {
                field.classList.toggle('is-active', isActive);
                field.classList.toggle(this.activeClass, isActive);
                field.setAttribute('data-index', String(index));
                if (isNested) {
                    field.setAttribute('data-nested-index', String(index));
                } else {
                    field.removeAttribute('data-nested-index');
                }
            }
            if (this.actionsEl && this.actionHandler) {
                this.actionsEl.removeEventListener('click', this.actionHandler);
            }
            this.destroySwitchMenu();
            const actionWrapper: HTMLElement | null = this.host.querySelector('.action-button-wrapper');
            if (actionWrapper) {
                while (actionWrapper.firstChild) {
                    actionWrapper.removeChild(actionWrapper.firstChild);
                }
                const actions: HTMLElement = this.buildActions();
                actionWrapper.appendChild(actions);
                this.actionsEl = actions;
            }
        }
    }

    /**
     * @private
     */
    public setActive(isActive: boolean): void {
        if (this.wrapperEl) {
            if (isActive) {
                this.wrapperEl.classList.add(this.activeClass);
            } else {
                this.wrapperEl.classList.remove(this.activeClass);
            }
        }
    }

    /**
     * @private
     */
    public setError(message: string | null): void {
        if (!this.errorEl) {
            return;
        }
        if (message) {
            this.errorEl.textContent = message;
            this.errorEl.style.display = '';
            if (this.wrapperEl) {
                this.wrapperEl.classList.add(this.errorClass);
            }
        } else {
            this.errorEl.textContent = '';
            this.errorEl.style.display = 'none';
            if (this.wrapperEl) {
                this.wrapperEl.classList.remove(this.errorClass);
            }
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.wrapperEl && this.clickHandler) {
            this.wrapperEl.removeEventListener('click', this.clickHandler);
        }
        if (this.wrapperEl && this.keydownHandler) {
            this.wrapperEl.removeEventListener('keydown', this.keydownHandler);
        }
        if (this.actionsEl && this.actionHandler) {
            this.actionsEl.removeEventListener('click', this.actionHandler);
        }
        this.clickHandler = null;
        this.keydownHandler = null;
        this.actionHandler = null;
        this.destroySwitchMenu();
        while (this.host.firstChild) {
            this.host.removeChild(this.host.firstChild);
        }
        this.wrapperEl = null;
        this.labelEl = null;
        this.actionsEl = null;
        this.errorEl = null;
        this.descriptionEl = null;
        this.fieldHostEl = null;
    }

    private destroySwitchMenu(): void {
        if (this.switchMenuObj) {
            try {
                this.switchMenuObj.destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.switchMenuObj = null;
    }

    public getHost(): HTMLElement {
        return this.host;
    }

    /**
     * @private
     */
    public getFieldHost(): HTMLElement {
        if (!this.fieldHostEl) {
            this.render();
        }
        return this.fieldHostEl as HTMLElement;
    }

    /**
     * @private
     */
    private resolveFieldHostTag(componentType: string): string {
        if (inputTargetTypes.indexOf(componentType) !== -1) {
            return 'input';
        }
        if (componentType === 'textarea') {
            return 'textarea';
        }
        return 'div';
    }

    private render(): void {
        if (!this.host) {
            return;
        }
        const component: FormNode = this.props.component;
        if (!component) {
            return;
        }
        // Tear down old listeners before rebuilding.
        if (this.wrapperEl && this.clickHandler) {
            this.wrapperEl.removeEventListener('click', this.clickHandler);
            this.clickHandler = null;
        }
        if (this.wrapperEl && this.keydownHandler) {
            this.wrapperEl.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
        if (this.actionsEl && this.actionHandler) {
            this.actionsEl.removeEventListener('click', this.actionHandler);
            this.actionHandler = null;
        }

        this.destroySwitchMenu();
        while (this.host.firstChild) {
            this.host.removeChild(this.host.firstChild);
        }

        const labelPos: string = (component as any).labelPosition || 'top';
        const labelWidth: string = (component as any).labelWidth != null
            ? (component as any).labelWidth + '%'
            : 'auto';
        const isLayout: boolean = ['panel', 'table', 'tabs', 'card',
            'splitButton', 'staticHtml'].indexOf(String(component.type)) >= 0;
        const hideLabel: boolean = !!component.hideLabel || !!((component as any).formSettings && (component as any).formSettings.hideLabel);
        const activeSuffix: string = this.props.isActive ? ' is-active' : '';
        this.host.className = 'form-field-wrapper' + activeSuffix;
        this.host.setAttribute(
            'aria-label',
            (component.label || component.name || '') + ' ' + (component.type || '')
        );
        this.host.setAttribute(
            'role',
            'group'
        );
        this.host.setAttribute('tabindex', '0');
        this.host.setAttribute('data-field-id', component.id || '');
        if (component.type === 'rangeSlider') {
            this.host.style.padding = '5px 15px';
        }
        else {
            this.host.style.padding = '5px';
        }
        this.host.setAttribute('data-component-type', String(component.type));
        this.host.setAttribute('data-label-position', labelPos);
        if (this.props.enableRtl) {
            this.host.classList.add('e-rtl');
        }

        this.clickHandler = (e: MouseEvent) => {
            const target: HTMLElement = e.target as HTMLElement;
            const isMenuElement = target.classList.contains('e-menu-item') || target.classList.contains('e-menu-icon');
            if(!isMenuElement) {
                e.stopPropagation();
            }
            if (!target) {
                return;
            }
            if (target.closest('.action-buttons')) {
                return;
            }
            if (target.closest('.field-input input, .field-input textarea, .field-input select')) {
                return;
            }
            const builder: HTMLElement | null = this.host.closest('.builder-container') as HTMLElement;
            if (builder) {
                const siblings: NodeListOf<Element> =
                    builder.querySelectorAll('.form-field-wrapper.is-active');
                for (let i: number = 0; i < siblings.length; i++) {
                    (siblings[i as number] as HTMLElement).classList.remove('is-active');
                }
            }
            this.host.classList.add('is-active');
            if (component.id) {
                this.props.onEdit(component.id);
            }
        };
        this.host.addEventListener('click', this.clickHandler);

        this.keydownHandler = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') {
                return;
            }
            e.stopPropagation();
            const target: HTMLElement = e.target as HTMLElement;
            if (target.closest('.action-buttons')) {
                return;
            }
            if (target.closest('.field-input input, .field-input textarea, .field-input select')) {
                return;
            }
            const builder: HTMLElement | null = this.host.closest('.builder-container') as HTMLElement;
            if (builder) {
                const siblings: NodeListOf<Element> =
                    builder.querySelectorAll('.form-field-wrapper.is-active');
                for (let i: number = 0; i < siblings.length; i++) {
                    (siblings[i as number] as HTMLElement).classList.remove('is-active');
                }
            }
            this.host.classList.add('is-active');
            if (component.id) {
                this.props.onEdit(component.id);
            }
        };
        this.host.addEventListener('keydown', this.keydownHandler);

        const actionButtonWrapper: HTMLElement = createElement('div', {
            className: 'action-button-wrapper'
        });
        const actionButtons: HTMLElement = this.buildActions();
        actionButtonWrapper.appendChild(actionButtons);
        this.actionsEl = actionButtons;
        this.host.appendChild(actionButtonWrapper);

        const tooltipEl: HTMLElement = createElement('div');
        this.host.appendChild(tooltipEl);
        const nestedClass: string = this.props.nestedContainerClass || '';
        const isNested: boolean = !!nestedClass;
        const fieldClassName: string = 'form-field '
            + (isNested
                ? nestedClass
                : 'form-field-draggable')
            + activeSuffix;
        const fieldAttrs: { 'data-index': string; 'data-component-id': string; 'data-nested-index'?: string } = {
            'data-index': String(this.props.index || 0),
            'data-component-id': component.id || ''
        };
        if (isNested) {
            fieldAttrs['data-nested-index'] = String(this.props.index || 0);
        }
        const fieldEl: HTMLElement = createElement('div', {
            className: fieldClassName,
            attrs: fieldAttrs as { [k: string]: string }
        });

        const fieldContent: HTMLElement = createElement('div', {
            className: 'field-content label-' + labelPos.toLowerCase() + (isLayout ? ' layout-component' : '')
        });

        if (!hideLabel && component.label && !isLayout && ['checkbox', 'button', 'table', 'tabs', 'panel', 'message', 'card', 'splitButton', 'staticHtml'].indexOf(component.type) === -1) {
            const labelEl: HTMLElement = createElement('label', {
                className: 'field-label'
            });
            if(inputTargetTypes.indexOf(component.type) !== -1 || component.type === 'textarea') {
                labelEl.setAttribute('for', component.name);
            }
            labelEl.style.display = 'flex';
            labelEl.style.alignItems = 'center';
            labelEl.style.gap = '2px';
            const labelText: HTMLElement = createElement('span', {
                className: 'field-label-text'
            });
            labelText.textContent = component.label || '';
            labelEl.appendChild(labelText);
            if (component.required) {
                const star: HTMLElement = createElement('span', {
                    className: 'required'
                });
                star.textContent = ' *';
                labelEl.appendChild(star);
            }
            if (component.tooltip) {
                const tooltipHost: HTMLSpanElement = createElement('span', {
                    className: 'e-msg-icon e-icons e-circle-info tooltip-icon',
                    attrs: {
                        'aria-label': component.tooltip,
                        title: component.tooltip,
                        tabindex: '0',
                        role: 'button',
                        'aria-haspopup': 'true'
                    }
                }) as HTMLSpanElement;
                (tooltipHost as HTMLElement).style.cursor = 'pointer';
                (tooltipHost as HTMLElement).style.display = 'flex';
                (tooltipHost as HTMLElement).style.alignItems = 'center';
                (tooltipHost as HTMLElement).style.justifyContent = 'center';
                (tooltipHost as HTMLElement).style.flexShrink = '0';
                labelEl.appendChild(tooltipHost);
                const tooltip: Tooltip = new Tooltip({ content: component.tooltip,
                    enableRtl: this.props.enableRtl
                 });
                tooltip.appendTo(tooltipHost);
                if (this.props.registerRenderedInstance) {
                    this.props.registerRenderedInstance(tooltip);
                }
                labelEl.appendChild(tooltipHost);
            }
            labelEl.style.width = (labelPos === 'top' || labelPos === 'bottom') ? '100%' : labelWidth;
            this.labelEl = labelEl;
            fieldContent.appendChild(labelEl);
        }

        const fieldInput: HTMLElement = createElement('div', {
            className: 'field-input'
        });
        if (!isLayout) {
            fieldInput.setAttribute('inert', '');
        }
        const targetTag: string = this.resolveFieldHostTag(String(component.type));
        const fieldHost: HTMLElement = createElement(targetTag, {
            className: 'e-form-builder-field-host'
        });
        this.fieldHostEl = fieldHost;
        fieldInput.appendChild(fieldHost);
        fieldContent.appendChild(fieldInput);
        fieldHost.id = component.name;

        const errorEl: HTMLElement = createElement('div', {
            className: 'e-form-builder-field-error'
        });
        errorEl.style.display = 'none';
        this.errorEl = errorEl;
        fieldContent.appendChild(errorEl);

        fieldEl.appendChild(fieldContent);
        if ((component as any).description) {
            const desc: HTMLElement = createElement('div', {
                className: 'field-description'
            });
            desc.textContent = (component as any).description;
            this.descriptionEl = desc;
            fieldEl.appendChild(desc);
        }
        this.host.appendChild(fieldEl);
        this.wrapperEl = this.host;
    }

    private buildActions(): HTMLElement {
        const component: FormNode = this.props.component;
        const index: number = this.props.index || 0;
        const total: number = this.props.totalCount || 0;
        const canMoveUp: boolean = index > 0;
        const canMoveDown: boolean = total > 0 && index < total - 1;
        const hasClipboard: boolean = !!this.props.hasClipboardData;

        const actions: HTMLElement = createElement('div', {
            className: 'action-buttons',
            attrs: { role: 'toolbar', 'aria-label': 'Field actions' }
        });

        const addButton = (action: string, title: string, disabled: boolean, iconCss: string, display?: string): HTMLElement => {
            const btn: HTMLElement = createElement('button', {
                className: 'e-control e-btn e-lib e-small e-flat action-btn e-icon-btn',
                attrs: {
                    type: 'button',
                    'data-action': action,
                    'data-ripple': 'true',
                    title: title,
                    'aria-label': title
                }
            });
            if (disabled) {
                btn.setAttribute('disabled', 'disabled');
            }
            if (display) {
                btn.style.display = display;
            }
            const icon: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons ' + iconCss
            });
            btn.appendChild(icon);
            return btn;
        };

        if (canMoveUp) {
            actions.appendChild(addButton('moveUp', this.l10n ? this.l10n.getConstant('moveUp') || 'Move up' : 'Move up', false, 'e-arrow-up'));
        }
        if (canMoveDown) {
            actions.appendChild(addButton('moveDown', this.l10n ? this.l10n.getConstant('moveDown') || 'Move down' : 'Move down', false, 'e-arrow-down'));
        }
        actions.appendChild(addButton('paste', this.l10n ? this.l10n.getConstant('paste') || 'Paste copied field after this field' : 'Paste copied field after this field', false, 'e-paste', hasClipboard ? 'block' : 'none'));
        if (this.props.onSwitchWidget) {
            const menuInfo: { items: MenuItemModel[]; hasValidType: boolean } =
                generateWidgetMenuItems(String(component.type));
            if (menuInfo.hasValidType) {
                const switchMenuEl: HTMLElement = createElement('ul', {
                    className: 'change-component e-menu e-lib',
                    attrs: {
                        'data-action': 'switchWidget',
                        'aria-label': this.l10n
                            ? this.l10n.getConstant('switchWidget') || 'Switch widget'
                            : 'Switch widget'
                    }
                });
                switchMenuEl.id = 'switch-menu-host-' + component.id;
                actions.appendChild(switchMenuEl);
                const self: FormFieldWrapper = this;
                this.switchMenuObj = new Menu(
                    {
                        enableRtl: this.props.enableRtl,
                        items: [
                            {
                                text: '',
                                cssClass: 'parent-menuitem',
                                iconCss: 'e-icons e-repeat',
                                items: menuInfo.items,
                                htmlAttributes: {'aria-label': this.l10n ? this.l10n.getConstant('switchWidget') || 'Switch Widget' : 'Switch Widget',
                                    'title': this.l10n ? this.l10n.getConstant('switchWidget') || 'Switch Widget' : 'Switch Widget'
                                }
                            }
                        ],
                        showItemOnClick: true,
                        select: (args) =>{
                            const item: any = args && args.item ? args.item : null;
                            const newType = item.data || item.text || '';
                            if (newType && self.props.onSwitchWidget) {
                                self.props.onSwitchWidget(component.id, newType);
                            }
                        }
                    }
                );
                this.switchMenuObj.appendTo(switchMenuEl);
            }
        }
        actions.appendChild(addButton('copy', this.l10n ? this.l10n.getConstant('copy') || 'Copy field configuration to clipboard' : 'Copy field configuration to clipboard', false, 'e-copy'));
        actions.appendChild(addButton('delete', this.l10n ? this.l10n.getConstant('delete') || 'Delete field' : 'Delete field', false, 'e-trash'));

        this.actionHandler = (e: Event) => {
            const target: Element = e.target as HTMLElement;
            const btn: Element | null = target.closest('button[data-action]');
            if (!btn || btn.hasAttribute('disabled') || !component.id) {
                return;
            }
            const action: string = btn.getAttribute('data-action') || '';
            switch (action) {
                case 'copy':
                    this.props.onCopy(component);
                    break;
                case 'paste':
                    this.props.onPaste(component.id);
                    break;
                case 'delete':
                    this.props.onDelete(component.id);
                    break;
                case 'moveUp':
                    if (this.props.isNested && this.props.onNestedMoveUp && this.props.nestingContext) {
                        this.props.onNestedMoveUp(
                            component.id,
                            this.props.nestingContext.parentId,
                            this.props.nestingContext.parentPath,
                            this.props.nestingContext.cellInfo
                        );
                    } else if (!this.props.isNested && this.props.onMoveUp) {
                        this.props.onMoveUp(component.id);
                    }
                    break;
                case 'moveDown':
                    if (this.props.isNested && this.props.onNestedMoveDown && this.props.nestingContext) {
                        this.props.onNestedMoveDown(
                            component.id,
                            this.props.nestingContext.parentId,
                            this.props.nestingContext.parentPath,
                            this.props.nestingContext.cellInfo
                        );
                    } else if (!this.props.isNested && this.props.onMoveDown) {
                        this.props.onMoveDown(component.id);
                    }
                    break;
            }
            e.stopPropagation();
        };
        actions.addEventListener('click', this.actionHandler);
        return actions;
    }
}

export default FormFieldWrapper;
