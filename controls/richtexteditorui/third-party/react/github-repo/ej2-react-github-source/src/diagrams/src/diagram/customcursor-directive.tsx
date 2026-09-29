import { ComplexBase } from '@syncfusion/ej2-react-base';
import { CustomCursorActionModel } from '@syncfusion/ej2-diagrams';


/**
 * `custormaps Directive` directive represent a connectors of the react diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <CustormapsDirective>
 * <CustormapDirective></CustormapDirective>
 * </CustormapsDirective>
 * </DiagramComponent>
 * ```
 */
export class CustomCursorDirective extends ComplexBase<CustomCursorActionModel & { children?: React.ReactNode }, CustomCursorActionModel> {
    public static moduleName: string = 'customCursor';
}

export class CustomCursorsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'customCursor';
    public static moduleName: string = 'customCursors';
}
