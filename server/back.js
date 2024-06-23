import pg from "pg";
import express from "express"
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import multer from "multer";

const app=express();
const port =3002;
const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
};
app.use(cors());


const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"School",
    password:"sashy1012@",
    port:5432
});
db.connect();
const updateExpiredAppointments = async (req, res, next) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      await db.query(`
        UPDATE appointments
        SET status = 'Expired'
        WHERE appointment_date < $1 AND status != 'Expired'
      `, [today]);
  
      next();
    } catch (error) {
      console.error("Error updating expired appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

//middleware
app.use(updateExpiredAppointments);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/getinfo', upload.single('photo'), async (req, res) => {
  try {
      const { name, StudentId, Contact, Course, Password, secret } = req.body;
      const parsedStudentId = parseInt(StudentId);
      const hashedPassword = await bcrypt.hash(Password, 10);
      const photoPath = req.file.buffer;

      if (!name || !StudentId || !Contact || !Course || !Password || !secret) {
          return res.status(400).json({ success: false, message: "Fill all the fields" });
      }
      if(Password.length<8){
        return res.status(400).json({success:false,message:"password must be 8 digit long"})

      }
      var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      if(!regularExpression.test(Password)) {
        return res.status(400).json({success:false,message:"password must contain a number and a special charcter"})
      
      }
      // if(Password.match((/[a-z]/) && password.match(/[A-Z]/))){
      //   return req.status(400).json({success:false,message:"password must be 8 digit long"})

      // }
      if (Contact.toString().length !== 10) {
          return res.status(400).json({ success: false, message: "Contact number must be 10 digits long" });
      }

      const insertQuery = "INSERT INTO student (st_id, name, contact, course, pass, secret, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)";
      await db.query(insertQuery, [parsedStudentId, name, Contact, Course, hashedPassword, secret, photoPath]);

      const token = jwt.sign({ userId: parsedStudentId }, "littlecoder", { expiresIn: "1hr" });
      res.status(200).json({ success: true, message: "Data inserted successfully.", token });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
  }
});


// app.post("/getinfo", async (req, res) => {
//   try {
//     const { name, StudentId, Contact, Course, Password,secret } = req.body;
//     const parsedStudentId = parseInt(StudentId);
//     const hashedPassword = await bcrypt.hash(Password, 10);
//     if(Course.length==0||name.length==0||Password.length==0||StudentId==0){
//       return res.status(400).json({success:false,message:"Fill all the fields"});
//     }
   
//     if (Contact.toString().length !== 10) {
//       return res.status(400).json({ success: false, message: "Contact number must be 10 digits long" });
//     }

