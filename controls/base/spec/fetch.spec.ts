import { Fetch } from '../src/fetch';
const link = 'https://api.example.com/data';
const contentType = 'application/json; charset=utf-8';
const fetchData = { name: 'John', age: 30 };

describe('fetch', () => {
    describe('constructor', () => {
        beforeAll(() => {
            // Spy on window.fetch method to mock default response object
            spyOn(window, 'fetch').and.returnValue(Promise.resolve({
                ok: true, 
                headers: { get: () => 'application/json' },
                json: () => Promise.resolve({ message: 'Mock response' })
            }));
        });

        it('Different input parameters', function (done) {
            // Create a new instance of Fetch class as url as string type
            let fetchObj = new Fetch(link, 'GET');
            expect(fetchObj.url).toEqual(link);
            expect(fetchObj.type).toEqual('GET');

            // Create a new instance of Fetch class as url as string type & assign type in instance
            fetchObj = new Fetch(link);
            fetchObj.type = 'GET';
            expect(fetchObj.url).toEqual(link);
            expect(fetchObj.type).toEqual('GET');

            // Create a new instance of Fetch class as url as object type
            fetchObj = new Fetch({
                'url': link,
                'type': 'POST',
                'contentType': contentType,
                'data': fetchData
            });
            fetchObj.send();
            expect(fetchObj.url).toEqual(link);
            expect(fetchObj.type).toEqual('POST');
            expect(fetchObj.contentType).toEqual(contentType);
            expect(fetchObj.data).toEqual(fetchData);

            // Create a new instance of Fetch class using request object
            let request = new Request(link, { method: 'GET' });
            fetchObj = new Fetch({'fetchRequest':request});
            expect(fetchObj.fetchRequest).toEqual(request);
            done();
        });

        it('beforeSend event', function (done) { 
            let doneFn = jasmine.createSpy('beforeSend').and.callFake((e: any) => {
                expect(doneFn).toHaveBeenCalled();
                e.cancel = true; done();
            });
            let fetchObj = new Fetch(link, 'GET');
            fetchObj.beforeSend = doneFn;
            fetchObj.send();
        });
    
        it('onLoad event', function (done) { 
            let doneFn = jasmine.createSpy('onLoad').and.callFake(() => {
                expect(doneFn).toHaveBeenCalled();
                done();
            }); 
            let fetchObj = new Fetch(link, 'GET');
            fetchObj.onLoad = doneFn;
            fetchObj.send();
        });

        it('GET method with onSuccess event', function (done) { 
            let doneFn = jasmine.createSpy('onSuccess').and.callFake((e: any) => {
                expect(doneFn).toHaveBeenCalled();
                expect(e.message).toEqual('Mock response');
                done();
            });
            let fetchObj = new Fetch(link, 'GET');
            fetchObj.onSuccess = doneFn;
            fetchObj.send();
        });

        it('POST method with onSuccess event', function (done) { 
            let doneFn = jasmine.createSpy('onSuccess').and.callFake((e: any) => {
                expect(doneFn).toHaveBeenCalled();
                expect(e.message).toEqual('Mock response');
                done();
            });
            let fetchObj = new Fetch(link, 'POST', contentType);
            fetchObj.onSuccess = doneFn;
            fetchObj.send(fetchData);
        });
    });

    it('onFailure event', function (done) { 
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            ok: false, 
            headers: { get: () => 'application/json' },
            json: () => Promise.resolve({ message: 'Mock response' })
        }));
        let doneFn = jasmine.createSpy('onFailure').and.callFake(() => {
            expect(doneFn).toHaveBeenCalled();
            done();
        });
        let fetchObj = new Fetch(link, 'GET');
        fetchObj.onFailure = doneFn;
        fetchObj.send();
    });
});
