import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColumnsModel } from '@syncfusion/ej2-kanban';

export interface ColumnsDirTypecast {
    template?: string | Function | any;
}
/**
 * `ColumnsDirective` represent a columns of the react Kanban board. 
 * It must be contained in a Kanban component(`KanbanComponent`). 
 * ```tsx
 * <KanbanComponent>
 *  <ColumnsDirective>
 *   <ColumnDirective keyField='Open' textField='To Do'></ColumnDirective>
 *   <ColumnDirective keyField='Close' textField='Completed'></ColumnDirective>
 *  <ColumnsDirective>
 * </KanbanComponent>
 * ```
 */
export class ColumnDirective extends ComplexBase<ColumnsModel| ColumnsDirTypecast & { children?: React.ReactNode }, ColumnsModel| ColumnsDirTypecast> {
    public static moduleName: string = 'column';
}

export class ColumnsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'columns';
    public static moduleName: string = 'columns';
}
