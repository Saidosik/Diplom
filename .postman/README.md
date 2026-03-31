# Postman exports

This folder contains Postman exports for this repo.

## Import into Postman
1. In Postman, open **Import**.
2. Import the collection JSON from `./collections/laravel-auth.postman_collection.json`.
3. Import the environment JSON from `./environments/local-laravel-8001.postman_environment.json`.
4. Select the environment **Local Laravel (8001)**.

## Auth token
The exported environment has an empty `token` value.

Run the **Login** request in the collection to obtain a token, then set the `token` variable in the active environment (or update your auth settings as used by the requests).
