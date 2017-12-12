import {Component} from "@angular/core";

import {AlertController, LoadingController, NavController} from "ionic-angular";

import {MyHttp} from "../../util/MyHttp";
import {Memory} from "../../util/Memory";
import {ImgService} from "../../util/ImgService";
import {CalculateService} from "../../util/CalculateService";


declare var AliPay:any;

@Component({
  selector:"page-pay",
  templateUrl:"pay.html"
})

export class PayPage{

  constructor(public navCtrl: NavController,private myHttp:MyHttp,
              public alertCtrl: AlertController,public loadingCtrl:LoadingController,
              public memory:Memory,public imgService: ImgService,
              public calCulate:CalculateService){
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
  public dcs = ['3.00元','50.00元','100.00元','200.00元'];
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
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();
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
      loader.dismiss();
    })

  }

  //去支付
  goToPay(order:any){
    this.myHttp.post(MyHttp.URL_ORDER_INFO,{
      userId:this.memory.getUser().id,
      vipId:order.id
    },(data)=>{
      this.payInfo = data.payInfo;
      if(this.payInfo!=null){
        //第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理
        //第二步：调用支付插件
        AliPay.pay(this.payInfo, function success(e){
            console.log("这里是成功信息"+e.result.toString()+"提示信息"+e.memo);
            this.paySorE("支付成功");
          },function error(e){
            console.log("这里是失败信息"+e.result.toString()+"错误代码"+e.resultStatus+"提示信息"+e.memo);
            this.paySorE("支付失败");
        });
      }
    })

    /*this.paySorE("请求支付");*/

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
}
