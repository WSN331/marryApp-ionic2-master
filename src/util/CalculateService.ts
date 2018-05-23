/**
 * Created by ASUS on 2017/10/17 0017.
 */
import {Injectable} from '@angular/core';


@Injectable()
export class CalculateService {
  constructor(){

  }

  /**
   * 转换得到的时间为正常时间显示
   * @param myTime
   * @returns {any}
   */
  cutString(myTime){
    let visitTime = myTime.split(' ');
    return visitTime[0];
  }

  /**
   * 将数据库中的时间转换为当前时间
   * @param myTime
   * @returns {string}
   */
  transForm(myTime){
    let time = new Date(myTime);
    let time_Date,time_Month;
    if((time.getMonth()+1)<10){
      time_Month = "0"+(time.getMonth()+1);
    }else{
      time_Month = time.getMonth()+1;
    }
    if(time.getDate()<10){
      time_Date = "0"+time.getDate();
    }else{
      time_Date = time.getDate()
    }
    return time.getFullYear()+"-"+time_Month+"-"+time_Date;
  }


  /**
   *  判断VIP是否过期
   * @param vipTime yyyy-MM-dd格式的vip时间
   * @returns {number}
   */
  public isVip(vipTime):boolean{
    if (vipTime === null || vipTime === undefined || typeof vipTime !== 'string') {
      return false;
    }
    let vipLong = vipTime.split('-');
    if (vipLong === null || vipLong === undefined) {
      return false;
    }
    let year = Number(vipLong[0]);
    let month = Number(vipLong[1]);
    let day = Number(vipLong[2]);

    let now = new Date();
    let now_year = now.getFullYear();
    let now_month = now.getMonth()+1;
    let now_day = now.getDate();

    if(now_year==year){
      if(now_month==month){
        if(now_day<=day){
          return true;
        }else{
          return false;
        }
      }else if(now_month<month){
        return true;
      }else{
        return false;
      }
    }else if(now_year<year){
      return true;
    }else{
      return false;
    }

  }


  /**
   * 计算年龄
   * @param birthday yyyy-MM-dd格式的出生年月日
   * @returns {number} 年龄
     */
  public getAge(birthday) : number {
    if (birthday === null || birthday === undefined || typeof birthday !== 'string') {
      return 0
    }
    let birth = birthday.split('-');
    if (birthday === null || birth === undefined) {
      return 0
    }
    let year = Number(birth[0]);
    let month = Number(birth[1]);
    let day = Number(birth[2]);
    let now = new Date();
    return (now.getMonth() + 1 > month || (now.getMonth() == month && now.getDay() == day)) ? now.getFullYear()-year : now.getFullYear()-year-1;
  }

  /**
   * 计算星座
   * @param birthday yyyy-MM-dd格式的出生年月日
   * @returns {string} 星座
     */
  public getConstellation(birthday) : string {
    if (birthday === null || birthday === undefined || typeof birthday !== 'string') {
      return ""
    }
    let birth = birthday.split('-');
    if (birthday === null || birth === undefined) {
      return ""
    }
    let month = Number(birth[1]);
    let day = Number(birth[2]);
    let constellations = {
      1:[20, '摩羯座', '水瓶座'],
      2:[19, '水瓶座', '双鱼座'],
      3:[21, '双鱼座', '白羊座'],
      4:[20, '白羊座', '金牛座'],
      5:[21, '金牛座', '双子座'],
      6:[22, '双子座', '巨蟹座'],
      7:[23, '巨蟹座', '狮子座'],
      8:[23, '狮子座', '处女座'],
      9:[23, '处女座', '天秤座'],
      10:[24, '天秤座', '天蝎座'],
      11:[23, '天蝎座', '射手座'],
      12:[22, '射手座', '摩羯座']
    };
    let select = constellations[month];
    if (typeof select === 'undefined') {
      return "";
    }
    return select[day>select[0] ? 2 : 1];
  }

  public isNotNull(item) {
    return item != undefined && item != null && item != 'undefined' && item != '';
  }

  public isNotZero(num) {
    return this.isNotNull(num) && num != 0;
  }
}
