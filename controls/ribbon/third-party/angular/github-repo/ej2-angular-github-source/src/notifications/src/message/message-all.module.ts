import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MessageModule } from './message.module';





/**
 * NgModule definition for the Message component with providers.
 */
@NgModule({
    imports: [CommonModule, MessageModule],
    exports: [
        MessageModule
    ],
    providers:[
        
    ]
})
export class MessageAllModule { }