import { Component,ViewChild } from '@angular/core';
import {Tabs} from 'ionic-angular';

import { UserIntroducePage } from '../user-introduce/user-introduce';
import { HomePage } from '../home/home';
import {MessagePage} from "../message/message";
import {CommunicateService} from "../../util/CommunicateService";
import {Memory} from "../../util/Memory";

@Component({
  selector:'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  @ViewChild('mainTabs') tabRef:Tabs;

  tab1Root = HomePage;
  tab2Root = UserIntroducePage;
  tab3Root = MessagePage;

  constructor(public comCate:CommunicateService,public memory:Memory) {
    //初始化聊天
    this.comCate.init();
    this.receiveMessage();
  }

  ionViewDidEnter(){
    let mainTabs = this.tabRef;
  }

  public realtime;
  public mySelf;

  /**
   * 刚登录时查找未读信息是否存在,若存在则提醒用户
   */
  public receiveMessage(){
    this.realtime = this.memory.getTiming();
    if(this.realtime!=null){
      this.mySelf = this.memory.getUser().id;
      //登录并查询是否有未读消息
      this.realtime.createIMClient(this.mySelf+'').then((my)=> {
        my.on('unreadmessagescountupdate', (conversations)=>{
          for(let conv of conversations) {
            console.log(conv.id, conv.name, conv.unreadMessagesCount+"这是查询未读消息的，请问哪里还有",conv);
            if(conv.unreadMessagesCount>0){
              console.log("您有未读消息请注意！");
              this.memory.setMsg(true);
            }
          }
        });
      }).catch(console.error);
    }
  }


}
