import { Property, Complex, Collection, Event, INotifyPropertyChanged, NotifyPropertyChanges } from '../src/notify-property-change';
import { Base } from '../src/base';
import { createElement } from '../src/dom';
import { ChildProperty } from '../src/child-property';

/**
 * BookChild Class
 */
class BookChild extends ChildProperty<SubjectChild> {
    @Property('')
    public bookID?: string;

    @Property('')
    public name?: string;

    @Property('')
    public author?: string;
}

interface BookModel {
    bookID?: string;
    name?: string;
    author?: string;
}

interface SubjectModel {
    subID?: string;
    subScore?: number;
    practicalScore?: number;
    prefered?: BookModel;
    subClick?: Function;
    collection?: BookModel;
}

/**
 * SubjectChild
 */
class SubjectChild extends ChildProperty<SubjectChild> {
    @Property('')
    public subID: string;

    @Event()
    public subClick: Function;

    @Property(0)
    public subScore: number;

    @Property(0)
    public practicalScore: number;

    @Complex<BookModel>({ name: 'Book1' }, BookChild)
    public prefered: BookModel;

    @Collection<BookModel>([{ name: 'levl2name', bookID: 'snm' }], BookChild)
    public collection: BookModel[];

}

/**
 * Demo
 */
@NotifyPropertyChanges
class Demo extends Base<HTMLElement> implements INotifyPropertyChanged {

    @Property('')
    public name: string;

    @Property('')
    public id: string;

    @Event()
    public click: Function;

    @Complex<SubjectModel>({}, SubjectChild)
    public subject1: SubjectModel;

    @Collection<SubjectModel>([
        { subID: 'snm', subScore: 2 },
        { subID: 'test2', subScore: 34, prefered: { author: 'syncf', name: 'setter' } }
    ], SubjectChild)
    public subjectArray: SubjectModel[];

    protected getModuleName(): string {
        return 'demo';
    }

    constructor(ele: HTMLElement, options?: Object) {
        super((options ? options : {}), ele);
    }

    public onPropertyChanged(newProp: Object, oldProp: Object): void {
        let vde: number = 1;
        vde;
        /** No Code */
    }

}

let ele: HTMLElement = createElement('div', { id: 'ele1' });

