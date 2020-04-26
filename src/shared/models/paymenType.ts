export class PaymentType {
    readonly _id: string;
    name: String;
    available: Boolean;
    readonly availableDescription: string;
    default: Boolean;
    currentAccount: Boolean;
  }