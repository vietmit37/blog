run be:
yarn
migration database: npm run typeorm:run-migrations
yarn start:dev

## API : http://localhost:8000/api
-Post: 
  - GET: 
    - /posts: Get all Post
    - /posts/:id: Get Post by id
    - /posts/user: Get Post by userId
- Comment:
  - GET:
    - /comments: Get all Comment
    - /comments/:id: Get comments by id

- Tag:
  - GET:
    - /tags: Get all tag
    - /tags/:id: Get tag by id


- Auth (jwt) : Authentication
    - GET:
        - /auth: Get info user
        - /auth/refresh: Get accessToke when expired
        - /auth/log-out
    - POST:
        - /auth/log-in


## Deployment: https://blog.thanhtung.parami.life/api
- Because there is an error about logging in with cookies, I don't use this API. But can still run to check API
- Post:
    - GET:
      - /posts: Get all Post
      - /posts/:id: Get Post by id
      
- Comment:
    - GET:
        - /comments: Get all Comment
        - /comments/:id: Get comments by id

- Tag:
    - GET:
        - /tags: Get all tag
        - /tags/:id: Get tag by id


- Auth (jwt) : Authentication
    - GET:
        - /auth: Get info user
    - POST:
        - /auth/log-in
