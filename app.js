const express = require('express');
const app = express();
const userRoutes = require('./routes/User.js');
const bookRoutes = require('./routes/Book.js');
const computerRoutes = require('./routes/Computer.js');
const categoryRoutes = require('./routes/Category.js');
const imageRoutes = require('./routes/imageRoutes.js');




// Middleware
app.use(express.json());

app.get('/health',(req,res)=>{
    res.status(201).json({
        author:"Aman Qureshi",
        age:27,
        status:"Service is running fine."
    })
})

// Routes
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/computers', computerRoutes);
app.use('/categories', categoryRoutes);
app.use('/images',imageRoutes);


// Centralized Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = app; 