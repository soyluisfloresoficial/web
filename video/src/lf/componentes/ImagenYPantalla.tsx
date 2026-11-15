/**
 * Imagen real (izquierda, con movimiento lento) + interfaz o flujo (derecha)
 * en la franja de gráficos. La imagen entra primero y la interfaz justo después.
 */
import { Sequence } from "remotion";
import type { FuentePantalla, NodoFlujo } from "../tipos";
import { AutomationFlow } from "./AutomationFlow";
import { FloatingScreen } from "./FloatingScreen";
import { ImagenReal } from "./ImagenReal";

export function ImagenYPantalla({
  imagen,
  credito,
  etiqueta,
  derecha,
  ancho,
  alto,
  duracion,
}: {
  imagen: string;
  credito?: string;
  etiqueta?: string;
  derecha: { tipo: "pantalla"; fuente: FuentePantalla; titulo?: string } | { tipo: "flujo"; nodos: NodoFlujo[] };
  ancho: number;
  alto: number;
  duracion: number;
}) {
  const anchoImagen = Math.round(ancho * 0.4);
  const anchoDerecha = ancho - anchoImagen - 16;
  return (
    <div style={{ width: ancho, height: alto, display: "flex", gap: 16 }}>
      <ImagenReal archivo={imagen} credito={credito} etiqueta={etiqueta} movimiento="acercar" ancho={anchoImagen} alto={alto} duracion={duracion} />
      <div style={{ position: "relative", width: anchoDerecha, height: alto }}>
        <Sequence from={6} layout="none">
          {derecha.tipo === "pantalla" ? (
            <FloatingScreen fuente={derecha.fuente} titulo={derecha.titulo} ancho={anchoDerecha} alto={alto} inclinacion={3} entrada="zoom" />
          ) : (
            <AutomationFlow nodos={derecha.nodos} ancho={anchoDerecha} alto={alto} duracion={Math.max(30, duracion - 6)} />
          )}
        </Sequence>
      </div>
    </div>
  );
}
