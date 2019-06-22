export class Client {
  _id: String;
  tel: String;
  name: String;
  addressStreet: String;
  addressNumber: String;
  addressDpto: String;
  enabledTransactions: Boolean;
  balance: number;
  transactions: Array<any>;
  dateOfLastTransaction: Date;
}