import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SafeUrl } from '@angular/platform-browser';

import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { ImgService } from '../../util/ImgService'

import { HomeIntroducePage } from '../../pages/home-introduce/home-introduce'
import {StartPage} from "../start/start";
import {SearchPage} from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  /**
   * 婚配对象列表
   */
  public userList = [];
  public id;


  constructor(public navCtrl: NavController, private myHttp : MyHttp, public alertCtrl: AlertController, public memory: Memory, private imgService:ImgService) {
    this.getUserList();
  }

  /**
   * 获取用户列表
   */
  getUserList() {
    this.id = this.memory.getUser().id;
    if(!this.id){
      this.id = this.memory.getSex();
    }

    if(this.id){
      this.myHttp.post(MyHttp.URL_USER_LIST, {
        userId : this.id,
        size : 10,
        index : 1
      },(data) => {
        console.log(data)
        this.userList = data.userList;
      })
    }

  }

  /**
   *
   * @param image
     */
  changeImage(image: String) : SafeUrl{
    return this.imgService.safeImage(image)
  }

  /**
   *
   * @param userId
     */
  getIntroduce(userId: any) {
    console.log(userId)
    if(this.memory.getUser().id){
      this.navCtrl.push(HomeIntroducePage, {otherUserId: userId})
    }else if(this.memory.getSex()) {
      this.gotoLogin();
    }
  }

  /**
   * 未登录
   */
  gotoLogin(){
    this.alertCtrl.create({
      message:'亲~请先登录才能查看更多完整信息',
      buttons:[{
        text:'OK',
        handler:()=>{
          this.memory.setSex({});
          this.navCtrl.setRoot(StartPage);
        }
      }]
    }).present();
  }

  gotoSearch(){
    if(this.memory.getUser().id){
      this.navCtrl.push(SearchPage);
    }else{
      this.gotoLogin()
    }
  }
}
