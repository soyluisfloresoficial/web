/**
 * Configuración de Remotion para la CLI (studio y render).
 *
 * El navegador se elige con la variable NAVEGADOR, así el mismo proyecto
 * funciona en Windows (Edge) y en Linux (Chromium headless) sin tocar código:
 *   Windows:  set NAVEGADOR=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe
 *   Linux:    export NAVEGADOR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
 * Sin la variable, Remotion descarga su propio navegador.
 */
import { Config } from "@remotion/cli/config";

if (process.env.NAVEGADOR) {
  Config.setBrowserExecutable(process.env.NAVEGADOR);
}
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
