# Estructura de Base de Datos Externa - Bancos

Este documento describe la estructura esperada de la base de datos externa que contiene los datos de los bancos.

## Configuración

La conexión a la base de datos externa se configura en el archivo `.env` con las siguientes variables:

```env
# Configuración de Base de Datos Externa de Bancos
BANCOS_DB_DRIVER=mysql
BANCOS_DB_HOST=127.0.0.1
BANCOS_DB_PORT=3306
BANCOS_DB_DATABASE=nombre_base_datos_bancos
BANCOS_DB_USERNAME=usuario
BANCOS_DB_PASSWORD=contraseña
BANCOS_DB_PREFIX=
BANCOS_DB_CHARSET=utf8mb4
BANCOS_DB_COLLATION=utf8mb4_unicode_ci
```

## Estructura de Tablas

### Tabla: `bancos`

Almacena la información de los bancos.

```sql
CREATE TABLE bancos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    activo TINYINT(1) DEFAULT 1,
    -- Agregar más campos según necesites
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

**Campos principales:**
- `id`: Identificador único del banco
- `nombre`: Nombre del banco (ej: "Banco Santander", "Bancor")
- `codigo`: Código único del banco (opcional)
- `activo`: Indica si el banco está activo (1 = activo, 0 = inactivo)

### Tabla: `lineas_financiamiento`

Almacena las líneas de financiamiento de cada banco.

```sql
CREATE TABLE lineas_financiamiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    banco_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tasa_interes DECIMAL(5,2) NOT NULL,  -- Tasa Nominal Anual (TNA)
    cft DECIMAL(5,2) NOT NULL,            -- Costo Financiero Total
    capital_max DECIMAL(15,2) NOT NULL,   -- Capital máximo a financiar
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (banco_id) REFERENCES bancos(id)
);
```

**Campos principales:**
- `id`: Identificador único de la línea
- `banco_id`: ID del banco (FK a tabla `bancos`)
- `nombre`: Nombre de la línea (ej: "Prendario 6 meses", "Uva Especial")
- `tasa_interes`: Tasa de interés anual (TNA)
- `cft`: Costo Financiero Total
- `capital_max`: Capital máximo que se puede financiar
- `activo`: Indica si la línea está activa

### Tabla: `cuotas_financiamiento`

Almacena las opciones de cuotas disponibles para cada línea de financiamiento.

```sql
CREATE TABLE cuotas_financiamiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    linea_financiamiento_id INT NOT NULL,
    numero_cuotas INT NOT NULL,  -- Ej: 12, 24, 36, 48, 60
    activo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (linea_financiamiento_id) REFERENCES lineas_financiamiento(id),
    UNIQUE KEY unique_linea_cuota (linea_financiamiento_id, numero_cuotas)
);
```

**Campos principales:**
- `id`: Identificador único
- `linea_financiamiento_id`: ID de la línea de financiamiento (FK)
- `numero_cuotas`: Número de cuotas (meses) disponibles
- `activo`: Indica si esta opción está activa

## Ejemplo de Datos

```sql
-- Insertar bancos
INSERT INTO bancos (nombre, codigo, activo) VALUES
('Santander', 'SAN', 1),
('Bancor', 'BAN', 1),
('Credi Nissan', 'CRE', 1);

-- Insertar líneas de financiamiento
INSERT INTO lineas_financiamiento (banco_id, nombre, tasa_interes, cft, capital_max, activo) VALUES
(1, 'Santander Uva Especial Rolen', 14.0, 16.0, 5000000.00, 1),
(2, 'Bancor Uva - Autos hasta 8 Años', 13.5, 15.2, 8000000.00, 1),
(3, 'Prendario 6 meses 6,5m - Mas Conveniente', 15.5, 18.3, 6500000.00, 1);

-- Insertar cuotas
INSERT INTO cuotas_financiamiento (linea_financiamiento_id, numero_cuotas, activo) VALUES
(1, 12, 1),
(1, 18, 1),
(1, 24, 1),
(1, 36, 1),
(1, 48, 1),
(2, 12, 1),
(2, 24, 1),
(2, 36, 1),
(2, 48, 1),
(2, 60, 1),
(3, 6, 1);
```

## Personalización

Si tu base de datos externa tiene una estructura diferente, puedes:

1. **Ajustar los nombres de las tablas** en los modelos:
   - `app/Models/External/Banco.php` → cambiar `protected $table`
   - `app/Models/External/LineaFinanciamientoExterna.php` → cambiar `protected $table`
   - `app/Models/External/CuotaFinanciamientoExterna.php` → cambiar `protected $table`

2. **Ajustar los nombres de las columnas** en los modelos:
   - Agregar o modificar campos en `$fillable`
   - Ajustar las relaciones si los nombres de las FK son diferentes

3. **Usar Query Builder directamente**:
   - Si prefieres no usar Eloquent, puedes modificar `BancoSoapServer.php` para usar `DB::connection('bancos')->table('tu_tabla')`

## Notas

- La conexión se realiza a través de la configuración `'bancos'` en `config/database.php`
- Los modelos en `app/Models/External/` usan automáticamente la conexión `'bancos'`
- Si la conexión falla, el sistema usa un fallback con datos básicos
- Todos los logs de conexión se guardan en `storage/logs/laravel.log`

