import postcss from "postcss";
import tw from "@tailwindcss/postcss";
import fs from "fs";
fs.writeFileSync("/tmp/probe.html", '<div class="h-13 min-w-160 min-h-30 max-w-content"></div>');
const css = '@import "tailwindcss";\n@source "/tmp/probe.html";\n@theme { --container-content: 75rem; }';
const res = await postcss([tw()]).process(css, { from: "probe.css" });
const out = res.css;
for (const cls of ["h-13","min-w-160","min-h-30","max-w-content"]) {
  const m = out.match(new RegExp("\\." + cls + "\\b[^{]*\\{[^}]*\\}"));
  process.stdout.write(cls + " => " + (m ? m[0].replace(/\s+/g," ") : "NOT GENERATED") + "\n");
}
