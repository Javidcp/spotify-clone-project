const Joi = require('joi');


const maxAge = 120;
const today = new Date();
const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
const maxDate = new Date();


const registerSchema = Joi.object({
    username: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    dateOfBirth: Joi.date()
        .iso()
        .greater(minDate)
        .less(maxDate)
        .messages({
            'date.format': 'Date of birth must be in YYYY-MM-DD format.',
            'date.greater': `Date of birth must be after ${minDate.toISOString().split('T')[0]}.`,
            'date.less': 'Date of birth cannot be in the future.'
        })
        .optional(),
    gender: Joi.string().valid('Man', 'Woman', 'Non-binary', 'Something else', 'Prefer not to say').optional(),
    profileImage: Joi.string().uri().optional(),
    referredBy: Joi.string().optional().allow(null)
});


const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
});


const googleAuthSchema = Joi.object({
    credential: Joi.string().required(),
    referredBy: Joi.string().optional().allow(null)
});


const updateProfileSchema = Joi.object({
    username: Joi.string().min(2).max(30).optional(),
    dateOfBirth: Joi.date()
        .iso()
        .greater(minDate)
        .less(maxDate)
        .messages({
            'date.format': 'Date of birth must be in YYYY-MM-DD format.',
            'date.greater': `Date of birth must be after ${minDate.toISOString().split('T')[0]}.`,
            'date.less': 'Date of birth cannot be in the future.'
        })
        .optional(),
    gender: Joi.string().valid('Man', 'Woman', 'Non-binary', 'Something else', 'Prefer not to say').optional(),
    profileImage: Joi.string().uri().optional(),
    isPremium: Joi.boolean().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    googleAuthSchema,
    updateProfileSchema
};
