import {Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';  

@Pipe({
    name: 'cashFlowSearch'
})
export class CashFlowSearchPipe implements PipeTransform {
    //Por cada filtro se agrega un parametro.
    transform(cashFlowItems: Array<any>, cashSearch: string, typeCashSearch: string, startDateSearch: Date, endDateSearch: Date){
        if (cashFlowItems && cashFlowItems.length){
            return cashFlowItems.filter(cashFlowItem =>{
                if (cashSearch && cashSearch !== 'default' && cashFlowItem.cashRegisterId.toLowerCase().indexOf(cashSearch.toLowerCase()) === -1){
                    return false;
                }
                if (typeCashSearch && typeCashSearch !== 'default' && cashFlowItem.type.toLowerCase().indexOf(typeCashSearch.toLowerCase()) === -1){
                    return false;
                }
                if (startDateSearch !== undefined && startDateSearch){
                    let datePipe = new DatePipe("en-US");  
                    let startDate: string;
                    startDate = datePipe.transform(startDateSearch, 'dd/MM/yyyy');
                    if (new Date(startDate) >= new Date(cashFlowItem.date)) {
                        return false;
                    }                                        
                }
                if (endDateSearch !== undefined && endDateSearch){
                    let datePipe = new DatePipe("en-US");  
                    let endDate: string;
                    endDate = datePipe.transform(endDateSearch, 'dd/MM/yyyy');
                    if (new Date(endDate) <= new Date(cashFlowItem.date)) {
                        return false;
                    }                                        
                }
                return true;
           })
        }
        else{
            return cashFlowItems;
        }
    }
}