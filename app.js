 
var express = require('express');
var mongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')

var app = express();
//var url = 'mongodb://142.93.118.128'
// console.log('cliiiiiiiiiiiii',mongoClient);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var dbo=null;
// Encoding URL to JSON format
// app.use(express.urlencoded({ extended : false }));
// app.use(express.json());

mongoClient.connect(
    'mongodb://root:thunder%4054Struck@142.93.118.128:27017/admin', {
    auth: {
      user:'bp', 
      password:'bhanu@15',
      "useUnifiedTopology": true
    },
    useNewUrlParser:true
  }, function(err, client) {
    if (err) {
      console.log(err);
    }else{
        dbo = client.db('admin');
        console.log("conn\'d");
    }
})

app.post('/products',(req,res)=>{
    dbo.collection("products").find({},{projection : {products : 1}}).
    toArray((error,results)=>{
    if(error){
        console.log(error)
    }else{
        //results.forEach((element)=>{
            res.send(results);
        //})
        
        }
    }); 
});

app.post('/searchProduct',(req,res)=>{
    var {search} = req.body
    console.log(search);
    
    dbo.collection("products").find( {$text : { $search : search }},
            {projection : {products : 1}}).toArray((error,results)=>{
        if(error){
            console.log(error)
        }else{
            console.log('-----seraching');
            console.log(results.length);
            res.send(results)
        }
    })
}) 

app.post('/filters',(req,res)=>{
    dbo.collection("products").find({},{projection : {appliedParams : 1}}).
    toArray((error,results)=>{
    if(error){
        console.log(error)
    }else{
        // console.log(results)
        results.forEach((element)=>{
            res.send(element.appliedParams.filters);
        })
        
        
        }
    }); 
})

app.post('/filterProducts',(req,res)=>{
    // console.log(req.body)
    var {keyword,filter} = req.body;
    // console.log(filter)
    var {brand} = filter[0]
    var {gender} = filter[1] 
    var {min} = filter[2]
    var {max} = filter[3]
    var {year} = filter[4]

    console.log(year)
    console.log(year.includes("2019"))
    
        dbo.collection("products").find({$text : { $search : keyword} },{projection : {products : 1}})
        .toArray((error,results)=>{
        if(error){
            console.log('---'+error)
        }else{
            //    console.log('--enter',results);
               
               let results1 = JSON.parse(JSON.stringify(results))
               results1 = results1[0].products.filter((data)=>{
                        
                        // console.log('gender', data.gender,gender);
                    
                        if((data.gender == gender || gender == "") && 
                            (data.brand == brand || brand == '')
                            && ((min == '' || data.mrp > min)
                            && (max == '' || data.mrp < max ))
                            && (year.includes(data.year) || year == "")
                        )
                            // && ((data.mrp >min || min == 0) && (data.mrp < max or max == '')) {
                            // console.log('F');
                            return true
                        // console.log('N F');
                        return false; 
                    
                }); 
                console.log('rs1',results1.length);

               res.send(results1)
            }
         }); 
})

app.listen('7052',(error,data)=>{
    if(error){
        console.log(error)
    }
    console.log('conn\'d');
})


// {
// 	"keyword" : "watch",
// 	"filter":[
// 		{"brand":""},
// 		{"gender":""},
// 		{"min":"0"},
// 		{"max":"60000"},
// 		{"year" : [""]}
// 	]
// }
