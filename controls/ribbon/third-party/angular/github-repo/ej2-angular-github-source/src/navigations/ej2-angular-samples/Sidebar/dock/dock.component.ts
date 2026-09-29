/**
 * Sidebar dock Sample
 */
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Sidebar } from '@syncfusion/ej2-angular-navigations';
import { enableRipple } from '@syncfusion/ej2-base';

@Component({
    selector: 'app-dock',
    templateUrl: 'dock.component.html',
    styleUrls: ['dock.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DockComponent {
    @ViewChild('dockBar')
    public dockBar: Sidebar;
    public enableDock: boolean = true;
    public width: string = '220px';
    public dockSize: string = '72px';

     positionChange(event: any) {
          this.dockBar.position = event.currentTarget.defaultValue == "left" ? "Left" : "Right";
      }
      toggleClick() {
          this.dockBar.toggle();
      }
}