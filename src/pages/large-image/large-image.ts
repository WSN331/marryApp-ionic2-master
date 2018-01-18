import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

  private imageBase64;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imgService:ImgService, public myHttp : MyHttp) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LargeImagePage');
    this.imageBase64 = this.navParams.get("imageBase64");
    this.getBigImage();
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
