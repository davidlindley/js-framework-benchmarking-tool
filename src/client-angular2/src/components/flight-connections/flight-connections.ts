import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Inject } from '@angular/core';
import { FactoryService } from "../../services/factory-service/factory.service";
import { IFactoryService } from "../../services/factory-service/factory.interface";

@Component({
    selector: 'flights-connections',
    templateUrl: './index.html'
})


export class FlightsConnectionsComp implements OnInit {

  @ViewChild('cscroll') private scroll: ElementRef;
  private factory: FactoryService;
  private connectionsService: IFactoryService;
  private zone: NgZone;
  private connections;
  private observer;

  constructor(@Inject(NgZone)  _ngZone: NgZone) {
    this.factory = new FactoryService();
    this.connections = [];
    this.zone = _ngZone;
  }

  ngOnInit() {
    this.connectionsService = this.factory.get("connections");
    this.connectionsService.created().subscribe((dest: any) => {
      if (dest.action === "set") {
        this.zone.run(() => {
          this.connections = dest.item.data.connections;
        });
      } else if (dest.action === "add") {
        this.zone.run(() => {
          dest.item.data.connections.forEach(dest => {
            this.connections.push(dest);
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
    this.connectionsService.updated(this.connections.length);
    window.scrollTo(0, document.body.scrollHeight);
  }
}
