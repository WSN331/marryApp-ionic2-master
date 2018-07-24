/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {MyHttp} from "../../util/MyHttp";
import {RzThreePage} from "../rzthree/rzthree";
import {RzTwoRgPage} from "../rztworg/rztowrg";


@Component({
  selector: 'page-rztwo',
  templateUrl: 'rztwo.html'
})
export class RzTwoPage {

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public imgService:ImgService,
              public memory: Memory, public events: Events, public navParams: NavParams, public alertCtrl: AlertController) {
  }


  //下一步
  next(){
    this.navCtrl.push(RzThreePage)
  }

  //返回
  back(){
    this.navCtrl.pop();
  }
  //人工认证
  peoRz(){
    this.navCtrl.push(RzTwoRgPage)
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
          this.navCtrl.push(RzThreePage);
        }
      },
        {
          text: '继续提交',
        }
      ]
    }).present();
  }
}
