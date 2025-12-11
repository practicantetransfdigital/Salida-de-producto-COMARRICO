// ============================================================
// BACKEND - VERSIÓN CON MÁXIMA COMPATIBILIDAD
// ============================================================

const SPREADSHEET_ID = '1VG8G0rYpXQ9yPk8zcV4qZrxbSDf8u8Cfb3XWsgKffvY';

// ============================================================
// FUNCIONES BÁSICAS CON MÁXIMA ESTABILIDAD
// ============================================================

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    Logger.log('ERROR CRÍTICO: No se pudo abrir el spreadsheet: ' + e.toString());
    throw new Error('No se pudo acceder a la base de datos. Contacte al administrador.');
  }
}

function getSheet(sheetName) {
  try {
    var sheet = getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('La hoja ' + sheetName + ' no existe');
    }
    return sheet;
  } catch (e) {
    Logger.log('ERROR: No se pudo obtener la hoja ' + sheetName + ': ' + e.toString());
    throw e;
  }
}

// ============================================================
// SERVIR LA APLICACIÓN WEB
// ============================================================

function doGet() {
  const title = 'SDP - COMARRICO';
  const faviconUrl = 'https://comarrico.com/wp-content/uploads/2022/02/cropped-Logo-menu-comarrico-150x150.png';
  
  return HtmlService.createTemplateFromFile('html/index')
    .evaluate()
    .setTitle(title)
    .setFaviconUrl(faviconUrl)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// AUTENTICACIÓN - VERSIÓN SUPER ESTABLE
// ============================================================

function autenticarUsuario(usuario, contrasena) {
  Logger.log('🔐 Intentando autenticar usuario: ' + usuario);
  
  try {
    var sheet = getSheet('USUARIOS');
    var data = sheet.getDataRange().getValues();
    
    Logger.log('📊 Filas en USUARIOS: ' + data.length);
    
    // Buscar usuario (empezar desde fila 1 para saltar encabezados)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[0].toString().trim() !== '' && 
          row[0].toString().toLowerCase() === usuario.toLowerCase() && 
          row[1] === contrasena) {
        
        Logger.log('✅ Usuario autenticado: ' + row[0]);
        return {
          success: true,
          usuario: row[0],
          rol: row[2] || 'Usuario',
          nombre: row[3] || row[0]
        };
      }
    }
    
    Logger.log('❌ Credenciales incorrectas para: ' + usuario);
    return { 
      success: false, 
      message: 'Usuario o contraseña incorrectos' 
    };
    
  } catch (error) {
    Logger.log('❌ ERROR en autenticación: ' + error.toString());
    return { 
      success: false, 
      message: 'Error del sistema: ' + error.message 
    };
  }
}

// ============================================================
// DASHBOARD - VERSIÓN CON MÁXIMA ESTABILIDAD
// ============================================================

function obtenerDatosDashboard() {
  Logger.log('📊 INICIANDO: obtenerDatosDashboard');
  
  try {
    var sheet = getSheet('SALIDAS', true);
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    
    Logger.log('📈 SALIDAS - Filas: ' + lastRow + ', Columnas: ' + lastColumn);
    
    // Si no hay datos, retornar estructura vacía
    if (lastRow <= 1) {
      Logger.log('ℹ️ No hay datos en SALIDAS, retornando estructura vacía');
      return JSON.stringify({
        success: true,
        registros: [],
        estadisticas: {
          totalSalidas: 0,
          porTipoSalida: {},
          porTipoPlaga: {},
          porPasillo: {},
          porEstado: {},
          ultimosRegistros: []
        },
        mensaje: 'No hay registros en el sistema'
      });
    }
    
    // Obtener datos
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    Logger.log('📋 Encabezados: ' + JSON.stringify(headers));
    
    var registros = [];
    
    // Procesar registros con nueva estructura
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[0].toString().trim() !== '') { // Si tiene ID válido
        var registro = {};
        for (var j = 0; j < headers.length; j++) {
          var headerName = headers[j];
          // Corregir nombre de fecha para coincidir con frontend
          if (headerName === 'Fecha') {
            registro['Fecha y Hora de Retiro'] = row[j];
          } else {
            registro[headerName] = row[j];
          }
        }
        registros.push(registro);
      }
    }
    
    Logger.log('✅ Registros procesados: ' + registros.length);
    
    // Calcular estadísticas
    var estadisticas = calcularEstadisticas(registros);
    
    var respuesta = {
      success: true,
      registros: registros,
      estadisticas: estadisticas,
      total: registros.length,
      debug: {
        timestamp: new Date().toISOString(),
        version: '2.0-con-nombre'
      }
    };
    
    Logger.log('📦 Respuesta preparada, enviando al frontend');
    return JSON.stringify(respuesta);
    
  } catch (error) {
    Logger.log('❌ ERROR CRÍTICO en obtenerDatosDashboard: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return JSON.stringify({
      success: false,
      message: 'Error del sistema: ' + error.message,
      debug: {
        error: error.toString()
      }
    });
  }
}

