import {Injectable} from "@angular/core";

import {Memory} from "./Memory";

import * as AV from "leancloud-realtime"

@Injectable()
export class CommunicateService{

  constructor(public memory:Memory){
  }

  //通信初始化组件
  private realTime;
  private textMessage;
  private realTiming;
  /**
   * 初始化
   */
  public init(){
    this.realTiming = this.memory.getTiming();
    if(this.realTiming==null){
      this.realTime = AV.Realtime;
      this.textMessage = AV.TextMessage;
      this.realTiming = new this.realTime({
        appId: 'gWV7xx6uRXGtsqAdsP2SeBAf-gzGzoHsz',
        pushOfflineMessages: true,
        region: 'cn', //美国节点为 "us"
      });
      this.memory.setTiming(this.realTiming);
    }else{
      this.memory.setTiming(this.realTiming);
    }
  }


}
