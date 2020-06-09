import { Kanban, KanbanModel } from '../../src/kanban/index';
import { L10n, setCulture, enableRtl} from '@syncfusion/ej2-base';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

L10n.load({
    'de': {
        'kanban': {
            'items': 'Artikel',
            'min': 'Min',
            'max': 'Max',
            'cardsSelected': 'Karten ausgewählt',
            'addTitle': 'Neue Karte hinzufügen',
            'editTitle': 'Kartendetails bearbeiten',
            'deleteTitle': 'Karte löschen',
            'deleteContent': 'Möchten Sie diese Karte wirklich löschen?',
            'save': 'speichern',
            'delete': 'Löschen',
            'cancel': 'Stornieren',
            'yes': 'Ja',
            'no': 'Nein',
            'close': 'Schließen',
        }
    },
    'ar': {
        'kanban': {
            'items': 'العناصر',
            'min': 'أنا',
            'max': 'ماكس',
            'cardsSelected': 'تم اختيار البطاقات',
            'addTitle': 'إضافة بطاقة جديدة',
            'editTitle': 'تحرير تفاصيل البطاقة',
            'deleteTitle': 'حذف البطاقة',
            'deleteContent': 'هل أنت متأكد أنك تريد حذف هذه البطاقة؟',
            'save': 'حفظ',
            'delete': 'حذف',
            'cancel': 'إلغاء',
            'yes': 'نعم',
            'no': 'لا',
            'close': 'قريب'
        }
    },
    'zh': {
        'kanban': {
            'items': '项目',
            'min': '我',
            'max': '最高',
            'cardsSelected': '选择的卡',
            'addTitle': '新增卡',
            'editTitle': '编辑卡详细信息',
            'deleteTitle': '删除卡',
            'deleteContent': '您确定要删除此卡吗？',
            'save': '救',
            'delete': '删除',
            'cancel': '取消',
            'yes': '是',
            'no': '没有',
            'close': '关',
        }
    },
    'en-US': {
        'kanban': {
            'items': 'items',
            'min': 'Min',
            'max': 'Max',
            'cardsSelected': 'Cards Selected',
            'addTitle': 'Add New Card',
            'editTitle': 'Edit Card Details',
            'deleteTitle': 'Delete Card',
            'deleteContent': 'Are you sure you want to delete this card?',
            'save': 'Save',
            'delete': 'Delete',
            'cancel': 'Cancel',
            'yes': 'Yes',
            'no': 'No',
            'close': 'Close',
        }
    }
});


/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    locale: 'de',
    columns: [
        { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, showItemCount: true, minCount: 15, maxCount: 20 },
        { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showItemCount: true, maxCount: 15 },
        { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showItemCount: true },
        { headerText: 'Done', keyField: 'Close', allowToggle: true, showItemCount: true, minCount: 1, maxCount: 10 }
    ],
    swimlaneSettings: {
        keyField: 'Assignee'
    },
    cardSettings: {
        showHeader: true,
        contentField: 'Summary',
        headerField: 'Id'
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#Kanban');

document.getElementById('cultures').onchange = () => {
    let ddl: HTMLSelectElement = document.getElementById('cultures') as HTMLSelectElement;
    let value: string = ddl.value;
    enableRtl(value === 'ar');
    setCulture(value);
};
