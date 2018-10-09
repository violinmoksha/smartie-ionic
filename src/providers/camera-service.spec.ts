import { CameraServiceProvider } from './camera-service';
import { async, TestBed, inject } from '@angular/core/testing';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ActionSheetControllerMock } from "ionic-mocks"

let isAlphaNumeric = (string) => {
  return /^[a-zA-Z0-9]+$/.test(string)
}
describe('Camera Service:', () => {
  let cameraService: CameraServiceProvider
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CameraServiceProvider,
        ImagePicker,
        Camera,
        { provide: ActionSheetController, useValue: ActionSheetControllerMock }
      ],
      imports: [
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ]
    }).compileComponents();
  });

  it('Test', () => {
    expect(true).toBeTruthy();
  });
  it('should be created', inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    expect(cameraService).toBeTruthy();
  }));

  it("Create camera options", inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    let cameraOption = cameraService.getCameraOptions();
    expect(cameraOption).toBeDefined();
    expect(typeof (cameraOption)).toEqual('object');
  }));

  it("Create gallery options", inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    let galleryOption = cameraService.getGalleryOptions();
    expect(galleryOption).toBeDefined();
    expect(typeof (galleryOption)).toEqual('object');
  }));

  it("Choose Pictures", inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    let choosePicSpy = spyOn(cameraService.imagePicker, 'getPictures').and.callThrough();
    cameraService.choosePictures().then(res => {
      expect(choosePicSpy).toHaveBeenCalled()
    })
  }));

  it("Get Image", inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    let cameraSpy = spyOn(cameraService.camera, 'getPicture').and.callThrough();
    let choosePicSpy = spyOn(cameraService, 'choosePictures').and.callThrough();

    cameraService.getImage().then(res => {
      expect(cameraSpy).toHaveBeenCalled();
      expect(choosePicSpy).toHaveBeenCalled();
    })
  }));

  it("Get File Name", inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    cameraService.getFileName().then(res => {
      expect(isAlphaNumeric(res)).toBeTruthy()
    })
  }));
});
