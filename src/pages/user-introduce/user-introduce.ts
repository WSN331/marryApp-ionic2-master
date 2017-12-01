/**
 * Created by ASUS on 2017/9/4 0004.
 */
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {LoadingController} from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import { UserDetailPage } from '../user-detail/user-detail'
import { AboutPage } from "../about/about"

@Component({
  selector: 'page-userIntroduce',
  templateUrl: 'user-introduce.html'
})

export class UserIntroducePage {
  /**
   * 基本信息
   */
  public baseInfo = {};

  /**
   * 详细信息
   */
  public detailInfo = {}

  /**
   * 全部图片
   * @type {Array}
   */
  public allPictures = []

  constructor(public navCtrl:NavController, private myHttp:MyHttp, public imgService:ImgService,
              public memory:Memory, public events: Events, public calculateService: CalculateService,
              public alertCtrl: AlertController, public loadingCtrl:LoadingController) {
    this.getUserInfo();
    this.getAllPicture();
    this.events.subscribe('e-user-introduce', () => {
      this.getUserInfo();
    }) 
  }
  
  goToSetting() {
    this.navCtrl.push(AboutPage);
  }

  /**
   * 获取用户信息
   * @param callBack 可能存在的回调
   */
  getUserInfo(callBack?) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      loader.dismiss();
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    })
  }

  /**
   * 获取全部图片
   */
  getAllPicture() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
    this.myHttp.post(MyHttp.URL_GET_ALL_PICTURE, {
      userId: this.memory.getUser().id
    }, (data) => {
      this.allPictures = data.allPicture;
      loader.dismiss()
    })
  }

  /**
   * 判断图片是否已经满
   * @returns {boolean} 是否满
     */
  imageNotFull() : boolean {
    return this.allPictures.length < 4;
  }

  /**
   * 图片操作
   * @param index 图片序号
   */
  controlImage(index) {
    console.log(index)
    this.alertCtrl.create({
      title: '图片操作',
      buttons: [{
        text:'设为头像',
        handler: ()=> {
          this.changeImage(index);
        }
      },{
        text:'删除图片',
        handler: ()=> {
          this.delPicture(index);
        }
      },'取消']
    }).present();
  }

  /**
   * 修改图片
   * @param index 图片序号
     */
  changeImage(index) {
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
      picture: index,
      userId: this.memory.getUser().id
    }, (data)=>{
      this.getUserInfo(()=> {
        this.memory.setUser(this.baseInfo);
        this.events.publish("e-user-self");
      });

    })

  }

  /**
   * 删除图片
   * @param index 下标
     */
  delPicture(index) {
    this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
      delPicture: index,
      userId: this.memory.getUser().id
    }, (data)=>{
      this.getAllPicture();
    })
  }

  /**
   * 添加图片
   */
  addPicture() {
    this.imgService.chooseCamera((imageData) => {
      this.myHttp.post(MyHttp.URL_USER_COMPLETE, {
        addPicture: imageData,
        userId: this.memory.getUser().id
      }, (data)=>{
        this.getAllPicture();
      })
    })
  }

  /**
   * 跳转到完善信息界面
   */
  detail() {
    this.navCtrl.push(UserDetailPage);
  }

}
