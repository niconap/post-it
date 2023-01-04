<p align="center"><img width="300" alt="post_it_logo 666c828dcda82d1e8dc1" src="https://user-images.githubusercontent.com/34626207/210351637-787b94ca-671b-44ee-94af-2850ea9ea676.png"></p>

*Live version:* you can view the live version of this project by clicking [here](https://post-it-ah2k.onrender.com/frontend). It could take some time to load.
**Known issue:** profile pictures do not load in the live demo, this is probably because they are removed by the service that hosts the demo. Uploading a profile picture **does** work and the uploaded picture will show up throughout the website.

## What is Post it!?
Post it! is a social media platform where you can find your friends and talk to each other by creating posts and commenting on them. Aside from that you can also connect with strangers through their posts! Upload your favourite picture as a profile picture and show it to everyone else! The concept of the social media page is that each post is a post-it (a sticky note). Therefore each post is pretty short, there's a maximum of 40 characters for the title and a maximum of 215 characters for the content.

## How does it work?
In order to access Post it! you'll need to create an account or you can use the dummy account instead. Creating a post can be done on the homepage, commenting on a post can be done by clicking on the comment icon and liking a post can be done by clicking the heart icon. Uploading a profile picture is possible through your profile, click 'My profile' in the top right corner to access your profile. In order to add people as your friends, you simply click the 'Add friend' button on their profile or in the user list, they'll need to accept your friend request first before you can become friends.

## How was it made?
Post it! was made using Node.js and React.js. Both the Node.js API and the React frontend code can be found in this repository in their respective folders. 

Known issue: the live version does not show custom profile pictures correctly. This (probably) has to do with Heroku (the platform it is hosted on). Profile pictures are not stored in the database, but in a directory on the server. Uploading a profile picture still works and it will show correctly after uploading, but after a while it will disappear.

## Repository organization
- `frontend` is the folder that contains all the frontend code.
  - `frontend/public` contains the static public code.
  - `frontend/src` contains all the React.js code, fonts, images and CSS.
- `api` contains all the Node.js code, together with a frontend build in `api/build`.
  - `api/controllers` contains the code that will be executed for different types of requests.
  - `api/images` contains all the images that are displayed on the web app.
  - `api/models` contains all the database models for the different types of data that are stored.
  - `api/routes` cointains the code that determines which route a user has taken to call the correct controller function.
