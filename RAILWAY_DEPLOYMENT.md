# 🚂 Guía de Despliegue en Railway - Backend VTEX Foulder

## 📋 Preparación Completada:
- ✅ Script `start` agregado al package.json
- ✅ CORS configurado para producción
- ✅ Variables de entorno documentadas
- ✅ Configuración lista para Railway

## 🚀 Pasos para Desplegar en Railway:

### **1. Crear cuenta y proyecto en Railway:**
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Conecta tu repositorio `Vtex-Foulder`

### **2. Configurar el proyecto:**
1. **Root Directory**: Configura como `Backend`
   - Ve a Settings → General → Root Directory
   - Escribe: `Backend`
2. **Build Command**: Railway lo detecta automáticamente (`npm install`)
3. **Start Command**: Railway usa `npm start` automáticamente

### **3. Configurar Variables de Entorno:**
Ve a tu proyecto → Variables → Add Variable y agrega:

```bash
# Base de datos MongoDB (OBLIGATORIO)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/vtex-foulder

# Secretos de seguridad (OBLIGATORIOS)
JWT_SECRET=tu-jwt-secret-muy-seguro-aqui-minimo-32-caracteres
SESSION_SECRET=tu-session-secret-muy-seguro-aqui-minimo-32-caracteres

# URL del frontend (OBLIGATORIO para CORS)
FRONTEND_URL=https://tu-app.netlify.app

# Entorno de producción
NODE_ENV=production
```

### **4. Configurar MongoDB Atlas (si no lo tienes):**
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Ve a Database Access → Add New Database User
5. Ve a Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Ve a Database → Connect → Connect your application
7. Copia la connection string y úsala como `MONGODB_URI`

### **5. Generar secretos seguros:**
Puedes usar estos comandos en tu terminal para generar secretos:
```bash
# Para JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Para SESSION_SECRET  
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **6. Desplegar:**
1. Haz commit y push de los cambios a tu repositorio
2. Railway detectará automáticamente los cambios
3. El despliegue comenzará automáticamente
4. Espera a que termine (aparecerá ✅ en el dashboard)

### **7. Obtener la URL del backend:**
1. En tu proyecto de Railway, ve a Settings → Domains
2. Copia la URL generada (ej: `https://tu-proyecto.up.railway.app`)
3. Esta será tu URL del backend

### **8. Configurar el frontend en Netlify:**
1. Ve a tu proyecto en Netlify
2. Site settings → Environment variables
3. Agrega: `VITE_API_URL` = `https://tu-proyecto.up.railway.app/api`
4. Redeploy el sitio

### **9. Actualizar CORS en Railway:**
1. En Railway, actualiza la variable `FRONTEND_URL` con tu URL real de Netlify
2. Ejemplo: `https://vtex-foulder.netlify.app`

## 🔍 Verificación del Despliegue:

### **Verificar que el backend funciona:**
- Visita: `https://tu-proyecto.up.railway.app/api/auth/status`
- Deberías ver una respuesta JSON

### **Verificar que el frontend se conecta:**
- Ve a tu app en Netlify
- Intenta hacer login
- Si hay errores, revisa la consola del navegador

## 🛠️ Solución de Problemas:

### **Error de conexión a MongoDB:**
- Verifica que `MONGODB_URI` esté correcta
- Verifica que la IP esté permitida en MongoDB Atlas
- Verifica que el usuario de la base de datos tenga permisos

### **Error de CORS:**
- Verifica que `FRONTEND_URL` sea exactamente tu URL de Netlify
- No incluyas `/` al final de la URL

### **Error 500 en el backend:**
- Ve a Railway → tu proyecto → Deployments → View Logs
- Busca errores en los logs

### **Frontend no se conecta al backend:**
- Verifica que `VITE_API_URL` en Netlify sea correcta
- Debe terminar en `/api`
- Ejemplo: `https://tu-proyecto.up.railway.app/api`

## 📁 Archivos Modificados:
```
Backend/
├── package.json          # Agregado script "start"
├── src/index.js          # CORS configurado para producción
└── .env.example          # Variables de entorno documentadas
```

## 🎯 URLs Finales:
- **Backend**: `https://tu-proyecto.up.railway.app`
- **Frontend**: `https://tu-app.netlify.app`
- **API**: `https://tu-proyecto.up.railway.app/api`

¡Una vez completados estos pasos, tu aplicación estará completamente desplegada y funcionando! 🎉
