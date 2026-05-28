const fs = require("fs");

const slugs = [
  "debate","connection","295c","meri-aawaz-suno","bol-k-lab-azad-hain-tere","ora-et-labora",
  "ochtend-met-jezus-predikant-douwe-wijmenga","masihi-zindagi","yesu-sang-sawera-pastor-munawar-virk",
  "yesu-sang-sawera-pastor-imran-gill","yesu-sang-sawera-predikant-imko-postma",
  "yesu-sang-sawera-pastor-sarfaraz-rehmat","morning-with-jesus-pastor-robert-slack",
  "ochtend-met-jezus-predikant-terpstra","yesu-sang-sawera-pastor-parvaiz-iqbal",
  "yesu-sang-sawera-bishop-emmanuel-aftab","puray-dil-se","tehqeeqebible","farmanemasih",
  "azmatemasih","choti-si-baat","aao-hamad-karin","food-for-your-heart",
  "yesu-sang-sawera-pastor-nadeem-k-dean","daagh","meri-kahani","bandhan","btl-drama-specials",
  "aap-ki-sehat","return-ticket","aao-chalein","such-ki-khooj","safareshanakhat","career-guide",
  "hamare-sitare","pakistan-hamara-bhi-hai","btl-tv-news-updates","jawab-tu-hai",
  "morning-with-jesus-pastor-oluwabukunmi-popoola","yesu-sang-sawera-pastor-william-paighani","urdu-bible"
];
const kidsSlugs = ["prophecies-about-jesus-christ","kids-stories","kids-programe-bible-study"];

let content = fs.readFileSync("src/lib/site-data.ts", "utf8");

// Add slug to PROGRAMS entries
let pIdx = 0;
content = content.replace(
  /^(\s+id: "PLC0Rch0KTiEJ6w6w6w6w6w",)$/m,
  "      id: \"PLC0Rch0KTiEJ6w6w6w6w6w\","
);

// Process each program entry - add slug after title field
let lines = content.split("\n");
let newLines = [];
let inPrograms = false;
let inKids = false;
let inArray = false;
let progCount = 0;
let kidCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.trim() === "export const PROGRAMS: Program[] = [") {
    inPrograms = true;
  }
  if (line.trim() === "export const KIDS_PROGRAMS: Program[] = [") {
    inPrograms = false;
    inKids = true;
  }

  newLines.push(line);

  // After a title line, add slug
  const titleMatch = line.match(/^\s+title: "(.+)",$/);
  if (titleMatch && inPrograms && progCount < slugs.length) {
    newLines.push(`    slug: "${slugs[progCount]}",`);
    progCount++;
  }
  if (titleMatch && inKids && kidCount < kidsSlugs.length) {
    newLines.push(`    slug: "${kidsSlugs[kidCount]}",`);
    kidCount++;
  }
}

fs.writeFileSync("src/lib/site-data.ts", newLines.join("\n"));
console.log("Done! Added", progCount, "program slugs and", kidCount, "kids program slugs");
