<!DOCTYPE html>
<html>
<head>
    <title>Cita Confirmada</title>
</head>
<body>
    <h1>Confirmación de Cita</h1>
    <p>Estimado/a {{ $nombreCliente }},</p>
    <p>Su cita ha sido confirmada:</p>
    <ul>
        <li><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y H:i') }}</li>
        <li><strong>Descripción:</strong> {{ $descripcion }}</li>
        <li><strong>Empleado a cargo:</strong> {{ $nombreEmpleado }}</li>
    </ul>
    <p>Gracias por confiar en nosotros.</p>
</body>
</html>