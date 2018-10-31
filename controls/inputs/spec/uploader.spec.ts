/**
 * Uploader test cases.
 */
import { createElement, attributes, Browser, L10n, EmitType, isUndefined, detach } from '@syncfusion/ej2-base';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { Uploader } from '../src/uploader/uploader';

describe('Uploader Control', () => {
    describe('Basics', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            element.setAttribute('name', 'files');
            uploadObj = new Uploader({ autoUpload: false});
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('get module name', () => {
            expect(uploadObj.getModuleName()).toBe('uploader');
        });
        it('control class validation', () => {
            expect(uploadObj.element.classList.contains('e-control')).toBe(true);
            expect(uploadObj.element.classList.contains('e-uploader')).toBe(true);
        })
        it('default value validation', () => {
            expect(uploadObj.multiple).toBe(true);
            expect(uploadObj.autoUpload).toBe(false);
            expect(uploadObj.enableRtl).toBe(false);
            expect(uploadObj.enabled).toBe(true);
        })
        it('element structure testing', () => {
            expect(uploadObj.element.parentElement.classList.contains('e-file-select')).toBe(true);
            expect(uploadObj.browseButton.innerText).toEqual('Browse...');
            expect(uploadObj.uploadWrapper.classList.contains('e-upload')).toBe(true);
        })
        it('file selection validate', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(2);
        })        
        it('check li elements', () => {
            let liElement = uploadObj.listParent.querySelectorAll('li');
            expect(liElement.length).toBe(2);
            expect(liElement[0].classList.contains('e-upload-file-list')).toBe(true);
        })
        it('clear method test', () => {
            let liElement = uploadObj.listParent.querySelectorAll('li');
            expect(liElement.length).toBe(2);
            uploadObj.clearAll();
            expect(uploadObj.listParent).toBe(null);
        });
    });
  
    describe('API testing for', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {name: 'fileUpload'}});            
            document.body.appendChild(element);
            element.setAttribute('tabindex', '2');
            element.setAttribute('type', 'file');
            element.setAttribute('name', 'files');
            uploadObj = new Uploader({ 
                autoUpload: false, showFileList: false, 
                asyncSettings: {
                    saveUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'http://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('ShowFileList', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(0);
            expect(uploadObj.browseButton.getAttribute('tabindex')).toEqual('2');
        });        

        it('Auto Upload', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 151347452, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
            {name: "764.png", rawFile: "", size: 151, status: 'Ready to upload', statusCode: '1', type: 'png', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.autoUpload = true;
            uploadObj.dataBind();
            uploadObj.createFileList(fileList);             
            expect(uploadObj.uploadWrapper.querySelector('.e-file-upload-btn')).toBe(null);            
        });        
    });

    describe('preload file testing', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'}); 
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('files with autoUpload', () => {
            let preLoadFiles: any = [
                {name: 'ASP.Net books', size: 500, type: '.png'},
                {name: 'Movies', size: 12000, type: '.pdf'},
                {name: 'Study materials', size: 500000, type: '.docx'},
            ];
            uploadObj = new Uploader({ files: preLoadFiles });
            uploadObj.appendTo(document.getElementById('upload'));
            let liElements: HTMLElement[] = uploadObj.listParent.querySelectorAll('li');
            expect(liElements.length).toEqual(3);
            expect(liElements[0].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[2].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[1].querySelector('.e-icons').classList.contains('e-file-delete-btn')).toBe(true);
            expect(liElements[0].querySelector('.e-icons').getAttribute('title')).toEqual('Delete file');
            expect(uploadObj.getFilesData()[0].name).toEqual('ASP.Net books.png');
            expect(uploadObj.browseButton.getAttribute('tabindex')).toEqual('0');
        });
        it('Dynamically update files without autoUpload', () => {
            let preLoadFiles: any = [
                {name: 'Books', size: 500, type: '.png'},
                {name: 'Movies', size: 12000, type: '.pdf'},
                {name: 'Study materials', size: 500000, type: '.docx'},
            ];
            uploadObj = new Uploader({autoUpload: false});
            uploadObj.appendTo('#upload');
            expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
            uploadObj.files = preLoadFiles;
            uploadObj.dataBind();
            let liElements: HTMLElement[] = uploadObj.listParent.querySelectorAll('li');
            expect(liElements.length).toEqual(3);
            expect(liElements[0].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[2].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[1].querySelector('.e-icons').classList.contains('e-file-delete-btn')).toBe(true);
        });
        it('preload files in single file upload', () => {
            let preLoadFiles: any = [
                {name: 'Books', size: 500, type: '.png'},
                {name: 'Movies', size: 12000, type: '.pdf'},
                {name: 'Study materials', size: 500000, type: '.docx'},
            ];
            uploadObj = new Uploader({ autoUpload: false, multiple: false });
            uploadObj.appendTo('#upload');
            expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
            uploadObj.files = preLoadFiles;
            uploadObj.dataBind();
            let liElements: HTMLElement[] = uploadObj.listParent.querySelectorAll('li');
            expect(liElements.length).toEqual(1);
            expect(liElements[0].querySelector('.e-file-name').textContent).toEqual('Books');
            expect(liElements[0].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[0].querySelector('.e-file-status').textContent).toEqual('File uploaded successfully');
            expect(liElements[0].querySelector('.e-icons').classList.contains('e-file-delete-btn')).toBe(true);
        });
    })

    describe('onProperty changes ', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'}); 
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('buttons text change ', () => {
            uploadObj.buttons = {browse: 'Choose File', clear:'', upload: 'Load File'};
            uploadObj.dataBind();
            expect(uploadObj.buttons.browse).toBe('Choose File');
            expect(uploadObj.buttons.upload).toBe('Load File');
            expect(uploadObj.buttons.clear).toBe(''); 
        });
        it('enabled false ', () => {
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.enabled = false;
            uploadObj.dataBind();
            uploadObj.onSelectFiles();
            expect(uploadObj.enabled).toBe(false);
            expect(uploadObj.element.hasAttribute('disabled')).toBe(true);
            expect(uploadObj.uploadWrapper.classList.contains('e-disabled')).toBe(true);
            expect(uploadObj.browseButton.hasAttribute('disabled')).toBe(true);
        });
        it('enabled true ', () => {
            uploadObj.enabled = true;
            uploadObj.dataBind();
            expect(uploadObj.enabled).toBe(true);
            expect(uploadObj.element.hasAttribute('disabled')).toBe(false);
            expect(uploadObj.uploadWrapper.classList.contains('e-disabled')).toBe(false);
            expect(uploadObj.browseButton.hasAttribute('disabled')).toBe(false);
        });
        it('single file upload ', () => {
            uploadObj.multiple = false;
            uploadObj.dataBind();
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(1);
            expect(uploadObj.element.hasAttribute('multiple')).toBe(false);
        });
        it('upload method with single file upload ', (done) => {
            uploadObj.progressInterval = '1';
            uploadObj.dataBind();
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(1);
                expect(uploadObj.element.hasAttribute('multiple')).toBe(false);
                done();
            }, 1500);
        });
        it('upload method with single file without array type ', (done) => {
            uploadObj.progressInterval = '1';
            uploadObj.dataBind();
            uploadObj.upload(uploadObj.filesData[0]);
            setTimeout(() => {
                expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(1);
                expect(uploadObj.element.hasAttribute('multiple')).toBe(false);
                done();
            }, 1500);
        });
        it('upload method with single file without array type ', (done) => {
            uploadObj.progressInterval = '1';
            uploadObj.dataBind();
            uploadObj.upload(uploadObj.filesData[0]);
            setTimeout(() => {
                expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(1);
                expect(uploadObj.element.hasAttribute('multiple')).toBe(false);
                done();
            }, 1500);
        });
        it('upload method with multiple file upload ', (done) => {
            uploadObj.asyncSettings = { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save' };
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(1);
                expect(uploadObj.element.hasAttribute('multiple')).toBe(false);
                done();
            }, 1500);
        });
        it('rtl support enabled', () => {
            let previousButton: boolean = isNullOrUndefined(uploadObj.actionButtons);
            uploadObj.enableRtl = true;
            uploadObj.dataBind();
            expect(isNullOrUndefined(uploadObj.actionButtons)).toBe(previousButton);
            expect(uploadObj.enableRtl).toBe(true);
            expect(uploadObj.uploadWrapper.classList.contains('e-rtl')).toBe(true);
        });
        it('rtl support disabled', () => {
            let previousButton: boolean = isNullOrUndefined(uploadObj.actionButtons);
            uploadObj.enableRtl = false;
            uploadObj.dataBind();
            expect(uploadObj.enableRtl).toBe(false);
            expect(isNullOrUndefined(uploadObj.actionButtons)).toBe(previousButton);
            expect(uploadObj.uploadWrapper.classList.contains('e-rtl')).toBe(false);
        });
        it('enable auto upload ', () => {
            uploadObj.autoUpload = true;
            uploadObj.dataBind();
            expect(uploadObj.autoUpload).toBe(true);
        });
        it('auto upload false ', () => {
            uploadObj.autoUpload = false;
            uploadObj.dataBind();
            expect(uploadObj.autoUpload).toBe(false);
        });
        it('drop area set value ', () => {
            let dropElement: HTMLElement = createElement('div', {id: 'dropele'});
            document.body.appendChild(dropElement);
            uploadObj.dropArea = document.getElementById('dropele');
            uploadObj.dataBind();
            expect(uploadObj.dropAreaWrapper.querySelector('.e-file-drop').textContent).toEqual('');
        });
        it('drop area set null ', () => {
            uploadObj.dropArea = null;
            uploadObj.dataBind();
            expect(uploadObj.dropAreaWrapper.querySelector('.e-file-drop').textContent).toEqual('Or drop files here');
        });
        it('set allowed extensions ', () => {
            uploadObj.allowedExtensions = '.pdf';
            uploadObj.dataBind();
            expect(uploadObj.allowedExtensions).toBe('.pdf');
            expect(uploadObj.element.getAttribute('accept')).toEqual('.pdf');
        });
        it('set empty string to allowed extensions ', () => {
            uploadObj.allowedExtensions = '';
            uploadObj.dataBind();
            expect(uploadObj.allowedExtensions).toBe('');
            expect(uploadObj.element.getAttribute('accept')).toEqual('');
        });
        it('set min file size ', () => {
            uploadObj.minFileSize = 20000;
            uploadObj.dataBind();
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 200, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            let message : any = uploadObj.validatedFileSize(200);
            expect(message.minSize).toEqual('File size is too small');
        });
        it('set max file size ', () => {
            uploadObj.maxFileSize = 20000000;
            uploadObj.dataBind();
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 1500000000, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            let message : any = uploadObj.validatedFileSize(1500000000);
            expect(message.maxSize).toEqual('File size is too large');
        });
        it('multiple file upload ', () => {
            uploadObj.multiple = true;
            uploadObj.dataBind();
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.uploadWrapper.querySelectorAll('li').length).toBe(2);
            expect(uploadObj.element.hasAttribute('multiple')).toBe(true);
        });        
        it('change the save and remove urls ', () => {
            uploadObj.asyncSettings = { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save', removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'};
            uploadObj.dataBind();
            expect(uploadObj.asyncSettings.saveUrl).toEqual('https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save');
            expect(uploadObj.asyncSettings.removeUrl).toEqual('https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove');
        });
        it('change DirectoryUpload property ', () => {
            uploadObj.directoryUpload = true;
            uploadObj.dataBind();
            expect(uploadObj.element.hasAttribute('directory')).toBe(true);
            expect(uploadObj.element.hasAttribute('webkitdirectory')).toBe(true);
        });
    });

    describe('destroy method', () => {
        let uploadObj: any;
        let uploadele: HTMLElement;
        beforeEach((): void => {
            uploadele = createElement('input', {id: 'upload'}); 
            document.body.appendChild(uploadele);
            uploadele.setAttribute('type', 'file');
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('destroy uploader', () => {
            uploadObj = new Uploader();
            uploadObj.appendTo(uploadele);
            expect(uploadele.classList.contains('e-control')).toBe(true);
            expect(uploadele.classList.contains('e-uploader')).toBe(true);
            uploadObj.destroy();
            expect(uploadele.classList.contains('e-control')).toBe(false);
            expect(uploadele.classList.contains('e-uploader')).toBe(false);
            expect(uploadele.hasAttribute('multiple')).toBe(false);
        });
        it('set multiple at initial', () => {
            let multiple: Attr = document.createAttribute('multiple');
            uploadele.setAttributeNode(multiple);
            uploadObj = new Uploader();
            uploadObj.appendTo(uploadele);
            expect(uploadele.classList.contains('e-uploader')).toBe(true);
            expect(uploadele.hasAttribute('multiple')).toBe(true);
            uploadObj.destroy();
            expect(uploadele.hasAttribute('multiple')).toBe(true);
            expect(uploadele.classList.contains('e-uploader')).toBe(false);
        });
        it('with initial attributes', () => {
            uploadele.setAttribute('disabled', 'disabled');
            uploadele.setAttribute('accept', '.png');
            uploadObj = new Uploader();
            uploadObj.appendTo(uploadele);
            expect(uploadele.classList.contains('e-uploader')).toBe(true);
            expect(uploadObj.multiple).toBe(true);
            expect(uploadObj.allowedExtensions).toEqual('.png');
            expect(uploadObj.enabled).toEqual(false);
            uploadObj.destroy();
            expect(uploadele.hasAttribute('multiple')).toBe(false);
            expect(uploadele.hasAttribute('accept')).toBe(true);
            expect(uploadele.hasAttribute('disabled')).toBe(true);
            expect(uploadele.classList.contains('e-uploader')).toBe(false);
        })
    })

    describe('Angular tag', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('div', { id: 'parentEle' });
            element.innerHTML = "<ejs-uploader id='ngUploader'></ejs-uploader>";
            document.body.appendChild(element);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Initial rendering', () => {
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('ngUploader'));
            expect(uploadObj.uploadWrapper.classList.contains('e-upload')).toBe(true);
            expect(uploadObj.uploadWrapper.parentElement.tagName).toBe('EJS-UPLOADER');
            expect(uploadObj.element.hasAttribute('type')).toBe(true);
            expect(uploadObj.element.getAttribute('type')).toBe('file');
        });
    })

    describe('dropArea testing', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'}); 
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            let dropElement: HTMLElement = createElement('div', {id: 'dropele'});
            document.body.appendChild(dropElement);
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('dropArea as other then parent element', () => {
            uploadObj = new Uploader({autoUpload: false, dropArea: document.getElementById('dropele') });
            uploadObj.appendTo(document.getElementById('upload'));
            expect(uploadObj.dropAreaWrapper.querySelector('.e-file-drop').textContent).toBe('');
        });
        it('dropArea as parent element', () => {
            let element1: HTMLElement = createElement('input', {id: 'upload1'}); 
            document.getElementById('dropele').appendChild(element1);
            element1.setAttribute('type', 'file');
            uploadObj = new Uploader({autoUpload: false, dropArea: document.getElementById('dropele') });
            uploadObj.appendTo(document.getElementById('upload1'));
            expect(uploadObj.dropAreaWrapper.querySelector('.e-file-drop').textContent).toBe('Or drop files here');
        });
        it('drag hover ', () => {
            let dragEventArgs: any = { preventDefault: (): void => {}, action: null, target: null, stopPropagation: (): void => {}, };
            uploadObj.dragHover(dragEventArgs);
            expect(uploadObj.dropZoneElement.classList.contains('e-upload-drag-hover')).toBe(true);
        })
        it('drag leave ', () => {
            uploadObj.onDragLeave();
            expect(uploadObj.dropZoneElement.classList.contains('e-upload-drag-hover')).toBe(false);
        });
        it('drop element ', () => {
            uploadObj = new Uploader({ autoUpload: false, allowedExtensions: '.png' });
            uploadObj.appendTo('#upload');
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let dragEventArgs: any = { preventDefault: (): void => {}, dataTransfer: {files: [fileObj, fileObj1]}, type: 'drop', stopPropagation:(): void => {} };
            uploadObj.dropElement(dragEventArgs);
            expect(uploadObj.dropZoneElement.classList.contains('e-upload-drag-hover')).toBe(false);
            let firstChild: HTMLElement = uploadObj.listParent.children[0]; 
            expect(firstChild.querySelector('.e-file-name').getAttribute('title')).toBe('image.png');
            expect(firstChild.querySelector('.e-file-type').textContent).toBe('.png');
            expect(firstChild.querySelector('.e-file-status').textContent).toBe('Ready to upload');
            let lastChild: HTMLElement = uploadObj.listParent.children[1];
            expect(lastChild.querySelector('.e-file-name').getAttribute('title')).toBe('last.txt');
            expect(lastChild.querySelector('.e-file-type').textContent).toBe('.txt');
            expect(lastChild.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
        });
        it('drop element with select event file customization ', () => {
            uploadObj = new Uploader({ autoUpload: false, allowedExtensions: '.png' });
            uploadObj.appendTo('#upload');
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let dragEventArgs: any = { preventDefault: (): void => {}, dataTransfer: {files: [fileObj]}, type: 'drop', stopPropagation:(): void => {} };
            uploadObj.dropElement(dragEventArgs);
            expect(uploadObj.dropZoneElement.classList.contains('e-upload-drag-hover')).toBe(false);
            let lastChild: HTMLElement = uploadObj.listParent.children[0];
            expect(lastChild.querySelector('.e-file-name').getAttribute('title')).toBe('last.txt');
            expect(lastChild.querySelector('.e-file-type').textContent).toBe('.txt');
            expect(lastChild.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
            let fileList = [uploadObj.filesData[0], {name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.selected = function (args: any) {
                args.isModified = true,
                args.modifiedFilesData = fileList,
                args.progressInterval = '30'
            }
            uploadObj.dataBind();
            uploadObj.dropElement(dragEventArgs);
            let firstChild: HTMLElement = uploadObj.listParent.children[1];
            expect(uploadObj.listParent.querySelectorAll('li').length).toEqual(2); 
            expect(firstChild.querySelector('.e-file-name').getAttribute('title')).toBe('7z938-x64.msi');
            expect(firstChild.querySelector('.e-file-type').textContent).toBe('.msi');
            expect(firstChild.querySelector('.e-file-status').textContent).toBe('File type is not allowed');
            
        });
    })

    describe('Interactions', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'}); 
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
        document.body.innerHTML = '';
        });
        it('default button text', () => {
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('upload'));
            expect(uploadObj.localizedTexts('Browse')).toBe('Browse...');
            expect(uploadObj.localizedTexts('Upload')).toBe('Upload');
            expect(uploadObj.localizedTexts('Clear')).toBe('Clear');
        });
        it('buttons with text', () => {
            uploadObj = new Uploader({autoUpload: false, buttons: {browse: 'Choose File', clear:'', upload: 'Load File'}});
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["demo file"], "first.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.buttons.browse).toBe('Choose File');
            expect(uploadObj.browseButton.innerText).toBe('Choose File');
            expect(uploadObj.buttons.upload).toBe('Load File');
            expect(uploadObj.uploadButton.innerText).toBe('Load File');
            expect(uploadObj.clearButton.innerText).toBe('');
            expect(uploadObj.buttons.clear).toBe(''); 
        });
        it('buttons with HTMLElements', (done) => {
            let item1 = createElement('span', { id: 'item1', className: 'select'});
            document.body.appendChild(item1);
            let item2 = createElement('span', { id: 'item2', className: 'load'});
            document.body.appendChild(item2);
            let item3 = createElement('span', { id: 'item3', className: 'clear'});
            document.body.appendChild(item3);
            uploadObj = new Uploader({autoUpload: false, buttons: {
                browse: document.getElementById('item1'),
                clear:document.getElementById('item3'),
                upload: document.getElementById('item2')},
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            expect(uploadObj.buttons.browse.classList.contains('select')).toBe(true);
            expect(uploadObj.buttons.upload.classList.contains('load')).toBe(true);
            expect(uploadObj.buttons.clear.classList.contains('clear')).toBe(true);
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.browseButtonClick();
            uploadObj.uploadButtonClick();
            setTimeout(() => {
                expect(uploadObj.filesData[0].status).not.toBe('Ready to upload');
                expect(uploadObj.filesData[0].statusCode).not.toBe('1');
                done();
            }, 1500)
        });
        it('enable multiple at initial rendering', () => {
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('upload'));
            expect(uploadObj.multiple).toBe(true);
            expect(uploadObj.element.hasAttribute('multiple')).toBe(true);
            uploadObj.setMultipleSelection();
            expect(uploadObj.element.hasAttribute('multiple')).toBe(true);
        })
        it('disable multiple at initial rendering', () => {
            uploadObj = new Uploader({autoUpload: false, multiple: false });
            uploadObj.appendTo(document.getElementById('upload'));
            expect(uploadObj.multiple).toBe(false);
            expect(uploadObj.element.hasAttribute('multiple')).toBe(false); 
        });
        it('name truncate', () => {
            let element: HTMLElement = createElement('div', {id:'name'});
            element.textContent = 'ChatLog 190841  _  Incident 188885 is not closed_ The drop down selected value is not selected_ 2017_11_16 15_34.rtf';
            let parentElement: HTMLElement = createElement('div', {id:'Parentname'});
            parentElement.style.width = '250px';
            parentElement.style.overflow = 'hidden';
            parentElement.style.textOverflow = 'ellipsis';
            parentElement.style.whiteSpace = 'nowrap';
            parentElement.appendChild(element);
            document.body.appendChild(parentElement);
            document.body.style.width = '500px';
            uploadObj.truncateName(element);
            expect(element.hasAttribute('data-tail')).toBe(true);
        })
    });

    describe('sorting', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'}); 
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader();
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('sorting drop files', () => {
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.listParent.children[0].querySelector('.e-file-name').textContent).toBe('last');
        });
        it('2nd time drop files for sorting', () => {
            let fileObj: File = new File(["example"], "awesews.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["demos"], "first.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.listParent.children[0].querySelector('.e-file-name').textContent).toBe('last');
            expect(uploadObj.listParent.children[3].querySelector('.e-file-name').textContent).toBe('first');
        });
    })

    describe('Events', () => {
        let uploadObj: any;
        let select: EmitType<Object> = jasmine.createSpy('selected');
        let clear: EmitType<Object> = jasmine.createSpy('clearing');
        let remove: EmitType<Object> = jasmine.createSpy('removing');
        let originalTimeout: number;
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                selected: select, multiple: true, clearing: clear, removing: remove, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Selected event trigger', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(select).toHaveBeenCalled();
            expect(uploadObj.fileList.length).toEqual(2);            
        });
        it('Clear event triggered', () => {
            uploadObj.clearAll();
            expect(clear).toHaveBeenCalled();
            expect(uploadObj.fileList.length).toEqual(0);
        });
        it('Remove the selected files ', () => {
            let fileObj: File = new File(["Nice One"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "image.png", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let removeEventArgs = { type: 'click', target: (uploadObj.fileList[0]).children[1], preventDefault: (): void => { } };
            uploadObj.removeFiles(removeEventArgs);
            expect(remove).toHaveBeenCalled();
            expect(uploadObj.fileList.length).toEqual(1);
            expect(uploadObj.filesData.length).toEqual(1);
        });
    });
    describe('Event canceling ', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Selected event canceled', () => {
            uploadObj = new Uploader({ selected: function(e: any) {
                e.cancel = true
            } });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.listParent).toBe(undefined);
            expect(uploadObj.actionButtons).toBe(undefined);
        });
        it('Removing event canceled', () => {
            let uploadObj1: any = new Uploader({ autoUpload: false, removing: function(e: any) {
                e.cancel = true
            } });
            uploadObj1.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj1.onSelectFiles(eventArgs);
            expect(uploadObj1.listParent).not.toBe(undefined);
            expect(uploadObj1.actionButtons).not.toBe(undefined);
            expect(uploadObj1.listParent.querySelectorAll('li').length).toEqual(1);
            uploadObj1.remove(uploadObj1.filesData);
            expect(uploadObj1.listParent).not.toBe(undefined);
            expect(uploadObj1.actionButtons).not.toBe(undefined);
            expect(uploadObj1.listParent.querySelectorAll('li').length).toEqual(1);
        });
        it('clearing event canceled', () => {
            let uploadObj2: any = new Uploader({ autoUpload: false, clearing: function(e: any) {
                e.cancel = true
            } });
            uploadObj2.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj2.onSelectFiles(eventArgs);
            expect(uploadObj2.listParent).not.toBe(undefined);
            expect(uploadObj2.actionButtons).not.toBe(undefined);
            expect(uploadObj2.fileList.length).toBe(1);
            expect(uploadObj2.filesData.length).toBe(1);
            expect(uploadObj2.listParent.querySelectorAll('li').length).toEqual(1);
            uploadObj2.clearAll();
            expect(uploadObj2.listParent).not.toBe(undefined);
            expect(uploadObj2.actionButtons).not.toBe(undefined);
            expect(uploadObj2.fileList.length).toBe(1);
            expect(uploadObj2.filesData.length).toBe(1);
            expect(uploadObj2.listParent.querySelectorAll('li').length).toEqual(1);
        });
        it('Uploading event cancel', (done) => {
            let uploadObj2: any = new Uploader({ uploading: function(e: any) {
                e.cancel = true
            } });
            uploadObj2.appendTo(document.getElementById('upload'));
            uploadObj2.asyncSettings = { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'};
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj2.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(uploadObj2.getFilesData()[0].statusCode).toBe('5');
                done();
            }, 500);
        });   
        it('Uploading event cancel in chunk upload', (done) => {
            let uploadObj2: any = new Uploader({ uploading: function(e: any) {
                e.cancel = true
            } });
            uploadObj2.appendTo(document.getElementById('upload'));
            uploadObj2.asyncSettings = { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save', chunkSize: 1};
            let fileObj: File = new File(["Nice two"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj2.onSelectFiles(eventArgs);
            setTimeout(() => {
                expect(uploadObj2.getFilesData()[0].statusCode).toBe('5');
                done();
            }, 500);
        });     
        it('args.cancel in cancel event', (done) => {
            uploadObj = new Uploader({
                multiple: true, autoUpload: false, canceling: function(e: any) {
                    e.cancel = true
                },
                asyncSettings: { 
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1, retryAfterDelay: 0 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.uploadWrapper.querySelector('.e-file-abort-btn').click();
                setTimeout(() => {
                    expect(uploadObj.filesData[0].statusCode).not.toEqual('5');
                    let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                    expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(false);
                    done();
                }, 500);
            }, 700);
        });
    })
    describe('Methods', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('getFileType ', () => {
            let fileName: string = 'Rose.png';
            let extension: string = uploadObj.getFileType(fileName);
            expect(extension).toEqual('png');
        });
        it('checkAutoUpload ', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.checkAutoUpload(eventArgs);
            expect(uploadObj.actionButtons.style.display).toBe("");
        })
        it('onSelectFiles ', () => {            
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(2); 
        })
        it('Clear ', () => {
            uploadObj.clearAll();
            expect(uploadObj.fileList.length).toEqual(0);            
        });
        it('getFilesData ', () => {
            let data = uploadObj.getFilesData();
            expect(data).toEqual(uploadObj.filesData);
        })
        it('getPersistData method ', () => {
            let stringItems: any = uploadObj.getPersistData();
            expect(stringItems.length).toBe(2);
        });
        it('format the size in KB ', () => {
            let size: string = uploadObj.bytesToSize(20000);
            expect(size).toEqual('19.5 KB');
        });
        it('format the size in MB ', () => {
            let size: string = uploadObj.bytesToSize(2000000);
            expect(size).toEqual('1.9 MB');
        });
        it('format the 0 size file ', () => {
            let size: string = uploadObj.bytesToSize(0);
            expect(size).toEqual('0.0 KB');
        });
        it('format the large size ', () => {
            let size: string = uploadObj.bytesToSize(1500000000);
            expect(size).toEqual('1430.5 MB');
        });
        it('remove the uploaded files', () => {
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let selectEventArgs: any = { preventDefault: (): void => {}, target: {files: [fileObj]}, type: 'click', stopPropagation:(): void => {} };
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, statusCode: '2', status: 'File uploaded successfully', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.uploadedFilesData.push(fileList);
            uploadObj.selected = function (args: any) {
                args.isModified = true,
                args.modifiedFilesData = fileList,
                args.progressInterval = '30'
            }
            uploadObj.asyncSettings = { removeUrl: 'js.syncfusion.comm' };
            uploadObj.dataBind();
            uploadObj.onSelectFiles(selectEventArgs);
            expect(uploadObj.listParent.children[0].querySelector('.e-file-status').textContent).toBe('File uploaded successfully');
            expect(uploadObj.uploadedFilesData.length).toBe(1);
            createSpinner({target: uploadObj.uploadWrapper.querySelector('.e-file-delete-btn') as HTMLElement});
            showSpinner(uploadObj.uploadWrapper.querySelector('.e-file-delete-btn') as HTMLElement);
            uploadObj.remove(fileList);
            // setTimeout(() => {
            //     expect(uploadObj.uploadedFilesData.length).toBe(0);
            //     expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
            //     done();
            // }, 1500);
        })
     });

    describe('Localization', () => {
        let uploadObj: any;
        beforeAll((): void => {
            L10n.load({
                'fr-BE': {
                   'uploader' : {
                    'Browse' : 'Feuilleter',
                    'Clear' : 'clair',
                    'Upload' : 'télécharger',
                    'dropFilesHint' : 'ou Déposez les fichiers ici',
                    'readyToUploadMessage' : 'Prêt à télécharger',
                    'inProgress' : 'Télécharger en cours', 
                    'uploadFailedMessage' : 'Impossible d`importer le fichier',
                    'uploadSuccessMessage' : 'Fichiers chargés avec succès',
                    'invalidMaxFileSize' : 'La taille du fichier est trop grande',
                    'invalidMinFileSize' : 'La taille du fichier est trop petite',
                    'invalidFileType' : 'File type is not allowed'
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, locale: 'fr-BE', minFileSize: 15000, maxFileSize: 150000 });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Button Text', () => {
            expect(uploadObj.browseButton.innerText).toEqual('Feuilleter');
            let localeText : string = 'ou Déposez les fichiers ici';
            expect(uploadObj.uploadWrapper.querySelector('.e-file-drop').textContent).toBe(localeText);
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 1513472, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            let message : any = uploadObj.validatedFileSize(1513472);
            expect(message.maxSize).toEqual('La taille du fichier est trop grande');
        })
    });
    describe('Allowed Extenstions and File size validation', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ allowedExtensions: '.html, .png', minFileSize: 1500000, maxFileSize: 150000000, enableRtl: true });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Extensions API', () => {
            let ele : Element = uploadObj.element;
            expect(ele.getAttribute('accept')).toEqual('.html, .png');
        })
        it('Min File Size', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            let message : any = uploadObj.validatedFileSize(15);
            expect(message.minSize).toEqual('File size is too small');
        })
        it('Max File Size', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 1500000000, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            let message : any = uploadObj.validatedFileSize(1500000000);
            expect(message.maxSize).toEqual('File size is too large');
        })
        it('Enable RTL', () => {
            expect(uploadObj.uploadWrapper.classList.contains('e-rtl')).toBe(true);
        })
        it ('disable upload button supports', () => {
            uploadObj.autoUpload = false;
            uploadObj.dataBind();      
            let fileObj: File = new File(["Nice One"], "saple.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "dmo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.uploadButton.hasAttribute('disabled')).toBe(true);
        })
        it ('again enable the upload button', () => {
            uploadObj.minFileSize = 0;
            uploadObj.dataBind();
            let fileObj1: File = new File(["2nd File"], "dmo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.uploadButton.hasAttribute('disabled')).toBe(true);
            uploadObj.destroy();
        })
    })
    
    describe('File List Template UI', () => {
        let uploadObj: any;       
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            let item1 = createElement('span', { id: 'item1', className: 'select', innerHTML: "Select"});
            document.body.appendChild(item1);
            let item2 = createElement('span', { id: 'item2', className: 'load', innerHTML: 'Load'});
            document.body.appendChild(item2);
            let item3 = createElement('span', { id: 'item3', className: 'clear', innerHTML: 'Clear Data'});
            document.body.appendChild(item3);
            uploadObj = new Uploader({  
                buttons: {
                    browse: document.getElementById('item1'),
                    upload: document.getElementById('item2'),
                    clear: document.getElementById('item3'),
                },
                template: "<div class='wrapper'><table><tbody><tr><td><span class='file-name'>${name}</span></td><td><span class='file-size'>${size} bytes</span></td></tr></tbody></table></div>" 
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Initial template support', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            expect(uploadObj.uploadWrapper.querySelector('li').querySelector('.file-name').textContent).toEqual('7z938-x64.msi');
            expect(uploadObj.uploadWrapper.querySelector('li').querySelector('.file-size').textContent).toEqual('15 bytes');
        });
        it('template with file rendering ', () => {            
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(3);
            uploadObj.upload(uploadObj.filesData[0]);
        });
        it('Template changed dynamically', () => {
            uploadObj.template = "<span class='wrapper'></span><span class='icon file-icon ${type}'></span><span class='name file-name'>${name}</span>"
            uploadObj.dataBind();
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toBe(1);
            //expect(uploadObj.listParent.querySelector('li').children.length).toBe(3);
        })
        it ('uploadFailed method', () => {
            let fileObj: File = new File(["Nicee1"], "ChatLog 192680_Dropdown value property binding is not working in case the dropdown contains large number.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let uploadEventArgs = { type: 'click', target: (uploadObj.fileList[0]), preventDefault: (): void => { } };
            uploadObj.uploadFailed(uploadEventArgs, uploadObj.filesData[1]);    
            expect(uploadObj.filesData[1].status).toEqual('File failed to upload');
        });        
    })
     
    describe('File List Template UI with ID', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = "<div class='wrapper'><table><tbody><tr><td><span class='file-name'>${name}</span></td><td><span class='file-size'>${size} bytes</span><span class='e-file-delete-btn e-spinner-pane' style='display:block;height:30px; width: 30px;'></span></td></tr></tbody></table></div>";
            document.body.appendChild(template);
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({  template: "#template" });
            
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Template support with ID', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            expect(uploadObj.uploadWrapper.querySelector('li').querySelector('.file-name').textContent).toEqual('7z938-x64.msi');
            expect(uploadObj.uploadWrapper.querySelector('li').querySelector('.file-size').textContent).toEqual('15 bytes');
        })
        it ('customTemplate with uploader', () => {
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg: any = { type: 'click', target: {files: [ fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            let length: number = uploadObj.filesData.length;
            uploadObj.removeFilesData(uploadObj.filesData[0], true);
            expect(uploadObj.filesData.length).toBe(length);
            let event = { type: 'click', target: {files: [uploadObj.filesData[0]]}, preventDefault: (): void => { } };
            createSpinner({target: uploadObj.uploadWrapper.querySelector('.e-file-delete-btn')});
            showSpinner(uploadObj.uploadWrapper.querySelector('.e-file-delete-btn'));
            expect(isNullOrUndefined(uploadObj.uploadWrapper.querySelector('.e-spinner-pane'))).toBe(false);
        });

        it ('FilesData value when enabling showFileList', () => {
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg: any = { type: 'click', target: {files: [ fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            let length: number = uploadObj.filesData.length;
            uploadObj.removeFilesData(uploadObj.filesData[0], true);
            expect(uploadObj.filesData.length).toBe(length);
            let event = { type: 'click', target: {files: [uploadObj.filesData[0]]}, preventDefault: (): void => { } };
            createSpinner({target: uploadObj.uploadWrapper.querySelector('.e-file-delete-btn')});
            showSpinner(uploadObj.uploadWrapper.querySelector('.e-file-delete-btn'));
            expect(isNullOrUndefined(uploadObj.uploadWrapper.querySelector('.e-spinner-pane'))).toBe(false);
        });
    })

    describe('File List Template UI with ID', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = "<div class='wrapper'><table><tbody><tr><td><span class='file-name'>${name}</span></td><td><span class='file-size'>${size} bytes</span><span class='e-file-delete-btn e-spinner-pane' style='display:block;height:30px; width: 30px;'></span></td></tr></tbody></table></div>";
            document.body.appendChild(template);
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ showFileList: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it ('FilesData value when enabling showFileList', () => {
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg: any = { type: 'click', target: {files: [ fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            let length: number = uploadObj.filesData.length;
            expect(uploadObj.filesData.length).toBe(1);
            uploadObj.removeFilesData(uploadObj.filesData[0], true);
            expect(uploadObj.filesData.length).toBe(0);
        });
    })



   
    describe('Disable', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, enabled: false  });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Control Disable State', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            expect(uploadObj.uploadWrapper.classList.contains('e-disabled')).toBe(true);
            expect(uploadObj.browseButton.hasAttribute('disabled')).toBe(true);
            expect(uploadObj.element.hasAttribute('disabled')).toBe(true);
        })
        it('Control Disable with remove files method', () => {
            expect(uploadObj.listParent.querySelectorAll('li').length).toEqual(1);
            let removeEventArgs = { type: 'click', target: (uploadObj.fileList[0]).children[1], preventDefault: (): void => { } };
            uploadObj.removeFiles(removeEventArgs);
            expect(uploadObj.listParent.querySelectorAll('li').length).toEqual(1);
        })
        it('Control Disable with drag hover', () => {
            let dragEventArgs: any = { preventDefault: (): void => {}, action: null, target: null, stopPropagation: (): void => {}, };
            uploadObj.dragHover(dragEventArgs);
            expect(uploadObj.dropZoneElement.classList.contains('e-upload-drag-hover')).toBe(false);
        })
    })
    describe('Enable', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false  });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Control enable state', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            expect(uploadObj.uploadWrapper.classList.contains('e-disabled')).toBe(false);
            expect(uploadObj.browseButton.hasAttribute('disabled')).toBe(false);
            expect(uploadObj.element.hasAttribute('disabled')).toBe(false);
        })
    })
    describe('KeyBoard Navigation', () => {
        let uploadObj: any;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        let iconElement : any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                autoUpload: false, 
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('set focus to browse button', () => {
            expect(document.activeElement).not.toBe(uploadObj.browseButton);
            uploadObj.browseButton.focus();
            expect(document.activeElement).toBe(uploadObj.browseButton);
        });
        it('remove focus from browse button', () => {
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.browseButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).not.toBe(uploadObj.browseButton);
        });
        it('focus to first element clear icon ', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
                            {name: "default.html", rawFile: "", size:185675, status: 'Ready to upload', statusCode: '1', type: 'html', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.renderActionButtons();
            uploadObj.filesData = fileList;
            uploadObj.browseButton.focus();
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.browseButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            iconElement = uploadObj.listParent.querySelectorAll('.e-icons');
            expect(iconElement[0].classList.contains('e-clear-icon-focus')).toBe(true);
            expect(document.activeElement).not.toBe(uploadObj.browseButton);
        });
        it('focus to 2nd element clear icon ', () => {
            expect(document.activeElement).toBe(iconElement[0]);
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = iconElement[0];
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[0].classList.contains('e-clear-icon-focus')).toBe(false);
            expect(iconElement[1].classList.contains('e-clear-icon-focus')).toBe(true);
        });
        it('set focus to previous element ', () => {
            keyboardEventArgs.action = 'previous';
            keyboardEventArgs.target = iconElement[1];
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[0].classList.contains('e-clear-icon-focus')).toBe(true);
            expect(iconElement[1].classList.contains('e-clear-icon-focus')).toBe(false);
            expect(document.activeElement).toBe(iconElement[0]);
        })
        it('set focus to browse button from list items', () => {
            keyboardEventArgs.action = 'previous';
            keyboardEventArgs.target = iconElement[0];
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[0].classList.contains('e-clear-icon-focus')).toBe(false);
            expect(document.activeElement).toBe(uploadObj.browseButton);            
        })
        it('Again focus to 2nd element clear icon ', () => {
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.browseButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = iconElement[0];
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[1].classList.contains('e-clear-icon-focus')).toBe(true);
        });
        it('focus to clear button ', () => {
            expect(document.activeElement).toBe(iconElement[1]);
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = iconElement[1];
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[1].classList.contains('e-clear-icon-focus')).toBe(false);
            expect(document.activeElement).toBe(uploadObj.clearButton);
        });
        it('focus to upload button', () => {
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.clearButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).toBe(uploadObj.uploadButton);
        });
        it('enter key with upload button ', () => {
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = uploadObj.uploadButton;
            expect(iconElement[0].classList.contains('e-file-delete-btn')).toBe(false);
            uploadObj.keyActionHandler(keyboardEventArgs);
            // setTimeout(() => {
            //     expect(iconElement[0].classList.contains('e-file-delete-btn')).toBe(true);
            //     expect(iconElement[1].classList.contains('e-file-delete-btn')).toBe(true);
            //     done();
            // }, 3000);
        })
        it('set focus to clear button from upload button', () => {
            keyboardEventArgs.action = 'previous';
            keyboardEventArgs.target = uploadObj.uploadButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).toBe(uploadObj.clearButton);            
        })
        it('enter key on clear button ', () => {
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = uploadObj.clearButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
            expect(isNullOrUndefined(uploadObj.actionButtons)).toBe(true);
        });
        it('set focus to clear button', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
                            {name: "default.html", rawFile: "", size:185675, status: 'Ready to upload', statusCode: '1', type: 'html', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.renderActionButtons();
            uploadObj.filesData = fileList;
            uploadObj.clearButton.focus();
            expect(document.activeElement).toBe(uploadObj.clearButton);
        });
        it('set focus to clear icon from clear button', () => {
            iconElement = uploadObj.listParent.querySelectorAll('.e-icons');
            keyboardEventArgs.action = 'previous';
            keyboardEventArgs.target = uploadObj.clearButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(iconElement[1].classList.contains('e-clear-icon-focus')).toBe(true);
            expect(document.activeElement).not.toBe(uploadObj.clearButton);
        });
        it('Enter key with clear icon ', () => {
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = iconElement[1];
            uploadObj.keyActionHandler(keyboardEventArgs);
            iconElement = uploadObj.listParent.querySelectorAll('.e-icons');
            expect(iconElement.length).toBe(1);
            expect(document.activeElement).toBe(uploadObj.browseButton);
        });
        it('set focus to upload button ', () => {
            uploadObj.uploadButton.focus();
            expect(document.activeElement).toBe(uploadObj.uploadButton);
        });
        it('Focus out from uploader component', () => {
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.uploadButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).not.toEqual(uploadObj.uploadButton);
        })
        it('set focus to clear icon from clear button', () => {
            uploadObj.browseButton.focus();
            keyboardEventArgs.action = 'previous';
            keyboardEventArgs.target = uploadObj.browseButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).not.toBe(uploadObj.browseButton);
        });
        it('Enter key with browse button ', () => {
            uploadObj.browseButton.focus();
            expect(document.activeElement).toBe(uploadObj.browseButton);
            keyboardEventArgs.action = 'enter';
            keyboardEventArgs.target = uploadObj.browseButton;
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).toBe(uploadObj.browseButton);
        });
        it('Focus out from clear button', () => {
            uploadObj.clearButton.focus();
            keyboardEventArgs.action = 'next';
            keyboardEventArgs.target = uploadObj.clearButton;
            uploadObj.uploadButton.setAttribute('disabled', 'disabled');
            uploadObj.keyActionHandler(keyboardEventArgs);
            expect(document.activeElement).not.toEqual(uploadObj.uploadButton);
            expect(document.activeElement).not.toEqual(uploadObj.clearButton);
        });
    })

    describe('WAI-ARIA Support', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('aria-activedescendant attribute', () => {
            expect(uploadObj.uploadWrapper.hasAttribute('aria-activedescendant')).toBe(true);
            expect(uploadObj.uploadWrapper.getAttribute('aria-activedescendant')).toEqual('li-focused');
        })
    });

    describe('worst case testing', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {accept : '.png'}});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, showFileList: false, allowedExtensions: '.pdf', multiple: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('bind drop events', () => {
            uploadObj.dropZoneElement = null;
            uploadObj.bindDropEvents();
            uploadObj.unBindDropEvents();
            expect(isNullOrUndefined(uploadObj.dropZoneElement)).toBe(true);
        });        
        it('set rtl before list creation', () => {
            uploadObj.enableRtl = true;
            uploadObj.dataBind();
            expect(uploadObj.uploadWrapper.classList.contains('e-rtl')).toBe(true);
            expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
        });
        it('clear the data before list creation', () => {
            uploadObj.clearData();
            expect(isNullOrUndefined(uploadObj.listParent)).toBe(true);
            expect(isNullOrUndefined(uploadObj.actionButtons)).toBe(true);
        });
        it('get file type when there is no extension in file', () => {
            let extension: string = uploadObj.getFileType('spelling');
            expect(extension).toEqual('');
        });
        it ('null file object', () => {
            let fileObj: any = { name: 'Image'}
            uploadObj.uploadWrapper = null;
            expect(isNullOrUndefined(uploadObj.removeFilesData(fileObj))).toBe(true);
        });
        it ('with custom UI', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'File upload successfully', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}]
            uploadObj.asyncSettings = { saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'};
            uploadObj.upload(fileList, true);
            expect(fileList[0].status).toBe('File upload successfully');
        });
        it ('undefined template', () => {
            let template = null;
            let compiledString =  uploadObj.templateComplier(template);
            expect(isUndefined(compiledString)).toBe(true);
        });
        it ('uploadRetry method', () => {
            uploadObj.showFileList = true;
            uploadObj.multiple = true;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["One"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            uploadObj.pauseButton =  uploadObj.fileList[1];
            uploadObj.retry(uploadObj.filesData[0], true);
            expect(uploadObj.filesData[0].statusCode).toBe('1');
        });
        it ('uploadCancel method', () => {
            uploadObj.showFileList = true;
            uploadObj.multiple = true;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["One"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            uploadObj.cancel(uploadObj.filesData[0]);
            expect(uploadObj.filesData[0].statusCode).toBe('0');
        });
        it ('uploadResume method', () => {
            uploadObj.showFileList = true;
            uploadObj.multiple = true;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["One"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            uploadObj.resume(uploadObj.filesData[0]);
            expect(uploadObj.filesData[0].statusCode).toBe('0');
        });
        it ('uploadPause method', () => {
            uploadObj.showFileList = true;
            uploadObj.multiple = true;
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["One"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArg = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArg);
            uploadObj.pause(uploadObj.filesData[0]);
            expect(uploadObj.filesData[0].statusCode).toBe('0');
        });
    });

    describe('Default upload with', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterEach((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('cancel the request', (done) => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.upload(uploadObj.filesData);            
            setTimeout(() => {
                expect(uploadObj.pauseButton).toBe(undefined);
                let iconElement = uploadObj.fileList[0].querySelector('.e-icons');
                iconElement.classList.remove('e-file-remove-btn');
                iconElement.classList.add('e-file-abort-btn');
                createSpinner({target:iconElement});
                uploadObj.removecanceledFile(null, uploadObj.filesData[0]);
                // expect(uploadObj.pauseButton).not.toBe(undefined);
                done();
            }, 500);
        });
        it('Reload the canceled file', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.pauseButton).toBe(undefined);
            let iconElement = uploadObj.fileList[0].querySelector('.e-icons');
            iconElement.classList.remove('e-file-remove-btn');
            iconElement.classList.add('e-file-abort-btn');
            createSpinner({target:iconElement});
            uploadObj.removecanceledFile(null, uploadObj.filesData[0]);
            expect(uploadObj.pauseButton).not.toBe(undefined);
            uploadObj.reloadcanceledFile(null, uploadObj.filesData[0], uploadObj.fileList[0]);            
            expect(uploadObj.filesData[0].status).toBe('Ready to upload');
            // setTimeout(() => {
            //     expect(uploadObj.filesData[0].status).toBe('File uploaded successfully');
            //     done();
            // }, 1000);
        });
        it ('worst case', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.pauseButton).toBe(undefined);
            let iconElement = uploadObj.fileList[0].querySelector('.e-icons');
            createSpinner({target:iconElement});
            uploadObj.removecanceledFile(null, uploadObj.filesData[0]);
        })
    });

    describe('unused test cases', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {accept : '.png'}});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, allowedExtensions: '.pdf', multiple: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it ('removeFailed method', () => {
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let removeEventArgs = { type: 'click', target: (uploadObj.fileList[0]), preventDefault: (): void => { } };            
            uploadObj.removeFailed(removeEventArgs, uploadObj.filesData[0]);
            expect(uploadObj.listParent.querySelector('.e-file-status').textContent).toBe('Unable to remove file');
        });
        it ('uploadFailed method', () => {
            let fileObj: File = new File(["Nice One"], "ChatLog 192680_Dropdown value property binding is not working in case the dropdown contains large number.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["2nd File"], "demo.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let uploadEventArgs = { type: 'click', target: (uploadObj.fileList[0]), preventDefault: (): void => { } };
            uploadObj.template = '';
            uploadObj.uploadFailed(uploadEventArgs, uploadObj.filesData[0]);
            expect(uploadObj.listParent.querySelector('.e-file-status').textContent).toEqual('File failed to upload');
        });        
    })

    describe('Tooltip support', () => {
        let uploadObj: any;
        beforeAll((): void => {
            L10n.load({
                'fr-BE': {
                   'uploader' : {
                    'Browse' : 'Feuilleter',
                    'Clear' : 'clair',
                    'Upload' : 'télécharger',
                    'dropFilesHint' : 'ou Déposez les fichiers ici',
                    'readyToUploadMessage' : 'Prêt à télécharger',
                    'inProgress' : 'Télécharger en cours', 
                    'uploadFailedMessage' : 'Impossible d`importer le fichier',
                    'uploadSuccessMessage' : 'Fichiers chargés avec succès',
                    'invalidMaxFileSize' : 'La taille du fichier est trop grande',
                    'invalidMinFileSize' : 'La taille du fichier est trop petite',
                    'invalidFileType' : 'File type is not allowed'
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, locale: 'fr-BE' });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Ensure title attributes', () => {
            expect(uploadObj.browseButton.getAttribute('title')).toEqual('Feuilleter');
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
                            {name: "default.html", rawFile: "", size:185675, status: 'Ready to upload', statusCode: '1', type: 'html', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.renderActionButtons();
            expect(uploadObj.uploadButton.getAttribute('title')).toEqual('télécharger');
            expect(uploadObj.clearButton.getAttribute('title')).toEqual('clair');
        })
    })

    describe('HTML5 attributes', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {accept : '.png', name:'images[]'}});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            element.setAttribute('disabled', 'disabled');
            element.setAttribute('multiple', 'multiple');
            uploadObj = new Uploader({ autoUpload: false, allowedExtensions: '.pdf', multiple: false });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('accept attribute', () => {
            expect(uploadObj.allowedExtensions).toEqual('.png');
        })
        it('multiple selection', () => {
            expect(uploadObj.multiple).toBe(true);
        })
        it('disabled attribute', () => {
            expect(uploadObj.uploadWrapper.classList.contains('e-disabled')).toBe(true);
            expect(uploadObj.browseButton.hasAttribute('disabled')).toBe(true);
            expect(uploadObj.enabled).toBe(false);
        })
        it('Change accept attr dynamically', () => {
            uploadObj.allowedExtensions = 'images/*';
            uploadObj.dataBind();
            expect(uploadObj.element.getAttribute('accept')).toEqual('images/*');
            uploadObj.allowedExtensions = 'images/jpg';
            uploadObj.dataBind();
            expect(uploadObj.element.getAttribute('accept')).toEqual('images/jpg');
        })
    })

    describe('Form support', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {accept : '.png'}});            
            let form: Element = createElement('form', {attrs: {id: 'form1'}});            
            let submitButton: HTMLElement = createElement('button',{attrs: {type: 'submit'}});
            form.appendChild(element);
            form.appendChild(submitButton);
            document.body.appendChild(form);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, asyncSettings: {saveUrl: '', removeUrl: ''} });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('name attribute', () => {
            let fileObj: File = new File(["Nice One"], "sample2.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let element : HTMLFormElement = <HTMLFormElement>document.getElementById("form1");
            expect(uploadObj.element.getAttribute('name')).toEqual('upload');
            expect(uploadObj.element.getAttribute('aria-label')).toEqual('Uploader');
            uploadObj.resetForm();
            expect(uploadObj.element.value).toEqual('');
        });
        it('name attribute with isModified', () => {            
            let fileObj: File = new File(["One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.selected = function(args: any){
                args.isModified=true;
                args.modifiedFilesData = [uploadObj.filesData[0]];
            }
            let fileObj1: File = new File(["Nice"], "sample1.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs1 = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs1);
            let element : HTMLFormElement = <HTMLFormElement>document.getElementById("form1");
            expect(uploadObj.fileList.length).toEqual(1);
        });        
    })    
   
    describe('Dynamic Localization update', () => {
        let uploadObj: any;
        beforeAll((): void => {
            
            L10n.load({
                'fr-BE': {
                   'uploader' : {
                    "invalidMinFileSize" : "La taille du fichier est trop petite! S'il vous plaît télécharger des fichiers avec une taille minimale de 10 Ko",
                    "invalidMaxFileSize" : "La taille du fichier dépasse 4 Mo",
                    "invalidFileType" : "Le type de fichier n'est pas autorisé",
                    "Browse"  : "Feuilleter", 
                    "Clear" : "Clair", 
                    "Upload" : "Télécharger",
                    "dropFilesHint" : "ou Déposer des fichiers ici", 
                    "uploadFailedMessage" : "Impossible d'importer le fichier", 
                    "uploadSuccessMessage" : "Fichier téléchargé avec succès",
                    "removedSuccessMessage": "Fichier supprimé avec succès",
                    "removedFailedMessage": "Le fichier n'a pas pu être supprimé",
                    "inProgress": "Téléchargement",
                    "readyToUploadMessage": "Prêt à télécharger", 
                    "remove": "Retirer", 
                    "cancel": "Annuler",
                    "delete": "Supprimer le fichier"
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, maxFileSize: 4000000, minFileSize: 1000 });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('set locale through setModel', () => {
            uploadObj.locale = 'fr-BE';
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 151347452, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
                            {name: "764.png", rawFile: "", size: 151, status: 'Ready to upload', statusCode: '1', type: 'png', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.renderActionButtons();
            uploadObj.filesData = fileList;
            uploadObj.dataBind();
            expect(uploadObj.browseButton.innerText).toEqual('Feuilleter');
            let localeText : string = 'ou Déposer des fichiers ici';
            expect(uploadObj.uploadWrapper.querySelector('.e-file-drop').textContent).toBe(localeText);
        })
        it('set autoUpload true', () => {
            uploadObj.locale = 'fr-BE';
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 151347452, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}},
                            {name: "764.png", rawFile: "", size: 151, status: 'Ready to upload', statusCode: '1', type: 'png', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.autoUpload = true;
            uploadObj.filesData = fileList;
            uploadObj.dataBind();
            expect(uploadObj.browseButton.innerText).toEqual('Feuilleter');
            let localeText : string = 'ou Déposer des fichiers ici';
            expect(uploadObj.uploadWrapper.querySelector('.e-file-drop').textContent).toBe(localeText);
        })
        it('Test without filelist and file Data', () => {
            uploadObj.locale = 'fr-BE';
            uploadObj.filesData = [];
            uploadObj.fileList = [];
            uploadObj.dataBind();
            expect(document.querySelector('.e-upload-files')).toBe(null);
        })
    });

    describe('Button as Html Element in localization', () => {
        let uploadObj: any;
        beforeAll((): void => {
            
            L10n.load({
                'fr-BE': {
                   'uploader' : {
                    "invalidMinFileSize" : "La taille du fichier est trop petite! S'il vous plaît télécharger des fichiers avec une taille minimale de 10 Ko",
                    "invalidMaxFileSize" : "La taille du fichier dépasse 4 Mo",
                    "invalidFileType" : "Le type de fichier n'est pas autorisé",
                    "Browse"  : "Feuilleter", 
                    "Clear" : "Clair", 
                    "Upload" : "Télécharger",
                    "dropFilesHint" : "ou Déposer des fichiers ici", 
                    "uploadFailedMessage" : "Impossible d'importer le fichier", 
                    "uploadSuccessMessage" : "Fichier téléchargé avec succès",
                    "removedSuccessMessage": "Fichier supprimé avec succès",
                    "removedFailedMessage": "Le fichier n'a pas pu être supprimé",
                    "inProgress": "Téléchargement",
                    "readyToUploadMessage": "Prêt à télécharger", 
                    "remove": "Retirer", 
                    "cancel": "Annuler",
                    "delete": "Supprimer le fichier"
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false, maxFileSize: 4000000, minFileSize: 1000 });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('set locale through with button as HTML element', () => {
            let item1 = createElement('span', { id: 'item1', className: 'select'});
            document.body.appendChild(item1);
            let item2 = createElement('span', { id: 'item2', className: 'load'});
            document.body.appendChild(item2);
            let item3 = createElement('span', { id: 'item3', className: 'clear'});
            document.body.appendChild(item3);            
            uploadObj.buttons.browse = document.getElementById('item1');
            uploadObj.dataBind();            
            uploadObj.locale = 'fr-BE';
            uploadObj.dataBind();          
            expect(document.getElementsByClassName('select')[0].innerHTML).not.toEqual('Feuilleter');
        })
    });

    describe('Localization for Template support', () => {
        let uploadObj: any;
        beforeAll((): void => {
            L10n.load({
                'fr-BE': {
                   'uploader' : {
                    "invalidMinFileSize" : "La taille du fichier est trop petite! S'il vous plaît télécharger des fichiers avec une taille minimale de 10 Ko",
                    "invalidMaxFileSize" : "La taille du fichier dépasse 4 Mo",
                    "invalidFileType" : "Le type de fichier n'est pas autorisé",
                    "Browse"  : "Feuilleter", 
                    "Clear" : "Clair", 
                    "Upload" : "Télécharger",
                    "dropFilesHint" : "ou Déposer des fichiers ici", 
                    "uploadFailedMessage" : "Impossible d'importer le fichier", 
                    "uploadSuccessMessage" : "Fichier téléchargé avec succès",
                    "removedSuccessMessage": "Fichier supprimé avec succès",
                    "removedFailedMessage": "Le fichier n'a pas pu être supprimé",
                    "inProgress": "Téléchargement",
                    "readyToUploadMessage": "Prêt à télécharger", 
                    "remove": "Retirer", 
                    "cancel": "Annuler",
                    "delete": "Supprimer le fichier"
                     }
                 }
            });
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            uploadObj = new Uploader({  template: "<div class='wrapper'><table><tbody><tr><td><span class='file-name'>${name}</span></td><td><span class='file-size'>${size} bytes</span></td></tr></tbody></table></div>" });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('Initial template support', () => {
            let fileList = [{name: "7z938-x64.msi", rawFile: "", size: 15, status: 'Ready to upload', statusCode: '1', type: 'msi', validationMessages:{minsize: "", maxsize: ""}}];
            uploadObj.createFileList(fileList);
            uploadObj.locale = 'fr-BE';
            uploadObj.dataBind();
            expect(uploadObj.browseButton.innerText).toEqual('Browse...');
            expect(uploadObj.uploadWrapper.querySelector('.e-file-drop').textContent).toBe('Or drop files here');
        });
        
    })

    describe('Chunk upload support', () => {
        let uploadObj: any;
        let chunkSuccess: EmitType<Object> = jasmine.createSpy('chunkSuccess');
        let chunkFailure: EmitType<Object> = jasmine.createSpy('chunkFailure');
        let originalTimeout: number;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            if (uploadObj.uploadWrapper) { uploadObj.destroy();}
            document.body.innerHTML = '';
        });
        it('chunk success event trigger', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkSuccess: chunkSuccess, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 4, retryAfterDelay: 100
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                expect(chunkSuccess).toHaveBeenCalled();
                done();
            }, 1500);
        });
        it('chunk failure event trigger', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { saveUrl: 'js.syncfusion.comm', chunkSize: 4, retryAfterDelay: 100 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                expect(chunkFailure).toHaveBeenCalled();
                uploadObj.uploadWrapper.querySelector('.e-file-reload-btn').click();
                done();
            }, 1500);
        }); 
        it('Progressbar with worst case - remove chunk progress bar', () => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { saveUrl: 'js.syncfusion.comm', chunkSize: 4, retryAfterDelay: 100 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let metaData = { file: new File(["New"], "demo.txt"), chunkIndex: 0, };
            uploadObj.removeChunkProgressBar(metaData);
            expect(uploadObj.getLiElement(metaData.file)).toBe(undefined);
            uploadObj.chunkUploadInProgress(eventArgs, metaData);
            uploadObj.destroy();
        });
        it('cancel the request', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { 
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1, retryAfterDelay: 0 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.uploadWrapper.querySelector('.e-file-abort-btn').click();
                setTimeout(() => {
                    expect(uploadObj.filesData[0].statusCode).toEqual('5');
                    expect(uploadObj.filesData[0].status).toEqual('File upload canceled');
                    let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                    expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(true);
                    done();
                }, 1000);
            }, 800);
        });
        it('Retry the canceled request', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { 
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1, retryAfterDelay: 0 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.uploadWrapper.querySelector('.e-file-abort-btn').click();
                setTimeout(() => {
                    expect(uploadObj.filesData[0].statusCode).toEqual('5');
                    expect(uploadObj.filesData[0].status).toEqual('File upload canceled');
                    let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                    expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(true);
                    pausebtn.click();
                    setTimeout(() => {
                        expect(uploadObj.filesData[0].status).not.toBe('File upload canceled');
                        let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                        expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(false);
                        expect(pausebtn.classList.contains('e-file-pause-btn')).toBe(true);
                        done();
                    }, 600);
                }, 800);
            }, 800);
        });
        it('Keyboard interaction with cancel the request', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { 
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1, retryAfterDelay: 0 }
            });
            uploadObj.appendTo(document.getElementById('upload'));

            var textContent = 'The uploader component is useful to upload images, documents, and other files to server.' 
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.' 
            
            let parts = [
                new Blob([textContent], {type: 'text/plain'}),
                new Uint16Array([33])
            ];
              
        // Construct a file
            let fileObj = new File(parts, 'sample.txt', {lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let keyboardEventArgs: any = { preventDefault: (): void => {}, action: null, target: null, stopImmediatePropagation: (): void => {},
                stopPropagation: (): void => {} };
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                let abortBtn =  uploadObj.uploadWrapper.querySelector('.e-file-abort-btn');
                abortBtn.focus();
                abortBtn.classList.add('e-clear-icon-focus');
                keyboardEventArgs.target = abortBtn;
                keyboardEventArgs.action = 'enter';
                uploadObj.keyActionHandler(keyboardEventArgs);
                setTimeout(() => {
                    expect(uploadObj.filesData[0].statusCode).toEqual('5');
                    let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                     expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(true);
                    done();
                }, 800);
            }, 850);
        });       
        it('Keyboard interaction with retry the canceled request', (done) => {
            uploadObj = new Uploader({
                multiple: true, chunkFailure: chunkFailure, autoUpload: false,
                asyncSettings: { 
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1, retryAfterDelay: 0 }
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let keyboardEventArgs: any = { preventDefault: (): void => {}, action: null, target: null, stopImmediatePropagation: (): void => {},
                stopPropagation: (): void => {} };
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.uploadWrapper.querySelector('.e-file-abort-btn').click();
                setTimeout(() => {
                    expect(uploadObj.getFilesData()[0].statusCode).toEqual('5');
                    expect(uploadObj.getFilesData()[0].status).toEqual('File upload canceled');
                    let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                    expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(true);
                    pausebtn.focus();
                    pausebtn.classList.add('e-clear-icon-focus');
                    keyboardEventArgs.target = pausebtn;
                    keyboardEventArgs.action = 'enter';
                    uploadObj.keyActionHandler(keyboardEventArgs);
                    setTimeout(() => {
                        expect(uploadObj.filesData[0].status).not.toBe('File upload canceled');
                        let pausebtn = uploadObj.uploadWrapper.querySelector('span.e-icons');
                        expect(pausebtn.classList.contains('e-file-reload-btn')).toBe(false);
                        expect(pausebtn.classList.contains('e-file-pause-btn')).toBe(true);
                        done();
                    }, 700);
                }, 800);
            }, 850);
        });
    })

    describe('Chunk upload KeyBoard support', () => {
        let iconElement : any;
        let uploadObj: any;
        
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });  
    
        it('Pause and resume upload', (done) => {
            //let fileObj: File = new File(["Nice One"], "sample1.txt", {lastModified: 0, type: "overide/mimetype"});
            var textContent = 'The uploader component is useful to upload images, documents, and other files to server.' 
                + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
                + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
                + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
                + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
                + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
                + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
                + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
                + 'The uploader component is useful to upload images, documents, and other files to server.'
                + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
                + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
                + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
                + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
                + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
                + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
                + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
                + 'The uploader component is useful to upload images, documents, and other files to server.' 
                
                let parts = [
                    new Blob([textContent], {type: 'text/plain'}),
                    new Uint16Array([33])
                ];
                  
            // Construct a file
            let fileObj = new File(parts, 'sample.txt', {lastModified: 0, type: "overide/mimetype" });
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                let pauseBtn =  uploadObj.uploadWrapper.querySelectorAll('.e-upload-file-list ')[0].querySelectorAll('.e-file-pause-btn')[0];
                expect(isNullOrUndefined(pauseBtn)).toBe(false);
                pauseBtn.focus();
                pauseBtn.classList.add('e-clear-icon-focus');
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = pauseBtn;
                uploadObj.keyActionHandler(keyboardEventArgs);
                setTimeout(() => {
                    let playBtn = uploadObj.uploadWrapper.querySelectorAll('.e-upload-file-list ')[0].querySelectorAll('.e-file-play-btn')[0];
                    expect(isNullOrUndefined(playBtn)).toBe(false);
                    playBtn.focus();
                    playBtn.classList.add('e-clear-icon-focus');
                    keyboardEventArgs.action = 'enter';
                    keyboardEventArgs.target = playBtn;
                    uploadObj.keyActionHandler(keyboardEventArgs);   
                    setTimeout(() => {
                        expect(isNullOrUndefined(pauseBtn)).toBe(false);
                        done();
                    }, 300);
                }, 400);
            }, 700);  
        });    
    })

    describe('Chunk upload Pause resume', () => {
        let uploadObj: any;
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
            let element: HTMLElement = createElement('input', {id: 'upload'});            
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 5
                }
            });
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });  
        it('using UI interaction', (done) => {
            var textContent = 'The uploader component is useful to upload images, documents, and other files to server.' 
                + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
                + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
                + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
                + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
                + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
                + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
                + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
                + 'The uploader component is useful to upload images, documents, and other files to server.'
                + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
                + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
                + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
                + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
                + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
                + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
                + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
                + 'The uploader component is useful to upload images, documents, and other files to server.' 
                
                let parts = [
                    new Blob([textContent], {type: 'text/plain'}),
                    new Uint16Array([33])
                ];
                  
                // Construct a file
            let fileObj = new File(parts, 'sample.txt', {lastModified: 0, type: "overide/mimetype" });

            // let fileObj: File = new File(["Nice One"], "sample1.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                let pauseBtn: any =  document.querySelector('.e-upload').querySelectorAll('.e-upload-file-list ')[0].querySelectorAll('.e-file-pause-btn')[0];
                expect(isNullOrUndefined(pauseBtn)).toBe(false);
                pauseBtn.focus();
                pauseBtn.classList.add('e-clear-icon-focus');
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = pauseBtn;
                uploadObj.keyActionHandler(keyboardEventArgs);
                setTimeout(() => {
                    let playBtn = uploadObj.uploadWrapper.querySelectorAll('.e-upload-file-list ')[0].querySelectorAll('.e-file-play-btn')[0];
                    expect(isNullOrUndefined(playBtn)).toBe(false);
                    playBtn.focus();
                    playBtn.classList.add('e-clear-icon-focus');
                    keyboardEventArgs.action = 'enter';
                    keyboardEventArgs.target = playBtn;
                    uploadObj.keyActionHandler(keyboardEventArgs);   
                    setTimeout(() => {
                        expect(isNullOrUndefined(pauseBtn)).toBe(false);
                        done();
                    }, 500);
                }, 500);
            }, 500); 
        });
    });

    describe('Chunk upload pause & resume public methods', () => {
        let iconElement : any;
        let uploadObj: any;    
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 0.5
                },
                template: "<span class='wrapper'><span class='icon template-icons sf-icon-${type}'></span>" +
                "<span class='name file-name'>${name} ( ${size} bytes)</span><span class='upload-status'>${status}</span>" +
                "</span><span class='e-icons e-file-remove-btn' title='Remove'></span>"
            });
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('Pause, resume', (done) => {
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["pause upload"], "pauseData.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.pause(uploadObj.getFilesData()[0]);
                setTimeout(() => {
                    //ensure the uploading is paused.
                    expect(uploadObj.getFilesData()[0].statusCode).toEqual('4');
                    uploadObj.resume(uploadObj.getFilesData()[0]);
                    //Reume the upload
                    setTimeout(() => {
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('3');  
                        done();
                    }, 500);                    
                }, 500);
            }, 800);
        });
        it('Remove the paused file', (done) => {
            let fileObj: File = new File(["remove pause"], "removePauseData.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(2);
            uploadObj.upload([uploadObj.filesData[1]]);
            setTimeout(() => {
                uploadObj.pause(uploadObj.getFilesData()[1]);
                setTimeout(() => {
                    //ensure the uploading is paused.
                    expect(uploadObj.getFilesData()[1].statusCode).toEqual('4');
                    uploadObj.remove([uploadObj.getFilesData()[1]]);
                    //Reume the upload
                    setTimeout(() => {
                        expect(uploadObj.fileList.length).toEqual(1);
                        done();
                    }, 5000);                    
                }, 500);
            }, 800);
        });
    });
    describe('Chunk upload pause & resume with single and multiple files its public methods', () => {
        let iconElement : any;
        let uploadObj: any;    
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1
                },
                template: "<span class='wrapper'><span class='icon template-icons sf-icon-${type}'></span>" +
                "<span class='name file-name'>${name} ( ${size} bytes)</span><span class='upload-status'>${status}</span>" +
                "</span><span class='e-icons e-file-remove-btn' title='Remove'></span>"
            });
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('Pause, resume', (done) => {
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["pause upload"], "pauseData.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["pause upload file1"], "pauseData1.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj,fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(2);
            uploadObj.upload(uploadObj.filesData);
            setTimeout(() => {
               let getFileList: any = uploadObj.getFilesData()[0]
                uploadObj.pause(uploadObj.getFilesData());
                setTimeout(() => {
                    //ensure the uploading is paused.
                    expect(uploadObj.getFilesData()[0].statusCode).toEqual('4');
                    expect(uploadObj.getFilesData()[1].statusCode).toEqual('4');
                    //Resume the upload
                    setTimeout(() => {
                            uploadObj.resume(uploadObj.getFilesData()[0]);
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('3');
                        done();
                    }, 500);                    
                }, 500);
            }, 800);
        });
    })    
    describe('Cancel & retry public methods', () => {
        let iconElement : any;
        let uploadObj: any;
        
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterAll((): void => {        
            document.body.innerHTML = '';
        });
        it('cancel, retry', (done) => {
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1
                },
                template: "<span class='wrapper'><span class='icon template-icons sf-icon-${type}'></span>" +
                "<span class='name file-name'>${name} ( ${size} bytes)</span><span class='upload-status'>${status}</span>" +
                "</span><span class='e-icons e-file-abort-icon' title='Remove'></span>"
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["pause upload"], "pauseData.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
            setTimeout(() => {
                uploadObj.cancel(uploadObj.getFilesData()[0]);
                setTimeout(() => {
                    expect(uploadObj.getFilesData()[0].statusCode).toEqual('5');
                    uploadObj.retry(uploadObj.getFilesData()[0], false);
                    setTimeout(() => {
                        expect(uploadObj.getFilesData()[0].statusCode).toEqual('3')
                        uploadObj.cancel(uploadObj.getFilesData()[0]);
                        setTimeout(() => {
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('5')
                            done();
                        }, 800);
                    }, 600);
                }, 700);
            }, 1000)
        });
    })

    describe('Cancel & retry public methods with uploading single and multiple file', () => {
        let iconElement : any;
        let uploadObj: any;
        
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterAll((): void => {        
            document.body.innerHTML = '';
        });
        it('cancel, retry', (done) => {
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                    chunkSize: 1
                },
                template: "<span class='wrapper'><span class='icon template-icons sf-icon-${type}'></span>" +
                "<span class='name file-name'>${name} ( ${size} bytes)</span><span class='upload-status'>${status}</span>" +
                "</span><span class='e-icons e-file-abort-icon' title='Remove'></span>"
            });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["pause upload"], "pauseData.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["pause upload file1"], "pauseData1.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj,fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(2);
            uploadObj.upload(uploadObj.filesData);
            setTimeout(() => {
                uploadObj.cancel(uploadObj.getFilesData()[0]);
                setTimeout(() => {
                    expect(uploadObj.getFilesData()[0].statusCode).toEqual('5');
                    uploadObj.retry(uploadObj.getFilesData()[0], false);
                    setTimeout(() => {
                        expect(uploadObj.getFilesData()[0].statusCode).toEqual('3')
                        uploadObj.cancel(uploadObj.getFilesData()[0]);
                        setTimeout(() => {
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('5')
                            done();
                        }, 800);
                    }, 600);
                }, 700);
            }, 1000)
        });
    })

    describe('Uploading event ', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('canceled', () => {
            uploadObj = new Uploader({ uploading: function(e: any) {
                e.cancel = true
            },
            asyncSettings: {
                saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
            } });
            uploadObj.appendTo(document.getElementById('upload'));
            let fileObj: File = new File(["Nice One"], "sample.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: { files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            uploadObj.upload([uploadObj.filesData[0]]);
            expect(uploadObj.filesData[0].statusCode).toEqual('5');
        });
    });

    describe('Uploading drop area customization ', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('change target dynamically', () => {
            uploadObj = new Uploader({ });
            uploadObj.appendTo(document.getElementById('upload'));
            let dropElement: HTMLElement = createElement('div', {id: 'dropele'});
            document.body.appendChild(dropElement);
            expect(document.querySelector('.e-file-drop').textContent).toEqual('Or drop files here');
            uploadObj.dropArea = '#dropele';
            uploadObj.dataBind();
            expect(document.querySelector('.e-file-drop').textContent).toEqual('');
            uploadObj.dropArea = '.e-upload';
            uploadObj.dataBind();
            expect(document.querySelector('.e-file-drop').textContent).toEqual('Or drop files here');
        });
    });

    describe('Disabling showFileList and checking', () => {
        let uploadObj: any;
        beforeEach((): void => {
            let element: HTMLElement = createElement('input', {id: 'UploadFiles'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('getFilesData method with autoUpload true', (done) => {
            uploadObj = new Uploader({
                showFileList: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                },
             });
            uploadObj.appendTo(document.getElementById('UploadFiles'));
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.getFilesData().length).toEqual(1);
            setTimeout(() => {
                expect(uploadObj.filesData[0].status).toEqual('File uploaded successfully');
                expect(uploadObj.filesData[0].statusCode).toBe('2');
                done();
            }, 1500)
        });

        it('getFilesData method with autoUpload false', (done) => {
            uploadObj = new Uploader({
                showFileList: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                },
                autoUpload: false
             });
            uploadObj.appendTo(document.getElementById('UploadFiles'));
            let fileObj: File = new File(["Nice One"], "last.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.getFilesData().length).toEqual(1);
            setTimeout(() => {
                expect(uploadObj.filesData[0].status).toEqual('Ready to upload');
                expect(uploadObj.filesData[0].statusCode).toBe('1');
                done();
            }, 1500)
        });
    });

    describe('Form support', () => {
        let uploadObj: any;
        beforeAll((): void => {
            let element: HTMLElement = createElement('input', {id: 'upload', attrs: {accept : '.png'}});            
            let form: Element = createElement('form', {attrs: {id: 'form1'}});
            let submitButton: HTMLElement = createElement('button',{attrs: {type: 'submit'}});
            form.appendChild(element);
            form.appendChild(submitButton);
            document.body.appendChild(form);
            element.setAttribute('type', 'file');
            uploadObj = new Uploader({ autoUpload: false});
            uploadObj.appendTo(document.getElementById('upload'));
        })
        afterAll((): void => {
            uploadObj.destroy();
            document.body.innerHTML = '';
        });
        it('Clearing values', () => {
            let fileObj: File = new File(["Nice One"], "sample2.txt", {lastModified: 0, type: "overide/mimetype"});
            let fileObj1: File = new File(["Nice One"], "sample2.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj, fileObj1]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            let element : HTMLFormElement = <HTMLFormElement>document.getElementById("form1");
            expect(uploadObj.getFilesData().length).toEqual(2);
            expect(uploadObj.fileList.length).toEqual(2);
            uploadObj.uploadWrapper.querySelector('.e-file-remove-btn').click();
            expect(uploadObj.getFilesData().length).toEqual(0);
            expect(uploadObj.fileList.length).toEqual(0);
        });
    })


    describe('Cancel & retry public methods for', () => {
        let iconElement : any;
        let uploadObj: any;
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            let element: HTMLElement = createElement('input', {id: 'upload'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('template UI upload', (done) => {
            let callProgressEvent: boolean = true;
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                },
                progress: function(e: any) {
                    if (callProgressEvent) {
                        uploadObj.cancel(uploadObj.getFilesData()[0]);
                        setTimeout(() => {
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('5');
                            callProgressEvent = false;
                            uploadObj.retry(uploadObj.getFilesData()[0], false, true);
                            done();
                            setTimeout(() => {
                                expect(uploadObj.getFilesData()[0].statusCode).toEqual('2');
                                done();
                            }, 300);
                        }, 100)
                    }
                },
                template: "<span class='wrapper'><span class='icon template-icons sf-icon-${type}'></span>" +
                "<span class='name file-name'>${name} ( ${size} bytes)</span><span class='upload-status'>${status}</span>" +
                "</span><span class='e-icons e-file-abort-icon' title='Remove'></span>"
            });
            uploadObj.appendTo(document.getElementById('upload'));


            var textContent = 'The uploader component is useful to upload images, documents, and other files to server.' 
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The uploader component is useful to upload images, documents, and other files to server.' 
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'

            let parts = [
                new Blob([textContent], {type: 'text/plain'}),
                new Uint16Array([33])
            ];
              
        // Construct a file
            let fileObj: File = new File(parts, "BlobFile.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
        });
    })


    describe('Cancel & retry public methods for', () => {
        let iconElement : any;
        let uploadObj: any;
        let originalTimeout: number;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            stopImmediatePropagation: (): void => {},
            stopPropagation: (): void => {},
        };
        beforeAll((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 7000;
            let element: HTMLElement = createElement('input', {id: 'upload1'});
            document.body.appendChild(element);
            element.setAttribute('type', 'file');
        })
        afterAll((): void => {
            document.body.innerHTML = '';
        });
        it('default UI upload', (done) => {
            let callProgressEvent: boolean = true;
            uploadObj = new Uploader({
                multiple: true, autoUpload: false,
                asyncSettings: {
                    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
                    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                },
                progress: function(e: any) {
                    if (callProgressEvent) {
                        uploadObj.cancel(uploadObj.getFilesData()[0]);
                        setTimeout(() => {
                            expect(uploadObj.getFilesData()[0].statusCode).toEqual('5');
                            callProgressEvent = false;
                            uploadObj.retry(uploadObj.getFilesData()[0], false);
                            done();
                            setTimeout(() => {
                                //expect(uploadObj.getFilesData()[0].statusCode).toEqual('2');
                                done();
                            }, 200);
                        }, 100)
                    }
                }
            });
            uploadObj.appendTo(document.getElementById('upload1'));

            var textContent1 = 'The uploader component is useful to upload images, documents, and other files to server.' 
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The uploader component is useful to upload images, documents, and other files to server.' 
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'
            + 'The uploader component is useful to upload images, documents, and other files to server.'
            + 'The component is the extended version of HTML5 that is uploaded with multiple file selection, auto upload, drag and drop, progress bar, preload files, and validation'
            + 'Asynchronous upload - Allows you to upload the files asynchronously. The upload process requires save and remove action URL to manage upload process in the server.'
            + 'Drag and drop - Allows you to drag files from the file explorer and drop into the drop area. By default, the uploader component act as drop area element.'
            + 'Form supports - The selected or dropped files are received as a collection in a form action when the form is submitted.'
            + 'Validation - Validates the selected file size and extension by using the allowedExtensions, maxFileSize, and minFileSize properties.'
            + 'Template - You can customize default appearance of the uploader using the template property along with the buttons property.'
            + 'Localization - Supports to localize the text content of action buttons, file status, clear icon title, tooltips, and text content of drag area.'

            let parts1 = [
                new Blob([textContent1], {type: 'text/plain'}),
                new Uint16Array([33])
            ];
              
        // Construct a file
            let fileObj: File = new File(parts1, "BlobFile1.txt", {lastModified: 0, type: "overide/mimetype"});
            let eventArgs = { type: 'click', target: {files: [fileObj]}, preventDefault: (): void => { } };
            uploadObj.onSelectFiles(eventArgs);
            expect(uploadObj.fileList.length).toEqual(1);
            uploadObj.upload([uploadObj.filesData[0]]);
        });
    })
});

