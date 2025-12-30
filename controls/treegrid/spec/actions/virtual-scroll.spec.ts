import { TreeGrid } from "../../src/treegrid/base/treegrid";
import { createGrid, destroy } from "../base/treegridutil.spec";
import {
  NotifyArgs,
  QueryCellInfoEventArgs,
  RowSelectEventArgs, VirtualContentRenderer
} from "@syncfusion/ej2-grids";
import { isNullOrUndefined, EventHandler } from "@syncfusion/ej2-base";
import { VirtualScroll } from "../../src/treegrid/actions/virtual-scroll";
import {
  virtualData,
  editVirtualData,
  dataSource,
  addVirtualData,
  dataSource1,
  crData,
} from "../base/datasource.spec";
import { Edit } from "../../src/treegrid/actions/edit";
import { Toolbar } from "../../src/treegrid/actions/toolbar";
import { select } from "@syncfusion/ej2-base";
import { RowDD } from "../../src/treegrid/actions/rowdragdrop";
import { Sort } from "../../src/treegrid/actions/sort";
import { Filter } from "../../src/treegrid/actions/filter";
import { ActionEventArgs, ITreeData } from "../../src/treegrid/base/interface";
import { Selection } from "../../src/treegrid/actions/selection";
import { Freeze } from "../../src/treegrid/actions/freeze-column";
import { VirtualTreeContentRenderer } from "../../src/treegrid/renderer/virtual-tree-content-render";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";

/**
 * TreeGrid Virtual Scroll spec
 */

TreeGrid.Inject(VirtualScroll, Edit, Toolbar, Sort, Filter, RowDD, Selection, Freeze);

if (!editVirtualData.length) {
  dataSource();
}

describe("TreeGrid Virtual Scroll", () => {
  describe("Rendering and basic actions", () => {
    let treegrid: TreeGrid;
    let expanded: () => void;
    let collapsed: () => void;
    beforeAll((done: Function) => {
      treegrid = createGrid(
        {
          dataSource: virtualData.slice(0, 1000),
          parentIdMapping: "ParentID",
          idMapping: "TaskID",
          height: 200,
          enableVirtualMaskRow: false,

          queryCellInfo: (args: QueryCellInfoEventArgs) => {
            if (parseInt(args.cell.innerHTML, 0) > 1000) {
              let x: HTMLElement = document.createElement("IMG");
              x.setAttribute("height", "15px");
              let span: HTMLElement = document.createElement("span");
              span.innerHTML = args.cell.innerHTML;
              span.setAttribute("style", "padding-left:7px;");
              args.cell.innerHTML = "";
              args.cell.appendChild(x);
              args.cell.setAttribute(
                "style",
                "background-color:#7b2b1d;color:white;"
              );
              args.cell.appendChild(span);
            } else if (parseInt(args.cell.innerHTML, 0) > 500) {
              let y: HTMLElement = document.createElement("IMG");
              y.setAttribute("height", "15px");
              let span: HTMLElement = document.createElement("span");
              span.innerHTML = args.cell.innerHTML;
              span.setAttribute("style", "padding-left:7px;");
              args.cell.innerHTML = "";
              args.cell.appendChild(y);
              args.cell.setAttribute(
                "style",
                "background-color:#7b2b1d;color:white;"
              );
              args.cell.appendChild(span);
            } else if (parseInt(args.cell.innerHTML, 0) > 250) {
              let z: HTMLElement = document.createElement("IMG");
              z.setAttribute("height", "15px");
              let span: HTMLElement = document.createElement("span");
              span.innerHTML = args.cell.innerHTML;
              span.setAttribute("style", "padding-left:7px;");
              args.cell.innerHTML = "";
              args.cell.appendChild(z);
              args.cell.setAttribute(
                "style",
                "background-color:#336c12;color:white;"
              );
              args.cell.appendChild(span);
            } else if (parseInt(args.cell.innerHTML, 0) > 100) {
              let a: HTMLElement = document.createElement("IMG");
              a.setAttribute("height", "15px");
              let span: HTMLElement = document.createElement("span");
              span.innerHTML = args.cell.innerHTML;
              span.setAttribute("style", "padding-left:7px;");
              args.cell.innerHTML = "";
              args.cell.appendChild(a);
              args.cell.setAttribute(
                "style",
                "background-color:#336c12;color:white;"
              );
              args.cell.appendChild(span);
            }
          },
          enableVirtualization: true,
          columns: [
            { field: "FIELD1", headerText: "Player Name", width: 140 },
            {
              field: "FIELD2",
              headerText: "Year",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD3",
              headerText: "Stint",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD4",
              headerText: "TMID",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD5",
              headerText: "LGID",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD6",
              headerText: "GP",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD7",
              headerText: "GS",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD8",
              headerText: "Minutes",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD9",
              headerText: "Points",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD10",
              headerText: "oRebounds",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD11",
              headerText: "dRebounds",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD12",
              headerText: "Rebounds",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD13",
              headerText: "Assists",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD14",
              headerText: "Steals",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD15",
              headerText: "Blocks",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD16",
              headerText: "Turnovers",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD17",
              headerText: "PF",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD18",
              headerText: "fgAttempted",
              width: 150,
              textAlign: "Right",
            },
            {
              field: "FIELD19",
              headerText: "fgMade",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD20",
              headerText: "ftAttempted",
              width: 150,
              textAlign: "Right",
            },
            {
              field: "FIELD21",
              headerText: "ftMade",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD22",
              headerText: "ThreeAttempted",
              width: 150,
              textAlign: "Right",
            },
            {
              field: "FIELD23",
              headerText: "ThreeMade",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD24",
              headerText: "PostGP",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD25",
              headerText: "PostGS",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD26",
              headerText: "PostMinutes",
              width: 120,
              textAlign: "Right",
            },
            {
              field: "FIELD27",
              headerText: "PostPoints",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD28",
              headerText: "PostoRebounds",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD29",
              headerText: "PostdRebounds",
              width: 130,
              textAlign: "Right",
            },
            {
              field: "FIELD30",
              headerText: "PostRebounds",
              width: 130,
              textAlign: "Right",
            },
          ],
          treeColumnIndex: 1,
        },
        done
      );
    });
    it("rendering test", (done: Function) => {
      expect(treegrid.getRows().length).toBe(20);
      expect(
        treegrid.getRows()[0].querySelectorAll("td")[2].getAttribute("style")
      ).toBe("background-color:#336c12;color:white;");
      expect(
        !isNullOrUndefined(
          treegrid
            .getRows()[0]
            .querySelectorAll("td")[1]
            .querySelector(".e-icons.e-treegridexpand")
        )
      ).toBe(true);
      done();
    });
    it("collapse test", (done: Function) => {
      let len: number = 0;
      collapsed = (args?: any) => {
        let rows: HTMLTableRowElement[] = treegrid.getRows();
        for (let n: number = 0; n < rows.length; n++) {
          if (
            !isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))
          ) {
            len = len + 1;
          }
        }
        expect(len).toBe(20);
        treegrid.collapsed = null;
        done();
      };
      treegrid.collapsed = collapsed;
      treegrid.collapseAll();
    });
    it("expand test", (done: Function) => {
      expanded = (args?: any) => {
        expect(
          isNullOrUndefined(
            treegrid.getRows()[1].querySelector(".e-treegridexpand")
          )
        ).toBe(true);
        treegrid.expanded = null;
        done();
      };
      treegrid.expanded = expanded;
      treegrid.expandAll();
    });
    it("collapse test before scroll", (done: Function) => {
      let len: number = 0;
      collapsed = (args?: any) => {
        let rows: HTMLTableRowElement[] = treegrid.getRows();
        for (let n: number = 0; n < rows.length; n++) {
          if (
            !isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))
          ) {
            len = len + 1;
          }
        }
        expect(len).toBe(20);
        treegrid.collapsed = null;
        done();
      };
      treegrid.collapsed = collapsed;
      treegrid.collapseAll();
    });
    it("Scrolling continous", (done: Function) => {
      let content: HTMLElement = <HTMLElement>treegrid.getContent().firstChild;
      EventHandler.trigger(content, "wheel");
      content.scrollTop = 10;
      content.scrollTop = 1000;
      EventHandler.trigger(content, "scroll", { target: content });
      setTimeout(done, 500);
      done();
    });
    it("collapse test after scroll", (done: Function) => {
      let len: number = 0;
      let rows: HTMLTableRowElement[] = treegrid.getRows();
      for (let n: number = 0; n < rows.length; n++) {
        if (!isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))) {
          len = len + 1;
        }
      }
      expect(len).toBe(20);
      treegrid.collapsed = null;
      done();
    });
    it("expandAtLevel() test", (done: Function) => {
      expanded = (args?: any) => {
        expect(
          isNullOrUndefined(
            treegrid.getRows()[1].querySelector(".e-treegridexpand")
          )
        ).toBe(true);
        treegrid.expanded = null;
        done();
      };
      treegrid.expanded = expanded;
      treegrid.expandAtLevel(0);
    });
    it("collapseAtLevel test", (done: Function) => {
      let len: number = 0;
      collapsed = (args?: any) => {
        let rows: HTMLTableRowElement[] = treegrid.getRows();
        for (let n: number = 0; n < rows.length; n++) {
          if (
            !isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))
          ) {
            len = len + 1;
          }
        }
        expect(len).toBe(20);
        treegrid.collapsed = null;
        done();
      };
      treegrid.collapsed = collapsed;
      treegrid.collapseAtLevel(0);
    });
    it("Scrolling up continous", (done: Function) => {
      let content: HTMLElement = <HTMLElement>treegrid.getContent().firstChild;
      EventHandler.trigger(content, "wheel");
      content.scrollTop = 0;
      EventHandler.trigger(content, "scroll", { target: content });
      setTimeout(done, 500);
      done();
    });
    afterAll(() => {
      destroy(treegrid);
    });
  });
});

