import {Component} from "@angular/core";
import {AlertController, Events, NavController, NavParams} from "ionic-angular";

import {Memory} from "../../util/Memory";

import * as AV from "leancloud-realtime"



@Component({
  selector:'page-communicate',
  templateUrl:'communicate.html'
})

export class CommunicatePage{
  //实时通信
  public realtime;
  //登录用户
  public mySelf;
  //通话用户
  public otherSelf;
  //需要发送的信息
  public realSend;
  public sendText;
  //正在交谈的对话
  public conversation = null;
  //存储发送的信息
  public MsgList:any=[];
  //存储接收的信息
  public RsgList:any = [];
  //接收多有信息
  public subMsgList:any = [];

  constructor(public navCtrl:NavController,public navParams:NavParams,public memory:Memory,
              public events: Events,public alertCtrl:AlertController){
    this.initAVcom();
    //得到最近20条聊天记录
    this.receiveMessageList();
    //得到在线消息
    this.receiveMessage((msg,conversation)=> {
      this.subMsgList.push(msg);
      //及时更新页面
      this.ngFresh();
    });

    this.ngFresh();
  }

  /**
   * 界面刷新
   */
  ngFresh(){
    //设置一个定时器，每秒刷新该界面
    this.timer = setInterval(()=>{
      this.gotoBottom();
      console.log("1");
    },1000);
  }

  public timer;
  ngOnDestroy(){
    // 当前聊天的对话收到了消息立即标记为已读
    if(this.conversation!=null){
/*      this.conversation.on('message', ()=>{
        this.conversation.read().catch(console.error.bind(console));
      });*/
      //更新之前的页面
      this.events.publish("e-people");
    }
  }


  //聊天窗口变换
  gotoBottom(){
    let div = document.getElementById('first');
    if(div!=null){
      div.scrollTop = div.scrollHeight;
    }
    clearInterval(this.timer);
  }

  /**
   * 初始化
   */
  initAVcom(){
    this.realtime = this.memory.getTiming();
    this.mySelf = this.memory.getUser().id;
    this.otherSelf = this.navParams.get('person');
  }

  /**
   * 发送信息
   */
  sendMessage(){
    // 用自己的id作为 clientId，获取 IMClient 对象实例
    if(this.sendText!=null && this.sendText.toString().trim()!=null){
      this.realSend = this.sendText;

      let msg = new AV.TextMessage(this.realSend);
      msg.from = this.mySelf;

      this.subMsgList.push(msg);

      this.ngFresh();

      this.realtime.createIMClient(this.mySelf+'').then((my)=>{
        // 创建与Jerry之间的对话
        return my.createConversation({
          members: [this.otherSelf+''],
          name: this.mySelf+'&'+this.otherSelf,
          unique:true,
        })
      }).then((conversation)=>{
        // 发送消息
        return conversation.send(new AV.TextMessage(this.realSend));
      }).then((message) =>{
        console.log(this.mySelf+'&'+this.otherSelf, '发送成功！');
      }).catch(console.error);

      this.sendText = null;
    }
  }

  /**
   * 读取最近聊天记录
   */
  receiveMessageList(){
    this.conversation = this.navParams.get('talkmsg');

    console.log(this.conversation+"最近的聊天记录");
    if(this.conversation!=null){
      //读取最近20条消息
      this.getCloudMsgread(this.conversation);

      // 进入到对话页面时标记其为已读
      this.conversation.read().then((conversation)=> {
        console.log('对话已标记为已读');
      }).catch(console.error.bind(console));
        clearInterval(this.timer);
    }
  }

  /**
   * 上线后接收信息
   */
  receiveMessage(callBack:Function){
    // Jerry 登录
    this.realtime.createIMClient(this.mySelf+'').then((my)=> {
      //在线实时通信
      my.on('message', (message, conversation)=> {
        console.log('在线通信消息' + message.text+'--'+message.type);
        callBack(message,conversation);
      });
    }).catch(console.error);
  }

  /**
   * 获取聊天记录(已读)
   */
  getCloudMsgread(conversation){
    conversation.queryMessages({
      limit: 20, // limit 取值范围 1~1000，默认 20
    }).then((messages)=>{
      // 获取消息
      for(let msg of messages){
        console.log(msg.from);
        this.subMsgList.push(msg);
      }
      //及时更新页面
    }).catch(console.error.bind(console));
  }


  /**
   * 发送图片消息
   */
  sendImgMsg(){
    this.alertCtrl.create({
      title: "消息",
      subTitle: "神秘功能敬请期待！",
      buttons: ["关闭"]
    }).present();
  }
}
