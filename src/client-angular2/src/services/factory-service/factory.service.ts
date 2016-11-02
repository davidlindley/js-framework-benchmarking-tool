import { DestinationService } from "../destination-service/destination.service";
import { ConnectionService } from "../connection-service/connection.service";
import { IFactoryService } from "./factory.interface";

export class FactoryService {

  private objService:IFactoryService;

  public get(serviceName:string):IFactoryService {
    //Create a different object based on  user choice.
    switch (serviceName) {
      case "destinations": // Destinations
        this.objService = new DestinationService();
        break;
      case "connections": // Connections
        this.objService = new ConnectionService();
        break;
      default:
        break;
    }

    return this.objService;
  }
}
