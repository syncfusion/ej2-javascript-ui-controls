import { ComplexBase } from '@syncfusion/ej2-react-base';
import { WorkflowStepModel } from '@syncfusion/ej2-workflow-designer';


/**
 * `WorkflowStepsDirective` directive represent a steps of the react workflow designer. 
 * It must be contained in a Workflow Designer component(`WorkflowDesignerComponent`). 
 * ```ts
 * <WorkflowDesignerComponent>
 * <WorkflowStepsDirective>
 * <WorkflowStepDirective></WorkflowStepDirective>
 * </WorkflowStepsDirective>
 * </WorkflowDesignerComponent>
 * ```
 */
export class WorkflowStepDirective extends ComplexBase<WorkflowStepModel & { children?: React.ReactNode }, WorkflowStepModel> {
    public static moduleName: string = 'workflowStep';
}

export class WorkflowStepsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'workflowSteps';
    public static moduleName: string = 'workflowSteps';
}
