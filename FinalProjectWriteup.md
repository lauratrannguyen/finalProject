# Bobagram Project Writeup

# Meta:
## Who was on your team?
Our team members are Anne Lee and Laura Nguyen.
## What’s the URL of your deployed app?
https://bobagram.annelee2001.com
## What’s the URL of your github repository with the code for your deployed app?
https://github.com/lauratrannguyen/bobagram.git
## Is your app deployed and working?
Yes 

## For each team member, what work did that person do on the project?
Because we were a two-person group, we ended up doing the majority of
the project together. This was easy to coordinate as we are roommates
and could plan to work on the project at any time we wanted. The React
frontend work of the landing page, registration, boba post creation,
and field of posts was done by both of us, with small tweaks on UI
done independently. Anne helped to accomplish the location enabler,
with the geolocation API. It grabs the user’s location on the site and
won’t allow the user to upload a boba place if it does not exist yet.
For the other API, the Google Places one, Laura helped to create the
search bar that found possible Boston Locations depending on the
user’s input. The boba feed was done by both of us, so we were able to
equally contribute to the project. 

# App:
## What does your project app do?
For our final project, we created an app called “Bobagram”. This app
begins by signing in or creating an account. Users must be logged in
to create posts, leave comments and browse the posts of others on the
app. Once successfully logged in, there will be three main pages for
the user to browse: Home, Account, and Creating a New Post. All three
pages are intuitive and straightforward. As the name suggests, the app
behaves similarly to Instagram and inherits some of its features. The
Home page reveals all posts sorted by most recent ones appearing at
the top and most old ones appearing at the bottom. The Account page
displays information regarding the signed-in user. The Create a New
Post page allows users to search for boba places near them by typing
in the name and selecting the location if it is found by the Google
Places API, leaving a caption, and finally, posting! This post will
appear in the Home feed if successfully posted. All in all, this app
allows users to review boba places near them and upload pictures of
what they drink. Users can be more informed on boba places near them
and make connections with other fellow boba lovers! We were inspired
to go with this project idea because you can find boba places near you
using Google Maps or Apple Maps, but there is no consistency and
specificity in the reviews specifically geared toward boba places. In
other words, we want to create a space for shared boba lovers. The app
will allow users the chance to offer recommendations of places and
drinks to other users. We realized from a business perspective that it
is better to start a project idea with a specific target group and we
can branch out further if it becomes successful. Users will be able to
upload and comment on posts and grow more knowledgeable in each boba
place’s specialty, wifi availability, affordability, closeness, photos
of their surroundings, opening hours, and contact information.
## How has your app concept changed since the proposal?
We were planning to add a Likes data table similar to Comments to our
database and implement the ability for any user to “Like” any post.
However, we found ourselves short on time, especially since it took us
longer than we hoped to figure out how to use the Geolocation API and
Google Places API and get it working. Therefore, users will not be
able to “like” posts, but they still will be able to “comment” on
posts, which seems to be more important and offers more substance and
meaning. Furthermore, we realized we don’t like the idea of “likes”,
anyway. Growing up using social media, we realized how the idea of
likes and not having enough and wanting more has had a negative impact
on a lot of people, and we thought that Bobagram is better off without
this feature.
## How do users interact with your application? What can they accomplish by doing so?
Users can interact with our application by browsing through posts
uploaded by other users that can only be found on our app. Our app
performs in real-time and is constantly updating instantaneously as
users spend time on it. By allowing our app to keep track of a user’s
location, our app can locate any nearby place that is part of the
Google Places API according to what the user types in as the name. In
other words, our app through the Google Places API responds to a
user’s request when searching for a nearby place. Once located, users
can upload a post and our application will make sure to get the
message out to other users of the application. By providing this
user-to-application interaction, users can utilize this app as a way
of storing their reviews on boba places as it will not leave as long
as the user does not delete the post themselves. They can also gain
insight into what other people think about other boba places. The
application basically acts as a blog, but captures blogs of many
people and can be shared and accessed by others.

