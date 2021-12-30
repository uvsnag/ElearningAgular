import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable } from 'rxjs';
import * as _ from 'lodash'

import { environment } from '../environments/environment';
import { Sheet, sheetAttributesMapping } from './sheet.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {

  sheetArr = [
    "AngularNotify1",
    "AngularNotify2",
    "AngularNotify3",
  ]
  strSheet = this.sheetArr[0];

  strEnglish = "";

  strCookieContinue = ""

  sheets$!: Observable<Sheet[]>;
  sheets: Sheet[] = [];

  strField = "";
  title = 'ElearningAgular';
  SPLIT_WORD = ':';
  IND_SPEAK_NOTI_VOICE = 'noti-voice';
  IND_SPEAK_NO_VOICE = 'no-voice';
  IND_SPEAK_NO_NOTI = 'no-noti';
  IND_SPEAK_NOTI_NO_VIE = 'noti-no-vie';
  IND_SPEAK_NO_NOTI_NO_VIE = 'no-noti-no-vie';
  IND_SPEAK_NO_NOTI_ENG = 'noti-eng-voice';
  IND_SPEAK_ALL_ENG = 'all-eng';
  IND_SPEAK_NOTI_ENG = 'noti-eng';

  IND_VALUE_ON = 'On';
  IND_VALUE_OFF = 'Off';
  SPLIT_LINE_INPUT_FIELD = '\n';

  constructor(private googleSheetsDbService: GoogleSheetsDbService, private cookieService: CookieService) { }
  // constructor( private cookieService: CookieService ) { }
  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  ngOnInit(): void {
    this.getDataSheetAPI()
    this.strCookieContinue = this.cookieService.get('rdContinue'); // To Get Cookie.
  }

  getDataSheetAPI() {
    this.sheets = [];
    this.strField = "";

    this.sheets$ = this.googleSheetsDbService.getActive<Sheet>(
      environment.characters.spreadsheetId,
      this.strSheet,
      sheetAttributesMapping,
      'Active'
    );
    this.sheets$
      .subscribe(sheets => {
        for (let i = 0; i <= sheets.length; i++) {
          let line = sheets[i]
          if (!_.isEmpty(line)) {
            this.strField += line.eng + " " + this.SPLIT_WORD + " ";
            this.strField += _.isEmpty(line.cust) ? line.vie : line.cust;
            this.strField += this.SPLIT_LINE_INPUT_FIELD;
            this.sheets.push(line);
          }
        }
        console.log(this.sheets);
      })
  }

  isNotify = this.IND_VALUE_OFF
  valueTime = 30;

  async onStart() {

    let functionIsRunningHtml = document.getElementById("isNotify") as HTMLInputElement;
    const functionIsRunning = functionIsRunningHtml.value;


    if (functionIsRunning === this.IND_VALUE_ON) {
      return;
    }
    functionIsRunningHtml.value = this.IND_VALUE_ON;
    this.isNotify = this.IND_VALUE_ON
    var checkExcNotify = this.IND_VALUE_ON;
    var lineInputs = _.clone(this.sheets);

    const strcookie = document.getElementById("strCookie") as HTMLInputElement;
    const strcookieV = strcookie.value;
    this.cookieService.set('rdContinue', strcookieV);
    this.strCookieContinue = this.cookieService.get('rdContinue'); // To Get Cookie.

    var splitIndex = ','
    var arrIndexNotNotify = _.isEmpty(this.strCookieContinue)? []: this.strCookieContinue.split(splitIndex).map(Number);
    if (!_.isEmpty(arrIndexNotNotify) && arrIndexNotNotify.length > 0) {
      arrIndexNotNotify.sort((a, b) => b - a);

      arrIndexNotNotify.forEach(inx => {
        lineInputs.splice(inx, 1);
      })
    }

    while (checkExcNotify === this.IND_VALUE_ON) {
      let line: Sheet;

      const oderRandomHtml = document.getElementById("slGenData") as HTMLInputElement;
      const oderRandom = oderRandomHtml.value;

      if (oderRandom === 'random') {
        let index = Math.floor(Math.random() * lineInputs.length);
        line = lineInputs[index];
        lineInputs.splice(index, 1);

      } else {
        line = lineInputs[0];
        lineInputs.shift();

      }
      if (!_.isEmpty(line)) {
        let indexOrg = this.sheets.findIndex(x => x.eng === line.eng);
        this.strCookieContinue += _.isEmpty(this.strCookieContinue) ? indexOrg.toString() : splitIndex + indexOrg.toString();
        this.cookieService.set('rdContinue', this.strCookieContinue); // To Set Cookie
        this.strCookieContinue = this.cookieService.get('rdContinue'); // To Get Cookie.
      }

      if (_.isEmpty(lineInputs)) {
        this.strCookieContinue = "";
        lineInputs = _.clone(this.sheets);
      }

      this.onNotiExc(line);

      await new Promise(resolve => setTimeout(resolve, (this.valueTime * 1000)));

      const checkExcNotifyHtml = document.getElementById("isNotify") as HTMLInputElement;
      checkExcNotify = checkExcNotifyHtml.value;

      // checkExcNotify = document.getElementById('isNotify').value;
    }
  }

  onNotiExc(line: Sheet) {

    if (!window.Notification) {
      console.log('Browser does not support notifications.');
    } else {
      // check if permission is already granted
      if (Notification.permission === 'granted') {
        // show notification here
        const typeSpeakHtml = document.getElementById("slIsUseVoice") as HTMLInputElement;
        const typeSpeak = typeSpeakHtml.value;
        // var isSpeak = document.getElementById('slIsUseVoice').value;


        if (!_.isEmpty(line)) {
          var engStr = line.eng;
          var viStr = line.vie;
          var strEngVie = engStr + ' ' + this.SPLIT_WORD + ' ' + viStr

          this.strEnglish = engStr;

          switch (typeSpeak) {
            case this.IND_SPEAK_NO_NOTI_ENG:
              this.sayIt(true, engStr);
              this.sayIt(false, viStr);
              var notification = new Notification(engStr);
              break;
            case this.IND_SPEAK_NOTI_VOICE:
              this.sayIt(true, engStr);
              this.sayIt(false, viStr);
              var notification = new Notification(strEngVie);
              break;
            case this.IND_SPEAK_NO_VOICE:
              var notification = new Notification(strEngVie);
              break;
            case this.IND_SPEAK_NO_NOTI:
              this.sayIt(true, engStr);
              this.sayIt(false, viStr);
              break;
            case this.IND_SPEAK_ALL_ENG:
              this.sayIt(true, engStr);
              var notification = new Notification(engStr);
              break;
            case this.IND_SPEAK_NOTI_NO_VIE:
              this.sayIt(true, engStr);
              var notification = new Notification(strEngVie);
              break;
            case this.IND_SPEAK_NO_NOTI_NO_VIE:
              this.sayIt(true, engStr);
              break;
            case this.IND_SPEAK_NOTI_ENG:
              var notification = new Notification(engStr);
              break;
          }

        }
      } else {
        // request permission from user
        Notification.requestPermission().then(function (p) {
          if (p === 'granted') {
            // show notification here
          } else {
            console.log('User blocked notifications.');
          }
        }).catch(function (err) {
          console.error(err);
        });
      }
    }
  }

  indexVoice1 = 2;
  indexVoice2 = 7;

  speech = 70;

  getVoices() {
    return window.speechSynthesis.getVoices();
  }

  sayIt(voiceEng: boolean, text: string) {
    var msg = new SpeechSynthesisUtterance();
    var voices = this.getVoices();

    // choose voice. Fallback to default
    var indexVoice = voiceEng ? this.indexVoice1 : this.indexVoice2;
    msg.voice = voices[indexVoice];
    // msg.volume = 10;
    msg.rate = voiceEng ? this.speech / 100 : 1;
    msg.pitch = 1;

    msg.text = text;

    speechSynthesis.speak(msg);
  }

  onChangeVoice1(_event: any) {
    let i = 0;
    this.getVoices().forEach((voice, index) => {
      if (_event === voice) {
        i = index;
      }
    });
    this.indexVoice1 = i;
  }

  onChangeVoice2(_event: any) {
    let i = 0;
    this.getVoices().forEach((voice, index) => {
      if (_event === voice) {
        i = index;
      }
    });
    this.indexVoice2 = i;
  }

  onChangeSpeech(_event: any) {
    this.speech = _event;
  }

  onChangeValueTime(_event: any) {
    this.valueTime = _event;
  }
  setSheet(_event: any) {
    this.strSheet = _event;
    this.getDataSheetAPI();

  }
  onHideControl() {
    var prac = document.getElementById('notify-control');
    if (prac!.style.display === "block") {
      document.getElementById('notify-control')!.style.display = "none";
    } else {
      document.getElementById('notify-control')!.style.display = "block";
    }
  };
  // onChangeOrder(_event: any) {

  // }
  // onChangeIsUseVoice(_event: any) {

  // }
  onStop() {
    const checkExcNotifyHtml = document.getElementById("isNotify") as HTMLInputElement;
    checkExcNotifyHtml.value = this.IND_VALUE_OFF;
  }
  //   onShowAll() {

  //   }
  //   onShowPract() {

  //   }
  //   onHideWhenPrac() {

  //   }
}
