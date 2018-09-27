import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SmartieApp } from '../../app/app.component';
import { MobileVerificationPage } from './mobile-verification';
import { MobileVerificationPageModule } from './mobile-verification.module'

let de: DebugElement;
let el: HTMLElement;


let fixture: ComponentFixture<MobileVerificationPage> = null;
let instance: any = null;
describe("Mobile verification", ()=>{
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MobileVerificationPage],
      providers: [
      ],
      imports: [
        IonicModule.forRoot(SmartieApp)
      ],
    })
    .compileComponents().then(() => {
      console.log(" Component intialization......");
      fixture = TestBed.createComponent(MobileVerificationPage);
      instance = fixture;
      fixture.detectChanges();
      console.log(instance)
    });
  }));

  it("is created", ()=>{
    expect(true).toBeTruthy();
  });
});
describe("test", ()=>{
  it("sample", ()=>{
    expect(true).toBeTruthy()
  })
})
