import { createGrid, destroy } from '../base/treegridutil.spec';
import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { ToolbarItem } from '../../src/treegrid/enum';
import { Toolbar } from '../../src/treegrid/actions/toolbar';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * TreeGrid Locale spec 
 */
TreeGrid.Inject(Toolbar);

describe('Localization', () => {
  beforeAll(() => {
    const isDef = (o: any) => o !== undefined && o !== null;
    if (!isDef(window.performance)) {
        console.log("Unsupported environment, window.performance.memory is unavailable");
        this.skip(); //Skips test (in Chai)
        return;
    }
  });

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
          childMapping: '',
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

  it('memory leak', () => {
    profile.sample();
    let average: any = inMB(profile.averageChange)
    //Check average change in memory samples to not be over 10MB
    expect(average).toBeLessThan(10);
    let memory: any = inMB(getMemoryProfile())
    //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    expect(memory).toBeLessThan(profile.samples[0] + 0.25);
  });
});

describe('EJ2-59730 - Dynamic Localization Update Testing', () => {
  let gridObj: TreeGrid;
  const localede = {
    'de-DE': {
      'treegrid': {
        ExpandAll: 'Alle erweitern',
        CollapseAll: 'Alles einklappen',
        Print: 'Drucken'
      }
    }
  };
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: [],
        childMapping: '',
        toolbar: ['Print','ExpandAll', 'CollapseAll'],
        columns: ['taskID', 'taskName', 'duration', 'progress'],
      },
      done
    );
  });
  it('set new locale testing', () => {
    gridObj.locale = 'de-DE';
    L10n.load(localede);
    setCulture('de-DE');
  });
  it ('test localization change', () => {
    expect(gridObj.element.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe('Drucken');
    expect(gridObj.element.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe('Alle erweitern');
    expect(gridObj.element.querySelectorAll(".e-toolbar-item")[2].getAttribute("title")).toBe('Alles einklappen');
    gridObj.locale = 'en-US';
    setCulture('en-US');
  })
  afterAll(() => {
    destroy(gridObj);
  });
});
