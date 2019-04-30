import {
    Property, Complex, ComplexFactory,
    Collection, CollectionFactory, NotifyPropertyChanges,
    INotifyPropertyChanged, CreateBuilder, Event
} from '../src/notify-property-change';
import { Base } from '../src/base';
import { createElement } from '../src/dom';
import { ChildProperty } from '../src/child-property';
/**
 * 
 */

let getType: Function = (obj: any): Object => {
    switch (obj.type) {
        case "Book":
            return Book;
        case "Info":
            return BookInfo;
        default:
            return Subject;
    }
};

class BookInfo extends ChildProperty<BookInfo> {
    @Property('test')
    public accessId: string;
    @Property(false)
    public flag: boolean;
    @ComplexFactory(getType)
    public type: BookInfoModel;
}
/**
 * 
 */
class Book extends ChildProperty<Book> {
    @Property('')
    public bookID: string;

    @Property('')
    public name: string;

    @Property('')
    public author: string;
    @Event()
    public level2event: Function;
}
class Book2 extends ChildProperty<Book> {
    @Property('')
    public author: string;
    @Complex<BookInfoModel>({ accessId: 'ss' }, BookInfo)
    public bookData: BookInfoModel;
    @Event()
    public level2event: Function;
}
interface BookModel {
    bookID?: string;
    name?: string;
    author?: string;
    level2event?: Function;
    bookData?: BookInfoModel;
    type?: string;
}
interface BookInfoModel {
    accessId?: string;
    flag?: boolean;
    type?: string;
}
interface SubjectModel {
    name?: string;
    subID?: string;
    subScore?: number;
    practicalScore?: number;
    preferedBook?: BookModel;
    childEvent?: Function;
}
/**
 * Subject
 */
class Subject extends ChildProperty<Subject> {
    @Property('')
    public subID: string;

    @Property(0)
    public subScore: number;

    @Property(0)
    public practicalScore: number;

    @Complex<BookModel>({ name: 'Book1' }, Book)
    public preferedBook: BookModel;

    @Collection<BookModel>([{ name: 'levl2name', bookID: 'snm' }], Book)
    public preferedCollection: BookModel;

    @Event()
    public childEvent: Function;
}
/**
 * Subject
 */
class Subject2 extends ChildProperty<Subject> {
    @Complex<BookModel>({ name: 'Book1', bookData: { accessId: 'subject', flag: true } }, Book2)
    public preferedBook: BookModel;
}

/**
 * Array processing class declaration
 */

interface MarkerModel {
    visible?: boolean;
    fill?: string;
}

interface PointsModel {
    x?: number;
    fill?: string;
    marker1?: MarkerModel[];
}

interface SeriesModel {
    marker?: MarkerModel;
    visibility?: string;
    points?: PointsModel[];
}

class Marker extends ChildProperty<Marker> {
    @Property(true)
    public visible: boolean;
    @Property('falseString')
    public fill: string;
}
/**
 * 
 */
class Points extends ChildProperty<Points> {
    @Property()
    public x: number;

    @Property('')
    public fill: string;

    @Collection<MarkerModel>([{ fill: 'dsnm' }], Marker)
    public marker1: MarkerModel;
}

class Series extends ChildProperty<Series> {
    @Complex<MarkerModel>({}, Marker)
    public marker: MarkerModel;

    @Property('visible')
    public visibility: string;

    @Collection<PointsModel>([{ x: 22, fill: 'sm', marker1: [{ fill: 'snm' }] }], Points)
    public points: PointsModel[];
}

interface GetType {
    type: string
}

let defaulEvent: jasmine.Spy = jasmine.createSpy('defaultEvent');
/**
 * DemoClass
 */
@NotifyPropertyChanges
class DemoClass extends Base<HTMLElement> implements INotifyPropertyChanged {

    @Property('default1')
    public property1: string;

    @Property('default2')
    public property2: number;

    @Property()
    public property3: Object[];

    @Property({ text: 'check' })
    public property4: Object;

    @ComplexFactory(getType)
    public allType: SubjectModel | BookModel | BookInfoModel | GetType;