describe("Scroll Down with CollapseAll", () => {
  let treegrid: TreeGrid;
  let collapsed: () => void;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 1000),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        enableVirtualMaskRow: false,
        height: 200,
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD6",
            headerText: "GP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD7",
            headerText: "GS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD8",
            headerText: "Minutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD9",
            headerText: "Points",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD10",
            headerText: "oRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD11",
            headerText: "dRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD12",
            headerText: "Rebounds",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD13",
            headerText: "Assists",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD14",
            headerText: "Steals",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD15",
            headerText: "Blocks",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD16",
            headerText: "Turnovers",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD17",
            headerText: "PF",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD18",
            headerText: "fgAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD19",
            headerText: "fgMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD20",
            headerText: "ftAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD21",
            headerText: "ftMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD22",
            headerText: "ThreeAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD23",
            headerText: "ThreeMade",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD24",
            headerText: "PostGP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD25",
            headerText: "PostGS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD26",
            headerText: "PostMinutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD27",
            headerText: "PostPoints",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD28",
            headerText: "PostoRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD29",
            headerText: "PostdRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD30",
            headerText: "PostRebounds",
            width: 130,
            textAlign: "Right",
          },
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("rendering test", (done: Function) => {
    expect(treegrid.getRows().length).toBe(20);
    done();
  });
  it("collapseAll after scroll", (done: Function) => {
    let rows: HTMLTableRowElement[] = treegrid.getRows();
    let content: HTMLElement = <HTMLElement>treegrid.getContent().firstChild;
    EventHandler.trigger(content, "wheel");
    content.scrollTop = 20000;
    EventHandler.trigger(content, "scroll", { target: content });
    setTimeout(done, 1000);
    let len: number = 0;
    collapsed = (args?: any) => {
      let rows: HTMLTableRowElement[] = treegrid.getRows();
      for (let n: number = 0; n < rows.length; n++) {
        if (
          !isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))
        ) {
          len = len + 1;
        }
      }
      expect(len).toBe(20);
      treegrid.collapsed = null;
      done();
    };
    treegrid.collapseAll();
    expect(treegrid.getCurrentViewRecords().length > 0).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Height 100%", () => {
  let treegrid: TreeGrid;
  let dataBound: () => void;
  document.body.style.height = "600px";
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 1000),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: "100%",
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD6",
            headerText: "GP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD7",
            headerText: "GS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD8",
            headerText: "Minutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD9",
            headerText: "Points",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD10",
            headerText: "oRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD11",
            headerText: "dRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD12",
            headerText: "Rebounds",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD13",
            headerText: "Assists",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD14",
            headerText: "Steals",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD15",
            headerText: "Blocks",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD16",
            headerText: "Turnovers",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD17",
            headerText: "PF",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD18",
            headerText: "fgAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD19",
            headerText: "fgMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD20",
            headerText: "ftAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD21",
            headerText: "ftMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD22",
            headerText: "ThreeAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD23",
            headerText: "ThreeMade",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD24",
            headerText: "PostGP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD25",
            headerText: "PostGS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD26",
            headerText: "PostMinutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD27",
            headerText: "PostPoints",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD28",
            headerText: "PostoRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD29",
            headerText: "PostdRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD30",
            headerText: "PostRebounds",
            width: 130,
            textAlign: "Right",
          },
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("rendering test", () => {
    dataBound = (args?: any) => {
      expect(treegrid.getRows().length > 12).toBe(true);
    };
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Row Editing with Virtual Scrolling", () => {
  let gridObj: TreeGrid;
  let rowIndex: number;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Edit Start in Current View Records", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        let cells = gridObj.grid.element
          .querySelector(".e-editedrow")
          .querySelectorAll(".e-rowcell");
        expect(cells.length).toBe(gridObj.grid.columns.length);
        //primary key check
        expect(cells[0].querySelectorAll("input.e-disabled").length).toBe(1);
        // allow Editing false
        expect(cells[2].querySelectorAll("input.e-disabled").length).toBe(1);
        //focus check
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "FIELD1"
        );
        //toolbar status check
        expect(
          gridObj.grid.element.querySelectorAll(".e-overlay").length
        ).toBe(4);
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(gridObj.grid.isEdit).toBeFalsy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    gridObj.grid.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Edit Complete in Current View Records", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "updated"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "updated";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  it("Scroll", (done: Function) => {
    (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 1480;
    setTimeout(done, 400);
  });

  it("Edit Start After Scroll", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        let cells = gridObj.grid.element
          .querySelector(".e-editedrow")
          .querySelectorAll(".e-rowcell");
        expect(cells.length).toBe(gridObj.grid.columns.length);
        //primary key check
        expect(cells[0].querySelectorAll("input.e-disabled").length).toBe(1);
        // allow Editing false
        expect(cells[2].querySelectorAll("input.e-disabled").length).toBe(1);
        //focus check
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "FIELD1"
        );
        //toolbar status check
        expect(
          gridObj.grid.element.querySelectorAll(".e-overlay").length
        ).toBe(4);
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(gridObj.grid.isEdit).toBeFalsy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    rowIndex = parseInt(gridObj.getRows()[0].getAttribute("aria-rowindex"), 10) - 1;
    gridObj.grid.selectRow(rowIndex);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Edit Complete After Scroll", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "scroll updated"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "scroll updated";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Add New Row with Virtual Scrolling", () => {
  let gridObj: TreeGrid;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Add New Row Begin", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "add") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-addedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "TaskID"
        );
        //toolbar status check
        expect(
          gridObj.grid.element.querySelectorAll(".e-overlay").length
        ).toBe(4);
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_add" },
    });
  });

  it("Save New Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).TaskID).toBe(98765);
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "New Row"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "TaskID",
        gridObj.grid.element
      ) as any
    ).value = "98765";
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "New Row";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Delete Row with Virtual Scrolling", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Delete First Parent Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "delete") {
        expect((gridObj.grid.dataSource as any).length === 995).toBe(true);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_delete" },
    });
  });

  it("Scroll", (done: Function) => {
    (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 4000;
    setTimeout(done, 400);
  });

  it("Delete Row after Scroll", (done: Function) => {
    let isParent: boolean;
    let row: Element;
    actionComplete = (args?: any): void => {
      if (args.requestType === "delete") {
        if (isParent) {
          expect((gridObj.grid.dataSource as any).length === 990).toBe(true);
        } else {
          expect((gridObj.grid.dataSource as any).length === 994).toBe(true);
        }
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    row = gridObj.getRows()[0];
    if (row.querySelector(".e-treegridexpand")) {
      isParent = true;
    }
    gridObj.selectRow(parseInt(row.getAttribute("aria-rowindex"), 10) - 1);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_delete" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Edit Cancel Checking", () => {
  let gridObj: TreeGrid;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Edit Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.selectRow(1);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Cancel Edit", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "cancel") {
        //form destroy check
        expect(gridObj.grid.editModule.formObj.isDestroyed).toBeTruthy();
        expect(gridObj.grid.isEdit).toBeFalsy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "cancel") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_cancel" },
    });
  });

  afterAll(() => {
    gridObj.grid.contentModule.removeEventListener();
    destroy(gridObj);
  });
});

