/**
 * RTE Iframe Sample
 */
import { Component } from '@angular/core';

@Component({
    selector: 'app-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['./iframe.component.css']
})

export class IframeComponent {

    // Define a required toolbar items
    public tools: object = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'LowerCase', 'UpperCase', '|',
        'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
        'Outdent', 'Indent', '|',
        'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
    };
    // Enable the iframe
    public iframe: object = { enable: true };
    // Set the RTE height
    public height: number = 500;
}
