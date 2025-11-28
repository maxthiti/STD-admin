# 📝 Role Permission Table for All APIs

| API                               | super admin | admin | teacher             | student |
|-----------------------------------|------------|-------|----------------------|---------|
| POST /users/login                 | ✔          | ✔     | ✔                  | ✔       |
| POST /users/personlogin           | ✔          | ✔     | ✔                  | ✔       |
| POST /users/register              | ✔          | ✔     | ✔                  | ✔       |
| PATCH /users/password             | ✔          | ✔     | ✔                  | ✔       |
| POST /users/:id/resetpassword     | ✔          | ✔     | ✔                  | ❌      |
| POST /users/admin                 | ✔          | ❌    | ❌                 | ❌      |
| GET /users/admin                  | ✔          | ✔     | ❌                 | ❌      |
| DELETE /users/admin/:id           | ✔          | ❌    | ❌                 | ❌      |
| GET /users/student                | ✔          | ✔     | ✔                  | ❌      |
| POST /users/student               | ✔          | ✔     | ❌                 | ❌      |
| PATCH /users/student/:id          | ✔          | ✔     | ❌                 | ❌      |
| DELETE /users/student/:id         | ✔          | ✔     | ❌                 | ❌      |
| POST /users/teacher               | ✔          | ✔     | ❌                 | ❌      |
| GET /users/teacher                | ✔          | ✔     | ✔                  | ❌      |
| GET /users/teacher/:id            | ✔          | ✔     | ✔                  | ❌      |
| PATCH /users/teacher/:id          | ✔          | ✔     | ❌                 | ❌      |
| DELETE /users/teacher/:id         | ✔          | ✔     | ❌                 | ❌      |

| API                               | super admin | admin | teacher | student |
|----------------------------------|------------|--------|---------|-----------|
| GET /report/attendance           | ❌         | ❌    | ❌      | ✔        |
| GET /report/dailystats           | ✔          | ✔     | ❌      | ❌       |
| GET /report/missed               | ✔          | ✔     | ❌      | ❌       |
| GET /report/late                 | ✔          | ✔     | ❌      | ❌       |
| GET /report/stranger             | ✔          | ✔     | ❌      | ❌       |

| API                               | super admin | admin | teacher | student |
|----------------------------------|------------|--------|----------|----------|
| GET /position                    | ✔          | ✔     | ✔       | ❌       |
| POST /position                   | ✔          | ✔     | ❌      | ❌       |
| DELETE /position/:id             | ✔          | ✔     | ❌      | ❌       |

| API                               | super admin | admin | teacher | student |
|------------------------------------|------------|--------|---------|-----------|
| GET /modeling                      | ✔          | ✔     | ✔       | ❌       |
| POST /modeling                     | ✔          | ✔     | ✔      | ❌       |
| PATCH /modeling/:id/remodeling     | ✔          | ✔     | ✔      | ❌       |
| DELETE /modeling/:id               | ✔          | ✔     | ✔      | ❌       |

| API                               | super admin | admin | teacher | student    |
|------------------------------------|------------|--------|---------|-----------|
| GET /device                        | ✔          | ✔     | ✔       | ❌       |
| POST /device                       | ✔          | ✔     | ❌      | ❌       |
| PATCH /device/:id                  | ✔          | ✔     | ❌      | ❌       |
| DELETE /device/:id                 | ✔          | ✔     | ❌      | ❌       |

| API                               | super admin | admin | teacher | student |
|------------------------------------|------------|--------|---------|-----------|
| GET /department                    | ✔          | ✔     | ✔       | ❌       |
| POST /department                   | ✔          | ✔     | ❌      | ❌       |
| DELETE /department/:id             | ✔          | ✔     | ❌      | ❌       |

| API                               | super admin | admin | teacher | student    |
|------------------------------------|------------|--------|---------|-----------|
| GET /classroom                     | ✔          | ✔     | ✔       |  ❌     |
| POST /classroom                    | ✔          | ✔     | ❌      | ❌       |
| PATCH /classroom/:id               | ✔          | ✔     | ❌      | ❌       |
| DELETE /classroom/:id              | ✔          | ✔     | ❌      | ❌       |