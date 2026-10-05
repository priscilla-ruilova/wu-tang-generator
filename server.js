const http = require('http'); //an app layer used to exchange data from client<--> server
const fs = require('fs') //file system built into node that provides methods to CRUD and manage files w/out external libraries
const url = require('url');
const querystring =require('querystring');
const path = require('node:path');


const names = { //when we call names, the function mostPicked is looking for a key (eother a, b, c)
    a: {
        first:['Killa', 'Sadpoet', 'Mojo Jojo', 'Erudite', 'Quirky'],
        last:['Beloved By Animals', 'Traitorous Villian', 'the Great', 'the Boss', 'Murda On The Beat'
        ]
    },
    b: {
        first:['Otaku', 'Nostalgic', 'Fragrant', 'Syntactic Sugar', 'Philosobro'],
        last:['Mad Hatter', 'Gentle Person', 'Lover', 'Avatar', 'Spice'
        ]
    },
    c: {
        first:['Minty Breath', 'Forlorn', 'Hungry', 'Blessed', 'Cry Baby'],
        last:['Curator','Free of Allergies', 'Sad Boy', 'Wearer Of Socks To Sleep', 'Night Owl'
        ]
    }
}

//we haven't created this list yet 

function listTaker(list){
    return list[Math.floor(Math.random() * list.length)] //this is where we randomize the list
}

//anytime we declare an argument in a function, we are creating a variable that we haven't named yet
function mostPicked(answers){ //this function only ever gives us (returns) ONE letter
 const counts = {
    a: 0,
    b: 0,
    c: 0,
 };
 answers.forEach(function(answer){ 
    if(counts[answer] !== undefined){
        counts[answer] += 1 //this counts how many a, b, and cs come in 
    }

 });
 //this is how we make counts: we're going to count how many tiems a, b, and c show up and return the highest count wins. This is the pool of names we pick from.
 let winner = 'a'; //we're giving it a default winner
 if(counts.b > counts[winner]) winner = 'b'; //because it knows that the key is integers, it knows how to count it
 if(counts.c > counts[winner]) winner = 'c'; //could also use switch here
 return winner
}


//page == '/' is referencing the root homepage aka index.html
const server = http.createServer((req, res) => {
  const page = url.parse(req.url).pathname; //with every request comes a url method
  const params = querystring.parse(url.parse(req.url).query);
  console.log(page);

  if (page == '/') {
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }else if(page == '/api'){ //this page asks us for the api to send q1, q2, q3 and the param holds the answers and we send the name back as a json
    const answer = [params.q1, params.q2, params.q3, params.q4, params.q5];
    const letter = mostPicked(answer);
    const group = names[letter]
    const name = listTaker(group.first) + " " + listTaker(group.last)

    res.writeHead(200, {'Content-Type': 'application/json'});
    // res.write(data); //don't need data because. you're already sending the data in the form of json below
    res.end(JSON.stringify({name: name}))

  }else if (page == '/css/styles.css'){
    fs.readFile('css/styles.css', function(err, data) {
      res.write(data);
      res.end();
    });
  }else if (page == '/js/main.js'){
    fs.readFile('js/main.js', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  }else if (page.startsWith('/img')){
    const imagePath = '.' + page;  //extracts the file name
    const imgExtension = path.extname(imagePath).toLowerCase(); //extracts the extension type of the photo
    
    const mimeTypes = { //naming all the possible extensions 
      '.jpg': 'image/jpg',
      '.png': 'image/png',
      '.avif': 'image/avif',
      '.gif': 'image/gif'
    }
    fs.readFile(imagePath, function(err, data){
      res.writeHead(200, { 'Content-Type': mimeTypes[imgExtension] || 'application/octet-stream'}); //here we call the object
      res.write(data);
      res.end();
      console.log(imagePath)
    });
  }else{
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(8000)