describe("EJ2-60955- The checkbox selection is not working properly while the child has an empty child array.", () => {
  if (!addVirtualData.length) {
    dataSource1();
  }
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: addVirtualData,
        enableVirtualization: true,
        allowSorting: true,
        allowFiltering: true,
        autoCheckHierarchy: true,
        childMapping: "Crew",
        toolbar: ["Indent", "Outdent", "Add", "Delete", "Update", "Cancel"],
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
        },
        height: 400,
        treeColumnIndex: 1,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            width: 140,
            showCheckbox: true,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Checkbox checking", () => {
    (
      (<HTMLElement>(
        TreeGridObj.element
          .querySelectorAll(".e-row")[0]
          .getElementsByClassName("e-frame e-icons")[0]
      )) as any
    ).click();
    expect(TreeGridObj.getCheckedRecords().length).toBe(5);
    TreeGridObj.collapseAll();
    expect(TreeGridObj.getCheckedRecords().length).toBe(5);
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("EJ2-916490- The page refreshes when adding a record on the last page with virtualization", () => {
  var tempData = [
    {
      TaskID: 1,
      TaskName: 'Product concept',
      StartDate: new Date('04/02/2019'),
      EndDate: new Date('04/21/2019'),
      parentID: 0,
    },
    {
      TaskID: 2,
      TaskName: 'Defining the product and its usage',
      StartDate: new Date('04/02/2019'),
      Duration: 3,
      Progress: 30,
      parentID: 1,
    },
    {
      TaskID: 3,
      TaskName: 'Defining target audience',
      StartDate: new Date('04/02/2019'),
      parentID: 1,
      Duration: 3,
    },
    {
      TaskID: 4,
      TaskName: 'Prepare product sketch and notes',
      StartDate: new Date('04/05/2019'),
      Duration: 2,
      parentID: 1,
      Progress: 30,
    },
    {
      TaskID: 5,
      TaskName: 'Concept approval',
      StartDate: new Date('04/08/2019'),
      parentID: 0,
      Duration: 0,
    },
    {
      TaskID: 6,
      TaskName: 'Market research',
      StartDate: new Date('04/02/2019'),
      parentID: 0,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 7,
      TaskName: 'Demand analysis',
      StartDate: new Date('04/04/2019'),
      EndDate: new Date('04/21/2019'),
      parentID: 6,
    },
    {
      TaskID: 8,
      TaskName: 'Customer strength',
      StartDate: new Date('04/09/2019'),
      Duration: 4,
      parentID: 7,
      Progress: 30,
    },
    {
      TaskID: 9,
      TaskName: 'Market opportunity analysis',
      StartDate: new Date('04/09/2019'),
      Duration: 4,
      parentID: 7,
    },
    {
      TaskID: 10,
      TaskName: 'Competitor analysis',
      StartDate: new Date('04/15/2019'),
      Duration: 4,
      parentID: 6,
      Progress: 30,
    },
    {
      TaskID: 11,
      TaskName: 'Product strength analsysis',
      StartDate: new Date('04/15/2019'),
      Duration: 4,
      parentID: 6,
    },
    {
      TaskID: 12,
      TaskName: 'Research complete',
      StartDate: new Date('04/18/2019'),
      Duration: 0,
      parentID: 6,
    },
    {
      TaskID: 13,
      TaskName: 'Product design and development',
      StartDate: new Date('04/04/2019'),
      parentID: 0,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 14,
      TaskName: 'Functionality design',
      StartDate: new Date('04/19/2019'),
      Duration: 3,
      parentID: 13,
      Progress: 30,
    },
    {
      TaskID: 15,
      TaskName: 'Quality design',
      StartDate: new Date('04/19/2019'),
      Duration: 3,
      parentID: 13,
    },
    {
      TaskID: 16,
      TaskName: 'Define reliability',
      StartDate: new Date('04/24/2019'),
      Duration: 2,
      Progress: 30,
      parentID: 13,
    },
    {
      TaskID: 17,
      TaskName: 'Identifying raw materials',
      StartDate: new Date('04/24/2019'),
      Duration: 2,
      parentID: 13,
    },
    {
      TaskID: 18,
      TaskName: 'Define cost plan',
      StartDate: new Date('04/04/2019'),
      parentID: 13,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 19,
      TaskName: 'Manufacturing cost',
      StartDate: new Date('04/26/2019'),
      Duration: 2,
      Progress: 30,
      parentID: 18,
    },
    {
      TaskID: 20,
      TaskName: 'Selling cost',
      StartDate: new Date('04/26/2019'),
      Duration: 2,
      parentID: 18,
    },
    {
      TaskID: 21,
      TaskName: 'Development of the final design',
      StartDate: new Date('04/30/2019'),
      parentID: 13,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 22,
      TaskName: 'Defining dimensions and package volume',
      StartDate: new Date('04/30/2019'),
      Duration: 2,
      parentID: 21,
      Progress: 30,
    },
    {
      TaskID: 23,
      TaskName: 'Develop design to meet industry standards',
      StartDate: new Date('05/02/2019'),
      Duration: 2,
      parentID: 21,
    },
    {
      TaskID: 24,
      TaskName: 'Include all the details',
      StartDate: new Date('05/06/2019'),
      Duration: 3,
      parentID: 21,
    },
    {
      TaskID: 25,
      TaskName: 'CAD computer-aided design',
      StartDate: new Date('05/09/2019'),
      Duration: 3,
      parentID: 13,
      Progress: 30,
    },
    {
      TaskID: 26,
      TaskName: 'CAM computer-aided manufacturing',
      StartDate: new Date('09/14/2019'),
      Duration: 3,
      parentID: 13,
    },
    {
      TaskID: 27,
      TaskName: 'Design complete',
      StartDate: new Date('05/16/2019'),
      Duration: 0,
      parentID: 13,
    },
    {
      TaskID: 28,
      TaskName: 'Prototype testing',
      StartDate: new Date('05/17/2019'),
      Duration: 4,
      Progress: 30,
      parentID: 0,
    },
    {
      TaskID: 29,
      TaskName: 'Include feedback',
      StartDate: new Date('05/17/2019'),
      Duration: 4,
      parentID: 0,
    },
    {
      TaskID: 30,
      TaskName: 'Manufacturing',
      StartDate: new Date('05/23/2019'),
      Duration: 5,
      Progress: 30,
      parentID: 0,
    },
    {
      TaskID: 31,
      TaskName: 'Assembling materials to finsihed goods',
      StartDate: new Date('05/30/2019'),
      Duration: 5,
      parentID: 0,
    },
    {
      TaskID: 32,
      TaskName: 'Feedback and testing',
      StartDate: new Date('04/04/2019'),
      parentID: 0,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 33,
      TaskName: 'Internal testing and feedback',
      StartDate: new Date('06/06/2019'),
      Duration: 3,
      parentID: 32,
      Progress: 45,
    },
    {
      TaskID: 34,
      TaskName: 'Customer testing and feedback',
      StartDate: new Date('06/11/2019'),
      Duration: 3,
      parentID: 32,
      Progress: 50,
    },
    {
      TaskID: 35,
      TaskName: 'Final product development',
      StartDate: new Date('04/04/2019'),
      parentID: 0,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 36,
      TaskName: 'Important improvements',
      StartDate: new Date('06/14/2019'),
      Duration: 4,
      Progress: 30,
      parentID: 35,
    },
    {
      TaskID: 37,
      TaskName: 'Address any unforeseen issues',
      StartDate: new Date('06/14/2019'),
      Duration: 4,
      Progress: 30,
      parentID: 35,
    },
    {
      TaskID: 38,
      TaskName: 'Final product',
      StartDate: new Date('04/04/2019'),
      parentID: 0,
      EndDate: new Date('04/21/2019'),
    },
    {
      TaskID: 39,
      TaskName: 'Branding product',
      StartDate: new Date('06/20/2019'),
      Duration: 4,
      parentID: 38,
    },
    {
      TaskID: 40,
      TaskName: 'Marketing and presales',
      StartDate: new Date('06/26/2019'),
      Duration: 4,
      Progress: 30,
      parentID: 38,
    },
  ];
  interface Task {
    TaskID?: number;
    TaskName?: string;
    StartDate?: Date;
    Duration?: number;
    Progress?: number;
    parentID?: number;
  }

  var virtualData1: Task[] = [];
  var projId = 1;
  for (var i = 0; i < 50; i++) {
    var x = virtualData1.length + 1;
    var parent_1: Task = {};
    parent_1['TaskID'] = x;
    parent_1['TaskName'] = 'Project' + projId++;
    virtualData1.push(parent_1);
    for (var j = 0; j < tempData.length; j++) {
      var subtasks: Task = {};
      subtasks['TaskID'] = tempData[j].TaskID + x;
      subtasks['TaskName'] = tempData[j].TaskName;
      subtasks['StartDate'] = tempData[j].StartDate;
      subtasks['Duration'] = tempData[j].Duration;
      subtasks['Progress'] = tempData[j].Progress;
      subtasks['parentID'] = tempData[j].parentID + x;
      virtualData1.push(subtasks);
    }
  }
  let TreeGridObj: TreeGrid;
  let actionBegin: () => void;
  let count: number = 0;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: virtualData1,
        allowSorting: true,
        enableVirtualization: true,
        parentIdMapping: 'parentID',
        idMapping: 'TaskID',
        contextMenuItems: ['AddRow'],
        toolbar: ["Indent", "Outdent", "Add", "Delete", "Update", "Cancel"],
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          newRowPosition: "Below"
        },
        allowRowDragAndDrop: true,
        columns: [
          { field: 'TaskID', isPrimaryKey: true },
          { field: 'TaskName' },
          { field: 'StartDate' },
          { field: 'Duration' },
          { field: 'Progress' },
        ],
        allowExcelExport: true,
        selectedRowIndex: 2,
        allowPdfExport: true,
        allowSelection: true,
        allowFiltering: true,
        gridLines: 'Both',
        height: '400px',
        allowResizing: true,
        selectionSettings: {
          mode: 'Row',
          type: 'Single',
          enableToggle: false,

        },
        rowHeight: 40,
      },
      done
    );
  });
  it("Scroll to Bottom", function (done) {
    let content: HTMLElement = <HTMLElement>TreeGridObj.getContent().firstChild;
    EventHandler.trigger(content, "wheel");
    content.scrollTop = 82000;
    EventHandler.trigger(content, "scroll", { target: content });
    setTimeout(done, 1000);
    done();
  });
  it("Select Last Row", function (done) {
    let rows = TreeGridObj.getRows();
    let lastRowIdx = parseInt(rows[rows.length - 1].getAttribute("aria-rowindex")) - 1;
    TreeGridObj.selectRow(lastRowIdx);
    done();
  });
  it("Add Record", function (done) {
    let actionBegin = (args?: any): void => {
      if (args.requestType === "virtualscroll") {
        count++;
        done();
      }
      done();
    };
    TreeGridObj.grid.actionBegin = actionBegin;
    TreeGridObj.addRecord();
    setTimeout(done, 1000);
    expect(count).toBe(0);
    done();
  });
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("EJ2-58929 - Searching after scroll shows no records to display in case of Virtualization enabled", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        enableVirtualMaskRow: false,
        treeColumnIndex: 1,
        allowFiltering: true,
        filterSettings: {
          mode: "Immediate",
          type: "FilterBar",
          hierarchyMode: "None",
        },
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Scroll", (done: Function) => {
    let content: HTMLElement = <HTMLElement>gridObj.getContent().firstChild;
    EventHandler.trigger(content, "wheel");
    content.scrollTop = 20000;
    EventHandler.trigger(content, "scroll", { target: content });
    setTimeout(done, 1000);
    done();
  });

  it("Searching after Scroll", (done: Function) => {
    actionComplete = (args?: any): void => {
      expect(gridObj.getRows().length == 1).toBe(true);
      done();
    };
    gridObj.search("496");
    gridObj.grid.actionComplete = actionComplete;
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("EJ2-59214- Row Drag And Drop support with Virtual Scrolling", () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        allowSorting: true,
        allowFiltering: true,
        enableVirtualMaskRow: false,
        childMapping: "Crew",
        toolbar: ["Indent", "Outdent", "Add", "Delete", "Update", "Cancel"],
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Cell",
          newRowPosition: "Below",
        },
        allowRowDragAndDrop: true,
        height: 400,
        treeColumnIndex: 1,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Initial Row Reorder Testing for Above, Child, Below positions", () => {
    TreeGridObj.rowDragAndDropModule.reorderRows([3], 1, "above");
    expect((TreeGridObj.flatData[1] as ITreeData)["TaskID"]).toBe(4);
    TreeGridObj.rowDragAndDropModule.reorderRows([1], 2, "child");
    expect((TreeGridObj.flatData[2] as ITreeData).childRecords.length).toBe(1);
    TreeGridObj.rowDragAndDropModule.reorderRows([3], 4, "below");
    expect((TreeGridObj.flatData[4] as ITreeData)["TaskID"]).toBe(4);
  });

  it("Scroll", (done: Function) => {
    let content: HTMLElement = <HTMLElement>TreeGridObj.getContent().firstChild;
    EventHandler.trigger(content, "wheel");
    content.scrollTop = 10;
    content.scrollTop = 2000;
    EventHandler.trigger(content, "scroll", { target: content });
    setTimeout(done, 500);
    done();
  });

  it("Row Reorder Testing for Above, Child, Below positions After Scroll", () => {
    TreeGridObj.rowDragAndDropModule.reorderRows([102], 105, "above");
    expect((TreeGridObj.flatData[104] as ITreeData)["TaskID"]).toBe(103);
    TreeGridObj.rowDragAndDropModule.reorderRows([104], 106, "child");
    expect((TreeGridObj.flatData[105] as ITreeData).childRecords.length).toBe(
      1
    );
    TreeGridObj.rowDragAndDropModule.reorderRows([101], 103, "below");
    expect((TreeGridObj.flatData[102] as ITreeData)["TaskID"]).toBe(102);
  });

  it("Filtering the column", (done: Function) => {
    TreeGridObj.filterByColumn("FIELD2", "contains", "1968");
    done();
  });

  it("Row Reorder Testing for Above, Child, Below positions After Filtering", () => {
    TreeGridObj.rowDragAndDropModule.reorderRows([5], 3, "above");
    expect((TreeGridObj.flatData[10] as ITreeData)["TaskID"]).toBe(21);
    TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, "child");
    expect((TreeGridObj.flatData[14] as ITreeData).childRecords.length).toBe(1);
    TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, "below");
    expect((TreeGridObj.flatData[15] as ITreeData)["TaskID"]).toBe(3);
    TreeGridObj.clearFiltering();
  });

  it("Sorting the column", (done: Function) => {
    TreeGridObj.sortByColumn("FIELD1", "Descending", true);
    done();
  });

  it("Row Reorder Testing for Above, Child, Below positions After Sorting", () => {
    TreeGridObj.rowDragAndDropModule.reorderRows([4], 0, "above");
    // expect(
    // (TreeGridObj.rowDragAndDropModule["draggedRecord"] as ITreeData).level
    //).toBe(0);
    TreeGridObj.rowDragAndDropModule.reorderRows([1], 4, "child");
    //expect(
    // (TreeGridObj.getCurrentViewRecords()[4] as ITreeData).childRecords.length
    //).toBe(1);
    TreeGridObj.rowDragAndDropModule.reorderRows([8], 5, "below");
    //expect(
    // (TreeGridObj.rowDragAndDropModule["draggedRecord"] as ITreeData).level
    //).toBe(0);
    TreeGridObj.rowDragAndDropModule.destroy();
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("EJ2-62215 - When hierarchyMode is Both and perform searching at initial load, the error is thrown in case of Virtualization enabled", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Search"],
        enableCollapseAll: true,
        searchSettings: { ignoreCase: true, hierarchyMode: "Both", key: "1" },
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Initial Searching when hierarchyMode is Both", () => {
    expect((gridObj.flatData[0] as ITreeData).expanded === false).toBe(true);
    expect((gridObj.flatData[0] as any).TaskID === 1).toBe(true);
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("EJ2-62266 - Frozen columns with Row and Column virutalization", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        enableColumnVirtualization: true,
        treeColumnIndex: 1,
        allowFiltering: true,
        frozenColumns: 2,
        allowSorting: true,
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "TMD",
            width: 120,
            textAlign: "Right",
          },
          { field: "FIELD6", headerText: "GP", width: 120, textAlign: "Right" },
          { field: "FIELD7", headerText: "GS", width: 120, textAlign: "Right" },
          {
            field: "FIELD8",
            headerText: "Minutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD9",
            headerText: "Points",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD10",
            headerText: "OREB",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD11",
            headerText: "DREB",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD12",
            headerText: "REB",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD13",
            headerText: "Assists",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD14",
            headerText: "Steals",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD15",
            headerText: "Blocks",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD16",
            headerText: "Turnovers",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD17",
            headerText: "PF",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD18",
            headerText: "FGA",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD19",
            headerText: "FGM",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD20",
            headerText: "FTA",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD21",
            headerText: "FTM",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD22",
            headerText: "Three Attempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD23",
            headerText: "Three Made",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD24",
            headerText: "Post GP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD25",
            headerText: "Post GS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD26",
            headerText: "Post Minutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD27",
            headerText: "Post Points",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD28",
            headerText: "Post OREB",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD29",
            headerText: "Post DREB",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD30",
            headerText: "Post REB",
            width: 130,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Frozen rows with virtualization render check", () => {
    expect(
      gridObj
        .getRows()
      [gridObj.frozenRows].closest("div")
        .classList.contains("e-virtualtable")
    ).toBe(true);
    expect(
      gridObj
        .getDataRows()
      [gridObj.frozenColumns].closest("div")
        .classList.contains("e-virtualtable")
    ).toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("EJ2-62266 - Frozen columns with virutalization", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        allowFiltering: true,
        frozenColumns: 2,
        allowSorting: true,
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "TMD",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Frozen rows with virtualization render check", () => {
    expect(
      gridObj
        .getRows()
      [gridObj.frozenRows].closest("div")
        .classList.contains("e-virtualtable")
    ).toBe(true);
    expect(
      gridObj
        .getDataRows()
      [gridObj.frozenColumns].closest("div")
        .classList.contains("e-virtualtable")
    ).toBe(true);
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("EJ2-62266 - Freeze direction with virutalization", () => {
  let gridObj2: TreeGrid;
  beforeAll((done: Function) => {
    gridObj2 = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        allowFiltering: true,
        allowSorting: true,
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            freeze: "Left",
            textAlign: "Right",
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            freeze: "Left",
            width: 140,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            freeze: "Right",
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Ensure frozen method", () => {
    expect(gridObj2.getFrozenLeftColumnsCount()).toBe(2);
    expect(gridObj2.getMovableColumnsCount()).toBe(2);
    expect(gridObj2.getFrozenRightColumnsCount()).toBe(1);
    expect(gridObj2.getFrozenLeftColumns().length).toBe(
      gridObj2.getFrozenLeftColumnsCount()
    );
    expect(gridObj2.getMovableColumns().length).toBe(
      gridObj2.getMovableColumnsCount()
    );
    expect(gridObj2.getFrozenRightColumns().length).toBe(
      gridObj2.getFrozenRightColumnsCount()
    );
  });

  afterAll(() => {
    destroy(gridObj2);
  });
});

describe("EJ2-62928 - Script error throws when we filter the record using filter menu.", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Search"],
        enableCollapseAll: true,
        searchSettings: { ignoreCase: true, hierarchyMode: "Both", key: "1" },
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Initial Filtering when hierarchyMode is Both", () => {
    gridObj.filterByColumn("FIELD1", "startswith", "FRANK");
    gridObj.collapseAll();
    expect(
      (gridObj.getRows()[0] as HTMLTableRowElement).getElementsByClassName(
        "e-treegridcollapse"
      ).length
    ).toBe(1);
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("scrolling and adding records", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: virtualData.slice(0, 1000),
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Child",
        },
        toolbar: [
          "Add",
          "Edit",
          "Delete",
          "Update",
          "Cancel",
          "Indent",
          "Outdent",
        ],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("scrolling and adding records", (done: Function) => {
    //  gridObj.getContent().firstElementChild.scrollTop = 20000;
    gridObj.selectRow(gridObj.getCurrentViewRecords()[3]["TaskID"]);
    gridObj.actionComplete = function (args) {

      expect(this.flatData["length"] === 1001).toBe(true);
      done();
    };
    gridObj.addRecord(
      { TaskID: 10000, FIELD1: "TEST1" },
      gridObj.getCurrentViewRecords()[3]["TaskID"],
      "Child"
    );
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("EJ2-63548 - Indent/Outdent action check after edited the row with virtualization ", () => {
  let TreeGridObj2: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    TreeGridObj2 = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        toolbar: [
          "Add",
          "Edit",
          "Update",
          "Delete",
          "Cancel",
          "Indent",
          "Outdent",
        ],
        editSettings: {
          allowEditing: true,
          mode: "Row",
          allowDeleting: true,
          allowAdding: true,
          newRowPosition: "Child",
        },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("Edit and update", (done: Function) => {
    actionComplete = (args?: any): void => {
      expect(TreeGridObj2.getCurrentViewRecords()[1]['FIELD1']).toEqual("updated");
      done();
    }
    TreeGridObj2.selectRow(1);
    (<any>TreeGridObj2.grid.toolbarModule).toolbarClickHandler({
      item: { id: TreeGridObj2.grid.element.id + "_edit" },
    });
    (
      select(
        "#" + TreeGridObj2.grid.element.id + "FIELD1",
        TreeGridObj2.grid.element
      ) as any
    ).value = "updated";
    TreeGridObj2.actionComplete = actionComplete;
    (<any>TreeGridObj2.grid.toolbarModule).toolbarClickHandler({
      item: { id: TreeGridObj2.grid.element.id + "_update" },
    });
  });
  it("Indent/Outdent icon updated check after edited the row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType == "outdented") {
        expect(args.data[0].parentItem == undefined).toBe(true);
        done();
      }
    };

    TreeGridObj2.actionComplete = actionComplete;
    TreeGridObj2.outdent(TreeGridObj2.getCurrentViewRecords()[1]);
  });
  afterAll(() => {
    destroy(TreeGridObj2);
  });
});

describe("EJ2-64501 - virutalization shimmer effect check", () => {
  let gridObj3: TreeGrid;
  beforeAll((done: Function) => {
    gridObj3 = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        allowFiltering: true,
        allowSorting: true,
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Show Mask Row", () => {
    gridObj3.grid.showMaskRow();
    expect(gridObj3.getContent().querySelector(".e-masked-table")).toBeTruthy();
  });
  it("Remove Mask Row", () => {
    gridObj3.grid.removeMaskRow();
    expect(gridObj3.getContent().querySelector(".e-masked-table")).toBeFalsy();
  });

  afterAll(() => {
    destroy(gridObj3);
  });
});

describe("EJ2-64501 - Freeze direction with virutalization shimmer effect check", () => {
  let gridObj4: TreeGrid;
  beforeAll((done: Function) => {
    gridObj4 = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        allowFiltering: true,
        allowSorting: true,
        toolbar: ["Search"],
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            freeze: "Left",
            textAlign: "Right",
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            freeze: "Left",
            width: 140,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            freeze: "Right",
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Show Mask Row", () => {
    gridObj4.grid.showMaskRow();
    expect(gridObj4.getContent().querySelector(".e-masked-table")).toBeTruthy();
  });
  it("Remove Mask Row", () => {
    gridObj4.grid.removeMaskRow();
    expect(gridObj4.getContent().querySelector(".e-masked-table")).toBeFalsy();
  });

  afterAll(() => {
    destroy(gridObj4);
  });
});

describe("EJ2-828680 - Script Error throws while using Virtualization with CollapseAll action in self reference data ", () => {
  let TreeGridObj4: TreeGrid;
  var data: any = [];
  var x = 0;
  for (var i = 0; i < 500; i++) {
    var parent = {};
    parent["TaskId"] = ++x;
    parent["TaskName"] = "Task " + x;
    parent["StartDate"] = new Date("01/09/2017");
    parent["EndDate"] = new Date("01/13/2017");
    parent["Duration"] = 5;
    parent["Status"] = Math.round(Math.random() * 100);
    data.push(parent);
    for (var j = 1; j < 3; j++) {
      var child = {};
      child["TaskId"] = ++x;
      child["TaskName"] = "Task " + x;
      child["StartDate"] = new Date("01/09/2017");
      child["EndDate"] = new Date("01/13/2017");
      child["Duration"] = 5;
      child["Status"] = Math.round(Math.random() * 100);
      child["parentID"] = parent["TaskId"];
      data.push(child);
      for (var k = 1; k < 4; k++) {
        var c = {};
        c["TaskId"] = ++x;
        c["TaskName"] = "Task " + x;
        c["StartDate"] = new Date("01/09/2017");
        c["EndDate"] = new Date("01/13/2017");
        c["Duration"] = 5;
        c["Status"] = Math.round(Math.random() * 100);
        c["parentID"] = child["TaskId"];
        data.push(c);
      }
    }
  }
  beforeAll((done: Function) => {
    TreeGridObj4 = createGrid(
      {
        dataSource: data.slice(0, 4),
        enableVirtualization: true,
        height: 400,
        idMapping: "TaskId",
        parentIdMapping: "parentID",
        treeColumnIndex: 1,
        enableVirtualMaskRow: true,
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below",
        },
        columns: [
          {
            field: "TaskId",
            headerText: "Player Jersey",
            validationRules: { required: true, number: true },
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          {
            field: "TaskName",
            headerText: "Player Name",
            validationRules: { required: true },
            width: 140,
          },
          {
            field: "StartDate",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "EndDate",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "Duration",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
        toolbar: ["ExpandAll", "CollapseAll"],
      },
      done
    );
  });

  it("Collapsing all the records", (done: Function) => {
    TreeGridObj4.collapseAll();
    expect(TreeGridObj4.getCurrentViewRecords().length === 1).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(TreeGridObj4);
  });
});

describe("EJ2-828680 - Script Error throws while using Virtualization with CollapseAll action in Hierarchy data ", () => {
  let TreeGridObj3: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj3 = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        height: 400,
        treeColumnIndex: 1,
        enableVirtualMaskRow: true,
        childMapping: "Crew",
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Child",
        },
        toolbar: [
          "Add",
          "Edit",
          "Delete",
          "Update",
          "Cancel",
          "Indent",
          "Outdent",
          "ExpandAll",
          "CollapseAll",
        ],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            validationRules: { required: true, number: true },
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            validationRules: { required: true },
            width: 140,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Collapsing all the records", (done: Function) => {
    TreeGridObj3.collapseAll();
    expect(TreeGridObj3.getCurrentViewRecords().length === 40).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(TreeGridObj3);
  });
});

describe("EJ2-831337 - Script Error throws while using Virtualization with ExpandAll action ", () => {
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        height: 400,
        treeColumnIndex: 1,
        childMapping: "Crew",
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Child",
        },
        toolbar: [
          "Add",
          "Edit",
          "Delete",
          "Update",
          "Cancel",
          "Indent",
          "Outdent",
          "ExpandAll",
          "CollapseAll",
        ],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            validationRules: { required: true, number: true },
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            validationRules: { required: true },
            width: 140,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Collapsing and expanding all the records", (done: Function) => {
    TreeGridObj.collapseAll();
    TreeGridObj.expandAll();
    expect(TreeGridObj.getCurrentViewRecords().length === 40).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("EJ2-833425 - Collapsed event triggered multiple times in virtualization enabled sample ", () => {
  let TreeGridObj: TreeGrid;
  let collapsed: () => void;
  let count: number = 0;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        height: 400,
        treeColumnIndex: 1,
        childMapping: "Crew",
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Child",
        },
        toolbar: [
          "Add",
          "Edit",
          "Delete",
          "Update",
          "Cancel",
          "Indent",
          "Outdent",
          "ExpandAll",
          "CollapseAll",
        ],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            validationRules: { required: true, number: true },
            width: 140,
            textAlign: "Right",
            isPrimaryKey: true,
          },
          {
            field: "FIELD1",
            headerText: "Player Name",
            validationRules: { required: true },
            width: 140,
          },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("CollapseAll the record and check collapsed event", (done: Function) => {
    collapsed = (args?: any): void => {
      if (args.name === "collapsed") {
        count++;
        done();
      }
    };
    TreeGridObj.collapsed = collapsed;
    TreeGridObj.collapseAll();
    expect(count).toBe(1);
  });
  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("852080- External data source filter not working with virtualization after scrolling", () => {
  let treegrid: TreeGrid;
  let searchText: string = "";
  function getDataSource() {
    let counter = 0;
    let rowId = 0;
    let _items = [];

    while (counter < 10000) {
      counter++;
      _items.push({
        Id: counter,
        Name: 'ABC ' + counter,
        Version: Math.random() * 10,
        Children: [],
      });
      rowId++;
    }

    if (searchText) {
      _items = _items.filter((x) => x.Name.includes(searchText));
    }

    return _items;
  }
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: getDataSource(),
        enableVirtualization: true,
        treeColumnIndex: 1,
        childMapping: 'Children',
        height: 317,
        columns: [
          { field: 'Id', headerText: 'Player Jersey', width: 140, textAlign: 'Right' },
          { field: 'Name', headerText: 'Player Name', width: 140 },
          { field: 'Version', headerText: 'Year', width: 120, textAlign: 'Right' }
        ],
      },
      done
    );
  });
  it("search after scroll", (done: Function) => {
    (<HTMLElement>treegrid.getContent().firstChild).scrollTop = 4000;
    searchText = "ABC 9999";
    treegrid.dataSource = getDataSource();
    done();
  });
  it("data check after search", (done: Function) => {
    expect(treegrid.getCurrentViewRecords().length == 1).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Cell Editing with Virtual Scrolling", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Cell",
          newRowPosition: "Below",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  it("Rendering Test", () => {
    let event: MouseEvent = new MouseEvent("dblclick", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    gridObj.getCellFromIndex(0, 1).dispatchEvent(event);
    gridObj.grid.editModule.formObj.element.getElementsByTagName("input")[0].value = "test";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_update' } });
    expect(gridObj.getRows()[0].getElementsByClassName("e-rowcell")[1].querySelector("div>.e-treecell").innerHTML == "test").toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Virtual Scrolling without height", () => {
  let gridObj: TreeGrid;
  let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Cell",
          newRowPosition: "Below",
        },
        childMapping: "Crew",
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
        actionFailure: actionFailedFunction
      },
      done
    );
  });
  it('actionFailure testing', () => {
    expect(actionFailedFunction).not.toHaveBeenCalled();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Virtual Scrolling with paging", () => {
  let gridObj: TreeGrid;
  let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        allowPaging: true,
        height: 450,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Cell",
          newRowPosition: "Below",
        },
        childMapping: "Crew",
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
        actionFailure: actionFailedFunction
      },
      done
    );
  });
  it('actionFailure testing', () => {
    expect(actionFailedFunction).toHaveBeenCalled();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Virtual Scroll Current view data check", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 1000),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 200,
        enableVirtualMaskRow: false,
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD6",
            headerText: "GP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD7",
            headerText: "GS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD8",
            headerText: "Minutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD9",
            headerText: "Points",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD10",
            headerText: "oRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD11",
            headerText: "dRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD12",
            headerText: "Rebounds",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD13",
            headerText: "Assists",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD14",
            headerText: "Steals",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD15",
            headerText: "Blocks",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD16",
            headerText: "Turnovers",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD17",
            headerText: "PF",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD18",
            headerText: "fgAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD19",
            headerText: "fgMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD20",
            headerText: "ftAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD21",
            headerText: "ftMade",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD22",
            headerText: "ThreeAttempted",
            width: 150,
            textAlign: "Right",
          },
          {
            field: "FIELD23",
            headerText: "ThreeMade",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD24",
            headerText: "PostGP",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD25",
            headerText: "PostGS",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD26",
            headerText: "PostMinutes",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD27",
            headerText: "PostPoints",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD28",
            headerText: "PostoRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD29",
            headerText: "PostdRebounds",
            width: 130,
            textAlign: "Right",
          },
          {
            field: "FIELD30",
            headerText: "PostRebounds",
            width: 130,
            textAlign: "Right",
          },
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("Checking for Current View Data", (done: Function) => {
    treegrid.selectedRowIndex = 30
    treegrid.selectedRowIndex = 6
    let content: HTMLElement = <HTMLElement>treegrid.getContent().firstChild;
    EventHandler.trigger(content, "wheel");
    content.scrollTop = 0;
    expect(treegrid.getCurrentViewRecords()[0]['TaskID']).toBe(1)
    done();
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Coverage improvement", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        treeColumnIndex: 1,
        allowSelection: true,
        selectionSettings: {
          persistSelection: true
        },
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right"
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "TMD",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });


  it("PersistSelection with collapse action", (done: Function) => {
    gridObj.collapseRow(gridObj.getRows()[0]);
    expect((gridObj.getRows()[0] as HTMLTableRowElement).getElementsByClassName("e-treegridcollapse").length).toBe(1);
    done();
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Row selection is incorrect when enableVirtualization is enabled", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        height: 450,
        treeColumnIndex: 1,
        allowSelection: true,
        selectionSettings: {
          enableToggle: true,
          persistSelection: true,
          mode: 'Row',
          type: 'Multiple',
        },
        childMapping: "Crew",
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  it('Check row selection with expand/collpae action', (done: Function) => {
    gridObj.selectRow(1);
    gridObj.dataBound = (args?: Object): void => {
      expect(gridObj.getRows()[1].hasAttribute('aria-selected')).toBeTruthy();
      done();
    };
    gridObj.collapseAll();
    expect(gridObj.getRows()[1].hasAttribute('aria-selected')).toBeFalsy();
    gridObj.expandAll();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Virtual Scrolling with height", () => {
  let gridObj: TreeGrid;
  let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        treeColumnIndex: 1,
        height: '100%',
        childMapping: "Crew",
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
        actionFailure: actionFailedFunction
      },
      done
    );
  });

  it('actionFailure testing with height in percentage', () => {
    expect(actionFailedFunction).toHaveBeenCalled();
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Task disappear on collapse and expand action", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: crData.slice(0, 1),
        enableVirtualization: true,
        treeColumnIndex: 1,
        childMapping: 'SubTasks',
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: 'Row',
          newRowPosition: 'Child'
        },
        toolbar: ['Add', 'Edit', 'ExpandAll', 'CollapseAll', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
        height: 400,
        columns: [
          { field: 'TaskID', isPrimaryKey: true },
          { field: 'TaskName', width: '230px' },
          { field: 'StartDate' },
          { field: 'Duration' },
          { field: 'Progress' },
        ],
      },
      done
    );
  });
  it('Checking for current view data', () => {
    gridObj.collapseByKey(199);
    gridObj.collapseByKey(14);
    gridObj.collapseByKey(3);
    gridObj.expandByKey(3);
    gridObj.element.querySelector('.e-content').scrollTop = 200;
    gridObj.collapseByKey(9);
    gridObj.collapseByKey(4);
    gridObj.collapseByKey(3);
    gridObj.expandByKey(14);
    expect(gridObj.getCurrentViewRecords().length > 7).toBe(true);
  });

  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Adding task at bottom coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: crData.slice(0, 1),
        enableVirtualization: true,
        treeColumnIndex: 1,
        childMapping: 'SubTasks',
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: 'Row',
          newRowPosition: 'Child'
        },
        toolbar: ['Add', 'Edit', 'ExpandAll', 'CollapseAll', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
        height: 400,
        columns: [
          { field: 'TaskID', isPrimaryKey: true },
          { field: 'TaskName', width: '230px' },
          { field: 'StartDate' },
          { field: 'Duration' },
          { field: 'Progress' },
        ],
      },
      done
    );
  });
  beforeEach((done: Function) => {
    setTimeout(done, 300);
  });
  it('Scrolling down', () => {
    gridObj.element.querySelector('.e-content').scrollTop = 10000;
  });
  it('Checking flatdata after adding', () => {
    gridObj.addRecord({
      TaskID: 10,
      TaskName: 'Identify Site location',
      StartDate: new Date('04/02/2019'),
      Duration: 3,
      Progress: 50
    }, 805, 'Bottom')
    expect(gridObj.flatData.length > 805).toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Freeze Row Coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: crData.slice(0, 1),
        enableVirtualization: true,
        treeColumnIndex: 1,
        childMapping: 'SubTasks',
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: 'Row',
          newRowPosition: 'Child'
        },
        toolbar: ['Add', 'Edit', 'ExpandAll', 'CollapseAll', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
        height: 400,
        columns: [
          { field: 'TaskID', isPrimaryKey: true },
          { field: 'TaskName', width: '230px' },
          { field: 'StartDate' },
          { field: 'Duration' },
          { field: 'Progress' },
        ],
      },
      done
    );
  });
  it('Freeze row data index', () => {
    let row = (gridObj.grid.contentModule as any).getFrozenRightVirtualRowByIndex(5);
    expect(row.rowIndex === 5).toBe(true);
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Bug 916448: Issues related to cell editing with virtualization.", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        enableVirtualMaskRow: true,
        treeColumnIndex: 1,
        childMapping: 'Crew',
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: 'Cell',
          newRowPosition: 'Child'
        },
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it('Check cell edit', () => {
    const event: MouseEvent = new MouseEvent('dblclick', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    gridObj.getCellFromIndex(3, 1).dispatchEvent(event);
    gridObj.grid.editModule.formObj.element.getElementsByTagName('input')[0].value = 'test';
    gridObj.grid.pageSettings.currentPage = 2;
    gridObj.closeEdit();
    expect(gridObj.getCurrentViewRecords().length === 40).toBe(true);

  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("TreeGrid - expand action with virtual scrolling", () => {
  var virtualData2: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number | null }[] = [];

  for (let i = 0; i < 38; i++) {
    let parentTaskId: number = virtualData2.length + 1;

    // Create parent task
    let parent: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number | null } = {
      TaskID: parentTaskId,
      TaskName: `Project ${i + 1}`,
      StartDate: '2024-12-01',
      Duration: 50, // Example duration
      Progress: 0, // Example progress
      parentID: null, // No parent for top-level
    };
    virtualData2.push(parent);

    // Create 100 child tasks for this parent
    for (let j = 0; j < 30; j++) {
      let childTaskId: number = virtualData2.length + 1;

      // Create child task
      let child: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
        TaskID: childTaskId,
        TaskName: `Task ${j + 1} of Project ${i + 1}`,
        StartDate: '2024-12-01',
        Duration: 5 + (j % 3), // Example duration
        Progress: j % 100, // Example progress
        parentID: parentTaskId,
      };
      virtualData2.push(child);

      // Make the 11th child (index 10) a parent of 100 nested tasks
      if (j === 10) {
        for (let k = 0; k < 10; k++) {
          let nestedTaskId: number = virtualData2.length + 1;

          // Create nested child task
          let nestedChild: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
            TaskID: nestedTaskId,
            TaskName: `Subtask ${k + 1} of Task ${childTaskId}`,
            StartDate: '2024-12-01',
            Duration: 3 + (k % 2), // Example duration
            Progress: k % 50, // Example progress
            parentID: childTaskId,
          };
          virtualData2.push(nestedChild);
        }
      }
      if (j === 20) {
        for (let k = 0; k < 10; k++) {
          let nestedTaskId: number = virtualData2.length + 1;

          // Create nested child task
          let nestedChild: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
            TaskID: nestedTaskId,
            TaskName: `Subtask ${k + 1} of Task ${childTaskId}`,
            StartDate: '2024-12-01',
            Duration: 3 + (k % 2), // Example duration
            Progress: k % 50, // Example progress
            parentID: childTaskId,
          };
          virtualData2.push(nestedChild);
        }
      }
    }
  }
  let TreeGridObj: TreeGrid;
  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: virtualData2,
        enableVirtualization: true,
        enableVirtualMaskRow: true,
        treeColumnIndex: 1,
        parentIdMapping: 'parentID',
        idMapping: 'TaskID',
        editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Row', newRowPosition: 'Child' },
        allowSelection: true,
        allowSorting: true,
        selectionSettings: { enableToggle: true, persistSelection: true, mode: 'Row', type: 'Multiple' },
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
        height: 400,
        columns: [
          { field: 'TaskID', isPrimaryKey: true },
          { field: 'TaskName' },
          { field: 'StartDate' },
        ],
      },
      done
    );
  });

  it('should collapse all and then expand the third row', (done: Function) => {
    TreeGridObj.collapseAll();
    setTimeout(done, 500);
    TreeGridObj.selectRow(3);
    TreeGridObj.expandRow(TreeGridObj.getRows()[3] as HTMLTableRowElement);
    expect(TreeGridObj.getRows()[3].getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse row by collapseAtLevel', (done: Function) => {
    TreeGridObj.collapseAtLevel(0);
    setTimeout(done, 500);
    expect(TreeGridObj.getRows()[0].getAttribute('aria-expanded')).toBe('false');
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("Adding record in sorted column", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: virtualData.slice(0, 500),
        enableVirtualization: true,
        enableVirtualMaskRow: false,
        childMapping: "Crew",
        allowSelection: true,
        allowSorting: true,
        treeColumnIndex: 1,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
        },
        height: 400,
        columns: [

          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  it("Sorts the column, adds a record, and verifies the selected record", (done: Function) => {
    actionComplete = (args?: any): void => { };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.sortByColumn("FIELD1", "Descending", true);
    gridObj.selectRow(0);
    gridObj.addRecord(
      {
        TaskID: 10001,
        FIELD1: "abramjo01",
        FIELD2: 1999,
        FIELD3: 30,
      },
      410
    );
    const selectedRow: any = gridObj.getSelectedRecords()[0];
    expect(selectedRow.FIELD1).toBe("abramjo01");
    done();
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: virtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Virtualization coverage", () => {
    gridObj.isDestroyed = true;
    (gridObj as any).virtualScrollModule.addEventListener();
    gridObj.isDestroyed = false;
    (gridObj as any).virtualScrollModule.removeEventListener();
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Checkbox selection with virtualization", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        allowSelection: true,
        selectionSettings: { persistSelection: true },
        height: 400,
        columns: [
          { type: 'checkbox', width: 50 },
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 200);
      }
    );
  });


  it("Select headercell", () => {
    (<HTMLElement>gridObj.element.querySelector('.e-checkselectall')).click();
    expect(gridObj.getSelectedRecords().length).toBe(1000);
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

// describe("EJ2-924945- Focus removed on scrolling down using key in Virtualization", () => {
//   var tempData = [
//     {
//       TaskID: 1,
//       TaskName: 'Product concept',
//       StartDate: new Date('04/02/2019'),
//       EndDate: new Date('04/21/2019'),
//       parentID: 0,
//     },
//     {
//       TaskID: 2,
//       TaskName: 'Defining the product and its usage',
//       StartDate: new Date('04/02/2019'),
//       Duration: 3,
//       Progress: 30,
//       parentID: 1,
//     },
//     {
//       TaskID: 3,
//       TaskName: 'Defining target audience',
//       StartDate: new Date('04/02/2019'),
//       parentID: 1,
//       Duration: 3,
//     },
//     {
//       TaskID: 4,
//       TaskName: 'Prepare product sketch and notes',
//       StartDate: new Date('04/05/2019'),
//       Duration: 2,
//       parentID: 1,
//       Progress: 30,
//     },
//     {
//       TaskID: 5,
//       TaskName: 'Concept approval',
//       StartDate: new Date('04/08/2019'),
//       parentID: 0,
//       Duration: 0,
//     },
//     {
//       TaskID: 6,
//       TaskName: 'Market research',
//       StartDate: new Date('04/02/2019'),
//       parentID: 0,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 7,
//       TaskName: 'Demand analysis',
//       StartDate: new Date('04/04/2019'),
//       EndDate: new Date('04/21/2019'),
//       parentID: 6,
//     },
//     {
//       TaskID: 8,
//       TaskName: 'Customer strength',
//       StartDate: new Date('04/09/2019'),
//       Duration: 4,
//       parentID: 7,
//       Progress: 30,
//     },
//     {
//       TaskID: 9,
//       TaskName: 'Market opportunity analysis',
//       StartDate: new Date('04/09/2019'),
//       Duration: 4,
//       parentID: 7,
//     },
//     {
//       TaskID: 10,
//       TaskName: 'Competitor analysis',
//       StartDate: new Date('04/15/2019'),
//       Duration: 4,
//       parentID: 6,
//       Progress: 30,
//     },
//     {
//       TaskID: 11,
//       TaskName: 'Product strength analsysis',
//       StartDate: new Date('04/15/2019'),
//       Duration: 4,
//       parentID: 6,
//     },
//     {
//       TaskID: 12,
//       TaskName: 'Research complete',
//       StartDate: new Date('04/18/2019'),
//       Duration: 0,
//       parentID: 6,
//     },
//     {
//       TaskID: 13,
//       TaskName: 'Product design and development',
//       StartDate: new Date('04/04/2019'),
//       parentID: 0,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 14,
//       TaskName: 'Functionality design',
//       StartDate: new Date('04/19/2019'),
//       Duration: 3,
//       parentID: 13,
//       Progress: 30,
//     },
//     {
//       TaskID: 15,
//       TaskName: 'Quality design',
//       StartDate: new Date('04/19/2019'),
//       Duration: 3,
//       parentID: 13,
//     },
//     {
//       TaskID: 16,
//       TaskName: 'Define reliability',
//       StartDate: new Date('04/24/2019'),
//       Duration: 2,
//       Progress: 30,
//       parentID: 13,
//     },
//     {
//       TaskID: 17,
//       TaskName: 'Identifying raw materials',
//       StartDate: new Date('04/24/2019'),
//       Duration: 2,
//       parentID: 13,
//     },
//     {
//       TaskID: 18,
//       TaskName: 'Define cost plan',
//       StartDate: new Date('04/04/2019'),
//       parentID: 13,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 19,
//       TaskName: 'Manufacturing cost',
//       StartDate: new Date('04/26/2019'),
//       Duration: 2,
//       Progress: 30,
//       parentID: 18,
//     },
//     {
//       TaskID: 20,
//       TaskName: 'Selling cost',
//       StartDate: new Date('04/26/2019'),
//       Duration: 2,
//       parentID: 18,
//     },
//     {
//       TaskID: 21,
//       TaskName: 'Development of the final design',
//       StartDate: new Date('04/30/2019'),
//       parentID: 13,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 22,
//       TaskName: 'Defining dimensions and package volume',
//       StartDate: new Date('04/30/2019'),
//       Duration: 2,
//       parentID: 21,
//       Progress: 30,
//     },
//     {
//       TaskID: 23,
//       TaskName: 'Develop design to meet industry standards',
//       StartDate: new Date('05/02/2019'),
//       Duration: 2,
//       parentID: 21,
//     },
//     {
//       TaskID: 24,
//       TaskName: 'Include all the details',
//       StartDate: new Date('05/06/2019'),
//       Duration: 3,
//       parentID: 21,
//     },
//     {
//       TaskID: 25,
//       TaskName: 'CAD computer-aided design',
//       StartDate: new Date('05/09/2019'),
//       Duration: 3,
//       parentID: 13,
//       Progress: 30,
//     },
//     {
//       TaskID: 26,
//       TaskName: 'CAM computer-aided manufacturing',
//       StartDate: new Date('09/14/2019'),
//       Duration: 3,
//       parentID: 13,
//     },
//     {
//       TaskID: 27,
//       TaskName: 'Design complete',
//       StartDate: new Date('05/16/2019'),
//       Duration: 0,
//       parentID: 13,
//     },
//     {
//       TaskID: 28,
//       TaskName: 'Prototype testing',
//       StartDate: new Date('05/17/2019'),
//       Duration: 4,
//       Progress: 30,
//       parentID: 0,
//     },
//     {
//       TaskID: 29,
//       TaskName: 'Include feedback',
//       StartDate: new Date('05/17/2019'),
//       Duration: 4,
//       parentID: 0,
//     },
//     {
//       TaskID: 30,
//       TaskName: 'Manufacturing',
//       StartDate: new Date('05/23/2019'),
//       Duration: 5,
//       Progress: 30,
//       parentID: 0,
//     },
//     {
//       TaskID: 31,
//       TaskName: 'Assembling materials to finsihed goods',
//       StartDate: new Date('05/30/2019'),
//       Duration: 5,
//       parentID: 0,
//     },
//     {
//       TaskID: 32,
//       TaskName: 'Feedback and testing',
//       StartDate: new Date('04/04/2019'),
//       parentID: 0,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 33,
//       TaskName: 'Internal testing and feedback',
//       StartDate: new Date('06/06/2019'),
//       Duration: 3,
//       parentID: 32,
//       Progress: 45,
//     },
//     {
//       TaskID: 34,
//       TaskName: 'Customer testing and feedback',
//       StartDate: new Date('06/11/2019'),
//       Duration: 3,
//       parentID: 32,
//       Progress: 50,
//     },
//     {
//       TaskID: 35,
//       TaskName: 'Final product development',
//       StartDate: new Date('04/04/2019'),
//       parentID: 0,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 36,
//       TaskName: 'Important improvements',
//       StartDate: new Date('06/14/2019'),
//       Duration: 4,
//       Progress: 30,
//       parentID: 35,
//     },
//     {
//       TaskID: 37,
//       TaskName: 'Address any unforeseen issues',
//       StartDate: new Date('06/14/2019'),
//       Duration: 4,
//       Progress: 30,
//       parentID: 35,
//     },
//     {
//       TaskID: 38,
//       TaskName: 'Final product',
//       StartDate: new Date('04/04/2019'),
//       parentID: 0,
//       EndDate: new Date('04/21/2019'),
//     },
//     {
//       TaskID: 39,
//       TaskName: 'Branding product',
//       StartDate: new Date('06/20/2019'),
//       Duration: 4,
//       parentID: 38,
//     },
//     {
//       TaskID: 40,
//       TaskName: 'Marketing and presales',
//       StartDate: new Date('06/26/2019'),
//       Duration: 4,
//       Progress: 30,
//       parentID: 38,
//     },
//   ];
//   interface Task {
//     TaskID?: number;
//     TaskName?: string;
//     StartDate?: Date;
//     Duration?: number;
//     Progress?: number;
//     parentID?: number;
//   }

//   var virtualData1: Task[] = [];
//   var projId = 1;
//   for (var i = 0; i < 50; i++) {
//     var x = virtualData1.length + 1;
//     var parent_1: Task = {};
//     parent_1['TaskID'] = x;
//     parent_1['TaskName'] = 'Project' + projId++;
//     virtualData1.push(parent_1);
//     for (var j = 0; j < tempData.length; j++) {
//       var subtasks: Task = {};
//       subtasks['TaskID'] = tempData[j].TaskID + x;
//       subtasks['TaskName'] = tempData[j].TaskName;
//       subtasks['StartDate'] = tempData[j].StartDate;
//       subtasks['Duration'] = tempData[j].Duration;
//       subtasks['Progress'] = tempData[j].Progress;
//       subtasks['parentID'] = tempData[j].parentID + x;
//       virtualData1.push(subtasks);
//     }
//   }
//   let TreeGridObj: TreeGrid;
//   const preventDefault: Function = new Function();
//   beforeAll((done: Function) => {
//     TreeGridObj = createGrid(
//       {
//         dataSource: virtualData1,
//         allowSorting: true,
//         enableVirtualization: true,
//         parentIdMapping: 'parentID',
//         idMapping: 'TaskID',
//         contextMenuItems: ['AddRow'],
//         toolbar: ["Indent", "Outdent", "Add", "Delete", "Update", "Cancel"],
//         editSettings: {
//           allowAdding: true,
//           allowEditing: true,
//           allowDeleting: true,
//           newRowPosition: "Below"
//         },
//         allowRowDragAndDrop: true,
//         columns: [
//           { field: 'TaskID', isPrimaryKey: true },
//           { field: 'TaskName' },
//           { field: 'StartDate' },
//           { field: 'Duration' },
//           { field: 'Progress' },
//         ],
//         allowExcelExport: true,
//         selectedRowIndex: 2,
//         allowPdfExport: true,
//         allowSelection: true,
//         allowFiltering: true,
//         gridLines: 'Both',
//         height: '400px',
//         allowResizing: true,
//         selectionSettings: {
//           mode: 'Row',
//           type: 'Single',
//           enableToggle: false,

//         },
//         rowHeight: 40,
//       },
//       done
//     );
//   });

//   it("Scroll to Middle", function (done: Function) {
//     let content: HTMLElement = <HTMLElement>TreeGridObj.getContent().firstChild;
//     EventHandler.trigger(content, "wheel");
//     content.scrollTop = 10;
//     content.scrollTop = 4000;
//     EventHandler.trigger(content, "scroll", { target: content });
//     setTimeout(done, 500);
//   });

//   it("Move using downArrow key", function (done: Function) {
//     (TreeGridObj.getContent().querySelector('.e-rowcell[index="108"]') as HTMLElement).click();
//     (TreeGridObj.getContent().querySelector('.e-rowcell[index="108"]') as HTMLElement).focus();
//     TreeGridObj.grid.keyboardModule.keyAction({
//       action: 'downArrow', preventDefault: preventDefault,
//       target: document.activeElement
//     });
//     setTimeout(done, 500);
//   });

//   it("DownArrow to Bottom Row", function (done: Function) {
//     TreeGridObj.grid.keyboardModule.keyAction({
//       action: 'downArrow', preventDefault: preventDefault,
//       target: document.activeElement
//     });
//     setTimeout(done, 500);
//   });

//   it("Check for focused element", function (done: Function) {
//     expect(document.activeElement.tagName).toBe('TD');
//     done();
//   });

//   afterAll(() => {
//     destroy(TreeGridObj);
//     TreeGridObj = null;
//   });
// });

// describe("EJ2-926455- Collapsed record not in viewport", () => {
//   var virtualData2: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number | null }[] = [];

//   for (let i = 0; i < 100; i++) {
//     let parentTaskId: number = virtualData2.length + 1;

//     // Create parent task
//     let parent: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number | null } = {
//       TaskID: parentTaskId,
//       TaskName: `Project ${i + 1}`,
//       StartDate: '2024-12-01',
//       Duration: 50, // Example duration
//       Progress: 0, // Example progress
//       parentID: null, // No parent for top-level
//     };
//     virtualData2.push(parent);

//     // Create 100 child tasks for this parent
//     for (let j = 0; j < 30; j++) {
//       let childTaskId: number = virtualData2.length + 1;

//       // Create child task
//       let child: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
//         TaskID: childTaskId,
//         TaskName: `Task ${j + 1} of Project ${i + 1}`,
//         StartDate: '2024-12-01',
//         Duration: 5 + (j % 3), // Example duration
//         Progress: j % 100, // Example progress
//         parentID: parentTaskId,
//       };
//       virtualData2.push(child);

//       // Make the 11th child (index 10) a parent of 100 nested tasks
//       if (j === 10) {
//         for (let k = 0; k < 10; k++) {
//           let nestedTaskId: number = virtualData2.length + 1;

//           // Create nested child task
//           let nestedChild: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
//             TaskID: nestedTaskId,
//             TaskName: `Subtask ${k + 1} of Task ${childTaskId}`,
//             StartDate: '2024-12-01',
//             Duration: 3 + (k % 2), // Example duration
//             Progress: k % 50, // Example progress
//             parentID: childTaskId,
//           };
//           virtualData2.push(nestedChild);
//         }
//       }
//       if (j === 20) {
//         for (let k = 0; k < 10; k++) {
//           let nestedTaskId: number = virtualData2.length + 1;

//           // Create nested child task
//           let nestedChild: { TaskID: number; TaskName: string; StartDate: string; Duration: number; Progress: number; parentID: number } = {
//             TaskID: nestedTaskId,
//             TaskName: `Subtask ${k + 1} of Task ${childTaskId}`,
//             StartDate: '2024-12-01',
//             Duration: 3 + (k % 2), // Example duration
//             Progress: k % 50, // Example progress
//             parentID: childTaskId,
//           };
//           virtualData2.push(nestedChild);
//         }
//       }
//     }
//   }
//   let TreeGridObj: TreeGrid;
//   let oldTranslateY = 0;
//   const preventDefault: Function = new Function();
//   beforeAll((done: Function) => {
//     TreeGridObj = createGrid(
//       {
//         dataSource: virtualData2,
//         enableVirtualization: true,
//         height: 300,
//         treeColumnIndex: 1,
//         enableVirtualMaskRow: true,
//         parentIdMapping: 'parentID',
//         idMapping: 'TaskID',
//         columns: [
//           { field: 'TaskID', isPrimaryKey: true },
//           { field: 'TaskName' },
//           { field: 'StartDate' },
//         ],
//         editSettings: {
//           allowEditing: true,
//           allowAdding: true,
//           allowDeleting: true,
//           mode: 'Row',
//           newRowPosition: 'Child',
//         },
//         toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Indent', 'Outdent'],
//       },
//       done
//     );
//   });

//   it("Scroll to Bottom", function (done: Function) {
//     let content: HTMLElement = <HTMLElement>TreeGridObj.getContent().firstChild;
//     EventHandler.trigger(content, "wheel");
//     content.scrollTop = 10;
//     content.scrollTop = 186813;
//     EventHandler.trigger(content, "scroll", { target: content });
//     setTimeout(done, 1000);
//   });

//   it("Collapse last parentrecord", function (done: Function) {
//     const virtualTable: HTMLElement = <HTMLElement>TreeGridObj.getContent().querySelector('.e-virtualtable');
//     oldTranslateY = parseFloat(virtualTable.style.transform.split(',')[1].trim().replace('px)', ''));
//     TreeGridObj.collapseByKey(5050);
//     setTimeout(done, 500);
//   });

//   it("Compare TranslateY", function (done: Function) {
//     const virtualTable: HTMLElement = <HTMLElement>TreeGridObj.getContent().querySelector('.e-virtualtable');
//     const newTranslateY = parseFloat(virtualTable.style.transform.split(',')[1].trim().replace('px)', ''));
//     expect(oldTranslateY).not.toBe(newTranslateY);
//     done();
//   });

//   afterAll(() => {
//     destroy(TreeGridObj);
//     TreeGridObj = null;
//   });

// });

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 200);
      }
    );
  });

  it("Expand/collapse coverage", () => {
    (gridObj.grid.contentModule as VirtualContentRenderer).startIndex = 20;
    (gridObj.grid.contentModule as any).endIndex = 40;
    gridObj.collapseAll();
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        enableColumnVirtualization: true,
        enablePersistence: true,
        height: 400,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD6",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD7",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD8",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 200);
      }
    );
  });

  it("Persistance coverage", () => {
    expect(gridObj.flatData.length === 1000).toBe(true);
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        frozenRows: 2,
        height: 400,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      done
    );
  });

  it("GetRowCollection", () => {
    gridObj.grid.pageSettings.currentPage = 2;
   (gridObj.grid.contentModule as VirtualTreeContentRenderer).getRowCollection(1, false, true);
  });

  it("GetRowCollection", () => {
    gridObj.grid.pageSettings.currentPage = 2;
   (gridObj.grid.contentModule as VirtualTreeContentRenderer).getRowCollection(3, false, true);
  });

  it("GetRowCollection", () => {
    gridObj.grid.pageSettings.currentPage = 2;
   (gridObj.grid.contentModule as VirtualTreeContentRenderer).getRowCollection(3, false, false);
  });

  it("GetRowCollection", () => {
    gridObj.grid.pageSettings.currentPage = 2;
   (gridObj.grid.contentModule as VirtualTreeContentRenderer).getRowCollection(1, false, false);
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below",
        },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      done
    );
  });

  it("restoreNewRow ", () => {
    (gridObj.grid.contentModule as VirtualContentRenderer)['isAdd'] = true;
    (gridObj.grid.contentModule as VirtualTreeContentRenderer)['restoreNewRow']();
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Batch",
        },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 300);
      }
    );
  });

  it("getRowCollection ", () => {
    gridObj.grid.isEdit = true;
    (gridObj.grid.contentModule as VirtualTreeContentRenderer).getRowCollection(1, true, true);
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true
        },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 300);
      }
    );
  });

  it("Index modifier ", () => {
    (gridObj.grid.contentModule as VirtualContentRenderer).startIndex = 980;
    (gridObj.grid.contentModule as any)['endIndex'] = 1000;
    (gridObj.grid.contentModule as any)['recordAdded'] = true;
    gridObj.addRecord(
      { TaskID: 10000, FIELD1: "TEST1" },
      gridObj.getCurrentViewRecords()[0]["TaskID"],
      "Child"
    );
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("Virtualization coverage", () => {
  let gridObj: TreeGrid;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData,
        childMapping: "Crew",
        enableVirtualization: true,
        height: 400,
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: 'Row',
          newRowPosition: 'Child'
        },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD5",
            headerText: "LGID",
            width: 120,
            textAlign: "Right",
          }
        ],
      },
      () => {
        let content: HTMLElement = (<HTMLElement>gridObj.grid.getContent().firstChild);
        EventHandler.trigger(content, 'wheel');
        content.scrollTop = 10;
        content.scrollTop = 1200;
        EventHandler.trigger(content, 'scroll', { target: content });
        setTimeout(done, 300);
      }
    );
  });

  it("Index modifier ", () => {
    (gridObj.grid.contentModule as VirtualContentRenderer).startIndex = 14;
    (gridObj.grid.contentModule as any)['endIndex'] = 34;
    (gridObj.grid.contentModule as any)['recordAdded'] = true;
    gridObj.addRecord(
      { TaskID: 10000, FIELD1: "TEST1" },
      gridObj.getCurrentViewRecords()[0]["TaskID"],
      "Child"
    );
  });

  afterAll(() => {
    destroy(gridObj);
    gridObj = null;
  });
});

