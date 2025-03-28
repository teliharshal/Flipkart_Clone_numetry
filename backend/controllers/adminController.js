const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// ✅ Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        console.log("📩 Received Admin Registration Request:", req.body);

        const connection = await pool.getConnection();
        try {
            // ✅ Check if an admin already exists
            const [rows] = await connection.query("SELECT COUNT(*) AS count FROM admin");

            console.log("🔍 Existing admin count:", rows[0].count);
            if (rows[0].count >= 1) {
                return res.status(403).json({ message: "Admin already registered! Only one admin is allowed." });
            }

            // ✅ Hash the password and insert admin
            const hashedPassword = await bcrypt.hash(password, 10);
            await connection.query("INSERT INTO admin(name, email, password) VALUES (?, ?, ?)", 
                [name, email, hashedPassword]);

            console.log("✅ Admin registered successfully!");
            res.status(201).json({ message: "Admin registered successfully!" });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "Server error!" });
    }
};


// ✅ Admin Login
const loginAdmin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ message: "All fields are required!" });
      }

      // ✅ Check if Admin exists in DB
      const sql = "SELECT * FROM admin WHERE email = ?";
      pool.query(sql, [email], async (err, result) => {
          if (err) return res.status(500).json({ message: "Database error!" });

          if (result.length === 0) {
              return res.status(401).json({ message: "Admin not found!" });
          }

          const admin = result[0];
          console.log("🔍 Found Admin:", admin); // Debugging step

          // ✅ Compare Hashed Passwords
          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
              console.log("❌ Password mismatch!"); // Debugging step
              return res.status(401).json({ message: "Invalid credentials!" });
          }

          // ✅ Generate Token
          const token = jwt.sign({ id: admin.id, email: admin.email }, "your_secret_key", { expiresIn: "1h" });
          res.json({ message: "Login successful!", token });
      });

  } catch (error) {
      res.status(500).json({ message: "Server error!" });
  }
};
// ✅ Export Controllers
module.exports = { registerAdmin, loginAdmin };

