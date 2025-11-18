

const SPREADSHEET_ID = '1VG8G0rYpXQ9yPk8zcV4qZrxbSDf8u8Cfb3XWsgKffvY';


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
    var sheet = getSheet('SALIDAS');
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
    
    // Procesar registros
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0] && row[0].toString().trim() !== '') { // Si tiene ID válido
        var registro = {};
        for (var j = 0; j < headers.length; j++) {
          var headerName = headers[j];
          // Asegurar compatibilidad con frontend
          if (headerName === 'Fecha') {
            registro['Fecha y Hora de Retiro'] = formatDateForFrontend(row[j]);
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
        version: '2.0-stable'
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
  var ultimosCount = Math.min(10, registros.length);
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
    
    // Calcular nuevo ID
    if (lastRow > 1) {
      var lastID = sheet.getRange(lastRow, 1).getValue();
      nuevoID = parseInt(lastID) + 1;
    }
    
    Logger.log('🆕 Nuevo ID: ' + nuevoID);
    
    // Formatear fecha
    var fechaActual = new Date();
    var fechaFormateada = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    
    var nuevaFila = [
      nuevoID,
      (datos['Código'] || '').toString().trim(),
      (datos['Descripción'] || '').toString().trim(),
      datos['Tipo de Salida'] || '',
      datos['Tipo de Plaga/Hallazgo'] || 'N/A',
      fechaFormateada,
      (datos['Responsable'] || '').toString().trim(),
      datos['Pasillo/Ubicación'] || '',
      datos['Tiempo Estimado de Retorno'] || '',
      datos['Estado'] || 'En Revisión'
    ];
    
    Logger.log('📝 Insertando fila: ' + JSON.stringify(nuevaFila));
    sheet.appendRow(nuevaFila);
    
    // ✅ CORRECCIÓN: Devolver OBJETO directamente, NO string JSON
    return {
      success: true,
      message: 'Salida registrada correctamente',
      id: nuevoID
    };
    
  } catch (error) {
    Logger.log('❌ ERROR registrando salida: ' + error.toString());
    
    // ✅ CORRECCIÓN: Devolver OBJETO directamente
    return {
      success: false,
      message: 'Error al registrar: ' + error.message
    };
  }
}

// ============================================================
// OBTENER OPCIONES
// ============================================================

function obtenerOpciones() {
  return {
    success: true,
    tiposSalida: [
      'Control de Calidad',
      'Gasificación',
      'Destrucción',
      'Para Revisión',
      'Reproceso',
      'Devolución a Proveedor',
      'Otro'
    ],
    tiposPlagas: [
      'N/A',
      'Insectos',
      'Roedores',
      'Hongos',
      'Contaminación',
      'Otro'
    ],
    estados: [
      'En Revisión',
      'Devuelto',
      'Pendiente por Devolución',
      'Procesado',
      'Destruido'
    ]
  };
}

// ============================================================
// FUNCIONES DE DIAGNÓSTICO
// ============================================================

function testConexionBasica() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheets = spreadsheet.getSheets();
    var sheetNames = sheets.map(function(sheet) {
      return {
        name: sheet.getName(),
        rows: sheet.getLastRow(),
        cols: sheet.getLastColumn()
      };
    });
    
    return JSON.stringify({
      success: true,
      message: 'Conexión exitosa',
      spreadsheet: spreadsheet.getName(),
      sheets: sheetNames
    });
  } catch (error) {
    return JSON.stringify({
      success: false,
      message: 'Error: ' + error.message
    });
  }
}

function actualizarEstadoRegistro(id, nuevoEstado, observaciones) {
  try {
    var sheet = getSheet('SALIDAS');
    var data = sheet.getDataRange().getValues();
    
    // Buscar la fila con el ID
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == id) {
        // Actualizar estado (columna 10, índice 9)
        sheet.getRange(i + 1, 10).setValue(nuevoEstado);
        
        // Opcional: Guardar observaciones en una columna adicional o log
        if (observaciones) {
          // Si tienes una columna para observaciones, guárdalas aquí
          // sheet.getRange(i + 1, 11).setValue(observaciones);
        }
        
        Logger.log(`✅ Estado actualizado: ID ${id} -> ${nuevoEstado}`);
        return { success: true, message: 'Estado actualizado correctamente' };
      }
    }
    
    return { success: false, message: 'No se encontró el registro' };
  } catch (error) {
    Logger.log('❌ Error actualizando estado: ' + error.toString());
    return { success: false, message: 'Error: ' + error.message };
  }
}