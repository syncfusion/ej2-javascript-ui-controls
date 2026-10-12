import { L10n, createElement } from '@syncfusion/ej2-base';
import { TextBox, ChangedEventArgs, TextArea } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button, RadioButton, Switch } from '@syncfusion/ej2-buttons';
import { AccordionWrapper } from './custom-accordion';
import { OptionsEditor } from './options-editor';

/** @private */
export interface DataSourceModel {
    type?: 'url' | 'raw' | 'lookup' | 'options';
    url?: string;
    method?: 'GET' | 'POST';
    headers?: { name: string; value: string }[];
    fetchOnLoad?: boolean;
    transform?: string;
    formName?: string;
    adaptorType?: string;
    dataPath?: string;
    search?: any;
    sort?: any;
    filters?: any[];
    take?: number;
    skip?: number;
    [key: string]: any;
}

/** @private */
export interface DataSourceCollectorOptions {
    host: HTMLElement;
    value: any;
    l10n: L10n;
    locale?: string;
    type?: string;
    datakey?: string;
    isAccordion?: boolean;
    onChange: (value: any) => void;
    enableRtl?: boolean;
}

/** @private */
interface DataSourceOption {
    text: string;
    value: 'options' | 'raw_data' | 'remote_url' | 'lookup';
}

/** @private */
export class DataSourceCollector {
    private host: HTMLElement;
    private value: any;
    private l10n: L10n;
    private locale: string;
    private type: string;
    private datakey: string;
    private isAccordion: boolean;
    private onChange: (value: any) => void;
    private dataSourceType: 'options' | 'raw_data' | 'remote_url' | 'lookup';
    private rawJsonData: string;
    private optionData: any;
    private formNames: string[];
    private selectedFormName: string;
    private isLoadingFormNames: boolean;
    private lookupErrorMessage: string;
    private remoteUrl: string;
    private headers: Array<{ key: string; value: string }>;
    private dataPath: string;
    private search: any;
    private sort: any;
    private filters: any[];
    private adaptorType: string;
    private take: number | null;
    private skip: number | null;
    private errorMessage: string;
    private successMessage: string;
    private controls: any[];
    private accordion: AccordionWrapper | null;
    private accordionOpen: boolean;
    private destroyed: boolean;
    private props: DataSourceCollectorOptions;

    constructor(opts: DataSourceCollectorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.value = opts.value !== undefined ? opts.value : [];
        this.l10n = opts.l10n;
        this.locale = opts.locale || 'en-US';
        this.type = opts.type || 'options';
        this.datakey = opts.datakey || 'data';
        this.isAccordion = !!opts.isAccordion;
        this.onChange = opts.onChange;
        this.dataSourceType = this.getInitialDataSourceType();
        this.rawJsonData = this.value && Array.isArray(this.value) && this.value.length === 1 && this.value[0] === 'defaultOptionValue'
            ? JSON.stringify(this.value.map((item: string) => item === 'defaultOptionValue' ? this.l10n.getConstant('defaultOptionValue') : item))
            : JSON.stringify(this.value);
        this.optionData = null;
        this.formNames = [];
        this.selectedFormName = this.resolveSelectedFormName();
        this.isLoadingFormNames = true;
        this.lookupErrorMessage = '';
        this.remoteUrl = '';
        this.headers = [];
        this.dataPath = '';
        this.search = { enabled: false, fields: [] };
        this.sort = { enabled: false, field: '', direction: 'ascending' };
        this.filters = [];
        this.adaptorType = 'WebApiAdaptor';
        this.take = null;
        this.skip = null;
        this.errorMessage = '';
        this.successMessage = '';
        this.controls = [];
        this.accordion = null;
        this.accordionOpen = false;
        this.destroyed = false;
        this.syncStateFromValue();
    }

    /** @private */
    public render(): void {
        if (this.destroyed) {
            return;
        }
        const wasAccordionOpen: boolean = this.accordionOpen;
        this.host.innerHTML = '';
        this.destroyControls();

        const content: HTMLElement = this.createContent();
        if (this.isAccordion) {
            this.accordion = new AccordionWrapper({
                host: this.host,
                title: this.l10n.getConstant('dataSource') || 'Data Source',
                content: content
            });
            this.accordion.render();
            if (wasAccordionOpen) {
                (this.accordion as any).toggle();
            }
        } else {
            this.host.appendChild(content);
        }
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        if (this.accordion) {
            this.accordion.destroy();
            this.accordion = null;
        }
        this.destroyControls();
        this.host.innerHTML = '';
    }

