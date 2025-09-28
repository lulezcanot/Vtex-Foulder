# 🚀 Guía de Despliegue - VTEX Foulder

## 📋 Configuración para Netlify

### ✅ Archivos ya configurados:
- `netlify.toml` - Configuración principal de Netlify
- `client/public/_redirects` - Redirects para SPA routing
- `client/src/service/api.js` - Configuración de API con variables de entorno

### 🔧 Pasos para desplegar en Netlify:

#### 1. **Configuración en Netlify Dashboard:**
   - **Site settings** → **Build & deploy** → **Build settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

#### 2. **Variables de entorno en Netlify:**
   - Ve a **Site settings** → **Environment variables**
   - Agrega la variable: `VITE_API_URL` con la URL de tu backend
   - Ejemplo: `https://tu-backend-railway.up.railway.app/api`

#### 3. **Desplegar el Backend:**
   El frontend necesita un backend funcionando. Opciones recomendadas:
   
   **Railway (Recomendado):**
   - Conecta tu repositorio
   - Configura el directorio raíz como `Backend`
   - Variables de entorno necesarias:
     ```
     NODE_ENV=production
     MONGODB_URI=tu-mongodb-uri
     JWT_SECRET=tu-jwt-secret
     SESSION_SECRET=tu-session-secret
     ```

   **Render:**
   - Crea un nuevo Web Service
   - Conecta tu repositorio
   - Root Directory: `Backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

#### 4. **Verificar el despliegue:**
   - El frontend debería cargar correctamente
   - Verificar que las rutas funcionen (gracias a `_redirects`)
   - Comprobar que la API se conecte al backend

### 🔍 Solución de problemas:

#### Error "Page not found":
- ✅ **Solucionado** con `netlify.toml` y `_redirects`

#### Error de CORS:
- Configurar CORS en el backend para permitir tu dominio de Netlify
- Ejemplo en Express:
  ```javascript
  app.use(cors({
    origin: ['https://tu-app.netlify.app', 'http://localhost:3001'],
    credentials: true
  }));
  ```

#### Error de conexión a la API:
- Verificar que `VITE_API_URL` esté configurada en Netlify
- Verificar que el backend esté desplegado y funcionando

### 📁 Estructura de archivos creados:
```
├── netlify.toml                 # Configuración principal de Netlify
├── client/
│   ├── .env.example            # Ejemplo de variables de entorno
│   ├── public/_redirects       # Redirects para SPA
│   └── src/service/api.js      # API configurada para prod/dev
└── DEPLOYMENT.md               # Esta guía
```

### 🎯 Próximos pasos:
1. Hacer commit y push de estos cambios
2. Configurar las variables de entorno en Netlify
3. Desplegar el backend en Railway/Render
4. Actualizar `VITE_API_URL` con la URL real del backend
5. ¡Disfrutar de tu aplicación en producción! 🎉
