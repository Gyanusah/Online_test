const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "institute", "admin"],
      required: true,
    },
    // Institute reference for students
    institute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Institute-specific fields
    instituteName: {
      type: String,
      required: function () {
        return this.role === "institute";
      },
    },
    location: {
      type: String,
      required: function () {
        return this.role === "institute";
      },
    },
    // Student-specific fields
    studentId: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    department: {
      type: String,
    },
    year: {
      type: String,
    },
    preferredLanguage: {
      type: String,
      default: "English",
    },
    subscriptionStatus: {
      type: String,
      enum: ["none", "pending", "active", "expired", "cancelled"],
      default: "none",
    },
    subscriptionAmount: {
      type: Number,
      default: 800,
      min: 600,
      max: 800,
    },
    subscriptionRequestedAt: {
      type: Date,
    },
    subscriptionApprovedAt: {
      type: Date,
    },
    subscriptionApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    referralDiscountAmount: {
      type: Number,
      default: 0,
    },
    activeDeviceId: {
      type: String,
      default: "",
    },
    deviceLastSeenAt: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    lastTransactionId: {
      type: String,
      default: "",
    },
    lastPaymentAt: {
      type: Date,
    },
    pendingSubscription: {
      language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
      },
      languageName: {
        type: String,
        trim: true,
      },
      level: {
        type: String,
        trim: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
      requestedAt: {
        type: Date,
      },
    },
    subscribedLanguages: [
      {
        languageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Language",
          required: true,
        },
        languageName: {
          type: String,
          required: true,
          trim: true,
        },
        level: {
          type: String,
          trim: true,
        },
        subscribedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        expiryDate: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["active", "expired", "cancelled"],
          required: true,
          default: "active",
        },
      },
    ],
    // Teacher-specific fields (now part of institute role)
    employeeId: {
      type: String,
    },
    subjects: [
      {
        type: String,
      },
    ],
    qualifications: [
      {
        type: String,
      },
    ],
    // Common fields
    profilePicture: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user data without password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
