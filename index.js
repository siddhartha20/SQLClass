const { faker } = require('@faker-js/faker');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); //parse method-override

const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Siddhartha@2025'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};
// console.log(getRandomUser());



//Home Route
app.get("/", (req,res) => {
    let q = `SELECT count(*) FROM user`;
    try{
    connection.query(q, (err, result) => {
        if (err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs",{ count });
    });
    }catch (err) {
        console.log(err);
        res.send("Error in DB");
    }
    //res.send("Welcome to home page");
});

//Show Route
app.get("/user",(req,res) => {
    let q = `SELECT * FROM user`;

    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let data = result;
            // console.log(data);
            res.render("showusers.ejs",{ data });
        });
        }catch (err) {
            console.log(err);
            res.send("error occurred in DB");
        }
})

//Edit Route
app.get("/user/:id/edit", (req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs",{ user });
        });
        }catch (err) {
            console.log(err);
            res.send("error occurred in DB");
        }
});

// Update(DB) Route
app.patch("/user/:id", (req,res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    let {password: formPass, username: newUsername} = req.body;
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if(formPass != user.password){
                res.send("Wrong Password");
            }else{
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) => {
                    if(err) throw err;
                    res.redirect("/user");
                })
            }
        });
        }catch (err) {
            console.log(err);
            res.send("error occurred in DB");
        }
});

app.listen("8080", () => {
    console.log("server is listining to port 8080");
});




//let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for(let i = 0; i < 100; i++){
//     data[i] = (getRandomUser());
// }


// try{
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// }catch (err) {
//     console.log(err);
// }
// connection.end();