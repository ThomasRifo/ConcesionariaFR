# Campos que trae la API de Auto.dev

Basado en la documentación y el ejemplo proporcionado, estos son todos los campos que puede retornar la API de Auto.dev al decodificar un VIN:

## 📋 Campos Básicos del VIN
- `vin` - Número de identificación del vehículo (17 caracteres)
- `vinValid` - Boolean que indica si el VIN es válido
- `wmi` - World Manufacturer Identifier (primeros 3 caracteres)
- `origin` - País de origen/fabricación (ej: "Mexico", "USA")
- `squishVin` - VIN comprimido
- `checkDigit` - Dígito de verificación
- `checksum` - Boolean que indica si el checksum es válido
- `type` - Tipo de vehículo (ej: "Active")

## 🚗 Información del Vehículo (Nivel Raíz)
- `make` - Marca (ej: "Chevrolet")
- `model` - Modelo (ej: "Silverado 1500")
- `trim` - Versión/equipamiento (ej: "ZR2")
- `style` - Estilo/descripción completa (ej: "4x4 4dr Crew Cab 5.8 ft. SB")

## 🚗 Objeto `vehicle` (Información adicional)
- `vehicle.vin` - VIN (repetido)
- `vehicle.year` - Año del vehículo
- `vehicle.make` - Marca (repetido)
- `vehicle.model` - Modelo (repetido)
- `vehicle.manufacturer` - Fabricante completo (ej: "General Motors de Mexico")

## ⚙️ Información Técnica (puede venir en otros endpoints)
- `engine.type` - Tipo de motor (ej: "V8")
- `engine.displacement` - Cilindrada (ej: "5.3L")
- `engine.horsepower` - Potencia (ej: "355 hp")
- `engine.torque` - Torque (ej: "383 lb-ft")
- `engine.fuelType` - Tipo de combustible (ej: "Gasoline")
- `transmission.type` - Tipo de transmisión (ej: "Automatic")
- `transmission.numberOfSpeeds` - Número de velocidades (ej: "6")
- `mpg.city` - Consumo en ciudad (mpg)
- `mpg.highway` - Consumo en carretera (mpg)
- `numOfDoors` - Número de puertas
- `colors.exterior` - Colores exteriores disponibles
- `colors.interior` - Colores interiores disponibles

---

## 📊 Campos que YA TIENES en tu BD

### Tabla `vehiculos`:
- ✅ `marca` (string, 100) - **MAPEAR CON**: `make` o `vehicle.make`
- ✅ `modelo` (string, 100) - **MAPEAR CON**: `model` o `vehicle.model`
- ✅ `anio` (integer) - **MAPEAR CON**: `vehicle.year` o `year`
- ✅ `vin` (string, 17) - **MAPEAR CON**: `vin`
- ✅ `color` (string, 50) - **MAPEAR CON**: `colors.exterior` (si existe) o campo manual
- ✅ `patente` - No viene de la API (es local)
- ✅ `precio` - No viene de la API (es local)
- ✅ `kilometraje` - No viene de la API (es local)
- ✅ `idCategoria` - Relación con tabla categorias (podríamos sugerir según tipo)
- ✅ `idCombustible` - Relación con tabla combustibles (podríamos mapear con `engine.fuelType`)
- ✅ `idTransmision` - Relación con tabla transmisiones (podríamos mapear con `transmission.type`)
- ✅ `idEstado` - Estado local (no viene de API)
- ✅ `detalles` (string, 300, nullable) - Podríamos usar `style` aquí

---

## 💡 RECOMENDACIONES: Qué Agregar y Qué Combinar

### 🔄 CAMPOS A COMBINAR (Ya existen, solo mejorar el mapeo)

1. **`modelo` + `trim`**
   - **Actual**: Solo `model`
   - **Mejorar**: Combinar `model` + `trim` → "Silverado 1500 ZR2"
   - ✅ Ya implementado en el código

2. **`detalles` con `style`**
   - **Actual**: Campo `detalles` (300 caracteres, nullable)
   - **Mejorar**: Auto-completar con `style` → "4x4 4dr Crew Cab 5.8 ft. SB"
   - 💡 **ACCION**: Agregar mapeo de `style` a `detalles`

3. **`idCombustible` con `engine.fuelType`**
   - **Actual**: Relación con tabla `combustibles`
   - **Mejorar**: Si viene `engine.fuelType`, buscar coincidencia en la tabla y auto-seleccionar
   - 💡 **ACCION**: Crear función para mapear combustible (ej: "Gasoline" → buscar en BD)

4. **`idTransmision` con `transmission.type`**
   - **Actual**: Relación con tabla `transmisiones`
   - **Mejorar**: Si viene `transmission.type`, buscar coincidencia y auto-seleccionar
   - 💡 **ACCION**: Crear función para mapear transmisión (ej: "Automatic" → buscar en BD)

### ➕ CAMPOS NUEVOS A AGREGAR (Opcional)

Estos campos podrían ser útiles pero no son esenciales. Depende de qué información quieras mostrar:

1. **`pais_origen`** (string, 50, nullable)
   - Guardar `origin` → "Mexico", "USA", etc.
   - 💡 Útil para mostrar información adicional

2. **`tipo_motor`** (string, 50, nullable)
   - Guardar `engine.type` → "V8", "V6", etc.
   - 💡 Útil para especificaciones técnicas

3. **`cilindrada`** (string, 20, nullable)
   - Guardar `engine.displacement` → "5.3L"
   - 💡 Útil para especificaciones

4. **`potencia`** (string, 20, nullable)
   - Guardar `engine.horsepower` → "355 hp"
   - 💡 Útil para especificaciones

5. **`num_puertas`** (integer, nullable)
   - Guardar `numOfDoors` → 4, 5, etc.
   - 💡 Útil para búsquedas/filtros

---

## 🎯 PLAN DE ACCIÓN SUGERIDO

### FASE 1: Mejorar mapeo existente (Alta prioridad)
- ✅ Ya hecho: `modelo` + `trim`
- ⏳ Pendiente: `style` → `detalles`
- ⏳ Pendiente: `engine.fuelType` → sugerir `idCombustible`
- ⏳ Pendiente: `transmission.type` → sugerir `idTransmision`

### FASE 2: Campos nuevos útiles (Media prioridad)
- ⏳ Agregar: `pais_origen` (útil para mostrar info adicional)
- ⏳ Agregar: `tipo_motor` o campos técnicos (si necesitas mostrar especificaciones)

### FASE 3: Optimizaciones (Baja prioridad)
- ⏳ Guardar datos completos en JSON en campo `raw_data` (ya lo hacemos pero no lo guardamos)
- ⏳ Crear tabla de cache para evitar llamadas repetidas a la API

---

## 📝 NOTAS

- El campo `color` de la API no siempre viene en el endpoint básico `/vin/{vin}`
- Para obtener más información técnica (motor, transmisión detallada), podría requerir otros endpoints
- El campo `detalles` actualmente tiene 300 caracteres, suficiente para `style` que suele ser largo
- Los campos de relaciones (`idCombustible`, `idTransmision`) requieren buscar coincidencias en las tablas locales



