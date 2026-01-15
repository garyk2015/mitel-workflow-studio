// mitel_reporting.js
(function (global) {
  function buildReportingPayload(event, context, callback) {
    try {
      const excludedPrefixes = ["System", "JavaScript", "Greeting", "contextKeys"];
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const shouldExclude = key =>
        excludedPrefixes.some(prefix => key.startsWith(prefix)) ||
        uuidRegex.test(key) ||
        key.toLowerCase().includes("script");

      const eventKeys = [];

      for (let k in event) {
        if (!event.hasOwnProperty(k) || shouldExclude(k)) continue;
        let val = event[k];
        if (val === null || val === undefined || val === "") continue;

        if (typeof val === "object") {
          try {
            const keys = Object.keys(val);
            if (keys.length === 0) continue;
            const sub = {};
            for (const key of keys) {
              const v = val[key];
              if (v !== null && v !== undefined && v !== "") {
                sub[key] = typeof v === "object" ? "[object]" : v;
              }
            }
            val = JSON.stringify(sub);
          } catch {
            val = "[object]";
          }
        } else if (typeof val === "string") {
          val = val.replace(/"/g, '\\"');
        }

        eventKeys.push({ key: k, value: val });
      }

      const payload = {
        timestamp: new Date().toISOString(),
        eventKeys: eventKeys
      };

      callback(true, { PAYLOAD: JSON.stringify(payload) });

    } catch (err) {
      callback(false, "Error building payload: " + err.message);
    }
  }

  // Export globally
  global.buildReportingPayload = buildReportingPayload;
})(this);
