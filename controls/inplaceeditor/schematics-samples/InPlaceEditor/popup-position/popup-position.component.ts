import { Component } from '@angular/core';
/**
 * Popup position - In-place Editor
 */
@Component({
    selector: 'app-inplaceeditor',
    templateUrl: 'popup-position.component.html',
    styleUrls: ['popup-position.component.css']
})

export class PopupPositionComponent {
    public popupConfig: object = {
        model: {
            position: 'BottomCenter'
        }
    };
}