    private createContent(): HTMLElement {
        const root: HTMLElement = createElement('div', { className: 'data-source-collector' });

        const selector: HTMLElement = createElement('div', {
            className: 'data-source-type-selector',
            attrs: {
                role: 'radiogroup',
                'aria-label': this.l10n.getConstant('dataSource') || 'Data Source'
            },
            styles: 'margin-bottom: 1rem; display: flex; flex-direction: column; gap: 1rem;'
        });
        root.appendChild(selector);

        const options: DataSourceOption[] = this.getDataSourceOptions();
        for (let i: number = 0; i < options.length; i++) {
            const option: DataSourceOption = options[i as number];
            const radioHost: HTMLInputElement = createElement('input', {
                id: 'ds-' + option.value + '-' + this.datakey,
                attrs: { type: 'radio' }
            }) as HTMLInputElement;
            selector.appendChild(radioHost);
            const radio: RadioButton = new RadioButton({
                enableRtl: this.props.enableRtl,
                label: option.text,
                value: option.value,
                checked: this.dataSourceType === option.value,
                name: 'dataSourceType-' + this.datakey,
                change: (e: any) => {
                    if (e && e.value === option.value) {
                        this.handleDataSourceTypeChange(e.value);
                    }
                }
            });
            radio.appendTo(radioHost);
            this.controls.push(radio);
        }

        const divider: HTMLElement = createElement('div', {
            className: 'data-source-divider'
        });
        selector.appendChild(divider);

        const contentHost: HTMLElement = createElement('div', {
            className: 'data-source-content'
        });
        root.appendChild(contentHost);

        if (this.dataSourceType === 'options' && this.type !== 'grid') {
            const optionsEditorHost: HTMLElement = createElement('div');
            contentHost.appendChild(optionsEditorHost);
            const optionsEditor: OptionsEditor = new OptionsEditor({
                enableRtl: this.props.enableRtl,
                host: optionsEditorHost,
                options: this.optionData || this.value || [],
                type: this.type,
                l10n: this.l10n,
                onChange: (newValue: any) => {
                    this.optionData = newValue;
                    this.onChange(newValue);
                }
            });
            optionsEditor.render();
            this.controls.push(optionsEditor);
        }

        if (this.dataSourceType === 'raw_data') {
            const rawEditor: HTMLElement = createElement('div', { className: 'raw-data-editor' });
            contentHost.appendChild(rawEditor);

            const label: HTMLElement = createElement('label', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.75rem;'
            });
            label.textContent = (this.l10n.getConstant('json') || 'JSON') + ' ' + (this.l10n.getConstant('data') || 'Data');
            rawEditor.appendChild(label);

            const textInput: HTMLElement = createElement('textarea', { attrs: { type: 'text' } });
            rawEditor.appendChild(textInput);
            const textBox: TextArea = new TextArea({
                enableRtl: this.props.enableRtl,
                value: this.rawJsonData,
                placeholder: this.l10n.getConstant('pasteJsonArrayRecords') || 'e.g., ["Option 1", "Option 2"]',
                change: (e: ChangedEventArgs) => this.handleRawDataChange(e.value || ''),
                htmlAttributes: {'aria-label': `${this.l10n.getConstant('json') || 'JSON'}`}
            });
            textBox.appendTo(textInput);
            this.controls.push(textBox);
        }

        if (this.dataSourceType === 'remote_url') {
            const remoteEditor: HTMLElement = createElement('div', { className: 'remote-url-editor' });
            contentHost.appendChild(remoteEditor);

            const urlGroup: HTMLElement = createElement('div', {
                className: 'url-input-group',
                styles: 'margin-bottom: 1rem;'
            });
            remoteEditor.appendChild(urlGroup);

            const urlLabel: HTMLElement = createElement('label', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.5rem;'
            });
            urlLabel.textContent = this.l10n.getConstant('endpointUrl') || 'Endpoint URL';
            urlGroup.appendChild(urlLabel);

