import { Firestore, Query } from "firebase-admin/firestore";
import { QueryOptions } from "../types";
import { validateOrReject } from "class-validator";
import { plainToInstance } from "class-transformer";

function convertFirestoreTypes(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertFirestoreTypes);
  }

  if (typeof obj === "object" && typeof (obj as any).toDate === "function") {
    try {
      return (obj as any).toDate();
    } catch {
      return obj;
    }
  }
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    const out: Record<string, any> = {};
    for (const k of Object.keys(obj)) {
      out[k] = convertFirestoreTypes((obj as Record<string, any>)[k]);
    }
    return out;
  }

  return obj;
}

export function getBaseModel(firestore: Firestore) {
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
      const instance = plainToInstance(this.constructor as any, this) as object;
      await validateOrReject(instance);

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

    async delete(): Promise<string> {
      if (!this.id) {
        throw new Error("Cannot delete document without an ID");
      }

      const colRef = firestore.collection(this.collection);
      await colRef.doc(this.id).delete();

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
      const convertedData = convertFirestoreTypes(data);
      const instance = new this({ ...convertedData, id }) as InstanceType<M>;
      return instance;
    }

    static async findMany<T extends typeof BaseModel>(
      this: T,
      query: QueryOptions<InstanceType<T>>
    ): Promise<InstanceType<T>[]> {
      let ref: Query = firestore.collection(this._collection);

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

      if (query.orderBy) {
        const [field, dir] = Object.entries(query.orderBy)[0];
        ref = ref.orderBy(field, dir);
      }

      if (query.limit) ref = ref.limit(query.limit);

      const snap = await ref.get();

      return snap.docs.map(
        (d) => new this({ id: d.id, ...convertFirestoreTypes(d.data()) })
      ) as InstanceType<T>[];
    }

    static async deleteById<T extends typeof BaseModel>(
      this: T,
      id: string
    ): Promise<InstanceType<T> | null> {
      const col = firestore.collection(this._collection);
      const docRef = col.doc(id);

      const doc = await docRef.get();
      if (!doc.exists) return null;

      await docRef.delete();
      const data = doc.data() || {};
      const instance = new this({ ...data, id }) as InstanceType<T>;
      return instance;
    }

    static async deleteMany<T extends typeof BaseModel>(
      this: T,
      query: QueryOptions<InstanceType<T>>
    ): Promise<InstanceType<T>[]> {
      let ref: FirebaseFirestore.Query = firestore.collection(this._collection);

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

      const snap = await ref.get();
      if (snap.empty) return [];

      const deletedDocs = snap.docs.map(
        (d) => new this({ id: d.id, ...d.data() })
      ) as InstanceType<T>[];

      let batch = firestore.batch();
      let count = 0;

      for (const doc of snap.docs) {
        batch.delete(doc.ref);
        count++;

        if (count % 500 === 0) {
          await batch.commit();
          batch = firestore.batch();
        }
      }

      await batch.commit();

      return deletedDocs;
    }
  };
}
