import { Injectable } from '@angular/core';


@Injectable()
export class UtilService {
  env: any;
  buildSchedule: any;
  constructor() {}

  getMinWidth(val: string) {
    return {
      'min-width' : val + '%'
    }
  }
  getPadding(val: string) {
    return {
      'margin' : val + '%'
    }
  }
  setTopMargin(val: string) {
    return {
      'margin-top' : val
    }
  }
  arrayIterationMethods(array1?: any, array2?: any, props?: any) {
   const data = array1.filter(function(o1) {
      return !array2.some(function(o2) {
        return o1.applicationId === o2.application.applicationId;
      });
    }).map(function(o) {
      return props.reduce(function(newo, name) {
        newo[name] = o[name];
        return newo;
      }, {});
    });
   return data;
  }
  filterApplicationArray(array?: any, filterId?: any) {
    // console.log(filterId);
    if (filterId !== 'all') {
      return array.filter((data: any) => data.applicationType === filterId);
    } else {
       // console.log(array);
      return array;
    }
  }
  setDailogData(val: any) {
    // console.log(val.buildName);
  this.buildSchedule = val;
  }
  getDailogData() {
    return this.buildSchedule;
  }
}
