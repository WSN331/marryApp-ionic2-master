/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
// import {LoadingController} from 'ionic-angular';
import { AlertController, NavController, NavParams} from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ImgService } from '../../util/ImgService'
import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

@Component({
  selector: 'page-addCred',
  templateUrl: 'addCred.html'
})

export class AddCredPage {

  /**
   * 图片的base64格式
   */
  private base64 = [];

  private title;
  private types = [];

  constructor(public myHttp : MyHttp, /*public loadingCtrl:LoadingController, */public memory: Memory,
              public navParams: NavParams, public imgService:ImgService, public navCtrl: NavController,
              public events: Events, public alertCtrl: AlertController) {
    this.getTitle();
  }

  /**
   * 获取信息类型
   */
  getTitle() {
    this.title = this.navParams.get('title')
    this.types = this.navParams.get('types')
    console.log("title:")
    console.log(this.title)
    console.log("type:")
    console.log(this.types)
  }

  /**
   * 添加图片
   */
  addPicture(typeId) {
    this.imgService.chooseCamera((imageData) => {
      this.base64[typeId] = imageData;
    })
  }

  /**
   * 是否有图片存在
   * @returns {boolean}
   */
  havePic(typeId : number) {
    return this.base64[typeId] != null && this.base64[typeId] != undefined;
  }

  saveBtn() {
    for (let type of this.types) {
      this.addCred(type)
    }
  }

  /**
   * 初始化身份验证的信息
   */
  addCred(type) {
    if (!this.havePic(type.id)) {
      this.alertCtrl.create({
        title: '请先选中图片',
        buttons: ['关闭']
      }).present();
      return;
    }
    // let loader = this.loadingCtrl.create({
    //   content: "Please wait...",
    // });
    // loader.present();
    this.myHttp.post(MyHttp.URL_ADD_CRED, {
      userId: this.memory.getUser().id,
      picture: this.base64[type['id']],
      typeId: type['id']
    }, (data) => {
      console.log(data)
      this.events.publish("e-get-cred");
      this.navCtrl.pop();
    })
  }

  back(){
    this.navCtrl.pop();
  }
}
