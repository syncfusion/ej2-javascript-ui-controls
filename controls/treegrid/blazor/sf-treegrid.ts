import { BlazorDotnetObject, enableBlazorMode, isNullOrUndefined } from '@syncfusion/ej2-base';
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

    modelChanged(element: BlazorTreeGridElement, options: ITreeGridOptions): void {
      if (!isNullOrUndefined(element.blazor_instance)) {
        element.blazor_instance.options = options;
      }
    },

    headerCheckbox(element: BlazorTreeGridElement, colIndex: number, options: ITreeGridOptions, dotnetRef: BlazorDotnetObject) {
      if (!isNullOrUndefined(element)) {
        element.blazor_instance.checkboxcolumnModule.renderHeaderCheckbox(element, colIndex);
      }
    },

    updateCheckbox(element: BlazorTreeGridElement, colIndex: number, checkState: string){
      let thElement: Element = element.querySelectorAll('.e-gridheader th')[colIndex];
	    let spanElement: Element = thElement.querySelector('span.e-frame');
	    element.blazor_instance.checkboxcolumnModule.updateHeaderCheckbox(spanElement, checkState);
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