import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';

const MESSAGE_DIRECTIVES = [
    MessageComponent
];

/**
 * NgModule definition for the Message component.
 * Re-exports standalone Message component and directives so existing apps can keep using:
 * `imports: [MessageModule]`
 */
@NgModule({
    imports: [CommonModule, ...MESSAGE_DIRECTIVES],
    exports: [...MESSAGE_DIRECTIVES]
})
export class MessageModule { }