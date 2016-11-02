import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FlightsDestinationsComp } from '../components/flights-destinations/flights-destinations';
import { FlightsConnectionsComp } from '../components/flight-connections/flight-connections';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    FlightsDestinationsComp,
    FlightsConnectionsComp
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
