const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const NodeGeocoder = require('node-geocoder');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

//connection details
const connection = mysql.createConnection({
    host: 'eu-cdbr-west-01.cleardb.com',
    user: 'ba88f2af9a657f',
    password: '05e84b59',
    database: 'heroku_9d2cdfb347a4244'
});


//set view files
//app.set('views', path.join(__dirname,'views'));

//view engine
app.set('view engine', 'ejs');

//set body-parser
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//render home page
app.get('/', function(req, res) {

    
    connection.query('SELECT * from store', (error, rows) => {
        if (error) {
            throw error;
        }
        if (!error) {
            console.log(rows);
            res.render('pages/index', { rows });
        }

    });

});

//render stores page
app.get('/stores', function(req, res) {

   
    connection.query('SELECT * from store', (error, rows) => {
        if (error) {
            throw error;
        }
        if (!error) {
            console.log(rows);
            res.render('pages/stores', { rows });
        }

    });

});

//render to add page
app.get('/add', function(req, res) {

    res.render('pages/add');

});

//render to edit page
app.get('/edit/:id', function(req, res) {

    const store_id = req.params.id;
    let sql = `SELECT * FROM store where id = ${store_id}`;
    let query = connection.query(sql,(err,rows) => {
        if(err){
            throw err;
        }

        res.render('pages/edit', {rows} );
    })

});

//delete function
app.get('/delete/:id', function(req, res) {

    const store_id = req.params.id;
    let sql = `DELETE FROM store where id = ${store_id}`;
    let query = connection.query(sql,(err,rows) => {
        if(err){
            throw err;
        }

        res.redirect('/stores');
    })

    

});



//add new store
app.post('/add_store', async function(req, res) {

    const options = {
        provider: 'mapquest',
       
        // Optional depending on the providers
        //fetch: customFetchImplementation,
        //httpAdapter: 'https',
        apiKey: 'k8gVZtDUeysz9GYcBGNvx2zjHJUe1ud6', // for Mapquest, OpenCage, Google Premier
        formatter: null // 'gpx', 'string', ...
      };
       
      const geocoder = NodeGeocoder(options);
       
      // Using callback
      const loc = await geocoder.geocode(req.body.street);

      console.log(loc);


    let data = {name: req.body.name, street: req.body.street, latitude: loc[0].latitude, longitude: loc[0].longitude};

    let sql = "INSERT INTO store SET ?";
    let query = connection.query(sql, data, (err,results) => {
        if(err){
            throw err;
        }
    res.redirect('/');

    })
  
});



//edit a store
app.post('/edit/edit_store', async function(req, res) {

    
    const id = req.body.id;

    const options = {
        provider: 'mapquest',
       
        // Optional depending on the providers
        //fetch: customFetchImplementation,
        //httpAdapter: 'https',
        apiKey: 'k8gVZtDUeysz9GYcBGNvx2zjHJUe1ud6', // for Mapquest, OpenCage, Google Premier
        formatter: null // 'gpx', 'string', ...
      };
       
      const geocoder = NodeGeocoder(options);
       
      // Using callback
      const loc = await geocoder.geocode(req.body.street);

    let data = {name: req.body.name,street: req.body.street};
    let sql = "UPDATE store SET name='"+req.body.name+"', street='"+req.body.street+"', latitude='"+loc[0].latitude+"', longitude='"+loc[0].longitude+"'  WHERE id ='"+id+"' ";
    let query = connection.query(sql, data, (err,results) => {
        if(err){
            throw err;
        }
    res.redirect('/stores');

    })
  
});



app.listen(port);
console.log(`Server is listening on port ${port}`);
