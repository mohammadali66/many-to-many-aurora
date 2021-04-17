import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

import { AuroraSelectModel } from './models';
import { ManyToManyAuroraService } from './many-to-many-aurora.service';

@Component({
  selector: 'many-to-many-aurora',
  templateUrl: './many-to-many-aurora.component.html',
  styleUrls: ['./many-to-many-aurora.component.css'],
  styles: [
  ]
})
export class ManyToManyAuroraComponent implements OnInit {

  @Input() title_choiceList = 'Unselected';
  @Input() choiceList: Array<AuroraSelectModel> = new Array<AuroraSelectModel>();
  @Input() apiUrlChoiceList = '';
  @Input() jwtTokenChoiceList = '';

  @Input() title_selectedList = 'Selected';
  @Input() selectedList: Array<AuroraSelectModel> = new Array<AuroraSelectModel>();
  @Input() apiUrlSelectedList = '';
  @Input() jwtTokenSelectedList = '';

  @Input() displayedItemSize = 10;
  @Output() selectedListChange = new EventEmitter<AuroraSelectModel[]>();

  choiceList2: Array<AuroraSelectModel> = new Array<AuroraSelectModel>();
  selectedList2: Array<AuroraSelectModel> = new Array<AuroraSelectModel>();

  isActive_choiceBtn = false;
  isActive_selectedBtn = false;
  isActive_allChoiceBtn = false;
  isActive_allSelectedBtn = false;

  searchChoiceFC: FormControl = new FormControl();
  searchSelectedFC: FormControl = new FormControl();

  ERROR_MESSAGE_LIST = [
    "items in optionList are not 'AuroraSelectModel' object.",
    "error from API.",
    "items in choiceList are not 'AuroraSelectModel' object.",
    "items in selectedList are not 'AuroraSelectModel' object."
  ];
  errorMessage = '';

  //............................................................................
  constructor(private mainService: ManyToManyAuroraService) { }

  //............................................................................
  ngOnInit(): void {
    this.initializeComponent();
    this.checkingApiUrlExist();
    this.compareTwoLists();
    // this._isListsEmpty();
    this.onChangeSearchChoiceFC();
    this.onChangeSearchSelectedFC();
  }

  //............................................................................
  initializeComponent() {
    this.errorMessage = '';
  }

  //............................................................................
  fillList2()
  {
    // init choiceList2 ...
    this.choiceList2 = new Array<AuroraSelectModel>();
    for(let item of this.choiceList){
      this.choiceList2.push(new AuroraSelectModel(item.id, item.label));
    }

    // init selectedList2 ...
    this.selectedList2 = new Array<AuroraSelectModel>();
    for(let item of this.selectedList){
      this.selectedList2.push(new AuroraSelectModel(item.id, item.label));
    }
  }

  //............................................................................
  checkingApiUrlExist() {
    // choice list ...
    if(this.apiUrlChoiceList == ''){
      this.checkingTypeOfList(this.choiceList, 2);
      this.fillList2();
      this._isListsEmpty();
    }
    else{
      this.callDataFromAPI(this.apiUrlChoiceList, this.jwtTokenChoiceList, 'choice')
    }

    // selected list ...
    if(this.apiUrlSelectedList == ''){
      this.checkingTypeOfList(this.selectedList, 3);
      this.fillList2();
      this._isListsEmpty();
      // compare selectedList with choiceList & remove repeated items from selectedList
      // this.compareTwoLists();
    }
    else{
      this.callDataFromAPI(this.apiUrlSelectedList, this.jwtTokenSelectedList, 'selected');
    }
  }

  //............................................................................
  checkingTypeOfList(aList, errorMessageId)
  {
    if(aList==null)
      return
    if(aList.length != 0){
      for(let item of aList){
        if(!(item instanceof AuroraSelectModel)){
          this.errorMessage = this.ERROR_MESSAGE_LIST[errorMessageId];
        }
      }
    }
  }

  //............................................................................
  callDataFromAPI(api_url, jwtToken, whichList)
  {
    if(jwtToken != ''){
      this.callAPIAuth(api_url, jwtToken, whichList);
    }
    else{
      this.callAPINoAuth(api_url, whichList);
    }
  }

