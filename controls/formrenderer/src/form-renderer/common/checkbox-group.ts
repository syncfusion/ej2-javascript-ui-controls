import { CheckBox } from '@syncfusion/ej2-buttons';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { FormNode } from '../form-renderer/types/form-schema';

/**
 * @private
 */
const resolveAttributes = (attributes: any): Record<string, any> => {
    if (!attributes) { return {}; }
    if (Array.isArray(attributes)) {
        return attributes.reduce((acc: Record<string, any>, item: any) => {
            if (item && item.key && item.value !== undefined) {
                acc[item.key] = item.value;
            }
            return acc;
        }, {});
    }
    return attributes;
};

/**
 * @private
 * Options for `CheckboxGroup`.
 */
export interface CheckboxGroupOptions {
    component: FormNode;
    formState?: any;
    value?: string[];
    onChange?: (value: string[]) => void;
    optionRef?: (el: any, idx?: number) => void;
    enableRtl?: boolean;
    target?: HTMLElement;
    ref?: any
}

/**
 * @private
 */
export class CheckboxGroup {
    private component: FormNode;
    private formState: any | undefined;
    private onChangeCb: ((value: string[]) => void) | undefined;
    private optionRef: ((el: any, idx?: number) => void) | undefined;
    private enableRtl: boolean | undefined;
    private target: HTMLElement | undefined;

    private container: HTMLDivElement | null;
    private itemsContainer: HTMLDivElement | null;
    private checkboxes: CheckBox[] = [];
    private ref: Function;

    constructor(options: CheckboxGroupOptions) {
        this.component = options.component;
        this.formState = options.formState;
        this.onChangeCb = options.onChange;
        this.optionRef = options.optionRef;
        this.enableRtl = options.enableRtl;
        this.target = options.target;
        this.container = null;
        this.itemsContainer = null;
        this.ref = options.ref;
    }

    private getSelectedItems(): string[] {
        const resolvedValue: string[] | undefined = (this.formState
            ? (this.formState.values[this.component.id] as string[] | undefined)
            : (isNullOrUndefined(this.valueProp()) ? this.component.defaultValue : this.valueProp())) as string[] | undefined;
        return Array.isArray(resolvedValue) ? resolvedValue : [];
    }

    private valueProp(): string[] | undefined {
        // Used only when `formState` is absent — read the `value` option.
        return (this as any)._value as string[] | undefined;
    }

    /** Used in non-formState mode to seed the initial value. */
    public setValue(value: string[]): void {
        (this as any)._value = value;
    }

    private handleCheckboxChange(option: string, checked: boolean): void {
        const selectedItems: string[] = this.getSelectedItems();
        const newValue: string[] = checked
            ? [...selectedItems, option]
            : selectedItems.filter((i: string) => i !== option);

        if (this.formState) {
            this.onChangeCb(newValue);
        }
    }

    /**
     * Compose the size CSS class for the CheckBox.
     */
    private get sizeCssClass(): string {
        const base: string = this.component.cssClass || '';
        const sizeMod: string = this.component.size === 'Small'
            ? ' e-small'
            : this.component.size === 'Bigger'
                ? ' e-bigger'
                : '';
        return `${base}${sizeMod}`;
    }