## For each project requirement above, how does your app meet that requirement?
The back-end of our project was created with Elixir/Phoenix and we
followed the setup instructions of previous homeworks including HW06:
Multiplayer Game and HW07 and HW08: Events App parts 1 and 2 by
running mix phx.server. We created the database by running ecto.create
and ecto.migrate. The front-end of our project was created with Create
React App and we followed the setup instructions of previous homeworks
including HW03: Browser Game and HW09: Events SPA by running npm
install and npm start. If you take a look at our code, we used the
JSON API. The domain we used is linked to our VPS that we retrieved at
the beginning of the semester and our app is therefore connected to
one of our VPS’s. Our application does have anyone using it register
an account with a username, email and password. We even make sure that
they enter the password in twice and that they match. Our Users table
has email, name and password fields and includes a function to
validate the password. We create a Postgres database using the
username and password specified in the dev.exs file within the api
folder. We use the Geolocation API to push realtime updates to user
because it keeps track of the user’s location at all times and updates
automatically. The search bar would cater differently to where they
are. Our “something neat” involves the Geolocation API, which was not
required and this is in addition to our other API, Google Places API.
Geolocation API returns a location and accuracy radius based on
information about cell towers and WiFi nodes that the mobile client
can detect. We have tested our app for multiple users and does not
crash when multiple users are on it at the same time.

## What interesting stuff does your app include beyond the project requirements?
The something “neat” component of our project was the Geolocation API,
which grabs the user’s location to find nearby Boba places in the
search bar that they type in. This allowed us to limit the boba places
to only in their area (Massachusetts) and give them better ease for
searching up a boba place. Like other apps, this will request that the
user open up access for their location, so it gives them a choice. We
also made their location anonymous to other users due to privacy
concerns. 
Using the Geolocation API made our Google Places API much more
effective. When the user looked up a boba place they want others to
know about, it would show boba places that were only in their area and
not, for example, all the way in New York. It also allowed the user to
grab an idea of how many boba places were around them. If the user
moved and changed their location, the site would update automatically,
and the search bar would cater differently to where they are. This
fits the requirement of “Your application must use Phoenix Channels to
push real-time updates to users, triggered either from an external API
or from actions by other concurrent users”.
Based on what places other users uploaded, the user could tell which
cafe was the most popular, and what kind of drinks to order. The
location API could also tell us in what area the boba place was
located, and the user could check if it was accessible at all. 

## What’s the complex part of your app? How did you design that component and why?
The most complex part of our project was utilizing the two APIs,
Google Places and Geolocation that grabbed the user’s current
location. We used the built-in functions the APIs came with to
personalize the user experience, by grabbing their location and then
having the google places search bar only list boba places in the area.
The Google Places API came with many features that were readily
available to us, such as doing google.maps.places.PlacesService to get
the details of a boba place the user picked. It would then create a
structure out of the information found through google places, to help
with the posting. We designed the google places API as more of a
search bar that the user looked through to find a boba place, as it
offered a personalized experience. The details we gathered from what
the user picked was the name, location, a photo of the boba, website
to the main menu, and more. 

## What was the most significant challenge you encountered and how did you solve it?
The hardest API to implement was the geolocation API. We had to lookup
example documentation of how it was implemented to see how to put it
in our code, which was not the most difficult task once we understood
it better. When we first used it, it was not able to properly pick up
the user’s location and took a long time to grab even if the user had
their location-enabled. In Chrome and in Mac settings, we also
realized that we had to set our preferences to allow location access
for the API to work. At times, this access would be turned off
randomly, which was frustrating to work around. Ultimately this
problem fixed itself, and we could continue to debug the API once we
were sure our preferences were set. 
It took a while for us to understand that the API needed time to
retrieve a user’s location, and it was a matter of patience for the
“Upload a boba place” page to appear. Even if the location was enabled
as soon as the user logged in, the site still took time to gather the
longitude and latitude. As a result, we spent more time debugging our
code even though it was already correct.  
We solved this obstacle by leaving the page to load for a minute and
constantly rechecking our location preferences. We also made sure to
check on different browsers besides Chrome to make sure our code was
compatible with all. 
