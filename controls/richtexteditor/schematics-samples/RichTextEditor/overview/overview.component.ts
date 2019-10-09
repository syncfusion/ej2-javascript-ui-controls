/**
 * RTE Overview Sample
 */
import { Component } from '@angular/core';

@Component({
    selector: 'app-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['./overview.component.css']
})

export class OverviewComponent {

    // Define a toolbar items
    public tools: object = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'LowerCase', 'UpperCase', '|',
        'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
        'Outdent', 'Indent', '|',
        'CreateTable', 'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
    };
    // set maximum length content
    public maxLength: number = 1000;
}
