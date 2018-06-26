import { Component } from '@angular/core';
import { App, NavController, AlertController} from 'ionic-angular';
import { MyHttp } from '../../util/MyHttp';
import { Memory } from '../../util/Memory'
import { MyStorage } from '../../util/MyStorage';

import { StartPage } from '../start/start'

@Component({
  selector: 'page-deleteUser',
  templateUrl: 'deleteUser.html'
})
export class DeleteUserPage{

  private text = "注销账号后，您的信息将不会再展示，账号将被冻结，请慎重考虑。若想再次使用，请登录激活，并重新提交认证资料，审核后开启账号。请输入您的密码，再次确认注销";

  private reasons = [
    '找到另一半了',
    '受到骚扰',
    '这里没有我心仪的对象',
    '其他原因'
  ]

  private selectReason = [false, false, false, false];

  constructor(public navCtrl: NavController, private myHttp:MyHttp, public memory:Memory,
    public app:App, public myStorage:MyStorage, public alertCtrl: AlertController) {

  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  // 提交注销
  submitDelete() {
    this.alertCtrl.create({
      title: "确定永久注销账号？",
      subTitle: this.text,
      buttons: [{
        text: '确定',
        handler: data => {
          this.inputPassword();
        }
      },"关闭"]
    }).present();
  }

  // 输入密码
  inputPassword() {
    this.alertCtrl.create({
      title: "请输入密码",
      inputs: [{
        name: 'password',
        placeholder: 'password'
      }],
      buttons: [{
        text: '确定',
        handler: data => {
          this.doDelete(data.password);
        }
      },"关闭"]
    }).present();
  }

  //　实际删除操作
  doDelete(password) {
    let reason = '';
    for (let index in this.selectReason) {
      if (this.selectReason[index] == true) {
        reason = reason + this.reasons[index] + ";"
      }
    }

    console.log(this.memory.getUser())

    this.myHttp.post(MyHttp.URL_GET_CANCEL_REGISTER, {
      userId: this.memory.getUser().id,
      account: this.memory.getUser().account,
      password: password,
      reason : reason
    }, (data) => {

      if (data.cancelRegisterResult == '0') {
        this.alertCtrl.create({
          title: "注销",
          subTitle: "成功注销",
        }).present();
        this.myStorage.setAccount(null);
        this.myStorage.setPassword(null);
        this.app.getRootNav().setRoot(StartPage);
        this.myStorage.setUser(null);
        this.memory.setUser({});

      } else if (data.cancelRegisterResult == '1') {

        this.alertCtrl.create({
          title: "注销",
          subTitle: "密码错误，请重新填写",
          buttons: [{
            text: '确定',
            handler: () => {
              this.inputPassword()
            }
          }]
        }).present();

      } else {
        // 未知错误
        this.alertCtrl.create({
          title: "注销",
          subTitle: "注销失败，请重新登录app尝试操作或联系客服处理",
          buttons: ["关闭"]
        }).present();
      }
    });
  }


}