            const urlInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            urlGroup.appendChild(urlInput);
            const urlTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: this.remoteUrl,
                placeholder: this.l10n.getConstant('enterUrl') || 'Enter URL',
                change: (e: ChangedEventArgs) => {
                    this.remoteUrl = e.value || '';
                    this.errorMessage = '';
                    this.render();
                }
            });
            urlTextBox.appendTo(urlInput);
            this.controls.push(urlTextBox);

            const dataPathGroup: HTMLElement = createElement('div', {
                className: 'data-path-input',
                styles: 'margin-bottom: 1rem;'
            });
            remoteEditor.appendChild(dataPathGroup);

            const dataPathLabel: HTMLElement = createElement('div', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.5rem;'
            });
            dataPathLabel.textContent = this.l10n.getConstant('dataPath') || 'Data Path';
            dataPathGroup.appendChild(dataPathLabel);

            const dataPathInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            dataPathGroup.appendChild(dataPathInput);
            const dataPathTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: this.dataPath,
                placeholder: this.l10n.getConstant('dataPathPlaceholder') || 'Data path',
                change: (e: ChangedEventArgs) => this.dataPath = e.value || ''
            });
            dataPathTextBox.appendTo(dataPathInput);
            this.controls.push(dataPathTextBox);

            const headersEditor: HTMLElement = createElement('div', {
                className: 'headers-editor',
                styles: 'margin-bottom: 0.25rem;'
            });
            remoteEditor.appendChild(headersEditor);

            const headersHeader: HTMLElement = createElement('div', {
                styles: 'display: flex; justify-content: space-between;'
            });
            headersEditor.appendChild(headersHeader);

            const headersLabel: HTMLElement = createElement('div', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.75rem;'
            });
            headersLabel.textContent = this.l10n.getConstant('headers') || 'Headers';
            headersHeader.appendChild(headersLabel);

            const addHeaderButtonHost: HTMLElement = createElement('button', { attrs: { type: 'button' } });
            headersHeader.appendChild(addHeaderButtonHost);
            const addHeaderButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                content: this.l10n.getConstant('addHeader') || 'Add Header',
                cssClass: 'e-flat',
                iconCss: 'e-icons e-plus',
            });
            addHeaderButton.appendTo(addHeaderButtonHost);
            addHeaderButton.element.onclick = this.handleAddHeader.bind(this);
            this.controls.push(addHeaderButton);

            for (let i: number = 0; i < this.headers.length; i++) {
                const header: { key: string; value: string } = this.headers[i as number];
                const row: HTMLElement = createElement('div', {
                    styles: 'display: flex; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center;'
                });
                headersEditor.appendChild(row);

                const keyInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
                row.appendChild(keyInput);
                const keyTextBox: TextBox = new TextBox({
                    enableRtl: this.props.enableRtl,
                    value: header.key,
                    placeholder: this.l10n.getConstant('headerKey') || 'Header key',
                    change: (e: ChangedEventArgs) => this.handleHeaderKeyChange(i, e.value || '')
                });
                keyTextBox.appendTo(keyInput);
                this.controls.push(keyTextBox);

                const valueInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
                row.appendChild(valueInput);
                const valueTextBox: TextBox = new TextBox({
                    enableRtl: this.props.enableRtl,
                    value: header.value,
                    placeholder: this.l10n.getConstant('value') || 'Value',
                    change: (e: ChangedEventArgs) => this.handleHeaderValueChange(i, e.value || '')
                });
                valueTextBox.appendTo(valueInput);
                this.controls.push(valueTextBox);

                const removeHost: HTMLElement = createElement('button', { attrs: { type: 'button' } });
                row.appendChild(removeHost);
                const removeButton: Button = new Button({
                    enableRtl: this.props.enableRtl,
                    iconCss: 'e-icons e-trash',
                    cssClass: 'e-flat',
                });
                removeButton.appendTo(removeHost);
                removeButton.element.onclick = () => this.handleRemoveHeader(i);
                this.controls.push(removeButton);
            }

            const adaptorSelector: HTMLElement = createElement('div', {
                className: 'adaptor-selector',
                styles: 'margin-bottom: 0.75rem;'
            });
            remoteEditor.appendChild(adaptorSelector);

            const adaptorLabel: HTMLElement = createElement('div', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.5rem;'
            });
            adaptorLabel.textContent = this.l10n.getConstant('adaptorType') || 'Adaptor Type';
            adaptorSelector.appendChild(adaptorLabel);

            const adaptorHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            adaptorSelector.appendChild(adaptorHost);
            const adaptorDropDown: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: [
                    { text: 'Web API Adaptor', value: 'WebApiAdaptor' },
                    { text: 'URL Adaptor', value: 'UrlAdaptor' },
                    { text: 'OData V4 Adaptor', value: 'ODataV4Adaptor' }
                ],
                fields: { text: 'text', value: 'value' },
                value: this.adaptorType,
                change: (e: any) => this.adaptorType = e.value
            });
            adaptorDropDown.appendTo(adaptorHost);
            this.controls.push(adaptorDropDown);

            const adaptorDivider: HTMLElement = createElement('div', {
                className: 'data-source-adaptor-divider'
            });
            adaptorSelector.appendChild(adaptorDivider);

            this.renderQuerySections(remoteEditor);

            const saveButtonHost: HTMLElement = createElement('button', { attrs: { type: 'button' } });
            remoteEditor.appendChild(saveButtonHost);
            const saveButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                content: this.l10n.getConstant('save') || 'Save',
                cssClass: 'e-primary',
            });
            saveButton.appendTo(saveButtonHost);
            saveButton.element.onclick = this.handleSaveUrl.bind(this);
            this.controls.push(saveButton);
        }

        if (this.dataSourceType === 'lookup') {
            const lookupEditor: HTMLElement = createElement('div', {
                className: 'lookup-editor',
                styles: 'margin-bottom: 0.75rem;'
            });
            contentHost.appendChild(lookupEditor);

            const description: HTMLElement = createElement('div', { className: 'property-description' });
            description.textContent = this.l10n.getConstant('selectFormSubmissions') || 'Select form submissions';
            description.style.marginBottom = '0.5rem';
            lookupEditor.appendChild(description);

            const formNameGroup: HTMLElement = createElement('div', {
                styles: 'margin-bottom: 0.5rem;'
            });
            lookupEditor.appendChild(formNameGroup);

            const formNameLabel: HTMLElement = createElement('label', {
                styles: 'display: block; margin-bottom: 0.5rem; font-weight: 500;'
            });
            formNameLabel.textContent = this.l10n.getConstant('selectFormName') || 'Select form name';
            formNameGroup.appendChild(formNameLabel);

            const formNameInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            formNameGroup.appendChild(formNameInput);
            const formNameDropDown: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: this.formNames,
                value: this.selectedFormName,
                placeholder: this.l10n.getConstant('selectFormName') || 'Select form name',
                popupHeight: '200px',
                allowFiltering: true,
                enabled: !this.isLoadingFormNames,
                change: (e: any) => this.handleLookupFormNameChange(e.value)
            });
            formNameDropDown.appendTo(formNameInput);
            this.controls.push(formNameDropDown);

            if (this.lookupErrorMessage) {
                const message: HTMLElement = createElement('p', {
                    className: 'e-error',
                    attrs: { role: 'alert', 'aria-live': 'assertive' }
                });
                message.style.marginTop = '0.5rem';
                message.textContent = this.lookupErrorMessage;
                lookupEditor.appendChild(message);
            }
        }

        if (this.errorMessage) {
            const error: HTMLElement = createElement('p', {
                className: 'e-error',
                attrs: { role: 'alert', 'aria-live': 'assertive' }
            });
            error.textContent = this.errorMessage;
            contentHost.appendChild(error);
        }

        if (this.successMessage) {
            const success: HTMLElement = createElement('p', {
                className: 'e-success',
                attrs: { role: 'alert', 'aria-live': 'assertive' }
            });
            success.textContent = this.successMessage;
            contentHost.appendChild(success);
        }

        if (this.type !== 'grid') {
            const line: HTMLElement = createElement('div', {
                className: 'data-source-bottom-divider'
            });
            root.appendChild(line);
        }

        return root;
    }

    private renderQuerySections(host: HTMLElement): void {
        const sectionTitle: HTMLElement = createElement('div', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem;'
        });
        sectionTitle.textContent = this.l10n.getConstant('queryConfiguration') || 'Query Configuration';
        host.appendChild(sectionTitle);

        this.renderSearchSection(host);
        this.renderSortSection(host);
        this.renderFilterSection(host);
        this.renderPaginationSection(host);
    }

    private renderSearchSection(host: HTMLElement): void {
        const group: HTMLElement = createElement('div', { className: 'query-section' });
        host.appendChild(group);

        const row: HTMLElement = createElement('div', {
            styles: 'display: flex; justify-content: space-between;'
        });
        group.appendChild(row);

        const label: HTMLElement = createElement('label', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem;'
        });
        label.textContent = this.l10n.getConstant('search') || 'Search';
        row.appendChild(label);

        const toggleHost: HTMLElement = createElement('input');
        toggleHost.setAttribute('type', 'checkbox');
        row.appendChild(toggleHost);
        const searchToggle: Switch = new Switch({
            enableRtl: this.props.enableRtl,
            checked: !!this.search.enabled,
            change: (e: any) => {
                this.search = { ...this.search, enabled: !!e.checked };
                this.render();
            },
            htmlAttributes: {'aria-label': `${this.l10n.getConstant('search') || 'Search'}`}
        });
        searchToggle.appendTo(toggleHost);
        this.controls.push(searchToggle);

        if (this.search.enabled) {
            const keyBox: HTMLElement = createElement('div', { styles: 'margin-bottom: 0.75rem;' });
            group.appendChild(keyBox);

            const keyLabel: HTMLElement = createElement('div', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.5rem;'
            });
            keyLabel.textContent = this.l10n.getConstant('queryParameterName') || 'Query parameter name';
            keyBox.appendChild(keyLabel);

            const keyDescription: HTMLElement = createElement('div', { className: 'property-description' });
            keyDescription.textContent = this.l10n.getConstant('fieldToSearch') || 'Field to search';
            keyBox.appendChild(keyDescription);

            const keyInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            keyBox.appendChild(keyInput);
            const keyTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: this.search.key || (this.l10n.getConstant('search') || 'Search'),
                change: (e: ChangedEventArgs) => {
                    this.search = { ...this.search, key: e.value || '' };
                }
            });
            keyTextBox.appendTo(keyInput);
            this.controls.push(keyTextBox);

            const fieldsBox: HTMLElement = createElement('div');
            group.appendChild(fieldsBox);

            const fieldsLabel: HTMLElement = createElement('div', {
                className: 'property-label',
                styles: 'font-weight: 500; margin-bottom: 0.5rem;'
            });
            fieldsLabel.textContent = this.l10n.getConstant('fieldsToSearchIn') || 'Fields';
            fieldsBox.appendChild(fieldsLabel);

            const fieldsDescription: HTMLElement = createElement('div', { className: 'property-description' });
            fieldsDescription.textContent = this.l10n.getConstant('fieldsToSearchIn') || 'Fields to search in';
            fieldsBox.appendChild(fieldsDescription);

            const fieldsInput: HTMLElement = createElement('textarea', { attrs: { type: 'text' } });
            fieldsBox.appendChild(fieldsInput);
            const fieldsTextBox: TextArea = new TextArea({
                enableRtl: this.props.enableRtl,
                value: (this.search.fields || []).join(', '),
                change: (e: ChangedEventArgs) => {
                    this.search = {
                        ...this.search,
                        fields: (e.value || '').split(',').map((field: string) => field.trim()).filter((field: string) => field)
                    };
                },
                htmlAttributes: {'aria-label': `${this.l10n.getConstant('fieldsToSearchIn') || 'Fields'}`}
            });
            fieldsTextBox.appendTo(fieldsInput);
            this.controls.push(fieldsTextBox);
        }
    }

    private renderSortSection(host: HTMLElement): void {
        const group: HTMLElement = createElement('div', { className: 'query-section' });
        host.appendChild(group);

        const row: HTMLElement = createElement('div', {
            styles: 'display: flex; justify-content: space-between;'
        });
        group.appendChild(row);

        const label: HTMLElement = createElement('label', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem;'
        });
        label.textContent = this.l10n.getConstant('sort') || 'Sort';
        row.appendChild(label);

        const toggleHost: HTMLElement = createElement('input');
        toggleHost.setAttribute('type', 'checkbox');
        row.appendChild(toggleHost);
        const sortToggle: Switch = new Switch({
            enableRtl: this.props.enableRtl,
            checked: !!this.sort.enabled,
            change: (e: any) => {
                this.sort = { ...this.sort, enabled: !!e.checked };
                this.render();
            },
            htmlAttributes: {'aria-label': `${this.l10n.getConstant('sort') || 'Sort'}`}
        });
        sortToggle.appendTo(toggleHost);
        this.controls.push(sortToggle);

        if (this.sort.enabled) {
            const wrapper: HTMLElement = createElement('div', {
                styles: 'display: flex; flex-direction: column; gap: 0.5rem;'
            });
            group.appendChild(wrapper);

            const fieldLabel: HTMLElement = createElement('div', { className: 'property-label', styles: 'font-weight: 500;' });
            fieldLabel.textContent = this.l10n.getConstant('fieldToSortBy') || 'Field';
            wrapper.appendChild(fieldLabel);

            const fieldInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            wrapper.appendChild(fieldInput);
            const fieldTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: this.sort.field || '',
                placeholder: this.l10n.getConstant('fieldToSortBy') || 'Field to sort by',
                change: (e: ChangedEventArgs) => this.sort = { ...this.sort, field: e.value || '' }
            });
            fieldTextBox.appendTo(fieldInput);
            this.controls.push(fieldTextBox);

            const directionLabel: HTMLElement = createElement('div', { className: 'property-label', styles: 'font-weight: 500;' });
            directionLabel.textContent = this.l10n.getConstant('direction') || 'Direction';
            wrapper.appendChild(directionLabel);

            const directionInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            wrapper.appendChild(directionInput);
            const directionDropDown: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: [
                    { text: this.l10n.getConstant('ascending') || 'Ascending', value: 'ascending' },
                    { text: this.l10n.getConstant('descending') || 'Descending', value: 'descending' }
                ],
                fields: { text: 'text', value: 'value' },
                value: this.sort.direction || 'ascending',
                change: (e: any) => this.sort = { ...this.sort, direction: e.value }
            });
            directionDropDown.appendTo(directionInput);
            this.controls.push(directionDropDown);
        }
    }

    private renderFilterSection(host: HTMLElement): void {
        const group: HTMLElement = createElement('div', { className: 'query-section' });
        host.appendChild(group);

        const row: HTMLElement = createElement('div', {
            styles: 'display: flex; justify-content: space-between;'
        });
        group.appendChild(row);

        const label: HTMLElement = createElement('div', {
            className: 'property-label',
            styles: 'font-weight: 500; margin-bottom: 0.25rem;'
        });
        label.textContent = this.l10n.getConstant('filters') || 'Filters';
        row.appendChild(label);

        const addFilterHost: HTMLElement = createElement('button', { attrs: { type: 'button' } });
        row.appendChild(addFilterHost);
        const addFilterButton: Button = new Button({
            enableRtl: this.props.enableRtl,
            iconCss: 'e-icons e-plus',
            cssClass: 'e-flat',
            content: this.l10n.getConstant('addHeader') || 'Add',
        });
        addFilterButton.appendTo(addFilterHost);
        addFilterButton.element.onclick = () => {
            this.filters = this.filters.concat([{ field: '', operator: 'equal', value: '' }]);
            this.render();
        };
        this.controls.push(addFilterButton);

        if (this.filters.length > 0) {
            const hint: HTMLElement = createElement('div', { className: 'property-description', styles: 'margin-bottom: 0.75rem;' });
            hint.textContent = this.l10n.getConstant('fieldToSearch') || 'Field to search';
            group.appendChild(hint);
        }

        for (let i: number = 0; i < this.filters.length; i++) {
            const filter: any = this.filters[i as number];
            const filterRow: HTMLElement = createElement('div', {
                className: 'filter-row',
                styles: 'display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; align-items: center; padding: 6px; border-radius: 12px;'
            });
            group.appendChild(filterRow);
            const fieldInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            filterRow.appendChild(fieldInput);
            const fieldTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: filter.field || '',
                placeholder: this.l10n.getConstant('fieldStatus') || 'Field',
                change: (e: ChangedEventArgs) => this.updateFilterValue(i, 'field', e.value || '')
            });
            fieldTextBox.appendTo(fieldInput);
            this.controls.push(fieldTextBox);

            const operatorInputWrap: HTMLElement = createElement('div', {
                styles: 'flex: 0.5; min-width: 0;'
            });
            filterRow.appendChild(operatorInputWrap);
            const operatorInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            operatorInputWrap.appendChild(operatorInput);
            const operatorDropDown: DropDownList = new DropDownList({
                enableRtl: this.props.enableRtl,
                dataSource: [
                    { text: '=', value: 'equal' },
                    { text: '!=', value: 'notequal' },
                    { text: 'contains', value: 'contains' },
                    { text: '>', value: 'greaterthan' },
                    { text: '<', value: 'lessthan' },
                    { text: '>=', value: 'greaterthanorequal' },
                    { text: '<=', value: 'lessthanorequal' }
                ],
                fields: { text: 'text', value: 'value' },
                value: filter.operator || 'equal',
                change: (e: any) => this.updateFilterValue(i, 'operator', e.value)
            });
            operatorDropDown.appendTo(operatorInput);
            this.controls.push(operatorDropDown);

            const valueInputWrap: HTMLElement = createElement('div', {
                styles: 'flex: 1; min-width: 0;'
            });
            filterRow.appendChild(valueInputWrap);
            const valueInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
            valueInputWrap.appendChild(valueInput);
            const valueTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: filter.value || '',
                placeholder: this.l10n.getConstant('value') || 'Value',
                change: (e: ChangedEventArgs) => this.updateFilterValue(i, 'value', e.value || '')
            });
            valueTextBox.appendTo(valueInput);
            this.controls.push(valueTextBox);

            const deleteHost: HTMLElement = createElement('button', { attrs: { type: 'button' } });
            filterRow.appendChild(deleteHost);
            const deleteButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                iconCss: 'e-icons e-trash',
                cssClass: 'e-flat',
            });
            deleteButton.appendTo(deleteHost);
            deleteButton.element.onclick = () => this.handleRemoveFilter(i);
            this.controls.push(deleteButton);
        }
    }

    private renderPaginationSection(host: HTMLElement): void {
        const group: HTMLElement = createElement('div', { className: 'query-section' });
        host.appendChild(group);

        const row: HTMLElement = createElement('div', {
            styles: 'display: flex; gap: 0.5rem;'
        });
        group.appendChild(row);

        const skipWrap: HTMLElement = createElement('div');
        row.appendChild(skipWrap);
        const skipLabel: HTMLElement = createElement('div', {
            className: 'property-label',
            styles: 'font-weight: 500; margin-bottom: 0.25rem;'
        });
        skipLabel.textContent = this.l10n.getConstant('offset') || 'Offset';
        skipWrap.appendChild(skipLabel);

        const skipInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        skipWrap.appendChild(skipInput);
        const skipTextBox: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: this.skip !== null ? String(this.skip) : '',
            placeholder: this.l10n.getConstant('skipOffset') || 'Skip offset',
            change: (e: ChangedEventArgs) => this.skip = parseInt(e.value || '0', 10) || 0
        });
        skipTextBox.appendTo(skipInput);
        this.controls.push(skipTextBox);

        const takeWrap: HTMLElement = createElement('div');
        row.appendChild(takeWrap);
        const takeLabel: HTMLElement = createElement('div', {
            className: 'property-label',
            styles: 'font-weight: 500; margin-bottom: 0.25rem;'
        });
        takeLabel.textContent = this.l10n.getConstant('limit') || 'Limit';
        takeWrap.appendChild(takeLabel);

        const takeInput: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        takeWrap.appendChild(takeInput);
        const takeTextBox: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: this.take !== null ? String(this.take) : '',
            placeholder: this.l10n.getConstant('takeLimit') || 'Take limit',
            change: (e: ChangedEventArgs) => this.take = parseInt(e.value || '0', 10) || 0
        });
        takeTextBox.appendTo(takeInput);
        this.controls.push(takeTextBox);
    }

    private handleDataSourceTypeChange(value: 'options' | 'raw_data' | 'remote_url' | 'lookup'): void {
        this.dataSourceType = value;
        this.errorMessage = '';
        this.successMessage = '';
        this.headers = [];
        if (value !== 'lookup') {
            this.selectedFormName = '';
            this.lookupErrorMessage = '';
        }
        if (this.accordion) {
            this.accordionOpen = (this.accordion as any).isOpen;
        }
        this.render();
    }

    private handleRawDataChange(value: string): void {
        this.rawJsonData = value;
        this.errorMessage = '';
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                this.onChange(parsed);
            }
        } catch (error) {
            const msg: string = error && (error as any).message ? (error as any).message : 'Invalid JSON format';
            this.errorMessage = this.l10n.getConstant('invalidJson') || ('Invalid JSON: ' + msg);
            this.render();
        }
    }

    private handleAddHeader(): void {
        this.headers = this.headers.concat([{ key: '', value: '' }]);
        this.render();
    }

    private handleRemoveHeader(index: number): void {
        const updated = this.headers.filter((item: { key: string; value: string }, itemIndex: number) => itemIndex !== index);
        this.headers = updated;
        this.render();
    }

    private handleHeaderKeyChange(index: number, value: string): void {
        const updated = this.headers.slice();
        updated[index as number] = { ...updated[index as number], key: value };
        this.headers = updated;
    }

    private handleHeaderValueChange(index: number, value: string): void {
        const updated = this.headers.slice();
        updated[index as number] = { ...updated[index as number], value: value };
        this.headers = updated;
    }

    private handleSaveUrl(): void {
        if (!this.remoteUrl || !this.remoteUrl.trim()) {
            this.errorMessage = this.l10n.getConstant('pleaseEnterUrl') || 'Please enter a URL';
            this.successMessage = '';
            this.onChange([]);
            this.render();
            return;
        }

        const config: any = {
            type: 'url',
            url: this.remoteUrl,
            headers: this.headers.filter((header: { key: string; value: string }) => !!header.key && !!header.key.trim()),
            adaptorType: this.adaptorType,
            dataPath: this.dataPath || undefined,
            search: this.search && this.search.enabled ? this.search : undefined,
            sort: this.sort && this.sort.enabled ? this.sort : undefined,
            filters: this.filters && this.filters.length > 0 ? this.filters : undefined,
            take: this.take !== null && this.take > 0 ? this.take : undefined,
            skip: this.skip !== null && this.skip > 0 ? this.skip : undefined
        };

        this.onChange(config);
        this.errorMessage = '';
        this.successMessage = this.l10n.getConstant('urlSavedSuccessfully') || 'URL configuration saved successfully';
        this.render();
    }

    private handleLookupFormNameChange(value: string): void {
        this.selectedFormName = value || '';
        this.lookupErrorMessage = '';
        if (value) {
            this.onChange({ type: 'lookup', formName: value });
        } else {
            this.onChange([]);
        }
    }

    private updateFilterValue(index: number, key: string, value: string): void {
        const updated = this.filters.slice();
        updated[index as number] = { ...updated[index as number], [key]: value };
        this.filters = updated;
    }

    private handleRemoveFilter(index: number): void {
        this.filters = this.filters.filter((item: any, itemIndex: number) => itemIndex !== index);
        this.render();
    }

    private syncStateFromValue(): void {
        if (!this.value || typeof this.value !== 'object' || Array.isArray(this.value)) {
            if (Array.isArray(this.value)) {
                this.rawJsonData = this.value && Array.isArray(this.value) && this.value.length === 1 && this.value[0] === 'defaultOptionValue'
            ? JSON.stringify(this.value.map((item: string) => item === 'defaultOptionValue' ? this.l10n.getConstant('defaultOptionValue') : item))
            : JSON.stringify(this.value);
            }
            return;
        }

        if (this.value.type === 'url') {
            this.dataSourceType = 'remote_url';
            this.remoteUrl = this.value.url || '';
            this.headers = Array.isArray(this.value.headers) ? this.value.headers.map((header: any) => ({ key: header.key || header.name || '', value: header.value || '' })) : [];
            this.search = this.value.search || { enabled: false, fields: [] };
            this.sort = this.value.sort || { enabled: false, field: '', direction: 'ascending' };
            this.filters = this.value.filters || [];
            this.adaptorType = this.value.adaptorType || 'WebApiAdaptor';
            this.take = this.value.take !== undefined ? this.value.take : null;
            this.skip = this.value.skip !== undefined ? this.value.skip : null;
            this.dataPath = this.value.dataPath || '';
        } else if (this.value.type === 'raw') {
            this.dataSourceType = 'raw_data';
            this.rawJsonData = this.value && Array.isArray(this.value) && this.value.length === 1 && this.value[0] === 'defaultOptionValue'
            ? JSON.stringify(this.value.map((item: string) => item === 'defaultOptionValue' ? this.l10n.getConstant('defaultOptionValue') : item))
            : JSON.stringify(this.value.data || this.value);
        } else if (this.value.type === 'lookup' && this.value.formName) {
            this.dataSourceType = 'lookup';
            this.selectedFormName = this.value.formName;
        } else if (this.type === 'grid') {
            this.dataSourceType = 'raw_data';
        } else {
            this.dataSourceType = 'options';
        }
    }

    private resolveSelectedFormName(): string {
        if (this.value && typeof this.value === 'object' && !Array.isArray(this.value) && this.value.formName) {
            return this.value.formName;
        }
        return '';
    }

    private getInitialDataSourceType(): 'options' | 'raw_data' | 'remote_url' | 'lookup' {
        if (this.type === 'grid') {
            return 'raw_data';
        }
        return 'options';
    }

    private getDataSourceOptions(): DataSourceOption[] {
        const all: DataSourceOption[] = [
            { text: this.l10n.getConstant('options') || 'Options', value: 'options' },
            { text: this.l10n.getConstant('rawData') || 'Raw Data', value: 'raw_data' },
            { text: this.l10n.getConstant('remoteUrl') || 'Remote URL', value: 'remote_url' }
        ];
        if (this.type === 'grid') {
            return all.filter((option: DataSourceOption) => option.value !== 'options');
        }
        return all;
    }

    private destroyControls(): void {
        this.controls.forEach((control: any) => {
            if (control && typeof control.destroy === 'function') {
                try {
                    control.destroy();
                } catch (e) {
                    // best-effort cleanup
                }
            }
        });
        this.controls = [];
    }
}
