import express from 'express';
import fs from 'fs';

const server = express();

let requestDates = [];
let nextExpirationDate = new Date();
let nextComparsionInterval = 1;

setInterval(() => { 
    if(nextExpirationDate <= new Date() && requestDates.length !== 0){
      requestDates.every(element => {
        if(element <= nextExpirationDate){
          requestDates.shift();
          updateNextExpirationDateAndComparsionInterval();
        }
        else
          return false;
      });
      writeOnFile();
    }

}, nextComparsionInterval);


readFileAndUpdateNumberOfRequests();

server.get('/requestCounter', (req, res) =>{

  let expirationDate = new Date(new Date().getTime() + 1000 * 60);
  if(requestDates.length === 0){
    nextExpirationDate = expirationDate;
  }
  requestDates.push(expirationDate);

  getRequests().then(
    (val) => { 
      return res.json(val);
    }
  )
});

function getRequests() {
  return new Promise((resolve) => {
    writeOnFile();
    resolve(requestDates.length);
  })
}

function writeOnFile() {
  fs.writeFile('./assets/requests.txt', requestDates.toString(), (err) => {
    if (err) throw new Error('Error writing to file.');
  });
}

function readFileAndUpdateNumberOfRequests() {
  fs.readFile('./assets/requests.txt', 'utf8', (err, data) => {
    if(err){
      if(err.code == 'ENOENT' )
        requestDates = [];      
      else        
        throw new Error('Error reading file.');      
    }
    else{
      updateRequestDatesWithFileContent(data);  
      updateNextExpirationDateAndComparsionInterval();
    }
  });
}

function updateRequestDatesWithFileContent(data){
  let dataArray = data.toString().split(",");
      dataArray.forEach(element => {
        if(isValidDate(new Date(element)))
          requestDates.push(new Date(element));        
      });      
}

function isValidDate(date) {
  return !isNaN(date);
}

function updateNextExpirationDateAndComparsionInterval() {
  nextExpirationDate = requestDates.length === 0 ? new Date() : requestDates[0];
  nextComparsionInterval = requestDates.length === 0 ? 1000*60 : nextExpirationDate - new Date();
}

server.listen(3000);



