
// Configura estos valores con tus datos
const CONFIG_CORREOS = {
  EMAIL_ADMIN: 'pragestionhumana@pastascomarrico.com', 
  EMAIL_CALIDAD: 'pragestionhumana@pastascomarrico.com',    
  NOMBRE_SISTEMA: 'Sistema de Seguimiento de Productos COMARRICO',
  ASUNTO_BASE: '[SDP-COMARRICO]'
};

/**
 * Enviar correo cuando se registra una nueva salida
 * @param {Object} datosRegistro - Datos del registro
 * @param {number} idRegistro - ID del registro generado
 */
function enviarCorreoNuevoRegistro(datosRegistro, idRegistro) {
  try {
    Logger.log('📧 Enviando correo de nuevo registro: ID ' + idRegistro);
    
    // Determinar destinatarios
    const destinatarios = obtenerDestinatariosCorreo(datosRegistro.Responsable);
    
    const asunto = `${CONFIG_CORREOS.ASUNTO_BASE} Nueva salida registrada - ID: ${idRegistro}`;
    
    // Formatear fecha en español
    const fechaActual = new Date();
    const opcionesFecha = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const fechaFormateada = fechaActual.toLocaleDateString('es-CO', opcionesFecha);
    
    const cuerpoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #FDB913 0%, #F5B800 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png');
            background-size: 60px;
            background-position: 20px 20px;
            background-repeat: no-repeat;
            opacity: 0.1;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .info-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #FDB913;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .info-label {
            flex: 0 0 180px;
            font-weight: 600;
            color: #495057;
        }
        
        .info-value {
            flex: 1;
            color: #212529;
            margin-left: 10px;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background: #FDB913;
            color: white;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .actions-box {
            background: #e8f4ff;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #3B82F6;
        }
        
        .actions-box h3 {
            color: #1e40af;
            margin-bottom: 12px;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .actions-box ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .actions-box li {
            margin-bottom: 8px;
            color: #374151;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .footer-logo {
            height: 40px;
            margin-bottom: 10px;
        }
        
        .producto-destacado {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .producto-icon {
            font-size: 24px;
            color: #FDB913;
        }
        
        .producto-info h4 {
            margin: 0 0 5px 0;
            color: #212529;
        }
        
        .producto-info p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px;
            }
            
            .info-row {
                flex-direction: column;
            }
            
            .info-label {
                flex: none;
                margin-bottom: 4px;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>📦 NUEVA SALIDA REGISTRADA</h1>
            <p>Sistema de Seguimiento de Productos - COMARRICO</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <div class="info-row">
                    <div class="info-label">ID del Registro:</div>
                    <div class="info-value"><span class="badge">#${idRegistro}</span></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fecha y Hora:</div>
                    <div class="info-value">${fechaFormateada}</div>
                </div>
            </div>
            
            <div class="producto-destacado">
                <div class="producto-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <div class="producto-info">
                    <h4>${datosRegistro.NombreProducto || 'Producto no especificado'}</h4>
                    <p>Código: ${datosRegistro.Código || 'No especificado'}</p>
                </div>
            </div>
            
            <div class="info-card">
                <div class="info-row">
                    <div class="info-label">Código del Producto:</div>
                    <div class="info-value"><strong>${datosRegistro.Código || 'No especificado'}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Nombre del Producto:</div>
                    <div class="info-value">${datosRegistro.NombreProducto || 'No especificado'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Descripción:</div>
                    <div class="info-value">${datosRegistro.Descripción || 'No especificada'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Tipo de Salida:</div>
                    <div class="info-value">${datosRegistro['Tipo de Salida'] || 'No especificado'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Tipo de Plaga/Hallazgo:</div>
                    <div class="info-value">${datosRegistro['Tipo de Plaga/Hallazgo'] || 'N/A'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Responsable:</div>
                    <div class="info-value"><strong>${datosRegistro.Responsable || 'No especificado'}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Ubicación/Pasillo:</div>
                    <div class="info-value">${datosRegistro['Pasillo/Ubicación'] || 'No especificado'}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fecha Estimada de Retorno:</div>
                    <div class="info-value"><strong>${datosRegistro['Fecha Estimada de Retorno'] || 'No especificada'}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Estado Inicial:</div>
                    <div class="info-value"><span style="color: #F59E0B; font-weight: 600;">${datosRegistro.Estado || 'En Revisión'}</span></div>
                </div>
            </div>
            
            <div class="actions-box">
                <h3><i class="fas fa-tasks"></i> ACCIONES REQUERIDAS</h3>
                <ul>
                    <li>Verificar la información del registro</li>
                    <li>Realizar seguimiento según el tipo de salida</li>
                    <li>Actualizar el estado cuando corresponda</li>
                    <li>Programar recordatorio para fecha de retorno</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <img src="https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png" 
                 alt="COMARRICO" class="footer-logo">
            <p><strong>${CONFIG_CORREOS.NOMBRE_SISTEMA}</strong></p>
            <p>Este es un correo automático del sistema. No responder a este mensaje.</p>
            <p style="margin-top: 10px; font-size: 11px; color: #adb5bd;">
                ID de registro: ${idRegistro} | ${fechaActual.toLocaleString('es-CO')}
            </p>
        </div>
    </div>
</body>
</html>`;
    
    // Enviar correo
    MailApp.sendEmail({
      to: destinatarios.to,
      cc: destinatarios.cc,
      subject: asunto,
      htmlBody: cuerpoHTML
    });
    
    Logger.log('✅ Correo de nuevo registro enviado a: ' + destinatarios.to);
    return true;
    
  } catch (error) {
    Logger.log('❌ Error enviando correo de nuevo registro: ' + error.toString());
    return false;
  }
}

// ============================================================
// 2. CORREO DE ALERTA (2 DÍAS ANTES DE VENCER)
// ============================================================

/**
 * Enviar correo cuando faltan 2 días para vencer
 * @param {Object} registro - Registro completo
 */
function enviarCorreoAlertaVencimiento(registro) {
  try {
    Logger.log('⏰ Enviando correo de alerta (2 días): ID ' + registro.ID);
    
    const destinatarios = obtenerDestinatariosCorreo(registro.Responsable);
    const diasRestantes = calcularDiasRestantes(registro['Tiempo Estimado de Retorno']);
    
    const asunto = `${CONFIG_CORREOS.ASUNTO_BASE} ⚠️ ALERTA: Producto por vencer en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'} - ${registro.Código || 'Sin código'}`;
    
    // Función para formatear fechas en español
    function formatearFechaES(fechaStr) {
      if (!fechaStr) return 'No especificada';
      try {
        if (typeof fechaStr === 'string' && fechaStr.includes('/')) {
          const [dia, mes, año] = fechaStr.split('/');
          const fecha = new Date(año, mes - 1, dia);
          const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          return fecha.toLocaleDateString('es-CO', opciones);
        }
        return fechaStr;
      } catch (e) {
        return fechaStr;
      }
    }
    
    // Texto según días restantes
    let textoAlerta, colorAlerta, icono;
    if (diasRestantes === 0) {
      textoAlerta = 'VENCE HOY';
      colorAlerta = '#EF4444';
      icono = 'fas fa-exclamation-triangle';
    } else if (diasRestantes === 1) {
      textoAlerta = 'VENCE MAÑANA';
      colorAlerta = '#F59E0B';
      icono = 'fas fa-exclamation-circle';
    } else {
      textoAlerta = `VENCE EN ${diasRestantes} DÍAS`;
      colorAlerta = '#F59E0B';
      icono = 'fas fa-clock';
    }
    
    const cuerpoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fffbf0;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header-alerta {
            background: linear-gradient(135deg, ${colorAlerta} 0%, ${colorAlerta}80 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header-alerta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png');
            background-size: 60px;
            background-position: 20px 20px;
            background-repeat: no-repeat;
            opacity: 0.1;
        }
        
        .alerta-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .header-alerta h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .header-alerta p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .alerta-box {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .alerta-box h2 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 20px;
        }
        
        .alerta-box p {
            color: #92400e;
            font-size: 16px;
            margin: 0;
        }
        
        .contador-dias {
            font-size: 42px;
            font-weight: 700;
            color: ${colorAlerta};
            margin: 10px 0;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .info-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            border-left: 4px solid #6c757d;
        }
        
        .info-card.producto {
            border-left-color: #FDB913;
        }
        
        .info-card.responsable {
            border-left-color: #3B82F6;
        }
        
        .info-card.fechas {
            border-left-color: #10B981;
        }
        
        .info-card h3 {
            font-size: 16px;
            color: #495057;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-item {
            margin-bottom: 12px;
        }
        
        .info-label {
            font-weight: 600;
            color: #6c757d;
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
        }
        
        .info-value {
            color: #212529;
            font-size: 15px;
            margin-left: 10px;
        }
        
        .acciones-urgentes {
            background: #fee2e2;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #EF4444;
        }
        
        .acciones-urgentes h3 {
            color: #991b1b;
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .acciones-urgentes ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .acciones-urgentes li {
            margin-bottom: 10px;
            color: #374151;
            font-size: 15px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .footer-logo {
            height: 40px;
            margin-bottom: 10px;
        }
        
        .estado-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #fef3c7;
            color: #92400e;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #f59e0b;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="email-container">
        <div class="header-alerta">
            <div class="alerta-icon">
                <i class="${icono}"></i>
            </div>
            <h1>${textoAlerta}</h1>
            <p>Sistema de Seguimiento de Productos - COMARRICO</p>
        </div>
        
        <div class="content">
            <div class="alerta-box">
                <h2><i class="fas fa-bell"></i> ALERTA DE VENCIMIENTO</h2>
                <p>El siguiente producto está por vencer:</p>
                <div class="contador-dias">
                    ${diasRestantes === 0 ? 'HOY' : diasRestantes === 1 ? 'MAÑANA' : `${diasRestantes} DÍAS`}
                </div>
                <p>${diasRestantes === 0 ? '¡Vence hoy!' : diasRestantes === 1 ? '¡Vence mañana!' : `Faltan ${diasRestantes} días para el vencimiento`}</p>
            </div>
            
            <div class="info-grid">
                <div class="info-card producto">
                    <h3><i class="fas fa-box"></i> PRODUCTO</h3>
                    <div class="info-item">
                        <span class="info-label">Código:</span>
                        <span class="info-value"><strong>${registro.Código || 'No especificado'}</strong></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${registro.NombreProducto || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tipo de Salida:</span>
                        <span class="info-value">${registro['Tipo de Salida'] || 'No especificado'}</span>
                    </div>
                </div>
                
                <div class="info-card responsable">
                    <h3><i class="fas fa-user"></i> RESPONSABLE</h3>
                    <div class="info-item">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value"><strong>${registro.Responsable || 'No especificado'}</strong></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estado Actual:</span>
                        <span class="info-value"><span class="estado-badge">${registro.Estado || 'No especificado'}</span></span>
                    </div>
                </div>
                
                <div class="info-card fechas">
                    <h3><i class="fas fa-calendar-alt"></i> FECHAS</h3>
                    <div class="info-item">
                        <span class="info-label">Fecha de Retiro:</span>
                        <span class="info-value">${formatearFechaES(registro['Fecha y Hora de Retiro']) || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha de Retorno:</span>
                        <span class="info-value"><strong style="color: ${colorAlerta};">${formatearFechaES(registro['Tiempo Estimado de Retorno']) || 'No especificada'}</strong></span>
                    </div>
                </div>
            </div>
            
            <div class="acciones-urgentes">
                <h3><i class="fas fa-bolt"></i> ACCIONES URGENTES</h3>
                <ul>
                    ${diasRestantes === 0 ? `
                    <li><strong>CONTACTAR INMEDIATAMENTE al responsable</strong></li>
                    <li>Verificar ubicación actual del producto</li>
                    <li>Coordinar retorno inmediato</li>
                    <li>Actualizar estado en el sistema</li>
                    ` : diasRestantes === 1 ? `
                    <li><strong>Contactar HOY al responsable</strong></li>
                    <li>Verificar disponibilidad del producto</li>
                    <li>Preparar documentación de devolución</li>
                    <li>Coordinar logística de retorno</li>
                    ` : `
                    <li>Contactar al responsable para coordinar retorno</li>
                    <li>Verificar disponibilidad del producto</li>
                    <li>Actualizar fecha de retorno si es necesario</li>
                    <li>Preparar documentación de devolución</li>
                    `}
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <img src="https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png" 
                 alt="COMARRICO" class="footer-logo">
            <p><strong>${CONFIG_CORREOS.NOMBRE_SISTEMA}</strong></p>
            <p>Este es un correo automático de alerta. No responder a este mensaje.</p>
            <p style="margin-top: 10px; font-size: 11px; color: #adb5bd;">
                ID de registro: ${registro.ID} | ${new Date().toLocaleString('es-CO')}
            </p>
        </div>
    </div>
</body>
</html>`;
    
    MailApp.sendEmail({
      to: destinatarios.to,
      cc: destinatarios.cc,
      subject: asunto,
      htmlBody: cuerpoHTML
    });
    
    Logger.log('✅ Correo de alerta enviado: ID ' + registro.ID);
    return true;
    
  } catch (error) {
    Logger.log('❌ Error enviando correo de alerta: ' + error.toString());
    return false;
  }
}

// Función auxiliar para calcular días restantes
function calcularDiasRestantes(fechaRetorno) {
  if (!fechaRetorno) return 0;
  
  try {
    let fechaRetornoDate;
    
    if (typeof fechaRetorno === 'string') {
      if (fechaRetorno.includes('/')) {
        const [dia, mes, año] = fechaRetorno.split('/');
        fechaRetornoDate = new Date(año, mes - 1, dia);
      } else if (fechaRetorno.includes('-')) {
        fechaRetornoDate = new Date(fechaRetorno);
      } else {
        fechaRetornoDate = new Date(fechaRetorno);
      }
    } else if (fechaRetorno instanceof Date) {
      fechaRetornoDate = fechaRetorno;
    } else {
      fechaRetornoDate = new Date(fechaRetorno);
    }
    
    fechaRetornoDate.setHours(0, 0, 0, 0);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTiempo = fechaRetornoDate.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
    
    return diffDias;
    
  } catch (error) {
    Logger.log('Error calculando días restantes: ' + error.toString());
    return 0;
  }
}

// ============================================================
// 3. CORREO DE PRODUCTO VENCIDO
// ============================================================

/**
 * Enviar correo cuando el producto ya está vencido
 * @param {Object} registro - Registro completo
 */
function enviarCorreoProductoVencido(registro) {
  try {
    Logger.log('🔴 Enviando correo de producto vencido: ID ' + registro.ID);
    
    const destinatarios = obtenerDestinatariosCorreo(registro.Responsable);
    const diasVencido = calcularDiasVencidoDesdeFecha(registro['Tiempo Estimado de Retorno']);
    
    // Texto en español para días vencidos
    let textoDiasVencido;
    if (diasVencido === 1) {
      textoDiasVencido = '1 día';
    } else if (diasVencido === 0) {
      textoDiasVencido = 'HOY';
    } else {
      textoDiasVencido = `${diasVencido} días`;
    }
    
    const asunto = `${CONFIG_CORREOS.ASUNTO_BASE} 🚨 URGENTE: PRODUCTO VENCIDO - ${registro.Código || 'Sin código'} (${diasVencido === 0 ? 'VENCE HOY' : `Vencido hace ${textoDiasVencido}`})`;
    
    // Función para formatear fechas en español
    function formatearFechaES(fechaStr) {
      if (!fechaStr) return 'No especificada';
      try {
        if (typeof fechaStr === 'string' && fechaStr.includes('/')) {
          const [dia, mes, año] = fechaStr.split('/');
          const fecha = new Date(año, mes - 1, dia);
          const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          };
          return fecha.toLocaleDateString('es-CO', opciones);
        }
        return fechaStr;
      } catch (e) {
        return fechaStr;
      }
    }
    
    const cuerpoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fef2f2;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header-urgente {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header-urgente::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png');
            background-size: 60px;
            background-position: 20px 20px;
            background-repeat: no-repeat;
            opacity: 0.1;
        }
        
        .urgente-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .header-urgente h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .header-urgente p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .alerta-critica {
            background: #fee2e2;
            border: 3px solid #EF4444;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .alerta-critica h2 {
            color: #991b1b;
            margin-bottom: 15px;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .alerta-critica p {
            color: #991b1b;
            font-size: 18px;
            margin: 0;
            font-weight: 600;
        }
        
        .contador-vencido {
            font-size: 48px;
            font-weight: 800;
            color: #EF4444;
            margin: 15px 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .info-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
        }
        
        .section-title {
            color: #374151;
            font-size: 18px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .producto-info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .info-item {
            margin-bottom: 15px;
        }
        
        .info-label {
            font-weight: 600;
            color: #6c757d;
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
        }
        
        .info-value {
            color: #212529;
            font-size: 16px;
            padding: 8px 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #dee2e6;
            margin-left: 10px;
        }
        
        .info-value.vencido {
            background: #fee2e2;
            border-color: #fca5a5;
            color: #b91c1c;
            text-decoration: line-through;
            font-weight: 600;
        }
        
        .info-value.urgente {
            background: #fef3c7;
            border-color: #f59e0b;
            color: #92400e;
            font-weight: 600;
        }
        
        .acciones-inmediatas {
            background: #fef3c7;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #F59E0B;
        }
        
        .acciones-inmediatas h3 {
            color: #92400e;
            margin-bottom: 15px;
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .acciones-inmediatas ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .acciones-inmediatas li {
            margin-bottom: 12px;
            color: #374151;
            font-size: 16px;
            padding: 8px 0;
            border-bottom: 1px solid #fde68a;
        }
        
        .acciones-inmediatas li:last-child {
            border-bottom: none;
        }
        
        .acciones-inmediatas li strong {
            color: #b45309;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .footer-logo {
            height: 40px;
            margin-bottom: 10px;
        }
        
        .estado-badge {
            display: inline-block;
            padding: 6px 15px;
            background: #fee2e2;
            color: #b91c1c;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            border: 2px solid #fca5a5;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px;
            }
            
            .producto-info-grid {
                grid-template-columns: 1fr;
            }
            
            .header-urgente h1 {
                font-size: 22px;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="email-container">
        <div class="header-urgente">
            <div class="urgente-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h1>PRODUCTO VENCIDO</h1>
            <p>Sistema de Seguimiento de Productos - COMARRICO</p>
        </div>
        
        <div class="content">
            <div class="alerta-critica">
                <h2><i class="fas fa-skull-crossbones"></i> ALERTA CRÍTICA</h2>
                <p>¡ATENCIÓN REQUERIDA DE INMEDIATO!</p>
                <div class="contador-vencido">
                    ${diasVencido === 0 ? 'HOY' : textoDiasVencido}
                </div>
                <p>${diasVencido === 0 ? '¡El producto vence hoy!' : `El producto lleva vencido ${diasVencido === 1 ? '1 día' : `${diasVencido} días`}!`}</p>
            </div>
            
            <div class="info-section">
                <h3 class="section-title"><i class="fas fa-box"></i> INFORMACIÓN DEL PRODUCTO</h3>
                
                <div class="producto-info-grid">
                    <div class="info-item">
                        <span class="info-label">ID del Registro:</span>
                        <span class="info-value urgente">#${registro.ID}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Código:</span>
                        <span class="info-value urgente">${registro.Código || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nombre del Producto:</span>
                        <span class="info-value urgente">${registro.NombreProducto || 'No especificado'}</span>
                    </div>
                </div>
                
                <div class="info-item">
                    <span class="info-label">Descripción:</span>
                    <span class="info-value">${registro.Descripción || 'No especificada'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Salida:</span>
                    <span class="info-value">${registro['Tipo de Salida'] || 'No especificado'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Responsable:</span>
                    <span class="info-value urgente"><strong>${registro.Responsable || 'No especificado'}</strong></span>
                </div>
            </div>
            
            <div class="info-section">
                <h3 class="section-title"><i class="fas fa-calendar-times"></i> FECHAS Y ESTADO</h3>
                
                <div class="producto-info-grid">
                    <div class="info-item">
                        <span class="info-label">Fecha de Retiro:</span>
                        <span class="info-value">${formatearFechaES(registro['Fecha y Hora de Retiro']) || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha de Retorno:</span>
                        <span class="info-value vencido">${formatearFechaES(registro['Tiempo Estimado de Retorno']) || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estado Actual:</span>
                        <span class="info-value"><span class="estado-badge">${registro.Estado || 'Vencido'}</span></span>
                    </div>
                </div>
            </div>
            
            <div class="acciones-inmediatas">
                <h3><i class="fas fa-bolt"></i> ACCIONES INMEDIATAS REQUERIDAS</h3>
                <ul>
                    <li><strong>Contactar INMEDIATAMENTE al responsable: ${registro.Responsable || 'No especificado'}</strong></li>
                    <li><strong>Verificar ubicación física del producto</strong></li>
                    <li><strong>Iniciar procedimiento de recuperación URGENTE</strong></li>
                    <li>Notificar a la gerencia sobre la situación</li>
                    <li>Actualizar el estado en el sistema como "Vencido"</li>
                    <li>Documentar las acciones tomadas en observaciones</li>
                    <li>Establecer nueva fecha de retorno si aplica</li>
                </ul>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <i class="fas fa-info-circle"></i> 
                    <strong>Nota:</strong> Este correo ha sido enviado a: ${destinatarios.to}, ${destinatarios.cc} 
                    y copia oculta a ${CONFIG_CORREOS.EMAIL_ADMIN}
                </p>
            </div>
        </div>
        
        <div class="footer">
            <img src="https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png" 
                 alt="COMARRICO" class="footer-logo">
            <p><strong>${CONFIG_CORREOS.NOMBRE_SISTEMA}</strong></p>
            <p>Este es un correo automático de ALERTA CRÍTICA. Acción inmediata requerida.</p>
            <p style="margin-top: 10px; font-size: 11px; color: #adb5bd;">
                ID de registro: ${registro.ID} | ${new Date().toLocaleString('es-CO')}
            </p>
        </div>
    </div>
</body>
</html>`;
    
    MailApp.sendEmail({
      to: destinatarios.to,
      cc: destinatarios.cc,
      bcc: CONFIG_CORREOS.EMAIL_ADMIN,
      subject: asunto,
      htmlBody: cuerpoHTML
    });
    
    // Registrar en observaciones
    guardarObservacion(
      registro.ID,
      registro.Estado || 'Desconocido',
      'Vencido',
      `Correo de producto vencido enviado. ${diasVencido === 1 ? '1 día vencido' : `${diasVencido} días vencido`}.`,
      'Sistema',
      ''
    );
    
    Logger.log('✅ Correo de producto vencido enviado: ID ' + registro.ID);
    return true;
    
  } catch (error) {
    Logger.log('❌ Error enviando correo de producto vencido: ' + error.toString());
    return false;
  }
}

// Función auxiliar para calcular días vencido
function calcularDiasVencidoDesdeFecha(fechaRetorno) {
  if (!fechaRetorno) return 0;
  
  try {
    let fechaRetornoDate;
    
    if (typeof fechaRetorno === 'string') {
      if (fechaRetorno.includes('/')) {
        const [dia, mes, año] = fechaRetorno.split('/');
        fechaRetornoDate = new Date(año, mes - 1, dia);
      } else if (fechaRetorno.includes('-')) {
        fechaRetornoDate = new Date(fechaRetorno);
      } else {
        fechaRetornoDate = new Date(fechaRetorno);
      }
    } else if (fechaRetorno instanceof Date) {
      fechaRetornoDate = fechaRetorno;
    } else {
      fechaRetornoDate = new Date(fechaRetorno);
    }
    
    fechaRetornoDate.setHours(0, 0, 0, 0);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTiempo = hoy.getTime() - fechaRetornoDate.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDias); // Retornar mínimo 0
    
  } catch (error) {
    Logger.log('Error calculando días vencido: ' + error.toString());
    return 0;
  }
} 

function obtenerDestinatariosCorreo(responsable) {
  try {
    // Intentar obtener email del responsable desde USUARIOS
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('USUARIOS');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() === responsable && data[i][4]) {
          // Si encontramos el responsable con email
          return {
            to: data[i][4].toString().trim(),
            cc: `${CONFIG_CORREOS.EMAIL_CALIDAD}, ${CONFIG_CORREOS.EMAIL_ADMIN}`
          };
        }
      }
    }
  } catch (error) {
    Logger.log('⚠️ No se pudo obtener email del responsable: ' + error.toString());
  }
  
  // Si no encuentra el responsable, enviar a calidad y admin
  return {
    to: CONFIG_CORREOS.EMAIL_CALIDAD,
    cc: CONFIG_CORREOS.EMAIL_ADMIN
  };
}

// ============================================================
// 4. CORREO DE PRODUCTO DEVUELTO
// ============================================================

/**
 * Enviar correo cuando el producto es marcado como Devuelto
 * @param {Object} registro - Registro completo
 * @param {string} devueltoA - A quién fue devuelto
 * @param {string} observaciones - Observaciones de la devolución
 * @param {string} usuario - Usuario que realiza el cambio
 */
function enviarCorreoProductoDevuelto(registro, devueltoA = '', observaciones = '', usuario = 'Sistema') {
  try {
    Logger.log('🔄 Enviando correo de producto devuelto: ID ' + registro.ID);
    
    const destinatarios = obtenerDestinatariosCorreo(registro.Responsable);
    
    const asunto = `${CONFIG_CORREOS.ASUNTO_BASE} ✅ PRODUCTO DEVUELTO - ${registro.Código || 'Sin código'}`;
    
    // Función para formatear fechas en español
    function formatearFechaES(fechaStr) {
      if (!fechaStr) return 'No especificada';
      try {
        if (typeof fechaStr === 'string') {
          // Si tiene formato dd/mm/yyyy HH:mm
          if (fechaStr.includes('/') && fechaStr.includes(':')) {
            const [fechaPart, horaPart] = fechaStr.split(' ');
            const [dia, mes, año] = fechaPart.split('/');
            const fecha = new Date(año, mes - 1, dia);
            const opciones = { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            };
            return `${fecha.toLocaleDateString('es-CO', opciones)} ${horaPart}`;
          }
          // Si es solo fecha dd/mm/yyyy
          else if (fechaStr.includes('/')) {
            const [dia, mes, año] = fechaStr.split('/');
            const fecha = new Date(año, mes - 1, dia);
            const opciones = { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            };
            return fecha.toLocaleDateString('es-CO', opciones);
          }
        }
        return fechaStr;
      } catch (e) {
        return fechaStr;
      }
    }
    
    // Calcular días de demora si hay
    let infoDemora = '';
    if (registro['Tiempo Estimado de Retorno']) {
      const diasDemora = calcularDiasDemoraDevolucion(
        registro['Tiempo Estimado de Retorno']
      );
      if (diasDemora > 0) {
        infoDemora = `<p style="color: #f59e0b; font-weight: 600; margin: 10px 0;">
          ⏰ <strong>Demora:</strong> ${diasDemora} ${diasDemora === 1 ? 'día' : 'días'} después de la fecha estimada
        </p>`;
      } else if (diasDemora < 0) {
        const diasAntes = Math.abs(diasDemora);
        infoDemora = `<p style="color: #10b981; font-weight: 600; margin: 10px 0;">
          🎉 <strong>Anticipación:</strong> ${diasAntes} ${diasAntes === 1 ? 'día' : 'días'} antes de la fecha estimada
        </p>`;
      } else {
        infoDemora = `<p style="color: #10b981; font-weight: 600; margin: 10px 0;">
          ⏰ <strong>Devuelto justo a tiempo</strong>
        </p>`;
      }
    }
    
    const cuerpoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f0fdf4;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header-devolucion {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header-devolucion::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png');
            background-size: 60px;
            background-position: 20px 20px;
            background-repeat: no-repeat;
            opacity: 0.1;
        }
        
        .devolucion-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .header-devolucion h1 {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header-devolucion p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .confirmacion-box {
            background: #d1fae5;
            border: 2px solid #10B981;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .confirmacion-box h2 {
            color: #065f46;
            margin-bottom: 15px;
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .confirmacion-box p {
            color: #065f46;
            font-size: 18px;
            margin: 0;
            font-weight: 600;
        }
        
        .check-animation {
            font-size: 64px;
            color: #10B981;
            margin: 15px 0;
            animation: checkmark 0.5s ease-in-out;
        }
        
        @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .info-card {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
        }
        
        .info-card.producto {
            border-left: 4px solid #FDB913;
        }
        
        .info-card.responsable {
            border-left: 4px solid #3B82F6;
        }
        
        .info-card.devolucion {
            border-left: 4px solid #10B981;
        }
        
        .info-card h3 {
            font-size: 16px;
            color: #495057;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-item {
            margin-bottom: 12px;
        }
        
        .info-label {
            font-weight: 600;
            color: #6c757d;
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
        }
        
        .info-value {
            color: #212529;
            font-size: 15px;
        }
        
        .info-value.destacado {
            background: #d1fae5;
            border: 1px solid #10B981;
            border-radius: 6px;
            padding: 8px 12px;
            font-weight: 600;
            color: #065f46;
        }
        
        .detalles-devolucion {
            background: #ecfdf5;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            border-left: 4px solid #10B981;
        }
        
        .detalles-devolucion h3 {
            color: #065f46;
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .observaciones-box {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            border: 1px solid #d1fae5;
        }
        
        .observaciones-box p {
            margin: 0;
            color: #374151;
            font-style: italic;
            line-height: 1.6;
        }
        
        .resumen-cierre {
            background: #fef3c7;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #F59E0B;
        }
        
        .resumen-cierre h3 {
            color: #92400e;
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .resumen-cierre ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .resumen-cierre li {
            margin-bottom: 10px;
            color: #374151;
            font-size: 15px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .footer-logo {
            height: 40px;
            margin-bottom: 10px;
        }
        
        .estado-badge {
            display: inline-block;
            padding: 6px 15px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            border: 2px solid #10B981;
        }
        
        .usuario-info {
            background: #e0f2fe;
            border-radius: 8px;
            padding: 12px;
            margin-top: 10px;
            font-size: 13px;
            color: #0369a1;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .header-devolucion h1 {
                font-size: 22px;
            }
        }
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="email-container">
        <div class="header-devolucion">
            <div class="devolucion-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>PRODUCTO DEVUELTO</h1>
            <p>Sistema de Seguimiento de Productos - COMARRICO</p>
        </div>
        
        <div class="content">
            <div class="confirmacion-box">
                <h2><i class="fas fa-check-double"></i> DEVOLUCIÓN CONFIRMADA</h2>
                <div class="check-animation">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p>✅ El producto ha sido devuelto exitosamente</p>
                ${infoDemora}
                <p style="margin-top: 15px; font-size: 16px;">
                    <i class="fas fa-calendar-check"></i> 
                    Fecha de devolución: ${new Date().toLocaleDateString('es-CO', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
            
            <div class="info-grid">
                <div class="info-card producto">
                    <h3><i class="fas fa-box"></i> PRODUCTO DEVUELTO</h3>
                    <div class="info-item">
                        <span class="info-label">ID del Registro:</span>
                        <span class="info-value">#${registro.ID}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Código:</span>
                        <span class="info-value"><strong>${registro.Código || 'No especificado'}</strong></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${registro.NombreProducto || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tipo de Salida:</span>
                        <span class="info-value">${registro['Tipo de Salida'] || 'No especificado'}</span>
                    </div>
                </div>
                
                <div class="info-card responsable">
                    <h3><i class="fas fa-user-check"></i> RESPONSABLE</h3>
                    <div class="info-item">
                        <span class="info-label">Responsable:</span>
                        <span class="info-value"><strong>${registro.Responsable || 'No especificado'}</strong></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estado Final:</span>
                        <span class="info-value"><span class="estado-badge">DEVUELTO</span></span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ubicación/Pasillo:</span>
                        <span class="info-value">${registro['Pasillo/Ubicación'] || 'No especificado'}</span>
                    </div>
                </div>
                
                <div class="info-card devolucion">
                    <h3><i class="fas fa-people-carry"></i> DETALLE DEVOLUCIÓN</h3>
                    <div class="info-item">
                        <span class="info-label">Devuelto a:</span>
                        <span class="info-value destacado">${devueltoA || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha de Retiro:</span>
                        <span class="info-value">${formatearFechaES(registro['Fecha y Hora de Retiro']) || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha Estimada Retorno:</span>
                        <span class="info-value">${formatearFechaES(registro['Tiempo Estimado de Retorno']) || 'No especificada'}</span>
                    </div>
                </div>
            </div>
            
            ${observaciones ? `
            <div class="detalles-devolucion">
                <h3><i class="fas fa-clipboard-check"></i> OBSERVACIONES DE LA DEVOLUCIÓN</h3>
                <div class="observaciones-box">
                    <p>"${observaciones}"</p>
                </div>
                <div class="usuario-info">
                    <i class="fas fa-user-edit"></i> Registrado por: ${usuario} | ${new Date().toLocaleString('es-CO')}
                </div>
            </div>
            ` : ''}
            
            <div class="resumen-cierre">
                <h3><i class="fas fa-clipboard-list"></i> RESUMEN DEL PROCESO</h3>
                <ul>
                    <li>✅ Producto devuelto y recibido correctamente</li>
                    <li>✅ Estado actualizado en el sistema</li>
                    <li>✅ Registro completado en el historial</li>
                    <li>✅ Notificaciones enviadas a las partes interesadas</li>
                    <li>✅ Proceso de seguimiento finalizado</li>
                </ul>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <i class="fas fa-info-circle"></i> 
                    <strong>Este registro ha sido completado exitosamente.</strong> 
                    No se requieren más acciones para este producto.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <img src="https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png" 
                 alt="COMARRICO" class="footer-logo">
            <p><strong>${CONFIG_CORREOS.NOMBRE_SISTEMA}</strong></p>
            <p>Este es un correo automático de confirmación de devolución.</p>
            <p style="margin-top: 10px; font-size: 11px; color: #adb5bd;">
                ID de registro: ${registro.ID} | Proceso completado: ${new Date().toLocaleString('es-CO')}
            </p>
        </div>
    </div>
</body>
</html>`;
    
    // Enviar correo
    MailApp.sendEmail({
      to: destinatarios.to,
      cc: destinatarios.cc,
      bcc: CONFIG_CORREOS.EMAIL_ADMIN,
      subject: asunto,
      htmlBody: cuerpoHTML
    });
    
    // Registrar en observaciones
    guardarObservacion(
      registro.ID,
      registro.Estado || 'Desconocido',
      'Devuelto',
      `Correo de devolución enviado. Devuelto a: ${devueltoA}. Observaciones: ${observaciones || 'Ninguna'}`,
      usuario,
      devueltoA
    );
    
    Logger.log('✅ Correo de producto devuelto enviado: ID ' + registro.ID);
    return true;
    
  } catch (error) {
    Logger.log('❌ Error enviando correo de producto devuelto: ' + error.toString());
    return false;
  }
}

// Función auxiliar para calcular días de demora en devolución
function calcularDiasDemoraDevolucion(fechaEstimadaRetorno) {
  if (!fechaEstimadaRetorno) return 0;
  
  try {
    let fechaEstimada;
    
    if (typeof fechaEstimadaRetorno === 'string') {
      if (fechaEstimadaRetorno.includes('/')) {
        const [dia, mes, año] = fechaEstimadaRetorno.split('/');
        fechaEstimada = new Date(año, mes - 1, dia);
      } else if (fechaEstimadaRetorno.includes('-')) {
        fechaEstimada = new Date(fechaEstimadaRetorno);
      } else {
        fechaEstimada = new Date(fechaEstimadaRetorno);
      }
    } else if (fechaEstimadaRetorno instanceof Date) {
      fechaEstimada = fechaEstimadaRetorno;
    } else {
      fechaEstimada = new Date(fechaEstimadaRetorno);
    }
    
    fechaEstimada.setHours(0, 0, 0, 0);
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const diffTiempo = hoy.getTime() - fechaEstimada.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
    
    return diffDias; // Positivo = demora, Negativo = anticipación, 0 = justo a tiempo
    
  } catch (error) {
    Logger.log('Error calculando días de demora: ' + error.toString());
    return 0;
  }
}