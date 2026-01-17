import express from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const [[users]] = await db.execute("SELECT COUNT(*) total FROM users");
    const [[stores]] = await db.execute("SELECT COUNT(*) total FROM stores");
    const [[ratings]] = await db.execute("SELECT COUNT(*) total FROM ratings");

    res.json({
      totalUsers: users.total,
      totalStores: stores.total,
      totalRatings: ratings.total
    });
  }
);


router.post(
  "/users",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const { name, email, address, password, role } = req.body;

    const allowedRoles = ["USER", "ADMIN"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)",
      [name, email, address, hash, role]
    );

    res.json({ message: `${role} created successfully` });
  }
);


router.post(
  "/stores",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    await db.execute(
      "INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)",
      [name, email, address, owner_id || null]
    );

    res.json({ message: "Store created successfully" });
  }
);


router.get(
  "/stores",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const [rows] = await db.execute(`
      SELECT 
        s.id,
        s.name,
        s.email,
        s.address,
        IFNULL(AVG(r.rating),0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(rows);
  }
);

router.get(
  "/users",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const { name, email, address, role } = req.query;

    let query = "SELECT id,name,email,address,role FROM users WHERE 1=1";
    let params = [];

    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }
    if (email) {
      query += " AND email LIKE ?";
      params.push(`%${email}%`);
    }
    if (address) {
      query += " AND address LIKE ?";
      params.push(`%${address}%`);
    }
    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    const [rows] = await db.execute(query, params);
    res.json(rows);
  }
);


router.get(
  "/users/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    const userId = req.params.id;

    const [[user]] = await db.execute(
      "SELECT id,name,email,address,role FROM users WHERE id=?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "OWNER") {
      const [[rating]] = await db.execute(`
        SELECT IFNULL(AVG(r.rating),0) AS rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id=?
      `, [userId]);

      user.storeRating = rating.rating;
    }

    res.json(user);
  }
);

export default router;
