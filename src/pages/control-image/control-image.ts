/**
 * Created by ASUS on 2017/10/23 0023.
 */
import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ImgService } from '../../util/ImgService'
import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'


@Component({
  selector: 'page-controlImage',
  templateUrl: 'control-image.html'
})

export class ControlImagePage {

  /**
   * 证件类型
   * @type {Array}
     */
  private pictures = [];

  private userId;

  constructor(public navCtrl: NavController, public myHttp : MyHttp, public imgService:ImgService,
              public memory: Memory, public events: Events, public navParams: NavParams) {
    this.init();
  }

  init() {
    this.pictures = this.navParams.get("pictures") || [];
    this.userId = this.memory.getUser().id;
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

}
