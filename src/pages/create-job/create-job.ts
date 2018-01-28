import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { AbstractControl, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { CalendarModal, CalendarModalOptions, CalendarResult } from "ion2-calendar";
import { SmartieAPI } from '../../providers/api/smartie';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CreateJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-job',
  templateUrl: 'create-job.html',
})
export class CreateJobPage {
  @ViewChild(Slides) hourRate: Slides;
  private hourlyRate: any;
  public hourRates = [
    { "value": '5', "text": '5' },
    { "value": '10', "text": '10' },
    { "value": '15', "text": '15' },
    { "value": '20', "text": '20' },
    { "value": '25', "text": '25' },
    { "value": '30', "text": '30' },
    { "value": '35', "text": '35' },
    { "value": '40', "text": '40' },
    { "value": '45', "text": '45' },
    { "value": '50', "text": '50' },
    { "value": '55', "text": '55' },
    { "value": '60', "text": '60' },
    { "value": '65', "text": '65' },
    { "value": '70', "text": '70' },
    { "value": '75', "text": '75' },
    { "value": '80', "text": '80' },
    { "value": '85', "text": '85' },
    { "value": '90', "text": '90' },
    { "value": '95', "text": '95' },
    { "value": '100', "text": '100' }
  ];
  private startDate: any;
  private endDate: any;
  private loading: any;
  private CreateJobForm: FormGroup;

  private submitInProgress: boolean = false;
  private userRole: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, public loadingCtrl: LoadingController, private smartieApi: SmartieAPI, private storage: Storage, public alertCtrl: AlertController) {
    this.loading = this.loadingCtrl.create({
      content: 'Creating Job...'
    });

    this.CreateJobForm = new FormGroup({
      jobDescription: new FormControl(''),
      prefLocation: new FormControl(''),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', [Validators.required, this.gretarThan('startTime')])
    });

    this.storage.get('role').then(role => {
      this.userRole = role;
    });
  }

  createJob(createJobFormValues) {
    this.submitInProgress = true;
    this.loading.present();

    let API = this.smartieApi.getApi(
      'setJobRequest',
      {
        requestingProfileId: JSON.parse(localStorage.getItem(`${this.userRole}UserProfile`)).profileData.objectId,
        description:createJobFormValues.jobDescription,
        prefLocation:createJobFormValues.prefLocation
      }
    );

    return new Promise(resolve => {
      interface Response {
        result: any
      }
      this.smartieApi.http.post<Response>(API.apiUrl, API.apiBody, API.apiHeaders).subscribe(
        res => {
          this.submitInProgress = false;
          this.loading.dismiss();
          this.navCtrl.push("TotlesSearch");
        },
        err => {
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Job Request Submit Failed!',
            subTitle: err.message,
            buttons: ['OK']
          });
          alert.present();
          this.submitInProgress = false;
        }
      );
    });
  }

  gretarThan(equalControlName): ValidatorFn {
    return (control: AbstractControl): {
      [key: string]: any
    } => {
      if (!control['_parent']) return null;
      if (!control['_parent'].controls[equalControlName])
      throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
      var controlMatch = control['_parent'].controls[equalControlName];
      return controlMatch.value < control.value ? null : {
        'gretarThan': true
      };
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateJobPage');
  }

  public filterRate(rate: number): void {
    // Handle what to do when a category is selected
    console.log(rate);
    this.hourlyRate = rate;
  }

  // Method executed when the slides are changed
  public rateChanged(): void {
    let currentIndex = this.hourRate.getActiveIndex();
    console.log(currentIndex);
  }

  startDateCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
      pickMode: 'single',
      monthFormat: 'MMM YYYY'
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.startDate = date.date + '-' + date.months + '-' + date.years;
        console.log(this.startDate);
      }
    })
  }

  endDateCalendar() {
    const options: CalendarModalOptions = {
      title: 'BASIC',
    };
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: CalendarResult, type: string) => {
      if(date){
        this.endDate = date.date + '-' + date.months + '-' + date.years;
        console.log(this.endDate);
      }
    })
  }
}
