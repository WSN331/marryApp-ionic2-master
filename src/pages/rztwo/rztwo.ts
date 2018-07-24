/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {MyHttp} from "../../util/MyHttp";


@Component({
  selector: 'page-rztwo',
  templateUrl: 'rztwo.html'
})
export class RzTwoPage {

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public imgService:ImgService,
              public memory: Memory, public events: Events, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  /**
   * 弹框
   */
  popKuang(){
    this.alertCtrl.create({
      message: '提交身份证才能遇见同样真实的TA',
      buttons: [{
        text:'稍后认证',
        handler: ()=> {
          //this.navCtrl.push(PayPage);
        }
      },
        {
          text: '继续提交',
        }
      ]
    }).present();
  }
}
