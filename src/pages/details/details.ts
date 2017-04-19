import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class Details {
  name: any;
  icon: any;
  rating: any;
  pricing: any;
  website: any;
  types: any;
  phone: any;
  address: any;
  photos: any;
  photoHeight: any;
  photoWidth: any;
  photoString: any;
  photo: any;
  reviews: any;
  open: any;
  openString: String;
  lat: any;
  lng: any;
  destination: any;
  myLocation: any;

public infoList:any;
  constructor(public navCtrl: NavController, public info:NavParams) {
    this.infoList = info.get("locationInfo");
    this.lat = info.get("lat");
    this.lng = info.get("lng");
    this.myLocation = this.lat+','+this.lng;
    this.destination = this.infoList.geometry.location.lat+','+this.infoList.geometry.location.lng;
    this.name = this.infoList.name;
    this.icon = this.infoList.icon;
    this.rating = this.infoList.rating;
    this.pricing = this.infoList.price_level;
    this.website = this.infoList.website;
    this.types = this.infoList.types;
    this.phone = this.infoList.formatted_phone_number;
    this.address = this.infoList.formatted_address;
    this.photos = this.infoList.photos;
    if(!this.photos){
      this.photo = false;
    }else{
      this.photoHeight = this.infoList.photos[0].height;
      this.photoWidth = this.infoList.photos[0].width;
      this.photoString = this.infoList.photos[0].photo_reference;
      this.photo = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+this.photoString+'&key=AIzaSyBCsfico0CX2HojOEZL_-L0IGRNtWz4rvA';
    }
  }

  ionViewDidLoad(){
    //console.log(this.photoHeight + "x" + this.photoWidth);
  }
}
