//console.log("Hello , NodeJS")
//mongodb+srv://pivisoto:<password>@cluster0.m6wlhnn.mongodb.net/?retryWrites=true&w=majority
const express = require("express")
const app = express()
const jwt = requeire('jsonwebtoken')
app.use(express.json())
const cors = require("cors")
app.use(cors())
const uniqueValidator = require('mongoose-unique-validator')
const mongoose = require ('mongoose')
const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))
const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique:true},
    password: {type:String, requeired:true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)
async function conectarAoMongoDB(){
    await
    mongoose.connect(`mongodb+srv://pivisoto:<password>@cluster0.m6wlhnn.mongodb.net/?retryWrites=true&w=majority`) 
}
const token = jwt.sign(
    {login: login},
    "chave-secreta",
    {expiresIn: '1h'}
)
res.status(200).json({token:token})
//atender uma req GET no endereço http://localhost:3000/hey
app.get('/hey', (req, res) => {
    res.send('hey')
})

app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("up and running")
    }
    catch(e){
        console.log('Erro',e)
    }
})
app.listen(3000, () => console.log("up and running"))
app.get('/filmes',async (req, res) => {
    const filmes = await Filme.find() 
    res.json(filmes)
})

app.post('/filmes',async (req, res) => {
    //obtém os dados enviados pelo cliente
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //monta um objeto agrupando os dados. Ele representa um novo filme
    const filme = new Filme({ titulo: titulo, sinopse: sinopse })
    await filme.save()
    const filmes = await Filme.find()
    res.json(filmes)
})
app.post('/signup', async (req,res) => {
    try{
    const login = req.body.login
    const password = req.body.password
    const criptografada = await bcrypt.hash(password,10)
    const usuario = new Usuario({
        login: login,
        password: password
    })
    const respMongo = await usuario.save()
    console.log(respMongo)
    res.status(201).end()
    }catch(error){
        console.log(error)
        res.status(409).end()
    }
})
app.post('/login',async (req,res) =>{
    const login = req.body.login
    const password = req.body.password
    const u = await Usuario.findOne ({login: req.body.login})
    if(!u){
        return res.status(401).json({mensagem: "login inválido"})
    }
    const senhaValida = await bcrypt.compare(password, u.password)
    if(!senhaValida){
        return res.status(401).json({mensagem:"senha inválida"})
    }
    res.end()
})