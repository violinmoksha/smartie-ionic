import { NavController } from 'ionic-angular/index';
import { TestPageModule } from './test.module';
import { SmartieApp } from './../../app/app.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestPage } from './test';
import { IonicModule, NavParams } from 'ionic-angular';

describe('Test', () => {
  let de: DebugElement;
  let comp: TestPage;
  let fixture: ComponentFixture<TestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestPage],
      imports: [
        IonicModule.forRoot(TestPage)
      ],
      providers:[NavController]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPage);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    //de = fixture.debugElement.query(By.css('h3'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  // it('should have expected <h3> text', () => {
  //   fixture.detectChanges();
  //   const h3 = de.nativeElement;
  //   expect(h3.innerText).toMatch(/ionic/i,
  //     '<h3> should say something about "Ionic"');
  // });

  // it('should show the favicon as <img>', () => {
  //   fixture.detectChanges();
  //   const img: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
  //   expect(img.src).toContain('assets/icon/favicon.ico');
  // });
})
