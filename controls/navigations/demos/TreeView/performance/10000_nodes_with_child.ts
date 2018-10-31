import { TreeView } from '../../../src/treeview/treeview';

let hierarchicalData = [];
let parent = 10, child = 10, child1 = 9, child2 = 10;
for (let m = 1; m <= parent; m++) {
    let childArray1 = [];
    for (let n = 1; n <= child; n++) {
        let childArray2 = [];
        for (let o = 1; o <= child1; o++) {
            let childArray3 = [];
            for (let p = 1; p <= child2; p++) {
                childArray3.push({ id: "d" + m + n + o + p, name: "Node" + m + n + o + p });
            }
            childArray2.push({ id: "c" + m + n + o, name: "Node" + m + n + o, child: childArray3, expanded: true });
        }
        childArray1.push({ id: "b" + m + n, name: "Node" + m + n, child: childArray2, expanded: true });
    }
    hierarchicalData.push({ id: "a" + m, name: "Node" + m, child: childArray1, expanded: true });
}
let start: number = Math.floor(Date.now() / 1);
let ejTree: TreeView = new TreeView({
    fields: { dataSource: hierarchicalData, id: "id", text: "name", child: "child", },
    dataBound: ()=> {
        let time: number = Math.floor(Date.now() / 1) - start;
        let nodeLen = document.getElementById('ejTree').querySelectorAll('li').length;
        document.getElementById('ej').innerHTML = "Running Time : " + time + "ms, nodes :" + nodeLen;
    },
});
ejTree.appendTo('#ejTree');