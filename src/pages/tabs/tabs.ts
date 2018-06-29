import {Component, ViewChild} from '@angular/core';
import {Platform, Tabs, Events} from "ionic-angular";

import { UserIntroducePage } from '../user-introduce/user-introduce';
import { HomePage } from '../home/home';
import {CommunicateService} from "../../util/CommunicateService";
import {Memory} from "../../util/Memory";
import {PeoplePage} from "../perlist/people";
import {MyHttp} from "../../util/MyHttp";



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

  icons: Array<string> = ["tab-home", "tab-message", "tab-user"];

  constructor(public comCate:CommunicateService,public memory:Memory,
              public platform: Platform, public events: Events,
              private myHttp : MyHttp) {
    //初始化聊天
    this.comCate.init();
    this.getHateList()
    this.receiveMessage();
    this.events.subscribe('e-tabs-message-change', (messageCount) => {
      //this.receiveMessage();
      this.messageCount = messageCount == 0 ? null : messageCount;
    })
  }

  public realtime;
  public mySelf;
  public hateList;
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
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
  public receiveMessage(){
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
            if(conv.unreadMessagesCount>0 && !this.isPingbi(conv)){
              console.log("您有未读消息请注意！");

              if(conv.id == "5a93eced1579a3003847f3c2"){
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
              break
            }
          }
          this.messageCount = count == 0 ? null : count;

        });
      }).catch(console.error);
    }
  }

  isPingbi(conversation){
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


  /**
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
/*  public receiveMessage(){
    this.realtime = this.memory.getTiming();
    if(this.realtime!=null){
      this.mySelf = this.memory.getUser().id;
      //登录并查询是否有未读消息
      let count = 0;
      let unreadConversions = []
      //是否加入未读消息列表
      let isInUpdate = false
      console.log("查询未读消息1")
      /!*unreadmessagescountupdate*!/
/!*      this.realtime.createIMClient(this.mySelf+'').then((my)=> {
        my.on('message', (conversations)=>{
          console.log("查询未读消息2")
          console.log(conversations)
          console.log(conversations.cid)

          for(var i = 0; i < unreadConversions.length;i++){
            if(conversations.cid == unreadConversions[i]){
              isInUpdate = true
            }
          }

          count = count+1
          console.log(count)

          this.messageCount = count == 0 ? null : count;

          //有系统消息
          if(conversations.cid == "5a93eced1579a3003847f3c2"){
            this.memory.setMsg(true);
          }

          if(!isInUpdate){
            unreadConversions.push(conversations.cid)
            console.log("查询未读消息3")
            this.memory.setUnreadConversions(unreadConversions)
          }
        });
      }).catch(console.error);*!/

    }
  }*/
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
