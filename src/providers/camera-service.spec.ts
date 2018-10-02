import { CameraServiceProvider } from './camera-service';
import { async, TestBed, inject } from '@angular/core/testing';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ActionSheetControllerMock } from "ionic-mocks"

describe('Camera Service:', () => {
  let cameraService: CameraServiceProvider
  let cameraSpy;
  beforeEach(() => {
    cameraSpy = jasmine.createSpyObj('CameraServiceProvider', ['getFileName']);
    TestBed.configureTestingModule({
      providers: [
        CameraServiceProvider,
        ImagePicker,
        Camera,
        {provide:ActionSheetController, useValue:ActionSheetControllerMock}
      ]
    }).compileComponents();
  });

  it('Test', () => {
    expect(true).toBeTruthy();
  });
  it('should be created', inject([CameraServiceProvider], (cameraService: CameraServiceProvider) => {
    expect(cameraService).toBeTruthy();
  }));
});
