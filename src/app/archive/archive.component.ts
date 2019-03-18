import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TeoremaService} from '../services/teorema/teorema.service';
import {ActivatedRoute} from '@angular/router';
import { formatDate } from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE} from 'ng-pick-datetime';
import {MomentDateTimeAdapter} from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';

import * as _moment from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;
const eventTypes = {
  ALERT_TYPE_AREA: 0x1, // Motion inside inactive area
  ALERT_TYPE_CALIBRATION_ERROR: 0x2, // Camera calibration error
  ALERT_TYPE_INVALID_MOTION: 0x4, // Motion in wrong direction
  ALERT_TYPE_VELOCITY: 0x8, // Too fast or too slow motion
  ALERT_TYPE_STATIC_OBJECT: 0x10,    // Left object
  ALERT_TYPE_PEOPLE_COUNT: 0x20
};


export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'DD.MM.YYYY     HH:mm',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  providers: [
    {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS},
  ],
})
export class ArchiveComponent implements OnInit {

  @ViewChild('videoPlayer') _videoPlayer: ElementRef<any>;

  constructor(
    private _teoremaService: TeoremaService,
    private _activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {

    let currentDateTime = Date.now();

    currentDateTime = currentDateTime - currentDateTime % 1200000;
    const yesterdayDateTime = currentDateTime - 24 * 60 * 60 * 1000;

    this.startDateTime = new moment(yesterdayDateTime);
    this.endDateTime = new moment(currentDateTime);

    this.archiveList = {};
    this.openedDTPickers = {};

    this.eventsTypes = [
      {
        value: 0,
        viewValue: 'Без событий',
      }, {
        value: 1,
        viewValue: 'С событиями',
      }, {
        value: 2,
        viewValue: 'С событиями и без',
      }
    ];
    this.withEvents = 1;


    this.eventTypesList = [{
      viewValue: 'Движение в зоне',
      value: eventTypes.ALERT_TYPE_AREA
    }, {
      viewValue: 'Скорость движения',
      value: eventTypes.ALERT_TYPE_VELOCITY
    }, {
      viewValue: 'Вектор движения',
      value: eventTypes.ALERT_TYPE_INVALID_MOTION
    }, {
      viewValue: 'Ошибка калибровки',
      value: eventTypes.ALERT_TYPE_CALIBRATION_ERROR
    }];

    this.selectedEventTypes = {};
  }

  public camera;

  public startDate;
  public endDate;
  public startTime;
  public endTime;

  public archiveList;
  public archiveDatesKeys;

  public startDateTime: Date;
  public endDateTime: Date;

  public openedList;
  public openedDTPickers;

  public eventsTypes;
  public withEvents;
  public eventTypesList;
  public selectedEventTypes;

  public archiveLoadingProgress;

  public openedForm;

  ngOnInit() {
    this.getCamera(this._activatedRoute.snapshot.params.camera);
  }

  private getCamera(cameraId) {
    this._teoremaService.getCamera(cameraId)
      .subscribe(res => {
        this.camera = res;

        this._getServer();
      });
  }


  public getSanitizeUrl(url) {
    return url;
    // return this.sanitizer.bypassSecurityTrustStyle(url);
  }

  private _getServer() {
    this._teoremaService.getServers(this.camera.server)
      .subscribe(res => {
        this.camera.serverInfo = res;

        const url = location.protocol + '//' + this.camera.serverInfo.address;
        this.camera.archive_url = url + ':8080';
        this.camera.thumb_url_record = url + ':8080/cam' + this.camera['id'] + '/thumb.jpg';
        this.camera.thumb_url = url + ':5005/thumb/' + this.camera['id'] + '/';
        this.camera.info_url = this.camera.analysis === 1 ? '' : url;

        this.getEventsList();
      });
  }

  private julianIntToDate(JD) {
    const y = 4716;
    const v = 3;
    const j = 1401;
    const u =  5;
    const m =  2;
    const s =  153;
    const n = 12;
    const w =  2;
    const r =  4;
    const B =  274277;
    const p =  1461;
    const C =  -38;
    const f = JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
    const e = r * f + v;
    const g = Math.floor((e % p) / r);
    const h = u * g + w;
    const D = Math.floor((h % s) / u) + 1;
    const M = ((Math.floor(h / s) + m) % n) + 1;
    const Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n) ;
    return new Date(Y, M - 1, D);
  }

