/**
 * dropdownlist Sample
 */
import { DropDownList } from '../../src/drop-down-list/index';


    let states: any = [];
    
    for (let i: number=0; i< 10000; i++) {
        states[i] = { num: 1001 + i };
    }

    let listObj: DropDownList = new DropDownList({
        dataSource: states,
        fields: { text: 'num' },
        width: '250px',
        popupHeight: '300px',
        popupWidth: '250px',
    });
    listObj.appendTo('#list');
    
    let button: HTMLElement = document.getElementById('btn');
    button.onclick = () => {
        let strTime: number = Date.now();
        listObj.showPopup();
        let endTime: number = Date.now();
        document.getElementById('time').innerHTML = "Rendering Time (ms): " + (endTime - strTime);        
     }