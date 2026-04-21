import { INotifyPropertyChanged, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { InterActiveChatBase } from '../interactive-chat-base/interactive-chat-base';
import {InterActiveChatBaseModel} from "../interactive-chat-base/interactive-chat-base-model";

/**
 * Interface for a class AIAssistBase
 */
export interface AIAssistBaseModel extends InterActiveChatBaseModel{

    /**
     * Specifies whether the prompt response need to be added through streaming in the component.
     * By default the response is not streamed and default value is false
     *
     * @type {boolean}
     * @default false
     */
    enableStreaming?: boolean;

}