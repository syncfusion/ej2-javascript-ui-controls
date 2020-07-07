import { BlazorDotnetObject, enableBlazorMode } from '@syncfusion/ej2-base';
import { SfTreeGrid } from './sf-treegrid-fn';
import { BlazorTreeGridElement, ITreeGridOptions  } from './interface';

/**
 * Blazor treegrid interop handler
 */
// tslint:disable

let TreeGrid: Object = {

    initialize(element: BlazorTreeGridElement, options: ITreeGridOptions, dotnetRef: BlazorDotnetObject): void {
      enableBlazorMode();
      new SfTreeGrid(element, options, dotnetRef);
    },

    modelChanged(element: BlazorTreeGridElement, options: ITreeGridOptions, actionArgs: string): void {
      element.blazor_instance.options = options;
	  let args: Object = JSON.parse(actionArgs);
    },

    copyToClipBoard(element: BlazorTreeGridElement, withHeader: boolean): void {
      if (element.blazor_instance.grid.options.selectionMode === 'Cell') {
        element.blazor_instance.grid.clipboardModule.copy(withHeader);
      } else {
        element.blazor_instance.clipboardModule.copy(withHeader);
      }
    },

    destroy(element: BlazorTreeGridElement): void {
      element.blazor_instance.destroy();
    },
};
export default TreeGrid;