  //............................................................................
  callAPIAuth(api_url, jwtToken, whichList)
  {
    this.mainService.getApi(api_url, jwtToken).subscribe(
      (data: any) => {
        this.readAPIData(data, whichList);
      },
      (error) => {
        this.errorMessage = this.ERROR_MESSAGE_LIST[1];
      }
    );
  }

  //............................................................................
  callAPINoAuth(api_url, whichList)
  {
    this.mainService.getApiWithoutAuth(api_url).subscribe(
      (data: any) => {
        this.readAPIData(data, whichList);
      },
      (error) => {
        this.errorMessage = this.ERROR_MESSAGE_LIST[1];
      }
    );
  }

  //............................................................................
  readAPIData(data, whichList)
  {
    let aList = new Array<AuroraSelectModel>();
    try{
      if(typeof data == 'string'){
        for(let item of JSON.parse(data)){
          aList.push(
            new AuroraSelectModel(item.id, item.label)
          );
        }
      }
      else {
        for(let item of data){
          aList.push(
            new AuroraSelectModel(item.id, item.label)
          );
        }
      }

      // fill list ...
      if(whichList == 'choice'){
        this.choiceList = aList;
      }
      else{
        this.selectedList = aList;
      }
      // compare selectedList with choiceList & remove repeated items from selectedList
      this.compareTwoLists();
      this.fillList2();
      this._isListsEmpty();
    }
    catch{
      this.errorMessage = this.ERROR_MESSAGE_LIST[1];
    }
  }

  //............................................................................
  _isListsEmpty()
  {
    this.isActive_allChoiceBtn = false;
    this.isActive_choiceBtn = false;
    this.isActive_allSelectedBtn = false;
    this.isActive_selectedBtn = false;

    if(this.choiceList2 != null){
      if(this.choiceList2.length != 0){
        this.isActive_allChoiceBtn = true;
      }
    }

    if(this.selectedList2!=null){
      if(this.selectedList2.length != 0){
        this.isActive_allSelectedBtn = true;
      }
    }
  }

  //............................................................................
  onChoiceList(selectElements)
  {
    let index = -1;
    let index2 = -1;
    for(let item of selectElements.value){

      // pop from choiceList ...
      for(let item2 of this.choiceList){
        if(item.id == item2.id){
          index = this.choiceList.indexOf(item2);
          this.choiceList.splice(index, 1);
          break;
        }
      }

      // pop from choiceList2 ...
      for(let item3 of this.choiceList2){
        if(item.id == item3.id){
          index2 = this.choiceList2.indexOf(item3);
          this.choiceList2.splice(index2, 1);
          break;
        }
      }
      // index = this.choiceList.indexOf(item);
      // index2 = this.choiceList2.indexOf(item);

      // pop ...
      // this.choiceList.splice(index, 1);
      // this.choiceList2.splice(index2, 1);

      //push ...
      this.selectedList.push(item);
      this.selectedList2.push(item);
    }

    // this.isActive_choiceBtn = false;
    this._isListsEmpty();

    // this.choiceListChange.emit(this.choiceList);
    this.selectedListChange.emit(this.selectedList);
  }

  //............................................................................
  onAllChoiceList()
  {
    for(let item of this.choiceList2){
      this.selectedList.push(item);
      this.selectedList2.push(item);

      // pop from choiceList ...
      let index = -1;
      for(let item2 of this.choiceList){
        if(item.id == item2.id){
          index = this.choiceList.indexOf(item2);
          this.choiceList.splice(index, 1);
          break;
        }
      }
    }
    // this.choiceList = [];
    this.choiceList2 = [];
    this._isListsEmpty();

    this.selectedListChange.emit(this.selectedList);
  }

  //............................................................................
  onChangeChoiceListSelect(newObj)
  {
    this.isActive_choiceBtn = true;
  }

