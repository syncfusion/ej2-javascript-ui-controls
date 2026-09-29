/**
 * RTE Markdown Sample
 */
import { Component } from '@angular/core';
@Component({
    selector: 'app-mark-down',
    templateUrl: 'markdown.component.html',
    styleUrls: ['./markdown.component.css']
})

export class MarkdownComponent {

    // Define a toolbar items
    public tools: object = {
        items: ['Bold', 'Italic', 'StrikeThrough', '|',
        'Formats', 'OrderedList', 'UnorderedList', '|',
        'CreateLink', 'Image', '|',
        'Undo', 'Redo']
    };
    // set markdown mode
    public mode: string = 'Markdown';
}
