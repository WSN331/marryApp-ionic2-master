import {Component} from "@angular/core";
import {AlertController, NavController} from "ionic-angular";

import {ContactPage} from "../contact/contact";
import {PeoplePage} from "../perlist/people";
import {Memory} from "../../util/Memory";
import {CredListPage} from "../credList/credList";

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})

export class MessagePage {

  constructor(public navCtrl:NavController,public memory:Memory,public alertCtrl:AlertController) {
  }

  //心动记录
  goToContact() {
    if(!this.isCredMain()){
      this.goToCred();
    }else{
      this.navCtrl.push(ContactPage);
      //红色小点显示
      this.memory.setLike(false);
    }
  }

  //最近访问
  goToPeople(){
    if(!this.isCredMain()){
      this.goToCred();
    }else{
      this.navCtrl.push(PeoplePage);
    }
  }

  //判断是否验证
  /**
   *
   * @returns {boolean}
   */
  isCredMain() {
    return this.memory.getUser().mainCredNum >= 3;
  }

  /**
   * 认证信息提示
   */
  goToCred() {
    this.alertCtrl.create({
      message: '亲~请先认证信息才能查看更多内容',
      buttons: [
        {
          text:'NO'
        },
        {
          text: 'OK',
          handler: ()=> {
            this.navCtrl.push(CredListPage);
          }
        }
      ]
    }).present();
  }


  /*
* 将该页面拿出堆栈
* */
  back(){
    this.navCtrl.pop();
  }
}
