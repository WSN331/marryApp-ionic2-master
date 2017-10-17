/**
 * Created by ASUS on 2017/10/17 0017.
 */
import {Injectable} from '@angular/core';

@Injectable()
export class CalculateService {
  constructor(){

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
    let select = constellations[month]
    return select[day>select[0] ? 2 : 1];
  }
}
