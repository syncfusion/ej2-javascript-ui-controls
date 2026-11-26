import { Diagram } from '@syncfusion/ej2-diagrams';
import { WorkflowSettingsModel } from '../models/workflow-settings-model';
import { WorkflowStep } from '../models/workflow-step';
import { DiagramMapper } from '../mapping/diagram-mapper';

type LayoutCallback = () => void;

/** Runs the internal Syncfusion flowchart layout and writes positions back. */
export class ComplexHierarchicalTreeLayout {
    private readonly diagram: Diagram;
    private readonly mapper: DiagramMapper;

    /**
     * Creates a flowchart layout service.
     *
     * @param {Diagram} diagram - The Diagram instance to lay out.
     * @param {DiagramMapper} mapper - The mapper used to synchronize positions.
     */
    public constructor(diagram: Diagram, mapper: DiagramMapper) {
        this.diagram = diagram;
        this.mapper = mapper;
    }

    /**
     * Runs flowchart layout when enabled and synchronizes executable positions.
     *
     * @param {WorkflowStep[]} steps - Public executable workflow steps.
     * @param {WorkflowSettingsModel} settings - Public workflow settings.
     * @param {LayoutCallback} [callback] - Invoked after a layout actually completes.
     * @returns {boolean} `true` when layout ran; otherwise `false`.
     */
    public run(steps: WorkflowStep[], settings: WorkflowSettingsModel, callback?: LayoutCallback): boolean {
        this.mapper.markStickyNotesExcluded();
        this.diagram.doLayout();
        this.diagram.fitToPage();
        this.mapper.syncPositionsFromDiagram(steps);
        if (callback) {
            callback();
        }
        return true;
    }

}
