const multer = require('multer');
const path = require('path');
const pool = require('../configuracion/baseDatosPostgres');
const fs = require('fs');
const ruta =path.join(__dirname, '../../productos');

const pages =[
  {direction:ruta,name:"productos"}
]
for(const page of pages){
    if(!fs.existsSync(page.direction)){
        fs.mkdirSync(page.direction, { recursive: true });
        console.log(`Carpeta creada: ${page.name}`);
    }
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ruta);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});


exports.upload = multer({storage});






exports.crearProduct = async(req,res) =>{

 const {
    nombre,
    precio,
    categoria,
    stock
    
 } = req.body;

 try {
   let productId;
   const buscarProduct =await pool.query("select p.* from productos p where p.nombre =$1",[nombre]);
   if(buscarProduct.rows.length >0){
     await pool.query("update productos set stock = stock + $1 where id = $2", [stock,buscarProduct.rows[0].id]);
     productId = buscarProduct.rows[0].id;
   }else{
    const newProduct = await pool.query(
        "insert into productos (nombre,precio,categoria,stock) values ($1,$2,$3,$4) returning id",
        [nombre,precio,categoria,stock]
    )
    productId = newProduct.rows[0].id
  }
    if(req.files&&req.files.length>0){
        const imagenes = req.files.map(file => file.filename);
        for(const images of imagenes){
            await pool.query(
                "insert into productos_imagenes ( nombre_archivo,producto_id) values ($1,$2)",
                [`productos/${images}`,productId]
            )
        }
        
    }

    res.status(201).json({ mensaje: 'Producto creado correctamente', id: productId });
 } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el producto', error: error.message });
    
 }



}
/*
exports.obtenerProductos = async (req, res) => {
    try {
      const productos = await pool.query('SELECT p.*, i.nombre_archivo FROM productos p LEFT JOIN productos_imagenes i ON p.id = i.producto_id ORDER BY p.id,i.id asc');
      const productsFiles ={};
      for(const product of productos.rows){
         if(!productsFiles[product.id]){
            productsFiles[product.id] ={
                id:product.id,
                nombre:product.nombre,
                precio:product.precio,
                categoria:product.categoria,
                stock:product.stock,
                imagenes:[]
            };
         }
         if(product.nombre_archivo){
            productsFiles[product.id].imagenes.push(product.nombre_archivo);
         }
      }
      const products = Object.values(productsFiles);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
  };

*/


exports.obtenerProductos = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        p.id,
        p.nombre,
        p.precio,
        p.stock,
        p.categoria,
        COALESCE(
          json_agg(i.nombre_archivo ORDER BY i.id)
            FILTER (WHERE i.nombre_archivo IS NOT NULL),
          '[]'
        ) AS imagenes
      FROM productos p
      LEFT JOIN productos_imagenes i 
        ON p.id = i.producto_id
      GROUP BY 
        p.id, p.nombre, p.precio, p.stock, p.categoria
      ORDER BY p.id;
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los productos' });
  }
};


