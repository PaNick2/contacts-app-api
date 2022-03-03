const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const res = require('express/lib/response');

const app = express();
app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
var jsonParser = bodyParser.json()

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'test',
        database: 'DataverseUsers'
    },
    useNullAsDefault: true
});


// GET contacts
app.get("/", (req, res) => {
    db('users').orderBy('name')
        .then(data => res.json(data))
        .then(data => console.log("Contacts retrieved successfully"))
});


// REGISTER contact
app.post("/", jsonParser, (req, res) => {
    const { name, email, address, mobile } = req.body
    console.log(req.body)
    console.log("Name: ", name, "Email: ", email, "Address: ", address, "Mobile: ", mobile)
    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            address: address,
            mobile: mobile
        })
        .then(response => {
            res.json(response);
        })
        .then(data => console.log("Contact registed successfully"))
        // .then(data => res.status(200).json('Registered Successfully'))
        .catch(err => res.status(400).json('Could not Register'))
})


// UPDATE CONTACT
app.put("/:email", (req, res) => {
    const { email } = req.params;
    const { newName, newEmail, newAddress, newMobile } = req.body;
    db('users')
        .where('email', '=', email)
        .update({
            name: newName,
            email: newEmail,
            address: newAddress,
            mobile: newMobile
        })
        .then(data => res.json("Success"))
        .then(data => console.log("Contact updated successfully"))
        .catch(err => res.json(err))
})


// DELETE CONTACT
app.delete("/:email", (req, res) => {
    const { email } = req.params;
    db('users')
        .where('email', email)
        .del()
        .then(data => res.json(`Successfully Deleted user with email: ${email}`))
        .catch(err => res.json(err))

})

app.listen(process.env.PORT, () => {
    console.log("App is running on port 3001")
});


