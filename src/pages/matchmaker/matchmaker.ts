import {Component} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";

import * as AV from "leancloud-realtime"

import {Memory} from "../../util/Memory";
import {MyHttp} from "../../util/MyHttp";
import {ImgService} from "../../util/ImgService";
import {Http} from "@angular/http";


@Component({
  selector:'page-matchmaker',
  templateUrl:'matchmaker.html'
})

export class MatchmakerPage{

  constructor(public navCtrl:NavController,public navParams:NavParams,public memory:Memory,
              public events: Events,public alertCtrl:AlertController,private myHttp:MyHttp,
              public imgService: ImgService,private http:Http) {

  };



  /*
  * 将该页面拿出堆栈
  * */
  back(){
    this.navCtrl.pop();
  }
}
