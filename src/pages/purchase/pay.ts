import {Component} from "@angular/core";

import {AlertController, LoadingController} from "ionic-angular";

import {MyHttp} from "../../util/MyHttp";
import {Memory} from "../../util/Memory";


declare var AliPay:any;

@Component({
  selector:"page-pay",
  templateUrl:"pay.html"
})

export class PayPage{

  constructor(private myHttp:MyHttp,public alertCtrl: AlertController,public loadingCtrl:LoadingController,
              public memory:Memory){
    this.getOrder();
  }

  //所有订单
  public orders:any=[];
  //服务器返回VIP类型
  public vipTypes = [];
  //订单信息
  public payInfo = null;

  public images = ['assets/img/card-saopaolo.png',
                   'assets/img/card-amsterdam.png',
                   'assets/img/card-sf.png'];
  public dcs = ['每天仅需3.9元','每天仅需3.2元','原价2688元'];


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
          image:'',
          price:'',
          des:'',
          id:''
        }

        order.image = this.images[i];
        order.price = this.vipTypes[i].price+"元/"+this.vipTypes[i].name;
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
          },function error(e){
            console.log("这里是失败信息"+e.result.toString()+"错误代码"+e.resultStatus+"提示信息"+e.memo);
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

}
