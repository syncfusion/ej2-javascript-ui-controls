import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PathAnnotationModel } from '@syncfusion/ej2-diagrams';


/**
 * `Annotation` directive represent a annotation of the react Diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <ConnectorsDirective>
 * <ConnectorDirective>
 * <ConnectorAnnotationsDirective>
 * <ConnectorAnnotationDirective>
 * </ConnectorAnnotationDirective>
 * </ConnectorAnnotationsDirective>
 * </ConnectorDirective>
 * </ConnectorsDirective>
 * </DiagramComponent>
 * ```
 */
export class ConnectorAnnotationDirective extends ComplexBase<PathAnnotationModel & { children?: React.ReactNode }, PathAnnotationModel> {
    public static moduleName: string = 'connectorAnnotation';
}

export class ConnectorAnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'connectorAnnotations';
}
