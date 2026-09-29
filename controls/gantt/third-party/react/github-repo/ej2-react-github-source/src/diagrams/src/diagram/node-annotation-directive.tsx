import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ShapeAnnotationModel } from '@syncfusion/ej2-diagrams';


/**
 * `Node` directive represent a annotation of the react Diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <NodesDirective>
 * <NodeDirective>
 * <NodeAnnotationsDirective>
 * <NodeAnnotationDirective>
 * </NodeAnnotationDirective>
 * </NodeAnnotationsDirective>
 * </NodeDirective>
 * </NodesDirective>
 * </DiagramComponent>
 * ```
 */
export class NodeAnnotationDirective extends ComplexBase<ShapeAnnotationModel & { children?: React.ReactNode }, ShapeAnnotationModel> {
    public static moduleName: string = 'nodeAnnotation';
}

export class NodeAnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'nodeAnnotations';
}