  //............................................................................
  onSelectedList(selectElements)
  {
    let index = -1;
    let index2 = -1;
    for(let item of selectElements.value){

      // pop from selectedList ...
      for(let item2 of this.selectedList){
        if(item.id == item2.id){
          index = this.selectedList.indexOf(item2);
          this.selectedList.splice(index, 1);
          break;
        }
      }

      // pop from selectedList2 ...
      for(let item3 of this.selectedList2){
        if(item.id == item3.id){
          index2 = this.selectedList2.indexOf(item3);
          this.selectedList2.splice(index2, 1);
          break;
        }
      }

      // index = this.selectedList.indexOf(item);
      // index2 = this.selectedList2.indexOf(item);

      // pop ...
      // this.selectedList.splice(index, 1);
      // this.selectedList2.splice(index2, 1);

      // push ...
      this.choiceList.push(item);
      this.choiceList2.push(item);
    }
    this.isActive_selectedBtn = false;
    this._isListsEmpty();

    this.selectedListChange.emit(this.selectedList);
  }

  //............................................................................
  onAllSelectedList()
  {
    for(let item of this.selectedList2){
      this.choiceList.push(item);
      this.choiceList2.push(item);

      // pop from selectedList ...
      let index = -1;
      for(let item2 of this.selectedList){
        if(item.id == item2.id){
          index = this.selectedList.indexOf(item2);
          this.selectedList.splice(index, 1);
          break;
        }
      }
    }
    // this.selectedList = [];
    this.selectedList2 = [];
    this._isListsEmpty();

    this.selectedListChange.emit(this.selectedList);
  }

  //............................................................................
  onChangeSelectedListSelect(newObj)
  {
    this.isActive_selectedBtn = true;
  }
  
  //............................................................................
  /*
  * remove repeated item of choiceList from selectedList
  */
  compareTwoLists()
  {
    let secondChoiceList: Array<AuroraSelectModel> = new Array<AuroraSelectModel>();
    let isRepeatedItem = false;
    if (this.choiceList == null){
      return;
    }
    for(let itemChoi of this.choiceList){
      isRepeatedItem = false;

      for(let itemSel of this.selectedList){
        if(itemSel.id == itemChoi.id){
            isRepeatedItem = true
            break;
        }
      }
      if(!isRepeatedItem){
        secondChoiceList.push(itemChoi);
      }
    }
    this.choiceList = secondChoiceList;
  }

  //............................................................................
  displayCssStyleSelectedBox()
  {
    return 'form-control many-to-many';

    // if(this.isSelectedListEmpty()){
    //   return 'form-control many-to-many is-invalid';
    // }
    // else {
    //   return 'form-control many-to-many';
    // }
  }
  //............................................................................
  onChangeSearchChoiceFC() {
    this.searchChoiceFC.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(
      value => {
        let newValue = value.trim();

        // value is empty ...
        // if(!newValue){
        //   return;
        // }

        // search ...
        const filterValue = newValue.toLowerCase();
        this.choiceList2 = new Array<AuroraSelectModel>();
        let startIndex = 0;
        let filterPart = '';

        for(let item of this.choiceList){
          startIndex = item.label.toLowerCase().indexOf(filterValue);

          if(startIndex !== -1){
            filterPart = item.label.substring(startIndex, startIndex + filterValue.length);
            // this.choiceList2.push(new SelectModel(item.id, item.label.replace(filterPart, '<u>' + filterPart + '</u>')));
            this.choiceList2.push(new AuroraSelectModel(item.id, item.label));
          }
        }
        this._isListsEmpty();
      }
    );
  }

  //............................................................................
  onChangeSearchSelectedFC() {
    this.searchSelectedFC.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(
      value => {
        let newValue = value.trim();

        // value is empty ...
        // if(!newValue){
        //   return;
        // }

        // search ...
        const filterValue = newValue.toLowerCase();
        this.selectedList2 = new Array<AuroraSelectModel>();
        let startIndex = 0;
        let filterPart = '';

        for(let item of this.selectedList){
          startIndex = item.label.toLowerCase().indexOf(filterValue);

          if(startIndex !== -1){
            filterPart = item.label.substring(startIndex, startIndex + filterValue.length);
            // this.choiceList2.push(new SelectModel(item.id, item.label.replace(filterPart, '<u>' + filterPart + '</u>')));
            this.selectedList2.push(new AuroraSelectModel(item.id, item.label));
          }
        }
        this._isListsEmpty();
      }
    );
  }
}
