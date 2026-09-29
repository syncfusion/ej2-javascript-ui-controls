import { ComplexBase } from '@syncfusion/ej2-react-base';
import { WorkflowStickyNoteModel } from '@syncfusion/ej2-workflow-designer';


/**
 * `StickyNotesDirective` directive represent a sticky notes of the react workflow designer. 
 * It must be contained in a Workflow Designer component(`WorkflowDesignerComponent`). 
 * ```ts
 * <WorkflowDesignerComponent>
 * <StickyNotesDirective>
 * <StickyNoteDirective></StickyNoteDirective>
 * </StickyNotesDirective>
 * </WorkflowDesignerComponent>
 * ```
 */
export class StickyNoteDirective extends ComplexBase<WorkflowStickyNoteModel & { children?: React.ReactNode }, WorkflowStickyNoteModel> {
    public static moduleName: string = 'stickyNote';
}

export class StickyNotesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'stickyNotes';
    public static moduleName: string = 'stickyNotes';
}
