import { NgModule, ValueProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentionComponent } from './mention.component';
import { MentionModule } from './mention.module';





/**
 * NgModule definition for the Mention component with providers.
 */
@NgModule({
    imports: [CommonModule, MentionModule],
    exports: [
        MentionModule
    ],
    providers:[
        
    ]
})
export class MentionAllModule { }