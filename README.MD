# E-commerce project [ hardware store ]

## Authorization

### - Register

```js
import axios from "axios";
// register
const URL = "{{domin}}/api/v1/auth/register";
const userData = {
  name: "bassel",
  email: "bassel@gmail.com",
  ruel: "vendore", // rule (user | vendore) vendore can add, update and delete his products | user only show and buy products
  password: "b123456", // min 6 chars
};

axios.post(URl, usearData).then((respons) => console.log(respons.data));

// JWT token will save in http cookie
```

### - Login

```js
import axios from "axios";
// register
const URL = "{{domin}}/api/v1/auth/login";
const userData = {
  email: "bassel@gmail.com",
  password: "b123456",
};
axios.post(URl, usearData).then((respons) => console.log(respons.data));

// JWT token will save in http cookie
```

### both will response

```json
{
  "_id": "64b43449d649604aee58390d",
  "name": "bassel",
  "email": "bassel@gmail.com",
  "rule": "vendore"
}
```

#

# users

### - get user profile

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/profile";

axios.get(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "_id": "64b43449d649604aee58390d",
  "name": "bta33",
  "email": "bat33@gmail.com",
  "rule": "vendore",
  "createdAt": "2023-07-16T18:17:45.213Z",
  "updatedAt": "2023-07-16T18:17:45.213Z",
  "__v": 0
}
```

### - get all users (admin rule)

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/allUsers";

axios.get(URl).then((respons) => console.log(respons.data));
```

### Response

```json
[
  {
    "_id": "64b188030250b1de909b6267",
    "name": "bassel",
    "email": "b@gm.co",
    "rule": "user",
    "createdAt": "2023-07-14T17:38:11.363Z",
    "updatedAt": "2023-07-14T17:38:11.363Z"
  },
  // all users and vendors
  {
    "_id": "64b43449d649604aee58390d",
    "name": "bta33",
    "email": "bat33@gmail.com",
    "rule": "vendore",
    "createdAt": "2023-07-16T18:17:45.213Z",
    "updatedAt": "2023-07-16T18:17:45.213Z"
  }
]
```

### - get user by id

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/users/64b188030250b1de909b6267";

axios.get(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "_id": "64b188030250b1de909b6267",
  "name": "bassel",
  "email": "b@gm.co",
  "rule": "user",
  "createdAt": "2023-07-14T17:38:11.363Z",
  "updatedAt": "2023-07-14T17:38:11.363Z",
  "__v": 0
}
```

### - remove user account ( user | admin )

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/users/64b188030250b1de909b6267";

axios.delete(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "success": true
}
```

### - update user profile

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/allUsers";
const userData = {
  name: "update name",
  email: "update email",
  newPassword: "update password",
  password: "current password",
};

axios.put(URl, userData).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

#

# Products

### - Add product (vendore | admin)

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/products";
const productData = {
  name: "product name",
  discription: "discription for product ",
  img: "data:image/jpeg;base64...", // conver img to data url (base64)
  stock: true, // boolen value
  price: 1800,
  category: "gpu",
};
axios.post(URl, productData).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "vendore": "64b019c309ce800ac502bba3",
  "_id": "64b457b9a3c5cf78a037d999",
  "name": "product name",
  "discription": "discription for product ",
  "img": "data:image/jpeg;base64",
  "category": "gpu",
  "stock": true,
  "price": 1800,
  "createdAt": "2023-07-16T20:48:57.358Z",
  "updatedAt": "2023-07-16T20:48:57.358Z",
  "__v": 0
}
```

### - update product

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/products/64b457b9a3c5cf78a037d999";
const update = {
  name: "product update".
  price: 2000
}

axios.put(URl,update).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

### - remove product

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/products/64b457b9a3c5cf78a037d999";

axios.delete(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

### - Search products and pagenation ( 20 product per page )

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/products";
const query = "?search=core i5&page=1";

axios.get(URl + query).then((respons) => console.log(respons.data));
```

### Response

```json
[
  {
    "_id": "64b30c4a00139f3d042e5441",
    "vendore": "64b188030250b1de909b6267",
    "name": "INTEL CORE I5 10400F TRAY Processor",
    "img": "https://www.sigma-computer.com/image/products/1681175382.jpg",
    "price": 4299,
    "category": "cpu",
    "discription": "High End Hexa Core CPU, tray\nfor Sockel 1200, 65 W TDP\n6 Cores / 12 Threads\nBasistakt: 2.90 GHz, Turbo clock: 4.30 GHz\n12 MB L3 cache",
    "stock": false
  }
  // more ...
]
```

### - get single product

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/products/64b30c4a00139f3d042e5441";

axios.get(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "_id": "64b30c4a00139f3d042e5441",
  "vendore": "64b188030250b1de909b6267",
  "name": "INTEL CORE I5 10400F TRAY Processor",
  "img": "https://www.sigma-computer.com/image/products/1681175382.jpg",
  "price": 4299,
  "category": "cpu",
  "discription": "High End Hexa Core CPU, tray\nfor Sockel 1200, 65 W TDP\n6 Cores / 12 Threads\nBasistakt: 2.90 GHz, Turbo clock: 4.30 GHz\n12 MB L3 cache",
  "stock": false
}
```

#

# Cart

### Add to cart

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/cart";
const productData = {
  productId: "64b18604d8604d0867e7cda4",
  count: 2,
};
axios.post(URl, productData).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

### Get user cart

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/cart";

axios.get(URl).then((respons) => console.log(respons.data));
```

### Respons

```json
[
  {
    "productId": "64b30c4a00139f3d042e544e",
    "count": 5,
    "_id": "64b4665eea79b3184a27d72c",
    "createdAt": "2023-07-16T21:51:26.516Z",
    "updatedAt": "2023-07-16T21:51:26.516Z"
  }
]
```

### - update cart item

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/cart/64b2c8e7a7ba88c3cde8a188"; // cart item (_id)
const update = {
  count: 2,
};

axios.put(URl, update).then((respons) => console.log(respons.data));
```

### Respons

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

### - remove cart item

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/cart/64b2c8e7a7ba88c3cde8a188"; // cart item (_id)

axios.delete(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```

### reset cart

```js
import axios from "axios";
const URL = "{{domin}}/api/v1/cart";

axios.delete(URl).then((respons) => console.log(respons.data));
```

### Response

```json
{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
```
