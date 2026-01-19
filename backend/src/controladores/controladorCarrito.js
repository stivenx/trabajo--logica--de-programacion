
const pool = require('../configuracion/baseDatosPostgres'); // Importa directamente el pool

// Crear carrito
exports.crearCarrito = async (req, res) => {
    const { user_id, product_id,quantity} = req.body;

    try {
        // Verificar si el usuario existe en PostgreSQL
        const usuarioResult = await pool.query('SELECT * FROM usuarios WHERE id = $1', [user_id]);
        if (usuarioResult.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado en PostgreSQL' });
        }

        const product = await pool.query('SELECT * FROM productos WHERE id = $1', [product_id]);
        // Verificar que la cantidad sea válida
        
       if(product.rows[0].stock < quantity){
        return res.status(400).json({ mensaje: 'La cantidad no es valida' });
       }
       let cardId 
        // Verificar si ya existe un carrito para el usuario
        const cart = await pool.query('SELECT * FROM carrito WHERE user_id = $1', [user_id]);

        if (cart.rows.length > 0) {
           cardId = cart.rows[0].id
        } else{
            const newCart = await pool.query('INSERT INTO carrito (user_id) VALUES ($1) RETURNING id', [user_id]);
            cardId = newCart.rows[0].id
        }

        const existinPorduct = await pool.query('SELECT * FROM carrito_productos WHERE cart_id = $1 AND producto_id = $2', [cardId, product_id]);
        if (existinPorduct.rows.length > 0) {
            await pool.query('UPDATE carrito_productos SET quantity = quantity + $1 WHERE cart_id = $2 AND producto_id = $3', [quantity, cardId, product_id]);
        }else{
    
        const nuevoCarrito = await pool.query(
            'INSERT INTO carrito_productos (cart_id, producto_id,quantity) VALUES ($1, $2,$3) RETURNING *',
            [cardId, product_id,quantity]
        );
        }
        
        await pool.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [quantity, product_id]);
        res.status(201).json({ mensaje: 'Carrito creado', carrito: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el carrito', error: error.message });
    }
};




// Obtener carrito
exports.obtenerCarrito = async (req, res) => {
    const { usuario_id } = req.params;


    try {
        const carrito = await pool.query(
            'SELECT cp.producto_id, p.nombre,c.id as cart_id ,p.precio, cp.quantity,(select nombre_archivo from productos_imagenes where producto_id = p.id order by id asc limit 1) as imagen  FROM carrito_productos cp JOIN productos p ON cp.producto_id = p.id join carrito c on c.id = cp.cart_id WHERE c.user_id = $1',
            [usuario_id]
        )
    
        res.status(200).json(carrito.rows);
      } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el carrito', error: error.message });
      }
    };

// Actualizar carrito
exports.actualizarCarrito = async (req, res) => {
    const { cardId, product_id, quantity } = req.body;

    try {
        const cartObjet = await pool.query("select * from carrito_productos where cart_id = $1 and producto_id = $2", [cardId,product_id]);
        const cantidad = cartObjet.rows[0].quantity

       if(quantity > cantidad){
         const cantidadEXtra = quantity - cantidad
         const product = await pool.query("select * from productos where id = $1", [product_id]);
         if(product.rows[0].stock < cantidadEXtra){
            return res.status(400).json({ mensaje: 'La cantidad no es suficiente' });
         }
         await pool.query("update productos set stock = stock - $1 where id = $2", [cantidadEXtra,product_id]);
       }else{
        const cantidadDevolver = cantidad - quantity
        await pool.query("update productos set stock = stock + $1 where id = $2", [cantidadDevolver,product_id]);
       }

       const carrito = await pool.query("update carrito_productos set quantity = $1 where cart_id = $2 and producto_id = $3", [quantity, cardId, product_id]);

        res.status(200).json({ mensaje: 'Carrito actualizado', carrito });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el carrito', error: error.message });
    }
};

// Eliminar carrito
exports.eliminarCarrito = async (req, res) => {
    const {cardId,product_id } = req.params;

    try {
       const cart = await pool.query("select * from carrito_productos where cart_id = $1 and producto_id = $2", [cardId,product_id]);
       const cantidad = cart.rows[0].quantity
       await pool.query("update productos set stock = stock + $1 where id = $2", [cantidad,product_id]);
        await pool.query("delete from carrito_productos where cart_id = $1 and producto_id = $2", [cardId,product_id]); 

        res.status(200).json({ mensaje: 'Carrito eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el carrito', error: error.message });
    }
};

exports.vaciarCarrito = async (req, res) => {
    const {cardId } = req.params;
    try {
        const cart = await pool.query("select * from carrito_productos where cart_id = $1", [cardId]);
        for(const product of cart.rows){
            await pool.query("update productos set stock = stock + $1 where id = $2", [product.quantity,product.producto_id]);
        }
        await pool.query("delete from carrito_productos where cart_id = $1", [cardId]);
        res.status(200).json({ mensaje: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al vaciar el carrito', error: error.message });
        
    }
}