function formatDateForFrontend(dateValue) {
  if (!dateValue) return '';
  
  try {
    if (typeof dateValue === 'string') {
      return dateValue; // Ya está formateada
    }
    
    var date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return dateValue.toString();
    }
    
    var dia = ('0' + date.getDate()).slice(-2);
    var mes = ('0' + (date.getMonth() + 1)).slice(-2);
    var año = date.getFullYear();
    var hora = ('0' + date.getHours()).slice(-2);
    var minuto = ('0' + date.getMinutes()).slice(-2);
    
    return dia + '/' + mes + '/' + año + ' ' + hora + ':' + minuto;
  } catch (e) {
    return dateValue.toString();
  }
}

function calcularEstadisticas(registros) {
  var stats = {
    totalSalidas: registros.length,
    porTipoSalida: {},
    porTipoPlaga: {},
    porPasillo: {},
    porEstado: {},
    ultimosRegistros: []
  };
  
  for (var i = 0; i < registros.length; i++) {
    var registro = registros[i];
    
    // Contar por tipo de salida
    var tipoSalida = registro['Tipo de Salida'] || 'Sin especificar';
    stats.porTipoSalida[tipoSalida] = (stats.porTipoSalida[tipoSalida] || 0) + 1;
    
    // CORRECCIÓN: Contar TODOS los tipos de plaga, incluyendo N/A
    var tipoPlaga = registro['Tipo de Plaga/Hallazgo'] || 'N/A';
    stats.porTipoPlaga[tipoPlaga] = (stats.porTipoPlaga[tipoPlaga] || 0) + 1;
    
    // Contar por pasillo
    var pasillo = registro['Pasillo/Ubicación'] || 'Sin especificar';
    stats.porPasillo[pasillo] = (stats.porPasillo[pasillo] || 0) + 1;
    
    // Contar por estado
    var estado = registro['Estado'] || 'Sin especificar';
    stats.porEstado[estado] = (stats.porEstado[estado] || 0) + 1;
  }
  
  // Últimos 10 registros (más recientes primero)
  var ultimosCount = Math.min(20, registros.length);
  for (var i = registros.length - ultimosCount; i < registros.length; i++) {
    stats.ultimosRegistros.unshift(registros[i]);
  }
  
  return stats;
}

// ============================================================
// REGISTRAR SALIDA - VERSIÓN ESTABLE
// ============================================================

function registrarSalida(datos) {
  Logger.log('➕ Registrando nueva salida: ' + JSON.stringify(datos));
  
  try {
    var sheet = getSheet('SALIDAS');
    var lastRow = sheet.getLastRow();
    var nuevoID = 1;
    
    if (lastRow > 1) {
      var lastID = sheet.getRange(lastRow, 1).getValue();
      nuevoID = parseInt(lastID) + 1;
    }
    
    Logger.log('🆕 Nuevo ID: ' + nuevoID);
    
    // Formatear fechas
    var fechaActual = new Date();
    var fechaFormateada = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    
    // CORRECCIÓN: Manejar fecha de retorno correctamente
    var fechaRetorno = datos['Fecha Estimada de Retorno'];
    var fechaRetornoFormateada = '';
    
    if (fechaRetorno) {
      try {
        // Usar la fecha directamente sin conversiones que puedan cambiar la zona horaria
        var fechaRetornoObj = new Date(fechaRetorno + 'T00:00:00');
        fechaRetornoFormateada = Utilities.formatDate(fechaRetornoObj, Session.getScriptTimeZone(), 'dd/MM/yyyy');
        Logger.log('📅 Fecha de retorno procesada: ' + fechaRetornoFormateada);
      } catch (e) {
        Logger.log('❌ Error formateando fecha de retorno: ' + e.toString());
        fechaRetornoFormateada = fechaRetorno; // Guardar como string si hay error
      }
    }
    
    // Determinar estado inicial (verificar si ya está vencido)
    var estado = datos['Estado'] || 'En Revisión';
    if (fechaRetorno) {
      try {
        var fechaRetornoDate = new Date(fechaRetorno + 'T00:00:00');
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaRetornoDate < hoy) {
          estado = 'Vencido';
          Logger.log('⚠️ Registro marcado como Vencido automáticamente');
        }
      } catch (e) {
        Logger.log('❌ Error verificando vencimiento: ' + e.toString());
      }
    }
    
    var nuevaFila = [
      nuevoID,
      (datos['Código'] || '').toString().trim(),
      (datos['NombreProducto'] || '').toString().trim(),
      (datos['Descripción'] || '').toString().trim(),
      datos['Tipo de Salida'] || '',
      datos['Tipo de Plaga/Hallazgo'] || 'N/A',
      fechaFormateada,
      (datos['Responsable'] || '').toString().trim(),
      datos['Pasillo/Ubicación'] || '',
      fechaRetornoFormateada,
      estado
    ];
    
    Logger.log('📝 Insertando fila: ' + JSON.stringify(nuevaFila));
    sheet.appendRow(nuevaFila);
    
    return {
      success: true,
      message: 'Salida registrada correctamente',
      id: nuevoID,
      estado: estado
    };
    
  } catch (error) {
    Logger.log('❌ ERROR registrando salida: ' + error.toString());
    
    return {
      success: false,
      message: 'Error al registrar: ' + error.message
    };
  }
}

