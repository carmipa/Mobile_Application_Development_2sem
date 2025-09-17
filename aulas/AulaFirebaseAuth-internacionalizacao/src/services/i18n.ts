import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "../locales/pt.json"
import en from "../locales/en.json"
import es from "../locales/es.json"
import it from "../locales/it.json"
import lt from "../locales/lt.json"
import pl from "../locales/pl.json"
import ru from "../locales/ru.json"
import de from "../locales/de.json"



i18n.use(initReactI18next).init({
    lng:'pt',//Idioma padrão do meu app
    fallbackLng:'en',//Idioma se não encontrar tradução
    resources:{
        pt:{translation:pt},
        en:{translation:en},
        es:{translation:es},
        it:{translation:it},
        lt:{translation:lt},
        pl:{translation:pl},
        ru:{translation:ru},
        de:{translation:de}

    },
    interpolation:{
        escapeValue:false
    }
})

export default i18n