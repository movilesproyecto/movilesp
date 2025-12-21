import React, { createContext, useState, useContext } from 'react';

export const Roles = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
};

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([
        {
            nombre: 'johan palma',
            correo: 'johan11gamerez@gmail.com',
            password: '123456',
            rol: Roles.USER,
            ingreso: '2025-12-10',
            bio: 'Aplicaciones Moviles septimo semestre B',
        },
        {
            nombre: 'admin demo',
            correo: 'admin@demo.com',
            password: 'admin123',
            rol: Roles.ADMIN,
            ingreso: '2025-01-01',
            bio: 'Administrador del sistema',
        },
        {
            nombre: 'root',
            correo: 'root@demo.com',
            password: 'root123',
            rol: Roles.SUPERADMIN,
            ingreso: '2024-01-01',
            bio: 'Superadministrador',
        },
    ]);
    const [departments, setDepartments] = useState([
        { id: '1', name: 'Departamento Centro - A1', address: 'Av. Central 123, Centro', bedrooms: 2, pricePerNight: 45, rating: 4.5, description: 'Acogedor departamento céntrico, ideal para estancias cortas.', amenities: ['WiFi','Cocina','A/C'], images: ['https://images.unsplash.com/photo-1560448071-5bf0a9f7cf0a?w=1200&q=80','https://images.unsplash.com/photo-1560448204-0b9a7a2f6d6a?w=1200&q=80'] },
        { id: '2', name: 'Loft Moderno - B2', address: 'Calle 9 No. 45, Barrio Moderno', bedrooms: 1, pricePerNight: 60, rating: 4.8, description: 'Loft con diseño moderno y vista a la ciudad.', amenities: ['WiFi','TV','Lavadora'], images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80'] },
        { id: '3', name: 'Casa Familiar - C3', address: 'Sector Norte 77, Zona Residencial', bedrooms: 3, pricePerNight: 80, rating: 4.2, description: 'Amplia casa ideal para familias, con jardín.', amenities: ['Cocina','Estacionamiento','Jardín'], images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80','https://images.unsplash.com/photo-1505691723518-36a0b8d4a1f5?w=1200&q=80'] },
    ]);

    const [reservations, setReservations] = useState([
        { id: 'r1', deptId: '1', date: '2025-12-15', time: '10:00', duration: '1h', user: 'johan11gamerez@gmail.com', status: 'confirmed', amount: 45 },
    ]);

    // Ganancias mensuales y estadísticas (solo para SuperAdmin)
    const [monthlyEarnings, setMonthlyEarnings] = useState([
        { month: 'Enero', earnings: 2450, reservations: 12, occupancy: 75 },
        { month: 'Febrero', earnings: 2800, reservations: 14, occupancy: 82 },
        { month: 'Marzo', earnings: 3100, reservations: 16, occupancy: 85 },
        { month: 'Abril', earnings: 2900, reservations: 15, occupancy: 80 },
        { month: 'Mayo', earnings: 3400, reservations: 18, occupancy: 90 },
        { month: 'Junio', earnings: 3200, reservations: 17, occupancy: 88 },
        { month: 'Julio', earnings: 3600, reservations: 19, occupancy: 92 },
        { month: 'Agosto', earnings: 3500, reservations: 18, occupancy: 91 },
        { month: 'Septiembre', earnings: 3100, reservations: 16, occupancy: 85 },
        { month: 'Octubre', earnings: 3300, reservations: 17, occupancy: 89 },
        { month: 'Noviembre', earnings: 3150, reservations: 16, occupancy: 86 },
        { month: 'Diciembre', earnings: 2450, reservations: 12, occupancy: 75 },
    ]);

    // Estadísticas globales del sistema
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        activeReservations: 0,
        totalDepartments: 0,
        averageRating: 0,
        totalEarningsCurrentYear: 0,
    });

    // Registrar un nuevo usuario
    const register = (nombre, correo, password, extras = {}) => {
        // Verificar si el correo ya existe
        const userExists = registeredUsers.some(
            (u) => u.correo.toLowerCase() === correo.toLowerCase()
        );

        if (userExists) {
            return { success: false, message: 'Este correo ya está registrado.' };
        }

        // Si el email coincide con un usuario predefinido, mantener su rol
        const predefinedUser = registeredUsers.find(
            (u) => u.correo.toLowerCase() === correo.toLowerCase()
        );
        const assignedRole = predefinedUser?.rol || Roles.USER;

        // Crear nuevo usuario
        const newUser = {
            nombre,
            correo,
            password,
            rol: assignedRole,
            ingreso: new Date().toISOString().split('T')[0],
            bio: '',
            telefono: extras.telefono || '',
            genero: extras.genero || '',
            // posibles campos futuros: fechaNacimiento, direccion
        };

        setRegisteredUsers([...registeredUsers, newUser]);
        // Hacer login automático con el nuevo usuario
        setUser(newUser);
        return { success: true, message: 'Registro exitoso.' };
    };

    // Login con correo y contraseña
    const loginWithCredentials = (correo, password) => {
        const foundUser = registeredUsers.find(
            (u) => u.correo.toLowerCase() === correo.toLowerCase()
        );

        if (!foundUser) {
            return { success: false, message: 'Correo no encontrado.' };
        }

        if (foundUser.password !== password) {
            return { success: false, message: 'Contraseña incorrecta.' };
        }

        setUser(foundUser);
        return { success: true, message: 'Login exitoso.' };
    };

    // login puede recibir opcionalmente el objeto `navigation` para navegar al Dashboard
    const login = (navigation) => {
        const demoUser = {
            nombre: 'johan palma',
            correo: 'johan11gamerez@gmail.com',
            rol: Roles.USER,
            ingreso: '2025-12-08',
            bio: 'Aplicaciones Moviles septimo semestre B',
        };
        setUser(demoUser);
        // Si se pasa navigation, navegar al stack/dashboards llamado 'Dashboard'
        if (navigation && typeof navigation.navigate === 'function') {
            navigation.navigate('Dashboard');
        }
    };

    const logout = () => {
        setUser(null);
    };

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Role helpers
    const roleOrder = [Roles.USER, Roles.ADMIN, Roles.SUPERADMIN];
    const hasRole = (userObj, requiredRole) => {
        if (!userObj || !userObj.rol) return false;
        const userIndex = roleOrder.indexOf(userObj.rol);
        const reqIndex = roleOrder.indexOf(requiredRole);
        if (userIndex === -1 || reqIndex === -1) return false;
        return userIndex >= reqIndex;
    };
    const isAdmin = (userObj) => hasRole(userObj, Roles.ADMIN);
    const isSuperAdmin = (userObj) => hasRole(userObj, Roles.SUPERADMIN);

    // Permissions map: define capabilities por role
    const permissions = {
        [Roles.USER]: {
            createDepartment: false,
            editDepartment: false,
            deleteDepartment: false,
            createReservation: true,
            editReservation: true,
            deleteReservation: false,
            manageReservations: false,
            manageUsers: false,
            viewReports: false,
            viewSuperAdminStats: false,
        },
        [Roles.ADMIN]: {
            createDepartment: true,
            editDepartment: true,
            deleteDepartment: false,
            createReservation: true,
            editReservation: true,
            deleteReservation: true,
            manageReservations: true,
            manageUsers: true,
            viewReports: true,
            viewSuperAdminStats: false,
        },
        [Roles.SUPERADMIN]: {
            createDepartment: true,
            editDepartment: true,
            deleteDepartment: true,
            createReservation: true,
            editReservation: true,
            deleteReservation: true,
            manageReservations: true,
            manageUsers: true,
            viewReports: true,
            viewSuperAdminStats: true,
        },
    };

    // Generic permission checker
    const canPerform = (userObj, action) => {
        if (!userObj || !userObj.rol) return false;
        const role = userObj.rol;
        const rolePerms = permissions[role] || {};
        return !!rolePerms[action];
    };

    // Specific helpers for common actions
    const canCreateDepartment = (userObj) => canPerform(userObj, 'createDepartment');
    const canEditDepartment = (userObj) => canPerform(userObj, 'editDepartment');
    const canDeleteDepartment = (userObj) => canPerform(userObj, 'deleteDepartment');
    const canCreateReservation = (userObj) => canPerform(userObj, 'createReservation');
    const canEditReservation = (userObj) => canPerform(userObj, 'editReservation');
    const canDeleteReservation = (userObj) => canPerform(userObj, 'deleteReservation');
    const canManageUsers = (userObj) => canPerform(userObj, 'manageUsers');
    const canViewReports = (userObj) => canPerform(userObj, 'viewReports');
    const canApproveReservation = (userObj) => canPerform(userObj, 'manageReservations');
    const canViewSuperAdminStats = (userObj) => canPerform(userObj, 'viewSuperAdminStats');

    // Friendly label for roles
    const roleLabel = (roleOrUser) => {
        const role = typeof roleOrUser === 'string' ? roleOrUser : (roleOrUser && roleOrUser.rol) ? roleOrUser.rol : null;
        switch (role) {
            case Roles.ADMIN:
                return 'Administrador';
            case Roles.SUPERADMIN:
                return 'Superadministrador';
            case Roles.USER:
            default:
                return 'Usuario';
        }
    };

    // Operational functions (mock implementations using local state)
    const createDepartment = (name, address, data = {}) => {
        if (!canCreateDepartment(user)) return { success: false, message: 'No tienes permisos para crear departamentos.' };
        const id = (departments.length + 1).toString();
        const newDept = { 
            id, 
            name, 
            address: address || data.address || '', 
            bedrooms: data.bedrooms || 1,
            pricePerNight: data.pricePerNight || 50,
            description: data.description || '',
            amenities: data.amenities || [],
            images: data.images || [],
            rating: data.rating || 4.0,
        };
        setDepartments((d) => [...d, newDept]);
        return { success: true, data: newDept };
    };

    const editDepartment = (id, updates) => {
        if (!canEditDepartment(user)) return { success: false, message: 'No tienes permisos para editar departamentos.' };
        let updated = null;
        setDepartments((d) => d.map((dep) => {
            if (dep.id === id) { updated = { ...dep, ...updates }; return updated; }
            return dep;
        }));
        return { success: true, data: updated };
    };

    const deleteDepartment = (id) => {
        if (!canDeleteDepartment(user)) return { success: false, message: 'No tienes permisos para eliminar departamentos.' };
        setDepartments((d) => d.filter((dep) => dep.id !== id));
        return { success: true };
    };

    const createReservation = ({ deptId, date, time, duration, paymentMethod, status = 'pending' }) => {
        if (!canCreateReservation(user)) return { success: false, message: 'No tienes permisos para crear reservas.' };
        const id = `r${reservations.length + 1}`;
        
        // Obtener el departamento para el precio
        const dept = departments.find(d => d.id === deptId);
        const amount = dept?.pricePerNight || 0;
        
        const newRes = { 
            id, 
            deptId, 
            date, 
            time, 
            duration, 
            user: user?.correo || 'anon', 
            status: status,
            paymentMethod: paymentMethod || null,
            amount: amount,
            paymentDate: paymentMethod ? new Date().toISOString().split('T')[0] : null,
        };
        setReservations((r) => [...r, newRes]);
        // show snackbar if available
        const message = paymentMethod 
            ? `Reserva confirmada. Pago procesado con ${paymentMethod}`
            : 'Reserva creada y en espera de aprobación';
        if (typeof showSnackbar === 'function') showSnackbar(message);
        return { success: true, data: newRes };
    };

    const editReservation = (id, updates) => {
        if (!canEditReservation(user)) return { success: false, message: 'No tienes permisos para editar reservas.' };
        let updated = null;
        setReservations((r) => r.map((res) => {
            if (res.id === id) { updated = { ...res, ...updates }; return updated; }
            return res;
        }));
        return { success: true, data: updated };
    };

    const deleteReservation = (id) => {
        if (!canDeleteReservation(user)) return { success: false, message: 'No tienes permisos para eliminar reservas.' };
        setReservations((r) => r.filter((res) => res.id !== id));
        return { success: true };
    };

    // User management (admin-level)
    const addUser = ({ nombre, correo, password, rol = Roles.USER }) => {
        if (!canManageUsers(user)) return { success: false, message: 'No tienes permisos para gestionar usuarios.' };
        // Sólo Superadmin puede crear/asignar el rol SUPERADMIN
        if (rol === Roles.SUPERADMIN && !isSuperAdmin(user)) return { success: false, message: 'Solo Superadmin puede crear usuarios Superadmin.' };
        const exists = registeredUsers.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
        if (exists) return { success: false, message: 'El correo ya existe.' };
        const newU = { nombre, correo, password, rol, ingreso: new Date().toISOString().split('T')[0], bio: '' };
        setRegisteredUsers((s) => [...s, newU]);
        return { success: true, data: newU };
    };

    const removeUser = (correo) => {
        if (!canManageUsers(user)) return { success: false, message: 'No tienes permisos para eliminar usuarios.' };
        setRegisteredUsers((s) => s.filter((u) => u.correo.toLowerCase() !== correo.toLowerCase()));
        // If removing current user, also logout
        if (user?.correo?.toLowerCase() === correo?.toLowerCase()) setUser(null);
        return { success: true };
    };

    const changeUserRole = (correo, newRole) => {
        // Only superadmin can assign SUPERADMIN; admins can assign up to ADMIN
        if (!canManageUsers(user)) return { success: false, message: 'No tienes permisos para cambiar roles.' };
        if (newRole === Roles.SUPERADMIN && !isSuperAdmin(user)) return { success: false, message: 'Solo Superadmin puede asignar Superadmin.' };
        let changed = null;
        setRegisteredUsers((s) => s.map((u) => {
            if (u.correo.toLowerCase() === correo.toLowerCase()) { changed = { ...u, rol: newRole }; return changed; }
            return u;
        }));
        // If changing current user's role, update session
        if (user?.correo?.toLowerCase() === correo.toLowerCase()) setUser((u) => ({ ...u, rol: newRole }));
        return { success: true, data: changed };
    };

    // Update user profile fields in registeredUsers and current session
    const updateUserProfile = (correo, updates = {}) => {
        let changed = null;
        setRegisteredUsers((s) => s.map((u) => {
            if (u.correo.toLowerCase() === correo.toLowerCase()) { changed = { ...u, ...updates }; return changed; }
            return u;
        }));
        if (user?.correo?.toLowerCase() === correo.toLowerCase()) {
            setUser((u) => ({ ...u, ...updates }));
        }
        return { success: true, data: changed };
    };

    // Approve / reject reservations
    const approveReservation = (id) => {
        if (!canApproveReservation(user)) return { success: false, message: 'No tienes permisos para aprobar reservas.' };
        let updated = null;
        setReservations((r) => r.map((res) => {
            if (res.id === id) { updated = { ...res, status: 'approved' }; return updated; }
            return res;
        }));
        if (typeof showSnackbar === 'function') showSnackbar('Reserva aprobada');
        return { success: true, data: updated };
    };

    const rejectReservation = (id, reason = '') => {
        if (!canApproveReservation(user)) return { success: false, message: 'No tienes permisos para rechazar reservas.' };
        let updated = null;
        setReservations((r) => r.map((res) => {
            if (res.id === id) { updated = { ...res, status: 'rejected', reason }; return updated; }
            return res;
        }));
        if (typeof showSnackbar === 'function') showSnackbar('Reserva rechazada');
        return { success: true, data: updated };
    };

    // Snackbar utilities (global in context)
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const showSnackbar = (msg, duration = 3000) => {
        setSnackbarMessage(msg);
        setSnackbarVisible(true);
        setTimeout(() => setSnackbarVisible(false), duration);
    };


    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                isDarkTheme: isDarkMode,
                setIsDarkMode,
                toggleTheme,
                login,
                logout,
                register,
                loginWithCredentials,
                Roles,
                hasRole,
                isAdmin,
                isSuperAdmin,
                permissions,
                canPerform,
                canCreateDepartment,
                canEditDepartment,
                canDeleteDepartment,
                createDepartment,
                editDepartment,
                deleteDepartment,
                canCreateReservation,
                canEditReservation,
                canDeleteReservation,
                createReservation,
                editReservation,
                deleteReservation,
                canManageUsers,
                canViewReports,
                canApproveReservation,
                canViewSuperAdminStats,
                approveReservation,
                rejectReservation,
                departments,
                reservations,
                monthlyEarnings,
                systemStats,
                snackbarVisible,
                snackbarMessage,
                showSnackbar,
                setSnackbarVisible,
                roleLabel,
                registeredUsers,
                addUser,
                removeUser,
                changeUserRole,
                updateUserProfile,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}

export default AppContext;