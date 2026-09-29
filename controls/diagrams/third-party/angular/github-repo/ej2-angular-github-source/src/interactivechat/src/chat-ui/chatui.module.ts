import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDirective, MessagesDirective } from './messages.directive';
import { ChatUIComponent } from './chatui.component';

const CHATUI_DIRECTIVES = [
    ChatUIComponent,
        MessageDirective,
        MessagesDirective
];

/**
 * NgModule definition for the ChatUI component.
 * Re-exports standalone ChatUI component and directives so existing apps can keep using:
 * `imports: [ChatUIModule]`
 */
@NgModule({
    imports: [CommonModule, ...CHATUI_DIRECTIVES],
    exports: [...CHATUI_DIRECTIVES]
})
export class ChatUIModule { }