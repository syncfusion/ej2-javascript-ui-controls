import { L10n, createElement } from '@syncfusion/ej2-base';
import { PropertyGroupRenderer, PropertyGroupRendererOptions } from './property-group-renderer';
import { PropertyGroup, PropertyValues } from '../types/component-properties';
import { FormNode } from '@syncfusion/ej2-form-renderer';

/** @private */
export interface FormSettingsModel {
    name?: string;
    width?: string;
    hideLabel?: boolean;
    size?: 'Default' | 'Small' | 'Bigger';
    floatLabelType?: 'Never' | 'Always';
    [key: string]: any;
}

/** @private */
export interface FormSettingsPanelOptions {
    host: HTMLElement;
    settings: FormSettingsModel;
    formSettingsConfig: { groups: PropertyGroup[] };
    l10n: L10n;
    locale?: string;
    mode?: 'Simple' | 'Developer';
    formSchema?: any;
    availableFields?: FormNode[];
    onSave: (settings: FormSettingsModel, key?: string) => void;
}

/** @private */
interface GroupInstances {
    groupHost: HTMLElement;
    instances: Map<string, any>;
}

/** @private */
export class FormSettingsPanel {

    private host: HTMLElement;
    private settings: FormSettingsModel;
    private formSettingsConfig: { groups: PropertyGroup[] };
    private l10n: L10n;
    private locale: string;
    private mode: 'Simple' | 'Developer' | undefined;
    private formSchema: any;
    private availableFields: FormNode[] | undefined;
    private onSave: (settings: FormSettingsModel, key?: string) => void;
    private groups: GroupInstances[];
    private headerEl: HTMLElement | null;
    private destroyed: boolean;

    constructor(opts: FormSettingsPanelOptions) {
        this.host = opts.host;
        this.settings = opts.settings || {};
        this.formSettingsConfig = opts.formSettingsConfig || { groups: [] };
        this.l10n = opts.l10n;
        this.locale = opts.locale || 'en-US';
        this.mode = opts.mode;
        this.formSchema = opts.formSchema;
        this.availableFields = opts.availableFields;
        this.onSave = opts.onSave;
        this.groups = [];
        this.headerEl = null;
        this.destroyed = false;
    }

    /** @private */
    public render(): void {
        if (this.destroyed) { return; }
        this.disposeAll();
        this.host.innerHTML = '';

        this.headerEl = createElement('div', { className: 'sidebar-header' });
        const headerHeading: HTMLElement = createElement('h3', {
            attrs: { 'id': 'form-settings-heading' }
        });
        headerHeading.textContent = this.l10n.getConstant('formsettings') || 'Form settings';
        this.headerEl.appendChild(headerHeading);
        this.host.appendChild(this.headerEl);

        const body: HTMLElement = createElement('div', {
            className: 'form-settings property-content',
            attrs: { 'role': 'region', 'aria-labelledby': 'form-settings-heading' }
        });
        this.host.appendChild(body);

        const section: HTMLElement = createElement('div', {
            className: 'form-properties-section fb-scrollbar',
            attrs: { 'aria-label': this.l10n.getConstant('formsettings') || 'Form settings' },
            styles: 'overflow-y: auto;'
        });
        body.appendChild(section);

        const groups: PropertyGroup[] = this.formSettingsConfig.groups || [];
        groups.forEach((group: PropertyGroup, index: number) => {
            const isLast: boolean = index === (groups.length - 1);
            const groupContainer: HTMLElement = createElement('div', {
                attrs: {
                    'role': 'group',
                    'aria-labelledby': `settings-group-${index}`
                }
            });
            const groupHeader: HTMLElement = createElement('h4', {
                attrs: { 'id': `settings-group-${index}` },
                styles: 'margin: 14px 12px 0 12px; font-weight: 600;'
            });
            groupHeader.textContent = this.l10n.getConstant(group.name.toLowerCase()) || group.name;
            groupContainer.appendChild(groupHeader);

            const groupHost: HTMLElement = createElement('div', {
                className: 'form-settings-group',
                attrs: { 'data-group-name': group.name }
            });
            groupContainer.appendChild(groupHost);

            const rendererOpts: PropertyGroupRendererOptions = {
                groupName: group.name,
                properties: group.properties,
                host: groupHost,
                existingValues: this.settings as PropertyValues,
                initialValues: this.settings as PropertyValues,
                onChange: (key: string, value: any) => this.handlePropertyChange(key, value),
                l10n: this.l10n,
                locale: this.locale,
                mode: this.mode,
                formSchema: this.formSchema,
                availableFields: this.availableFields
            };
            const instances: Map<string, any> = PropertyGroupRenderer.render(rendererOpts);
            this.groups.push({ groupHost, instances });

            if (!isLast) {
                const divider: HTMLElement = createElement('div', {
                    attrs: { 'aria-hidden': 'true' },
                    styles: 'margin: 0; padding: 0; border-bottom: 1px solid rgb(var(--sf-color-line-color));'
                });
                groupContainer.appendChild(divider);
            }

            section.appendChild(groupContainer);
        });
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.disposeAll();
        this.host.innerHTML = '';
        this.headerEl = null;
    }

    private handlePropertyChange(key: string, value: any): void {
        const newSettings: FormSettingsModel = { ...this.settings, [key]: value };
        this.settings = newSettings;
        this.onSave(newSettings, key);
    }


    private disposeAll(): void {
        this.groups.forEach((entry: GroupInstances) => {
            PropertyGroupRenderer.destroy(entry.instances);
            if (entry.groupHost.parentElement) {
                entry.groupHost.parentElement.removeChild(entry.groupHost);
            }
        });
        this.groups = [];
    }
}
