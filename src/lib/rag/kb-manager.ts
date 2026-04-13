export interface Document {
  id: string;
  title: string;
  version: string;
  owner: string;
  category: "Averías/Soporte" | "Guías Cloud" | "Admin/Facturación" | "Tarifas/Comercial";
  expiryDate: string; // ISO format
  content: string;
  chunks: string[];
}

export const MOCK_KB: Document[] = [
  {
    id: "doc-001",
    title: "Protocolo de Averías de Fibra Óptica",
    version: "1.2",
    owner: "Soporte Técnico Red",
    category: "Averías/Soporte",
    expiryDate: "2026-12-31T23:59:59Z",
    content: "En caso de avería en la fibra óptica, el cliente debe reiniciar el router. Si el LED de 'LOS' parpadea en rojo, se debe escalar a Nivel 2. El tiempo máximo de resolución es de 4 horas para clientes Premium.",
    chunks: [
      "Reiniciar el router en caso de avería.",
      "Si el LED LOS parpadea en rojo, escalar a Nivel 2.",
      "Tiempo de resolución: 4 horas para clientes Premium."
    ]
  },
  {
    id: "doc-002",
    title: "Guía de Configuración VPN Corporativa",
    version: "2.0",
    owner: "Seguridad IT",
    category: "Guías Cloud",
    expiryDate: "2026-06-30T23:59:59Z",
    content: "La VPN corporativa requiere autenticación de doble factor (2FA). El cliente AnyConnect debe estar actualizado a la versión 4.9+. Los puertos 443 y 500 deben estar abiertos en el firewall local.",
    chunks: [
      "Requiere autenticación de doble factor (2FA).",
      "Cliente AnyConnect versión 4.9+.",
      "Puertos 443 y 500 abiertos en firewall."
    ]
  },
  {
    id: "doc-003",
    title: "Manual de Facturación y Ciclos",
    version: "1.0",
    owner: "Administración",
    category: "Admin/Facturación",
    expiryDate: "2026-01-01T23:59:59Z", // CADUCADO (Simulación)
    content: "El ciclo de facturación se cierra el día 25 de cada mes. Las facturas se emiten el día 1 del mes siguiente. Los pagos se domicilian automáticamente.",
    chunks: [
      "Cierre de ciclo: día 25 de cada mes.",
      "Emisión de facturas: día 1 del mes siguiente.",
      "Domiciliación automática de pagos."
    ]
  },
  {
    id: "doc-004",
    title: "Tarifas Móviles Empresas 2026",
    version: "3.1",
    owner: "Comercial",
    category: "Tarifas/Comercial",
    expiryDate: "2027-01-01T23:59:59Z",
    content: "La tarifa Ilimitada Total incluye datos 5G ilimitados y roaming en zona 1. El precio es de 45€/línea. Permanencia de 12 meses.",
    chunks: [
      "Tarifa Ilimitada Total: 5G ilimitado y roaming zona 1.",
      "Precio: 45€/línea.",
      "Permanencia de 12 meses."
    ]
  },
  {
    id: "doc-005",
    title: "Soporte Microsoft 365 Empresas",
    version: "1.5",
    owner: "Cloud Services",
    category: "Guías Cloud",
    expiryDate: "2026-08-15T23:59:59Z",
    content: "El soporte para MS365 incluye migración de buzones y configuración de Teams. El panel de administración se accede vía portal.office.com.",
    chunks: [
      "Incluye migración de buzones y configuración de Teams.",
      "Acceso vía portal.office.com."
    ]
  },
  {
    id: "doc-006",
    title: "Gestión de Roaming Internacional",
    version: "2.1",
    owner: "Comercial",
    category: "Tarifas/Comercial",
    expiryDate: "2026-11-20T23:59:59Z",
    content: "El roaming en la UE y EEUU está incluido en las tarifas corporativas. Para Asia y Latinoamérica se aplica el bono 'Mundo' de 15€/día.",
    chunks: [
      "UE y EEUU incluidos en tarifas corporativas.",
      "Bono 'Mundo' para Asia y Latam: 15€/día."
    ]
  },
  {
    id: "doc-007",
    title: "Centralita Virtual - Guía Rápida",
    version: "4.0",
    owner: "Soporte Voz",
    category: "Averías/Soporte",
    expiryDate: "2026-10-10T23:59:59Z",
    content: "Para desviar llamadas, marcar *21* seguido del número de destino. La locución de bienvenida se gestiona desde el panel web.",
    chunks: [
      "Desvío de llamadas: marcar *21* + número.",
      "Locución de bienvenida gestionada vía panel web."
    ]
  },
  {
    id: "doc-008",
    title: "Cambio de Cuenta Bancaria",
    version: "1.1",
    owner: "Administración",
    category: "Admin/Facturación",
    expiryDate: "2026-12-01T23:59:59Z",
    content: "El cambio de cuenta bancaria debe solicitarse con 10 días de antelación al cierre de ciclo. Se requiere el documento SEPA firmado.",
    chunks: [
      "Solicitud con 10 días de antelación.",
      "Requiere documento SEPA firmado."
    ]
  },
  {
    id: "doc-009",
    title: "Permanencia y Penalizaciones",
    version: "1.0",
    owner: "Legal/Comercial",
    category: "Tarifas/Comercial",
    expiryDate: "2026-05-01T23:59:59Z", // PRÓXIMO A EXPIRAR (< 20 días si hoy es Abril 2026)
    content: "La baja anticipada conlleva una penalización proporcional al tiempo restante. Máximo de 150€ por línea de fibra.",
    chunks: [
      "Baja anticipada: penalización proporcional.",
      "Máximo 150€ por línea de fibra."
    ]
  },
  {
    id: "doc-010",
    title: "Router Smart WiFi - Luces y Errores",
    version: "2.2",
    owner: "Soporte Técnico Red",
    category: "Averías/Soporte",
    expiryDate: "2026-12-31T23:59:59Z",
    content: "Luz roja fija en 'Internet' indica fallo de autenticación. Luz azul parpadeante en 'WiFi' indica modo WPS activo.",
    chunks: [
      "Luz roja fija en Internet: fallo de autenticación.",
      "Luz azul parpadeante en WiFi: modo WPS activo."
    ]
  },
  {
    id: "doc-011",
    title: "Plazos de Instalación Nueva Sede",
    version: "1.3",
    owner: "Operaciones",
    category: "Averías/Soporte",
    expiryDate: "2026-09-30T23:59:59Z",
    content: "El plazo estándar de instalación de fibra es de 7 días laborables. Para circuitos dedicados, el plazo se extiende a 30 días.",
    chunks: [
      "Plazo estándar fibra: 7 días laborables.",
      "Circuitos dedicados: 30 días."
    ]
  },
  {
    id: "doc-012",
    title: "Cloud Backup - Políticas de Retención",
    version: "1.0",
    owner: "Cloud Services",
    category: "Guías Cloud",
    expiryDate: "2026-12-31T23:59:59Z",
    content: "Los backups se guardan durante 30 días por defecto. La retención anual es opcional y tiene un coste adicional de 5€/TB.",
    chunks: [
      "Retención por defecto: 30 días.",
      "Retención anual opcional: 5€/TB."
    ]
  }
];

export function getKbStatus() {
  const now = new Date();
  const warningThreshold = 20 * 24 * 60 * 60 * 1000; // 20 days

  return MOCK_KB.map(doc => {
    const expiry = new Date(doc.expiryDate);
    const timeDiff = expiry.getTime() - now.getTime();
    
    return {
      id: doc.id,
      title: doc.title,
      status: timeDiff < 0 ? "expired" : timeDiff < warningThreshold ? "warning" : "valid",
      daysToExpiry: Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    };
  });
}
