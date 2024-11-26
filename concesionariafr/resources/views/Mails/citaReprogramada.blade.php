<!DOCTYPE html>
<html>
<head>
    <title>Cita Reprogramada</title>
</head>
<body>
    <h1>Reprogramación de cita</h1>
    <p>Estimado/a {{ $nombreCliente }},</p>
    <p>Su cita ha sido reprogramada:</p>
    <ul>
        <li><strong>Fecha:</strong> {{ \Carbon\Carbon::parse($fecha)->format('d/m/Y H:i') }}</li>
        <li><strong>Descripción:</strong> {{ $descripcion }}</li>
        <li><strong>Empleado a cargo:</strong> {{ $nombreEmpleado }}</li>
    </ul>
    <p>En caso de no poder esa fecha llamar a 2994160294 para coordinar una nueva fecha</p>
    <p>Gracias por confiar en nosotros.</p>
</body>
</html>