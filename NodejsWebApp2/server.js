'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// массив для хранения данных
let products = [];

// путь для получения списка всех продуктов
app.get('/products', (req, res) => {
    res.json(products);
});

// путь для получения информации о продукте по ID
app.get('/products/:id', (req, res) => {
    const productId = Number(req.params.id); // id в число
    const product = products.find(product => product.id === productId);
    if (!product) {
        res.status(404).json({ error: 'product not found' });
    } else {
        res.json(product);
    }
});

// путь для добавления нового продукта
app.post('/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length; 
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// путь для обновления информации о продукте 
app.put('/products/:id', (req, res) => {
    const productId = Number(req.params.id); // id в число
    const updatedProduct = req.body;
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        res.status(404).json({ error: 'product not found' });
    } else {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        res.json(products[productIndex]);
    }
});
// путь для удаления 
app.delete('/products/dell/:id', (req, res) => {
    const productId = Number(req.params.id); // id в число
    const productIndex = products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
        res.status(404).json({ error: 'product not found' });
    } else {
        const deletedProduct = products.splice(productIndex, 1);
        res.json(deletedProduct[0]);
    }
});

app.listen(3000, () => console.log('Server started'));

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Omega API\n');
}).listen(port);
