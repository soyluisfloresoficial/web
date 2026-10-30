// Genera gtm/contenedor-anuncios.json: las conversiones de Meta Ads y
// Google Ads y el evento sign_up de GA4, listos para importar en Tag Manager
// encima de gtm/contenedor-ga4.json (ver gtm/LEEME.md).
//
// Uso: node tools/generar-contenedor-anuncios.mjs
//
// Los ID reales (píxel de Meta y conversiones de Google Ads) no van aquí: se
// pegan después en las variables «… (pegar aquí)» de Tag Manager.
import fs from "node:fs";

const base = { accountId: "0", containerId: "0" };
const T = (key, value) => ({ type: "TEMPLATE", key, value });
const B = (key, value) => ({ type: "BOOLEAN", key, value: String(value) });
const TODAS = "2147479553"; // activador integrado «All Pages»
// Solo se disparan si la persona aceptó las cookies de marketing.
const consentimiento = {
  consentStatus: "NEEDED",
  consentType: { type: "LIST", list: [{ type: "TEMPLATE", value: "ad_storage" }] },
};

const constante = (variableId, name, value) => ({ ...base, variableId, name, type: "c", parameter: [T("value", value)] });
const capa = (variableId, name, campo) => ({
  ...base,
  variableId,
  name,
  type: "v",
  parameter: [{ type: "INTEGER", key: "dataLayerVersion", value: "2" }, B("setDefaultValue", false), T("name", campo)],
});
const evento = (triggerId, name, nombreEvento) => ({
  ...base,
  triggerId,
  name,
  type: "CUSTOM_EVENT",
  customEventFilter: [{ type: "EQUALS", parameter: [T("arg0", "{{_event}}"), T("arg1", nombreEvento)] }],
});
const html = (tagId, name, codigo, disparador, previa) => ({
  ...base,
  tagId,
  name,
  type: "html",
  parameter: [T("html", codigo), B("supportDocumentWrite", false)],
  firingTriggerId: [disparador],
  tagFiringOption: "ONCE_PER_EVENT",
  consentSettings: consentimiento,
  ...(previa ? { setupTag: [{ tagName: previa, stopOnSetupFailure: true }] } : {}),
});
const conversionAds = (tagId, name, etiqueta, disparador) => ({
  ...base,
  tagId,
  name,
  type: "awct",
  parameter: [
    T("conversionId", "{{Google Ads - ID de conversión (pegar aquí)}}"),
    T("conversionLabel", etiqueta),
    B("enableConversionLinker", true),
    B("enableProductReporting", false),
  ],
  firingTriggerId: [disparador],
  tagFiringOption: "ONCE_PER_EVENT",
  consentSettings: consentimiento,
});

const PIXEL = `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', {{Meta - ID del píxel (pegar aquí)}});
fbq('track', 'PageView');
</script>`;

const contenedor = {
  exportFormatVersion: 2,
  exportTime: "2026-10-30 12:00:00",
  containerVersion: {
    path: "accounts/0/containers/0/versions/0",
    ...base,
    containerVersionId: "0",
    container: { path: "accounts/0/containers/0", ...base, name: "soyluisflores.es", publicId: "GTM-XXXXXXX", usageContext: ["WEB"] },
    variable: [
      constante("70", "Meta - ID del píxel (pegar aquí)", "000000000000000"),
      constante("71", "Google Ads - ID de conversión (pegar aquí)", "000000000"),
      constante("72", "Google Ads - Etiqueta llamada (pegar aquí)", "PEGAR_ETIQUETA_LLAMADA"),
      constante("73", "Google Ads - Etiqueta guía (pegar aquí)", "PEGAR_ETIQUETA_GUIA"),
      // Las mismas del contenedor de GA4: se incluyen para que la importación
      // no falle si se hace sola. Si ya existen, «Sobrescribir» las deja igual.
      capa("10", "DLV - form_id", "form_id"),
      capa("11", "DLV - method", "method"),
      capa("12", "DLV - page_path", "page_path"),
    ],
    trigger: [evento("25", "Evento - generate_lead", "generate_lead"), evento("60", "Evento - sign_up", "sign_up")],
    tag: [
      html("50", "Meta - Píxel base", PIXEL, TODAS),
      html(
        "51",
        "Meta - Lead (llamada agendada)",
        "<script>\nfbq('track', 'Lead', { content_name: {{DLV - form_id}} });\n</script>",
        "25",
        "Meta - Píxel base",
      ),
      html(
        "52",
        "Meta - CompleteRegistration (guía gratis)",
        "<script>\nfbq('track', 'CompleteRegistration', { content_name: {{DLV - method}} });\n</script>",
        "60",
        "Meta - Píxel base",
      ),
      {
        ...base,
        tagId: "53",
        name: "Google Ads - Vinculador de conversiones",
        type: "gclidw",
        parameter: [B("enableCrossDomain", false), B("enableUrlPassthrough", false), B("enableCookieOverrides", false)],
        firingTriggerId: [TODAS],
        tagFiringOption: "ONCE_PER_EVENT",
        consentSettings: consentimiento,
      },
      conversionAds("54", "Google Ads - Llamada de diagnóstico", "{{Google Ads - Etiqueta llamada (pegar aquí)}}", "25"),
      conversionAds("55", "Google Ads - Guía gratis", "{{Google Ads - Etiqueta guía (pegar aquí)}}", "60"),
      {
        ...base,
        tagId: "56",
        name: "GA4 - Evento sign_up",
        type: "gaawe",
        parameter: [
          B("sendEcommerceData", false),
          T("eventName", "sign_up"),
          T("measurementIdOverride", "{{GA4 - ID de medición}}"),
          {
            type: "LIST",
            key: "eventSettingsTable",
            list: [
              { type: "MAP", map: [T("parameter", "method"), T("parameterValue", "{{DLV - method}}")] },
              { type: "MAP", map: [T("parameter", "page_path"), T("parameterValue", "{{DLV - page_path}}")] },
            ],
          },
        ],
        firingTriggerId: ["60"],
        tagFiringOption: "ONCE_PER_EVENT",
      },
    ],
    builtInVariable: [{ ...base, type: "EVENT", name: "Event" }],
  },
};

fs.writeFileSync("gtm/contenedor-anuncios.json", `${JSON.stringify(contenedor, null, 2)}\n`);
console.log("gtm/contenedor-anuncios.json listo");