// ============================================================
// FUNCIONES DE DIAGNÓSTICO
// ============================================================

function actualizarEstadoRegistro(id, nuevoEstado, observaciones, usuario = 'Sistema') {
  try {
    const sheet = getSheet('SALIDAS');
    const data = sheet.getDataRange().getValues();
    
    let estadoAnterior = '';
    let filaIndex = -1;
    
    // Buscar la fila con el ID y obtener estado anterior
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        estadoAnterior = data[i][10] || 'Desconocido'; 
        filaIndex = i + 1;
        break;
      }
    }
    
    if (filaIndex === -1) {
      return { success: false, message: 'No se encontró el registro' };
    }
    
    // Actualizar estado en hoja SALIDAS (columna 11, índice 10)
    sheet.getRange(filaIndex, 11).setValue(nuevoEstado);
    
    // Guardar observación en hoja OBSERVACIONES
    const resultadoObservacion = guardarObservacion(
      id, 
      estadoAnterior, 
      nuevoEstado, 
      observaciones,
      usuario
    );
    
    Logger.log(`✅ Estado actualizado: ID ${id} - ${estadoAnterior} → ${nuevoEstado} por ${usuario}`);
    
    return { 
      success: true, 
      message: 'Estado actualizado correctamente',
      idObservacion: resultadoObservacion.id
    };
    
  } catch (error) {
    Logger.log('❌ Error actualizando estado: ' + error.toString());
    return { success: false, message: 'Error: ' + error.message };
  }
}

function guardarObservacion(idRegistro, estadoAnterior, estadoNuevo, observaciones, usuario = 'Sistema') {
  try {
    const sheet = getSheet('OBSERVACIONES', true);
    const lastRow = sheet.getLastRow();
    const nuevoID = lastRow > 1 ? parseInt(sheet.getRange(lastRow, 1).getValue()) + 1 : 1;
    
    const fechaActual = new Date();
    const fechaFormateada = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    
    const nuevaFila = [
      nuevoID,
      idRegistro,
      estadoAnterior,
      estadoNuevo,
      observaciones || '',
      fechaFormateada,
      usuario
    ];
    
    sheet.appendRow(nuevaFila);
    
    Logger.log(`✅ Observación guardada: ID ${idRegistro} - ${estadoAnterior} → ${estadoNuevo}`);
    return { success: true, id: nuevoID };
    
  } catch (error) {
    Logger.log('❌ Error guardando observación: ' + error.toString());
    return { success: false, message: 'Error: ' + error.message };
  }
}