//     const insertQuery = "INSERT INTO student (st_id, name, contact, course, pass,secret) VALUES ($1, $2, $3, $4, $5,$6)";
//     await db.query(insertQuery, [parsedStudentId, name, Contact, Course, hashedPassword,secret]);
//     const token = jwt.sign({ userId: parsedStudentId }, "littlecoder", { expiresIn: "1hr" });
//     res.status(200).json({ success: true, message: "Data inserted successfully." ,token});
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });


  function authenticateToken(req, res, next) {
    // Extract the JWT token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, return a 401 Unauthorized response
        return res.status(401).json({ message: "Authentication token required" });
    }

    // Verify the token
    jwt.verify(token, 'littlecoder', (err, user) => {
        if (err) {
            // If the token is invalid, return a 403 Forbidden response
            return res.status(403).json({ message: "Invalid token" });
        }
        // If the token is valid, attach the user information to the request object
        req.userId = user.userId;
        next(); // Call the next middleware function in the chain
    });
}

  
  app.post("/getlogin", async (req, res) => {
    try {
      const { Id, Passw } = req.body;
      console.log("Received request with Id:", Id);
      const result = await db.query("SELECT * FROM student WHERE st_id = $1", [Id]);
  
      if (result.rows.length === 0) {
        console.log("User not found");
        return res.status(401).json({ message: "User not a found" });
        
      } else {
        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(Passw, user.pass);
  
        if (!passwordMatch) {
          console.log("Invalid credentials");
          return res.status(401).json({ message: "Invalid credentials" });
        }
        // } else {
        //   console.log("Login successful");
        //   const token = jwt.sign({ userId: user.st_id }, "littlecoder", { expiresIn: "1hr" });
        //   res.status(200).json({ token });
          
        // }
        //admin st_id=1
        //password=admin123
        else {
          console.log("Login successful");
          const token = jwt.sign({ userId: user.st_id, isAdmin: user.is_admin }, "littlecoder", { expiresIn: "1hr" });
          res.status(200).json({ token, isAdmin: user.is_admin });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // app.get("/profile",async(req,res)=>{
  //   try{

  //   }catch(error){

  //   }
  // })
  
// import authenticateToken from "../server/middleware/authenticateToken";
// Define a route for fetching user profile
// Profile Route
// app.get("/profile", authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;

//       // Query the database to fetch user profile information based on the user ID
//       const result = await db.query("SELECT name, st_id , contact, course FROM student WHERE st_id = $1", [userId]);

//       // Check if the user profile exists
//       if (result.rows.length === 0) {
//           return res.status(404).json({ message: "User profile not found" });
//       }

//       // Return user profile information
//       const userProfile = result.rows[0];
//       res.status(200).json(userProfile);
//   } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get("/profile", authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;

      // Query the database to fetch user profile information including the photo
      const result = await db.query("SELECT name, st_id, contact, course, photo FROM student WHERE st_id = $1", [userId]);

      // Check if the user profile exists
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "User profile not found" });
      }

      // Convert photo binary data to base64 string if it exists
      const userProfile = result.rows[0];
      if (userProfile.photo) {
          userProfile.photo = userProfile.photo.toString('base64');
      }

      // Return user profile information including the photo
      res.status(200).json(userProfile);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



app.patch('/forget/', async (req, res) => {
   
    const {id, secret, newPassword } = req.body;

    try {
        // Fetch the student from the database based on st_id
        const user = await db.query('SELECT * FROM student WHERE st_id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const student = user.rows[0];

        // Verify the secret answer
        if (student.secret !== secret) {
            return res.status(400).json({ success: false, message: "Incorrect secret answer" });
        }

        // Encrypt the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updateQuery = 'UPDATE student SET pass = $1 WHERE st_id = $2';
        await db.query(updateQuery, [hashedPassword, id]);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// app.post('/sell', authenticateToken, async (req, res) => {
//   try {
//       const { name, description, sellerId } = req.body;
//       const itemId = generateItemId(); // Function to generate a unique item ID

//       const insertQuery = 'INSERT INTO items (item_id, name, description, seller_id) VALUES ($1, $2, $3, $4)';
//       await db.query(insertQuery, [itemId, name, description, sellerId]);

//       res.status(200).json({ message: 'Item added for selling ', itemId });
//   } catch (error) {
//       console.error('Error selling item:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });




//currently in use
// app.post('/sell', async (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//       const decodedToken = jwt.verify(token, "littlecoder");
//       const sellerId = decodedToken.userId; // Assuming the token contains userId
//       const itemData = req.body;

//       // Item data to be inserted into the database
//       const newItem = {
//           name: itemData.name,
//           description: itemData.description,
//           sellerId: sellerId,
//       };

//       // SQL query to insert item into the database
//       const insertQuery = 'INSERT INTO items (name, description, seller_id) VALUES ($1, $2, $3) RETURNING *';
//       const values = [newItem.name, newItem.description, newItem.sellerId];

//       // Insert item into the database
//       const result = await db.query(insertQuery, values);
//       const insertedItem = result.rows[0];

//       // Respond with success message and inserted item
//       res.status(200).json({ message: 'Item sold successfully', item: insertedItem });
//   } catch (error) {
//       console.error('Error decoding token or inserting item:', error);
//       res.status(401).json({ message: 'Invalid token or error inserting item' });
//   }
// });


app.post('/sell', authenticateToken, upload.single('photo'), async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decodedToken = jwt.verify(token, "littlecoder");
      const sellerId = decodedToken.userId;
      const { name, description, price } = req.body;
      const photo = req.file.buffer;  // Photo is now in binary format

      const insertQuery = 'INSERT INTO items (name, description, price, photo, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, description, price, photo, sellerId];

      const result = await db.query(insertQuery, values);
      const insertedItem = result.rows[0];

      res.status(200).json({ message: 'Item sold successfully', item: insertedItem });
  } catch (error) {
      console.error('Error decoding token or inserting item:', error);
      res.status(401).json({ message: 'Invalid token or error inserting item' });
  }
})

// app.get('/items', async (req, res) => {
//   try {
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//       `);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

//currenkly in use
// app.get('/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id != $1 AND items.status = 'For Sale'
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });


//currently in use 1
// app.get('/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.price, items.photo, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id != $1 AND items.status = 'For Sale'
//       `, [userId]);
      
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });


