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
  mapLoaded: boolean;
  locationList: Object[];
  markers: Array<any> = [];
  currentItem: Object[];

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private http:Http) {
  }

  findLocations(){
    this.loading = true;
    this.mapLoaded = true;
    this.loadMap();
  }

  nextLocations(data){
    this.clearMarkers();
    this.addMarker(data);
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
    this.data = data;
    this.locationList = data.results;
    var randomIndex = Math.floor(Math.random() * (this.locationList.length));
    var item = data.results[randomIndex];
    this.currentItem = item;
    var name = item.name;
    var icon = item.icon;
    var rating = item.rating;
    var pos = item.geometry.location;
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: pos
    });
    this.markers.push(marker);

    var infoWindow= new google.maps.InfoWindow({
      content: "<h4>"+name+"</h4><button ion-button full onclick='clickGo()'> Details </button><img width='32' height='32' src='"+icon+"' /><br/><p>Rating: "+rating+"</p>"
    })

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(this.map, marker);
    });
    new google.maps.event.trigger( marker, 'click' );
    this.map.setCenter(marker.getPosition());
    this.loading = false;
  }

  // Sets the map on all markers in the array.
      setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      clearMarkers() {
        this.setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      showMarkers() {
        this.setMapOnAll(this.map);
      }

      // Deletes all markers in the array by removing references to them.
      deleteMarkers() {
        this.clearMarkers();
        this.markers = [];
      }

  //Simple Function for opening the Details Page... Will be used later for map pins
  openPage(locationInfo){
    console.log(locationInfo);
    this.navCtrl.push(Details, {
      locationInfo: locationInfo
    });
  }
}
