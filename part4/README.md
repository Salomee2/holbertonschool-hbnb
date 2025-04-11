# HBnB Project - Web Client (Part 4)

This project is all about building the front-end of an Airbnb-like app using HTML5, CSS3, and JavaScript (ES6). The goal was to create a simple web client that interacts with a back-end API and displays dynamic content.

### **Task 0: Design**

I started with the provided HTML and CSS files to make the design match the specs. 

- **HTML Structure**: I used semantic HTML tags like `<header>`, `<footer>`, and `<main>` to make everything clear and organized.
- **CSS Styling**: I applied a clean layout, focusing on a simple design. The header includes a logo and login button, the navbar links to other pages, and there's a footer with the usual "all rights reserved" text.
- **Page Content**: On the main page (index.html), I displayed place cards with basic info about each place (like name, description, and price). Each card had a "View Details" button for navigating to the place details page.

Issues faced:
- **Aligning elements**: I had some issues with getting the layout right initially. After some back and forth, I realized I could use `flexbox` to get better control over the layout, and that really helped align everything properly.

### **Task 1: Login**

This one was about implementing the login functionality, allowing users to log in and storing their JWT token for later use.

- **Login Form**: Created a form with email and password fields. After the form is submitted, I make a POST request to the login endpoint.
- **AJAX Request**: I used the Fetch API to send a request with the user's credentials.
- **JWT Token**: On successful login, I store the JWT token in a cookie to keep the user logged in.
- **Redirection**: After login, I redirect the user to the homepage (index.html).

Issues faced:
- **Token storage**: At first, I didn't store the token correctly in the cookie. After some troubleshooting and adding console logs, I realized the token wasn’t being stored properly. Once I got that working with `document.cookie`, login worked as expected.
- **Login failures**: Handling login errors was tricky. I kept getting blank pages when login failed, but I eventually added an alert that gives more info about what went wrong.

### **Task 2: List of Places**

This task involved displaying a list of places on the main page (index.html) and filtering them by price.

- **Fetching Data**: I made a GET request to the back-end API to fetch the list of places.
- **Client-side Filtering**: I added a client-side filter that lets users filter places based on price. The idea was to let them see only the places within their price range, without reloading the page.
- **Authentication Check**: I checked if the user was authenticated by verifying the presence of the JWT token in the cookies.

Issues faced:
- **Fetching places**: Initially, I couldn’t fetch places correctly, and I didn’t know why. After some console.log-ing, I realized I was missing the `Authorization` header in my fetch request. Adding the token to the header fixed the issue.
- **Price filter**: The filtering feature didn’t work as expected at first. I had to figure out how to properly filter places based on price, and I did that by creating a helper function that adjusted the visibility of the place cards based on the selected price.

### **Task 3: Place Details**

In this task, I needed to display detailed information about a place when clicked.

- **Extracting Place ID**: I used `window.location.search` to get the place ID from the URL.
- **Fetching Data**: I made another GET request to fetch the details of the selected place.
- **Dynamic Content**: Once I got the data, I dynamically updated the page with the place’s details, including the name, description, price, and reviews.
- **Review Form**: I added a review form that's only visible to authenticated users. If you're not logged in, you don’t get the option to add a review.

Issues faced:
- **Place ID extraction**: I kept messing up how to extract the place ID from the URL. I was overthinking it at first, but then I realized I just needed to use `new URLSearchParams(window.location.search).get('id')`.
- **Review rendering**: At first, the reviews weren’t appearing. I figured out that I wasn’t fetching them properly, and after fixing the request and mapping them to the DOM, everything worked fine.

### **Task 4: Add Review Form**

This task was about implementing a form where users could add reviews to places.

- **Authentication Check**: I made sure that only authenticated users could submit reviews.
- **Submitting Reviews**: When the form is submitted, the review data (text and rating) gets sent to the back-end API via a POST request.
- **Handling Responses**: If the review is successfully added, I display a success message and reset the form. If something goes wrong, I show an error message.

Issues faced:
- **Review submission**: The first time I tried to submit a review, I kept getting a CORS error or the API wouldn’t respond correctly. After debugging, I figured out the issue was with how the JWT token was included in the request headers. Once I added that properly, it worked.
- **"You cannot review your own place"**: Yes, I know, it's a beginner's mistake but after so many hours of coding, let's just say my focus wasn't exactly at its peak.

### **Final Thoughts**

From getting the login system working to dynamically displaying places and reviews, there were a lot of steps to get everything working smoothly. Debugging with console logs was a lifesaver in most cases—especially when I couldn’t figure out why things weren’t working. The most challenging part was ensuring that the data was being correctly fetched, displayed, and updated dynamically without causing the page to reload.

Ultimately, I built a working web client where users can log in, view places, and leave reviews. It’s not perfect, but it’s functional, and I’ve learned a lot along the way about handling authentication, working with APIs, and using JavaScript to create dynamic web pages.