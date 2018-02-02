import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
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

  private imageBase64;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imgService:ImgService, public myHttp : MyHttp) {
  }

  ionViewDidLoad() {
    this.imageBase64 = this.navParams.get("imageBase64");
    this.getBigImage();
  }

  ngAfterViewInit() {
    console.log(this.content.ionScroll);
    this.content.ionScroll.subscribe(event => {
      console.log(event)
      if (event.directionX == "left") {
        console.log("left")
      } else if (event.directionX == "right") {
        console.log("right")
      }
    });
  }

  getBigImage() {
    let imageName = this.navParams.get("bigImageName");
    if (imageName == null) {
      return;
    }
    this.myHttp.post(MyHttp.URL_GET_BIG_IMAGE, {
      imageName : imageName
    }, (data) => {
      this.imageBase64 = data.base64;
    });
  }

}
