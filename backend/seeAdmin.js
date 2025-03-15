const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const hashed = await bcrypt.hash('admin123', 10);
        await Admin.create({ username: 'admin', password: hashed });
        console.log('Admin created');
        mongoose.disconnect();
    })
    .catch(console.error);
