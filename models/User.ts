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
        required: [true, 'El celular es requerido'],
        unique: true,
        trim: true
    },
    dni: {
        type: String,
        required: [true, 'El DNI es requerido'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    }
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
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