    /**
     * Build and append the group DOM tree. Returns the container element.
     */
    public render(target?: HTMLElement): HTMLElement {
        const component: FormNode = this.component;
        const groupLabel: string = component.label && component.required
            ? `${component.label} *`
            : (component.label || '');

        const host: HTMLElement | undefined = target || this.target;

        // Outer container
        const container: HTMLDivElement = document.createElement('div');
        container.className = `checkbox-group ${component.cssClass || ''}`.trim();
        container.setAttribute('role', 'group');
        container.setAttribute('aria-label', groupLabel);
        container.title = component.tooltip || '';
        const htmlAttrs: Record<string, any> = resolveAttributes(component.htmlAttributes);
        Object.keys(htmlAttrs).forEach((key: string) => {
            // Apply additional htmlAttributes to the container (matches spread).
            if (key !== 'class' && key !== 'className' && key !== 'style') {
                container.setAttribute(key, String(htmlAttrs[key as string]));
            }
        });

        const containerStyle: string =
            `display:flex;flex-direction:${component.layoutDirection === 'row' ? 'row' : 'column'};` +
            `gap:${component.gap || '8px'};align-items:flex-start;`;
        container.setAttribute('style', containerStyle);

        // Items container
        const itemsContainer: HTMLDivElement = document.createElement('div');
        itemsContainer.className = 'checkbox-group-items';
        const itemsStyle: string =
            `display:flex;flex-direction:${component.layoutDirection === 'row' ? 'row' : 'column'};` +
            `flex-wrap:wrap;gap:${component.gap || '2px'};width:100%;`;
        itemsContainer.setAttribute('style', itemsStyle);

        const options: any[] = Array.isArray(component.options) ? component.options : ['Option 1'];
        const selectedItems: string[] = this.getSelectedItems();

        options.forEach((option: any, idx: number) => {
            const optionValue: string = typeof option === 'string'
                ? option
                : (option.value != null ? option.value : (option.label != null ? option.label : option.key)) as string;
            const optionLabel: string = typeof option === 'string'
                ? option
                : (option.label != null ? option.label : (option.value != null ? option.value : String(optionValue))) as string;

            const wrapper: HTMLElement = document.createElement('input');
            itemsContainer.appendChild(wrapper);

            const checkBox: CheckBox = new CheckBox({
                label: optionLabel,
                enableRtl: this.enableRtl,
                checked: selectedItems.indexOf(optionValue) !== -1,
                disabled: !!component.disabled,
                labelPosition: ((component as any).checkboxLabelPosition as any) || 'After',
                cssClass: this.sizeCssClass.trim(),
                htmlAttributes: htmlAttrs,
                change: (e: any) => {
                    this.handleCheckboxChange(optionValue, e.checked);
                }
            });
            checkBox.appendTo(wrapper);
            this.ref(checkBox, idx);

            // Set the id mirroring `${component.id}_${idx}` after appendTo so
            // EJ2 preserves the wrapper id semantics.
            const inputEl: HTMLInputElement = wrapper.querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (inputEl) { inputEl.id = `${this.component.id}_${idx}`; }

            // Ref callback — provide the EJ2 instance + index.
            if (this.optionRef) {
                (this.optionRef as any)(checkBox, idx);
            }

            this.checkboxes.push(checkBox);
        });

        container.appendChild(itemsContainer);
        if (host) {
            host.appendChild(container);
        }
        this.container = container;
        this.itemsContainer = itemsContainer;
        return container;
    }

    /**
     * Re-render the selection state from the current model value. Used by
     * the host after a programmatic value change.
     */
    public refreshSelection(): void {
        const selectedItems: string[] = this.getSelectedItems();
        const options: any[] = Array.isArray(this.component.options) ? this.component.options : ['Option 1'];
        options.forEach((option: any, idx: number) => {
            const optionValue: string = typeof option === 'string'
                ? option
                : (option.value != null ? option.value : (option.label != null ? option.label : option.key)) as string;
            const checkBox: CheckBox = this.checkboxes[idx as number];
            if (checkBox) {
                checkBox.checked = selectedItems.indexOf(optionValue) !== -1;
            }
        });
    }

    /**
     * Destroy all child EJ2 instances and detach the container.
     */
    public destroy(): void {
        for (const cb of this.checkboxes) {
            try { cb.destroy(); } catch (e) { /* ignore */ }
        }
        this.checkboxes = [];
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.itemsContainer = null;
    }


    public setOptions(options: any[]): void {
        this.component.options = options;
        if (!this.itemsContainer) {
            return;
        }
        for (const cb of this.checkboxes) {
            try {
                cb.destroy();
            } catch {
            }
        }
        this.checkboxes = [];
        while (this.itemsContainer.firstChild) {
            this.itemsContainer.removeChild(this.itemsContainer.firstChild);
        }
        const selectedItems: string[] = this.getSelectedItems();
        options.forEach((option: any, idx: number) => {
            const optionValue: string =
                typeof option === 'string'
                    ? option
                    : (option.value || option.label || option.key);
            const optionLabel: string =
                typeof option === 'string'
                    ? option
                    : (option.label || option.value || String(optionValue));
            const wrapper: HTMLElement = document.createElement('input');
            this.itemsContainer!.appendChild(wrapper);
            const checkBox: CheckBox = new CheckBox({
                label: optionLabel,
                enableRtl: this.enableRtl,
                checked: selectedItems.indexOf(optionValue) !== -1,
                disabled: !!this.component.disabled,
                labelPosition:
                    ((this.component as any).checkboxLabelPosition as any) || 'After',
                cssClass: this.sizeCssClass.trim(),
                change: (e: any) => {
                    this.handleCheckboxChange(optionValue, e.checked);
                }
            });
            checkBox.appendTo(wrapper);
            this.ref(checkBox, idx);
            const inputEl = wrapper.querySelector(
                'input[type="checkbox"]'
            ) as HTMLInputElement;
            if (inputEl) {
                inputEl.id = `${this.component.id}_${idx}`;
            }
            if (this.optionRef) {
                this.optionRef(checkBox, idx);
            }
            this.checkboxes.push(checkBox);
        });
    }
}

export default CheckboxGroup;
