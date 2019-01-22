export class ArqueoCaja {
  cashRegister: String;
  cashRegisterId: any;
  createdAt:  Date;
  closedAt:  Date;
  createdBy: string;
  closeBy: string;
  initialAmount: number;
  ingresos: Array<any> = [];
  egresos: Array<any> = [];
  estimatedAmount: number = 0;
  realAmount: Array<any> = [];  
  realAmountTotal: number;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  comment: string;
  deleted: Boolean;
}