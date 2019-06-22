export class Transaction {
  _id: String;
  clientId: String;
  clientName: String;
  paymentMethod: any;
  cashRegister: any;
  date: Date;
  amount: number;
  deleted: Boolean;
  comment: String;
}