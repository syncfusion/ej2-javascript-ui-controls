import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { ColumnModel } from '@syncfusion/ej2-grids';
/**
 * Specifies the columns in the details view of the file manager.
 */
export const columnArray: ColumnModel[] = [
    {
        field: 'name', headerText: 'Name', minWidth: 120, width: 'auto',
        template: '<span class="e-fe-text" title="${name}">${name}</span>', customAttributes: { class: 'e-fe-grid-name' }
    },

    {
        field: 'dateModified', headerText: 'DateModified',
        format: { type: 'date', format: 'MMMM dd, yyyy HH:mm' },
        minWidth: 50, width: '190'
    },
    {
        field: 'size', headerText: 'Size', minWidth: 50, width: '110', template: '<span class="e-fe-size">${size}</span>'
    }

];
/**
 * Specifies the grid settings of the File Manager.
 */
export class DetailsViewSettings extends ChildProperty<DetailsViewSettings> {

    /**
     * If `columnResizing` is set to true, Grid columns can be resized.      
     * @default true  
     */
    @Property(true)
    public columnResizing: boolean;

    /**
     * Specifies the customizable details view
     * @default {     
     * Columns: [{
     * field: 'name', headerText: 'Name', minWidth: 120, width: 'auto', customAttributes: { class: 'e-fe-grid-name' },
     * template: '<span class="e-fe-text" title="${name}">${name}</span>'},{field: 'size', headerText: 'Size', 
     * minWidth: 50, width: '110', template: '<span class="e-fe-size">${size}</span>'},
     * { field: 'dateModified', headerText: 'DateModified',
     * minWidth: 50, width: '190'}
     * ]
     * }
     */
    @Property(columnArray)
    public columns: ColumnModel[];

}