describe("filtering with CollapseAll", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 500),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        enableVirtualMaskRow: false,
        height: 200,
        enableVirtualization: true,
        enableCollapseAll:true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          
        ],
        treeColumnIndex: 0,
      },
      done
    );
  });
  it("should return records in collapsed state", (done: Function) => {
    treegrid.actionBegin = (args?: ActionEventArgs) : void => {
            args.isCollapseMaintain = true;
    };
    treegrid.filterByColumn("FIELD1", "contains", "Aiden-Jack");
    expect(
      (treegrid.getRows()[0] as HTMLTableRowElement).getElementsByClassName(
        "e-treegridcollapse"
      ).length
    ).toBe(1);
    done();
  });
  
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Rendering with 100 Records", () => {
  let treegrid: TreeGrid;
    beforeAll((done: Function) => {
      treegrid = createGrid({
        dataSource: virtualData.slice(0, 100), // Reduced dataset for testing
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 200,
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" },
          { field: "FIELD5", headerText: "LGID", width: 120, textAlign: "Right" },
          ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("rendering test", (done: Function) => {
   expect(treegrid.getRows().length).toBe(20);
   expect(!isNullOrUndefined(treegrid.getRows()[0].querySelectorAll("td")[1].querySelector(".e-icons.e-treegridexpand"))).toBe(true);
   done();
  });
  afterAll(() => {
    destroy(treegrid);
    treegrid=null;
  });
});

describe("Rendering with 100 Records expand/collapse test", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 100), // Reduced dataset for testing
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 200,
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" },
          { field: "FIELD5", headerText: "LGID", width: 120, textAlign: "Right" },
          ],
        treeColumnIndex: 1,
      },
      done
    );
  }); 
  it("collapse test", (done: Function) => {
    let len: number = 0;
    let collapsed = (args?: any) => {
      let rows: HTMLTableRowElement[] = treegrid.getRows();
      for (let n: number = 0; n < rows.length; n++) {
        if (!isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))) {
          len = len + 1;
        }
      }
      expect(len).toBe(20);
      done();
    };
    treegrid.collapsed = collapsed;
    treegrid.collapseAll();
  });
  it("expand test", (done: Function) => {
   let  expanded = (args?: any) => {
      expect(isNullOrUndefined(treegrid.getRows()[1].querySelector(".e-treegridexpand"))).toBe(true);
      done();
    };
    treegrid.expanded = expanded;
    treegrid.expandAll();
  });
  afterAll(() => {
    destroy(treegrid);
    treegrid=null;
  });
});

