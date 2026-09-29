import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AssistViewModel } from '@syncfusion/ej2-interactive-chat';


/**
 * Represents the React AIAssistView Component
 * ```tsx
 * <AIAssistViewComponent> 
 *    <MentionsDirective>
 *      <MentionDirective>
*      </MentionDirective>
 *    </MentionsDirective>
 * </AIAssistViewComponent>
 * ```
 */
export class MentionDirective extends ComplexBase<AssistViewModel & { children?: React.ReactNode }, AssistViewModel> {
    public static moduleName: string = 'mention';
}

export class MentionsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'mentions';
    public static moduleName: string = 'mentions';
}
