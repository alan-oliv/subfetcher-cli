export default class Convert {
  public static toArray = (input: any): any[] => {
    let filteredInput: any;
    if (typeof input === 'string') {
      filteredInput = input ? input.replace(/[ .]/g, '').split(',') : [];
    }
    return filteredInput;
  };
}
