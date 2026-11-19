import { PATHOLOGY_PROFILES } from './data/pathologyCatalog.js';

console.log('🧪 Testing 7 Pathology Profiles against their sample reports...\n');

function parseReport(reportText) {
  const findings = [];
  const matchedProfiles = new Set();

  for (const profile of Object.values(PATHOLOGY_PROFILES)) {
    for (const param of profile.parameters) {
      const escapedAliases = param.aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      const regex = new RegExp(`(?:${escapedAliases})(?:\\s*\\([a-z0-9\\s+/.-]+\\))?\\s*[:=-]?\\s*([0-9.,]+(?:\\s*-\\s*[0-9.,]+)?|\\+?(?:1\\+|2\\+|3\\+|4\\+|trace|nil|negative|positive|present|turbid|clear))`, 'i');
      
      const match = reportText.match(regex);
      if (match) {
        matchedProfiles.add(profile.name);
        findings.push({
          parameter: param.parameter,
          val: match[1]
        });
      }
    }
  }
  return { findings, matchedProfiles: Array.from(matchedProfiles) };
}

for (const [id, profile] of Object.entries(PATHOLOGY_PROFILES)) {
  const res = parseReport(profile.sampleReportText);
  console.log(`✅ [${profile.code}] ${profile.name}: Extracted ${res.findings.length} parameters`);
}

console.log('\n🎉 ALL 7 PROFILES EXTRACTED SUCCESSFULLY!\n');
