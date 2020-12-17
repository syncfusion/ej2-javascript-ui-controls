import { formatUnit, createElement } from '@syncfusion/ej2-base';
import { Gantt } from '../base/gantt';

/**
 * virtual Content renderer for Gantt
 */
export class VirtualContentRenderer {
  private parent: Gantt;
  private wrapper: HTMLElement;
  constructor(parent: Gantt) {
    this.parent = parent;
  }

  /**
   * To render a wrapper for chart body content when virtualization is enabled.
   * @hidden
   */
  public renderWrapper(height?: number): void {
    this.wrapper = createElement('div', { className: 'e-virtualtable', styles: `min-height:${formatUnit(height)}` });
    this.parent.ganttChartModule.chartBodyContent.appendChild(this.wrapper);
    this.appendChildElements(this.parent.chartRowsModule.taskTable);
  }

  /**
   * To append child elements for wrappered element when virtualization is enabled.
   * @hidden
   */
  public appendChildElements(element: HTMLElement): void {
    this.wrapper.appendChild(element);
  }

  /**
   * To adjust gantt content table's style when virtualization is enabled
   * @hidden
   */
  public adjustTable(): void {
    let content: HTMLElement = this.parent.treeGrid.getContent().querySelector('.e-content').querySelector('.e-virtualtable');
    this.parent.ganttChartModule.virtualRender.wrapper.style.transform = content.style.transform;
  }
}
