# 📦 Sistema de Salidas de Producto COMARRICO

Aplicación web desarrollada para el **registro, control y seguimiento de salidas de producto** de inventario, orientada a procesos de calidad, inspección y control operativo en COMARRICO.

---

## 🧠 Tabla de Contenidos

- [📌 Descripción](#-descripción)
- [🎯 Objetivos del Proyecto](#-objetivos-del-proyecto)
- [🧩 Arquitectura del Sistema](#-arquitectura-del-sistema)
- [⚙️ Funcionalidades Principales](#️-funcionalidades-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📊 Modelo de Datos](#️-modelo-de-datos)
- [👥 Roles de Usuario](#️-roles-de-usuario)
- [📈 Procesos Automatizados](#-procesos-automatizados)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [📜 Licencia](#-licencia)

---

## 📌 Descripción

El **Sistema de Salidas de Producto COMARRICO** permite gestionar el retiro temporal o definitivo de productos del inventario, garantizando trazabilidad, control de fechas de retorno y monitoreo del estado de cada producto.

El sistema está desarrollado sobre **Google Apps Script**, utilizando **Google Sheets** como base de datos y una interfaz web construida con HTML, CSS y JavaScript.

---

## 🎯 Objetivos del Proyecto

- Digitalizar el proceso de salidas de producto.
- Controlar fechas de retorno y estados de los productos.
- Reducir errores manuales en el registro de inventario.
- Facilitar el análisis de información mediante reportes y gráficos.
- Automatizar alertas de productos vencidos.

---

## 🧩 Arquitectura del Sistema

El sistema sigue una arquitectura **cliente-servidor**:

- **Frontend**: Interfaz web (HTML, CSS, JavaScript).
- **Backend**: Google Apps Script.
- **Base de datos**: Google Sheets.
- **Visualización de datos**: Gráficas dinámicas con Chart.js.
- **Notificaciones**: Envío automático de correos con MailApp.

La comunicación se realiza mediante `google.script.run`.

---

## ⚙️ Funcionalidades Principales

### 📝 Registro de Salidas
- Registro de nuevas salidas de producto.
- Captura de información como código, nombre, tipo de salida, responsable y fechas.
- Validaciones básicas de datos.

### 📊 Dashboard
- Visualización de indicadores generales.
- Gráficas por tipo de salida, ubicación y estado.
- Consulta histórica de registros.

### ⏱️ Control de Vencimientos
- Identificación automática de productos con fecha de retorno vencida.
- Clasificación por nivel de criticidad.
- Alertas automáticas por correo electrónico.

### 👤 Autenticación y Roles
- Control de acceso mediante usuarios y contraseñas.
- Diferenciación de permisos según rol.

---

## 🛠️ Tecnologías Utilizadas

| Componente | Tecnología |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Google Apps Script |
| Base de datos | Google Sheets |
| Gráficas | Chart.js |
| Correos | MailApp (Apps Script) |

---

## 📊 Modelo de Datos

### 📄 Hoja **USUARIOS**
- usuario  
- contraseña  
- rol  
- nombre  

### 📄 Hoja **SALIDAS**
- id  
- codigo_producto  
- nombre_producto  
- tipo_salida  
- ubicacion  
- fecha_salida  
- fecha_retorno  
- estado  
- responsable  

### 📄 Hoja **OBSERVACIONES**
- id_observacion  
- id_salida  
- estado_anterior  
- estado_nuevo  
- usuario  
- fecha  

---

## 👥 Roles de Usuario

### 🔐 Administrador
- Acceso completo al sistema.
- Modificación de registros y estados.
- Visualización total de reportes.

### 🧪 Calidad
- Registro de salidas.
- Seguimiento de productos.
- Consulta de dashboards.

---

## 📈 Procesos Automatizados

El sistema cuenta con procesos automáticos que:

1. Revisan diariamente las fechas de retorno.
2. Detectan productos vencidos.
3. Envían alertas por correo.
4. Actualizan estados según reglas definidas.

Estos procesos se ejecutan mediante **triggers de Google Apps Script**.

---

## 📁 Estructura del Proyecto

```text
SALIDA-DE-PRODUCTO-COMARRICO/
│
├── backend/
│   └── Code.js
│
├── html/
│   └── index.html
│
├── functions/
│   ├── Functform.html
│   └── vencidos.html
│
└── README.md
