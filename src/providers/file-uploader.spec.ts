import { SecureStorage } from '@ionic-native/secure-storage';
import { Constants } from './../app/app.constants';
import { HTTP } from '@ionic-native/http';
import { DataService } from './../app/app.data';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileUploaderProvider } from './file-uploader';
import { async, TestBed, inject } from '@angular/core/testing';

describe("File-uploader Provider", () => {
  let analyticsService: FileUploaderProvider;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        FileUploaderProvider,
        FileTransfer,
        { provide: DataService, deps: [HTTP, Constants, SecureStorage] }
      ]
    }).compileComponents();
  }));

  it('should be created', inject([FileUploaderProvider], (fileUploadService: FileUploaderProvider) => {
    expect(fileUploadService).toBeTruthy();
  }));

  it('file upload', inject([FileUploaderProvider], (fileUploadService: FileUploaderProvider) => {
    fileUploadService.uploadFile("testFile", ".txt").then(res => {
      expect(res).toBeDefined();
      expect(typeof (res)).toEqual('object')
    })
  }));

  it('should upload file to AWS', inject([FileUploaderProvider], (fileUploadService: FileUploaderProvider) => {
    let fileTransferSpy = spyOn(fileUploadService.fileTransfer, "upload").and.callThrough();
    fileUploadService.uploadFileToAWS("./path/to/testfile").then(res => {
      expect(fileTransferSpy).toHaveBeenCalled();
    })
  }));

  it('should save to credential class', inject([FileUploaderProvider], (fileUploadService: FileUploaderProvider) => {
    fileUploadService.saveToCredentialClass("role", "./path/to/testfile").then(res => {
      expect(typeof (res)).toEqual('object');
    })
  }));
})
