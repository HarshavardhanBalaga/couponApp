const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Coupon = require('../models/coupon');
const ClaimHistory = require('../models/claimHistory');
const adminAuth = require('../middlewares/auth');



router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/coupons', adminAuth, async (req, res) => {
    const coupons = await Coupon.find().sort({ _id: 1 });
    res.json(coupons);
});

router.post('/coupons', adminAuth, async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Coupon code is required' });
    }

    try {
        const existing = await Coupon.findOne({ code });
        if (existing) {
            return res.status(409).json({ message: 'Coupon already exists' });
        }

        const newCoupon = new Coupon({ code });
        await newCoupon.save();

        res.status(201).json({ message: 'Coupon added', coupon: newCoupon });
    } catch (err) {
        res.status(500).json({ message: 'Error adding coupon' });
    }
});

router.put('/coupons/:id', adminAuth, async (req, res) => {
    const { code } = req.body;

    try {
        const updated = await Coupon.findByIdAndUpdate(
            req.params.id,
            { code },
            { new: true }
        );
        res.json({ message: 'Coupon updated', coupon: updated });
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
});

router.patch('/coupons/:id/toggle', adminAuth, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ message: 'Coupon toggled', isActive: coupon.isActive });
    } catch (err) {
        res.status(500).json({ message: 'Toggle failed' });
    }
});

router.get('/claims', adminAuth, async (req, res) => {
    try {
        const history = await ClaimHistory.find().sort({ claimedAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch claim history' });
    }
});


module.exports = router