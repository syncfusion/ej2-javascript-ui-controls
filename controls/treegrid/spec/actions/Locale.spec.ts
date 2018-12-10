import { createGrid, destroy } from '../base/treegridutil.spec';
import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { L10n } from '@syncfusion/ej2-base';
import { ToolbarItem } from '../../src/treegrid/enum';
import { Toolbar } from '../../src/treegrid/actions/toolbar';

/**
 * TreeGrid Locale spec 
 */
TreeGrid.Inject(Toolbar);

describe('Localization', () => {
  describe('Localization Testing', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      L10n.load({
        'de-DE': {
            'treegrid': {
                EmptyRecord: 'Geen records om te laten zien',
                ExpandAll: 'Uitbreiden',
                CollapseAll: 'Ineenstorting',
            }
        }
      });
      gridObj = createGrid(
        {
          dataSource: [],
          toolbar: ['Print','ExpandAll', 'CollapseAll'],
          locale: 'de-DE',
          columns: ['taskID', 'taskName', 'duration', 'progress'],
        },
        done
      );
    });
    it('renderEmptyRow testing', () => {
      expect(gridObj.element.querySelector('.e-emptyrow').textContent).toBe('Geen records om te laten zien');
      expect(gridObj.element.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe('Uitbreiden');
      expect(gridObj.element.querySelectorAll(".e-toolbar-item")[2].getAttribute("title")).toBe('Ineenstorting');
    });
    afterAll(() => {
      destroy(gridObj);
    });
  });
});