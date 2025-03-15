const express = require("express");

const router = express.Router();
const Coupon = require("../models/coupon");
const ClaimHistory = require("../models/claimHistory");


const COOLDOWN_MINUTES = 60;
router.post('/claim', async (req, res) => {
  try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const sessionId = req.cookies?.session_id;

      console.log('Incoming Claim:');
      console.log('IP:', ip);
      console.log('Session ID:', sessionId);

      if (!sessionId) {
          return res.status(400).json({ message: 'No session ID found. Enable cookies.' });
      }

      // Check abuse
      const cooldownMinutes = 60;
      const cooldownDate = new Date(Date.now() - cooldownMinutes * 60 * 1000);

      const recentClaim = await ClaimHistory.findOne({
          $or: [{ ip }, { sessionId }],
          claimedAt: { $gt: cooldownDate }
      });

      if (recentClaim) {
          return res.status(429).json({ message: 'You have already claimed a coupon recently. Try again later.' });
      }

      const coupon = await Coupon.findOneAndUpdate(
          { isClaimed: false, isActive: true },
          {
              isClaimed: true,
              claimedBy: { ip, sessionId, time: new Date() }
          },
          { new: true }
      );

      if (!coupon) {
          return res.status(404).json({ message: 'No coupons available.' });
      }

      await ClaimHistory.create({
          couponCode: coupon.code,
          ip,
          sessionId
      });

      res.json({ message: 'Coupon claimed!', coupon: coupon.code });

  } catch (error) {
      console.error('Claim error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;