    @Complex<SubjectModel>({ name: 'Book1' }, Subject)
    public subject1: SubjectModel;

    @Complex<SubjectModel>({ name: 'Book1', preferedBook: { bookData: { accessId: 'snm' } } }, Subject2)
    public subject2: SubjectModel;

    @CollectionFactory(getType)
    public allTypeCollection: SubjectModel[] | BookModel[] | BookInfoModel[] | GetType[];

    @Collection<SubjectModel>([{ subID: 'snm', subScore: 2 }, {
        subID: 'test2', subScore: 34, preferedBook: { author: 'syncf', name: 'setter' }
    }
    ], Subject)
    public subjectCollection: SubjectModel[];

    @Collection<SeriesModel>([{}], Series)
    public seriesCollection: SeriesModel[];

    @Event()
    public event1: Function;

    protected getModuleName(): string {
        return 'demo';
    }

    public destroy(): void {
        super.destroy();
    }

    constructor(properties: Object, ele: HTMLElement) {
        super(properties, ele);
    }
    public onPropertyChanged(newProp: any, oldProp: any): void {
        /** No Code */
    }

}
let ele: HTMLElement = createElement('div', { id: 'ele1' });

// Instance one 
let objDemoClass1: any = new DemoClass({}, ele);
// Instance two
let objDemoClass2: any = new DemoClass({}, ele);


