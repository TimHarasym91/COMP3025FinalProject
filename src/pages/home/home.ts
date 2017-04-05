import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Details } from '../details/details';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

//sets variable so we have no typescript errors when using google maps
declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})

export class Home {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  data: any;
  loading: boolean;
  locationList: Object[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private http:Http) {
  }

  findLocations(){
    this.loading = true;
    this.loadMap();
  }

  // ionViewDidLoad(){
  //   this.loadMap();
  // }

  // Loads the Google Maps with your geolocation
  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.searchLocations(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
    });
  }

  searchLocations(lat,lng) {
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    var location = lat+','+lng;
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + encodeURI(location) + '&radius=1500&type=restaurant&key=AIzaSyBCsfico0CX2HojOEZL_-L0IGRNtWz4rvA&callback=?';
    this.http.get(url).toPromise().then(res => {this.addMarker(res.json());}).catch(err => {console.log(err);});
  }

  addMarker(data){
    this.locationList = data.results;
    var randomIndex = Math.floor(Math.random() * (this.locationList.length +1));
    var item = data.results[randomIndex];
    var name = item.name;
    var icon = item.icon;
    var rating = item.rating;
    var pos = item.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: pos
    });
    var infoWindow= new google.maps.InfoWindow({
      content: "<h4>"+name+"</h4><img src='"+icon+"' /><br/><p>Rating: "+rating+"</p>"
    })
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(this.map, marker);
    });
    this.map.setCenter(marker.getPosition());
    this.loading = false;
  }

  addInfoWindow(marker, content){

  }

  //Simple Function for opening the Details Page... Will be used later for map pins
  openPage(){
    this.navCtrl.push(Details);
  }
}
