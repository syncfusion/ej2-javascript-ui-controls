import { Property, ChildProperty, initializeCSPTemplate } from '@syncfusion/ej2-base';
import { ColumnModel } from './index';
/**
 * Specifies the columns in the details view of the file manager.
 */
export const columnArray: ColumnModel[] = [
    {
        field: 'name', headerText: 'Name', minWidth: 120, isPrimaryKey : true,
        template: initializeCSPTemplate(function(data: any) {
            return `<span class="e-fe-text">${data.name}</span>`;
        }) as any,
        customAttributes: { class: 'e-fe-grid-name'}
    },
    {
        field: '_fm_modified', headerText: 'DateModified', type: 'dateTime',
        format: 'MMMM dd, yyyy HH:mm', minWidth: 120, width: '190'
    },
    {
        field: 'size', headerText: 'Size', minWidth: 90, width: '110',
        template: initializeCSPTemplate(function(data: any) {
            return `<span class="e-fe-size">${data.size}</span>`;
        }) as any, format: 'n2'
    }
];
/**
 * Specifies the grid settings of the File Manager.
 */
export class DetailsViewSettings extends ChildProperty<DetailsViewSettings> {

    /**
     * If `columnResizing` is set to true, Grid columns can be resized.
     *
     * @default true
     */
    @Property(true)
    public columnResizing: boolean;

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
    @Property(columnArray)
    public columns: ColumnModel[];

}
