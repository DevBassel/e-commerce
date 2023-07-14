import mongoose from "mongoose";

export function extendSchema(props: any, target: any, removeProps?: string[]) {
  if (removeProps) {
    removeProps.forEach(prop=> delete target.obj[prop])
  }
  return new mongoose.Schema(Object.assign(target.obj, props));
}
