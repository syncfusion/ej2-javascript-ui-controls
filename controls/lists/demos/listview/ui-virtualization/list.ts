/**
 * ListView Default Sample
 */
import { ListView, Virtualization } from '../../../src/list-view/index';

let data: any = [];
ListView.Inject(Virtualization);
data = [
    { name: 'Nancy', icon: 'N', id: '0', },
    { name: 'Andrew', icon: 'A', id: '1' },
    { name: 'Janet', icon: 'J', id: '2' },
    { name: 'Margaret', imgUrl: './margaret.png', id: '3' },
    { name: 'Steven', icon: 'S', id: '4' },
    { name: 'Laura', imgUrl: './laura.png', id: '5' },
    { name: 'Robert', icon: 'R', id: '6' },
    { name: 'Michael', icon: 'M', id: '7' },
    { name: 'Albert', imgUrl: './albert.png', id: '8' },
    { name: 'Nolan', icon: 'N', id: '9' }
]
for (var i = 10; i <= 1010; i++) {
    let index: number = parseInt((Math.random() * 10).toString());
    data.push({ name: data[index].name, icon: data[index].icon, imgUrl: data[index].imgUrl, id: i.toString() });
}

let listObj: any = new ListView({

    //Set defined data to dataSource property.
    dataSource: data,
    enableVirtualization: true,
    height: 500,
    headerTitle: 'Contacts',
    showHeader: true,
    template: '<div class="list-container"><div id="icon" class="${$imgUrl ? \'img\' : $icon }"><span class="${$imgUrl ? \'hideUI\' : \'showUI\' }"> ${icon}</span> <img class="${$imgUrl ? \'showUI\' : \'hideUI\' }" width = 45 height = 45 src="${$imgUrl ?  $imgUrl : \' \' }" /></div><div class="name">${name}</div></div>'

});

listObj.appendTo('#default-list');

