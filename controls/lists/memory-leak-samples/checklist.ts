/**
 * ListView Default Sample
 */
 import { ListView } from '../src/list-view/index';

 let listObj: ListView;
 let grpListObj: ListView;
 let flatData: { [key: string]: Object }[] = [];
 let groupData: { [key: string]: Object }[] = [
  {
      'text': 'Audi A4',
      'id': '9bdb',
      'category': 'Audi'
  },
  {
      'text': 'Audi A5',
      'id': '4589',
      'category': 'Audi'
  },
  {
      'text': 'Audi A6',
      'id': 'e807',
      'category': 'Audi'
  },
  {
      'text': 'Audi A7',
      'id': 'a0cc',
      'category': 'Audi'
  },
  {
      'text': 'Audi A8',
      'id': '5e26',
      'category': 'Audi'
  },
  {
      'text': 'BMW 501',
      'id': 'f849',
      'category': 'BMW'
  },
  {
      'text': 'BMW 502',
      'id': '7aff',
      'category': 'BMW'
  },
  {
      'text': 'BMW 503',
      'id': 'b1da',
      'category': 'BMW'
  },
  {
      'text': 'BMW 507',
      'id': 'de2f',
      'category': 'BMW'
  },
  {
      'text': 'BMW 3200',
      'id': 'b2b1',
      'category': 'BMW'
  }
];
 
 document.getElementById('render').addEventListener('click', renderListView);
 document.getElementById('destroy').addEventListener('click', destoryListView);

 for (let i = 1; i <= 10; i++) {
   flatData.push({ text: 'List' + i, id: i });
 }
 
 function renderListView(): void {
  //Initialize ListView component
  listObj = new ListView({
    //Set defined data to dataSource property
    dataSource: flatData,
    //Enables checkbox
    showCheckBox: true
  });
  
  //Render initialized ListView component
  listObj.appendTo('#listview');

  //Initialize ListView component
  grpListObj = new ListView({

    //Set defined data to dataSource property
    dataSource: groupData,

    //Map the appropriate columns to fields property
    fields: { groupBy: 'category' },

    //Enables checkbox
    showCheckBox: true
  });

  //Render initialized ListView component
  grpListObj.appendTo('#listview-grp');
 }

function destoryListView(): void {
    if (listObj && !listObj.isDestroyed) {
        listObj.destroy();
        listObj = null;
    }
    if (grpListObj && !grpListObj.isDestroyed) {
      grpListObj.destroy();
      grpListObj = null;
  }
}
