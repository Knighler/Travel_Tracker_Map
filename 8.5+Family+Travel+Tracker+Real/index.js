import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "The World",
  password: "Yoyotooti2005",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;



async function checkVisisted(id) {
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1; ",[id]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {

  let users=[];
  users=await db.query("SELECT * FROM users ORDER BY name ASC");
  const countries = await checkVisisted(currentUserId);


  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users.rows,
    color: users.rows[currentUserId-1].color,
  });


  /*
  let users=[];
  let countries=[];
  const countries_array = await db.query("SELECT country_code FROM visited_countries WHERE user_id=1");
  users=await db.query("SELECT * FROM users");
  
  countries_array.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users.rows,
    color: "teal",
  });*/
});



app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
        [countryCode,currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});



app.post("/user", async (req, res) => { 
  if(req.body["add"]==="new"){
    res.render("new.ejs");
  }
else{
  
currentUserId=req.body["user"];

res.redirect("/")
}
  /*if(req.body["name"]){
  res.render("new.ejs");}

  else{
    let users=[];
 
    const wanted_id=req.body["user"];
    const countries=await checkVisisted(wanted_id);
    users=await db.query("SELECT * FROM users");
    

    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users.rows,
      color: users.rows[wanted_id-1].color,
    });

    
  }
*/

});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted
  
  //https://www.postgresql.org/docs/current/dml-returning.html


 
  const name=req.body["name"];
  const color=req.body["color"];
  try{
  await db.query("INSERT INTO users (name,color) VALUES ($1,$2)",[name,color]);
  res.redirect("/");
} catch(err){
  res.redirect("/");
}

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