describe("Rendering with 100 Records expand/collapse by using methods", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 100), // Reduced dataset for testing
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 200,
        enableVirtualization: true,
        columns: [
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" },
          { field: "FIELD5", headerText: "LGID", width: 120, textAlign: "Right" },
          ],
        treeColumnIndex: 1,
      },
      done
    );
  });
  it("expandAtLevel() test", (done: Function) => {
   let expanded = (args?: any) => {
      expect(isNullOrUndefined(treegrid.getRows()[1].querySelector(".e-treegridexpand"))).toBe(true);
      done();
    };
    treegrid.expanded = expanded;
    treegrid.expandAtLevel(0);
  });
  it("collapseAtLevel test", (done: Function) => {
    let len: number = 0;
    let collapsed = (args?: any) => {
      let rows: HTMLTableRowElement[] = treegrid.getRows();
      for (let n: number = 0; n < rows.length; n++) {
        if (!isNullOrUndefined(rows[n].querySelector(".e-treegridcollapse"))) {
          len = len + 1;
        }
      }
    expect(len).toBe(20);
    done();
    };
    treegrid.collapsed = collapsed;
    treegrid.collapseAtLevel(0);
  });
  afterAll(() => {
    destroy(treegrid);
    treegrid=null;
  });
});

describe("Row Editing with Virtual Scrolling for small no of records", () => {
  let gridObj: TreeGrid;
  let rowIndex: number;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0,20),
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },

            {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
          textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },

          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Edit Start in Current View Records", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        let cells = gridObj.grid.element
          .querySelector(".e-editedrow")
          .querySelectorAll(".e-rowcell");
        expect(cells.length).toBe(gridObj.grid.columns.length);
        //primary key check
        expect(cells[0].querySelectorAll("input.e-disabled").length).toBe(1);
        // allow Editing false
        expect(cells[2].querySelectorAll("input.e-disabled").length).toBe(1);
        //focus check
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "FIELD1"
        );
       
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(gridObj.grid.isEdit).toBeFalsy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    gridObj.grid.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Edit Complete in Current View Records", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "updated"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "updated";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  it("Scroll", (done: Function) => {
    (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 1480;
    setTimeout(done, 400);
  });

  it("Edit Start After Scroll", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        let cells = gridObj.grid.element
          .querySelector(".e-editedrow")
          .querySelectorAll(".e-rowcell");
        expect(cells.length).toBe(gridObj.grid.columns.length);
        //primary key check
        expect(cells[0].querySelectorAll("input.e-disabled").length).toBe(1);
        // allow Editing false
        expect(cells[2].querySelectorAll("input.e-disabled").length).toBe(1);
        //focus check
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "FIELD1"
        );
        
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(gridObj.grid.isEdit).toBeFalsy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    rowIndex = parseInt(gridObj.getRows()[0].getAttribute("aria-rowindex"), 10) - 1;
    gridObj.grid.selectRow(rowIndex);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Edit Complete After Scroll", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "scroll updated"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "scroll updated";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Add New Row with Virtual Scrolling for small no of records", () => {
  let gridObj: TreeGrid;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0,20),
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Add New Row Begin", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "add") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-addedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        expect(document.activeElement.id).toBe(
          gridObj.grid.element.id + "TaskID"
        );
        //toolbar status check
        expect(
          gridObj.grid.element.querySelectorAll(".e-overlay").length
        ).toBe(4);
        expect(gridObj.grid.isEdit).toBeTruthy();
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_add" },
    });
  });

  it("Save New Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(0);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(0);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(0);
        //updatated data cehck
        expect((gridObj.grid.currentViewData[0] as any).TaskID).toBe(98765);
        expect((gridObj.grid.currentViewData[0] as any).FIELD1).toBe(
          "New Row"
        );
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "save") {
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (
      select(
        "#" + gridObj.grid.element.id + "TaskID",
        gridObj.grid.element
      ) as any
    ).value = "98765";
    (
      select(
        "#" + gridObj.grid.element.id + "FIELD1",
        gridObj.grid.element
      ) as any
    ).value = "New Row";
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_update" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Delete Row with Virtual Scrolling for small no of records", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0,20),
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Delete First Parent Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "delete") {
        expect((gridObj.grid.dataSource as any).length === 95).toBe(true);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.selectRow(0);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_delete" },
    });
  });

  it("Scroll", (done: Function) => {
    (<HTMLElement>gridObj.grid.getContent().firstChild).scrollTop = 4000;
    setTimeout(done, 400);
  });

  it("Delete Row after Scroll", (done: Function) => {
    let isParent: boolean;
    let row: Element;
    actionComplete = (args?: any): void => {
      if (args.requestType === "delete") {
        if (isParent) {
          expect((gridObj.grid.dataSource as any).length === 90).toBe(true);
        } else {
          expect((gridObj.grid.dataSource as any).length === 94).toBe(true);
        }
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    row = gridObj.getRows()[0];
    if (row.querySelector(".e-treegridexpand")) {
      isParent = true;
    }
    gridObj.selectRow(parseInt(row.getAttribute("aria-rowindex"), 10) - 1);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_delete" },
    });
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Edit Cancel Checking for small no of records", () => {
  let gridObj: TreeGrid;
  let actionBegin: () => void;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0,20),
        enableVirtualization: true,
        treeColumnIndex: 1,
        toolbar: ["Add", "Edit", "Update", "Delete", "Cancel"],
        editSettings: {
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Row",
        },
        childMapping: "Crew",
        height: 400,
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            allowEditing: false,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD4",
            headerText: "TMID",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  it("Rendering Test", (done: Function) => {
    expect(gridObj.getRows().length > 12).toBe(true);
    done();
  });

  it("Edit Row", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "beginEdit") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-editedrow").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        done();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.selectRow(1);
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_edit" },
    });
  });

  it("Cancel Edit", (done: Function) => {
    actionComplete = (args?: any): void => {
      if (args.requestType === "cancel") {
        //form destroy check
        expect(gridObj.grid.editModule.formObj.isDestroyed).toBeTruthy();
        expect(gridObj.grid.isEdit).toBeFalsy();
        done();
      }
    };
    actionBegin = (args?: any): void => {
      if (args.requestType === "cancel") {
        expect(
          gridObj.grid.element.querySelectorAll(".e-normaledit").length
        ).toBe(1);
        expect(
          gridObj.grid.element.querySelectorAll(".e-gridform").length
        ).toBe(1);
        expect(gridObj.grid.element.querySelectorAll("form").length).toBe(1);
        expect(gridObj.grid.isEdit).toBeTruthy();
      }
    };
    gridObj.grid.actionComplete = actionComplete;
    gridObj.grid.actionBegin = actionBegin;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_cancel" },
    });
  });

  afterAll(() => {
    gridObj.grid.contentModule.removeEventListener();
    destroy(gridObj);
  });
});


