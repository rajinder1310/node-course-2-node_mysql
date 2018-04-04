var express = require('express');
var hbs = require('hbs');
var mysql = require('mysql');
var url = require('url');
var bp = require('body-parser');

var app = express();

var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'db'
});
app.set('viewengine','hbs');
app.use(bp.urlencoded({extended : true}));

app.get('/',(req,res)=>{
    res.send('Hello');
});

app.get('/viewform',(req,res)=>{
    res.render('viewform.hbs');
});

app.post('/submitform',(req,res)=>{
    var _catname = req.body.catname;
    var _status = req.body.status;

    var q = "insert into mydata set catname = '"+_catname+"' , status = '"+_status+"'";
    con.query(q,(err,result)=>
    {
        if(err)
        {
            console.log('Connection not connected with mysql');
        
        }
        else
        {
            console.log('Connection Succesfull');
            res.render('viewform.hbs');

        }
    });
    
});
    app.get('/viewdata',(req,res)=>
    {
        var p = "select * from mydata";
        con.query(p,(err,result)=>
        {
            if(err)
                throw err;
            res.render('output.hbs',
            {
                 data : result
            });
            
        });
    });

    app.get('/single/:id',(req,res)=>
    {
        var _id = req.params.id;
        console.log(_id);
        var s = "select * from mydata where id = '"+_id+"'";
        con.query(s,(err,result)=>
        {
            if(err)
                throw err;
            res.render('singleView.hbs',{x: result[0].id, y:result[0].catname,z:result[0].status });
        });
    });
   app.get('/delete/:id',(req,res)=>{
        var d_id = req.params.id;
        console.log(d_id);
        var w = "delete from mydata where id = '"+d_id+"'";
        con.query(w,(err,result)=>
        {
            if(err)
                throw err;
            res.redirect('/viewdata');
        });
   });

   app.post('/deletechecks',(req,res)=>
    {
        var ch = req.body.check;
        console.log(ch);
        for(i=0;i<ch.length;i++)
        {
            var h = "delete from mydata where id = '"+ch[i]+"'";
            con.query(h,(err,result)=>
            {
                console.log("delete successfull");
            });
        }
        res.redirect('/viewdata');
        
    });

    app.get('/update/:id',(req,res)=>
    {
        var d = req.params.id;
        var s = "select * from mydata where id = '"+d+"'";
        con.query(s,(err,result)=>
        {
            var resu = result;
           // console.log(resu);
            if(err)
                throw err;
            else
            {
                res.render('updateform.hbs',{ fid : result[0].id , fname : result[0].catname , fstatus : result[0].status });
            }
        });
    });

    app.post('/updateform/:id',(req,res)=>
    {
        var i = req.params.id;
        var a = req.body.catname;
        var b = req.body.status;
        console.log(i);
        console.log(a);
        console.log(b);
        var t = "update mydata set catname = '"+a+"',status = '"+b+"' where id = '"+i+"'";
        con.query(t,(err,result)=>
        {
          if(err)
            throw err;
        else
        {
            res.redirect('/viewdata');
        }
        });

    });

app.listen(1000);


