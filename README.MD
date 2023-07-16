# E-commerce project [ hardware store ]

## Authorization

### - Register

```javascript
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

```javascript
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
  "name": "bta33",
  "email": "bat33@gmail.com",
  "rule": "vendore"
}
```

#

# users

### - get user profile

```javaScript
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

```javaScript
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

```javaScript
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

```javaScript
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

```javaScript
import axios from "axios";
const URL = "{{domin}}/api/v1/allUsers";
const userData =
    {
    name: "update name",
    email: "update email",
    newPassword: "update password" ,
    password: "current password"
}

axios.put(URl,userData).then((respons) => console.log(respons.data));
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
