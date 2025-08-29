import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        trim: true,
        lowercase: true
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es requerido'],
        trim: true
    },
    celular: {
        type: String,
        validate: {
            validator: function(this: any, v: string) {
                return this.googleValidado || (v && v.length > 0);
            },
            message: 'El celular es requerido para registro manual'
        },
        unique: true,
        sparse: true,
        trim: true
    },
    dni: {
        type: String,
        validate: {
            validator: function(this: any, v: string) {
                return this.googleValidado || (v && v.length > 0);
            },
            message: 'El DNI es requerido para registro manual'
        },
        unique: true,
        sparse: true,
        trim: true
    },
    password: {
        type: String,
        validate: {
            validator: function(this: any, v: string) {
                return this.googleValidado || (v && v.length >= 6);
            },
            message: 'La contraseña es requerida y debe tener al menos 6 caracteres para registro manual'
        }
    },
    googleValidado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password) {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcryptjs.compare(candidatePassword, this.password);
};

// Verificar si el modelo ya existe para evitar recompilación
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