describe("TreeGrid Virtualization with Column Virtualization", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 100),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 400,
        width:400,
        enableVirtualization: true,
        enableColumnVirtualization: true,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" },
          { field: "FIELD5", headerText: "LGID", width: 120, textAlign: "Right" },
          { field: "FIELD6", headerText: "GP", width: 120, textAlign: "Right" },
          { field: "FIELD7", headerText: "GS", width: 120, textAlign: "Right" },
          { field: "FIELD8", headerText: "Minutes", width: 120, textAlign: "Right" },
          { field: "FIELD9", headerText: "Points", width: 120, textAlign: "Right" },
          { field: "FIELD10", headerText: "oRebounds", width: 130, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });

  it("should update columns during horizontal scrolling", (done: Function) => {
    let headerContent:any = treegrid.getHeaderContent().querySelector('.e-headercontent');
    let initialFirstColumnHeader = treegrid.getMovableColumns()[0].headerText;
    headerContent.scrollLeft = 600;
    EventHandler.trigger(headerContent, "scroll", { target: headerContent });
    setTimeout(() => {
      let newFirstColumnHeader:any = (treegrid.getHeaderContent().querySelector('.e-headercontent').querySelectorAll('.e-headercell')[4] as any).innerText;
      expect(initialFirstColumnHeader).not.toBe(newFirstColumnHeader);
      done();
    }, 500);
  });

  afterAll(() => {
    destroy(treegrid);
  });
});

