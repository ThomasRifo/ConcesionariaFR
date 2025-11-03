# PUNTO DE ANCLAJE - Antes de Integración API Auto.dev

**Fecha de creación:** $(date)
**Descripción:** Este es un punto de anclaje antes de integrar la API de Auto.dev para decodificación de VIN.

## Estado Actual del Proyecto

### Información General
- **Framework:** Laravel 11.9
- **Frontend:** React con Inertia.js
- **Base de datos:** MySQL/MariaDB
- **Ubicación:** `C:\xampp\htdocs\ConcecionariaFRFinal\ConcesionariaFR\concesionariafr`

### Estructura del Modelo Vehiculo

**Archivo:** `app/Models/Vehiculo.php`

**Campos actuales en la tabla `vehiculos`:**
- `id` (PK)
- `idEstado` (FK -> estado_vehiculos)
- `idCategoria` (FK -> categoria_vehiculos)
- `idCombustible` (FK -> combustibles)
- `idTransmision` (FK -> transmisiones)
- `marca` (string, 100)
- `modelo` (string, 100)
- `anio` (integer)
- `precio` (float)
- `patente` (string, 7, unique)
- `color` (string, 50)
- `kilometraje` (integer)
- `cantidadVistas` (integer, default: 0)
- `detalles` (string, 300, nullable)
- `timestamps`

**Campos fillable en el modelo:**
```php
protected $fillable = [
    'idCategoria',
    'idCombustible',
    'idTransmision',
    'marca',
    'modelo',
    'anio',
    'precio',
    'patente',
    'color',
    'kilometraje',
    'idEstado',
];
```

**Relaciones actuales:**
- `imagenes()` - hasMany ImagenVehiculo
- `imagenPrincipal()` - hasOne ImagenVehiculo (imagenPrincipal = true)
- `categoria()` - belongsTo categoriaVehiculo
- `estado()` - belongsTo estadoVehiculo
- `combustible()` - belongsTo Combustible
- `transmision()` - belongsTo Transmision
- `autosCliente()` - hasMany AutosCliente

### Funcionalidades Implementadas

#### VehiculoController (`app/Http/Controllers/VehiculoController.php`)

1. **index()** - Lista de vehículos con filtros:
   - Búsqueda por término (marca/modelo)
   - Filtros por: marca, modelo, categoría, combustible, transmisión
   - Sistema de favoritos para usuarios autenticados

2. **create()** - Formulario de creación de vehículo
   - Carga categorías, combustibles y transmisiones

3. **store()** - Creación de vehículo:
   - Validación de todos los campos
   - Creación del vehículo con estado por defecto (idEstado = 1)
   - Subida de imagen principal

4. **show()** - Detalle de vehículo:
   - Incrementa contador de vistas
   - Muestra información completa con relaciones
   - Incluye líneas de financiamiento

5. **edit()** - Lista de vehículos para edición
   - Carga todos los vehículos con relaciones
   - Carga opciones para selectores

6. **update()** - Actualización de vehículo
   - Actualiza todos los campos excepto imágenes

7. **destroy()** - Eliminación de vehículo

### Base de Datos - Migraciones Principales

**Tabla `vehiculos`:**
- Migración: `2024_09_17_174247_create_vehiculo_table.php`
- **IMPORTANTE:** No tiene campo `vin` actualmente

**Tablas relacionadas:**
- `estado_vehiculos` - Estados de vehículos
- `categoria_vehiculos` - Categorías
- `combustibles` - Tipos de combustible
- `transmisiones` - Tipos de transmisión
- `imagen_vehiculos` - Imágenes de vehículos
- `autos_cliente` - Vehículos favoritos de clientes

### Dependencias (composer.json)

```json
{
    "php": "^8.2",
    "inertiajs/inertia-laravel": "^1.0",
    "laravel/breeze": "^2.2",
    "laravel/framework": "^11.9",
    "laravel/reverb": "^1.0",
    "laravel/sanctum": "^4.0",
    "spatie/laravel-permission": "^6.9"
}
```

**Nota:** No hay dependencias HTTP client como Guzzle instaladas explícitamente (vienen con Laravel).

### Componentes Frontend

**Formulario de creación:**
- `resources/js/Pages/Vehiculos/AgregarVehiculo.jsx`
- Campos actuales: categoria, combustible, transmision, marca, modelo, año, precio, patente, color, kilometraje, imagen
- **NO tiene campo VIN actualmente**

### Estado del Proyecto

✅ **Funcionando:**
- CRUD completo de vehículos
- Sistema de filtros y búsqueda
- Gestión de imágenes
- Sistema de favoritos
- Financiamiento y presupuestos
- Agenda de citas
- Sistema de autenticación con roles

❌ **No implementado:**
- Integración con API Auto.dev
- Campo VIN en base de datos
- Búsqueda automática por VIN
- Auto-completado de datos desde VIN

---

## Cómo Volver a Este Punto

### Si usas Git:

```bash
# Ver commits recientes
git log --oneline

# Si necesitas revertir cambios después de la integración
git checkout CHECKPOINT_AUTO_DEV.md  # Ver este archivo para referencia
git log --all --grep="auto.dev"      # Buscar commits relacionados
git revert <commit-hash>              # Revertir commit específico
```

### Si necesitas restaurar manualmente:

1. **Base de datos:**
   - Verificar que no exista columna `vin` en tabla `vehiculos`
   - Si existe, eliminarla con migración:
     ```php
     Schema::table('vehiculos', function (Blueprint $table) {
         $table->dropColumn('vin');
     });
     ```

2. **Modelo Vehiculo:**
   - Remover `vin` del array `$fillable`
   - Remover cualquier método relacionado con VIN o Auto.dev

3. **VehiculoController:**
   - Remover cualquier método relacionado con búsqueda de VIN
   - Remover validación de VIN en `store()` y `update()`

4. **Servicios:**
   - Eliminar cualquier servicio de Auto.dev:
     - `app/Services/AutoDevService.php` (si se crea)

5. **Rutas:**
   - Remover rutas relacionadas con VIN:
     - `POST /api/vehiculos/buscar-vin`
     - Cualquier otra ruta de Auto.dev

6. **Frontend:**
   - Remover campo VIN de formularios
   - Remover funcionalidad de búsqueda por VIN

7. **Configuración:**
   - Remover variables de entorno relacionadas:
     - `AUTO_DEV_API_KEY`
     - `AUTO_DEV_API_URL`

8. **Dependencias:**
   - Si se agregó alguna dependencia HTTP específica, removerla:
     ```bash
     composer remove <package-name>
     ```

---

## Notas Adicionales

- El proyecto NO tiene campo VIN actualmente
- Los datos se ingresan manualmente en el formulario
- No hay integración con APIs externas para datos de vehículos
- El sistema funciona completamente sin necesidad de VIN

---

## Próximos Pasos (después de este checkpoint)

1. ✅ Crear migración para agregar campo `vin` a tabla `vehiculos`
2. ✅ Actualizar modelo `Vehiculo` con campo `vin`
3. ✅ Crear servicio `AutoDevService` para consumir API
4. ✅ Agregar ruta/endpoint para buscar por VIN
5. ✅ Actualizar formulario de creación para incluir búsqueda por VIN
6. ✅ Actualizar validaciones y controlador

---

**Fin del Punto de Anclaje**



