import { ComplexBase } from '@syncfusion/ej2-react-base';
import { NodeModel } from '@syncfusion/ej2-diagrams';


/**
 * `NodesDirective` directive represent a nodes of the react diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <NodesDirective>
 * <NodeDirective></NodeDirective>
 * </NodesDirective>
 * </DiagramComponent>
 * ```
 */
export class NodeDirective extends ComplexBase<NodeModel & { children?: React.ReactNode }, NodeModel> {
    public static moduleName: string = 'node';
}

export class NodesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'nodes';
    public static moduleName: string = 'nodes';
}
