import { ComponentBase, gh, getProps, isExecute, vueDefineComponent, DefineVueComponent } from '@syncfusion/ej2-vue-base';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

import { WorkflowDesigner, WorkflowDesignerModel } from '@syncfusion/ej2-workflow-designer';
import { WorkflowStepsDirective, WorkflowStepDirective, WorkflowStepsPlugin, WorkflowStepPlugin } from './workflowsteps.directive'
import { WorkflowConnectionsDirective, WorkflowConnectionDirective, WorkflowConnectionsPlugin, WorkflowConnectionPlugin } from './workflowconnections.directive'
import { StickyNotesDirective, StickyNoteDirective, StickyNotesPlugin, StickyNotePlugin } from './stickynotes.directive'


export const properties: string[] = ['isLazyUpdate', 'plugins', 'aiAssistSettings', 'canvasToolbarSettings', 'enablePersistence', 'enableRtl', 'errorSettings', 'locale', 'nodeCollectionSettings', 'propertyPanelSettings', 'simulationLogSettings', 'simulationSettings', 'simulationState', 'stickyNotes', 'toolbarSettings', 'workflowConnections', 'workflowSettings', 'workflowSteps', 'aiAssistCompleted', 'aiAssistFailed', 'aiAssistRequested', 'aiRequested', 'apiRequestRequested', 'approvalRequested', 'created', 'customExecutionRequested', 'formatterCompleted', 'notifyRequested', 'simulationCompleted', 'simulationFailed', 'simulationStarted', 'simulationStateChanged', 'simulationStepCompleted', 'simulationStepFailed', 'simulationStepStarted', 'simulationStopped', 'validationCompleted', 'workflowChanged', 'workflowItemSelected', 'workflowPropertyChanged'];
export const modelProps: string[] = [];

export const testProp: any = getProps({props: properties});
export const props = testProp[0], watch = testProp[1], emitProbs: any = Object.keys(watch);
emitProbs.push('modelchanged', 'update:modelValue');
for (let props of modelProps) { emitProbs.push('update:'+props) }

/**
 * `ejs-workflow-designer` represents the VueJS Workflow Designer Component.
 * ```html
 * <ejs-workflow-designer></ejs-workflow-designer>
 * ```
 */
