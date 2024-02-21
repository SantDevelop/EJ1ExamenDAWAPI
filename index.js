const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const morgan = require("morgan")
const puerto = 3000



const app = express();
app.use(morgan("dev"));

app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.redirect('/datos')
})

app.get('/datos', (req, res) => {
    const datos = JSON.parse(fs.readFileSync('datos.json'))
    res.json(datos)
})


app.post('/datos', async (req, res) => {
    const usernuevo = req.body
    
    const datos = JSON.parse(fs.readFileSync('datos.json'))
    datos.push({"id": datos.length, "name": usernuevo.nombre, "apellido": usernuevo.apellido})
    console.log(usernuevo)
    fs.writeFileSync("datos.json", JSON.stringify(datos))
    res.json(datos)
})



app.put("/datos/:id", (req, res) => {
    const { id } = req.params
    const usernuevo = req.body
    const datos = JSON.parse(fs.readFileSync('datos.json'))
    const usuarioIndex = datos.findIndex((user) => user.id === parseInt(id))
    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "No se encontró al usuario" })
    } else {
        datos[usuarioIndex] = { ...datos[usuarioIndex], ...usernuevo }
    }
    fs.writeFileSync('datos.json', JSON.stringify(datos, null, 2))

    console.log("Usuario modificado correctamente")
    res.json(datos)
})


app.delete("/datos/:id", async (req, res) => {
    const { id } = req.params
    const datos = JSON.parse(fs.readFileSync('datos.json'))
    const usuarioIndex = datos.findIndex((user) => user.id === parseInt(id))
    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "No se encontró al usuario" })
    } else {
        datos.splice(usuarioIndex, 1)
    }
    fs.writeFileSync('datos.json', JSON.stringify(datos, null, 2))

    res.json(datos)
})

app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${ puerto }`)
})