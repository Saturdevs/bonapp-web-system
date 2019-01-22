export class StringsFunctions {
  
  static compareStrings(a: String, b: String) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  
    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }
  
}