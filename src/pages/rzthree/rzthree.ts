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
  selector: 'page-rzthree',
  templateUrl: 'rzthree.html'
})
export class RzThreePage {

  public graduation = "yes"

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
      message: '完成认证，才能为您匹配到最适合的Ta~',
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
