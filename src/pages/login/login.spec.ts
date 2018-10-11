import { IonicStorageModule } from '@ionic/storage';
import { LoadingControllerMock, MenuControllerMock } from 'ionic-mocks';
import { DataService } from './../../app/app.data';
import { FirebaseMock } from './../../mocks/firebase';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from './../../providers/analytics';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { LoginPage } from './login';
import { IonicModule, NavController, AlertController, LoadingController, MenuController } from 'ionic-angular';
describe('Login Page', () => {
  // let de: DebugElement;
  let comp: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let loginData = { username: "test", password: "123456" }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage),
        IonicStorageModule.forRoot({
          name: 'smartiedb',
          driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
      ],
      providers: [
        NavController,
        { provide: AlertController, useValue: AlertController },
        { provide: AnalyticsProvider, useValue: AnalyticsProvider, deps: [FirebaseMock] },
        { provide: DataService, deps:[] },
        { provide: LoadingController, useValue: LoadingControllerMock },
        { provide: MenuController, useValue: MenuControllerMock },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(comp instanceof LoginPage).toBeDefined();
  });

  it('Login Clicked', inject([DataService], (dataService: DataService) => {
    let loginEventSpy = spyOn(comp.dataService, "getApi").and.callThrough();
    comp.login(loginData).then(res => {
      expect(loginEventSpy).toHaveBeenCalled();
    })
  }));
});