function obtenerObservacionesRegistro(idRegistro) {
  try {
    console.log('🔍 Buscando observaciones para ID:', idRegistro);
    
    const sheet = getSheet('OBSERVACIONES', true);
    const data = sheet.getDataRange().getValues();
    
    console.log('📊 Total de filas en OBSERVACIONES:', data.length);
    
    // Si solo hay encabezados, retornar array vacío
    if (data.length <= 1) {
      console.log('ℹ️ No hay observaciones registradas');
      return JSON.stringify({
        success: true,
        observaciones: []
      });
    }
    
    const observaciones = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      // Verificar que la fila tenga datos y que el ID coincida
      if (row[0] && row[1] && row[1].toString() === idRegistro.toString()) {
        observaciones.push({
          id: row[0],
          idRegistro: row[1],
          estadoAnterior: row[2] || 'Desconocido',
          estadoNuevo: row[3] || 'Desconocido',
          observaciones: row[4] || '',
          fecha: row[5] || new Date().toISOString(),
          usuario: row[6] || 'Sistema'
        });
      }
    }
    
    console.log('✅ Observaciones encontradas:', observaciones.length);
    
    // Ordenar por fecha (más reciente primero)
    observaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    return JSON.stringify({
      success: true,
      observaciones: observaciones,
      total: observaciones.length
    });
    
  } catch (error) {
    console.error('❌ ERROR en obtenerObservacionesRegistro:', error);
    return JSON.stringify({
      success: false,
      message: 'Error al obtener observaciones: ' + error.message,
      observaciones: []
    });
  }
}

// ============================================================
// ACTUALIZAR REGISTRO COMPLETO
// ============================================================

function actualizarRegistroCompleto(datosActualizados) {
  Logger.log('✏️ Actualizando registro completo:', datosActualizados);
  
  try {
    const sheet = getSheet('SALIDAS');
    const data = sheet.getDataRange().getValues();
    
    let filaIndex = -1;
    
    // Buscar la fila con el ID
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == datosActualizados.ID) {
        filaIndex = i + 1;
        break;
      }
    }
    
    if (filaIndex === -1) {
      return { success: false, message: 'No se encontró el registro' };
    }
    
    // Mapear campos a columnas
    const columnas = {
      'Código': 2,               // Columna B
      'NombreProducto': 3,       // Columna C
      'Descripción': 4,          // Columna D
      'Tipo de Salida': 5,       // Columna E
      'Tipo de Plaga/Hallazgo': 6, // Columna F
      'Responsable': 8,          // Columna H
      'Pasillo/Ubicación': 9,    // Columna I
      'Tiempo Estimado de Retorno': 10, // Columna J
      'Fecha y Hora de Retiro': 7      // Columna G
    };
    
    // Actualizar cada campo
    for (const [campo, columna] of Object.entries(columnas)) {
      if (datosActualizados[campo] !== undefined) {
        const valor = datosActualizados[campo];
        
        // CORRECCIÓN: Para fechas, usar el valor tal como viene
        // Ya viene formateado como dd/mm/yyyy o dd/mm/yyyy HH:mm
        sheet.getRange(filaIndex, columna).setValue(valor);
        Logger.log(`✅ Actualizado ${campo} en columna ${columna}: ${valor}`);
      }
    }
    
    return { 
      success: true, 
      message: 'Registro actualizado correctamente',
      id: datosActualizados.ID
    };
    
  } catch (error) {
    Logger.log('❌ Error actualizando registro completo: ' + error.toString());
    return { success: false, message: 'Error: ' + error.message };
  }
}

