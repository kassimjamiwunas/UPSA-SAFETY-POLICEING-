 require("dotenv").config();
const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser");
const db=require("./db");

const app=express();

app.use(cors());
app.use(bodyParser.json());

// TEST ENDPOINT
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

/* ================= SIGNUP ================= */

app.post("/signup",(req,res)=>{

const {username,password}=req.body;

const sql="INSERT INTO users (username,password,role) VALUES (?,?,?)";

db.query(sql,[username,password,"student"],(err,result)=>{

if(err){
res.json({success:false,message:"Signup failed"});
}else{
res.json({success:true,message:"Signup successful"});
}

});

});


/* ================= LOGIN ================= */

app.post("/login",(req,res)=>{

const {username,password}=req.body;

const sql="SELECT * FROM users WHERE username=? AND password=?";

db.query(sql,[username,password],(err,result)=>{

if(err || result.length===0){

res.json({message:"Invalid login"});

}else{

const user=result[0];

res.json({
token:"simple-token",
role:user.role
});

}

});

});


/* ================= SUBMIT REPORT ================= */

app.post("/report",(req,res)=>{

const {type,description,location,anonymous}=req.body;

const sql=`
INSERT INTO reports (report_type,description,location,anonymous,status)
VALUES (?,?,?,?, 'Pending')
`;

db.query(sql,[type,description,location,anonymous],(err,result)=>{

if(err){
res.json({message:"Report submission failed"});
}else{
res.json({message:"Report submitted successfully"});
}

});

});


/* ================= GET REPORTS ================= */

app.get("/reports",(req,res)=>{

const sql="SELECT * FROM reports ORDER BY created_at DESC";

db.query(sql,(err,result)=>{

if(err){
res.json([]);
}else{
res.json(result);
}

});

});


/* ================= UPDATE STATUS ================= */

app.put("/report/:id",(req,res)=>{

const id=req.params.id;
const {status}=req.body;

const sql="UPDATE reports SET status=? WHERE id=?";

db.query(sql,[status,id],(err,result)=>{

if(err){
res.json({message:"Update failed"});
}else{
res.json({message:"Report status updated"});
}

});

});


/* ================= STATISTICS ================= */

app.get("/stats",(req,res)=>{

const total="SELECT COUNT(*) AS total FROM reports";
const pending="SELECT COUNT(*) AS pending FROM reports WHERE status='Pending'";
const resolved="SELECT COUNT(*) AS resolved FROM reports WHERE status='Resolved'";

db.query(total,(err,totalResult)=>{

db.query(pending,(err,pendingResult)=>{

db.query(resolved,(err,resolvedResult)=>{

res.json({
total:totalResult[0].total,
pending:pendingResult[0].pending,
resolved:resolvedResult[0].resolved
});

});

});

});

});


/* ================= START SERVER ================= */

app.listen(5000,()=>{

console.log("Server running on http://localhost:5000");

});