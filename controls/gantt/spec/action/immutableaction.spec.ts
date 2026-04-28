// /**
 // * Gantt Immutable spec
 // */
// import { Gantt, Edit, Toolbar, Selection } from '../../src/index';
// import { selfReference } from '../base/data-source.spec';
// import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';

// describe('Immutable action', () => {
  // describe('Immutable action', () => {
    // Gantt.Inject(Edit, Toolbar, Selection);
    // let ganttObj: Gantt;
    // beforeAll((done: Function) => {
      // ganttObj = createGantt(
        // {
          // dataSource: selfReference,
          // allowSelection: true,
          // taskFields: {
            // id: 'TaskID',
            // name: 'TaskName',
            // startDate: 'StartDate',
            // endDate: 'EndDate',
            // duration: 'Duration',
            // progress: 'Progress',
            // dependency: 'Predecessor',
            // parentID: 'parentID'
          // },
          // enableImmutableMode: true,
          // editSettings: {
            // allowAdding: true,
            // allowEditing: true,
            // allowDeleting: true,
            // allowTaskbarEditing: true,
          // },
          // toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            // 'PrevTimeSpan', 'NextTimeSpan'],
          // projectStartDate: new Date('02/19/2017'),
          // projectEndDate: new Date('05/30/2017')
        // }, done);
    // });
    // afterAll(() => {
      // if (ganttObj) {
        // destroyGantt(ganttObj);
      // }
    // });

    // it('collapse - Immutable changes', (done: Function) => {
      // let collapsed: () => void = (args?: Object): void => {
        // expect(args['gridRow'].style.backgroundColor == "pink").toBe(true);
         // done();
      // }
      // ganttObj.collapsed = collapsed;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-treerowcell.e-gridrowindex0level0 > div > span.e-icons.e-treegridexpand') as HTMLElement;
      // triggerMouseEvent(clickElement, 'click');
    // });
    // it('expand - Immutable changes', (done: Function) => {
      // let expanded: () => void = (args?: Object): void => {
        // expect(args['gridRow'].style.backgroundColor == "pink").toBe(true);
        // done();
      // }
      // ganttObj.expanded = expanded;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // let clickElement: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-treerowcell.e-gridrowindex0level0.e-focus > div > span.e-icons.e-treegridcollapse') as HTMLElement;
      // triggerMouseEvent(clickElement, 'click');
    // });
    // it('adding record', () => {
      // let actionComplete: () => void = (args?: any): void => {
        // if (args.requestType === "add") {
          // expect(ganttObj.treeGrid.getRows()[0].style.backgroundColor == "pink").toBe(true);
        // }
      // }
      // ganttObj.actionComplete = actionComplete;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // ganttObj.selectRow(0);
      // ganttObj.addRecord({TaskName:'New Task'}, 'Child');
    // });
    // it('editing record', () => {
      // let actionComplete: () => void = (args?: any): void => {
        // if (args.requestType === "save") {
          // expect(ganttObj.treeGrid.getRows()[0].style.backgroundColor == "pink").toBe(true);
        // }
      // }
      // ganttObj.actionComplete = actionComplete;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
     // ganttObj.updateRecordByID({TaskID: 2, Duration:6});
    // });
    
    // it('deleting record', () => {
      // let actionComplete: () => void = (args?: any): void => {
        // if (args.requestType === "delete") {
          // expect(ganttObj.treeGrid.getRows()[0].style.backgroundColor == "pink").toBe(true);
        // }
      // }
      // ganttObj.actionComplete = actionComplete;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // ganttObj.deleteRecord(2);
    // });
    // it('indenting record', () => {
      // let actionComplete: () => void = (args?: any): void => {
        // if (args.requestType === "indented") {
          // expect(ganttObj.treeGrid.getRows()[0].style.backgroundColor == "pink").toBe(true);
        // }
      // }
      // ganttObj.actionComplete = actionComplete;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // ganttObj.selectRow(3);
      // ganttObj.indent();
    // });
    // it('outdenting record', () => {
      // let actionComplete: () => void = (args?: any): void => {
        // if (args.requestType === "outdented") {
          // expect(ganttObj.treeGrid.getRows()[0].style.backgroundColor == "pink").toBe(true);
        // }
      // }
      // ganttObj.actionComplete = actionComplete;
      // ganttObj.treeGrid.getRows()[0].style.backgroundColor = "pink";
      // ganttObj.selectRow(3);
      // ganttObj.outdent();
    // });
  // });
// });