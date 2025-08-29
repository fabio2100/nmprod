import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        // Obtener los datos del body
        const body = await request.json();
        const { email, nombreCompleto, celular, dni, password } = body;

        // Validar que todos los campos estén presentes
        if (!email || !nombreCompleto || !celular || !dni || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Verificar si ya existe un usuario con el mismo email, celular o dni
        const existingUser = await User.findOne({
            $or: [
                { email },
                { celular },
                { dni }
            ]
        });

        if (existingUser) {
            // Determinar qué campo está duplicado
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: 'El email ya está registrado' },
                    { status: 400 }
                );
            }
            if (existingUser.celular === celular) {
                return NextResponse.json(
                    { error: 'El celular ya está registrado' },
                    { status: 400 }
                );
            }
            if (existingUser.dni === dni) {
                return NextResponse.json(
                    { error: 'El DNI ya está registrado' },
                    { status: 400 }
                );
            }
        }

        // Crear el nuevo usuario
        const user = await User.create({
            email,
            nombreCompleto,
            celular,
            dni,
            password,
            googleValidado: false
        });

        return NextResponse.json(user, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Error al crear el usuario' },
            { status: 500 }
        );
    }
}
