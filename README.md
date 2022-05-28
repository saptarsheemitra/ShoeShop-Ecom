# The Shoe Shop
## About the app
<br />
This is a Ecommerce web application , allowing users to make purchase of products . In this cases it offers users to order shoes .

## Tech used 

- Frontend
  - React
  - React Context
  - Material UI
  - Leaflet
 - Backend 
    - Node JS
    - Stripe Payment
    - AWS Storage
    - Mongo DB NOSQL


## Preview
<br />
Live demo: https://theshoeshop.netlify.app/
<br />
Backend Deployed to: Heroku
Frontend Deployed to: Netlify
<br />
<br />

## Features of the application
- Lists of all products;
- Filtering / Sorting items;
- Search bar;
- Reviews / Ratings;
- User interface;
- WishList products ;
- Order tracking;
- Payments;
- Mailing;
- Admin panel;

## Installation
- Setup .env variables  ;

```DB_CONNECT = "This is Connection string to MongoDB"
TOKEN_USER = 'Secret Token for Auth'
KEY_STRIPE = 'Stripe Key (can be found in website of stripe after registration)'
GUEST_TOKEN = 'Secret token for the guest user'

GMAIL_ACC = 'Email adress from where to send emails. Requires setup in Gmail in order to use this.'
GMAIL_PASW = 'Gmail password'
AWS_KEYID = 'AWS Storage Key (requires registration in Amazon). This is for the Images that Admin panel adds (new product).'
AWS_SECRET = 'Aws Key Storage'
RESET_PASS = 'Password Reset Secret Token String'
RESET_LINK = 'Change PAssword pathname f.ex in local can be : http://localhost:3000/changepassword'
```
- Run npm start



