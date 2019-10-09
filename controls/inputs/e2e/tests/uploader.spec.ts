
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";

const path = require('path');
var absoluteDocPath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Uploader.docx');
var absoluteDocPathS = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Study.docx');
var mp3FilePath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Demo.mp3');
var absoluteImagePath = path.win32.normalize('E:////e2e-images\\\\/\\/\\/Life.jpg');
if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1100, 800);
}
let themes = ['material', 'fabric', 'bootstrap', 'highcontrast'];

describe('Uploader', function () {
    it('Allowed Extensions', function() {
        browser.load('/demos/uploader/allowed-extensions.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'upload_before_extension');
        element(by.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(9000);
        browser.compareScreen(element(By.tagName('BODY')), 'upload_allowed_extensions');
        element(by.id('fileupload')).sendKeys(mp3FilePath);
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), 'upload_not_allowed_extensions');
    });
    it('Custom Template', function () {
        browser.load('/demos/uploader/custom-file-list.html');
        browser.sleep(500);
        element(By.id('customUI')).sendKeys(absoluteImagePath);
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_custom_FileList");        
    });
    it('Item Template', function () {
        browser.load('/demos/uploader/item-template.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_item_template");
    });
    it('RTL View', function () {
        browser.load('/demos/uploader/rtl.html');
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl_without_files");
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl");
        element(By.className('e-file-upload-btn')).click();
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl_started");
        element(By.className('e-file-abort-btn')).click();
        browser.sleep(5000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl_cancelled");
        element(By.className('e-file-reload-btn')).click();
        browser.sleep(5000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl_uploaded");
        element(By.className('e-file-clear-btn')).click();
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_rtl_cleared");
    });
    it('Localization', function () {
        browser.load('/demos/uploader/localization.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        browser.sleep(500);
        browser.compareScreen(element(By.tagName('BODY')), "upload_locale");
        element(By.className('e-file-upload-btn')).click();
        browser.sleep(9000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_locale_uploaded");
    });
    it('File Size Validation', function () {
        browser.load('/demos/uploader/file-size-validation.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPathS);
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_min_validation_failed");
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(3000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_validation_success");
        element(By.id('fileupload')).sendKeys(mp3FilePath);
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_max_validation_failed");
    });
    it('Single file upload', function () {
        browser.load('/demos/uploader/singleFile-upload.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(9000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_singleUpload");
    });
    it('Multiple file upload', function () {
        browser.load('/demos/uploader/multipleFile-upload.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteDocPath);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(9000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_multipleUpload");        
    });
    it('Preload files', function () {
        browser.load('/demos/uploader/pre-loaded-files.html');
        browser.sleep(1000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_preload_files");
    });
    it('Image Preview', function () {
        browser.load('/demos/uploader/image-preview.html');
        browser.sleep(500);
        element(By.id('fileupload')).sendKeys(absoluteImagePath);
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_image_preview");
        browser.actions().click(element(By.className('e-upload-icon'))).perform();
        browser.sleep(2000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_image_preview_uploaded");
        browser.actions().click(element(By.id('removeIcon'))).perform();
        browser.sleep(9000);
        browser.compareScreen(element(By.tagName('BODY')), "upload_remove_image_preview");
    });
    it('Themes with buttons', function () {
        for( let i = 0 ; i < themes.length; i++ ) {
            browser.load('/demos/uploader/chunk-upload.html');
            let styleFile: string = '../../../styles/'+ themes[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ styleFile+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themes[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(500);
                element(By.id('fileupload')).sendKeys(absoluteImagePath);
                browser.sleep(1000);
                browser.compareScreen(element(By.tagName('BODY')), "upload_" + themes[i] + "_theme");
            });
        }
    });
    it('Chunk upload with themes', function () {
        for( let i = 0 ; i < themes.length; i++ ) {
            browser.load('/demos/uploader/chunk-upload.html');
            element(By.id('checkAutoUpload')).click();
            browser.sleep(1000);
            let styleFile: string = '../../../styles/'+ themes[i] +'.css';
            let path: string = "((document.getElementsByTagName('head')[0]).querySelector('link')).setAttribute('href','"+ styleFile+"')";
            let bgColor: string = "document.body.setAttribute('style', 'background-color: black')";
            if (themes[i] === 'highcontrast') { browser.executeScript(bgColor); }
            browser.executeScript(path).then(function() {
                browser.sleep(1500);
                element(By.id('fileupload')).sendKeys(absoluteDocPath);
                browser.sleep(800);
                browser.compareScreen(element(By.tagName('BODY')), "upload_chunk_start_" + themes[i]);
                element(By.className('e-file-pause-btn')).click();
                browser.sleep(500);
                browser.compareScreen(element(By.tagName('BODY')), "upload_chunk_pause_" + themes[i]);
                element(By.className('e-file-play-btn')).click();
                browser.compareScreen(element(By.tagName('BODY')), "upload_chunk_play_" + themes[i]);
                element(By.className('e-file-abort-btn')).click();
                browser.sleep(3000);
                browser.compareScreen(element(By.tagName('BODY')), "upload_chunk_abort_" + themes[i]);
                element(By.className('e-file-reload-btn')).click();
                browser.sleep(7000);
                browser.compareScreen(element(By.tagName('BODY')), "upload_chunk_restarted_" + themes[i]);
            });
        }      
    });
});
