import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentionComponent } from './mention.component';

const MENTION_DIRECTIVES = [
    MentionComponent
];

/**
 * NgModule definition for the Mention component.
 * Re-exports standalone Mention component and directives so existing apps can keep using:
 * `imports: [MentionModule]`
 */
@NgModule({
    imports: [CommonModule, ...MENTION_DIRECTIVES],
    exports: [...MENTION_DIRECTIVES]
})
export class MentionModule { }