app.get('/items', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.price, encode(items.photo, 'base64') as photo, items.seller_id, items.status, student.contact
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.seller_id != $1 AND items.status = 'For Sale'
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/seller/items', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.price, encode(items.photo, 'base64') as photo, items.seller_id, items.status, student.contact
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.seller_id = $1
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching seller items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/bills', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await db.query(`
      SELECT gym_memberships.membership_id, gym_memberships.month_paid, gym_memberships.gym_time, student.name, student.contact 
      FROM gym_memberships 
      JOIN student ON gym_memberships.user_id = student.st_id 
      WHERE gym_memberships.user_id = $1
    `, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//currenly in use
// app.get('/seller/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id = $1
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching seller items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

//currently in use 1
// app.get('/seller/items', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, items.price, items.photo, items.seller_id, items.status, student.contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.seller_id = $1
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching seller items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });

app.patch('/items/request/:itemId', authenticateToken, async (req, res) => {
  try {
      const { itemId } = req.params;
      const buyId=req.userId;
      const updateQuery = `
          UPDATE items
          SET status = 'Requested',buyer_id=$1
          WHERE item_id = $2 AND status = 'For Sale'
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [buyId,itemId]);

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is not available for request" });
      }

      res.status(200).json({ message: "Item requested successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error requesting item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.patch('/items/sell/:itemId', authenticateToken, async (req, res) => {
  try {
      const { itemId } = req.params;
      
      const updateQuery = `
          UPDATE items
          SET status = 'Sold'
          WHERE item_id = $1 AND status = 'Requested'
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [itemId]);

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is not available for selling" });
      }

      res.status(200).json({ message: "Item sold successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error selling item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/buy/:itemId', authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  const buyerId = req.userId;

  try {
      const updateQuery = `
          UPDATE items
          SET buyer_id = $1, updated_at = CURRENT_TIMESTAMP
          WHERE item_id = $2 AND buyer_id IS NULL
          RETURNING *;
      `;
      const result = await db.query(updateQuery, [buyerId, itemId]);

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Item is already sold or does not exist" });
      }

      res.status(200).json({ message: "Item bought successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error buying item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const userId = req.userId;

      const result = await db.query('DELETE FROM items WHERE item_id = $1 AND seller_id = $2 RETURNING *', [itemId, userId]);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Item not found or you're not authorized to delete this item" });
      }
      res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
//currently in use
// app.patch('/items/:itemId', authenticateToken, async (req, res) => {
//   try {
//       const itemId = req.params.itemId;
//       const userId = req.userId;
//       const { name, description } = req.body;

//       const result = await db.query(
//           'UPDATE items SET name = $1, description = $2 WHERE item_id = $3 AND seller_id = $4 RETURNING *',
//           [name, description, itemId, userId]
//       );

//       if (result.rows.length === 0) {
//           return res.status(404).json({ message: "Item not found or you're not authorized to edit this item" });
//       }
//       res.status(200).json({ message: "Item updated successfully", item: result.rows[0] });
//   } catch (error) {
//       console.error("Error updating item:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.patch('/items/:itemId', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
      const itemId = req.params.itemId;
      const userId = req.userId;
      const { name, description, price } = req.body;
      const photo = req.file ? req.file.buffer : null;

      const updateQuery = `
          UPDATE items
          SET name = $1, description = $2, price = $3, photo = COALESCE($4, photo)
          WHERE item_id = $5 AND seller_id = $6
          RETURNING *;
      `;
      const values = [name, description, price, photo, itemId, userId];

      const result = await db.query(updateQuery, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Item not found or you're not authorized to edit this item" });
      }
      res.status(200).json({ message: "Item updated successfully", item: result.rows[0] });
  } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



// app.get('/cart', authenticateToken, async (req, res) => {
//   try {
//       const userId = req.userId;
//       const result = await db.query(`
//           SELECT items.item_id, items.name, items.description, student.contact AS seller_contact
//           FROM items
//           JOIN student ON items.seller_id = student.st_id
//           WHERE items.buyer_id = $1 AND items.status = 'Sold' AND items.status='Requested'
//       `, [userId]);
//       res.status(200).json(result.rows);
//   } catch (error) {
//       console.error("Error fetching cart items:", error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// });
app.get('/cart', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query(`
          SELECT items.item_id, items.name, items.description, items.status, student.contact AS seller_contact, encode(items.photo, 'base64') AS photo, items.price
          FROM items
          JOIN student ON items.seller_id = student.st_id
          WHERE items.buyer_id = $1 AND (items.status = 'Sold' OR items.status = 'Requested')
      `, [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/gym/register', authenticateToken, async (req, res) => {
  const { gymTime, monthPaid } = req.body;
  const userId = req.userId;
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  
  // Check if today is the 1st of the month
  if (currentDay !== 1) {
      return res.status(400).json({ message: "Gym fees can only be paid on the 1st of any month" });
  }
  try {
      // Check if the user already has a valid membership for the current month
      const checkQuery = 'SELECT * FROM gym_memberships WHERE user_id = $1 AND month_paid = $2';
      const checkResult = await db.query(checkQuery, [userId, monthPaid]);

      if (checkResult.rows.length > 0) {
          return res.status(400).json({ message: "You have already paid for this month" });
      }

      // Insert new gym membership record
      const insertQuery = 'INSERT INTO gym_memberships (user_id, month_paid, gym_time) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [userId, monthPaid, gymTime]);

      res.status(200).json({ message: 'Gym registration and fee payment successful', membership: result.rows[0] });
  } catch (error) {
      console.error("Error registering for gym:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/gym/details', authenticateToken, async (req, res) => {
  const userId = req.userId;

  try {
      // Fetch the latest gym membership for the user
      const query = `
          SELECT * FROM gym_memberships
          WHERE user_id = $1
          ORDER BY registration_date DESC
          LIMIT 1
      `;
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
          return res.status(200).json({ showPaymentPage: true });
      }

      const latestMembership = result.rows[0];
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });

      // Check if the membership is for the current month
      if (latestMembership.month_paid === currentMonth) {
          return res.status(200).json({ showPaymentPage: false, membership: latestMembership });
      } else {
          return res.status(200).json({ showPaymentPage: true });
      }
  } catch (error) {
      console.error("Error fetching gym details:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/appointments', authenticateToken, async (req, res) => {
    try {
      const { doctorType, description, appointmentDate } = req.body;
      const userId = req.userId;
  
      // Check if appointmentDate is within the next 2 days
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 2);
  
      if (new Date(appointmentDate) > maxDate) {
        return res.status(400).json({ message: "Appointment date must be within the next 2 days" });
      }
  
      // Find an available doctor of the specified type within the date range
      const doctorResult = await db.query(
        `SELECT id, availability_start_date, availability_end_date, availability_time,type,name
         FROM doctors
         WHERE type = $1 AND $2 BETWEEN availability_start_date AND availability_end_date
         LIMIT 1`,
        [doctorType, appointmentDate]
      );
  
      if (doctorResult.rows.length === 0) {
        return res.status(404).json({ message: "No available doctor found for the specified type and date" });
      }
  
      const doctor = doctorResult.rows[0];
  
      // Create the appointment
      const insertQuery = `
        INSERT INTO appointments (user_id, doctor_id, description, appointment_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;





      const result= await db.query(insertQuery, [userId,doctor.name, doctor.type,doctor.availability_time,doctor.id, description, appointmentDate]);
  
      res.status(200).json({ message: 'Appointment created successfully', appointment: result.rows[0], doctor });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  


// Fetch student details
app.get('/api/students/:id',  async (req, res) => {
  const studentId = req.params.id;
  const stid=parseInt(studentId)
  try {
    const result = await db.query('SELECT st_id, name, contact, course FROM student WHERE st_id = $1', [stid]);
    if (result.rows.length === 0) {
      console.log(`No student found with ID: ${stid}`);
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("hi ")
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update student details
app.patch('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, contact, course } = req.body;
  try {
    const updateQuery = 'UPDATE student SET name = $1, contact = $2, course = $3 WHERE st_id = $4 RETURNING *';
    const result = await db.query(updateQuery, [name, contact, course, studentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }else{
      res.status(200).json({ message: "Student updated successfully", student: result.rows[0] });
    }
    
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete student
// app.delete('/api/students/:id', async (req, res) => {
//   const studentId = req.params.id;
//   try {
//     const result = await db.query('DELETE FROM student WHERE st_id = $1 RETURNING *', [studentId]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.status(200).json({ message: "Student deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting student:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
app.delete('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const stid = parseInt(studentId);

  try {
    // Start transaction
    await db.query('BEGIN');

    // Delete the student record
    const deleteResult = await db.query('DELETE FROM student WHERE st_id = $1', [stid]);

    if (deleteResult.rowCount === 0) {
      // No student was deleted
      await db.query('ROLLBACK');
      return res.status(404).json({ message: "Student not found" });
    }

    // Commit transaction
    await db.query('COMMIT');
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    await db.query('ROLLBACK');
    res.status(500).json({ message: "Internal server error" });
  }
});
// app.delete('/api/items/:id', async (req, res) => {
//   const itemId = req.params.id;
//   const itemIDParsed = parseInt(itemId, 10);

//   try {
//     // Start transaction
//     await db.query('BEGIN');

//     // Delete the item from the database
//     const deleteResult = await db.query('DELETE FROM items WHERE item_id = $1', [itemIDParsed]);

//     if (deleteResult.rowCount === 0) {
//       // No item was deleted, rollback the transaction
//       await db.query('ROLLBACK');
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     // Commit transaction
//     await db.query('COMMIT');
//     res.status(200).json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     // Rollback transaction in case of error
//     await db.query('ROLLBACK');
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
// Fetch all items for admin
app.get('/admin/items', authenticateToken, async (req, res) => {
  try {
      const result = await db.query('SELECT item_id, name, description, status FROM items');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
// Delete an item by ID (admin only)
app.delete('/admin/items/:id', authenticateToken, async (req, res) => {
  const itemId = req.params.id;
  const itemIDParsed = parseInt(itemId, 10);

  try {
      await db.query('BEGIN');
      const deleteResult = await db.query('DELETE FROM items WHERE item_id = $1', [itemIDParsed]);

      if (deleteResult.rowCount === 0) {
          await db.query('ROLLBACK');
          return res.status(404).json({ message: 'Item not found' });
      }

      await db.query('COMMIT');
      res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
      console.error('Error deleting item:', error);
      await db.query('ROLLBACK');
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Update doctor's availability
app.patch('/api/doctors/:id', async (req, res) => {
  const doctorId = parseInt(req.params.id);
  const { availabilityStart, availabilityEnd, availabilityTime } = req.body;

  console.log('Updating doctor:', {
    doctorId,
    availabilityStart,
    availabilityEnd,
    availabilityTime
  });

  try {
    const result = await db.query(
      'UPDATE doctors SET availability_start_date = $1, availability_end_date = $2, availability_time = $3 WHERE id = $4 RETURNING *',
      [availabilityStart, availabilityEnd, availabilityTime, doctorId]
    );

    console.log('Query result:', result);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Create a new doctor
app.post('/api/doctors', async (req, res) => {
  const { name, specialization, availabilityStart, availabilityEnd, availabilityTime } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO doctors (name, type, availability_start_date, availability_end_date, availability_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, specialization, availabilityStart, availabilityEnd, availabilityTime]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/doctor-types', async (req, res) => {
  try {
    // Query to get doctor types from the database
    const result = await db.query('SELECT type FROM doctors');
    
    // Check if any doctor types are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No doctor types found' });
    }
    
    // Send the list of doctor types as JSON response
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.delete('/api/appointments/:id', async (req, res) => {
  const appointmentId = parseInt(req.params.id);

  try {
    const result = await db.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [appointmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/appointments', authenticateToken, async (req, res) => {
  const userId = req.userId; // Assuming the user's ID is available in the request
  try {
    const result = await db.query('SELECT * FROM appointments WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Submit a report
app.post('/reports', authenticateToken, async (req, res) => {
  try {
      const { type, details } = req.body;
      const userId = req.userId;
      const insertQuery = 'INSERT INTO reports (user_id, type, details) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [userId, type, details]);
      res.status(200).json({ success: true, report: result.rows[0] });
  } catch (error) {
      console.error("Error submitting report:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all reports (Admin only)
app.get('/reports', authenticateToken, async (req, res) => {
  try {
      // const userId = req.userId;
      // const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
      // if (userResult.rows[0].role !== 'admin') {
      //     return res.status(403).json({ message: "Access denied" });
      // }
      const result = await db.query('SELECT * FROM reports ');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Update report status (Admin only)
app.patch('/reports/:reportId/status', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const { status } = req.body;
      // const userId = req.userId;
      // const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
      // if (userResult.rows[0].role !== 'admin') {
      //     return res.status(403).json({ message: "Access denied" });
      // }
      const updateQuery = 'UPDATE reports SET status = $1 WHERE report_id = $2 RETURNING *';
      const result = await db.query(updateQuery, [status, reportId]);
      res.status(200).json({ success: true, report: result.rows[0] });
  } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Add comment to a report
app.post('/reports/:reportId/comments', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const { comment } = req.body;
      const userId = req.userId;
      const insertQuery = 'INSERT INTO report_comments (report_id, commenter_id, comment) VALUES ($1, $2, $3) RETURNING *';
      const result = await db.query(insertQuery, [reportId, userId, comment]);
      res.status(200).json({ success: true, comment: result.rows[0] });
  } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch comments for a report
app.get('/reports/:reportId/comments', authenticateToken, async (req, res) => {
  try {
      const { reportId } = req.params;
      const result = await db.query('SELECT * FROM report_comments WHERE report_id = $1 ORDER BY created_at ASC', [reportId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
// Fetch reports for the logged-in user
app.get('/reports/user', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const result = await db.query('SELECT * FROM reports WHERE user_id = $1', [userId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/api/doctor-availabilities',  async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM doctors'); // Modify this query based on your actual table structure
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor availabilities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
})