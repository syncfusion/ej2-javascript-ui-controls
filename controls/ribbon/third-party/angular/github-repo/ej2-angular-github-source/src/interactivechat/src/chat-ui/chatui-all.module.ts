import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageDirective, MessagesDirective } from './messages.directive';
import { ChatUIComponent } from './chatui.component';
import { ChatUIModule } from './chatui.module';





/**
 * NgModule definition for the ChatUI component with providers.
 */
@NgModule({
    imports: [CommonModule, ChatUIModule],
    exports: [
        ChatUIModule
    ],
    providers:[
        
    ]
})
export class ChatUIAllModule { }