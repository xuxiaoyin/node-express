const express = require('express')

const app = express()

app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/express-test', { useUnifiedTopology: true })
// mongoose.connect('mongodb://localhost:27017/express-test', { useNewUrlParser: true })

const Product = mongoose.model('Product', new mongoose.Schema({
  title: String
}))

// Product.insertMany([
//   { title: '产品1' },
//   { title: '产品2' },
//   { title: '产品3' }
// ])

app.use(require('cors')())

app.use('/', express.static('public'))

app.get('/about', (req, res) => {
  res.send({ page: 'About Us' })
})

app.get('/products', async (req, res) => {
  // const data = await Product.find().skip(1).limit(2)
  // const data = await Product.find().where({
  //   title: '产品2'
  // })
  const data = await Product.find().sort({_id: -1}) // -1 倒序 1 顺序
  res.send(data)
})

app.get('/products/:id', async (req, res) => {
  const data = await Product.findById(req.params.id)
  res.send(data)
})

app.post('/products', async (req, res) => {
  const data = req.body
  const product = await Product.create(data)
  res.send(product)
})

app.put('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  product.title = req.body.title
  await product.save()
  res.send(product)
})

app.delete('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  await product.remove()
  res.send({
    success: true
  })
})

app.listen(3000, () => {
  console.log('App listening on port 3000');
})