# TODO DEMO APP

## Instructions

- Make sure you have `docker` and `docker-composer` installed. Check both [here](https://docs.docker.com/engine/install/ubuntu/) and [here](https://docs.docker.com/compose/install/standalone/) if you are on linux or [here](https://docs.docker.com/desktop/install/windows-install/) for windows
- Go to the project directory and run the following commands for setting up
  <br>
  `path/to/docker-compose up -d` replace path/to with correct path. (This will download some `360MB`)
- Once you the above command complete without any error run the following commands
  <br>
  `path/to/docker-compose run --rm --service-ports api_runner i`
  
  `path/to/docker-compose run --rm --service-ports ui_runner i`

- Now you can access the app on http://localhost:8000 and the api part on http://localhost:9000
If anything is unclear don't hesitate to contact me for further assistance.

Note: <br>
- `I would have not include api/.env file but to simplify your testing, I have included it.`
- `Make sure you network connection can download 450MB+`
- `When you want to test locally, you have to change the api/.env MONGODB_URL or inform me to whitelist your IP address`