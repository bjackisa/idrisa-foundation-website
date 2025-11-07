// Education levels
export const EDUCATION_LEVELS = ["Primary", "O-level", "A-level"] as const

// Primary level
export const PRIMARY_CLASSES = ["P.4", "P.5", "P.6", "P.7"]
export const PRIMARY_AGE_MIN = 10
export const PRIMARY_AGE_MAX = 14
export const PRIMARY_SUBJECTS = ["Mathematics", "Integrated Science", "Computer Knowledge"]

// O-level
export const O_LEVEL_CLASSES = ["S.1", "S.2", "S.3", "S.4"]
export const O_LEVEL_AGE_MIN = 12
export const O_LEVEL_AGE_MAX = 18
export const O_LEVEL_SUBJECTS = ["Mathematics", "Biology", "Physics", "Chemistry", "ICT", "Agriculture"]

// A-level
export const A_LEVEL_CLASSES = ["S.5", "S.6"]
export const A_LEVEL_AGE_MIN = 16
export const A_LEVEL_AGE_MAX = 21
export const A_LEVEL_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "ICT", "Biology", "Agriculture"]

// Question types and difficulty
export const QUESTION_TYPES = ["Quiz", "Theory", "Practical"] as const
export const DIFFICULTY_LEVELS = ["1-star", "2-star", "3-star"] as const

// Competition phases
export const OLYMPIAD_PHASES = ["Preparation", "Quiz", "Bronze", "Silver", "Golden Finale"] as const

// Uganda districts
export const UGANDA_DISTRICTS = [
  "Kampala",
  "Wakiso",
  "Mukono",
  "Entebbe",
  "Mpigi",
  "Masaka",
  "Jinja",
  "Soroti",
  "Kigezi",
  "Kabale",
  "Kanungu",
  "Kisoro",
  "Bundibugyo",
  "Kasese",
  "Kabarole",
  "Kyenjojo",
  "Kibale",
  "Hoima",
  "Masindi",
  "Mubende",
  "Semliki",
  "Bunyoro",
  "Arua",
  "Nebbi",
  "Yumbe",
  "Pakwach",
  "Moyo",
  "Adjumani",
  "Gulu",
  "Lira",
  "Pader",
  "Kitgum",
  "Moroto",
  "Napak",
  "Katakwi",
  "Karenga",
  "Kaabong",
  "Kotido",
] as const

// Elimination criteria
export const ELIMINATION_CRITERIA = {
  Quiz: { minScore: 70, percentile: null },
  Bronze: { minScore: 60, percentile: 30 },
  Silver: { minScore: 50, percentile: 50 },
} as const
