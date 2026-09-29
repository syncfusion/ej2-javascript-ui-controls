import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ConnectorFixedUserHandleModel } from '@syncfusion/ej2-diagrams';


/**
 * `Connector` directive represent a annotation of the react Diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <ConnectorsDirective>
 * <ConnectorDirective>
 * <ConnectorFixedUserHandlesDirective>
 * <ConnectorFixedUserHandleDirective>
 * </ConnectorFixedUserHandleDirective>
 * </ConnectorFixedUserHandlesDirective>
 * </ConnectorDirective>
 * </ConnectorsDirective>
 * </DiagramComponent>
 * ```
 */
export class ConnectorFixedUserHandleDirective extends ComplexBase<ConnectorFixedUserHandleModel & { children?: React.ReactNode }, ConnectorFixedUserHandleModel> {
    public static moduleName: string = 'connectorFixedUserHandle';
}

export class ConnectorFixedUserHandlesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'fixedUserHandles';
    public static moduleName: string = 'connectorFixedUserHandles';
}
