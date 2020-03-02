export class Right {
  readonly _id: string;
  readonly urlPathColection: string;
  readonly routePath: string;
  readonly httpMethod: string;
  readonly childRights: Array<string>;
  readonly aditionalRules: Array<any>;
}