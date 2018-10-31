/**
 * ListView spec document
 */
import { createElement, isVisible, extend } from '@syncfusion/ej2-base';
import { ListView , Virtualization, SelectEventArgs, SelectedItem} from '../../src/list-view/index';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import '../../node_modules/es6-promise/dist/es6-promise';
ListView.Inject(Virtualization);

interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
}

function deepCloning(data: { [key: string]: object }[]) {
    return <{ [key: string]: object }[]>extend([], data, [], true);
}

function setStyle(ele: HTMLElement, height: number) {
    let css: string = `.e-list-item, .e-list-group-item { height: ${height}px;} .e-ul { padding: 0 ; margin: 0}`;
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    ele.appendChild(style);
}

function simulateScrollEvent(target: HTMLElement, newScrollTop: number) {
    target.scrollTop = newScrollTop;
    var e = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    target.dispatchEvent(e);
}


let dataSource: { [key: string]: Object }[] = [
    { id: '01', text: 'text1' },
    { id: '02', text: 'text2' },
    { id: '03', text: 'text3' },
    { id: '04', text: 'text4' },
    { id: '05', text: 'text5' },
]
let dataSourceWithNumberID: { [key: string]: Object }[] = [
    { id: 1, text: 'text1' },
    { id: 2, text: 'text2' },
    { id: 3, text: 'text3' },
    { id: 4, text: 'text4' },
    { id: 5, text: 'text5' },
]
let dataSourceWithStringID: { [key: string]: Object }[] = [
    { id: '1', text: 'text1' },
    { id: '2', text: 'text2' },
    { id: '3', text: 'text3' },
    { id: '4', text: 'text4' },
    { id: '5', text: 'text5' },
]
let NestedData: any = [
    {
        id: '01', text: 'text1', icon: 'iconClass1', category: 'a',
        child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
        { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
        { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
    },
    {
        id: '02', text: 'text2', icon: 'iconClass2', category: 'b',
        child: [{
            id: '02_1', text: 'subText1', icon: 'iconSubClass1', category: 'a',
            child: [{ id: '02_1_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' }]
        },
        { id: '02_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
        { id: '02_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
    },
    {
        id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
    }
];

let nestedListData: any = [
    {
        id: '01', text: 'text1', icon: 'iconClass1', category: 'a',
    },
    {
        id: '02', text: 'text2', icon: 'iconClass2', category: 'b',
        child: [{
            id: '02_1', text: 'subText1', icon: 'iconSubClass1', category: 'a',
            child: [{ id: '02_1_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' }]
        },
        { id: '02_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
        { id: '02_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
    },
    {
        id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
    }
]

let dataSourceGroup: { [key: string]: Object }[] = [
    {
        'text': 'Audi A4',
        'id': '9bdb',
        'category': 'Audi'
    },
    {
        'text': 'BMW A5',
        'id': '4589',
        'category': 'BMW'
    },
    {
        'text': 'Audi A6',
        'id': 'e807',
        'category': 'Audi'
    }
];

let dataSourceWithComplexData: { [key: string]: Object }[] = [
    {
        list: { id: '01', text: 'text1', iconCss: 'iconClass1' },
        child: [{ list: { id: '01_1', text: 'subText1', iconCss: 'iconSubClass1' } },
        { list: { id: '01_2', text: 'subText2', iconCss: 'iconSubClass2' } },
        { list: { id: '01_3', text: 'subText3', iconCss: 'iconSubClass3' } }]
    },
    {
        list: { id: '03', text: 'text3', iconCss: 'iconClass3', enable: false },
        child: [{ list: { id: '01_1', text: 'subText1', iconCss: 'iconSubClass1' } },
        { list: { id: '01_2', text: 'subText2', iconCss: 'iconSubClass2' } },
        { list: { id: '01_3', text: 'subText3', iconCss: 'iconSubClass3' } }]
    },
    {
        list: { id: '02', text: 'text2', iconCss: undefined, enable: undefined },
        child: [{ list: { id: '02_1', text: 'subItemText1', iconCss: 'iconSubClass1' } },
        { list: { id: '02_2', text: 'subItemText2', iconCss: 'iconSubClass2' } },
        { list: { id: '02_3', text: 'subItemText3', iconCss: 'iconSubClass3' } }]
    }
];

let dataDefaultMapping: { [key: string]: Object }[] = [
    { id: '01', text: 'text1', list: { tooltip: "text1", htmlAttributes: { role: 'li', class: 'base' }, urlAttributes: { role: 'li', class: 'base' } } },
    { id: '03', text: 'text2', list: { tooltip: "text2", htmlAttributes: { role: 'li' }, urlAttributes: { role: 'li' }, link: 'https://www.google.com' } },
    { id: '02', text: 'text3', list: { visibility: false, tooltip: "text3", htmlAttributes: { role: 'li' }, urlAttributes: { role: 'li' } } },
];

let dataSourceComplexGroup: { [key: string]: Object }[] = [
    {
        list: { 'text': 'Audi A4', 'id': '9bdb', 'category': 'Audi' }
    },
    {
        list: { 'text': 'BMW A5', 'id': '4589', 'category': 'BMW' }
    },
    {
        list: { 'text': 'Audi A6', 'id': 'e807', 'category': 'Audi' }
    }
];

let dataSourceCheckbox: { [key: string]: Object }[] = [
    {
        'text': 'Audi A4', 'id': '9bdb', 'category': 'Audi', 'checked': true
    },
    {
        'text': 'BMW A5', 'id': '4589', 'category': 'BMW'
    },
    {
        'text': 'Audi A6', 'id': 'e807', 'category': 'Audi', 'checked': true
    }
];

let dataSourceGroupCheckbox: { [key: string]: Object }[] = [
    {
        'text': 'Audi A4',
        'id': '9bdb',
        'category': 'Audi'
    },
    {
        'text': 'Audi A5',
        'id': '8bdb',
        'category': 'Audi'
    },
    {
        'text': 'Audi A6',
        'id': '7bdb',
        'category': 'Audi'
    },
    {
        'text': 'BMW A5',
        'id': '4589',
        'category': 'BMW'
    },
    {
        'text': 'Audi A6',
        'id': 'e807',
        'category': 'Audi'
    },
    {
        'text': 'BMW A6',
        'id': '5589',
        'category': 'BMW'
    },
    {
        'text': 'BMW A7',
        'id': '6589',
        'category': 'BMW'
    },
];


describe('ListView', () => {

    describe('Complex data binding', () => {

        describe('fields\'s id, text, iconCss, enabled', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView' });
            let arrayData: string[] = ['text1', 'text2', 'text3'];
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new ListView({
                    dataSource: dataSourceWithComplexData, showIcon: true, fields:
                        { id: 'list.id', text: 'list.text', iconCss: 'list.iconCss', enabled: 'list.enable' }
                });
                treeObj.appendTo(ele);
            });
            it('', () => {
                let li: HTMLElement = ele.querySelector('li');
                expect(ele.querySelectorAll('li')[1].classList.contains('e-disabled')).toBe(true);
                li.click();
                let data: any = {
                    item: li,
                    text: 'text1',
                    data: dataSourceWithComplexData[0]
                };
                expect(treeObj.getSelectedItems()).toEqual(data);
                expect((<HTMLElement>li.firstChild.firstChild).classList.contains('iconClass1')).toBe(true);
                expect(li.innerText.trim()).toBe('text1');

            });
            afterAll(() => {
                ele.remove();
            });
        });


        describe('fields\'s groupBy, sortBy', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView1' });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new ListView({ dataSource: dataSourceComplexGroup, sortOrder: 'Descending', showIcon: true, fields: { groupBy: 'list.category', sortBy: 'list.id' } });
                treeObj.appendTo(ele);
            });
            it('', () => {
                let li: HTMLElement = ele.querySelector('li');
                expect(li.innerText.trim()).toBe('BMW');

            });
            afterAll(() => {
                ele.remove();
            });
        });

        describe('Destroy Testing', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView1' });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new ListView({ dataSource: dataSourceComplexGroup, sortOrder: 'Descending', showIcon: true, fields: { groupBy: 'list.category', sortBy: 'list.id' } });
                treeObj.appendTo(ele);
            });
            it('Call Destroy method', () => {
                treeObj.destroy();
                treeObj.dataBind();
                expect(ele.classList.contains('e-control')).toBe(false);
                expect(ele.classList.contains('e-listview')).toBe(false);
            });
            afterAll(() => {
                ele.remove();
            });
        });

        describe('fields\'s htmlAttributes, isVisible', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView2' });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new ListView({ dataSource: dataDefaultMapping, fields: { htmlAttributes: 'list.htmlAttributes', tooltip: 'list.tooltip', isVisible: 'list.visibility' }, });
                treeObj.appendTo(ele);
            });
            it('', () => {
                let li: HTMLElement = ele.querySelector('li');
                expect(li.getAttribute('title')).toBe('text1');
                expect(li.classList.contains('base')).toBe(true);
                expect(li.getAttribute('role')).toBe('li');
                expect(ele.querySelectorAll('li')[2].getAttribute('style')).toBe('display: none;');
            });
            afterAll(() => {
                ele.remove();
            });
        });
        describe('field\'s id, number', () => {
            let treeObj: any;
            let Obj: any;
            let ele: HTMLElement = createElement('div', { id: 'ListView1' });
            let el: HTMLElement = createElement('div', { id: 'ListView' });
            beforeAll(() => {
                document.body.appendChild(ele);
                document.body.appendChild(el);
                treeObj = new ListView({ dataSource: dataSourceWithNumberID });
                treeObj.appendTo(ele);
                Obj = new ListView({ dataSource: dataSourceWithStringID });
                Obj.appendTo(el);
            });
            it('', () => {
                let treeObjid = (treeObj.dataSource[0].id).toString();
                let Objid = Obj.dataSource[0].id;
                expect(treeObjid).toBe(Objid);
            });
            afterAll(() => {
                ele.remove();
                el.remove();
            });
        });
    });

    describe('Local Data Binding (Array of JSON)', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData });
            treeObj.appendTo(ele);
        });

        it('default initialize', () => {
            expect(ele.childNodes.length).not.toBe(0);
        });

        it('class name', () => {
            expect(ele.classList.contains('e-listview')).toBe(true);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('Local Data Binding (Array of String)', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        let arrayData: string[] = ['text1', 'text2', 'text3'];
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: arrayData });
            treeObj.appendTo(ele);
        });

        it('default initialize', () => {
            expect(ele.childNodes.length).not.toBe(0);
            expect(ele.classList.contains('e-listview')).toBe(true);
            expect(ele.querySelectorAll('.e-list-item').length).toBe(3);
            expect(ele.querySelectorAll('.e-list-parent').length).toBe(1);
        });

        it('getSelectedItems method', () => {
            let li: HTMLElement = ele.querySelector('li');
            li.click();
            let data: any = {
                item: li,
                text: 'text1',
                data: arrayData
            };

            expect(treeObj.getSelectedItems()).toEqual(data);
        });

        it('contentcontainer after and before empty the datasource', (done: Function) => {

            let listele: HTMLElement = createElement('div', { id: 'ListView' });
            let listObj = new ListView({ dataSource: [] });
            listObj.appendTo(listele);
            expect(listele.childNodes.length).toBe(0);
            listObj.dataSource = arrayData;
            setTimeout(() => {
                let contentdiv: HTMLElement = listele.childNodes[0] as HTMLElement;
                expect(contentdiv.classList.contains('e-content')).toBe(true);
                done();
            }, 0);

        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('Local Data Binding (Array of Number)', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        let arrayData: number[] = [1, 2, 3];
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: arrayData });
            treeObj.appendTo(ele);
        });

        it('default initialize', () => {
            expect(ele.childNodes.length).not.toBe(0);
            expect(ele.classList.contains('e-listview')).toBe(true);
            expect(ele.querySelectorAll('.e-list-item').length).toBe(3);
            expect(ele.querySelectorAll('.e-list-parent').length).toBe(1);
        });

        it('getSelectedItems method', () => {
            let li: HTMLElement = ele.querySelector('li');
            treeObj.selectItem(document.getElementsByClassName("e-list-item")[0]);
            let data: any = {
                item: li,
                data: arrayData,
                text: "1",
            };
            expect(treeObj.getSelectedItems()).toEqual(data);
        });

        it('enable the checkbox', () => {
            let li: HTMLElement = ele.querySelector('li');
            treeObj.showCheckBox = true;
            treeObj.dataBind();
            treeObj.selectItem(document.getElementsByClassName("e-list-item")[0]);
            treeObj.dataBind();
            treeObj.removeItem(document.getElementsByClassName("e-list-item")[0]);
            expect(ele.querySelectorAll('.e-checklist').length).toBe(2);
        });

        it('contentcontainer after and before empty the datasource', () => {
            let listele: HTMLElement = createElement('div', { id: 'ListView' });
            let listObj = new ListView({ dataSource: [] });
            listObj.appendTo(listele);
            expect(listele.childNodes.length).toBe(0);
            listObj.dataSource = arrayData;
            listObj.dataBind();
            let contentdiv: HTMLElement = listele.childNodes[0] as HTMLElement;
            expect(contentdiv.classList.contains('e-content')).toBe(true);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('HTMLData Data Binding', () => {

        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        ele.querySelector('ul').innerHTML =
            '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView();
            nTree.appendTo('#newTree');
        });

        it('initialized HTML data', () => {
            expect(ele.querySelectorAll('.e-list-item').length).toBe(7);
            expect((nTree.dataSource as { [key: string]: Object }[]).length).not.toBe(0);
        });

        it('getSubDS', () => {
            expect((<any>nTree).getSubDS()).toBe(nTree.dataSource);
        });

        afterAll(() => {
            ele.remove();
        });
    });
    describe('headerTemplate support with NestedList', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: dataSource, headerTemplate: '<div class="header"> <span> ListView</span> </div>', showHeader: true });
            treeObj.appendTo(ele);
        });
        it('Listview with headerTemplate', () => {
            expect((ele.querySelector(".e-headertemplate-text") as HTMLElement).innerText.trim()).toEqual('ListView');
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('headerTemplate support', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: nestedListData, headerTitle: "ListView", headerTemplate: '<div class="header"> <span>Nested ListView</span> </div>', showHeader: true });
            treeObj.appendTo(ele);
        });

        it('Nested Listview with headerTemplate', () => {
            expect((ele.querySelector('.e-headertemplate-text') as HTMLElement).innerText.trim()).toEqual('Nested ListView');
            treeObj.selectItem({ text: 'text2' });
            expect((ele.querySelector(".e-text") as HTMLElement).innerText).toEqual('text2');
            treeObj.back();
            expect((ele.querySelector(".e-icon-back") as HTMLElement).style.display).toEqual('none');
        });

        afterAll(() => {
            ele.remove();
        });
    });


    describe('HTMLData Without UL and LI', () => {
        let ele: HTMLElement = document.createElement('div');
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView();
            nTree.appendTo('#newTree');
        });
        it('initialized HTML data', () => {
            expect(ele.querySelectorAll('.e-list-item').length).toBe(0);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('Remote Data Binding', () => {
        describe('default query', () => {
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api/Employees',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });

            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
            });

            it('select & getSelected Items method', () => {
                let liItem : HTMLElement = nTree.element.querySelectorAll('.e-list-item')[1] as HTMLElement;
                nTree.selectItem(liItem);
                expect(nTree.getSelectedItems().item).toBe(liItem);
                expect(nTree.getSelectedItems().text).toBe('Fuller');
                expect((nTree.getSelectedItems().data as { [key: string]: number }).EmployeeID).toBe(1002);
                expect((nTree.getSelectedItems().data as { [key: string]: string }).FirstName).toBe('Fuller');
            });

            it('Find Item method', () => {
                let liItem: HTMLElement = nTree.element.querySelectorAll('.e-list-item')[1] as HTMLElement;
                let data: { [key: string]: Object } = { EmployeeID: '1002', FirstName: 'Fuller' };
                let findItemByData: { [key: string]: Object } = <SelectedItem & { [key: string]: Object }>nTree.findItem(data);
                let findItemByLisItem: { [key: string]: Object } = <SelectedItem & { [key: string]: Object }>nTree.findItem(liItem);
                expect(findItemByData.EmployeeID).toBe(1002);
                expect(findItemByData.FirstName).toBe('Fuller');
                expect(findItemByLisItem.EmployeeID).toBe(1002);
                expect(findItemByLisItem.FirstName).toBe('Fuller');
            });

            it('Add & removeItem should not have any effect for remote data', () => {
                let data: { [key: string]: Object } = { EmployeeID: '777', FirstName: 'hitler' };
                let data1: { [key: string]: Object } ={ EmployeeID: '1002', FirstName: 'Fuller' };
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
                nTree.addItem([data]);
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
                nTree.removeItem(data1);
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
            });

            it('check & uncheckItem should not have any effect for remote data', () => {
                let liItem1: HTMLElement = nTree.element.querySelectorAll('.e-list-item')[0] as HTMLElement;
                let liItem2: HTMLElement = nTree.element.querySelectorAll('.e-list-item')[1] as HTMLElement;
                let liItem3: HTMLElement = nTree.element.querySelectorAll('.e-list-item')[2] as HTMLElement;
                nTree.showCheckBox = true;
                nTree.dataBind();
                nTree.uncheckAllItems();
                nTree.selectMultipleItems([liItem1,liItem2,liItem3]);
                expect((nTree.getSelectedItems().item as HTMLElement[]).length).toBe(3);
                expect((nTree.getSelectedItems().item as HTMLElement[])[0]).toBe(liItem1);
                expect((nTree.getSelectedItems().item as HTMLElement[])[1]).toBe(liItem2);
                expect((nTree.getSelectedItems().item as HTMLElement[])[2]).toBe(liItem3);

            });


            afterAll(() => {
                ele.remove();
            });
        });

        describe('custom table name fields', () => {

            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName', tableName: 'Employees' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });
            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(9);
            });

            afterAll(() => {
                ele.remove();
            });
        });

        describe('custom query name fields', () => {

            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll((done: Function) => {
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/api',
                        adaptor: new ODataV4Adaptor
                    }),
                    query: new Query().from('Employees').select(['EmployeeID', 'FirstName']).take(5),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionComplete: () => {
                        done();
                    }
                });
                nTree.appendTo('#newTree');
            });

            it('initialized HTML data', () => {
                expect(ele.querySelectorAll('.e-list-item').length).toBe(5);
            });

            afterAll(() => {
                ele.remove();
            });
        });
    });

    describe('Aria Attributes verification', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: dataSourceGroup, fields: { groupBy: 'category' }
            });
            treeObj.appendTo(ele);
        });

        afterAll(() => {
            ele.remove();
        });

        it('role of the ul element', () => {
            let deepNode = ele.childNodes[0].childNodes[0] as HTMLElement;
            expect(deepNode.getAttribute('role')).toBe('list');
        });

        it('role of the li element', () => {
            let deepNode = ele.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
            expect(deepNode.getAttribute('role')).toBe('listitem');
        });

        it('role of the wrapper element', () => {
            let deepNode = ele.childNodes[0].childNodes[0].childNodes[1].childNodes[0] as HTMLElement;
            expect(deepNode.getAttribute('role')).toBe('presentation');
        });

        it('role of the group element', () => {
            let deepNode = ele.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            expect(deepNode.getAttribute('role')).toBe('group');
        });
    });

    describe('methods', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: NestedData
            });
            treeObj.appendTo(ele);
        });

        it('get module name', () => {
            expect(treeObj.getModuleName()).toBe('listview');
        });

        it('set hover li', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(false);
            treeObj.setHoverLI(li);
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('set hover li without element', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(true);
            treeObj.setHoverLI();
            expect(li.classList.contains('e-hover')).toBe(true);
        });

        it('remove hover', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect(li.classList.contains('e-hover')).toBe(true);
            treeObj.removeHover();
            expect(li.classList.contains('e-hover')).toBe(false);
        });

        it('remove hover when no hovered element', () => {
            let ele: Element = treeObj.element;
            let li: NodeList = ele.querySelectorAll('.e-hover');
            expect(li.length).toBe(0);
            treeObj.removeHover();
            li = ele.querySelectorAll('.e-hover');
            expect(li.length).toBe(0);
        });

        it('remove select', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            treeObj.removeSelect();
            expect(li.classList.contains('e-hover')).toBe(false);
        });

        it('select/unselect item', (done: Function) => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-active')).toBe(false);
            treeObj.actionComplete = () => {
                done();
            }
            treeObj.selectItem(li);
            expect((li as Element).classList.contains('e-active')).toBe(true);
            treeObj.selectItem();
            expect((li as Element).classList.contains('e-active')).toBe(false);
            treeObj.selectItem(li);
        });

        it('set hover li when it already selected', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-hover')).toBe(false);
            treeObj.setHoverLI(li);
            expect((li as Element).classList.contains('e-hover')).toBe(false);
        });

        it('set select li allready selected li', () => {
            let ele: Element = treeObj.element;
            let li: Element = ele.querySelector('li');
            expect((li as Element).classList.contains('e-active')).toBe(true);
            treeObj.setSelectLI(li);
            expect((li as Element).classList.contains('e-active')).toBe(true);
        });

        it('getSelectedItems method', () => {
            let li: Element = ele.querySelector('li');

            let data: any = {
                item: li, text: 'text1', data:
                    {
                        id: '01', text: 'text1', icon: 'iconClass1', category: 'a', child: [
                            { id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
                            { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                            { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
                    }
            };

            expect(treeObj.getSelectedItems()).toEqual(data);
        });

        describe('back', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                mouseEventArgs.target = backButtonEle;
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('mouse click on back button', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });

        it('disableItem method', () => {
            treeObj.disableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
        });

        it('disableItem when allready disabled', () => {
            treeObj.disableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
        });

        it('enableItem method', () => {
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(true);
            treeObj.enableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
        });

        it('enableItem when already enabled method', () => {
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
            treeObj.enableItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].classList.contains('e-disabled')).toBe(false);
        });

        it('hideItem method', () => {
            treeObj.hideItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('none');
        });

        it('showItem method', () => {
            treeObj.showItem({ id: '02' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item')[1].style.display).toBe('');
        });

        it('findItem method by ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '03' })).toEqual(data);
        });

        it('findItem method by Text', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ text: 'text3' })).toEqual(data);
        });

        it('findItem method by Text and ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '03', text: 'text3' })).toEqual(data);
        });

        it('findItem method by list item', () => {
            let data: { [key: string]: Object } = {
                id: '01', text: 'text1', icon: 'iconClass1', category: 'a',
                child: [{ id: '01_1', text: 'subText1', icon: 'iconSubClass1', category: 'a' },
                { id: '01_2', text: 'subText2', icon: 'iconSubClass2', category: 'b' },
                { id: '01_3', text: 'subText3', icon: 'iconSubClass3', category: 'a' }]
            };
            expect(treeObj.findItem(treeObj.curUL.firstElementChild)).toEqual(data);
        });

        it('findItem method by Text and ID', () => {
            let data: any = {
                id: '03', text: 'text3', icon: 'iconClass3', category: 'a'
            };
            expect(treeObj.findItem({ id: '02', text: 'text3' })).toEqual(undefined);
        });

        it('addItem method', () => {
            let newDS: any = [
                { id: '04', text: 'item4' },
                { id: '05', text: 'item5' }
            ];
            treeObj.addItem(newDS);
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(5);
        });

        it('addItem method when no sub child', () => {
            let newDS: any = [
                { id: '04_1', text: 'item4_1' },
                { id: '04_2', text: 'item4_2' }
            ];
            treeObj.addItem(newDS, { id: '04' });
            expect(treeObj.dataSource[3].child.length).toBe(2);
        });

        it('addItem method when no sub child', () => {
            let newDS: any = [
                { id: '04_3', text: 'item4_3' },
                { id: '04_4', text: 'item4_4' }
            ];
            treeObj.addItem(newDS, { id: '04' });
            expect(treeObj.dataSource[3].child.length).toBe(4);
        });

        it('hideItem method when no element has created', () => {
            treeObj.hideItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(false);
        });

        it('showItem method when no element has created', () => {
            treeObj.showItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).isVisible).toBe(undefined);
        });

        it('hideItem method when not found', () => {
            treeObj.hideItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('showItem method when not found', () => {
            treeObj.showItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('disableItem method when no element has created ', () => {
            treeObj.disableItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).enabled).toBe(false);
        });

        it('enableItem method when no element has created', () => {
            treeObj.enableItem({ id: '04_4' });
            expect(treeObj.findItem({ id: '04_4' }).hasOwnProperty('enabled')).toBe(false);
        });

        it('disableItem method when not found', () => {
            treeObj.disableItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('enableItem method when not found', () => {
            treeObj.enableItem({ id: '06' });
            expect(treeObj.findItem({ id: '06' })).toBe(undefined);
        });

        it('select item when no element has created', () => {
            let UL: any = treeObj.curUL;
            treeObj.selectItem({ id: '04_4' });
            expect(UL).toBe(treeObj.curUL);
        });

        it('select item when not found', () => {
            let UL: any = treeObj.curUL;
            treeObj.selectItem({ id: '06' });
            expect(UL).toBe(treeObj.curUL);
        });

        it('removeItem method by ID', () => {
            treeObj.removeItem({ id: '04' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(4);
        });

        it('removeItem method by Text', () => {
            treeObj.removeItem({ text: 'item5' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('removeItem method with empty Object', () => {
            treeObj.removeItem({ id: '00' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('selectitem without id field', () => {
            treeObj.dataSource = [{ 'text': 'Text1', 'id': '9bdb' }, { 'text': 'Text2' }, { 'text': 'Text3', 'id': 'e807' }];
            treeObj.dataBind();
            treeObj.selectItem({ text: 'Text2' });
            expect(treeObj.getSelectedItems().text).toEqual('Text2');
        });

        it('selectitem(Grouping) without id field', () => {
            treeObj.dataSource = [{ 'text': 'Audi A4', 'category': 'Audi' }, { 'text': 'Audi A5', 'id': '4589', 'category': 'Audi' }]
            treeObj.dataBind();
            treeObj.selectItem({ text: 'Audi A4' });
            expect(treeObj.getSelectedItems().text).toEqual('Audi A4');
        });

        it('selectitem(Nested) without id field', () => {
            treeObj.dataSource = [{ text: 'Music', icon: 'folder', child: [{ text: 'Gouttes.mp3', icon: 'file' }] },
            {
                text: 'Videos', icon: 'folder', child: [{ id: '02-01', text: 'Naturals.mp4', icon: 'file' },
                { id: '02-02', text: 'Wild.mpeg', icon: 'file' }]
            }];
            treeObj.dataBind();
            treeObj.selectItem({ text: 'Music' });
            expect(treeObj.getSelectedItems().text).toEqual('Music');
        });

        it('destroy method', () => {
            treeObj.destroy();
            expect(ele.className).toBe('');

        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('Checkbox Test Cases', () => {
        let ele: HTMLElement;
        let listObj: ListView;
        let dS: any;

        beforeEach(() => {
            ele = document.createElement('div');
            ele.id = 'listView';
            document.body.appendChild(ele);
        })

        it('checkbox enabled on string array datasource', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            expect(listItem.firstElementChild.firstElementChild.classList.contains('e-checkbox-wrapper')).toBe(true);
        });

        it('checkbox enabled on JSON datasource', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            expect(listItem.firstElementChild.firstElementChild.classList.contains('e-checkbox-wrapper')).toBe(true);
        });

        it('Checkbox Aria-attribute', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            expect(listItem.firstElementChild.firstElementChild.getAttribute('aria-checked')).toBe('false');
        });

        it('Checking the checkbox on an element', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: false });
            listObj.appendTo('#listView');
            listObj.showCheckBox = true;
            listObj.dataBind();
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            listItem.click();
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            listObj.showCheckBox = false;
            listObj.dataBind();
        });

        it('Checking the checkbox and unchecking an element', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            listItem.click();
            listItem.click();
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });

        it('Checking the checkbox with dataSource field option', () => {
            listObj = new ListView({ dataSource: dataSourceCheckbox, showCheckBox: true, fields: { isChecked: 'checked' }, });
            listObj.appendTo('#listView');
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
        });

        it('Checking multiple LI elements', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem = ele.getElementsByClassName('e-list-item');
            (listItem[0] as HTMLElement).click();
            (listItem[1] as HTMLElement).click();
            expect(listItem[0].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(listItem[1].querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect(listItem[2].querySelector('.e-frame').classList.contains('e-check')).toBe(false);
        });

        it('Check item using select method', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement[] | HTMLElement = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-list-item');
            listObj.selectItem(listItem[0]);
            let selectedListItem = (listObj.getSelectedItems().item as Element[]);
            listItem = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-active');
            expect(selectedListItem[0]).toBe(listItem[0]);
            expect(selectedListItem[1]).toBe(listItem[1]);
            expect(selectedListItem.length).toBe(listItem.length);
        });

        it('Check multiple item using selectMultipleItem method', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement[] | HTMLElement = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-list-item');
            listObj.selectMultipleItems([listItem[0], listItem[1]]);
            let selectedListItem = (listObj.getSelectedItems().item as HTMLElement[]);
            listItem = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-active');
            expect(listItem.length).toBe(selectedListItem.length);
            expect(listItem[0]).toBe(selectedListItem[0]);
        });

        it('Check multiple item using selectMultipleItem method', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement[] | HTMLElement = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-list-item');
            listObj.selectMultipleItems([listItem[0], listItem[1]]);
            let selectedListItem = (listObj.getSelectedItems().item as HTMLElement[]);
            listItem = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-active');
            expect(listItem.length).toBe(selectedListItem.length);
            expect(listItem[0]).toBe(selectedListItem[0]);
            expect(listItem[1]).toBe(selectedListItem[1]);
        });

        it('Check multiple item using selectMultipleItem method for array of string dataSource', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo('#listView');
            let listItem: HTMLElement[] | HTMLElement = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-list-item');
            listObj.selectMultipleItems([listItem[0], listItem[1]]);
            let selectedListItem = (listObj.getSelectedItems().item as HTMLElement[]);
            listItem = <NodeListOf<HTMLElement> & HTMLElement[]>ele.getElementsByClassName('e-active');
            expect(listItem.length).toBe(selectedListItem.length);
            expect(listItem[0]).toBe(selectedListItem[0]);
            expect(listItem[1]).toBe(selectedListItem[1]);
        });

        it('enabling checkbox in nested list source', () => {
            listObj = new ListView({ dataSource: nestedListData, showCheckBox: true, fields: { tooltip: 'text' } });
            listObj.appendTo('#listView');
            expect(document.querySelectorAll('.e-checkbox-wrapper').length).toBe(3);
        });

        it('Checking getSelectedItems method without selecting any item', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo('#listView');
            let value = listObj.getSelectedItems();
            expect((value.item as HTMLElement[]).length).toBe(0);
        });

        it('Checkbox on left side', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left' });
            listObj.appendTo('#listView');
            expect(ele.querySelector('.e-text-content').firstElementChild.classList.contains('e-checkbox-left')).toBe(true);
        });

        it('Checkbox on right side', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Right' });
            listObj.appendTo('#listView');
            expect(ele.querySelector('.e-text-content').lastElementChild.classList.contains('e-checkbox-right')).toBe(true);
        });

        it('Checkbox on right side from onPropertyChange', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left' });
            listObj.appendTo('#listView');
            listObj.checkBoxPosition = 'Right';
            listObj.dataBind();
            expect(ele.querySelector('.e-text-content').lastElementChild.classList.contains('e-checkbox-right')).toBe(true);
        });

        it('Checkbox on right side from onPropertyChange', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left' });
            listObj.appendTo('#listView');
            listObj.checkBoxPosition = 'Right';
            listObj.dataBind();
            expect(ele.querySelector('.e-text-content').lastElementChild.classList.contains('e-checkbox-right')).toBe(true);
        });

        it('Check all items on string array datasource', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            expect((listItem.querySelector('.e-frame').classList.contains('e-check'))).toBe(true);
            expect((listObj.dataSource as { [key: string]: Object; }[]).length).toEqual(item);
        });
        it('Check all items on JSON datasource', () => {
            listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect((listObj.dataSource as { [key: string]: Object; }[]).length).toEqual(item);
        });
        it('Check all items on right side from onPropertyChange', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true, checkBoxPosition: 'Right' });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect((listObj.dataSource as { [key: string]: Object; }[]).length).toEqual(item);
        });
        it('Check all items using checkAllItem method with dataSource field option', () => {
            listObj = new ListView({ dataSource: dataSourceCheckbox, showCheckBox: true, fields: { isChecked: 'checked' }, });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(listItem.querySelector('.e-frame').classList.contains('e-check')).toBe(true);
            expect((listObj.dataSource as { [key: string]: Object; }[]).length).toEqual(item);
        });
        it('Using checkAllItem method in nested list source', () => {
            listObj = new ListView({ dataSource: nestedListData, showCheckBox: true, fields: { tooltip: 'text' } });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            expect(document.querySelectorAll('.e-checkbox-wrapper').length).toBe(3);
        });

        it('Uncheck all items on string array datasource', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            listObj.uncheckAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[0] as HTMLElement;
            expect(!(listItem.querySelector('.e-frame').classList.contains('e-check'))).toBe(true);
            expect(document.querySelectorAll('.e-check').length).toEqual(item);
        });
        it('Uncheck all items on JSON datasource', () => {
            listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            listObj.uncheckAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(!(listItem.querySelector('.e-frame').classList.contains('e-check'))).toBe(true);
            expect(document.querySelectorAll('.e-check').length).toEqual(item);
        });
        it('Uncheck all items on right side from onPropertyChange', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true, checkBoxPosition: 'Right' });
            listObj.appendTo('#listView');
            listObj.checkAllItems();
            listObj.uncheckAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(!(listItem.querySelector('.e-frame').classList.contains('e-check'))).toBe(true);
            expect(document.querySelectorAll('.e-check').length).toEqual(item);
        });
        it('Uncheck all items using checkAllItem method with dataSource field option', () => {
            listObj = new ListView({ dataSource: dataSourceCheckbox, showCheckBox: true, fields: { isChecked: 'checked' }, });
            listObj.appendTo('#listView');
            listObj.uncheckAllItems();
            let item = (listObj.getSelectedItems().item as HTMLElement[]).length;
            let listItem: HTMLElement = ele.getElementsByClassName('e-list-item')[1] as HTMLElement;
            expect(!(listItem.querySelector('.e-frame').classList.contains('e-check'))).toBe(true);
            expect(document.querySelectorAll('.e-check').length).toEqual(item);
        });

        it('Select event trigger on checkbox interaction', () => {
            let eventArgs: any;
            listObj = new ListView({ dataSource: dataSourceCheckbox, showCheckBox: true, fields: { isChecked: 'checked' },
            select: (args: SelectEventArgs) => {
                eventArgs = args;
            } });
            listObj.appendTo('#listView');
            ((listObj as any).liCollection[1].querySelector('.e-frame.e-icons') as HTMLElement).click();
            expect(eventArgs.isChecked).toBe(true);
            ((listObj as any).liCollection[1].querySelector('.e-frame.e-icons') as HTMLElement).click();
            expect(eventArgs.isChecked).toBe(false);
        });

        it('Checkbox click event data test', () => {
            let value: boolean;
            let listObj: any = new ListView({
                dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left',
                select: (e: any) => { value = e.isChecked }
            });
            listObj.appendTo('#listView');
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            mouseEventArgs.target = listObj.liCollection[2];
            listObj.clickHandler(mouseEventArgs);
            expect(value).toBe(true);
            listObj.clickHandler(mouseEventArgs);
            expect(value).toBe(false);
        });

        it('checkItem public method testing 1', () => {
            let listObj: any = new ListView({
                dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.checkItem((listObj.liCollection[0]));
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(true);
            expect(listObj.liCollection[0].querySelector('.e-frame.e-icons').classList.contains('e-check')).toBe(true);
            listObj.checkItem((listObj.liCollection[100]));
        });

        it('checkItem public method testing 2', () => {
            let listObj: any = new ListView({
                dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.checkItem(listObj.liCollection[0]);
            listObj.uncheckItem(listObj.liCollection[0]);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(false);
            expect(listObj.liCollection[0].querySelector('.e-frame.e-icons').classList.contains('e-check')).toBe(false);
            listObj.uncheckItem(listObj.liCollection[100]);
        });

        it('checkItem public method testing 3', () => {
            let listObj: any = new ListView({
                dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: false, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.checkItem((listObj.liCollection[0]));
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(false);
        });

        it('checkItem public method testing 4', () => {
            let listObj: any = new ListView({
                dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: false, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.checkItem(listObj.liCollection[0]);
            listObj.uncheckItem(listObj.liCollection[0]);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(false);
        });

        it('checkItem public method testing 5', () => {
            let listObj: any = new ListView({
                dataSource: NestedData, showCheckBox: true, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.checkItem({ id: '01' });
            listObj.uncheckItem({ id: '01' });
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(false);
        });

        it('Onproperty change in nested list', () => {
            let listObj: any = new ListView({
                dataSource: NestedData, showCheckBox: true, checkBoxPosition: 'Left',
            });
            listObj.appendTo('#listView');
            listObj.showCheckBox = false;
            listObj.dataBind();
            listObj.showCheckBox = true;
            listObj.dataBind();
            listObj.selectItem(listObj.liCollection[0]);
            listObj.checkItem(listObj.liCollection[0]);
            listObj.showCheckBox = false;
            listObj.dataBind();
            expect(listObj.curUL.querySelectorAll('.e-active')[0]).toBe(listObj.liCollection[0]);
            listObj.showCheckBox = true;
            listObj.dataBind();
            listObj.checkItem(listObj.liCollection[1]);
            expect(listObj.curUL.querySelectorAll('.e-active')[1]).toBe(listObj.liCollection[1]);
            listObj.showCheckBox = false;
            listObj.dataBind();
            expect(listObj.curUL.querySelectorAll('.e-active')[0]).toBe(listObj.liCollection[1]);
            listObj.toggleAllCheckBase(false);
        });

        afterEach(() => {
            ele.remove();
        })
    });

    describe('Nested List Checkbox Test Cases', () => {
        let ele: HTMLElement;
        let listObj: any;
        let dS: any;

        beforeEach(() => {
            ele = document.createElement('div');
            ele.id = 'listView';
            document.body.appendChild(ele);
        })

        it('Checkbox enabled', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true });
            listObj.appendTo('#listView');
            expect(ele.querySelector('.e-list-item').querySelector('.e-checkbox-wrapper').classList
                .contains('e-listview-checkbox')).toBe(true);
        });

        it('Navigation to child', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true });
            listObj.appendTo('#listView');
            listObj.selectItem(listObj.liCollection[0]);
            listObj.selectItem(listObj.liCollection[0]);
            expect(listObj.getSelectedItems().text[0]).toBe('subText1');
        });

        it('Navigation to parent from child', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.selectItem(listObj.liCollection[0]);
            listObj.selectItem(listObj.liCollection[0]);
            let back: HTMLElement = <HTMLElement>document.getElementsByClassName('e-but-back')[0]
            back.click();
            expect(listObj.getSelectedItems().text[0]).toBe('text1');
        });

        it('getSelectedItems method testing', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.selectItem(listObj.liCollection[0]);
            listObj.selectItem(listObj.liCollection[0]);
            expect(listObj.getSelectedItems().text[0]).toBe('subText1');
            expect(listObj.getSelectedItems().data[0].parentId[0]).toBe('01');
        });

        it('Checking and unchecking checkbox', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            let checkbox: HTMLElement = listObj.liCollection[0].querySelector('span.e-frame.e-icons');
            checkbox.click();
            expect(listObj.getSelectedItems().text[0]).toBe('text1');
            checkbox.click();
            expect(listObj.getSelectedItems().text[0]).toBe(undefined);
        });

        it('Entering child element and clicking the child item and navigating back', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            let item: HTMLElement = listObj.liCollection[0];
            item.click();
            item = listObj.liCollection[0];
            item.click();
            expect(listObj.getSelectedItems().text[0]).toBe('subText1');
            item = listObj.element.querySelector('.e-icon-back');
            item.click();
            expect(listObj.getSelectedItems().text[0]).toBe(undefined);
            listObj.showCheckBox = false;
            listObj.dataBind();
            item = listObj.liCollection[0];
            item.click();
        });

        it('Entering child using Enter Key', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.liCollection[0].classList.add('e-focused');
            let keyEventArgs: any = {
                preventDefault: (): void => { },
                keyCode: 13
            };
            listObj.keyActionHandler(keyEventArgs);
            let child = listObj.element.querySelector('[pid="01"]');
            expect(listObj.curUL).toBe(child);
        });

        it('Entering child using Enter Key after checking the element already', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.liCollection[0].classList.add('e-focused');
            let keyEventArgs: any = {
                preventDefault: (): void => { },
                keyCode: 32
            };
            listObj.keyActionHandler(keyEventArgs);
            listObj.liCollection[0].classList.add('e-focused');
            keyEventArgs = {
                preventDefault: (): void => { },
                keyCode: 13
            };
            listObj.keyActionHandler(keyEventArgs);
            let child = listObj.element.querySelector('[pid="01"]');
            expect(listObj.curUL).toBe(child);
        });

        it('Selecting element using Space Key', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.liCollection[0].classList.add('e-focused');
            let keyEventArgs: any = {
                preventDefault: (): void => { },
                keyCode: 32
            };
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(true);
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(false);
        });

        it('Going back using Backspace from child Key after selecting', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.liCollection[0].classList.add('e-focused');
            let keyEventArgs: any = {
                preventDefault: (): void => { },
                keyCode: 13
            };
            listObj.keyActionHandler(keyEventArgs);
            listObj.liCollection[0].classList.add('e-focused');
            keyEventArgs = {
                preventDefault: (): void => { },
                keyCode: 32
            };
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.getSelectedItems().text[0]).toBe('subText1');
            keyEventArgs = {
                preventDefault: (): void => { },
                keyCode: 8
            };
            listObj.keyActionHandler(keyEventArgs);
            expect(listObj.getSelectedItems().text[0]).toBe(undefined);
            listObj.keyActionHandler(keyEventArgs);
        });

        it('Nested list Swipe action to back', () => {
            listObj = new ListView({ dataSource: NestedData, showCheckBox: true, showHeader: true });
            listObj.appendTo('#listView');
            listObj.liCollection[0].classList.add('e-focused');
            let keyEventArgs: any = {
                preventDefault: (): void => { },
                keyCode: 13
            };
            listObj.keyActionHandler(keyEventArgs);
            let swipeArgs = { swipeDirection: 'Right' };
            listObj.swipeActionHandler(swipeArgs);
            swipeArgs = { swipeDirection: 'Left' };
            listObj.swipeActionHandler(swipeArgs);

            listObj.removeFocus();
            listObj.focusout();
            listObj.showCheckBox = 'false';
            listObj.dataBind();
            listObj.setCheckboxLI(undefined, undefined);
            listObj.selectItem(undefined);
            listObj.selectMultipleItems(undefined);
            listObj.selectMultipleItems([undefined]);
            listObj.isNestedList = false;
            listObj.getParentId();
            listObj.removeMultipleItems([]);
            listObj.onPropertyChanged({ 'htmlAttributes1': null }, { 'htmlAttributes2': null });
        })

        afterEach(() => {
            ele.remove();
        })
    });

    describe('remove method test cases', () => {
        let listObj: any;
        let ele: HTMLElement;

        beforeEach(() => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
        });

        it('remove item with grouping option', () => {
            listObj = new ListView({ dataSource: dataDefaultMapping, showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').getElementsByClassName('e-list-item');
            listObj.selectItem(elements[2]);
            listObj.removeMultipleItems([elements[0], elements[1]]);
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(1);
        });

        it('removeMultipleItems in string of array inputs', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').getElementsByClassName('e-list-item');
            listObj.removeMultipleItems([elements[0], elements[1]]);
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(2);
        });

        it('remove item in string of array inputs', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').getElementsByClassName('e-list-item');
            listObj.removeItem(elements[1]);
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('remove item in string of array inputs as by its data', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo(ele);
            listObj.removeItem('item1');
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(3);
        });

        it('remove multiple item in string of array inputs as by its data', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'], showCheckBox: true });
            listObj.appendTo(ele);
            listObj.removeMultipleItems(['item1', 'item2']);
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(2);
        });

        it('remove multiple item in string of array inputs with previously selected item', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'] });
            listObj.appendTo(ele);
            listObj.selectItem(listObj.liCollection[2]);
            listObj.removeMultipleItems([listObj.liCollection[0], listObj.liCollection[1]]);
            expect(listObj.getSelectedItems().text).toBe('item3');
        });

        it('remove item in string of array inputs with previously selected item', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4'] });
            listObj.appendTo(ele);
            listObj.selectItem(listObj.liCollection[2]);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.getSelectedItems().text).toBe('item3');
        });

        it('remove item in string of array inputs with mutiselect items', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4', 'item5'], showCheckBox: true });
            listObj.appendTo(ele);
            listObj.selectMultipleItems([listObj.liCollection[0], listObj.liCollection[1]]);
            listObj.removeItem(listObj.liCollection[2])
            expect((listObj.getSelectedItems().text as string[])[0]).toBe('item1');
            expect((listObj.getSelectedItems().text as string[])[1]).toBe('item2');
        });

        it('removeMultiple item in string of array inputs with mutiselect items', () => {
            listObj = new ListView({ dataSource: ['item1', 'item2', 'item3', 'item4', 'item5'], showCheckBox: true });
            listObj.appendTo(ele);
            listObj.selectMultipleItems([listObj.liCollection[0], listObj.liCollection[1]]);
            listObj.removeMultipleItems([listObj.liCollection[2], listObj.liCollection[3]]);
            expect((listObj.getSelectedItems().text as string[])[0]).toBe('item1');
            expect((listObj.getSelectedItems().text as string[])[1]).toBe('item2');
        });

        it('remove item in last grouped item ', () => {
            listObj = new ListView({ dataSource: deepCloning(dataSourceGroupCheckbox), fields: { groupBy: 'category' } });
            listObj.appendTo(ele);
            expect(listObj.curViewDS.length).toBe(9);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.curViewDS.length).toBe(8);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.curViewDS.length).toBe(7);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.curViewDS.length).toBe(6);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.curViewDS.length).toBe(4);
        });

        it('remove item in group enabled list', () => {
            listObj = new ListView({ dataSource: dataSourceGroupCheckbox, fields: { groupBy: 'category' } });
            listObj.appendTo(ele);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.liCollection.length).toBe(6);
        });


        it('remove item in group enabled list with checkbox enabled', () => {
            listObj = new ListView({ dataSource: dataSourceGroupCheckbox, fields: { groupBy: 'category' }, showCheckBox: true });
            listObj.appendTo(ele);
            listObj.removeItem(listObj.liCollection[0]);
            expect(listObj.liCollection.length).toBe(5);
        });

        it('remove item in group enabled list with already selected item', () => {
            listObj = new ListView({ dataSource: dataSourceGroupCheckbox, fields: { groupBy: 'category' } });
            listObj.appendTo(ele);
            listObj.selectItem(listObj.liCollection[0]);
            listObj.removeItem(listObj.liCollection[2]);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(true);
        });

        it('remove item in group enabled list with already checked item', () => {
            listObj = new ListView({ dataSource: dataSourceGroupCheckbox, fields: { groupBy: 'category' }, showCheckBox: true });
            listObj.appendTo(ele);
            listObj.selectItem(listObj.liCollection[0]);
            listObj.removeItem(listObj.liCollection[2]);
            expect(listObj.liCollection[0].classList.contains('e-active')).toBe(true);
        });

        it('remove items in group enabled list with removeMultipleItem', () => {
            listObj = new ListView({ dataSource: dataSourceGroupCheckbox, fields: { groupBy: 'category' }, showCheckBox: true });
            listObj.appendTo(ele);
            listObj.removeMultipleItems([listObj.liCollection[0], listObj.liCollection[1]]);
            expect(listObj.liCollection.length).toBe(1);
        });

        afterEach(() => {
            ele.remove();
        });
    });

    describe('Add method test cases', () => {
        let treeObj: any;
        let ele: HTMLElement;

        beforeEach(() => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
        });

        it('addItem method with Flat list', () => {
            let data = dataSource.slice();
            treeObj = new ListView({ dataSource: data });
            treeObj.appendTo(ele);
            let newDS: any = [
                { id: '06', text: 'item6' },
                { id: '07', text: 'item7' }
            ];
            treeObj.addItem(newDS);
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(7);
        });

        it('addItem method with Emplty list', () => {
            treeObj = new ListView({ dataSource: [] });
            treeObj.appendTo(ele);
            let newDS: any = [
                { id: '01', text: 'item1' },
                { id: '02', text: 'item2' }
            ];
            treeObj.addItem(newDS);
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(2);
        })

        it('addItem method with invalid format', () => {
            let data = dataSource.slice();
            treeObj = new ListView({ dataSource: data });
            treeObj.appendTo(ele);
            treeObj.addItem({ id: '08', text: 'item8' });
            expect(treeObj.curUL.querySelectorAll('.e-list-item').length).toBe(5);
        });

        it('addItem method with grouping', () => {
            let data = dataSourceGroup.slice();
            treeObj = new ListView({ dataSource: data, fields: { groupBy: 'category' } });
            treeObj.appendTo(ele);
            treeObj.addItem([{ id: 'gc4f', text: 'Bugatti 16', category: 'Bugatti' }]);
            expect(treeObj.curUL.querySelectorAll('.e-list-group-item').length).toBe(3);
        });

        afterEach(() => {
            ele.remove();
        })
    });

    describe('select method test cases', () => {
        let listObj: any;
        let ele: HTMLElement;

        beforeEach(() => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
        });

        it('Selecting an item from selectItem Method', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').querySelectorAll('.e-list-item');
            listObj.selectItem(elements[2]);
            expect(listObj.element.querySelectorAll('.e-active')[0].innerText).toBe((elements[2] as HTMLElement).innerText);
        });

        it('Selecting multiple items using selectMultipleItems', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').querySelectorAll('.e-list-item');
            listObj.selectMultipleItems([elements[0], elements[1]]);
            expect(listObj.element.querySelectorAll('.e-active')[0].innerText.trim()).toBe((elements[0] as HTMLElement).innerText.trim());
            expect(listObj.element.querySelectorAll('.e-active')[1].innerText.trim()).toBe((elements[1] as HTMLElement).innerText.trim());
        });

        it('Selecting an item from selectItem Method which was already selected', () => {
            listObj = new ListView({ dataSource: dataSourceGroup, showCheckBox: true });
            listObj.appendTo(ele);
            let elements = document.getElementById('ListView').querySelectorAll('.e-list-item');
            listObj.selectItem(elements[2]);
            listObj.selectItem(elements[2]);
            expect(listObj.element.querySelector('.e-active')).toBe(null);
        });

        afterEach(() => {
            ele.remove();
        });
    });

    describe('sub list navigation', () => {

        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({
                dataSource: NestedData,
                showHeader: true
            });
            treeObj.appendTo(ele);
        });

        describe('first level navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '02' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });
        describe('back using swipe left works properly', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                let startMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let moveMouseEventArs: CommonArgs = {
                    clientX: 250, clientY: 200, target: treeObj.element, type: 'touchmove',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let endMouseEventArs: CommonArgs = {
                    clientX: 300, clientY: 200, target: treeObj.element, type: 'touchend',
                    preventDefault: (): void => { /** Do Nothing */ }
                };
                curUL = treeObj.curUL;
                //Actions
                treeObj.touchModule.startEvent(startMouseEventArs);
                treeObj.touchModule.moveEvent(moveMouseEventArs);
                treeObj.touchModule.endEvent(endMouseEventArs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
            afterAll(() => {
                treeObj.selectItem({ id: '02' });
            });
        });
        describe('back using swipe for invalid direction not navigate to parent', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-back' });
                let startMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 200, target: treeObj.element, type: 'touchstart',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let moveMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 500, target: treeObj.element, type: 'touchmove',
                    preventDefault: (): void => { /** Do Nothing */ }
                };

                let endMouseEventArs: CommonArgs = {
                    clientX: 200, clientY: 500, target: treeObj.element, type: 'touchend',
                    preventDefault: (): void => { /** Do Nothing */ }
                };
                curUL = treeObj.curUL;
                //Actions
                treeObj.touchModule.startEvent(startMouseEventArs);
                treeObj.touchModule.moveEvent(moveMouseEventArs);
                treeObj.touchModule.endEvent(endMouseEventArs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(true);
            });
        });
        describe('second level navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '02_1' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
                treeObj.back();
            });

            it('headerTitle on sub level', () => {
                treeObj.headerTitle = 'Custom Title';
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-headertext').innerHTML).not.toBe('Custom Title');
            });

        });

        describe('back navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('las back navigation', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('back navigation when no more back navigation', () => {
            let curUL: any;
            beforeEach(() => {
                curUL = treeObj.curUL;
                treeObj.back();
            });

            it('', () => {
                expect(curUL).toBe(treeObj.curUL);
            });
        });

        describe('navigate to already visited child', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('back navigation sortOrder change', () => {
            let curUL: any;
            beforeEach((done: Function) => {
                treeObj.sortOrder = 'Descending';
                treeObj.dataBind();
                curUL = treeObj.curUL;
                treeObj.back();
                treeObj.actionComplete = () => {
                    done();
                }
            });

            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('key actions', () => {

        describe('home button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 36
            };

            let ele: Element;
            let listObj: any;
            it('Home button action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[2]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            });

            it('Home button action with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.curUL.focus();
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('Home button action with empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('Home button action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.curUL.focus();
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('End button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 35
            };

            let ele: Element;
            let listObj: any;
            it('End button action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[4] as Element).classList.contains('e-active')).toBe(true);
            });

            it('End button action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[4] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('End button action with empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('Arrow up button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 38
            };

            let ele: HTMLElement;
            let data: { [key: string]: Object }[] = [
            ];
            for (let i = 0; i < 50; i++) {
                data.push({ 'text': i.toString(), 'id': i.toString(), 'category': Math.floor(i / 10).toString(), 'cat': Math.floor(i / 10).toString() });
            }
            let listObj: any;
            it('move up action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data });
                listObj.appendTo(ele);
                window.scrollTo(0, 500);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[10]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move up action with simple dataSource and fixed height', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                ele.style.overflow = 'auto';
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, height: 500 });
                listObj.appendTo(ele);
                listObj.element.scrollTo(0, 500);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[10]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[9] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move up action with header title', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, headerTitle: 'list', showHeader: true, });
                listObj.appendTo(ele);
                (document.getElementsByClassName('e-list-header')[0] as HTMLElement).style.height= '50px';
                window.scrollTo(0, 50);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[0]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('move up action with header title and fixed height', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                ele.style.overflow = 'auto';
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, height: 500, headerTitle: 'list', showHeader: true });
                listObj.appendTo(ele);
                (document.getElementsByClassName('e-list-header')[0] as HTMLElement).style.height= '50px';
                listObj.element.scrollTo(0, 50);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[0]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move up action with group list with fixed height', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                ele.style.overflow = 'auto';
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, height: 500, fields: {groupBy: 'category'} });
                listObj.appendTo(ele);
                listObj.element.scrollTo(0, 50);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move up action with group list', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, fields: {groupBy: 'category'} });
                listObj.appendTo(ele);
                window.scrollTo(0, 50);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('move up action with virtualization', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, enableVirtualization: true });
                listObj.appendTo(ele);
                let startingHeight: number = document.documentElement.getBoundingClientRect().height - listObj.ulElement.getBoundingClientRect().height;
                simulateScrollEvent(document.documentElement, startingHeight + 51);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[0]);
                expect(listObj.virtualizationModule.activeIndex).toBe(1);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('move up action with virtualization with fixed height', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                ele.style.overflow = 'auto';
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, enableVirtualization: true, height: 500 });
                listObj.appendTo(ele);
                simulateScrollEvent(listObj.element, 51);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[0]);
                expect(listObj.virtualizationModule.activeIndex).toBe(1);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('move up action with group list & header', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, fields: {groupBy: 'category'}, headerTitle: 'list', showHeader: true});
                listObj.appendTo(ele);
                (document.getElementsByClassName('e-list-header')[0] as HTMLElement).style.height= '50px';
                window.scrollTo(0, 50);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                listObj.keyActionHandler(keyEventArgs);
            });

            it('move up action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('move up action with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[2]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('move up action with empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('Arrow down button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 40
            };

            let data: { [key: string]: Object }[] = [
            ];
            for (let i = 0; i < 50; i++) {
                data.push({ 'text': i.toString(), 'id': i.toString(), 'category': Math.floor(i / 10).toString(), 'cat': Math.floor(i / 10).toString() });
            }

            let ele: HTMLElement;
            let listObj: any;
            it('move down action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data });
                listObj.appendTo(ele);
                (window as any).innerHeight = 500;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[9]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[10] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move down action with simple dataSource and fixed height', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 50);
                ele.style.overflow = 'auto';
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: data, height: 500 });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[9]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[10] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move down action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[2] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('move down action with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                li[1].classList.add('e-focused');
                listObj.keyActionHandler(keyEventArgs);
                expect((li[2] as Element).classList.contains('e-active')).toBe(true);
            });

            it('move down action with empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                setStyle(ele, 45);
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('back button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 8
            };

            let ele: Element;
            let listObj: any;

            it('back button action  with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData, showHeader: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                let header: Element = document.getElementsByClassName('e-list-header')[0].firstElementChild;
                listObj.setSelectLI(li[1]);
                expect(window.getComputedStyle(header, null).getPropertyValue("display")).toBe('block');
                listObj.keyActionHandler(keyEventArgs);
                expect(window.getComputedStyle(header, null).getPropertyValue("display")).toBe('none');
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('Enter button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 13
            };
            let keyEventArgs1: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 38
            };

            let ele: Element;
            let listObj: any;
            it('select action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
            });

            it('select action with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[2]);
                listObj.keyActionHandler(keyEventArgs1);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);

            });

            it('select action with empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            afterEach(() => {
                ele.remove();
            });
        });

        describe('Space button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 32
            };

            let ele: Element;
            let listObj: any;
            it('select action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
            });

            it('select action without checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: dataSource, showCheckBox: false });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.setSelectLI(li[1]);
                listObj.keyActionHandler(keyEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
            });

            it('select action without empty dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [], showCheckBox: false });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });


            afterEach(() => {
                ele.remove();
            });
        });

        describe('Tab button', () => {
            let keyEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 9
            };

            let ele: Element;
            let listObj: any;
            it('Tab focus action with simple dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new
                    ListView({ dataSource: dataSource });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true)
            });

            it('Tab focus action with checkbox', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new
                    ListView({ dataSource: dataSource, showCheckBox: true });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-focused')).toBe(true)
            });

            it('Tab focus action with Nested dataSource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: NestedData });
                listObj.appendTo(ele);
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
                listObj.keyActionHandler(keyEventArgs);
                expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            });

            it('Tab focus action with empty datasource', () => {
                ele = createElement('div', { id: 'ListView' });
                document.body.appendChild(ele);
                listObj = new ListView({ dataSource: [] });
                listObj.appendTo(ele);
                listObj.keyActionHandler(keyEventArgs);
            });

            afterEach(() => {
                ele.remove();
            });
        });

    });

    describe('focusout event', () => {
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 9
        };
        let keyEventArgs1: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 38
        };

        let ele: Element;
        let listObj: any;
        it('focusout event with simple dataSource', () => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
            listObj = new ListView({ dataSource: dataSource });
            listObj.appendTo(ele);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
            listObj.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
            listObj.focusout();
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
        });

        it('focusout event with Nested dataSource', () => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
            listObj = new ListView({ dataSource: NestedData });
            listObj.appendTo(ele);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
            listObj.keyActionHandler(keyEventArgs);
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            listObj.focusout();
            expect((li[0] as Element).classList.contains('e-focused')).toBe(false);
        });

        it('focusout event with Nested dataSource', () => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
            listObj = new ListView({ dataSource: NestedData });
            listObj.appendTo(ele);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>listObj.curUL.querySelectorAll('li');
            listObj.setSelectLI(li[2]);
            expect((li[2] as Element).classList.contains('e-active')).toBe(true);
            listObj.keyActionHandler(keyEventArgs1);
            expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
            expect((li[2] as Element).classList.contains('e-active')).toBe(false);
            listObj.focusout();
            expect((li[2] as Element).classList.contains('e-active')).toBe(true);
        });

        it('focusout event with empty dataSource', () => {
            ele = createElement('div', { id: 'ListView' });
            document.body.appendChild(ele);
            listObj = new ListView({ dataSource: [] });
            listObj.appendTo(ele);
            listObj.focusout();
        });

        afterEach(() => {
            ele.remove();
        });
    });

    describe('actionComplete after control destroyed', () => {
        let actionCompleteFunction: any = jasmine.createSpy('actionComplete');
        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            document.body.appendChild(ele);
            nTree = new ListView({
                dataSource: new DataManager({
                    url: '/api/Employees',
                    adaptor: new ODataV4Adaptor
                }),
                actionComplete: actionCompleteFunction,
                fields: { id: 'EmployeeID', text: 'FirstName' }
            });
            nTree.appendTo('#newTree');
            nTree.destroy();
        });
        it('actionComplete event after control destroyed', () => {
            expect(actionCompleteFunction).not.toHaveBeenCalled();
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('actionFailure after control destroyed', () => {
        let actionFailedFunction: any = jasmine.createSpy('actionFailure');
        let ele: HTMLElement = document.createElement('div');
        ele.appendChild(document.createElement('ul'));
        ele.id = 'newTree';
        let nTree: ListView;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            nTree = new ListView({
                dataSource: new DataManager({
                    url: '/test/db',
                    adaptor: new ODataV4Adaptor
                }),
                fields: { id: 'EmployeeID', text: 'FirstName' },
                actionFailure: actionFailedFunction
            });
            nTree.appendTo('#newTree');
            nTree.destroy();
        });
        beforeEach(() => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
        });
        it('actionFailure after destroyed', () => {
            expect(actionFailedFunction).not.toHaveBeenCalled();
        });

        afterAll(() => {
            ele.remove();
            jasmine.Ajax.uninstall();
        });
    });


    describe('mouse events', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData });
            treeObj.appendTo(ele);
        });

        it('mouse click event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[2].firstChild;
            expect((li[2] as Element).classList.contains('e-active')).toBe(false);
            treeObj.clickHandler(mouseEventArgs);
            expect((li[2] as Element).classList.contains('e-active')).toBe(true);
        });

        it('mouse click event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            expect((li[0] as Element).classList.contains('e-active')).toBe(false);
            treeObj.clickHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-active')).toBe(true);
        });


        it('mouse hover event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0].firstChild;
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
            treeObj.hoverHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
        });

        it('mouse leave event', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.curUL.querySelectorAll('li');
            mouseEventArgs.target = li[0].firstChild;
            expect((li[0] as Element).classList.contains('e-hover')).toBe(true);
            treeObj.leaveHandler(mouseEventArgs);
            expect((li[0] as Element).classList.contains('e-hover')).toBe(false);
        });
        afterAll(() => {
            ele.remove();
        });
    });

    describe('animation', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData });
            treeObj.appendTo(ele);
        });

        describe('switch view', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                mouseEventArgs.target = curUL.querySelectorAll('li')[0];
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });

        describe('mouse click on back button', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backButtonEle: Element = createElement('div', { className: 'e-icon-back' });
                mouseEventArgs.target = backButtonEle;
                curUL = treeObj.curUL;
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
            afterEach((done: Function) => {
                mouseEventArgs.target = treeObj.curUL.querySelectorAll('li')[0];
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
        });
        describe('back on header text click', () => {
            let mouseEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                target: null
            };
            let curUL: Element;
            beforeEach((done: Function) => {
                let backheaderEle: Element = createElement('div', { className: 'e-headertext' });
                mouseEventArgs.target = backheaderEle;
                curUL = treeObj.curUL;
                treeObj.clickHandler(mouseEventArgs);
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });
        describe('no animation 0ms', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.animation.effect = 'None';
                treeObj.dataBind();
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(isVisible(curUL)).toBe(false);
            });
        });

        it('switchView method when no element', () => {
            let cUL: any = treeObj.curUL;
            expect(treeObj.switchView()).toBe(undefined);
            expect(cUL).toBe(treeObj.curUL);
        });


        describe('empty animation effect', () => {
            let curUL: Element;
            beforeEach(() => {
                treeObj.animation.effect = '';
                treeObj.dataBind();
                treeObj.selectItem({ id: '01' });
            });
            it('', () => {
                expect(treeObj.animation.effect).toBe('');
            });
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('property change', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData });
            treeObj.appendTo(ele);
        });
        it('onproperty change function call', () => {
            spyOn(treeObj, 'onPropertyChanged');
            expect(treeObj.onPropertyChanged).not.toHaveBeenCalled();
            treeObj.animation = { effect: 'SlideDown' };
            treeObj.dataBind();
            expect(treeObj.onPropertyChanged).toHaveBeenCalled();
        });

        it('enable property to be false', () => {
            expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
            treeObj.enable = false;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
        });

        it('enable property to be true', () => {
            expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
            treeObj.enable = true;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-disabled')).toBe(false);
        });

        it('cssClass property to set as css-classname', () => {
            expect(treeObj.element.classList.contains('css-classname')).toBe(false);
            treeObj.cssClass = 'css-classname';
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('css-classname')).toBe(true);
        });

        it('cssClass property to set as css-newclassname', () => {
            expect(treeObj.element.classList.contains('css-newclassname')).toBe(false);
            expect(treeObj.element.classList.contains('css-classname')).toBe(true);
            treeObj.cssClass = 'css-newclassname';
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('css-classname')).toBe(false);
            expect(treeObj.element.classList.contains('css-newclassname')).toBe(true);
        });

        it('htmlAttributes property', () => {
            expect(treeObj.element.getAttribute('title')).toBe(null);
            treeObj.htmlAttributes = { title: 'ListView' };
            treeObj.dataBind();
            expect(treeObj.element.getAttribute('title')).toBe('ListView');
        });

        it('height property', () => {
            expect(treeObj.element.style.height).toBe('');
            treeObj.height = '200px';
            treeObj.dataBind();
            expect(treeObj.element.style.height).toBe('200px');
        });
        it('height property in number', () => {
            treeObj.height = 300;
            treeObj.dataBind();
            expect(treeObj.element.style.height).toBe('300px');
        });

        it('width property', () => {
            expect(treeObj.element.style.width).toBe('');
            treeObj.width = '200px';
            treeObj.dataBind();
            expect(treeObj.element.style.width).toBe('200px');
        });

        it('width property in number', () => {
            treeObj.width = 300;
            treeObj.dataBind();
            expect(treeObj.element.style.width).toBe('300px');
        });

        it('enable RTL property', () => {
            treeObj.enableRtl = true;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
        });

        it('enable RTL property', () => {
            treeObj.enableRtl = false;
            treeObj.dataBind();
            expect(treeObj.element.classList.contains('e-rtl')).toBe(false);
        });

        it('dataSource property', () => {
            treeObj.dataSource = [{ id: '01', text: 'First One', subText: '1st' }, { id: '02', text: 'Second One', subText: '2nd' }];
            treeObj.dataBind();
            expect(treeObj.curUL.querySelectorAll('li').length).toBe(2);
        });

        it('fields property', () => {
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('First One');
            treeObj.fields = { text: 'subText', id: 'id' };
            treeObj.dataBind();
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
        });

        it('sortOrder property', () => {
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('1st');
            treeObj.sortOrder = 'Descending';
            treeObj.dataBind();
            expect(treeObj.curUL.querySelector('.e-list-text').innerHTML).toBe('2nd');
        });

        it('headerTitle property', () => {
            treeObj.headerTitle = 'Custom Title';
            treeObj.showHeader = true;
            treeObj.dataBind();
            expect(treeObj.element.querySelector('.e-headertext').innerHTML).toBe('Custom Title');
        });

        it('showHeader property', () => {
            treeObj.showHeader = false;
            treeObj.dataBind();
            expect(treeObj.element.querySelector('.e-list-header').style.display).toBe('none');
        });

        it('dataSource property with empty array', () => {
            treeObj.dataSource = [];
            treeObj.dataBind();
            expect(treeObj.element.childNodes.length).toBe(0);
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('grouping list', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData, fields: { id: 'id', text: 'text', groupBy: 'category' } });
            treeObj.appendTo(ele);
        });
        it('element grouped', () => {
            expect(treeObj.element.querySelectorAll('li').length).toBe(5);
        });
        describe('sub child navigation on grouped list', () => {
            let curUL: Element;
            beforeEach((done: Function) => {
                curUL = treeObj.curUL;
                treeObj.selectItem({ id: '01' });
                treeObj.actionComplete = () => {
                    done();
                }
            });
            it('', () => {
                expect(curUL).not.toBe(treeObj.curUL);
                expect(isVisible(curUL)).toBe(false);
            });
        });
        afterAll(() => {
            ele.remove();
        });

    });

    describe('sorting list', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData, sortOrder: 'Descending' });
            treeObj.appendTo(ele);
        });
        it('sorting in desending order', () => {
            expect(treeObj.element.querySelectorAll('li').length).toBe(3);
            expect(treeObj.liCollection[0].querySelector('.e-list-text').innerHTML).toBe('text3');
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('events', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null
        };
        beforeAll(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData });
            treeObj.appendTo(ele);
        });
        it('select event call', () => {
            let selectFn: Function = jasmine.createSpy('selectFun');
            treeObj.select = selectFn;
            treeObj.selectItem({ id: '03' });
            expect(selectFn).toHaveBeenCalledWith(
                {
                    name: 'select',
                    item: treeObj.liCollection[2], text: 'text3',
                    data: { id: '03', text: 'text3', icon: 'iconClass3', category: 'a' }
                });
        });

        it('actionComplete event call', () => {
            let actionComplete: Function = jasmine.createSpy('complete');
            treeObj.actionComplete = actionComplete;
            treeObj.dataSource = [{ id: '01', text: '01' }];
            treeObj.dataBind();
            expect(actionComplete).toHaveBeenCalled();
        });

        describe('actionFailure event', () => {
            let actionFailedFunction: any = jasmine.createSpy('actionFailure');
            let ele: HTMLElement = document.createElement('div');
            ele.appendChild(document.createElement('ul'));
            ele.id = 'newTree';
            let nTree: ListView;
            beforeAll(() => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                nTree = new ListView({
                    dataSource: new DataManager({
                        url: '/test/db',
                        adaptor: new ODataV4Adaptor
                    }),
                    fields: { id: 'EmployeeID', text: 'FirstName' },
                    actionFailure: actionFailedFunction
                });
                nTree.appendTo('#newTree');
            });
            beforeEach((done: Function) => {
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                setTimeout(() => { done(); }, 100);
            });
            it('initialized HTML data', () => {
                expect(actionFailedFunction).toHaveBeenCalled();
            });

            afterAll(() => {
                ele.remove();
                jasmine.Ajax.uninstall();
            });
        });

        afterAll(() => {
            ele.remove();
        });

    });

    describe('enable persistance', () => {
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });

        beforeEach(() => {
            document.body.appendChild(ele);
            treeObj = new ListView({ dataSource: NestedData, fields: { text: 'id' }, enablePersistence: true, cssClass: 'testclass' });
            treeObj.appendTo(ele);
        });

        it('property localStorage updated test', () => {
            treeObj.destroy();
            expect(JSON.parse(window.localStorage.getItem('listviewListView')).cssClass).toBe('testclass');
            ele.remove();
        });

        it('rendering from persistance property', () => {
            expect(treeObj.element.classList.contains('testclass')).toBe(true);
        });

        afterAll(() => {
            ele.remove();
        });
    });

    describe('removeItem method by enabling groupBy property', () => {
        let listObj: any;
        let ele: HTMLElement = createElement('div', { id: 'ListView' });
        beforeAll(() => {
            document.body.appendChild(ele);
            listObj = new ListView({
                dataSource: dataSourceGroup, fields: { groupBy: 'category' }
            });
            listObj.appendTo(ele);
        });
        it('remove item with grouping option', () => {
            listObj.removeItem({ id: 'e807' });
            expect(listObj.element.querySelectorAll('.e-list-item').length).toBe(2);
        });
        it('remove item with different item Selection', () => {
            listObj.selectItem({ id: '9bdb' });
            listObj.removeItem({ id: '4589' });
            expect(listObj.getSelectedItems().text.length).toBe(7);
        });
        it('remove item with same time Selection', () => {
            listObj.selectItem({ id: '9bdb' });
            listObj.removeItem({ id: '9bdb' });
            expect(listObj.getSelectedItems()).toBe(undefined);
        });
        afterAll(() => {
            ele.remove();
        });
    });
});
