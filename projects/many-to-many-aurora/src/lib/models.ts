export class AuroraSelectModel{

  private _id: any;
  private _label: string;

  constructor(id, label){
    this._id = id;
    this._label = label;
  }

  get id(){
    return this._id;
  }

  set id(val){
    this._id = val;
  }

  get label(){
    return this._label;
  }

  set label(val){
    this._label = val;
  }
}
