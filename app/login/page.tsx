'use client';

import { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Divider
} from '@mui/material';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { signIn } from 'next-auth/react';
import Google from '@mui/icons-material/Google';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombreCompleto: '',
        celular: '',
        dni: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        celular: '',
    });

    // Validación de email
    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // Validación de número de teléfono
    const validatePhone = (phone: string) => {
        try {
            const phoneNumber = parsePhoneNumberFromString(phone, 'AR');
            return phoneNumber?.isValid() || false;
        } catch (error) {
            return false;
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Validar email
        if (name === 'email') {
            if (!validateEmail(value)) {
                setErrors(prev => ({
                    ...prev,
                    email: 'Email inválido'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    email: ''
                }));
            }
        }

        // Validar celular
        if (name === 'celular') {
            if (!validatePhone(value)) {
                setErrors(prev => ({
                    ...prev,
                    celular: 'Número de teléfono inválido'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    celular: ''
                }));
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validar todos los campos antes de enviar
        if (!validateEmail(formData.email)) {
            setErrors(prev => ({
                ...prev,
                email: 'Email inválido'
            }));
            return;
        }

        if (!validatePhone(formData.celular)) {
            setErrors(prev => ({
                ...prev,
                celular: 'Número de teléfono inválido'
            }));
            return;
        }
        
        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Usuario registrado exitosamente');
                // Limpiar el formulario después del registro exitoso
                setFormData({
                    email: '',
                    password: '',
                    nombreCompleto: '',
                    celular: '',
                    dni: '',
                });
            } else {
                const data = await response.json();
                alert(data.error || 'Error al registrar usuario');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Registro de Usuario
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nombreCompleto"
                            label="Nombre Completo"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="celular"
                            label="Celular (Formato: +54 9 11 1234-5678)"
                            name="celular"
                            value={formData.celular}
                            onChange={handleChange}
                            error={!!errors.celular}
                            helperText={errors.celular}
                            placeholder="+54 9 11 1234-5678"
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="dni"
                            label="DNI"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrarse
                        </Button>

                        <Divider sx={{ my: 2 }}>O</Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            onClick={() => signIn('google')}
                            sx={{ mt: 1 }}
                        >
                            Continuar con Google
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