export let WorkflowDesignerComponent: DefineVueComponent<WorkflowDesignerModel> =  vueDefineComponent({
    name: 'WorkflowDesignerComponent',
    mixins: [ComponentBase],
    props: props,
    watch: watch,
    emits: emitProbs,
    provide() { return { custom: this.custom } },
    data() {
        return {
            ej2Instances: new WorkflowDesigner({}) as any,
            propKeys: properties as string[],
            models: modelProps as string[],
            hasChildDirective: true as boolean,
            hasInjectedModules: false as boolean,
            tagMapper: {"e-workflow-steps":"e-workflow-step","e-workflow-connections":"e-workflow-connection","e-sticky-notes":"e-sticky-note"} as { [key: string]: Object },
            tagNameMapper: {"e-workflow-steps":"e-workflowSteps","e-workflow-connections":"e-workflowConnections","e-sticky-notes":"e-stickyNotes"} as Object,
            isVue3: !isExecute as boolean,
            templateCollection: {} as any,
        }
    },
    created() {

        this.bindProperties();
        this.ej2Instances._setProperties = this.ej2Instances.setProperties;
        this.ej2Instances.setProperties = this.setProperties;
        this.ej2Instances.clearTemplate = this.clearTemplate;
        this.updated = this.updated;
    },
    render(createElement: any) {
        let h: any = !isExecute ? gh : createElement;
        let slots: any = null;
        if(!isNullOrUndefined((this as any).$slots.default)) {
            slots = !isExecute ? (this as any).$slots.default() : (this as any).$slots.default;
        }
        return h('div', slots);
    },
    methods: {
        clearTemplate(templateNames?: string[]): any {
            if (!templateNames){ templateNames = Object.keys(this.templateCollection || {}) }
            if (templateNames.length &&  this.templateCollection) {
                for (let tempName of templateNames){
                    let elementCollection: any = this.templateCollection[tempName];
                    if(elementCollection && elementCollection.length) {
                        for(let ele of elementCollection) {
                            this.destroyPortals(ele);
                        }
                        delete this.templateCollection[tempName];
                    }
                }
            }
        },
        setProperties(prop: any, muteOnChange: boolean): void {
            if(this.isVue3) { this.models = !this.models ? this.ej2Instances.referModels : this.models }
            if (this.ej2Instances && this.ej2Instances._setProperties) {
                this.ej2Instances._setProperties(prop, muteOnChange);
            }
            if (prop && this.models && this.models.length) {
                Object.keys(prop).map((key: string): void => {
                    this.models.map((model: string): void => {
                        if ((key === model) && !(/datasource/i.test(key))) {
                            if (this.isVue3) {
                                this.ej2Instances.vueInstance.$emit('update:' + key, prop[key]);
                            } else {
                                (this as any).$emit('update:' + key, prop[key]);
                                (this as any).$emit('modelchanged', prop[key]);
                            }
                        }
                    });
                });
            }
        },
        custom(): void {
            this.updated();
        },
        addWorkflowItem(item: Object | Object | Object): void {
            return this.ej2Instances.addWorkflowItem(item);
        },
        applyCopilotPreview(proposed: Object, confirmed: boolean): boolean {
            return this.ej2Instances.applyCopilotPreview(proposed, confirmed);
        },
        canRedo(): boolean {
            return this.ej2Instances.canRedo();
        },
        canUndo(): boolean {
            return this.ej2Instances.canUndo();
        },
        destroy(): void {
            return this.ej2Instances.destroy();
        },
        duplicateSelected(): void {
            return this.ej2Instances.duplicateSelected();
        },
        exportWorkflow(options?: Object): Object | string {
            return this.ej2Instances.exportWorkflow(options);
        },
        fromWorkflowJson(definition: Object | string): void {
            return this.ej2Instances.fromWorkflowJson(definition);
        },
        getSelectedWorkflowItem(): Object | Object | Object | null {
            return this.ej2Instances.getSelectedWorkflowItem();
        },
        importWorkflow(fileOrJson: Object | string | Object, _options?: Object): Object {
            return this.ej2Instances.importWorkflow(fileOrJson, _options);
        },
        layoutWorkflow(): void {
            return this.ej2Instances.layoutWorkflow();
        },
        previewCopilot(proposed: Object): Object {
            return this.ej2Instances.previewCopilot(proposed);
        },
        redo(): void {
            return this.ej2Instances.redo();
        },
        removeWorkflowItem(id: string): void {
            return this.ej2Instances.removeWorkflowItem(id);
        },
        runSimulation(context?: Object, selectedTriggerId?: string): Object {
            return this.ej2Instances.runSimulation(context, selectedTriggerId);
        },
        stopSimulation(): void {
            return this.ej2Instances.stopSimulation();
        },
        toWorkflowJson(): Object {
            return this.ej2Instances.toWorkflowJson();
        },
        undo(): void {
            return this.ej2Instances.undo();
        },
        updateWorkflowItem(id: string, changes: Object | Object | Object): void {
            return this.ej2Instances.updateWorkflowItem(id, changes);
        },
        validateWorkflow(): Object {
            return this.ej2Instances.validateWorkflow();
        },
    }
});

export type WorkflowDesignerComponent = typeof ComponentBase & {
    ej2Instances: WorkflowDesigner;
    isVue3: boolean;
    isLazyUpdate: Boolean;
    plugins: any[];
    propKeys: string[];
    models: string[];
    hasChildDirective: boolean;
    tagMapper: {
        [key: string]: Object;
    };
    tagNameMapper: Object;
    setProperties(prop: any, muteOnChange: boolean): void;
    trigger(eventName: string, eventProp: {
        [key: string]: Object;
    }, successHandler?: Function): void;
    addWorkflowItem(item: Object | Object | Object): void;
    applyCopilotPreview(proposed: Object, confirmed: boolean): boolean;
    canRedo(): boolean;
    canUndo(): boolean;
    destroy(): void;
    duplicateSelected(): void;
    exportWorkflow(options?: Object): Object | string;
    fromWorkflowJson(definition: Object | string): void;
    getSelectedWorkflowItem(): Object | Object | Object | null;
    importWorkflow(fileOrJson: Object | string | Object, _options?: Object): Object;
    layoutWorkflow(): void;
    previewCopilot(proposed: Object): Object;
    redo(): void;
    removeWorkflowItem(id: string): void;
    runSimulation(context?: Object, selectedTriggerId?: string): Object;
    stopSimulation(): void;
    toWorkflowJson(): Object;
    undo(): void;
    updateWorkflowItem(id: string, changes: Object | Object | Object): void;
    validateWorkflow(): Object
};

export const WorkflowDesignerPlugin = {
    name: 'ejs-workflowdesigner',
    install(Vue: any) {
        Vue.component(WorkflowDesignerPlugin.name, WorkflowDesignerComponent);
        Vue.component(WorkflowStepPlugin.name, WorkflowStepDirective);
        Vue.component(WorkflowStepsPlugin.name, WorkflowStepsDirective);
        Vue.component(WorkflowConnectionPlugin.name, WorkflowConnectionDirective);
        Vue.component(WorkflowConnectionsPlugin.name, WorkflowConnectionsDirective);
        Vue.component(StickyNotePlugin.name, StickyNoteDirective);
        Vue.component(StickyNotesPlugin.name, StickyNotesDirective);

    }
}