describe('NotifyProperty', () => {

    describe('Property decorator creation', () => {
        it('create property using property function', () => {
            Property()(objDemoClass1, 'newProp');
            expect(objDemoClass1.hasOwnProperty('newProp')).toBe(true);
        });
        it('create property for multiple instance', () => {
            Property()(objDemoClass2, 'newProp');
            expect(objDemoClass2.hasOwnProperty('newProp')).toBe(true);
        });
    });

    describe('Class decorator creation', () => {
        it('dynamic function creation', () => {
            NotifyPropertyChanges(objDemoClass1.constructor);
            expect(typeof objDemoClass1.saveChanges).toEqual('function');
            expect(typeof objDemoClass1.dataBind).toEqual('function');
        });

        it('function creation for multiple instance ', () => {
            NotifyPropertyChanges(objDemoClass2.constructor);
            expect(typeof objDemoClass2.saveChanges).toEqual('function');
            expect(typeof objDemoClass2.dataBind).toEqual('function');
        });
    });

    describe('default Value', () => {
        it('get default value', () => {
            expect(objDemoClass1.property1).toBe('default1');
            expect(objDemoClass1.property2).toBe('default2');
            expect(objDemoClass1.property3).toBe(undefined);
        });
        it('get default value of 2nd instance', () => {
            expect(objDemoClass2.property2).toBe('default2');
            expect(objDemoClass1.property2).toBe('default2');
            objDemoClass2.property2 = 'value2';
            expect(objDemoClass1.property2).toBe('default2');
            expect(objDemoClass2.property2).toBe('value2');

        });
        it('complex default value', () => {
            expect(objDemoClass2.property4.text).toBe('check');
            expect(objDemoClass1.property4.text).toBe('check');
            objDemoClass2.property4 = { text: 'test' };
            expect(objDemoClass1.property4.text).toBe('check');
            expect(objDemoClass2.property4.text).toBe('test');
        });
        it('Complex default value multi level and default value at all levels', () => {
            expect((objDemoClass1 as DemoClass).subject2.preferedBook.bookData.accessId).toBe('snm');
            expect(objDemoClass1.property4.text).toBe('check');
        });
        describe('complex multi level property value changes', () => {
            beforeAll((done: Function) => {
                spyOn(objDemoClass1, 'onPropertyChanged');
                objDemoClass1.subject2.preferedBook.bookData.accessId = 'valueChanged';
                setTimeout(() => { done(); }, 50);
            });
            it('works properly', () => {
                expect(objDemoClass1.onPropertyChanged).toHaveBeenCalled();
                expect((objDemoClass1 as DemoClass).subject2.preferedBook.bookData.accessId).toBe('valueChanged');
            });

        });
        it('complex property value change specifically', () => {
            expect(objDemoClass1.property4.text).toBe('check');
            expect(objDemoClass2.property4.text).toBe('test');
            objDemoClass2.property4.text = 'updated';
            expect(objDemoClass1.property4.text).toBe('check');
            expect(objDemoClass2.property4.text).toBe('updated');
        });
        describe(' array  of complex default value', () => {
            it('check array length', () => {
                expect((<Object[]>objDemoClass1.subjectCollection).length).toBe(2);
            });
            it('check array values first level', () => {
                expect(objDemoClass1.subjectCollection[0].subID).toBe('snm');
            });
            it('check array values level2', () => {
                expect(objDemoClass1.subjectCollection[1].preferedBook.author).toBe('syncf');
            });
            it('check complex property array value array value', () => {
                expect(objDemoClass1.subjectCollection[0].preferedCollection[0].name).toBe('levl2name');
            });
        });
        describe('Multi level complexProperty array', () => {
            it('check first level array default value', () => {
                expect(objDemoClass1.seriesCollection[0].visibility).toBe('visible');
            });
            it('check second level array default value', () => {
                expect(objDemoClass1.seriesCollection[0].points[0].x).toBe(22);
            });
            it('check third level array default value', () => {
                expect(objDemoClass1.seriesCollection[0].points[0].marker1[0].fill).toBe('snm');
            });
        });
    });

    describe('NotifyPropertyChanges', () => {
        let dataClass: any;
        beforeAll(() => {
            dataClass = new DemoClass({}, ele);
        });
        it('saveChanges method call', () => {
            spyOn(objDemoClass1, 'saveChanges');
            spyOn(objDemoClass2, 'saveChanges');
            objDemoClass1.property2 = 'check';
            objDemoClass1.property2 = 'check';
            expect(objDemoClass1.saveChanges).toHaveBeenCalledWith('property2', 'check', 'default2');
            expect(objDemoClass1.saveChanges).toHaveBeenCalledTimes(1);
            expect(objDemoClass2.saveChanges).not.toHaveBeenCalled();
        });

        it('dataBind method call', () => {
            spyOn(dataClass, 'onPropertyChanged');
            dataClass.property2 = 'value1';
            dataClass.property3 = 'value2';
            dataClass.dataBind();
            expect(dataClass.onPropertyChanged).toHaveBeenCalledWith(
                { property2: 'value1', property3: 'value2' },
                { property2: 'default2', property3: undefined });
        });

        it('dataBind method call without property change', () => {
            spyOn(dataClass, 'onPropertyChanged');
            objDemoClass1.dataBind();
            dataClass.dataBind();
            expect(dataClass.onPropertyChanged).not.toHaveBeenCalled();
        });

    });

    describe('Methods', () => {
        beforeEach((done: Function) => {
            spyOn(objDemoClass1, 'onPropertyChanged');
            objDemoClass1.property2 = 'checknew';
            objDemoClass1.property3 = 'check3';
            setTimeout(() => {
                done();
            }, 0);
        });
        it('onPropertyChanged using normal method', () => {
            expect(objDemoClass1.onPropertyChanged).toHaveBeenCalledWith(
                { property2: 'checknew', property3: 'check3' },
                { property2: 'check', property3: undefined });
        });
    });

    describe('Methods', () => {
        beforeEach((done: Function) => {
            spyOn(objDemoClass1, 'onPropertyChanged');
            spyOn(objDemoClass2, 'onPropertyChanged');
            objDemoClass2.property2 = 'check';
            objDemoClass2.property3 = 'check3';
            setTimeout(() => {
                done();
            }, 0);
        });
        it('onPropertyChanged method multiple test', () => {
            expect(objDemoClass1.onPropertyChanged).not.toHaveBeenCalled();
            expect(objDemoClass2.onPropertyChanged).toHaveBeenCalledWith(
                { property2: 'check', property3: 'check3' },
                { property2: 'value2', property3: undefined });
        });
    });

    describe('Methods', () => {
        beforeEach((done: Function) => {
            spyOn(objDemoClass1, 'onPropertyChanged');
            objDemoClass1.setProperties({ property1: 'val1', property2: 'val2', property3: 'val3' });
            setTimeout(() => {
                done();
            }, 0);
        });
        it('setProperties method with out mute mode', () => {
            expect(objDemoClass1.onPropertyChanged).toHaveBeenCalledWith({ property1: 'val1', property2: 'val2', property3: 'val3' }, {
                'property1': 'default1',
                'property2': 'checknew',
                'property3': 'check3'
            });
        });
    });

    describe('Methods', () => {
        beforeEach((done: Function) => {
            spyOn(objDemoClass1, 'onPropertyChanged');
            objDemoClass1.setProperties({ property1: 'val11', property2: 'val12', property3: 'val13' }, true);
            setTimeout(() => {
                done();
            }, 0);
        });
        it('setProperties method with mute mode', () => {
            expect(objDemoClass1.onPropertyChanged).not.toHaveBeenCalled();
            expect(objDemoClass1.property1).toEqual('val11');
            expect(objDemoClass1.property2).toEqual('val12');
            expect(objDemoClass1.property3).toEqual('val13');
        });
    });

    describe('Methods', () => {
        beforeEach((done: Function) => {
            spyOn(objDemoClass1, 'onPropertyChanged');
            objDemoClass1.property1 = 'val11';
            objDemoClass1.destroy();
            setTimeout(() => {
                done();
            }, 0);
        });
        it('onproperty change after control destroy', () => {
            expect(objDemoClass1.onPropertyChanged).not.toHaveBeenCalled();
        });
    });

    describe('check setter for array of complex object', () => {
        let demoClassAr: DemoClass;
        beforeEach(() => {
            demoClassAr = new DemoClass({}, ele);
        });
        describe('Re assigning new array', () => {
            beforeEach((done: Function) => {
                demoClassAr.subjectCollection = [{ subID: '2', subScore: 22 }];
                demoClassAr.subjectCollection.push({ subID: '2', subScore: 22 })
                spyOn(demoClassAr, 'onPropertyChanged');
                setTimeout(() => { done(); }, 50);
            });
            it('', () => {
                expect((demoClassAr.subjectCollection as Object[]).length).toBe(2);
                expect(demoClassAr.subjectCollection[0].subID).toBe('2');
                expect(demoClassAr.subjectCollection[0].subScore).toBe(22);
                expect(demoClassAr.onPropertyChanged).toHaveBeenCalled();
            });
        });

        describe('Change the value of entries single level', () => {
            beforeEach((done: Function) => {
                spyOn(demoClassAr, 'onPropertyChanged');
                demoClassAr.subjectCollection[0].subID = '786';
                demoClassAr.dataBind();
                setTimeout(() => { done(); }, 50);
            });
            it('', () => {
                expect(demoClassAr.subjectCollection[0].subID).toBe('786');
                expect(demoClassAr.onPropertyChanged).toHaveBeenCalled();
            });
        });
        describe('change value in third level array triggers property changed', () => {
            describe('Reassigning new array', () => {
                beforeEach((done: Function) => {
                    spyOn(demoClassAr, 'onPropertyChanged');
                    demoClassAr.seriesCollection[0].points[0].marker1 = [{ fill: 'val1', visible: false }, { fill: 'val2', visible: true }];
                    demoClassAr.dataBind();
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(demoClassAr.onPropertyChanged).toHaveBeenCalled();
                    expect(demoClassAr.seriesCollection[0].points[0].marker1.length).toBe(2);
                });
            });
            describe('changed values in one of entries new array', () => {
                beforeEach((done: Function) => {
                    spyOn(demoClassAr, 'onPropertyChanged');
                    demoClassAr.seriesCollection[0].points[0].marker1[0].fill = 'value4';
                    demoClassAr.dataBind();
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(demoClassAr.onPropertyChanged).toHaveBeenCalled();
                    expect(demoClassAr.seriesCollection[0].points[0].marker1[0].fill).toBe('value4');
                });
            });
        })
    });
    describe('Creating the component using the builder', () => {
        let DemoBuilder2: any = <any>CreateBuilder(DemoClass);
        it('Assign value to simple properties using builder', () => {
            let evspy: jasmine.Spy = jasmine.createSpy('evspy');
            let DemoBuilder: any = <any>CreateBuilder(DemoClass);
            let component: DemoClass = new DemoBuilder('#ele').property1('testText').event1(evspy).create();
            expect(component.property1).toBe('testText');
            expect(component.event1).toEqual(evspy);
            component.trigger('event1');
            expect(evspy).toHaveBeenCalled();
        });
        it('Assign value to complex property single level with return type Object', () => {
            let DemoBuilder: any = <any>CreateBuilder(DemoClass);
            let component: any = new DemoBuilder('#ele').property1('testText').subject1((sd: any) => {
                sd.subID('sdd');
            }).create();
            expect(component.subject1.properties).toEqual({ subID: 'sdd' });

        });
        it('Assign value to complex property single level with return type Array', () => {
            let component2: any = new DemoBuilder2('#ele').property1('testText').subject1((sd: any) => {
                sd.subID('sdd').add();
            }).create();
            expect(component2.subject1[0]).toEqual({ subID: 'sdd' });

        });
        it('Assign value to complex property multi level with return type Object', () => {
            let DemoBuilder: any = <any>CreateBuilder(DemoClass);
            let component: any = new DemoBuilder('#ele').property1('testText').subject1((sd: any) => {
                sd.subID('sdd').preferedBook(
                    (p: any) => {
                        p.bookID('testId').author('NewAuthor');
                    });
            }
            ).create();
            expect(component.subject1.properties.preferedBook.properties).
                toEqual({ name: 'Book1', bookID: 'testId', author: 'NewAuthor' });
        });
    });
    describe('check events', () => {
        describe('Event set at instance creation triggers properly', () => {
            let eve: jasmine.Spy
            let eventObj: DemoClass;
            beforeEach(() => {
                eve = jasmine.createSpy('test');
                eventObj = new DemoClass({ event1: eve }, ele);
            });
            it('check the value is set to event properly', () => {
                expect(eventObj.event1).toEqual(eve);
            });
            it('event triggers properly', () => {
                eventObj.trigger('event1');
                expect(eve).toHaveBeenCalled();
            });
            it('check previous handler removes properly while assigning new value', () => {
                let tempEvent: jasmine.Spy = jasmine.createSpy('test2');
                eventObj.event1 = tempEvent;
                eventObj.trigger('event1');
                expect(eve).not.toHaveBeenCalled();
                expect(tempEvent).toHaveBeenCalled();
            });
            it('check event handler removes while value set to undefined', () => {
                eventObj.event1 = eve;
                eventObj.event1 = undefined;
                eventObj.trigger('event1');
                expect(eve).not.toHaveBeenCalled();
            });
        });
        describe('multi level events', () => {
            let eve1: jasmine.Spy;
            let eve2: jasmine.Spy;
            let eventObj: DemoClass;
            beforeEach(() => {
                eve1 = jasmine.createSpy('event1');
                eve2 = jasmine.createSpy('event2');
                eventObj = new DemoClass({}, ele);
            });
            it('add handler working properly in single level complex property', () => {
                eventObj.subject1.childEvent = eve1;
                eventObj.trigger('subject1-childEvent', { test: 1 });
                expect(eve1).toHaveBeenCalledWith({ name: 'subject1-childEvent', test: 1 });
            });
            it('remove handler working properly in single level complex property', () => {
                eventObj.subject1.childEvent = eve1;
                eventObj.subject1.childEvent = undefined;
                eventObj.trigger('subject1-childEvent', { test: 1 });
                expect(eve1).not.toHaveBeenCalled();
            });
            it('add handler working properly in second level complex property', () => {
                eventObj.subject1.preferedBook.level2event = eve1;
                eventObj.trigger('subject1-preferedBook-level2event', { test: 1 });
                expect(eve1).toHaveBeenCalledWith({ name: 'subject1-preferedBook-level2event', test: 1 });
            });
            it('remove handler working properly in second level complex property', () => {
                eventObj.subject1.preferedBook.level2event = undefined;
                eventObj.trigger('subject1-preferedBook-level2event', { test: 1 });
                expect(eve1).not.toHaveBeenCalled();
            });
        });

    });

    describe('complex factory decorators', () => {

        let eventObj: DemoClass;
        beforeEach(() => {
            eventObj = new DemoClass({}, ele);

        });
        it('get default class', () => {
            expect(eventObj.allType instanceof Subject).toBe(true);
        });
        it('set type class', () => {
            eventObj.allType = { name: '01', type: 'Book' };
            expect(eventObj.allType instanceof Book).toBe(true);
        });
        it('property change', () => {
            spyOn(eventObj, 'onPropertyChanged');
            (eventObj.allType as SubjectModel).subID = '02';
            eventObj.dataBind();
            expect(eventObj.onPropertyChanged).toHaveBeenCalled();
            expect((eventObj.allType as SubjectModel).subID).toBe('02');
        });

    });

    describe('collection factory decorators', () => {

        let eventObj: DemoClass;
        beforeEach(() => {
            eventObj = new DemoClass({}, ele);

        });
        it('set default class', () => {
            eventObj.allTypeCollection = <BookModel[]>[
                { bookID: '01', name: 'Book1', type: 'Book' },
                { bookID: '02', name: 'Book2', type: 'Book' }
            ]
            expect(eventObj.allTypeCollection[0] instanceof Book).toBe(true);
            expect(eventObj.allTypeCollection[1] instanceof Book).toBe(true);
        });
        it('property change', () => {
            eventObj.allTypeCollection = <BookModel[]>[
                { bookID: '01', name: 'Book1', type: 'Book' },
                { bookID: '02', name: 'Book2', type: 'Book' }
            ]
            eventObj.dataBind();
            spyOn(eventObj, 'onPropertyChanged');
            (<BookModel>eventObj.allTypeCollection[0]).bookID = '02';
            eventObj.dataBind();
            expect(eventObj.onPropertyChanged).toHaveBeenCalledWith(
                { allTypeCollection: { 0: { bookID: '02' } } },
                { allTypeCollection: { 0: { bookID: '01' } } });
        });
        it('set another type', () => {
            eventObj.allTypeCollection = <BookInfoModel[]>[
                { accessId: '001', type: 'Info' },
                { accessId: '002', type: 'Info' }
            ];
            eventObj.dataBind();
            expect(eventObj.allTypeCollection[0] instanceof BookInfo).toBe(true);
            expect(eventObj.allTypeCollection[1] instanceof BookInfo).toBe(true);

        });

        it('dynamic property change', () => {
            objDemoClass1.allTypeCollection = <BookInfoModel[]>[
                { accessId: '001', type: 'Info' },
                { accessId: '002', type: 'Info' }
            ];
            objDemoClass1.dataBind();
            expect(objDemoClass1.allTypeCollection[0].type instanceof Subject).toBe(true);
            objDemoClass1.allTypeCollection[0].type = { type: 'Book' };
            objDemoClass1.dataBind();
            expect(objDemoClass1.allTypeCollection[0].type instanceof Book).toBe(true);
        });

        it('Old value changes', () => {
            let event: DemoClass;
            event = new DemoClass({}, ele);
            let DefVal: object[] = [];
            let defaultvalue: object[] = [];
            let oldVal: object[] = [];
            let curVal: object[] = [];
            spyOn(event, 'onPropertyChanged');
            event.allTypeCollection = <BookModel[]>[
                { bookID: '01', name: 'Book1', type: 'Book' },
                { bookID: '02', name: 'Book2', type: 'Book' }
            ]
            event.onPropertyChanged = function (newChange, oldChange) {
                oldVal = newChange.allTypeCollection;
                DefVal = oldChange.allTypeCollection;
            };
            event.dataBind();
            expect(DefVal).toEqual(defaultvalue);
            event.allTypeCollection = <BookInfoModel[]>[
                { accessId: '001', type: 'Info' },
                { accessId: '002', type: 'Info' }
            ];
            event.onPropertyChanged = function (newChange, oldChange) {
                curVal= oldChange.allTypeCollection;
            };
            event.dataBind();
            expect(curVal).toEqual(oldVal);
        });
    });
});


