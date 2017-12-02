/**
 * Created by ASUS on 2017/9/4 0004.
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { MyHttp } from '../../util/MyHttp';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  /**
   * 注册的表单数据
   */
  public registerForm = {
    account: '',
    verifyCode:'',
    password: '',
  };

  constructor(public navCtrl:NavController, private myHttp:MyHttp,
              public alertCtrl:AlertController,public changeDetectorRef:ChangeDetectorRef) {
  }
  //界面刷新
  public getCode = "获取验证码";
  public show = "click";
  public timeShow = 60;
  public timer;
  ngReFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.changeDetectorRef.detectChanges();
      if(this.timeShow>=1){
        this.timeShow -= 1;
        this.show="unclick";
        this.getCode = "获取验证码 ("+this.timeShow+")";
      }else{
        this.show="click";
        this.getCode="获取验证码"
        clearInterval(this.timer);
      }
      console.log("1");
    },1000);
  }

  //是否同意协议
  public cucumber=true;
  /**
   * 注册
   */
  public register() {
    let rulePhone = /^1[3|4|5|7|8][0-9]{9}$/;
    let rulePas = /^[a-zA-Z0-9]{6,20}$/;
    console.log(this.registerForm)
    if(!this.cucumber){
      this.registerMessage("请同意协议内容");
      return;
    }
    for (let name in this.registerForm) {
      if (this.registerForm[name] === undefined || this.registerForm[name] === '') {
        this.registerMessage("信息必须填全");
        return;
      }
    }
    if(!rulePhone.test(this.registerForm.account)){
      this.registerMessage("请输入正确的手机号码");
      return;
    }
    if(!rulePas.test(this.registerForm.password)){
      this.registerMessage("请按密码格式输入");
      return;
    }


    this.myHttp.post(MyHttp.URL_REGISTER, this.registerForm, (data) => {
      if (data.registerResult === "0") {
        this.registerMessage("注册成功");
        this.navCtrl.pop();
      } else if (data.registerResult === "1") {
        this.registerMessage("该手机已经注册!");
      }
    })
  }

  /**
   * 发送验证码
   */
  sendVerify() {
    if(this.show == "click"){
      this.ngReFresh()
      this.timeShow = 60;
      this.registerMessage("nihao");
      this.myHttp.post(MyHttp.URL_SEND_VERIFY, {
        phone: this.registerForm.account
      }, (data) => {
        console.log(data);
        if (data.sendResult === "0") {
          this.registerMessage("发送验证码成功，请在10分钟内验证");
        } else if (data.sendResult === "1") {
          this.registerMessage("发送验证码失败：" + data.message);
        }
      })
    }
  }

  /**
   * 注册信息
   * @param subTitle
     */
  private registerMessage(subTitle: string) {
    this.alertCtrl.create({
      title: "注册",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  private seeProtocol(){
    let protocol = "邂逅斯年软件服务协议\n" +
      "特别提示\n" +
      "\n" +
      "杭州杭州来布科技有限公司（以下简称“来布科技”）在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。除非您接受本协议所有条款，否则您无权注册、登录或使用本协议所涉服务。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。 \n" +
      "本协议约定来布科技与用户之间关于“邂逅斯年”软件服务（以下简称“服务”）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由来布科技随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知，用户可在本网站查阅最新版协议条款。在来布科技修改协议条款后，如果用户不接受修改后的条款，请立即停止使用来布科技提供的服务，用户继续使用来布科技提供的服务将被视为接受修改后的协议。\n" +
      "\n" +
      "一、账号注册\n" +
      "1、用户在使用本服务前需要注册一个“邂逅斯年”账号。“邂逅斯年”账号应当使用手机号码绑定注册，请用户使用尚未与“邂逅斯年”账号绑定的手机号码，以及未被来布科技根据本协议封禁的手机号码注册“邂逅斯年”账号。来布科技可以根据用户需求或产品需要对账号注册和绑定的方式进行变更，而无须事先通知用户。 \n" +
      "2、鉴于“邂逅斯年”账号的绑定注册方式，您同意来布科技在注册时将使用您提供的手机号码及/或自动提取您的手机号码及自动提取您的手机设备识别码等信息用于注册。 \n" +
      "3、在用户注册及使用本服务时，来布科技需要搜集能识别用户身份的个人信息以便来布科技可以在必要时联系用户，或为用户提供更好的使用体验。来布科技搜集的信息包括但不限于用户的姓名、性别、年龄、出生日期、身份证号、地址、学校情况、公司情况、所属行业、兴趣爱好、常出没的地方、个人说明；来布科技同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。 \n" +
      "4、“邂逅斯年”是一款面向有明确结婚意向的单身人士的实名制移动社交产品，用户需要向“邂逅斯年”提交可以证实自己个人信息真实性的包括但不限于用户的身份证件号码及正反面照片、护照证件号码及照片、学历学位证书正面照片、房产证件正面照片、汽车行驶证件正面照片，“邂逅斯年”有权对用户提交的认证信息进行审核并且确认通过或者否决通过。用户无法通过“邂逅斯年”的信息认证审核将无法使用“邂逅斯年”提供的包括但不限于即时通讯、关注他人产品功能，但可以查看其他会员的公开资料及使用“邂逅斯年”提供的条件搜索功能。“邂逅斯年”将对用户提交的用于个人信息真实性认证的资料进行严格的保密。";
    this.alertCtrl.create({
      subTitle:"邂逅斯年协议",
      message: protocol,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 返回信息
   * @param {string} subTitle
   */
  private backMessage() {
    let prompt = "婚姻是件严肃的事情，需要认真对待，宁确定要放弃吗？";
    this.alertCtrl.create({
      subTitle: prompt,
      buttons: [
        {
          text:'狠心放弃',
          handler:()=>{
            this.navCtrl.pop();
          }
        },
        {
          text:'再考虑一下'
        }
      ]
    }).present();
  }

}
