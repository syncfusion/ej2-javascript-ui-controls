import { ComplexBase } from '@syncfusion/ej2-react-base';
import { SankeyNodeModel } from '@syncfusion/ej2-charts';


/**
 * `SankeyNodeDirective` directive represent a node of the react Sankey. 
 * It must be contained in a Sankey component(`SankeyComponent`). 
 * ```
 * <SankeyComponent>
 * <SankeyNodesDirective>
 * <SankeyNodeDirective></SankeyNodeDirective>
 * </SankeyNodesDirective>
 * </SankeyComponent>
 * ```
 */
export class SankeyNodeDirective extends ComplexBase<SankeyNodeModel & { children?: React.ReactNode }, SankeyNodeModel> {
    public static moduleName: string = 'sankeyNode';
}

export class SankeyNodesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'nodes';
    public static moduleName: string = 'sankeyNodesCollection';
}
