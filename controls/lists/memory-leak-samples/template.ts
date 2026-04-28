/**
 * ListView Default Sample
 */
import { ListView } from '../src/list-view/index';

let listObj: ListView;
let data: { [key: string]: Object }[] = [
    { text: "Jenifer", contact: "(206) 555-985774", id: "1", avatar: "", pic: "pic01" },
    { text: "Amenda", contact: "(206) 555-3412", id: "2", avatar: "A", pic: "" },
    { text: "Isabella", contact: "(206) 555-8122", id: "4", avatar: "", pic: "pic02" },
    { text: "William", contact: "(206) 555-9482", id: "5", avatar: "W", pic: "" }
  ];;
let template: string = '<div class="e-list-wrapper e-list-multi-line e-list-avatar">' +
  '${if(avatar!=="")}' +
  '<span class="e-avatar e-avatar-circle">${avatar}</span>' +
  '${else}' +
  '<span class="${pic} e-avatar e-avatar-circle"> </span>' +
  '${/if}' +
  '<span class="e-list-item-header">${text}</span>' +
  '<span class="e-list-content">${contact}</span>' +
  '</div>';

  document.getElementById('render').addEventListener('click', renderListView);
  document.getElementById('destroy').addEventListener('click', destoryListView);

  function renderListView(): void {
    listObj = new ListView({
        //Set the defined data to the dataSource property
        dataSource: data,
        //Map the appropriate columns to the fields property
        fields: { text: "text" },
        //Set the width of the ListView
        width: "350px",
        //Enable the header of the ListView
        showHeader: true,
        //Set the header title
        headerTitle: "Contacts",
      
        //set cssClass for template customization
        cssClass: 'e-list-template',
      
        //Set the customized template
        template: template,
        sortOrder: "Ascending"
      });
      
      listObj.appendTo('#template-list');
  }

  function destoryListView(): void {
    if (listObj && !listObj.isDestroyed) {
        listObj.destroy();
        listObj = null;
    }
}
