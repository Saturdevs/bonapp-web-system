export class PaymentType {
    _id: string;
    name: String;
    available: Boolean;
    readonly availableDescription: string;
    default: Boolean;
  }