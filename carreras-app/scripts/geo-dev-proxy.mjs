// Solo para pruebas locales: reenvía las consultas de direcciones a Photon usando curl (que respeta el proxy del entorno).
import { createServer } from "node:http";
import { execFile } from "node:child_process";
createServer((req, res) => {
  execFile("curl", ["-s", "-A", "CarrerasApp/1.0 (pruebas)", "https://photon.komoot.io" + req.url], { maxBuffer: 5e6 }, (e, out) => {
    res.writeHead(e ? 502 : 200, { "Content-Type": "application/json" }); res.end(e ? "{}" : out);
  });
}).listen(8798, () => console.log("geo-dev-proxy en :8798"));
