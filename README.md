# Fireclass

A **minimal, type-safe Firestore model helper** for Node.js with **first-class integration** for `class-validator` and `class-transformer`.
Provides base models, typed CRUD, declarative collection mapping, and strong query builders.

---

## Installation

```bash
# npm
npm install @dharayush07/fireclass firebase-admin class-validator class-transformer

# yarn
yarn add @dharayush07/fireclass firebase-admin class-validator class-transformer
```

> `firebase-admin` is required; `class-validator` and `class-transformer` are re-exported by Fireclass types for convenience.

---

## Requirements

- Node.js ≥ 18
- Firestore from `firebase-admin`
- TypeScript ≥ 5 (for typed generics)
- Fireclass tested with:

  - `class-validator@^0.14.3`
  - `class-transformer@^0.5.1`
  - `firebase-admin@^12.0.0`

---

## Firestore Admin Setup

Fireclass is designed for **server-side Node.js apps** using `firebase-admin`.

### Initialize Firestore Admin

```ts
import admin from "firebase-admin";
import "dotenv/config";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

import { getBaseModel } from "@dharayush07/fireclass/core";

export const firestore = admin.firestore();
export const BaseModel = getBaseModel(firestore);
```

> Ensure your `.env` keys are correctly formatted; `privateKey` must replace literal `\n` with newline.

---

## Basic Usage

Create a model mapped to a Firestore collection:

```ts
import { Collection } from "@dharayush07/fireclass/decorators";
import { IsString, IsEmail, IsOptional, Length } from "class-validator";
import { Transform, Type } from "class-transformer";

@Collection("users")
class User extends BaseModel<User> {
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  displayName?: string;

  @Type(() => Date)
  createdAt: Date = new Date();
}
```

---

### Create / Save

```ts
const user = new User({ name: "Ada Lovelace", email: "ada@example.com" });
await user.save(); // validates automatically before writing
```

### Update

```ts
user.displayName = "Ada";
await user.save();
```

### Read by ID

```ts
const found = await User.findById(user.id!);
```

### Query Many

```ts
const users = await User.findMany({
  where: {
    name: { equal: "Ada" },
    createdAt: { gte: new Date("2020-01-01") },
  },
  orderBy: { createdAt: "desc" },
  limit: 10,
});
```

### Delete

```ts
await user.delete();
```

---

## Class-Validator Integration

- Enforces constraints before saving.
- Throws `ValidationError[]` if invalid.

```ts
try {
  const invalidUser = new User({ name: "A", email: "bad-email" });
  await invalidUser.save();
} catch (err) {
  console.error(err); // array of ValidationError objects
}
```

---

## Class-Transformer Integration

- Normalize and coerce data before validation / save.

```ts
class Address {
  @Transform(({ value }) => value?.trim())
  street!: string;

  city!: string;
}

@Collection("profiles")
class Profile extends BaseModel<Profile> {
  @Type(() => Address)
  address!: Address;

  @Transform(({ value }) => Number(value))
  reputation: number = 0;
}
```

---

## Query Options

```ts
export type WhereFilter<T> = {
  [K in keyof T]?: {
    equal?: T[K];
    gt?: T[K];
    gte?: T[K];
    lt?: T[K];
    lte?: T[K];
  };
};

export type OrderBy<T> = {
  [K in keyof T]?: "asc" | "desc";
};

export interface QueryOptions<T> {
  where?: WhereFilter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
}
```

### Example Query

```ts
const todos = await Todo.findMany({
  where: {
    name: { equal: "Shopping" },
    isDone: { equal: false },
  },
  orderBy: { name: "asc" },
  limit: 20,
});
```

---

## Full Firestore Admin Example

```ts
import express from "express";
import admin from "firebase-admin";
import { getBaseModel } from "@dharayush07/fireclass/core";
import { Collection } from "@dharayush07/fireclass/decorators";
import { IsString } from "class-validator";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const firestore = admin.firestore();
const BaseModel = getBaseModel(firestore);

@Collection("posts")
class Post extends BaseModel<Post> {
  @IsString()
  title!: string;
}

const app = express();
app.use(express.json());

app.post("/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    const id = await post.save();
    res.status(201).json({ id });
  } catch (err) {
    res.status(400).json({ errors: err });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Cloud Functions Example

```ts
import * as functions from "firebase-functions";
import admin from "firebase-admin";
import { getBaseModel } from "@dharayush07/fireclass/core";
import { Collection } from "@dharayush07/fireclass/decorators";
import { IsEmail } from "class-validator";

admin.initializeApp();
const firestore = admin.firestore();
const BaseModel = getBaseModel(firestore);

@Collection("subscribers")
class Subscriber extends BaseModel<Subscriber> {
  @IsEmail()
  email!: string;
}

export const subscribe = functions.https.onRequest(async (req, res) => {
  try {
    const s = new Subscriber({ email: req.body.email });
    const id = await s.save();
    res.json({ id });
  } catch (err) {
    res.status(400).json({ errors: err });
  }
});
```

---

## Error Handling

- `ValidationError[]` from `save()` for invalid fields.
- `delete()` throws if `id` is missing.
- `findById()` returns `null` if not found.
- `findMany()` supports `where`, `orderBy`, `limit` with proper type safety.

---

## License

MIT © Ayush Dhar
