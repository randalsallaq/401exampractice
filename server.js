require('dotenv').config();
let express = require('express');
let cors = require('cors');
let app = express();
app.use(cors());
//
let PORT = process.env.PORT;
let DATABASE_URL = process.env.DATABASE_URL;
//
let superagent = require('superagent');
let pg = require('pg');
let methodOverride = require('method-override');
//
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(DATABASE_URL);
///////////////////////////////////////////////////

//\\
app.get('/home', handleHome);
app.post('/joke', saveData );
app.get('/joke', getData);
app.get('/joke/:id', getDetails);
app.put('/joke/:id', updateData);
app.delete('/joke/:id', deleteData);
//\\




function handleHome(req,res){

let dataArray =[];

let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';

superagent.get(url).then(data=>{

    data.body.forEach(element=>{

        dataArray.push(new Joke(element));
    });
    res.render('home', {result: dataArray });
}).catch(error =>{
    console.log('error',error);
});

}

function handleHome(req,res){

let dataArray =[];

let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';

superagent.get(url).then(data=>{

    data.body.forEach(element=>{

        dataArray.push(new Joke(element));
    });
    res.render('home', {result: dataArray });
}).catch(error =>{
    console.log('error',error);
});

}

function saveData(req,res){
let statement = 'INSERT INTO joke (jokenumber, type, setup, punchline) VALUES ($1,$2,$3,$4) RETURNING *;';
let values = [req.body.id, req.body.type, req.body.setup, req.body.punchline];
client.query(statement,values).then(()=>{
    res.redirect('/joke');
}).catch(error=>{
console.log('error', error);
});
}
//\\
function getData(req,res){
    let statement = 'SELECT * FROM joke;';
    client.query(statement).then(data=>{

res.render('fav', {result: data.rows});

    }).catch(error=>{
        console.log('error', error);
        });
}
//\\
function getDetails(req,res){
    let statement = 'SELECT * FROM joke WHERE id=$1;';
    let values = [req.params.id];
    client.query(statement,values).then(data=>{
        res.render('details', {result: data.rows[0]});
    }).catch(error=>{
        console.log('error', error);
        });
}
//\\
function updateData(req,res){
    let statement = 'UPDATE joke SET jokenumber= $1, type=$2, setup=$3, punchline=$4 WHERE id=$5;';
    let values = [req.body.jokenumber, req.body.type, req.body.setup, req.body.punchline, req.params.id];
    client.query(statement,values).then(()=>{
        res.redirect('/joke');
    }).catch(error=>{
        console.log('error', error);
        });
}
//\\

function deleteData(req,res){
    let statement = 'DELETE FROM joke WHERE id=$1';
    let values= [req.params.id];
    client.query(statement,values).then(()=>{
        res.redirect('/joke');
    }).catch(error=>{
        console.log('error', error);
        });
}

//\\
function Joke(data){

    this.id = data.id;
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;

}

client.connect().then(()=>{
    app.listen(PORT,()=>{

        console.log('app is listening', PORT);
    });
});
