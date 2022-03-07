import express from 'express';
import fs from 'fs';

const server = express();
let numberOfRequests;

readFileAndUpdateNumberOfRequests();

server.get('/', (req, res) =>{
  getRequests().then(
    (val) => { 
      return res.json(val);
    }
  )
});

function getRequests() {
  return new Promise((resolve) => {
    numberOfRequests++;
    writeOnFile();
    resolve(numberOfRequests);
  })
}

function writeOnFile() {
  fs.writeFile('./assets/requests.txt', numberOfRequests.toString(), (err) => {
    if (err) throw new Error('Error writing to file.');
  });
}

function readFileAndUpdateNumberOfRequests() {
  fs.readFile('./assets/requests.txt', 'utf8', (err, data) => {
    if(err){
      if(err.code == 'ENOENT' )
        numberOfRequests = 0;      
      else        
        throw new Error('Error reading file.');      
    }
    else
      numberOfRequests = data;    
  });
}

server.listen(3000);



