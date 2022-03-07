# Simple Request Counter

This project is a simple request counter build using Node.js.

The idea was to build a HTTP server that on each request responds with a counter of the total number of requests that it has received during the previous
60 seconds (moving window). The server continues to return the correct numbers after restarting it, by persisting data to a file.

Instructions to run the project:

1) Clone this repository to your computer;
2) Inside the node_simple_server package, please run the command ```npm install```to install the project dependencies;
3) Run the server using the command ```node index.js```.
4) I set by default the port 3000 to run the server. To access the request counter, please acceess the URL: http://localhost:3000/requestCounter

*I used Node version 12.22.1.

More about the implementation:

Hi folks! My idea in this project was to make the implementation as simple as possible. At first I considered dividing the implementation into Controller and Service classes, but due to the small size of the project (and also a little lack of experience in Node), I chose to leave the entire implementation in index.js file.

I used only one dependency that needs to be installed via ```npm i```: *express*. I use it to up the server so that the user can make requests. I also used the fs module for reading and writing in a *.txt* file.

I'll explain a little bit more the main functions of my project:

1) Main variables

There are three main variables on my code:
```
let requestExpirationDates = [];
let nextExpirationDate = new Date();
let nextComparsionInterval = 1;
````

The first one is used to store an array of the request expiration date. When a user makes a request, I'm pushing on this array an expiration date for this request. This expiration date is calculated with the sum of the actual date and 60 seconds. This value is stored on the *requests.txt* file every time a request is made. The value is updated with the *requests.txt* file content when the program is started.  

The ```nextExpirationDate``` is used to store the first expiration date of the array of request expiration dates. When the array is empty, the value of this variable will be the actual date.

The ```nextComparsionInterval``` is used as a interval to compare the ```nextExpirationDate```with the actual date. Is used inside ```setInterval```function.

2) getRequests

To make a request to obtain the total requests on the last 60 seconds, the user must to make a request to the path ```/requestCounter```.
When a user makes a request, the ```requestExpirationDates``` is updated with the actual date and time + 60 seconds. This is the time the request must be deleted and not considered for counting. Is the ```requestExpirationDates``` is empty - is the first request on the last 60 seconds - the ```expirationDate``` valiable is also updated with this date and time.

```server.get('/requestCounter', (req, res) =>{

  let expirationDate = new Date(new Date().getTime() + 1000 * 60);
  if(requestExpirationDates.length === 0){
    nextExpirationDate = expirationDate;
  }
  requestExpirationDates.push(expirationDate);

  getRequests().then(
    (val) => { 
      return res.json(val);
    }
  )
});

function getRequests() {
  return new Promise((resolve) => {
    writeOnFile();
    resolve(requestExpirationDates.length);
  })
}
```

The method ```getRequest``` is called to update *requests.txt* with the ```requestExpirationDates``` value. If this file does not exist, it is created in the *assets* folder.


3) *setInterval*

```setInterval(() => { 
    if(nextExpirationDate <= new Date() && requestExpirationDates.length !== 0){
      requestExpirationDates.every(element => {
        if(element <= nextExpirationDate){
          requestExpirationDates.shift();
          updateNextExpirationDateAndComparsionInterval();
        }
        else
          return false;
      });
      writeOnFile();
    }

}, nextComparsionInterval);
```
