import {Component} from "@angular/core";

import {AlertController, NavController, Platform} from "ionic-angular";
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Buffer } from 'buffer';
import {LoadingController, Events} from 'ionic-angular';

import {MyHttp} from "../../util/MyHttp";
import {Memory} from "../../util/Memory";
import {MyStorage} from "../../util/MyStorage";
import {ImgService} from "../../util/ImgService";
import {CalculateService} from "../../util/CalculateService"

declare var AliPay:any;

@Component({
  selector:"page-pay",
  templateUrl:"pay.html"
})

export class PayPage{

  constructor(public navCtrl: NavController,private myHttp:MyHttp, public alertCtrl: AlertController,
              public memory:Memory,public imgService: ImgService,public myStorage:MyStorage,
              public calculate : CalculateService, private iap: InAppPurchase, public platform: Platform,
              public loadingCtrl:LoadingController, public events:Events){
    this.getUserMsg();
    this.getOrder();
  }

  //所有订单
  public orders:any=[];
  //服务器返回VIP类型
  public vipTypes = [];
  //订单信息
  public payInfo = null;

  public imgs = [
    'assets/img/vip.png',
    'assets/img/vip.png',
    'assets/img/vip.png',
    'assets/img/crown.png'
  ];
  public dcs = ['9.99元','19.99元','69.99元','99.99元'];
  public month = ['1天','1个月','3个月','1年'];


  public user = {};
  getUserMsg(){
    if(this.memory.getUser()!=" " && this.memory.getUser()!="undefined"&&this.memory.getUser()!=null){
      this.user = this.memory.getUser();
      console.log(this.user+"个人信息"+this.memory.getUser()+"个人信息");
    }
  }


  /**
   * 请求订单数据
   */
  getOrder(){
    this.myHttp.post(MyHttp.URL_ORDER_PRICE,null,(data)=>{
      console.log(data);
      this.vipTypes = data.vipTypes

      for(let i=0;i<this.vipTypes.length;i++){
        let order = {
          img:'',
          name:'',
          price:'',
          des:'',
          month:'',
          id:''
        }
        //图标
        order.img = this.imgs[i];
        //什么会员
        order.name = this.vipTypes[i].name;
        //几个月
        order.month = this.month[i];
        //价格
        order.price = this.vipTypes[i].price+"元";
        //原价
        order.des = this.dcs[i];
        order.id = this.vipTypes[i].id;
        this.orders.push(order);
      }
    })

  }

  goToPay(order:any) {
    if (this.platform.is("android")) {
      this.goToPayAli(order);
    } else if (this.platform.is("ios")) {
      this.goToPayIap(order);
    }
  }

  //去支付
  goToPayAli(order:any){
    this.myHttp.post(MyHttp.URL_ORDER_INFO,{
      userId:this.memory.getUser().id,
      vipId:order.id
    },(data)=>{
      this.payInfo = data.payInfo;
      if(this.payInfo!=null){
        //第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理
        //第二步：调用支付插件
        AliPay.pay(this.payInfo, (e)=>{
            console.log("这里是成功信息"+e.result.toString()+"提示信息"+e.memo);
            this.paySorE("支付成功");

            this.setNewUser();
            this.doRefresh();

          },(e)=>{
            console.log("这里是失败信息"+e.result.toString()+"错误代码"+e.resultStatus+"提示信息"+e.memo);
            this.paySorE("支付失败");

        });
      }
    })

    /*this.paySorE("请求支付");*/

  }

  /**
   * 刷新界面
   */
  doRefresh() {
    this.getUserMsg();
  }

  //重新获取登录信息
  public loginInfo = {
    account:'',
    password:''
  }

  //重新设置user信息
  setNewUser(){


/*    this.myHttp.post(MyHttp.URL_USER_INTRODUCE, {
      userId: this.memory.getUser().id,
      otherUserId: this.memory.getUser().id
    }, (data) => {
      console.log(data)
      this.memory.setUser(data.baseInfo);
    });*/
    this.myStorage.getAccount().then((val)=>{
      if(val!=null){
        console.log(val)
        this.loginInfo.account = val;
        this.myStorage.getPassword().then((val)=>{
          if(val!=null){
            console.log(val)
            this.loginInfo.password = val;
            //获取了之前登陆过的信息
            this.myHttp.post(MyHttp.URL_LOGIN, this.loginInfo, (data) => {
              console.log(data)
              let loginResult = data.loginResult;
              if (loginResult==='2' || loginResult==='1') {
                console.log("账号密码错误")
                this.paySorE("获取信息异常，请关闭应用后重新打开");
              } else {
                console.log(data.user)

                this.myStorage.setUser(data.user);
                this.memory.setUser(data.user);
              }
            })
          }else{
            console.log("val中password为空")
          }
        })
      }else{
        console.log("val中account为空")
      }
    })
  }


  /**
   * 支付成功与否显示框
   * @param subTitle
   */
  paySorE(subTitle: string) {
    this.alertCtrl.create({
      title: "支付",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  goToPayIap(order:any) {
    console.log(order)


    let protectedId = "com.ICLabs.marryapp0" + order.id;
    let loader = this.loadingCtrl.create({
      // spinner: "bubbles",
      showBackdrop : false
    });
    loader.present();
    console.log(protectedId)
    this.iap
      .getProducts([protectedId])
      .then((products) => {
        console.log(products);
         // [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
        this.iap
          .buy(products[0].productId)
          .then((data)=> {
            console.log(data);
            loader.dismiss();
            this.iapCertificate(data, order.id);
            // {
            //   transactionId: ...s
            //   receipt: ...
            //   signature: ...
            // }
          })
          .catch((err)=> {
            console.log(err);
            loader.dismiss();
          });
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });

  }

  /**
   *
   * @param receipt
     */
  iapCertificate (receipt, vipId) {
    let receiptBase64 = new Buffer(JSON.stringify(receipt)).toString('base64');
    this.myHttp.post(MyHttp.URL_IAP_CERTIFICATE,{
      userId: this.memory.getUser().id,
      receipt: receiptBase64,
      chooseEnv: true,
      vipId: vipId
    },(data)=>{
      console.log(data)
      let result = data.iapCertificateResult;
      if(result != null && result.status == "0") {
        this.events.subscribe("e-user-introduce");
        alert("支付成功")
      }
    });
  }


}
