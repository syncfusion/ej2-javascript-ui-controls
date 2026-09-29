import { ComplexBase } from '@syncfusion/ej2-react-base';
import { PanePropertiesModel } from '@syncfusion/ej2-layouts';

export interface PanePropertiesDirTypecast {
    content?: string | Function | any;
}
/**
 * PanesDirective` represent a panes of the react splitter. 
 * It must be contained in a Splitter component(`SplitterComponent`). 
 * ```tsx
 * <SplitterComponent> 
 *   <PaneSettingsDirective>
 *     <PaneDirective size={this.Pane1Size}></PaneDirective>
 *     <PaneDirective size={this.Pane2Size}></PaneDirective>
 *   <PaneSettingsDirective>
 * </SplitterComponent>
 * ```
 */
export class PaneDirective extends ComplexBase<PanePropertiesModel| PanePropertiesDirTypecast & { children?: React.ReactNode }, PanePropertiesModel| PanePropertiesDirTypecast> {
    public static moduleName: string = 'pane';
}

export class PanesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'paneSettings';
    public static moduleName: string = 'panes';
}
