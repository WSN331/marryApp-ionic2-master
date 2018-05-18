import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Slides } from 'ionic-angular';

import { ImgService } from "../../util/ImgService"
import { MyHttp } from "../../util/MyHttp"

/**
 * Generated class for the LargeImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-large-image',
  templateUrl: 'large-image.html',
})
export class LargeImagePage {
  @ViewChild(Content) content: Content;　　//获取界面Content的实例对象
  @ViewChild(Slides) slides: Slides;

  private picture = {}
  private allPictures = []
  private getAllPictures = []
  private index = 0
  private bigAllPictures = []


  constructor(public navCtrl: NavController, public navParams: NavParams, public imgService:ImgService, public myHttp : MyHttp) {
    this.setInitImg()
  }

  setInitImg(){
    this.picture = this.navParams.get("pictureNow")
    this.getAllPictures = this.navParams.get("pictureAll")
    for(let i = 0; i < this.getAllPictures.length; i++){
      this.allPictures.push(this.getAllPictures[i].img)
    }

    this.index = this.getAllPictures.indexOf(this.picture)
    if(this.index==0){
      this.getShowPic()
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex < this.allPictures.length){
      console.log("Current index is+++++++++++++=:", currentIndex);
      this.index = currentIndex
      this.getShowPic()
    }
  }

  getShowPic(){
    let isFind = false
    if(this.bigAllPictures.length>0){
      for(var i = 0;i < this.bigAllPictures.length;i++){
        console.log(this.bigAllPictures[i].index+"-----------"+this.index)
        if(this.bigAllPictures[i].index==this.index+''){
          this.allPictures[this.index] = this.bigAllPictures[i].imageBase64
          isFind = true
          break
        }
      }
    }

    if(!isFind){
      let nowPic = this.getAllPictures[this.index]
      this.getBigImage(nowPic)
    }
  }

  getBigImage(picture) {
    let imageName = picture.bigImageName
    if (imageName == null) {
      return;
    }
    this.myHttp.post(MyHttp.URL_GET_BIG_IMAGE, {
      imageName : imageName
    }, (data) => {
      this.allPictures[this.index] = data.base64;
      let saveImg = {
        index : '',
        imageBase64 : ''
      }
      saveImg.index = this.index+''
      saveImg.imageBase64 = data.base64
      this.bigAllPictures.push(saveImg)
    });
  }

  /**
   * 返回
   */
  back() {
    this.navCtrl.pop();
  }
}