  private filterArchive() {

    let withFilteredEventsTypes;
    if (this.withEvents === 1) {
      for (const type in this.selectedEventTypes) {
        if (this.selectedEventTypes[type]) {
          withFilteredEventsTypes = true;
          break;
        }
      }
    }

    for (const i in this.archiveList) {
      this.archiveList[i].forEach((oneDecade) => {
        switch (this.withEvents) {
          case 0:
            oneDecade.hidden = oneDecade.events.length;
            break;
          case 1:
            oneDecade.hidden = !oneDecade.events.length;
            break;
          case 2:
            oneDecade.hidden = false;
            break;
        }

        if (!oneDecade.hidden && withFilteredEventsTypes) {
          oneDecade.hidden = !oneDecade.events.filter((event: any) => {
            for (const t in this.selectedEventTypes) {
              if (this.selectedEventTypes[t] && (Number(t) & event.eventType)) {
                return true;
              }
            }
            return false;
          }).length;
        }
      });
    }
    this.openedForm = false;
  }

  private allArchiveList;
  private groupArchive(archiveData) {
    this.allArchiveList = archiveData;
    this.archiveList = {};
    this.archiveDatesKeys = [];
    archiveData.forEach((oneMoment) => {
      const momentDateTime = this.julianIntToDate(oneMoment.date);
      oneMoment.originalDate = momentDateTime.getTime();
      const startTimeMoment = oneMoment.start.split('-');
      momentDateTime.setHours(startTimeMoment[0]);
      momentDateTime.setMinutes(startTimeMoment[1]);
      oneMoment.date = momentDateTime;
      const key = formatDate(oneMoment.date, 'y-MM-dd', 'en-US');
      this.archiveList[key] = this.archiveList[key] || [];
      this.archiveList[key].push(oneMoment);
    });
    this.archiveDatesKeys = Object.keys(this.archiveList);
    this.filterArchive();
  }


  private getCameraArchive() {
    this._teoremaService.getStatistics(
      this.startDate, this.endDate,
      this.startTime, this.endTime,
      this.camera.id,
      this.camera.serverInfo.address
    ).subscribe((data) => {
      this.groupArchive(data);
    });
  }

  public openOneDayArchive(key) {
    if (this.openedList === key) {
      this.openedList = false;
    } else {
      this.openedList = key;
    }
  }


  public openDT(momentField) {
    this.openedDTPickers[momentField] = true;
  }
  public closeDT(momentField) {
    this.openedDTPickers[momentField] = false;
  }

  public getEventsList() {

    const oldStart = this.startDate ? this.startDate + ' ' + this.startTime.replace('-', ':') : undefined;
    const oldEnd = this.endDate ? this.endDate + ' ' + this.endTime.replace('-', ':') : undefined;

    const newStart = moment(this.startDateTime);
    const newEnd = moment(this.endDateTime);

    if (!(newStart.isSame(oldStart) && newEnd.isSame(oldEnd))) {
      const currentDateTimeStr = newEnd.format('YYYY-MM-DDTHH-mm').split('T');
      const yesterdayDateTimeStr = newStart.format('YYYY-MM-DDTHH-mm').split('T');
      this.endDate = currentDateTimeStr[0];
      this.endTime = currentDateTimeStr[1];
      this.startDate = yesterdayDateTimeStr[0];
      this.startTime = yesterdayDateTimeStr[1];
      this.getCameraArchive();
    } else {
      this.filterArchive();
    }
  }

  public openedVideo;
  private videoElement;

