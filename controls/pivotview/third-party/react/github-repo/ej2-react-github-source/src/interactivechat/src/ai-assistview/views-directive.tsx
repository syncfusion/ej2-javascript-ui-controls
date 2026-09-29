import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AssistViewModel } from '@syncfusion/ej2-interactive-chat';


/**
 * Represents the React AIAssistView Component
 * ```tsx
 * <AIAssistViewComponent> 
 *    <ViewsDirective>
 *      <ViewDirective>
*      </ViewDirective>
 *    </ViewsDirective>
 * </AIAssistViewComponent>
 * ```
 */
export class ViewDirective extends ComplexBase<AssistViewModel & { children?: React.ReactNode }, AssistViewModel> {
    public static moduleName: string = 'view';
}

export class ViewsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'views';
    public static moduleName: string = 'views';
}
