import { Property, ChildProperty } from '@syncfusion/ej2-base';import { ColumnModel } from './index';

/**
 * Interface for a class DetailsViewSettings
 */
export interface DetailsViewSettingsModel {

    /**
     * If `columnResizing` is set to true, Grid columns can be resized.
     *
     * @default true
     */
    columnResizing?: boolean;

    /**
     * Specifies the customizable details view.
     *
     * @default {
     * columns: [{
     * field: 'name', headerText: 'Name', minWidth: 120, customAttributes: { class: 'e-fe-grid-name' },
     * template: '\<span class="e-fe-text">${name}\</span>'},{field: 'size', headerText: 'Size',
     * minWidth: 50, width: '110', template: '\<span class="e-fe-size">${size}\</span>'},
     * { field: '_fm_modified', headerText: 'DateModified',
     * minWidth: 50, width: '190'}
     * ]
     * }
     */
    columns?: ColumnModel[];

}