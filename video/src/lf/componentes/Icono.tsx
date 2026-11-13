import type { Icono as NombreIcono } from "../tipos";

const TRAZOS: Record<NombreIcono, string> = {
  formulario: "M6 3h12v18H6zM9 8h6M9 12h6M9 16h3",
  agente: "M4 8h16v11H4zM12 4v4M9 13h.01M15 13h.01M9.5 16h5",
  crm: "M3 4h5v16H3zM10 4h5v10h-5zM17 4h4v7h-4z",
  calendario: "M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4",
  whatsapp: "M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z",
  correo: "M3 5h18v14H3zM4 7l8 6 8-6",
  alerta: "M12 3 2.5 20h19L12 3ZM12 10v4M12 17h.01",
  check: "m5 12.5 4.5 4.5L19 7.5",
  usuario: "M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM4.5 20.5a7.5 7.5 0 0 1 15 0",
  reloj: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM12 7v5l3 2",
};

export function Icono({ nombre, tam = 32, color = "currentColor", grosor = 1.8 }: { nombre: NombreIcono; tam?: number; color?: string; grosor?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={tam} height={tam} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={TRAZOS[nombre]} />
    </svg>
  );
}
