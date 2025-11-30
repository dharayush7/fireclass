import { Firestore } from "firebase-admin/firestore";
import { QueryOptions } from "../types";

export default function getBaseModel(firestore: Firestore) {
  return class BaseModel<T> {
    collection!: string;
    id?: string;
    static _collection: string;

    constructor(data: Partial<T> = {}) {
      const ctor = this.constructor as any;
      this.collection = ctor._collection;

      if (!this.collection) {
        throw new Error(`No @Collection decorator found for ${ctor.name}`);
      }

      Object.assign(this, data);
    }

    async save(): Promise<string> {
      const data: any = {};

      for (const key of Object.keys(this)) {
        if (["collection", "id"].includes(key)) continue;
        data[key] = (this as any)[key];
      }

      const colRef = firestore.collection(this.collection);

      if (this.id) {
        await colRef.doc(this.id).set(data, { merge: true });
        return this.id;
      }

      const docRef = await colRef.add(data);
      this.id = docRef.id;

      return this.id;
    }

    static async findById<M extends typeof BaseModel>(
      this: M,
      id: string
    ): Promise<InstanceType<M> | null> {
      const col = firestore.collection(this._collection);
      const doc = await col.doc(id).get();

      if (!doc.exists) return null;

      const data = doc.data() || {};
      const instance = new this({ ...data, id }) as InstanceType<M>;
      return instance;
    }

    static async findMany<T extends typeof BaseModel>(
      this: T,
      query: QueryOptions<InstanceType<T>>
    ): Promise<InstanceType<T>[]> {
      let ref: FirebaseFirestore.Query = firestore.collection(this._collection);

      // WHERE
      if (query.where) {
        for (const key in query.where) {
          const condition = query.where[key] as any;

          if (condition.equals !== undefined) {
            ref = ref.where(key, "==", condition.equals);
          }
          if (condition.gt !== undefined) {
            ref = ref.where(key, ">", condition.gt);
          }
          if (condition.gte !== undefined) {
            ref = ref.where(key, ">=", condition.gte);
          }
          if (condition.lt !== undefined) {
            ref = ref.where(key, "<", condition.lt);
          }
          if (condition.lte !== undefined) {
            ref = ref.where(key, "<=", condition.lte);
          }
        }
      }

      // ORDER BY
      if (query.orderBy) {
        const [field, dir] = Object.entries(query.orderBy)[0];
        ref = ref.orderBy(field, dir);
      }

      // LIMIT
      if (query.limit) ref = ref.limit(query.limit);

      const snap = await ref.get();

      return snap.docs.map(
        (d) => new this({ id: d.id, ...d.data() })
      ) as InstanceType<T>[];
    }
  };
}