// Función para formatear fecha para input datetime-local
function formatearFechaParaInput(fechaStr, esSoloFecha = false) {
  if (!fechaStr) return '';
  
  try {
    let fecha;
    
    // Si viene como dd/mm/yyyy HH:mm
    if (fechaStr.includes('/') && fechaStr.includes(':')) {
      const [fechaPart, horaPart] = fechaStr.split(' ');
      const [dia, mes, año] = fechaPart.split('/');
      const [horas, minutos] = horaPart.split(':');
      
      fecha = new Date(
        parseInt(año),
        parseInt(mes) - 1,
        parseInt(dia),
        parseInt(horas),
        parseInt(minutos)
      );
    }
    // Si viene como dd/mm/yyyy
    else if (fechaStr.includes('/')) {
      const [dia, mes, año] = fechaStr.split('/');
      fecha = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    }
    // Si ya es objeto Date
    else if (fechaStr instanceof Date) {
      fecha = fechaStr;
    }
    // Cualquier otro formato
    else {
      fecha = new Date(fechaStr);
    }
    
    if (isNaN(fecha.getTime())) return '';
    
    // Formatear según el tipo de input
    if (esSoloFecha) {
      // Para input type="date" (YYYY-MM-DD)
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else {
      // Para input type="datetime-local" (YYYY-MM-DDTHH:mm)
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      const hours = String(fecha.getHours()).padStart(2, '0');
      const minutes = String(fecha.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return '';
  }
}

// ============================================
// GOOGLE APPS SCRIPT - FUNCIONES DEL SERVIDOR
// ============================================

/**
 * Normaliza una ubicación (igual que en JavaScript)
 */
function normalizarUbicacionAppsScript(texto) {
  if (!texto || typeof texto !== 'string') return 'SIN ESPECIFICAR';
  
  // Convertir a mayúsculas
  let normalizado = texto.toUpperCase();
  
  // Quitar tildes
  normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Eliminar caracteres especiales
  normalizado = normalizado.replace(/[^A-Z0-9\s\-]/g, '');
  
  // Eliminar espacios múltiples
  normalizado = normalizado.replace(/\s+/g, ' ').trim();
  
  return normalizado || 'SIN ESPECIFICAR';
}

/**
 * Función para normalizar todos los registros existentes
 */
function normalizarTodosLosRegistros() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registros');
    if (!sheet) {
      return { success: false, message: 'No se encontró la hoja de registros' };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Encontrar índice de la columna de ubicación
    const ubicacionIndex = headers.indexOf('Pasillo/Ubicación');
    
    if (ubicacionIndex === -1) {
      return { success: false, message: 'No se encontró la columna Pasillo/Ubicación' };
    }
    
    let cambios = 0;
    
    // Normalizar desde la fila 2 (después de headers)
    for (let i = 1; i < data.length; i++) {
      const valorOriginal = data[i][ubicacionIndex];
      
      if (valorOriginal && typeof valorOriginal === 'string') {
        const valorNormalizado = normalizarUbicacionAppsScript(valorOriginal);
        
        // Solo actualizar si hay cambio
        if (valorOriginal !== valorNormalizado) {
          sheet.getRange(i + 1, ubicacionIndex + 1).setValue(valorNormalizado);
          cambios++;
          
          // Actualizar también la columna Pasillo si existe
          const pasilloIndex = headers.indexOf('Pasillo');
          if (pasilloIndex !== -1) {
            sheet.getRange(i + 1, pasilloIndex + 1).setValue(valorNormalizado);
          }
        }
      }
    }
    
    // También normalizar columnas de Responsable y Tipo de Salida
    const responsableIndex = headers.indexOf('Responsable');
    if (responsableIndex !== -1) {
      for (let i = 1; i < data.length; i++) {
        const valor = data[i][responsableIndex];
        if (valor && typeof valor === 'string') {
          sheet.getRange(i + 1, responsableIndex + 1).setValue(valor.toUpperCase());
        }
      }
    }
    
    const tipoSalidaIndex = headers.indexOf('Tipo de Salida');
    if (tipoSalidaIndex !== -1) {
      for (let i = 1; i < data.length; i++) {
        const valor = data[i][tipoSalidaIndex];
        if (valor && typeof valor === 'string') {
          sheet.getRange(i + 1, tipoSalidaIndex + 1).setValue(valor.toUpperCase());
        }
      }
    }
    
    return {
      success: true,
      message: `Normalizados ${cambios} registros de ubicación y otros campos`,
      totalRegistros: data.length - 1
    };
    
  } catch (error) {
    console.error('Error normalizando registros:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}

/**
 * Función para obtener estadísticas cruzadas
 */
function obtenerEstadisticasCruzadas() {
  try {
    const registros = obtenerRegistrosCompletos();
    
    const estadisticas = {
      topUbicaciones: [],
      ubicacionesConPlagas: {},
      conteoTotal: {}
    };
    
    // Procesar registros
    registros.forEach(registro => {
      const ubicacion = registro['Pasillo/Ubicación'] || 'SIN ESPECIFICAR';
      const plaga = registro['Tipo de Plaga/Hallazgo'] || 'N/A';
      
      if (plaga && plaga !== 'N/A' && plaga !== 'Sin novedad') {
        // Conteo total por ubicación
        estadisticas.conteoTotal[ubicacion] = (estadisticas.conteoTotal[ubicacion] || 0) + 1;
        
        // Detalle por ubicación y plaga
        if (!estadisticas.ubicacionesConPlagas[ubicacion]) {
          estadisticas.ubicacionesConPlagas[ubicacion] = {};
        }
        
        estadisticas.ubicacionesConPlagas[ubicacion][plaga] = 
          (estadisticas.ubicacionesConPlagas[ubicacion][plaga] || 0) + 1;
      }
    });
    
    // Ordenar ubicaciones por cantidad
    const topUbicaciones = Object.entries(estadisticas.conteoTotal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ubicacion, cantidad]) => ({ ubicacion, cantidad }));
    
    estadisticas.topUbicaciones = topUbicaciones;
    
    return {
      success: true,
      data: estadisticas
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas cruzadas:', error);
    return {
      success: false,
      message: error.toString()
    };
  }
}