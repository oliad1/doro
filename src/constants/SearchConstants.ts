export const FACULTIES = [
    { title: "Engineering", index: 0 },
    { title: "Math", index: 1 },
    { title: "Science", index: 2 },
    { title: "Health", index: 3 },
    { title: "Environment", index: 4 },
    { title: "Arts", index: 5 },
    { title: "Other", index: 6 }
];

export const DEPARTMENTS = [
    ["AE", "BME", "CHE", "CIVE", "ECE", "ME", "MSCI", "MSE", "MTE", "NE", "SE", "SYDE"],
    ["AMATH", "ACTSC", "CO", "CS", "MATH", "STAT"],
    ["ASTRN", "BIOL", "CHEM", "EARTH", "OPTOM", "PHYS", "SCBUS", "SCI"],
    ["HEALTH", "HLTH", "KIN", "PHS", "REC"],
    ["ERS", "GEOG", "INTEG", "PLAN"],
    ["AFM", "APPLS", "ANTH", "BLKST", "CLAS", "COMMST", "EASIA", "ECON", "EMLS", "ENGL", "FINE", "FR", "GER", "GBDA", "GSJ", "GGOV", "HIST", "ISS", "ITAL", "ITALST", "JS", "LS", "MEDVL", "MUSIC", "PACS", "PHIL", "PSCI", "PSYCH", "RS", "SDS", "SMF", "SOC", "SOCWK", "SWK", "SWREN", "SPAN", "TS"],
    ["BET", "PD", "SAF", "ARCH", "DAC", "ENBUS", "SFM"]
];

export const enum SEARCH_PARAMS {
  FACULTY = 'fac',
  DEPARTMENT = 'dept',
  SEARCH = 'search',
  PAGE = 'page'
}

export interface SearchParams {
  page?: string;
  search?: string;
  fac?: string;
  dept?: string;
};
