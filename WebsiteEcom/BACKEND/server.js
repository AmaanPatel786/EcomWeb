require("dotenv").config();
const express = require ("express");
const app = express();
const path = require ("path");
const jwt = require ("jsonwebtoken");
const {QueryTypes} = require('sequelize');
const {sequelize} = require ("./database/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { type } = require("os");


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));


app.post("/login", async (req, res) => {
    const payload = req.body;
    const {email, password} = payload;
    const [users] = await sequelize.query(`Select * from users where email = '${email}'`,{type: QueryTypes.SELECT,}) 
    if (!users){
        return res.status(401).send("Invalid Credentials")
    }
    const chk = await bcrypt.compare(password, users.hash)
    if (!chk){
        return res.status(401).send("Wrong password bhaiya")
    }
    const accesstoken = jwt.sign(payload.email, process.env.SECRET_KEY);
    return res.status(200).json({success: true, accesstoken});
})

 
app.post("/signup",async (req, res) => {
    const payload = req.body;
    const {email, password, name} = payload;
    const hash = await bcrypt.hash(password, 10);
    const insert = await sequelize.query(`INSERT INTO users (email, hash, name)
    VALUES ('${email}', '${hash}', '${name}')
`,{type: QueryTypes.INSERT,});
    return res.status(200).send("Sign Up Successfull")
});

app.get("/filters", async (req, res) => {
  try {
    const categories = await sequelize.query("SELECT DISTINCT category FROM products", {
      type: QueryTypes.SELECT
    });

    const brands = await sequelize.query("SELECT DISTINCT brand FROM products", {
      type: QueryTypes.SELECT
    });

    const formattedCategories = categories.map(cat => cat.category); 
    const formattedBrands = brands.map(b => b.brand);

    return res.status(200).json({
      categories: formattedCategories,
      brands: formattedBrands
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error fetching filters" });
  }
});



  app.get("/listProducts", async (req, res) => {
    try {
        const { brand, category, minprice, maxprice } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';
        const replacements = {};

        if (brand) {
            query += ' AND brand = :brand';
            replacements.brand = brand;
        }
        if (category) {
            query += ' AND category = :category';
            replacements.category = category;
        }
        if (minprice) {
            query += ' AND price >= :minprice';
            replacements.minprice = parseFloat(minprice);
        }
        if (maxprice) {
            query += ' AND price <= :maxprice';
            replacements.maxprice = parseFloat(maxprice);
        }

        const products = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            replacements
        });

        return res.status(200).json({ success: true, products });
    } catch (error) {
           return res.status(500).json({ status: false, message: "Madam net nhi challla" });
    }
});



function authentication(req, res, next){
    try{
        const headers = req.headers;
        const token = headers["authorization"].split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY);
        next();
    }catch(err){
        console.log(err);
        throw(err);
    }
}



app.listen(3001);


