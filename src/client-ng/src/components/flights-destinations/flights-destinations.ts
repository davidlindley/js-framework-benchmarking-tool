import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Inject } from '@angular/core';
import { FactoryService } from "../../services/factory-service/factory.service";
import { IFactoryService } from "../../services/factory-service/factory.interface";

@Component({
    selector: 'flights-destinations',
    templateUrl: './index.html'
})

export class FlightsDestinationsComp implements OnInit, AfterViewInit {

  @ViewChild('scroll') private scroll: ElementRef;
  private factory: FactoryService;
  private destinationsService: IFactoryService;
  private time_before: number;
  private zone: NgZone;
  private destinations;
  private observer;

  constructor(@Inject(NgZone)  _ngZone: NgZone, @Inject(ElementRef)  elementRef: ElementRef) {
    this.factory = new FactoryService();
    this.destinations = [];
    this.zone = _ngZone;
  }

  ngOnInit() {
    this.destinationsService = this.factory.get("destinations");
    this.destinationsService.created().subscribe((dest: any) => {
      this.time_before = new Date().getTime();
      if (dest.action === "set") {
        this.zone.run(() => {
          this.destinations = dest.item.data.destinations;
        });
      } else if (dest.action === "add") {
        this.zone.run(() => {
          dest.item.data.destinations.forEach(dest => {
            this.destinations.push(dest);
          });
        });
      }
    });
  }

  ngAfterViewInit() {
    this.observer = new MutationObserver(mutations => {
      this.markForCheck();
    });
    this.observer.observe(this.scroll.nativeElement, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  markForCheck() {
    this.destinationsService.updated(this.destinations.length);
    window.scrollTo(0, document.body.scrollHeight);
  }
}
