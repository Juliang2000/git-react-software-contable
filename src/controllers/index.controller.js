const pool = require('../database/dbConection');

const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM  usuarios2 ORDER BY id ASC');
    res.status(200).json(response.rows);
};

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const response = await pool.query('SELECT * FROM usuarios2 WHERE id = $1', [id]);
    res.json(response.rows);
    
};

const createUser = async (req, res) => {
    const {id, nombre, correo_electronico,contrasena,roles } = req.body;
    const response = await pool.query('INSERT INTO usuarios2 (nombre, correo_electronico, contrasena,roles) VALUES ( $1, $2 , $3,$4)', [nombre, correo_electronico,contrasena,roles]);
    res.json({
        message: 'User Added successfully',
        body: {
            user: {nombre, correo_electronico,contrasena,roles}
        }
    })
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, correo_electronico,contrasena,roles} = req.body;

    const response =await pool.query('UPDATE usuarios2 SET nombre = $1, correo_electronico = $2, contrasena = $3 ,roles= $4WHERE id = $5', [
        nombre,
         correo_electronico,
         contrasena,
         roles,
        id
    ]);
    res.json('User Updated Successfully');
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM usuarios2 where id = $1', [
        id
    ]);
    res.json(`User ${id} deleted Successfully`);
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};