describe('ChildProperty', () => {

    describe('complex property', (): void => {
        let demoClass1: Demo = new Demo(ele);
        let demoClass2: Demo = new Demo(ele);
        describe('getter', (): void => {
            it('check default value', () => {
                expect(demoClass1.subject1.prefered.name).toBe('Book1');
            });
        });

        describe('setter', (): void => {
            it('instance 1', () => {
                demoClass1.subject1.prefered.name = 'S1Book';
                expect(demoClass1.subject1.prefered.name).toBe('S1Book');
            });
            it('instance 2', () => {
                expect(demoClass2.subject1.prefered.name).toBe('Book1');
            });
        });

        describe('setter JSON value', (): void => {
            it('instance 1', () => {
                demoClass1.subject1.prefered = { bookID: '001', name: 'Book2' };
                expect(demoClass1.subject1.prefered.name).toBe('Book2');
                expect(demoClass1.subject1.prefered.bookID).toBe('001');
            });
            it('instance 2', () => {
                expect(demoClass2.subject1.prefered.name).toBe('Book1');
                expect(demoClass2.subject1.prefered.bookID).toBe('');
            });
        });
    });

    describe('onPropertyChanged call', (): void => {


        it('on child property initialize', (done: Function) => {
            let obj: Demo = new Demo(ele, { subject1: { prefered: { name: 'Social Science' } } });
            spyOn(obj, 'onPropertyChanged');
            setTimeout(() => {
                expect(obj.onPropertyChanged).not.toHaveBeenCalled();
                expect(obj.subject1.prefered.name).toBe('Social Science');
                done();
            }, 100)

        });

        it('set properties without change', () => {
            let obj: Demo = new Demo(ele);
            spyOn(obj, 'onPropertyChanged');
            obj.dataBind();
            expect(obj.onPropertyChanged).not.toHaveBeenCalled();
        });
    });

    describe('onPropertyChanged call', (): void => {
        it('dataBind', () => {
            let demoClass1: Demo = new Demo(ele);
            let demoClass2: Demo = new Demo(ele);
            spyOn(demoClass1, 'onPropertyChanged');
            spyOn(demoClass2, 'onPropertyChanged');
            demoClass1.subject1.prefered.name = 'Book3';
            demoClass1.dataBind();
            expect(demoClass1.onPropertyChanged).toHaveBeenCalledWith(
                { subject1: { prefered: { name: 'Book3' } } },
                { subject1: { prefered: { name: 'Book1' } } });
            expect(demoClass2.onPropertyChanged).not.toHaveBeenCalled();
        });
    });

    describe('onPropertyChanged call', (): void => {
        let demoClass3: Demo = new Demo(ele);
        let demoClass4: Demo = new Demo(ele);
        beforeEach((done: Function) => {
            spyOn(demoClass3, 'onPropertyChanged');
            spyOn(demoClass4, 'onPropertyChanged');
            demoClass3.subject1.prefered.name = 'Book3';
            setTimeout(() => { done(); }, 50);
        });
        it('timeout', () => {
            expect(demoClass3.onPropertyChanged).toHaveBeenCalledWith(
                { subject1: { prefered: { name: 'Book3' } } },
                { subject1: { prefered: { name: 'Book1' } } });
            expect(demoClass4.onPropertyChanged).not.toHaveBeenCalled();
        });
    });

    describe('onPropertyChanged call', (): void => {
        it('dataBind JSON bind value', () => {
            let demoClass1: Demo = new Demo(ele);
            let demoClass2: Demo = new Demo(ele);
            spyOn(demoClass1, 'onPropertyChanged');
            spyOn(demoClass2, 'onPropertyChanged');
            demoClass1.subject1 = { prefered: { name: 'Book3' } };
            demoClass1.dataBind();
            expect(demoClass1.onPropertyChanged).toHaveBeenCalledWith(
                { subject1: { prefered: { name: 'Book3' } } },
                { subject1: { prefered: { name: 'Book1' } } });
            expect(demoClass2.onPropertyChanged).not.toHaveBeenCalled();
        });
    });

    describe('onPropertyChanged call', (): void => {
        let demoClass3: Demo = new Demo(ele);
        let demoClass4: Demo = new Demo(ele);
        beforeEach((done: Function) => {
            spyOn(demoClass3, 'onPropertyChanged');
            spyOn(demoClass4, 'onPropertyChanged');
            demoClass3.subject1 = { prefered: { name: 'Book3' } };
            setTimeout(() => { done(); }, 50);
        });
        it('timeout JSON value', () => {
            expect(demoClass3.onPropertyChanged).toHaveBeenCalledWith(
                { subject1: { prefered: { name: 'Book3' } } },
                { subject1: { prefered: { name: 'Book1' } } });
            expect(demoClass4.onPropertyChanged).not.toHaveBeenCalled();
        });
    });
    describe('Object array implementation', (): void => {
        let demoClass3: Demo;
        beforeEach(() => {
            demoClass3 = new Demo(ele);
        });
        describe('check setter for object array', () => {
            describe('Change the value of entries multi level', () => {
                beforeEach((done: Function) => {
                    demoClass3.subjectArray[0].prefered.bookID = 'test';
                    spyOn(demoClass3, 'onPropertyChanged');
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(demoClass3.subjectArray[0].prefered.bookID).toBe('test');
                    expect(demoClass3.onPropertyChanged).toHaveBeenCalled();
                });
            });
            describe('Change the inner array value ', () => {
                beforeEach((done: Function) => {
                    demoClass3.subjectArray[0].collection[0].name = 'nameChanged';
                    spyOn(demoClass3, 'onPropertyChanged');
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(demoClass3.subjectArray[0].collection[0].name).toBe('nameChanged');
                    expect(demoClass3.onPropertyChanged).toHaveBeenCalled();
                });
            });

            describe('Assign new array value ', () => {
                let obj: Object = { bookID: '123', name: 'Collections' };
                let colAr: any = [];
                colAr.push(obj);
                beforeEach((done: Function) => {
                    demoClass3.subjectArray[0].collection = colAr;
                    spyOn(demoClass3, 'onPropertyChanged');
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(demoClass3.subjectArray[0].collection[0].properties).toEqual(obj);
                    expect(demoClass3.onPropertyChanged).toHaveBeenCalled();
                });
            });

            describe('collection event', () => {
                let obj: Object = { bookID: '123', name: 'Collections' };
                let colAr: any = [];
                colAr.push(obj);
                let spi: any;
                beforeEach((done: Function) => {
                    spi = jasmine.createSpy();
                    demoClass3.subjectArray[0].subClick = spi;
                    demoClass3.trigger('subjectArray[0].subClick')
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect(spi).toHaveBeenCalled();
                });
            });
        });
    });
});