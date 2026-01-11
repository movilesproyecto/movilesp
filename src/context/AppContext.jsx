import React, { createContext, useState, useContext } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { API_URL } from '../service/apiClient';

export const Roles = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
};

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [userRatings, setUserRatings] = useState({});
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
    const [departments, setDepartments] = useState([]);
    const [authToken, setAuthToken] = useState(null);

    const [favorites, setFavorites] = useState(['2', '4', '7', '9']);

    useEffect(() => {
        // fetch departments from backend API on mount (using apiClient)
        async function load() {
            try {
                const res = await apiClient.get('/departments');
                const data = res?.data?.data || res?.data;
                if (!data) return; // keep defaults if error
                // Manejar tanto formato paginado como array directo
                const depts = Array.isArray(data) ? data : (data.data || []);
                // ensure id is string and basic defaults
                setDepartments((depts || []).map(d => ({
                    id: String(d.id),
                    name: d.name || '',
                    address: d.address || '',
                    bedrooms: d.bedrooms ?? 1,
                    pricePerNight: (d.price_per_night || d.pricePerNight) ?? 50,
                    rating: (d.rating_avg || d.rating) ?? 4.0,
                    description: d.description || '',
                    amenities: d.amenities || [],
                    images: d.images || [],
                })));
            } catch (e) {
                // ignore - keep empty or seeded UI
            }
        }
        load();
    }, []);

    useEffect(() => {
        // load token if present
        async function loadToken(){
            try{
                const t = await AsyncStorage.getItem('token');
                if (t) setAuthToken(t);
            }catch(e){ }
        }
        loadToken();
    }, []);

    // Cargar datos del usuario autenticado
    const loadUserProfile = async () => {
        if (!authToken) return;
        try {
            const res = await apiClient.get('/auth/me');
            const userData = res.data;
            setUser({
                id: userData.id,
                nombre: userData.name,
                correo: userData.email,
                rol: userData.role || Roles.USER,
                bio: userData.bio || '',
                telefono: userData.phone || '',
                genero: userData.gender || '',
            });
        } catch (e) {
            console.error('[AUTH] Error loading profile:', e.message);
        }
    };

    // Cargar favoritos del usuario
    const loadUserFavorites = async () => {
        if (!authToken) return;
        try {
            const res = await apiClient.get('/departments');
            const data = res?.data?.data || res?.data;
            const depts = Array.isArray(data) ? data : (data.data || []);
            // Obtener IDs de favoritos del usuario
            const favorited = depts
                .filter(d => d.favorited_by && Array.isArray(d.favorited_by) && d.favorited_by.some(fav => fav.id === user?.id))
                .map(d => String(d.id));
            setFavorites(favorited);
        } catch (e) {
            console.error('[FAVORITES] Error loading:', e.message);
        }
    };

    useEffect(() => {
        // Cargar perfil y favoritos cuando el usuario se autentica
        if (authToken && user) {
            loadUserProfile();
            loadUserFavorites();
        }
    }, [authToken, user?.id]);

    useEffect(() => {
        // Reload departments when user logs in
        if (user) {
            async function load() {
                try {
                    const res = await apiClient.get('/departments');
                    const data = res?.data?.data || res?.data;
                    if (!data) return;
                    const depts = Array.isArray(data) ? data : (data.data || []);
                    setDepartments((depts || []).map(d => ({
                        id: String(d.id),
                        name: d.name || '',
                        address: d.address || '',
                        bedrooms: d.bedrooms ?? 1,
                        pricePerNight: (d.price_per_night || d.pricePerNight) ?? 50,
                        rating: (d.rating_avg || d.rating) ?? 4.0,
                        description: d.description || '',
                        amenities: d.amenities || [],
                        images: d.images || [],
                    })));
                } catch (e) {
                    // ignore
                }
            }
            load();
        }
    }, [user]);

    const authHeaders = async () => {
        const t = authToken || await AsyncStorage.getItem('token');
        return t ? { 'Authorization': `Bearer ${t}` } : {};
    };

    const fetchWithAuth = async (url, opts = {}) => {
        const headers = opts.headers || {};
        const ah = await authHeaders();
        return fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...headers, ...ah } });
    };

    // Auth API helpers (con retry logic automático)
    const apiLogin = async (email, password, retries = 2) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const res = await apiClient.post('/auth/login', { email, password });
                const json = res.data;
                const token = json.token || json.access_token;
                if (!token) return { success: false, message: 'No token' };
                await AsyncStorage.setItem('token', token);
                setAuthToken(token);
                setUser(json.user || json);
                console.log('[AUTH] Login exitoso en intento', attempt + 1);
                return { success: true, user: json.user || json };
            } catch (e) {
                console.warn(`[AUTH] Intento ${attempt + 1}/${retries + 1} falló:`, e.message);
                
                // Si es el último intento, retornar error
                if (attempt === retries) {
                    // Mostrar error específico (no fallback local que ralentiza)
                    const errorMsg = e.response?.data?.message || e.message || 'Error de conexión. Verifica tu internet.';
                    return { 
                        success: false, 
                        error: e.response?.data || e.message, 
                        message: errorMsg 
                    };
                }
                // Esperar un poco antes de reintentar (backoff simple)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    };

    const apiRegister = async (name, email, password) => {
        try {
            const res = await apiClient.post('/auth/register', { name, email, password });
            const json = res.data;
            const token = json.token || json.access_token;
            if (!token) return { success: false, message: 'No token' };
            await AsyncStorage.setItem('token', token);
            setAuthToken(token);
            setUser(json.user || json);
            console.log('[AUTH] Register exitoso');
            return { success: true, user: json.user || json };
        } catch (e) {
            const errorMsg = e.response?.data?.message || e.message || 'Error al registrar';
            console.warn('[AUTH] Register error:', errorMsg);
            return { success: false, error: e.response?.data || e.message, message: errorMsg };
        }
    };

    const apiLogout = async () => {
        try{
            await apiClient.post('/auth/logout');
        }catch(e){}
        await AsyncStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    // API Update Department
    const apiUpdateDepartment = async (deptId, updates) => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try {
            const res = await apiClient.put(`/departments/${deptId}`, {
                name: updates.name,
                address: updates.address,
                bedrooms: updates.bedrooms,
                price_per_night: updates.pricePerNight,
                description: updates.description,
                amenities: updates.amenities,
            });
            const data = res.data?.data || res.data;
            // Update local departments list
            setDepartments(prevDepts => prevDepts.map(d => {
                if (String(d.id) === String(deptId)) {
                    return {
                        id: String(data.id),
                        name: data.name || '',
                        address: data.address || '',
                        bedrooms: data.bedrooms ?? 1,
                        pricePerNight: (data.price_per_night || data.pricePerNight) ?? 50,
                        rating: (data.rating_avg || data.rating) ?? 4.0,
                        description: data.description || '',
                        amenities: data.amenities || [],
                        images: data.images || [],
                    };
                }
                return d;
            }));
            return { success: true, data };
        } catch (e) {
            const errorMsg = e.response?.data?.message || e.message || 'Error updating department';
            console.warn('[API] Update department error:', errorMsg);
            return { success: false, error: e.response?.data, message: errorMsg };
        }
    };

    // Department actions
    const apiToggleFavorite = async (deptId) => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try{
            // if currently favorited locally, unfavorite
            if (favorites.includes(deptId)){
                const res = await apiClient.delete(`/departments/${deptId}/favorite`);
                if (res.status >= 200 && res.status < 300) setFavorites(favorites.filter(id => id !== deptId));
                return { success: res.status >= 200 && res.status < 300 };
            }else{
                const res = await apiClient.post(`/departments/${deptId}/favorite`);
                if (res.status >= 200 && res.status < 300) setFavorites([...favorites, deptId]);
                return { success: res.status >= 200 && res.status < 300 };
            }
        }catch(e){ return { success: false, error: e.response?.data || e.message }; }
    };

    const apiRateDepartment = async (deptId, stars, comment = '') => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try{
            const res = await apiClient.post(`/departments/${deptId}/rate`, { stars, comment });
            const json = res.data;
            return { success: true, review: json };
        }catch(e){ return { success: false, error: e.response?.data || e.message }; }
    };

    // Reviews API: fetch and submit reviews tied to departments
    const fetchReviews = async (deptId, params = {}) => {
        try {
            const res = await apiClient.get(`/departments/${deptId}/reviews`, { params });
            return { success: true, data: res.data };
        } catch (e) {
            return { success: false, error: e.response?.data || e.message };
        }
    };

    const submitReview = async (deptId, rating, comment = '') => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try {
            const res = await apiClient.post(`/departments/${deptId}/reviews`, { rating, comment });
            if (res.status === 201) {
                // Actualizar rating del departamento en tiempo real
                setDepartments(prevDepts =>
                    prevDepts.map(d => {
                        if (String(d.id) === String(deptId)) {
                            return { ...d, rating: res.data.review?.stars || d.rating };
                        }
                        return d;
                    })
                );
                return { success: true, data: res.data.review };
            }
            return { success: false, message: res.data.message || 'Error' };
        } catch (e) {
            const msg = e.response?.data?.message || e.message;
            return { success: false, error: e.response?.data || e.message };
        }
    };

    // ===== RESERVATIONS API =====
    const fetchReservations = async () => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try {
            const res = await apiClient.get('/reservations');
            const data = res.data?.data || res.data;
            const reservationsList = Array.isArray(data) ? data : (data.data || []);
            setReservations(
                reservationsList.map(r => ({
                    id: String(r.id),
                    deptId: String(r.department_id),
                    departmentName: r.department?.name || 'N/A',
                    date: r.reservation_date,
                    time: r.reservation_time,
                    duration: r.duration,
                    status: r.status || 'pending',
                    amount: r.amount || 0,
                    paymentMethod: r.payment_method,
                    notes: r.notes,
                }))
            );
            return { success: true, data: reservationsList };
        } catch (e) {
            return { success: false, error: e.response?.data || e.message };
        }
    };

    const createReservation = async (deptId, date, time, duration, paymentMethod = null, notes = '') => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try {
            // Asegurar que deptId es número para validación exists
            const deptIdNum = parseInt(deptId, 10);
            const payload = {
                department_id: deptIdNum,
                reservation_date: date,
                reservation_time: time,
                duration,
                payment_method: paymentMethod,
                notes,
            };
            console.log('[API] Creating reservation with:', payload);
            const res = await apiClient.post('/reservations', payload);
            if (res.status === 201) {
                const newRes = res.data.reservation;
                setReservations(prev => [
                    {
                        id: String(newRes.id),
                        deptId: String(newRes.department_id),
                        departmentName: newRes.department?.name || 'N/A',
                        date: newRes.reservation_date,
                        time: newRes.reservation_time,
                        duration: newRes.duration,
                        status: newRes.status,
                        amount: newRes.amount,
                        paymentMethod: newRes.payment_method,
                        notes: newRes.notes,
                    },
                    ...prev
                ]);
                return { success: true, data: newRes };
            }
            return { success: false, message: res.data.message || 'Error' };
        } catch (e) {
            const errMsg = e.response?.data?.message || e.response?.data?.errors || e.message;
            console.error('[API] Create reservation error:', errMsg);
            return { success: false, error: e.response?.data, message: errMsg };
        }
    };

    const cancelReservation = async (reservationId) => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        try {
            const res = await apiClient.delete(`/reservations/${reservationId}`);
            if (res.status >= 200 && res.status < 300) {
                setReservations(prev => prev.filter(r => String(r.id) !== String(reservationId)));
                return { success: true };
            }
            return { success: false };
        } catch (e) {
            return { success: false, error: e.response?.data || e.message };
        }
    };

    const getAvailableSlots = async (deptId, date) => {
        try {
            const res = await apiClient.get('/reservations/available-slots', {
                params: { department_id: deptId, date }
            });
            return { success: true, slots: res.data.available_slots || [] };
        } catch (e) {
            return { success: false, error: e.response?.data || e.message };
        }
    };

    // ===== IMAGE UPLOAD =====
    const apiUploadImages = async (deptId, filesArray) => {
        if (!authToken) return { success: false, message: 'Not authenticated' };
        if (!filesArray || filesArray.length === 0) {
            return { success: false, error: 'No images selected' };
        }
        try{
            const form = new FormData();
            filesArray.forEach((f, i) => {
                form.append('images[]', f);
            });
            const res = await apiClient.post(`/departments/${deptId}/images`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status >= 200 && res.status < 300) {
                const imageUrls = res.data.images || [];
                // Actualizar departamento con las nuevas imágenes
                setDepartments(prevDepts =>
                    prevDepts.map(d => {
                        if (String(d.id) === String(deptId)) {
                            return {
                                ...d,
                                images: [...(d.images || []), ...imageUrls]
                            };
                        }
                        return d;
                    })
                );
                return { success: true, images: imageUrls };
            }
            return { success: res.status >= 200 && res.status < 300 };
        }catch(e){ 
            return { success: false, error: e.response?.data?.message || e.message }; 
        }
    };

    const [promotions, setPromotions] = useState([
        { id: 'p1', title: '🎉 Descuento Fin de Año', description: '20% de descuento en todas las reservas', discount: 20, code: 'YEAR20', startDate: '2025-12-01', endDate: '2025-12-31', active: true, applicableDepts: ['1', '2', '3'] },
        { id: 'p2', title: '💰 Estancia Prolongada', description: '15% descuento por 7+ noches', discount: 15, code: 'LONG7', startDate: '2025-12-01', endDate: '2025-12-31', active: true, applicableDepts: ['1', '2', '3'] },
        { id: 'p3', title: '👥 Grupos Grandes', description: '25% descuento para 4+ personas', discount: 25, code: 'GROUP25', startDate: '2025-12-01', endDate: '2025-12-31', active: true, applicableDepts: ['2', '3'] },
        { id: 'p4', title: '🏖️ Promoción Especial Centro', description: '10% en el departamento Centro', discount: 10, code: 'CENTER10', startDate: '2025-12-15', endDate: '2025-12-25', active: true, applicableDepts: ['1'] },
    ]);

    const [reservations, setReservations] = useState([]);

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
    const createDepartment = async (name, address, data = {}) => {
        if (!canCreateDepartment(user)) return { success: false, message: 'No tienes permisos para crear departamentos.' };

        const localPayload = {
            name,
            address: address || data.address || '',
            bedrooms: data.bedrooms || 1,
            pricePerNight: data.pricePerNight || 50,
            description: data.description || '',
            amenities: data.amenities || [],
            images: data.images || [],
            rating: data.rating || 4.0,
        };

        // Si tenemos un cliente API, intentar persistir en backend
        try {
            if (apiClient) {
                const res = await apiClient.post('/departments', localPayload);
                const created = res?.data || null;
                if (created) {
                    // Asegurar id como string
                    const dept = { ...created, id: String(created.id || created._id || (Date.now())), };
                    setDepartments((d) => [...d, dept]);
                    return { success: true, data: dept };
                }
            }
        } catch (e) {
            // Si falla por red o permisos, haremos fallback al almacenamiento local
            // pero retornamos la respuesta del servidor cuando exista
            const serverErr = e?.response?.data || e.message;
            // continue to fallback
        }

        // Fallback local creation cuando no hay backend o falla la petición
        const id = (departments.length + 1).toString();
        const newDept = { id, ...localPayload };
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

    // Polling: refresh user's reservations periodically and show snackbar on changes
    React.useEffect(() => {
        let mounted = true;
        let intervalId = null;

        const fetchReservationsFromServer = async () => {
            if (!apiClient) return;
            try {
                const res = await apiClient.get('/reservations');
                const data = res?.data?.data || res?.data || [];
                const mapped = (data || []).map((r) => ({
                    id: String(r.id),
                    deptId: String(r.department_id || r.department?.id || r.deptId),
                    date: r.reservation_date || r.date,
                    time: r.reservation_time || r.time,
                    duration: r.duration,
                    user: r.user?.email || r.user?.correo || 'anon',
                    status: r.status,
                    amount: r.amount,
                }));

                if (!mounted) return;

                setReservations((prev) => {
                    const prevMap = new Map((prev || []).map(p => [String(p.id), p]));
                    const messages = [];
                    mapped.forEach((m) => {
                        const p = prevMap.get(String(m.id));
                        if (!p) {
                            messages.push(`Nueva reserva ${m.date} ${m.time}`);
                        } else if (p.status !== m.status) {
                            messages.push(`Reserva ${m.id} cambió a ${m.status}`);
                        }
                    });
                    if (messages.length && typeof showSnackbar === 'function') {
                        messages.forEach(msg => showSnackbar(msg));
                    }
                    return mapped;
                });
            } catch (e) {
                // ignore polling errors
            }
        };

        if (user && authToken) {
            fetchReservationsFromServer();
            intervalId = setInterval(fetchReservationsFromServer, 15000);
        }

        return () => { mounted = false; if (intervalId) clearInterval(intervalId); };
    }, [user, authToken]);

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


    // Búsquedas recientes
    const addRecentSearch = (query) => {
        if (!query.trim()) return;
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updated);
    };

    const clearRecentSearches = () => setRecentSearches([]);

    // Comparador de departamentos
    const toggleDeptComparison = (deptId) => {
        if (selectedDepts.includes(deptId)) {
            setSelectedDepts(selectedDepts.filter(id => id !== deptId));
        } else if (selectedDepts.length < 3) {
            setSelectedDepts([...selectedDepts, deptId]);
        }
    };

    const clearComparison = () => setSelectedDepts([]);

    // Sistema de ratings
    const setUserRating = (deptId, rating) => {
        setUserRatings(prev => ({
            ...prev,
            [deptId]: rating
        }));
    };

    const getUserRating = (deptId) => userRatings[deptId] || 0;

    // Funciones para Promociones
    const addPromotion = (promotion) => {
        const newPromotion = {
            id: 'p' + Date.now(),
            ...promotion,
            active: true
        };
        setPromotions([...promotions, newPromotion]);
        return newPromotion;
    };

    const updatePromotion = (id, updatedData) => {
        setPromotions(promotions.map(p => p.id === id ? { ...p, ...updatedData } : p));
    };

    const deletePromotion = (id) => {
        setPromotions(promotions.filter(p => p.id !== id));
    };

    const togglePromotionStatus = (id) => {
        setPromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const getActivePromotions = () => promotions.filter(p => p.active);

    const getPromotionsByDept = (deptId) => {
        return promotions.filter(p => p.active && p.applicableDepts.includes(deptId));
    };

    // Funciones para Favoritos
    const toggleFavorite = (deptId) => {
        if (favorites.includes(deptId)) {
            setFavorites(favorites.filter(id => id !== deptId));
        } else {
            setFavorites([...favorites, deptId]);
        }
    };

    const isFavorite = (deptId) => favorites.includes(deptId);

    const getFavoriteDepartments = () => {
        return departments.filter(d => favorites.includes(d.id));
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
                apiLogin,
                apiRegister,
                apiLogout,
                apiToggleFavorite,
                apiRateDepartment,
                fetchReviews,
                submitReview,
                apiUploadImages,
                fetchReservations,
                createReservation,
                cancelReservation,
                getAvailableSlots,
                loadUserProfile,
                loadUserFavorites,
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
                apiUpdateDepartment,
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
                recentSearches,
                addRecentSearch,
                clearRecentSearches,
                selectedDepts,
                toggleDeptComparison,
                clearComparison,
                userRatings,
                setUserRating,
                getUserRating,
                promotions,
                setPromotions,
                addPromotion,
                updatePromotion,
                deletePromotion,
                togglePromotionStatus,
                getActivePromotions,
                getPromotionsByDept,
                favorites,
                setFavorites,
                toggleFavorite,
                isFavorite,
                getFavoriteDepartments,
                authToken,
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