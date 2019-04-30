/**
 * RTE Inline Sample
 */
import { Component } from '@angular/core';

@Component({
    selector: 'app-inline',
    templateUrl: 'inline.component.html',
    styleUrls: ['./inline.component.css']
})

export class InlineComponent {

    // Define a toolbar items
    public toolbarSettings: Object = {
        items: ['Bold', 'Italic', 'Underline',
            'Formats', '-', 'Alignments', 'OrderedList', 'UnorderedList',
            'CreateLink']
    };
    // Set the format dropdown width
    public format: Object = {
        width: 'auto'
    };
    // Set the font family dropdown width
    public fontFamily: Object = {
        width: 'auto'
    };
    // Enable inline mode
    public inlineMode: object = { enable: true, onSelection: true };
}
