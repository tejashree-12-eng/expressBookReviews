const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Register user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const result = Object.entries(books).filter(([isbn, book]) =>
        book.author.toLowerCase() === req.params.author.toLowerCase()
    );
    if (result.length === 0) return res.status(404).json({ message: "Author not found" });
    return res.status(200).json(Object.fromEntries(result));
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const result = Object.entries(books).filter(([isbn, book]) =>
        book.title.toLowerCase() === req.params.title.toLowerCase()
    );
    if (result.length === 0) return res.status(404).json({ message: "Title not found" });
    return res.status(200).json(Object.fromEntries(result));
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book.reviews || {});
});

// Axios: get all books
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve books" });
    }
});

// Axios: get book by ISBN
public_users.get('/asyncisbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        const book = response.data[req.params.isbn];
        if (!book) return res.status(404).json({ message: "Book not found" });
        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve book" });
    }
});

// Axios: get books by author
public_users.get('/asyncauthor/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        const result = Object.entries(response.data).filter(([isbn, book]) =>
            book.author.toLowerCase() === req.params.author.toLowerCase()
        );
        if (result.length === 0) return res.status(404).json({ message: "Author not found" });
        return res.status(200).json(Object.fromEntries(result));
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve books" });
    }
});

// Axios: get books by title
public_users.get('/asynctitle/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        const result = Object.entries(response.data).filter(([isbn, book]) =>
            book.title.toLowerCase() === req.params.title.toLowerCase()
        );
        if (result.length === 0) return res.status(404).json({ message: "Title not found" });
        return res.status(200).json(Object.fromEntries(result));
    } catch (error) {
        return res.status(500).json({ message: "Unable to retrieve books" });
    }
});

module.exports.general = public_users;
