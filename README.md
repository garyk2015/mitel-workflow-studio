# Mitel Workflow Reporting Script

A lightweight JavaScript module that extracts, filters, and formats runtime variables from **Mitel Workflow Studio (WFS)** activities into a clean JSON payload suitable for reporting, analytics, or external API integration.

This script is designed to work seamlessly with the **Viegli AI Reporting Pipeline**, forwarding sanitized event data to a Flask-based `/ingest` endpoint and storing it in CouchDB for visualization in **Grafana**.

---

## ⚙️ Features

- 🚀 **Lightweight and fast** — runs safely inside WFS without freezing on large event objects.
- 🧹 **Data filtering** — automatically excludes `System*`, `JavaScript*`, `Greeting*`, and `contextKeys` fields.
- 🧩 **Intelligent serialization** — skips deep nested objects and replaces them with compact summaries.
- 🧱 **UUID filtering** — ignores workflow node IDs (avoiding bloated JSON).
- 🪶 **Blank skipping** — removes empty and null values for clean payloads.
- 🌍 **CDN-friendly** — can be hosted externally and loaded dynamically via HTTPS.

---

## 🧠 Usage (Inside WFS)

1. Add a **JavaScript** activity to your flow.
2. Paste this snippet:

```
(function (event, context, callback) {
  const scriptUrl = "https://garyk2015.github.io/mitel-workflow-studio/mitel_reporting.js";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", scriptUrl, false);
  xhr.send();

  if (xhr.status === 200) {
    eval(xhr.responseText);
    buildReportingPayload(event, context, callback);
  } else {
    callback(false, "Failed to load reporting script: " + xhr.status);
  }
})(event, context, callback);
```
3. If your node ID is e.g. JavaScript1 then you can for example use a HTTP request node and set its BODY to simply {{JavaScript1.Data.PAYLOAD}} to send the data to a database.



