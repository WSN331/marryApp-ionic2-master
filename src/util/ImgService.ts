/**
 * Created by ASUS on 2017/9/7 0007.
 */
import {Injectable} from '@angular/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { AlertController, Platform} from 'ionic-angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Injectable()
export class ImgService {

  /**
   * 相机参数
   * @type {{quality: number, destinationType: number, encodingType: number, mediaType: number}}
     */
  private cameraOptions: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    sourceType:this.camera.PictureSourceType.CAMERA,
    mediaType: this.camera.MediaType.PICTURE,
    targetWidth: 500,
    targetHeight: 500,
    allowEdit: true,
    saveToPhotoAlbum: false
  }

  /**
   * 相册选择图片参数
   * @type {ImageResizerOptions}
     */
  private libraryOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: true,
    encodingType: this.camera.EncodingType.JPEG,
    targetWidth: 500,
    targetHeight: 500,
    saveToPhotoAlbum: false
  }

  constructor(private camera: Camera, public alertCtrl: AlertController, private sanitize:DomSanitizer, public platform: Platform) {
  }

  /**
   * 启动相机
   * @param success
     */
  startCamera(success: Function) {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      success(this.encodeAdd(imageData));
    }, (err) => {
      console.log(err);
      //this.failError("调用相机失败");
    });
  }

  /**
   * 启用相册
   * @param success
     */
  startPhotoLibrary(success: Function) {
    this.camera.getPicture(this.libraryOptions).then((imageData) => {
      // alert(imageData);
      success(this.encodeAdd(imageData));
    }, (err) => {
      console.log(err);
      //this.failError("调用相机失败");
    });
  }

  /**
   * 选择相册
   * @param success
     */
  chooseCamera (success: Function) {
    let alert = this.alertCtrl.create({
      title: '请选择图片来源',
      inputs: [
        {
          type : 'radio',
          label: '从相册获取',
          value: '0',
        },
        {
          type : 'radio',
          label: '相机拍摄',
          value: '1',
        }
      ],
      buttons: [
        {
          text: '关闭',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: data => {
           console.log(data);
            if (data == 0) {
              if (this.platform.is("android")) {
                this.alertCtrl.create({
                  title: '友情提示',
                  subTitle : '若您的设备是小米（红米）4及以下、魅族等，请使用相机拍摄，若从相册选择可能造成图片拉伸，我们会尽快解决这个问题',
                  buttons : [
                    {
                      text: '关闭',
                      role: 'cancel'
                    },
                    {
                      text: '继续访问相册',
                      handler: data => {
                        this.startPhotoLibrary(success);
                      }
                    }
                  ]
                }).present();
              } else {
                this.startPhotoLibrary(success);
              }
            } else if (data == 1) {
              this.startCamera(success);
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * base64编码辅助
   * @param str
   * @returns {string}
   */
  encodeAdd(str:string):string {
    var newStr = str.replace(/\+/g, "%2B");
    return newStr;
  }

  /**
   * 失败报错
   * @param subTitle
     */
  failError(subTitle: string) {
    this.alertCtrl.create({
      title: "失败",
      subTitle: subTitle,
      buttons: ["关闭"]
    }).present();
  }

  /**
   * 修改图片为安全URL
   * @param image
   */
  safeImage(image: String) : SafeUrl{
    return this.sanitize.bypassSecurityTrustUrl(this.decodeBase64(image));
  }

  decodeBase64(image: String) {
    return "data:image/jpg;base64," + image;
  }



}
