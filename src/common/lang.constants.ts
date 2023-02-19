import { registerEnumType } from "@nestjs/graphql";

const langArray = [
    {
      code: 'en',
      name: 'English',
    },
    {
      code: 'ar',
      name: 'العربية',
    },
    {
      code: 'tr',
      name: 'turkish',
    },
  ]
  
  const langObject = {}
  langArray.forEach(lang => {
    langObject[lang.code] = lang
  })

  export enum Locale {
    en="en", ar="ar", try="tr"
  }

  registerEnumType(Locale, {name: "Locale", description: ""});
  
  export { langArray, langObject }

