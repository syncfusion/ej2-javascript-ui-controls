import { ChildProperty, Collection, Property } from '@syncfusion/ej2-base';
import { WorkflowTriggerStepType, WorkflowActionStepType, WorkflowFlowStepType } from './workflow-enums';
import { WorkflowHumanStepType, WorkflowAIStepType, WorkflowOutputStepType } from './workflow-enums';
import { WorkflowCustomStepDefinition } from './workflow-custom-step';
import { WorkflowCustomStepDefinitionModel } from './workflow-custom-step-model';

/**
 * Defines the node collection, the panel users pick new workflow steps from. The panel opens when
 * the user adds a step, for example from the Add command or a step's add handle, and is collapsed
 * otherwise.
 */
export class WorkflowStepCollectionSettings extends ChildProperty<WorkflowStepCollectionSettings> {
    /**
     * Defines whether the node collection is displayed. When `false`, users can't add steps from the
     * canvas and the Add commands are disabled.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Defines the Trigger steps shown in the step collection. When not set, all Trigger steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public triggers: WorkflowTriggerStepType[];

    /**
     * Defines the Action steps shown in the step collection. When not set, all Action steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public actions: WorkflowActionStepType[];

    /**
     * Defines the Flow steps shown in the step collection. When not set, all Flow steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public flow: WorkflowFlowStepType[];

    /**
     * Defines the Human steps shown in the step collection. When not set, all Human steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public human: WorkflowHumanStepType[];

    /**
     * Defines the AI steps shown in the step collection. When not set, all AI steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public ai: WorkflowAIStepType[];

    /**
     * Defines the Output steps shown in the step collection. When not set, all Output steps are
     * shown. An empty array hides the category.
     *
     * @default undefined
     */
    @Property()
    public output: WorkflowOutputStepType[];

    /**
     * Defines the custom steps shown in the Custom category of the step collection. The category is
     * hidden when no custom step is defined.
     *
     * @default []
     */
    @Collection<WorkflowCustomStepDefinitionModel>([], WorkflowCustomStepDefinition)
    public custom: WorkflowCustomStepDefinition[];
}
