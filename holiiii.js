const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const auth = require("../middleware/auth");
//const User = require("../models/userModel");
const pool = require('../database/dbConection');

router.post("/register", async (req, res) => {
  try {
   
    let { id, nombre,correo_electronico,  contrasena, passwordCheck,roles} = req.body;
    console.log("LLEGA"+id+nombre+contrasena);
    // validar campos

    if (!nombre || !contrasena || !passwordCheck)
      return res.status(400).json({ msg: "No ha ingresado todos los campos necesarios." });
    if (contrasena.length < 5)
      return res
        .status(400)
        .json({ msg: "La contraseña debe tener al menos 5 caracteres." });
    if (contrasena !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Ingrese la misma contraseña dos veces para verificación." });

    /*const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });*/

   // if (!displayName) displayName = nombre;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(contrasena, salt);

    const newUser = {
      id,
      nombre, 
      correo_electronico,
      contrasena: passwordHash
      
    };
    console.log(newUser);
    const response = await pool.query('INSERT INTO usuarios2 (nombre, correo_electronico, contrasena,roles) VALUES ($1, $2, $3 , $4)',
     [nombre, correo_electronico,passwordHash,roles]);
     console.log(response);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // validate
    if (!correo || !contrasena)
      return res.status(400).json({ msg: "No ha ingresado todos los campos necesarios." });

    //const user = await User.findOne({ nombre: nombre });
    const user = await await pool.query(`SELECT * FROM usuarios2 WHERE correo_electronico = $1`,
      [correo]);
      console.log(user);
    /*if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this nombre has been registered." });*/

    const isMatch = await bcrypt.compare(contrasena, "$2a$10$VtebWqTVvQ/2sNio0JxssOsOTidyPaGHXC0vxpUcba8KX00JCdDFu");
    if (!isMatch) return res.status(400).json({ msg: "Credenciales inválidas" });
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
   
    res.json({
      token,
      //Se retorna Objeto usuario
      /*user: {
        id: user._id,
        displayName: user.displayName,
      },*/
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);
    console.log("llega");
    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    console.log("llega2");
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.displayName,
    id: user._id,
  });
});*/

module.exports = router;
