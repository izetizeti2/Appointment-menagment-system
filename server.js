const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host : "localhost",
    user: "root",
    password: "",
    database: "react"
})
// ruatja e te dhenave ne sign in
app.post('/Signup', (req, res) => {
    const { name, email, password } = req.body;

    // Kontrolloni nëse email-i është i zënë
    const checkEmailQuery = "SELECT * FROM signup WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error("Error checking email existence:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        // Nëse rezultati nuk është bosh, atëherë email-i është tashmë i përdorur
        if (results.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Nëse email-i është i lirë, atëherë kryej regjistrimin
        const insertUserQuery = "INSERT INTO signup (name, email, password) VALUES (?, ?, ?)";
        db.query(insertUserQuery, [name, email, password], (err, data) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.status(200).json({ success: true });
        });
    });
});

// login i userit
app.post('/login', (req, res )=> {
    const sql = "SELECT * FROM signup WHERE `email` = ? AND `password` = ?";
    
    
    
    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if(err) {
            return res.json("error");
            
        }
        if(data.length > 0){
            return res.json("success");
        } else {
            return res.json("fail");
        }
    })
} )
// tabela e login admin
app.post('/Admin', (req, res )=> {
    const sql = "SELECT * FROM admin WHERE `email` = ? AND `password` = ?";
    
    
    
    db.query(sql, [req.body.email,req.body.password], (err, data) => {
        if(err) {
            return res.json("error");
            
        }
        if(data.length > 0){
            return res.json("success");
        } else {
            return res.json("fail");
        }
    })
} )
// tabela per caktim t terminit 
app.post('/Appointment', (req, res )=> {
    const sql = "INSERT INTO Appointment (name , email , date , time) VALUES (?)";
    const values =[
        req.body.name,
        req.body.email,
        req.body.date,
        req.body.time
    ]
    db.query(sql, [values], (err, data) => {
        if(err) {
            return res.json("error");
        }
        return res.json(data);
    })
    
})
// tabela per terminet e zena 
app.get('/booked-times', (req, res) => {
    const date = req.query.date; 
    console.log("Requested date:", date); // Printoni kërkesën e datës në console

    const sql = "SELECT time FROM Appointment WHERE date = ?";
    
    db.query(sql, [date], (err, data) => {
        if (err) {
            console.error("Error retrieving booked times:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        const bookedTimes = data.map(appointment => appointment.time);
        console.log("Booked times:", bookedTimes); // Printoni orët e zëna në console
        return res.json(bookedTimes);
    });
});

// tabela e userit e terminve
app.get('/appointments', (req, res) => {
    const userEmail = req.query.email;
    const sql = "SELECT * FROM Appointment WHERE email = ?";

    db.query(sql, userEmail, (err, data) => {
        if (err) {
            console.error("Error retrieving appointments:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Appointments data:", data); // Printoni të dhënat në terminal ose në konsole
        return res.json(data);
    });
});

// tabela e adminit e termineve
app.get('/adminappointments', (req, res) => {
    const sql = "SELECT * FROM Appointment";

    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error retrieving appointments:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Appointments data:", data);
        return res.json(data);
    });
});

//tabela e userave e adminit
app.get('/adminusers', (req, res) => {
    const sql = "SELECT * FROM signup";

    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error retrieving users:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("users data:", data);
        return res.json(data);
    });
});


// tabela e userit e fshirjes
app.delete('/appointments/:id', (req, res) => {
    const appointmentId = req.params.id;

    const deleteAppointmentQuery = "DELETE FROM Appointment WHERE id = ?";
    
    db.query(deleteAppointmentQuery, [appointmentId], (err, result) => {
        if (err) {
            console.error("Error deleting appointment:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Appointment deleted successfully");
        return res.status(200).json({ success: true });
    });
});

//fshirja e userave nga admini
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    const deleteUserQuery = "DELETE FROM signup WHERE id = ?";
    
    db.query(deleteUserQuery, [userId], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("User deleted successfully");
        return res.status(200).json({ success: true });
    });
});









app.listen(8081, ()=> {
    console.log("listening");
})