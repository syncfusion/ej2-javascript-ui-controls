import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PointPortModel } from '@syncfusion/ej2-diagrams';


/**
 * `Node` directive represent a port of the react Diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <NodesDirective>
 * <NodeDirective>
 * <PortCollectionDirective>
 * <PortDirective>
 * </PortDirective>
 * </PortCollectionDirective>
 * </NodeDirective>
 * </NodesDirective>
 * </DiagramComponent>
 * ```
 */
export class PortDirective extends ComplexBase<PointPortModel & { children?: React.ReactNode }, PointPortModel> {
    public static moduleName: string = 'port';
}

export class PortsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'ports';
    public static moduleName: string = 'ports';
}
