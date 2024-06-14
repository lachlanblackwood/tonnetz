// ============================================================================
// i18n Strings

function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

const strings = {
    data:{
        en: {
            title: 'The Tonnetz',
            subtitle: 'One key – many representations',
            dual: 'Dual',
            reset: 'Reset',
            load: 'Load Midi File',
            start: '⏺ Start Recording',
            stopRecord: '⏺⏹ Stop Recording',
            play: '▶️ Play',
            stopPlay: '⏹ Stop Playing',
            pause: '⏸ Pause',
            rotate: 'Rotate 180°',
            translate: 'Translate',
            semitones: 'semitones',
            export: 'Export',
            connected: 'This Tonnetz is non-connected and doesn’t contain every note.',
            notes: ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
            intervalNames : ['', 'b9', '9', '', '', 'sus4', 'b5', '', '#5', '6', '7', '△7'],
            minorSymbol: 'm',
            infos:{
                tonnetz: 'Placeholder explanation for the <i>Tonnetz</i>',
                chicken: 'Placeholder explanation for the Chicken-Wire'
            },
            credits: `
            <h2>Credit</h2>

            <span>Conceived and developped by Corentin Guichaoua and Moreno Andreatta</span>
            
            <h2>Acknowledgments</h2>
            
            <span>Thanks to Louis Bigo for the original Hexachord software. <br>
            
            Thanks to Philipp Legner for improving on the initial visual design and his feedback. <br>
            
            Thanks to people who helped translate the software to other languages:
                <ul>
                <li>German: Philipp Legner
                <li>Hindi: Nilesh Trivedi
                </ul>
            
            
            Sample MIDI tracks are interpretted by Moreno Andreatta. <br>
            
            Thanks to all collaborators for inspiration. <br>
            
            Thanks to USIAS / University of Strasbourg / IRMA / IRCAM for financial support.</span>
            
            <h2>Citation</h2>
            <span><a href="https://www.gitlab.com/guichaoua/web-hexachord">www.gitlab.com/guichaoua/web-hexachord</a> <br>
            Academic paper to come, please check back later</span>
            `,
            creditsButton: "Credits",
            interval: "Interval",
            content: "Content",
            info: "Info",
            infoClose: "Close"
        },
        de: {
            title: 'Das Tonnetz',
            subtitle: 'Ein Klang – viele Darstellungen',
            dual: 'Dual',
            reset: 'Zurücksetzen',
            load: 'Midi Datei Laden',
            start: '⏺ Aufnehmen',
            stopRecord: '⏺⏹ Aufnahme Stoppen',
            play: '▶️ Abspielen',
            stopPlay: '⏹ Abspiel Stoppen',
            pause: '⏸ Pause',
            rotate: '180° Rotieren',
            translate: 'Verschieben',
            export: 'Exportieren', // Needs checking
            connected: 'Dieses Tonnetz ist nicht verbunden, und enthält nicht alle Noten.',
            notes: ['A', 'B', 'H', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯']
        },
        fr: {
            title: 'Le Tonnetz',
            subtitle: 'Note unique — Représentations nombreuses',
            dual: 'Dual',
            reset: 'Réinitialiser',
            load: 'Charger des données Midi',
            start: '⏺ Enregistrer',
            stopRecord: "⏺⏹ Arrêter l'enregistrement",
            play: '▶️ Lecture',
            stopPlay: '⏹ Arrêt',
            pause: '⏸ Pause',
            rotate: 'Rotation à 180°',
            translate: 'Translation',
            export: 'Exporter',
            connected: "Ce Tonnetz n'est pas connexe et ne contient pas toutes les notes.",
            notes: ['La', 'La♯', 'Si', 'Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯'],
            interval: "Intervalle",
            content: "Contenu",
        },
        hi: {
            title: 'सरगम',
            subtitle: 'एक स्वर, रूप अनेक',
            dual: 'Dual',
            reset: 'Reset',
            load: 'मिडी फाइल खोलें',
            start: '⏺ रिकॉर्डिंग शुरू करें',
            stopRecord: '⏺⏹ रिकॉर्डिंग ख़त्म करें',
            play: '▶️ Play',
            stopPlay: '⏹ Stop Playing',
            pause: '⏸ Pause',
            rotate: '180° पलटें',
            translate: 'अनुवाद करें',
            export: 'Export', // Needs translation
            connected: 'इस जोड़ में सभी स्वर नहीं है.',
            notes: ['ध', 'निb', 'नि', 'सा', 'रेb', 'रे', 'गb', 'ग', 'म', 'पb', 'प', 'धb']
        },
    },
    get(key){
        let string = resolve(key,this.data[this.activeLang]);
        if(!string===undefined){
            console.warn(`No localisation string for "${key}", defaulting to English`)
            string = resolve(key,this.data.en);
            if(string===undefined){
                console.error(`Unknown localisation string "${key}"`)
                string = "<Missing>"
            }
        }
        return string
    },
    setLanguage(lang){
        if(!this.data[lang]){
            console.log(this.data)
            console.warn(`Invalid language option "${lang}", defaulting to English`);
            this.activeLang='en'
        }else{
            this.activeLang=lang;
        }
    }
}

const search = location.search.match(/hl=(\w*)/);
const language = strings.hasOwnProperty(search) ? search[1] : 'en';

strings.setLanguage(language);


let languageSelector = {
    props:{
        value:{
            type:String
        },
        languages:{
            type:Array,
            required:true
        }
    },
    template:`
        <div class="languageSwitcher">
            <div v-cloak v-for="lang of languages" 
            @click="$emit('input',lang)">
                {{ lang }}
            </div>
        </div>
    `
}

var Tonnetz_l12n = true