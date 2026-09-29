import { ComplexBase } from '@syncfusion/ej2-react-base';
import { SankeyLinkModel } from '@syncfusion/ej2-charts';


/**
 * `SankeyLinkDirective` directive represent a link of the react Sankey. 
 * It must be contained in a Sankey component(`SankeyComponent`). 
 * ```
 * <SankeyComponent>
 * <SankeyLinksDirective>
 * <SankeyLinkDirective></SankeyLinkDirective>
 * </SankeyLinksDirective>
 * </SankeyComponent>
 * ```
 */
export class SankeyLinkDirective extends ComplexBase<SankeyLinkModel & { children?: React.ReactNode }, SankeyLinkModel> {
    public static moduleName: string = 'sankeyLink';
}

export class SankeyLinksCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'links';
    public static moduleName: string = 'sankeyLinksCollection';
}
