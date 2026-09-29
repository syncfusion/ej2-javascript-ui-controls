import { ComplexBase } from '@syncfusion/ej2-react-base';
import { MessageModel } from '@syncfusion/ej2-interactive-chat';


/**
 * Represents the React ChatUI Component
 * ```tsx
 * <ChatUIComponent> 
 *    <MessagesDirective>
 *      <MessageDirective>
*      </MessageDirective>
 *    </MessagesDirective>
 * </ChatUIComponent>
 * ```
 */
export class MessageDirective extends ComplexBase<MessageModel & { children?: React.ReactNode }, MessageModel> {
    public static moduleName: string = 'message';
}

export class MessagesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'messages';
    public static moduleName: string = 'messages';
}
