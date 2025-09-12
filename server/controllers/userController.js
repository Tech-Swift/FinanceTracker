const User = require('../models/User');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');

exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body || {};

  // Optional: Check for empty fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password, role: 'user' });
    await user.save();

    res.status(201).json({ message: 'SignUp Successful' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Compare the input password with the one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists to prevent info leaks
      return res.status(200).json({ message: "If that email is registered, a reset link will be sent." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;

    await user.save();

    // Normally send via email here (nodemailer, SendGrid, etc.)
    // For now, just return token in response (not secure for prod)
    res.json({
      message: "Password reset link generated",
      resetLink: `http://localhost:3000/reset-password/${resetToken}`
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// RESET PASSWORD (using token)
// =======================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // check expiry
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

   user.password = newPassword;

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();  

    res.json({ message: "Password has been reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserProfile = (req, res) => {
  if (req.user) {
    const { _id, name, email, role, phone } = req.user;
    res.status(200).json({ id: _id, name, email, role, phone });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


