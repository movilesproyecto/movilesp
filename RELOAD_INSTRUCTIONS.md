# Instrucciones para Recargar la App

## Opción 1: Reload Normal (recomendado primero)
1. En tu dispositivo/emulador, **haz shake** (agita el teléfono)
2. Toca **"Reload"** en el menú que aparece
3. Espera a que se recargue

## Opción 2: Reload desde Terminal
1. En la terminal donde está Expo (`npm start`), presiona **`r`**
2. Espera a que se recargue

## Opción 3: Hard Reset (si sigue con errores)
1. Detén Expo: `Ctrl+C` en la terminal
2. Ejecuta: `npm start -- --clear`
3. Espera a que rebuild el bundle (puede tardar 1-2 min)
4. Recarga la app en el dispositivo con `r`

## Verificar que funcionó
En la consola deberías ver:
```
[API_CLIENT] Base URL: http://192.168.100.61:8000/api Platform: android
[API_REQUEST] Attempting: GET http://192.168.100.61:8000/api/reservations
[API] Fetched all reservations: X
```

❌ NO deberías ver:
```
[API_ERROR] Failed to reach: http://192.168.100.61:8000/api/admin/reservations
```

## Si Persisten los Errores
- Verifica que el servidor Laravel esté corriendo: `php artisan serve --host=0.0.0.0 --port=8000`
- Verifica que la IP sea correcta en `src/config.js`
- Intenta cambiar la IP a `192.168.56.1` o `localhost` si estás en web
