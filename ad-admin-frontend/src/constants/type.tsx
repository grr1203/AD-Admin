export type Device = {
  idx: number;
  name: string;
  ip: string;
  screenSize: string;
  code: string;
  registeredDate: string;
  [key:string]: unknown;
};
export type screenSize = { width: number; height: number };
