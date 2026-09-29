import { ComplexBase } from '@syncfusion/ej2-react-base';
import { WorkflowConnectionModel } from '@syncfusion/ej2-workflow-designer';


/**
 * `WorkflowConnectionsDirective` directive represent a connections of the react workflow designer. 
 * It must be contained in a Workflow Designer component(`WorkflowDesignerComponent`). 
 * ```ts
 * <WorkflowDesignerComponent>
 * <WorkflowConnectionsDirective>
 * <WorkflowConnectionDirective></WorkflowConnectionDirective>
 * </WorkflowConnectionsDirective>
 * </WorkflowDesignerComponent>
 * ```
 */
export class WorkflowConnectionDirective extends ComplexBase<WorkflowConnectionModel & { children?: React.ReactNode }, WorkflowConnectionModel> {
    public static moduleName: string = 'workflowConnection';
}

export class WorkflowConnectionsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'workflowConnections';
    public static moduleName: string = 'workflowConnections';
}
