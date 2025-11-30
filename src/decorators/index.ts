export function Collection(name: string) {
  return function (target: any) {
    target._collection = name;
  };
}
