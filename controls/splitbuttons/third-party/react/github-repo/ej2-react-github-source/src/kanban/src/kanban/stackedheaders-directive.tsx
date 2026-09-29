import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StackedHeadersModel } from '@syncfusion/ej2-kanban';


/**
 * `StackedHeadersDirective` represent a stacked header of the react Kanban board. 
 * It must be contained in a Kanban component(`KanbanComponent`). 
 * ```tsx
 * <KanbanComponent>
 *  <StackedHeadersDirective>
 *   <StackedHeaderDirective keyField='Open' text='To Do'></StackedHeaderDirective>
 *   <StackedHeaderDirective keyField='Close' text='Completed'></StackedHeaderDirective>
 *  <StackedHeadersDirective>
 * </KanbanComponent>
 * ```
 */
export class StackedHeaderDirective extends ComplexBase<StackedHeadersModel & { children?: React.ReactNode }, StackedHeadersModel> {
    public static moduleName: string = 'stackedHeader';
}

export class StackedHeadersDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'stackedHeaders';
    public static moduleName: string = 'stackedHeaders';
}
