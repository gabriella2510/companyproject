 const express = require ('express')
 const mysql = require('mysql2')
 const cors = require('cors')
 const bcrypt = require ('bcryptjs')
 const jwt = require ('jsonwebtoken')
 const bodyParser = require('body-parser')


 const app = express();
 app.use(cors());
 app.use(bodyParser.json());

 const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'cargo'
 });

 db.connect((err) =>{
    if(err){
        console.log ("database failed:", err.message);
    }
    else{
        console.log('connected to MYSQL');
    }
 });
 //Management of the login and registrationof the manager 

 app.post('/register',async(req,res) =>{
    const {userName,password} =req.body
    const hashedpassword = await bcrypt.hash(password,10);

    db.query(
     "INSERT INTO Manager (userName,password) VALUES(?,?)",
     [userName,hashedpassword],
     (err,result) =>{
        if(err){
            return res.status(500).json({error:err.message});
        }
            res.json({message:'manager registered successfully'});
        
     }
    );
 });

 app.post('/login',async(req,res) =>{
    const {userName,password} = req.body

    db.query(
        "SELECT * FROM Manager where userName = ? ",[userName],async(err,result) =>{
            if(err || result.length===0){
                return res.status(401).json({error:'invalid cridentials'});
            }

            const isMatch = await bcrypt.compare(password,result[0].password);
            if(!isMatch){
                return res.status(401).json({error:'incorrect credentials'});

            }

            const token = jwt.sign({Managerid:result[0].Managerid},'secret123',{expiresIn:'1h'});

            res.json({token});
        }
    );
 });

 //furniture crud


app.get('/furniture', (req, res) => {
    db.query('SELECT * FROM furniture', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

//adding the new furniture

app.post('/furniture',  (req,res)=>{
    const{furnitureName , furnitureOwnerName} = req.body;
    db.query(
        "INSERT INTO furniture(furnitureName,furnitureOwnerName) VALUES(?,?)",
        [furnitureName,furnitureOwnerName],
        (err,result)=>{
            if(err) return res.status(500).json({error:err.message});
            res.json({message:"furniture added successfully"});
        }
    );
});

//add the put on furniture
app.put('/furniture/:id',(req,res)=>{
    const{id} =req.params;
    const {furnitureName,furnitureOwnerName} = req.body;
    db.query(
        "UPDATE furniture SET furnitureName=? , furnitureOwnerName=? where furnitureId=?",
        [furnitureName,furnitureOwnerName,id],
        (err) =>{
          if(err) return res.status(500).json({error:err.message});
            res.json({message:"updated successfully"});
        }
        
        );
});
//delete the furniture
app.delete('/furniture/:id',(req,res)=>{
    const{id} =req.params;
    db.query(
        "DELETE FROM furniture WHERE furnitureId=?",
        [id],
        (err)=>{
            if(err) return res.status(500).json({error:err.message});
            res.json({message:"furniture deleted successfully"});
        }
    );

});

//import
app.post('/import',(req,res)=>{
    const {furnitureId,importDate,quantity} = req.body
    db.query(
        "INSERT INTO import(furnitureId,importDate,quantity) VALUES(?,?,?)",
        [furnitureId,importDate,quantity],
        (err)=>{
            if(err) return res.status(500).json({error:err.message});
            res.json({message:"import added successfully"})
        }
    )
});
app.post('/export', (req, res) => {
    const { furnitureId, exportDate, quantity } = req.body;
    db.query(
        "INSERT INTO export(furnitureId, exportDate, quantity) VALUES (?, ?, ?)",
        [furnitureId, exportDate, quantity],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "successfully exported" });
        }
    );
});


//how to use the report
app.get('/report',(req,res)=>{
    const query=`

    SELECT
    f.furnitureId,
      f.furnitureName,
      f.furnitureOwnerName,
      IFNULL(i.TotalImported, 0) AS TotalImported,
      IFNULL(e.TotalExported, 0) AS TotalExported,
      IFNULL(i.TotalImported, 0) - IFNULL(e.TotalExported, 0) AS stockAvailable
    FROM furniture f
    LEFT JOIN (
      SELECT furnitureId, SUM(quantity) AS TotalImported
      FROM import
      GROUP BY furnitureId
    ) i ON f.furnitureId = i.furnitureId
    LEFT JOIN (
      SELECT furnitureId, SUM(quantity) AS TotalExported
      FROM export
      GROUP BY furnitureId
    ) e ON f.furnitureId = e.furnitureId;
   `;
    
   db.query(query,(err,result)=>{
    if(err) return res.status(500).json({error:err.message})
        res.json(result);
    
   });

});


 app.listen(4040, () =>{
    console.log('server is running on port 4040')
 })
