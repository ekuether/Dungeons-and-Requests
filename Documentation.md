# API Documentation

## Authentication Logins

### POST /login

Description:
    Logs a user in using basic authorization

Body Parmaters: 
    - None
Header Paramaters:
    - Authorization:
        - Value: "Basic base64-encoded-useremail-:-userpassword"

Returns:
    - Encrypted Cookie containing the ip address and expiration date of the cookie

Status Codes:
    - 200: Successful Login
    - 401: Unsuccessful Login

### GET /login

Description:
    Checks to see if the user is logged in

URL Params:
    - User email
        - Example URL .../login/user_email

Body Params:
    - None

Header Params:
    - None

Returns:
    - New encrypted cookie containing the ip address and the new expiration date of the cookie

Status Codes:
    - 200: User is logged in
    - 401: User is not logged in


