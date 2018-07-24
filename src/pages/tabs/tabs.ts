import {Component, ViewChild} from '@angular/core';
import {Platform, Tabs, Events} from "ionic-angular";
//import {PhonegapLocalNotification} from '@ionic-native/phonegap-local-notification';

import {CommunicateService} from "../../util/CommunicateService";
import {Memory} from "../../util/Memory";
import {MyHttp} from "../../util/MyHttp";
import {Buffer} from 'buffer';
import {MyStorage} from "../../util/MyStorage";

import {PeoplePage} from "../perlist/people";
import { UserIntroducePage } from '../user-introduce/user-introduce';
import { HomePage } from '../home/home';

@Component({
  selector:'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('mainTabs') tabs:Tabs;

  tab1Root:any = HomePage;
  tab2Root:any = UserIntroducePage;
  tab3Root:any = PeoplePage;

  messageCount;


  public realtime;
  public mySelf;
  public hateList;

  icons: Array<string> = ["tab-home", "tab-message", "tab-user"];

  constructor(public comCate:CommunicateService,public memory:Memory,
              public platform: Platform, public events: Events,
              private myHttp : MyHttp,public myStorage:MyStorage,
              ) {
    //初始化聊天
    this.comCate.init();
    this.getHateList()

    if(this.platform.is("android")){
      this.receiveMessageAndroid();
    }else if(this.platform.is("ios")){
      this.receiveMessageIOS();
      this.findAndSendIapCert();
    }

    this.events.subscribe('e-tabs-message-change', (messageCount) => {
      //this.receiveMessage();
      this.messageCount = messageCount == 0 ? null : messageCount;
    })

    this.events.subscribe('e-tabs-iapCertificate', (certificate) => {
      this.iapCertificate(certificate)
    })

  }

  findAndSendIapCert() {
    console.log("*******certificateinging:")
    this.myStorage.getIapCertificate(this.memory.getUser().id).then(data=> {
      console.log("*******certificateinging:" + JSON.stringify(data))
      if (data != null) {
        for (let certificate of  data) {
          console.log("*******certificate:" + JSON.stringify(certificate))
          console.log("*******certificate use:" + JSON.stringify(certificate["used"]))
          if (certificate["used"] == 0) {
            this.iapCertificate(certificate)
          }
        }
      }
    })
    setTimeout(() => {
      this.findAndSendIapCert()
    },20000);
  }

/*  localNotification(message){
    this.localnote.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {
          // Create the notification
          this.localnote.create('My Title', {
            tag: message,
            body: 'My body',
            icon: 'assets/icon/favicon.ico'
          });
        }
      }
    );
  }*/

  /**
   * 获取讨厌的列表
   */
  getHateList() {
    this.myHttp.post(MyHttp.URL_HATE_LIST, {
      userId: this.memory.getUser().id
      /*userId:1*/
    }, (data) => {
      console.log(data)
      this.hateList = data.userList;
      console.log("屏蔽人的列表")
      console.log(this.hateList)
    })
  }

  /**
   * Android
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
  public receiveMessageAndroid(){
    this.realtime = this.memory.getTiming();
    if(this.realtime!=null){
      this.mySelf = this.memory.getUser().id;
      //登录并查询是否有未读消息
      console.log(this.messageCount)
      let count = 0;
      let unreadConversions = []
      //是否加入未读消息列表
      let isInUpdate = false
      this.realtime.createIMClient(this.mySelf+'').then((my)=> {
        my.on('unreadmessagescountupdate', (conversations)=>{
          for(let conv of conversations) {
            console.log(conv.id, conv.name, conv.unreadMessagesCount+"这是查询未读消息的，请问哪里还有",conv);
            if(conv.unreadMessagesCount>0 && !this.isPingbiAndroid(conv)){
              console.log("您有未读消息请注意！");
              //this.localNotification(conv.message)

              if(conv.id == "5a93eced1579a3003847f3c2"){
                //这个是系统消息
                this.memory.setMsg(true);
              }
              for(var i = 0; i < unreadConversions.length;i++){
                if(conv.id == unreadConversions[i]){
                  isInUpdate = true
                }
              }
              if(!isInUpdate){
                unreadConversions.push(conv.id)
                this.memory.setUnreadConversions(unreadConversions)
              }
              count = conv.unreadMessagesCount;
            }
          }
          this.messageCount = count == 0 ? null : count;
        });
      }).catch(console.error);
    }
  }

  /**
   * IOS
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
    public receiveMessageIOS(){
      this.realtime = this.memory.getTiming();
      if(this.realtime!=null){
        this.mySelf = this.memory.getUser().id;
        //登录并查询是否有未读消息
        let count = 0;
        let unreadConversions = []
        //是否加入未读消息列表
        let isInUpdate = false
        this.realtime.createIMClient(this.mySelf+'').then((my)=> {
          my.on('message', (conversations)=>{
            console.log("查询未读消息2")
            console.log(conversations)
            console.log(conversations.cid)

            //this.localNotification(conversations.message)

            if(!this.isPingbiIOS(conversations.from)){
              //有系统消息
              if(conversations.cid == "5a93eced1579a3003847f3c2"){
                this.memory.setMsg(true);
              }

              for(var i = 0; i < unreadConversions.length;i++){
                if(conversations.cid == unreadConversions[i]){
                  isInUpdate = true
                }
              }
              if(!isInUpdate){
                unreadConversions.push(conversations.cid)
                console.log("查询未读消息3")
                this.memory.setUnreadConversions(unreadConversions)
              }
              count = count+1
              console.log(count)
              this.messageCount = count == 0 ? null : count;
            }
          });
        }).catch(console.error);
      }
    }


  isPingbiAndroid(conversation){
    let isPingbi = false
    let otherPerson = null
    let comPeople = conversation.members.toString().split(',');
    for (let person of comPeople) {
      if (person != this.mySelf) {
        otherPerson = person.trim();
      }
    }
    console.log("未读消息对话id"+otherPerson)
    for(let i = 0;i<this.hateList.length;i++){
      console.log("未读消息对话2"+this.hateList[i])
        if(this.hateList[i].id == otherPerson){
          isPingbi = true
        }
    }
    return isPingbi
  }

  isPingbiIOS(otherPerson){
    let isPingbi = false
    for(let i = 0;i<this.hateList.length;i++){
      console.log("未读消息对话2"+this.hateList[i])
      if(this.hateList[i].id == otherPerson){
        isPingbi = true
      }
    }
    return isPingbi
  }

  /**
   *
   * @param receipt
   */
  iapCertificate (certificate) {
    let receiptBase64 = new Buffer(JSON.stringify(certificate["receipt"])).toString('base64');
    this.myHttp.post(MyHttp.URL_IAP_CERTIFICATE,{
      userId: this.memory.getUser().id,
      receipt: receiptBase64,
      chooseEnv: true,
      vipId: certificate["vipId"]
    },(data)=>{
      console.log(data)
      let result = data.iapCertificateResult;
      if(result != null && result.status == "0") {
        alert("支付成功");
        this.events.subscribe("e-user-introduce");
      }
      certificate["used"] = 1;
      this.myStorage.usedIapCertificate(this.memory.getUser().id, certificate)
      console.log("*******certificate after send use:" + JSON.stringify(certificate["used"]))

    }, null, true);
  }
}





/*      this.realtime.createIMClient(this.mySelf+'').then((my)=>{
        console.log("查询未读消息23")
        my.on('unreadmessagescountupdate', (conversations)=>{
          console.log("查询未读消息33")
          if(conversations.size > 0 && conversations != null){
          //this.memory.setUnreadConversions(conversations)
          for(let conv of conversations) {
            console.log(conv.id, conv.name, conv.unreadMessagesCount+"这是查询未读消息的，请问哪里还有",conv);
            if(conv.unreadMessagesCount>0){
              console.log("您有未读消息请注意！");
              if(conv.id == "5a93eced1579a3003847f3c2"){
                this.memory.setMsg(true);
              }
              count = count + 1;
              break
            }
          }
          this.messageCount = count == 0 ? null : count;
        }
        })
      })*/
