const { pool } = require("../config/db");

// 📌 Fetch all users
exports.getAllUsers = (req, res) => {
    pool.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// 📌 Add a new user
exports.addUser = (req, res) => {
    const { name, email, role } = req.body;
    
    if (!name || !email || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    pool.query("INSERT INTO users (name, email, role) VALUES (?, ?, ?)", 
        [name, email, role], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User added successfully", id: result.insertId });
        }
    );
};

// 📌 Update user details
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    pool.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", 
        [name, email, role, id], 
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User updated successfully" });
        }
    );
};

// 📌 Delete a user
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    pool.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User deleted successfully" });
    });
};