exports.obtenerProducto =async(req,res)=>{
    const {id} = req.params;
    try {
        const product = await pool.query('SELECT p.*, i.nombre_archivo FROM productos p LEFT JOIN productos_imagenes i ON p.id = i.producto_id WHERE p.id = $1 ORDER BY p.id asc', [id]);
        if(product.rows.length === 0){
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
       const producto ={
            id:product.rows[0].id,
            nombre:product.rows[0].nombre,
            precio:product.rows[0].precio,
            categoria:product.rows[0].categoria,
            stock:product.rows[0].stock,
            imagenes:[]
        };
        for(const image of product.rows){
            if(image.nombre_archivo){
                producto.imagenes.push(image.nombre_archivo);
            }
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
}



exports.eliminarProducto = async (req, res) => {
    const {id} = req.params;
    try {
        const productsImages = await pool.query("select nombre_archivo from productos_imagenes where producto_id = $1", [id]);
        for(const image of productsImages.rows){
            const ruta = path.join(__dirname,"../../",image.nombre_archivo)
            if(fs.existsSync(ruta)){
                await fs.promises.unlink(ruta);
            }
        }
       const products = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.status(200).json({ mensaje: 'Producto eliminado correctamente',products });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
}


exports.updateProducts =async(req,res)=>{
    const {id} = req.params;
    let {
        nombre,
        precio,
        categoria,
        stock,
        imagenesConservar
    } = req.body;
    try {
        const products = await pool.query('UPDATE productos SET nombre = $1,precio = $2,categoria = $3 ,stock = $4 WHERE id = $5 RETURNING *', [nombre,precio,categoria,stock,id]);
        if(!Array.isArray(imagenesConservar)){
            imagenesConservar = [imagenesConservar] || [];
        }

        const imagenesActuales = await pool.query("select nombre_archivo from productos_imagenes where producto_id = $1", [id]);

       const imagenesConservaran = new Set(imagenesConservar);
        const imagenesEliminar = imagenesActuales.rows.filter((image)=> !imagenesConservaran.has(image.nombre_archivo))

        for(const image of imagenesEliminar){
            const ruta = path.join(__dirname,"../../",image.nombre_archivo);
            if(fs.existsSync(ruta)){
                await fs.promises.unlink(ruta);
                
            }
            await pool.query("delete from productos_imagenes where producto_id = $1 and nombre_archivo = $2", [id,image.nombre_archivo]);
        }

        if(req.files && req.files.length > 0){
            for(const image of req.files){
                await pool.query("insert into productos_imagenes ( nombre_archivo,producto_id) values ($1,$2)", [`productos/${image.filename}`,id]);
            }
        }
        
        res.status(200).json({ mensaje: 'Producto actualizado correctamente',products });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
}
/*
exports.productsCategoriSelec = async (req, res) => {
  const {categoris} = req.params;
   console.log('Categoris from query:', categoris); // Verifica que se reciba correctamente

  try {


    
  if (!categoris) {
    return res.status(400).json({
      mensaje: "No se enviaron categorías"
    });
  }
    
    const products = await pool.query(
      `SELECT p.*, i.nombre_archivo FROM productos p LEFT JOIN productos_imagenes i ON p.id = i.producto_id WHERE p.categoria = $1 ORDER BY p.id asc`,
      [categoris]
    );
    
    console.log('Products from database:', products.rows); // Verifica qué datos se reciben

    if (products.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const productsVisible = {};

    for (const product of products.rows) {
      if (!productsVisible[product.id]) {
        productsVisible[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          categoria: product.categoria,
          imagenes: []
        };
      }

      if (product.nombre_archivo) {
        productsVisible[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    res.status(200).json(Object.values(productsVisible));
  } catch (error) {
    console.error('Error in backend:', error.message); // Verifica el error
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};
*/


exports.productsCategoriSelec = async (req, res) => {
  const { categoris } = req.query;

  try {
    if (!categoris) {
      return res.status(400).json({
        mensaje: "No se enviaron categorías"
      });
    }

    // 🔹 Convertir a números
    const ids = categoris.split(',');

    console.log("IDs recibidos:", ids);
   
    const products = await pool.query(
      `
      SELECT p.*, i.nombre_archivo
      FROM productos p
      LEFT JOIN productos_imagenes i ON p.id = i.producto_id
      WHERE p.categoria = ANY($1)
      ORDER BY p.id ASC
      `,
      [ids]
    );

    const productsVisible = {};

    for (const product of products.rows) {
      if (!productsVisible[product.id]) {
        productsVisible[product.id] = {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          categoria: product.categoria,
          stock: product.stock,
          imagenes: []
        };
      }

      if (product.nombre_archivo) {
        productsVisible[product.id].imagenes.push(product.nombre_archivo);
      }
    }

    res.status(200).json(Object.values(productsVisible));
  } catch (error) {
    console.error("Error backend:", error);
    res.status(500).json({
      mensaje: "Error al obtener los productos",
      error: error.message
    });
  }
};

exports.obtenerProductosSearch = async (req, res) => {
  const {search} = req.params
    try {
      const products = await pool.query('SELECT p.*, (select nombre_archivo from productos_imagenes where producto_id = p.id order by id asc limit 1) as imagen  FROM productos p  where lower(p.nombre) like lower($1) ORDER BY p.id asc limit 3',[`%${search}%`]);
      
      
      
      res.status(200).json(products.rows);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
  };



exports.productsSelect = async (req, res) => {
  const { productsId } = req.query;

  try {
    if (!productsId) {
      return res.status(400).json({ mensaje: "No se enviaron productos" });
    }

    const ids = productsId.split(",").map(id => parseInt(id));

    const products = await pool.query(
      `SELECT p.*, i.nombre_archivo
       FROM productos p
       LEFT JOIN productos_imagenes i ON p.id = i.producto_id
       WHERE p.id = ANY($1)
       ORDER BY p.id ASC`,
      [ids]
    );

    const mapProducts = new Map();

    for (const product of products.rows) {
      if (!mapProducts.has(product.id)) {
        mapProducts.set(product.id, {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          categoria: product.categoria,
          stock: product.stock,
          imagenes: []
        });
      }

      if (product.nombre_archivo) {
        mapProducts.get(product.id).imagenes.push(product.nombre_archivo);
      }
    }

    const productsVisible = Array.from(mapProducts.values());

    res.status(200).json(productsVisible);
  } catch (error) {
    console.error("Error backend:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener los productos",
      error: error.message
    });
  }
};

exports.obtenerProductosSearchAll = async (req, res) => {
  const {search} = req.params
    try {
      const products = await pool.query('SELECT p.*, ip.nombre_archivo FROM productos p join productos_imagenes ip on p.id = ip.producto_id  where lower(p.nombre) like lower($1) ORDER BY p.id asc',[`%${search}%`]);
      
      const productsFiles ={};

      for(const product of products.rows){
        if(!productsFiles[product.id]){
          productsFiles[product.id] ={
            id:product.id,
            nombre:product.nombre,
            precio:product.precio,
            categoria:product.categoria,
            stock:product.stock,
            imagenes:[]
          }
        }
        if(product.nombre_archivo){
          productsFiles[product.id].imagenes.push(product.nombre_archivo)
        }
      }
      const productsConvertidos = Object.values(productsFiles);
      res.status(200).json(productsConvertidos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
  };

  /*
  SELECT
  p.id,
  p.nombre,
  p.precio,
  p.cantidad_disponible,
  p.categoria,
  c.nombre AS categoria_nombre,
  p.tipo,
  t.nombre AS tipo_nombre,
  p.discount,
  p.etiqueta,

  COALESCE(
    JSON_AGG(DISTINCT img.nombre_archivo)
      FILTER (WHERE img.nombre_archivo IS NOT NULL),
    '[]'::json
  ) AS imagenes,

  COALESCE(
    JSON_AGG(DISTINCT vid.nombre_archivo)
      FILTER (WHERE vid.nombre_archivo IS NOT NULL),
    '[]'::json
  ) AS videos

FROM productos p
JOIN categoria c ON p.categoria = c.id
LEFT JOIN tipo t ON p.tipo = t.id
LEFT JOIN imagenes_productos img ON img.producto_id = p.id
LEFT JOIN videos_productos vid ON vid.producto_id = p.id

GROUP BY p.id, c.nombre, t.nombre
ORDER BY p.id;

SELECT
  p.id,
  p.nombre,
  p.precio,
  p.cantidad_disponible,
  p.categoria,
  c.nombre AS categoria_nombre,
  p.tipo,
  t.nombre AS tipo_nombre,
  p.discount,
  p.etiqueta,
  COALESCE(img.imagenes, '[]'::json) AS imagenes,
  COALESCE(vid.videos, '[]'::json) AS videos

FROM productos p
JOIN categoria c ON p.categoria = c.id
LEFT JOIN tipo t ON p.tipo = t.id

LEFT JOIN (
  SELECT producto_id,
         JSON_AGG(DISTINCT nombre_archivo) AS imagenes
  FROM imagenes_productos
  GROUP BY producto_id
) img ON img.producto_id = p.id

LEFT JOIN (
  SELECT producto_id,
         JSON_AGG(DISTINCT nombre_archivo) AS videos
  FROM videos_productos
  GROUP BY producto_id
) vid ON vid.producto_id = p.id

ORDER BY p.id;


  
  
  
  
  
  
  
  */ 