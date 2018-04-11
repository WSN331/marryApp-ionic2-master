/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
import { AlertController, NavController, NavParams} from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ImgService } from '../../util/ImgService'
import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'

@Component({
  selector: 'page-addTip',
  templateUrl: 'addTip.html'
})

export class AddTipPage {

  /**
   * 图片的base64格式
   */
  private base64 = [];

  private toUserId;

  private typeId;

  private typeList = [];

  private content = ""

  constructor(public myHttp : MyHttp, public memory: Memory,
              public navParams: NavParams, public imgService:ImgService, public navCtrl: NavController,
              public events: Events, public alertCtrl: AlertController) {
    this.toUserId = this.navParams.get("toUserId")
    this.getTipTypeList();
  }

  getTipTypeList() {
    this.myHttp.get(MyHttp.URL_TIP_TYPE_LIST, (data) => {
      this.typeList = data.tipTypeList;
      console.log(this.typeList)
    })
  }

  /**
   * 添加图片
   */
  addPicture() {
    if (this.base64.length >= 4) {
      this.alertCtrl.create({
        title: "失败",
        subTitle: "不能传那么多图片的啊后台小哥哥小姐姐会不高兴哒！！！",
        buttons: ["关闭"]
      }).present();
    }
    this.imgService.chooseCamera((imageData) => {
      this.base64.push(imageData);
    })
  }

  /**
   * 删除图片
   * @param index
     */
  deletePicture(index) {
    console.log(index)
  }

  /**
   * 提交
   */
  addTip(type) {

    let picStr = "";
    for (let item of this.base64) {
      picStr = picStr + item + ";"
    }

    this.myHttp.post(MyHttp.URL_ADD_TIP, {
      userId: this.memory.getUser().id,
      toUserId : this.toUserId,
      typeId: this.typeId,
      picture: picStr,
      content: this.content
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