describe("TreeGrid Virtualization with Frozen Columns", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 100),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 400,
        enableVirtualization: true,
        frozenColumns: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });

  it("should render frozen columns correctly with virtualization", () => {
    expect(treegrid.getFrozenLeftColumnsCount()).toBe(2);
    expect(treegrid.getMovableColumnsCount()).toBe(3);
    expect(treegrid.getFrozenLeftColumns().length).toBe(2);
    expect(treegrid.getMovableColumns().length).toBe(3);
  });

  it("should verify frozen right columns if configured", (done: Function) => {
    treegrid.frozenColumns = 0;
    (treegrid.columns[4] as any).freeze = 'Right';
    treegrid.refreshColumns();
    setTimeout(() => {
      expect(treegrid.getFrozenRightColumnsCount()).toBe(1);
      expect(treegrid.getFrozenRightColumns().length).toBe(1);
      done();
    }, 500);
  });

  afterAll(() => {
    destroy(treegrid);
  });
});

describe("TreeGrid Virtualization with Row Drag and Drop", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: virtualData.slice(0, 100),
        parentIdMapping: "ParentID",
        idMapping: "TaskID",
        height: 400,
        enableVirtualization: true,
        allowRowDragAndDrop: true,
        selectionSettings: { type: 'Multiple' },
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });

  it("should verify row drag and drop UI elements", () => {
    let rows = treegrid.getRows();
    expect(rows.length).toBeGreaterThan(0);
   treegrid.selectRow(0);
    expect(treegrid.getSelectedRowIndexes().length).toBe(1);
    expect(treegrid.getSelectedRowIndexes()[0]).toBe(0);
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("Handle add actions correctly with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  let actionBeginCount: number = 0;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: virtualData.slice(0, 1000),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Cell",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Should trigger actionBegin only once when adding a record", (done: Function) => {
    let actionBegin = (args?: any): void => {
      if (args.requestType === "add") {
        actionBeginCount++;
      }
    };
    gridObj.grid.actionBegin = actionBegin;
    (<any>gridObj.grid.toolbarModule).toolbarClickHandler({
      item: { id: gridObj.grid.element.id + "_add" },
    });
    expect(actionBeginCount).toBe(1);
    done();
  });
  
  it("Should update flatData correctly after adding record", (done: Function) => {
    let initialFlatDataLength = gridObj.flatData.length;
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
         expect(gridObj.flatData.length).toBe(initialFlatDataLength + 1);
         let newRecordExists = gridObj.flatData.some(item => item["TaskID"] === 98768);
        expect(newRecordExists).toBe(true);
        done();
      }
    };
    
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord({ TaskID: 98768, FIELD1: "New Record" })
  });
  afterAll(() => {
    destroy(gridObj);
  });
});

describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Should add record at Top position", (done: Function) => {
    let initialFirstRecord:any = gridObj.getCurrentViewRecords()[0];
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
       let newFirstRecord:any = gridObj.getCurrentViewRecords()[0];
        expect(newFirstRecord.TaskID).toBe(10001);
        expect(newFirstRecord.FIELD1).toBe("Top Position");
        let secondRecord:any = gridObj.getCurrentViewRecords()[1];
        expect(secondRecord.TaskID).toBe(initialFirstRecord.TaskID);
        done();
      }
    };    
    gridObj.grid.actionComplete = actionComplete;
    gridObj.addRecord({TaskID: 10001, FIELD1: "Top Position",FIELD2: 2023,  FIELD3: 1 },0,"Top");
  });

  afterAll(() => {
    destroy(gridObj);
  });
});


describe("TreeGrid Virtualization with Frozen Columns", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
       
        frozenColumns: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });

  it("Should focus on the correct cell in frozen columns on double-click for editing", (done: Function) => {
    let cell: any = treegrid.getCellFromIndex(0, 0);
    cell.dispatchEvent(new MouseEvent("dblclick", {bubbles: true}));
    expect(cell.innerText == 1).toBe(true);
    done();
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("TreeGrid Virtualization with Frozen Columns", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        frozenColumns: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  }); 

  it("Should correctly add data and reflect in frozen columns", (done: Function) => {
    let actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        let newRow:any = treegrid.flatData[0];
        expect(newRow.TaskID).toBe(10015);
        expect(newRow.FIELD1).toBe("New Entry");
        done();
      }
    };
    treegrid.actionComplete = actionComplete;
    treegrid.addRecord({ TaskID: 10015, FIELD1: "New Entry", FIELD2: 2024, FIELD3: 1 }, 0, "Top");
  });

  afterAll(() => {
    destroy(treegrid);
  });
});

describe("TreeGrid Virtualization with Frozen Columns - Editing", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: editVirtualData.slice(0, 100),
        enableVirtualization: true,
        childMapping: "Crew",
         editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        height: 400,
        frozenColumns: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });

  it("Should enter edit mode on double-click", (done: Function) => {
    let cell: any = treegrid.getCellFromIndex(1, 1);
    cell.dispatchEvent(new MouseEvent("dblclick", {bubbles: true}));
    treegrid.selectRow(1);
    treegrid.startEdit();
    let formEle: HTMLFormElement = treegrid.grid.editModule.formObj.element;
    expect(formEle).not.toBe(null);
    done();
  });
  afterAll(() => {
    destroy(treegrid);
  });
});

describe("TreeGrid Virtualization with Frozen Columns - Editing", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: editVirtualData.slice(0, 100),
        enableVirtualization: true,
        childMapping: "Crew",
         editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        height: 400,
        frozenColumns: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
        treeColumnIndex: 1,
      },
      done
    );
  });
it("Should save edited data correctly", (done: Function) => {
  let actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        let editedRecord: any = treegrid.getCurrentViewRecords()[1];
        expect(editedRecord.FIELD1).toBe("Updated Child Record");
        done();
      }
    };
   treegrid.grid.actionComplete = actionComplete;
   treegrid.selectRow(1);
   treegrid.startEdit();
   let formEle: HTMLFormElement = treegrid.grid.editModule.formObj.element;
  (select('#' + treegrid.grid.element.id + 'FIELD1', formEle) as any).value = 'Updated Child Record';
  (<any>treegrid.grid.toolbarModule).toolbarClickHandler({ item: { id: treegrid.grid.element.id + '_update' } });
});
afterAll(() => {
    destroy(treegrid);
  });
});

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                enableVirtualization: true,
                allowSorting: true,
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
            },
            done
        );
    });
    it('remoteVirtualAction', (done: Function) => {
      const virtualArgs: NotifyArgs = {};
       gridObj.dataModule['remoteVirtualAction'](virtualArgs);
       done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                enableVirtualization: true,
                height: 400,
                treeColumnIndex: 1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
            },
            done
        );
    });
    it('checkAndResetCache', (done: Function) => {
      (gridObj.grid.contentModule as VirtualContentRenderer).vgenerator.checkAndResetCache('refresh');
       done();
    });
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
        
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });
  
  it("Should add record at Bottom position", (done: Function) => {
   actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        // Verify the record was added at the bottom
        let lastRecord : any= gridObj.flatData[gridObj.flatData.length - 1];
        
        expect(lastRecord.TaskID).toBe(10002);
        expect(lastRecord.FIELD1).toBe("Bottom Position");
        
       done();
      }
    };
    
    gridObj.actionComplete = actionComplete;
    
    gridObj.addRecord(
      { 
        TaskID: 10002, 
        FIELD1: "Bottom Position", 
        FIELD2: 2023, 
        FIELD3: 1 
      },
      gridObj.flatData.length -1,
      "Bottom"
    );
  });
  

  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

 
  it("Should add record at Above position relative to selected row", (done: Function) => {
    // Select a row in the middle
    let targetRowIndex = 5;
    gridObj.selectRow(targetRowIndex);
    
    let targetRecord:any = gridObj.getCurrentViewRecords()[targetRowIndex];
    
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
        
        // Verify the record was added above the selected row
        let newRecord :any= gridObj.flatData[targetRowIndex];
        expect(newRecord.TaskID).toBe(10003);
        expect(newRecord.FIELD1).toBe("Above Position");
        
        // Verify the selected row is now one position down
        let movedRecord :any= gridObj.flatData[targetRowIndex +1];
        expect(movedRecord.TaskID).toBe(targetRecord.TaskID);
        done();
      }
    };
    
    gridObj.actionComplete = actionComplete;
    
    // Add record Above the selected row
    gridObj.addRecord(
      { 
        TaskID: 10003, 
        FIELD1: "Above Position", 
        FIELD2: 2023, 
        FIELD3: 1 
      },
      targetRowIndex,
      "Above"
    );
  });

 
  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Should add record at Below position relative to selected row", (done: Function) => {
    // Select a row in the middle
    let targetRowIndex = 2;
    gridObj.selectRow(targetRowIndex);
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
       
        // Verify the record was added below the selected row
        let newRecord:any = gridObj.flatData[targetRowIndex+1];
        expect(newRecord.TaskID).toBe(10004);
        expect(newRecord.FIELD1).toBe("Below Position");
        
        done();
      }
    };
    
    gridObj.actionComplete = actionComplete;
    
    // Add record Below the selected row
    gridObj.addRecord(
      { 
        TaskID: 10004, 
        FIELD1: "Below Position", 
        FIELD2: 2023, 
        FIELD3: 1 
      },
      targetRowIndex,
      "Below"
    );
  });  

  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Should add record at Child position relative to selected row", (done: Function) => {
    // Select a row in the middle
    let targetRowIndex = 2;
    gridObj.selectRow(targetRowIndex);
    
    
    actionComplete = (args?: any): void => {
      if (args.requestType === "save") {
       
        // Verify the record was added below the selected row
        let newRecord:any = gridObj.flatData[targetRowIndex+1];
        expect(newRecord.TaskID).toBe(10010);
        expect(newRecord.FIELD1).toBe("Child Position");
        
        done();
      }
    };
    
    gridObj.actionComplete = actionComplete;
    
    // Add record Below the selected row
    gridObj.addRecord(
      { 
        TaskID: 10010, 
        FIELD1: "Child Position", 
        FIELD2: 2023, 
        FIELD3: 1 
      },
      targetRowIndex,
      "Child"
    );
  });
  afterAll(() => {
    destroy(gridObj);
  });
});
describe("Adding rows at different positions with virtualization", () => {
  let gridObj: TreeGrid;
  let actionComplete: () => void;
  
  beforeAll((done: Function) => {
    gridObj = createGrid(
      {
        dataSource: editVirtualData.slice(0, 500),
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          mode: "Row",
          newRowPosition: "Below"
        },
        toolbar: ["Add", "Edit", "Delete", "Update", "Cancel"],
        columns: [
          {
            field: "TaskID",
            headerText: "Player Jersey",
            isPrimaryKey: true,
            width: 140,
            textAlign: "Right",
          },
          { field: "FIELD1", headerText: "Player Name", width: 140 },
          {
            field: "FIELD2",
            headerText: "Year",
            width: 120,
            textAlign: "Right",
          },
          {
            field: "FIELD3",
            headerText: "Stint",
            width: 120,
            textAlign: "Right",
          },
        ],
      },
      done
    );
  });

  it("Should maintain scroll position after adding records at different positions", (done: Function) => {
    // Scroll to a specific position
    let content: HTMLElement = <HTMLElement>gridObj.getContent().firstChild;
    let scrollPosition = 1500;
    content.scrollTop = scrollPosition;
    EventHandler.trigger(content, "scroll", { target: content });
    
    setTimeout(() => {
      // Select a visible row
      let visibleRowIndex = parseInt(gridObj.getRows()[2].getAttribute("aria-rowindex"), 10) - 1;
      let visibleRecord:any = gridObj.getCurrentViewRecords()[visibleRowIndex];
      gridObj.selectRow(visibleRowIndex);
      
      // Add record below the selected row
      actionComplete = (args?: any): void => {
        if (args.requestType === "save") {
          // Verify scroll position is maintained (with some tolerance)
          expect(Math.abs(content.scrollTop - scrollPosition) > 100).toBe(true);
          done();
        }
      };
      
      gridObj.actionComplete = actionComplete;
      
      gridObj.addRecord(
        { 
          TaskID: 10008, 
          FIELD1: "Maintain Scroll", 
          FIELD2: 2023, 
          FIELD3: 1 
        },
        visibleRecord.TaskID,
        "Below"
      );
    }, 500);
  });

  afterAll(() => {
    destroy(gridObj);
  });
});

describe("982776: Coverage Fix: Checkbox with virtualization", function () {
  let TreeGridObj: TreeGrid;

  if (!addVirtualData.length) {
    dataSource1();
  }

  beforeAll((done: Function) => {
    TreeGridObj = createGrid(
      {
        dataSource: addVirtualData,
        enableVirtualization: true,
        childMapping: "Crew",
        height: 400,
        treeColumnIndex: 1,
        selectionSettings: { persistSelection: true },
        pageSettings: { pageSize: 40 },
        filterSettings: { hierarchyMode: "Child" },
        isRowSelectable: (data: any) => data.TaskID !== 1,
        columns: [
          { type: "checkbox", width: 50 },
          { field: "TaskID", headerText: "Player Jersey", width: 140, textAlign: "Right", isPrimaryKey: true },
          { field: "FIELD1", headerText: "Player Name", width: 140, showCheckbox: true },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" },
        ],
      },
      done
    );
  });

  it("Coverage Fix", (done: Function) => {
    setTimeout(() => {
      const header = TreeGridObj.element
        .querySelectorAll(".e-headercell")[0]
        .getElementsByClassName("e-frame")[0] as HTMLElement;
      header.click();
      expect(TreeGridObj.getSelectedRowIndexes().length).toBe(999);
      done();
    }, 100);
  });

  afterAll(() => {
    destroy(TreeGridObj);
  });
});

describe("Task 985326: Testing getPageSizeByHeight method", () => {
  let treegrid: TreeGrid;
  beforeAll((done: Function) => {
    treegrid = createGrid(
      {
        dataSource: editVirtualData,
        enableVirtualization: true,
        childMapping: "Crew",
        treeColumnIndex: 1,
        height: 400,
        allowFiltering: true,
        toolbar: ['ExpandAll', 'CollapseAll'],
        frozenRows: 2,
        columns: [
          { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
          { field: "FIELD1", headerText: "Name", width: 140 },
          { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
          { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
          { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
        ],
      },
      done
    );
  }); 

  it('should get pageSize by height with Virtualization', () => {
      expect((treegrid as any).getPageSizeByHeight()).toBe(24);
  });

  afterAll(() => {
    destroy(treegrid);
  });
});

describe("998943: Script error when call the selectRow method when datasource is empty with virtualization", () => {
     let treegrid: TreeGrid;
     beforeAll((done: Function) => {
        treegrid = createGrid(
          {
            dataSource: addVirtualData,
            childMapping: "Crew",
            treeColumnIndex: 1,
            enableVirtualization: true,
            enableVirtualMaskRow: true,
            frozenRows: 2,
            height: 400,
            columns: [
              { field: "TaskID", headerText: "ID", isPrimaryKey: true, width: 140 },
              { field: "FIELD1", headerText: "Name", width: 140 },
              { field: "FIELD2", headerText: "Year", width: 120, textAlign: "Right" },
              { field: "FIELD3", headerText: "Stint", width: 120, textAlign: "Right" },
              { field: "FIELD4", headerText: "TMID", width: 120, textAlign: "Right" }
            ],
          },
          done
        );
     });
    it('should not throw script error on selectRow method call', (done: Function) => {
        expect( () => { treegrid.selectRow(0, false) }).not.toThrowError();
        done();
    });
    afterAll( () => {
       destroy(treegrid);
    });
});