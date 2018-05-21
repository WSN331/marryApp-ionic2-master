/**
 * Created by ASUS on 2017/8/29 0029.
 */
import { Component } from '@angular/core';
import { AlertController, NavController, NavParams} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'
import {CalculateService} from '../../util/CalculateService'

import {CommunicatePage} from "../communicate/communicate";
import {LargeImagePage} from "../large-image/large-image";
import {PayPage} from "../purchase/pay";
import {AddTipPage} from "../addTip/addTip";

@Component({
  selector: 'page-homeIntroduce',
  templateUrl: 'home-introduce.html'
})

export class HomeIntroducePage {

  /**
   * 基本信息
   */
  public baseInfo = {};

  /**
   * 详细信息
   */
  public detailInfo = {}

  /**
   * 关系
   * @type {string}
     */
  public relation = "0"

  /**
   * 通过审核的证件
   * @type {Array}
     */
  public creds = [];

  /**
   * 全部图片
   * @type {Array}
     */
  public allPictures = [];

  /**
   * 是否显示弹窗
   * @type {boolean}
     */
  public display_dialog=false;

  /**
   * 验证信息
   * @type {Array}
   */
  public myCred = [];
  /**
   * 需要验证的项目
   */
  public credTypes = [];

  public credTitles = [];

  /**
   *
   * @type {boolean}
   */
  public noCredSuccess = true;

  public allCredSuccess = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alert:AlertController,
              public myHttp : MyHttp, public imgService:ImgService, public memory: Memory,
              public calculateService: CalculateService, public loadingCtrl:LoadingController
              ,public alertCtrl:AlertController) {
    this.init();
    this.getUserInfo();
    this.getAllPicture();
    this.initCred();
  }

  init() {
    this.baseInfo = this.navParams.get('baseInfo')
  }

  /**
   * 查看大图
   * @param base64
   */
  toLargeImage(picture) {
    this.navCtrl.push(LargeImagePage, {
      pictureNow : picture,
      pictureAll : this.allPictures
    });
/*    this.navCtrl.push(LargeImagePage, {
      imageBase64 : picture.img,
      bigImageName : picture.bigImageName
    });*/
  }

  /**
   * 返回
   */
  back() {
    this.navCtrl.pop();
  }

  changeDisplayDialog() {
    this.display_dialog = !this.display_dialog;
  }

  /**
   * 获取用户信息
   */
  getUserInfo(callBack?) {
    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.baseInfo['id']
    }, (data) => {
      console.log(data)
      this.baseInfo = data.baseInfo || {};
      this.detailInfo = data.detailInfo || {};
      this.relation = data.relation || "0";
      this.creds = data.creds || [];
      if(data.introduceResult==='1'){
        this.pushPrompt();
      }
      if (callBack !== null && typeof callBack === 'function') {
        callBack();
      }
    }, null, true)
  }

  /**
   * 获取全部图片
   */
  getAllPicture() {
    this.myHttp.post(MyHttp.URL_GET_ALL_SMALL_PICTURE, {
      userId: this.memory.getUser().id,
      otherUserId: this.baseInfo['id']
    }, (data) => {
      console.log(data)
      this.allPictures = data.allIcon.concat(data.allPicture);
    }, null, true)
  }

  /**
   * 没有查询到用户的弹出框
   */
  pushPrompt() {
    this.alert.create({
      message:'查无此人，请确认后查询',
      buttons:[{
        text:'OK',
        handler:()=>{
          this.navCtrl.pop();
      }
      }]
    }).present();
  }

  /**
   *
   * @param type 0喜欢，1讨厌，2取消喜欢，3取消讨厌，4收藏，5取消收藏
     */
  changeRelation(type: number) {
    let url = [MyHttp.URL_LIKE,MyHttp.URL_HATE,MyHttp.URL_DIS_LIKE,MyHttp.URL_DIS_HATE,MyHttp.URL_COLLECT,MyHttp.URL_DIS_COLLECT][type];
    this.myHttp.post(url, {
      userId: this.memory.getUser().id,
      toUserId: this.baseInfo['id']
    }, (data) => {
      //点击喜欢
      if(type===0){
        this.memory.setLike(true);
      }
      this.getUserInfo();
    })
  }

  /**
   * 切换到聊天界面
   */
  eachCommunicate(){
    if(this.isVipOrNot()){
      this.navCtrl.push(CommunicatePage,{
        person:this.baseInfo
      });
    }else{
      //当前用户不是vip用户,那么就发出善意的提醒
      this.backMessage();
    }
  }

  /**
   * 判定用户验证信息
   */
  private initCred() {
    this.myHttp.post(MyHttp.URL_CRED_INFO_BY_TITLE, {
      userId: this.baseInfo['id']
    }, (data) => {
      //验证信息
      this.myCred = data.myCred;
      //所有需要验证的项目
      this.credTypes = data.credTypes;

      this.credTitles = data.credTitles;
    })
  }

  /**
   * 获取身份验证状态
   * @param typeId
   * @returns {any} -2 ~ 1分别表示 未认证、未通过、等待审核、审核通过
   */
  getStatus(typeId) : boolean {
    for (let cred of this.myCred) {
      if (cred.type.id == typeId && cred.auditStatus == 1) {
        return true;
      }
    }
    return false;
  }

  /**
   * 根据标题
   * @param titleId
   */
  getStatusByTitle (titleId) {
    for (let type of this.credTypes) {
      if (type.title['id'] === titleId) {
        let status = this.getStatus(type.id);
        if (!status) {
          return false;
        }
      }
    }
    this.noCredSuccess = false;
    return true;
  }

  /**
   * 判断当前用户是否是VIP用户
   */
  isVipOrNot():boolean{
    return this.calculateService.isVip(this.memory.getUser().vipTime)
  }

  /**
   * 提示成为vip
   */
  backMessage() {
    let prompt = "亲~成为尊敬的Vip用户才能查看对方给你发来的信息哦";
    this.alertCtrl.create({
      message: prompt,
      buttons: [
        {
          text:'狠心放弃'
        },
        {
          text:'立刻成为',
          handler:()=>{
            //去到vip页面
            this.navCtrl.push(PayPage);
          }
        }

      ]
    }).present();
  }

  goToTip() {
    this.navCtrl.push(AddTipPage, {
      toUserId:this.baseInfo['id']
    })
  }

  isNotNull(item) {
    return item !== undefined && item !== null;
  }

  isNotZero(num) {
    return this.isNotNull(num) && num != 0;
  }
}
