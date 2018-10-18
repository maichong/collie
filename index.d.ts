
declare namespace Collie {
  interface collie {
    <T>(obj: T, method: keyof T, fn?: Function): void;
    compose(hooks: Function[], args: Array<any>, scope: any): Promise<any>;
  }
}

declare module "collie" {
  var collie: Collie.collie;
  export = collie;
}