  public showPrevDecade() {
    const filteredList = this.allArchiveList.filter((momentVideo) => {
      return !momentVideo.hidden;
    });
    const currentMomentIndex = filteredList.indexOf(this.openedVideo.moment);
    if (currentMomentIndex > 0) {
      this.closeVideoFrame();
      this.openVideoFrame(filteredList[currentMomentIndex - 1]);
    }
  }
  public showNextDecade() {
    const filteredList = this.allArchiveList.filter((momentVideo) => {
      return !momentVideo.hidden;
    });
    const currentMomentIndex = filteredList.indexOf(this.openedVideo.moment);
    if (currentMomentIndex < (filteredList.length - 1)) {
      this.closeVideoFrame();
      this.openVideoFrame(filteredList[currentMomentIndex + 1]);
    }
  }

  public upSpeed() {
    if (this.openedVideo.speed === 4) {
      this.openedVideo.speed = 1;
    } else {
      this.openedVideo.speed++;
    }
    this.openedVideo.videoElement.playbackRate = this.openedVideo.speed;
  }

  private iniVideoElement(decade) {
    this.videoElement.onloadedmetadata = () => {
      this.openedVideo.videoElement = this.videoElement;
      const timeLines = [];
      const oneItemLength = Math.round(this.videoElement.duration * 200);

      for (let k = 0; k <= 5; k++) {
        timeLines.push(this.openedVideo.moment.date.getTime() + (oneItemLength * k) + 1000);
      }

      const endVideoTs = this.openedVideo.moment.date.getTime() + this.videoElement.duration * 1000;
      this.videoElement.timePicks = timeLines;
      decade.events.forEach((event) => {
        if (event.startTimeMS > this.openedVideo.moment.date.getTime()) {
          event.isHidden = true;
        } else {
          event.endTimeMS = Math.min(event.endTimeMS, endVideoTs);
        }
      });
      this.openedVideo.pending = false;
    };

    this.videoElement.onended = () => {
      this.showNextDecade();
    };

    this.videoElement.ontimeupdate = () => {
      if (!this.openedVideo) {
        return;
      }
      this.openedVideo.currentPosition = (this.videoElement.currentTime / this.videoElement.duration) * 100;
    };
    this.videoElement.play();
  }

  public openVideoFrame(decade) {
    this.openedVideo = {
      moment: decade,
      speed: 1,
      pending: true
    };
    this.openedVideo.videoHidden = true;

    setTimeout(() => {
      this.openedVideo.videoHidden = false;
      setTimeout(() => {
        this.videoElement = document.getElementById('videoPlayer');
        this.iniVideoElement(decade);
      });
    });
  }

  public closeVideoFrame() {
    this.openedVideo = false;
    this.videoElement.ontimeupdate = false;
    this.videoElement.onloadedmetadata = false;
    this.videoElement.onended = false;
    this.videoElement = false;
  }

  private progressDownStart;


  public markDown(e, lineElement, moverElement) {

    const lineWidth = lineElement.offsetWidth;

    const minPercent = - this.videoElement.currentTime / this.videoElement.duration;
    const startCurrentTime = this.videoElement.currentTime;
    const maxPercent = 1 - minPercent;

    const isMobile = e instanceof TouchEvent;

    const upForWindow = () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', moveForWindow);
        window.removeEventListener('mouseup', upForWindow);
      } else {
        window.removeEventListener('touchmove', moveForWindow);
        window.removeEventListener('touchend', upForWindow);
      }
      this.videoElement.play();
    };

    const moveForWindow = (event) => {
      const rangeCurrentPosition = (event.clientX ? event.clientX : event.touches[0].clientX) - this.progressDownStart;
      let rangePercents = rangeCurrentPosition / lineWidth;
      rangePercents = Math.max(minPercent, Math.min(rangePercents, maxPercent));
      this.videoElement.currentTime = startCurrentTime + (rangePercents * this.videoElement.duration);
      this.openedVideo.currentPosition = (this.videoElement.currentTime / this.videoElement.duration) * 100;
      return false;
    };

    this.videoElement.pause();
    this.progressDownStart = e.clientX ? e.clientX : e.touches[0].clientX;
    if (!isMobile) {
      window.addEventListener('mousemove', moveForWindow);
      window.addEventListener('mouseup', upForWindow);
    } else {
      window.addEventListener('touchmove', moveForWindow);
      window.addEventListener('touchend', upForWindow);
    }
    return false;
  }
}


