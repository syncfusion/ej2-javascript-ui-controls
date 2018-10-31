import { TreeView } from '../../../src/treeview/treeview';

let hierarchicalData = [];
let parent = 10000;
for (let m = 1; m <= parent; m++) {
    hierarchicalData.push({ id: "a" + m, name: "Node" + m, child: [] });
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