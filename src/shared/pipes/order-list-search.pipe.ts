import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order } from '../models';
import { isNullOrUndefined } from 'util';

@Pipe({
  name: 'orderListSearch'
})
export class OrderListSearchPipe implements PipeTransform {

  transform(orderItems: Array<any>, orderStatus: string, waiterId: string, paymentType: string, cashRegister: string, tableNumber: string, startDateSearch: Date, endDateSearch: Date){
    if (orderItems && orderItems.length){
        return orderItems.filter(orderItem =>{
            console.log(orderItem);
            if (cashRegister && cashRegister !== 'default' && !isNullOrUndefined(orderItem.cashRegister)){
                if(orderItem.cashRegister.toLowerCase() !== cashRegister.toLowerCase()) return false;
            }
            if (orderStatus && orderStatus !== 'default' && orderItem.status.toLowerCase() !== orderStatus.toLowerCase()){
                return false;
            }
            // if (waiterId && waiterId !== 'default' && orderItem.waiter._id.toLowerCase() !== waiterId.toLowerCase()){
            //     return false;
            // }MOZO
            if (paymentType && paymentType !== 'default' && orderItem.users.some(user => user.payments.findIndex(x => x.methodId == paymentType) === -1)){
                return false;
            }
            if (tableNumber && tableNumber !== 'default' && orderItem.table != tableNumber){
                return false;
            }
            if (startDateSearch !== undefined && startDateSearch){
                let datePipe = new DatePipe("en-US");  
                let startDate: string;
                startDate = startDateSearch.toString(); //datePipe.transform(startDateSearch, 'dd/MM/yyyy');
                if (new Date(startDate) > new Date(orderItem.created_at)) {
                    return false;
                }                                        
            }
            if (endDateSearch !== undefined && endDateSearch){
                let datePipe = new DatePipe("en-US");  
                let endDate: string;
                endDate = endDateSearch.toString();//datePipe.transform(endDateSearch, 'dd/MM/yyyy');
                if (new Date(endDate) < new Date(orderItem.created_at)) {
                    return false;
                }                                        
            }
            return true;
      })
    }
    else{
        return orderItems;
    }
  }

}
