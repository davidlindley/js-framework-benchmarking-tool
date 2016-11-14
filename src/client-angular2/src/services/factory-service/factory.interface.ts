export interface IFactoryService {
  data():any;
  updated(before:Date):any;
  beforeUpdate():any;
  mounted():any;
  created():any;
}
