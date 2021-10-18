## Run application

A `.env.example` file is provided in the root folder. Duplicate the file and fill in the information `<user>` and `<password>`

Run `npm start`. By default, app runs [http://localhost:8080](http://localhost:8080)

## TODOs
Error builder\
POST requests: send 422 when incomplete/incorrect req.body\
Invite email: build email template\
Filter announcements

## Assumptions

Roles (Admin | Manager | Staff) are created if collection is not initialised\
User Admin is created by default\
Sessions last for 1 hour\
Invite link lasts for 24h\
Sending 2 invites to the same email will delete the first invite\