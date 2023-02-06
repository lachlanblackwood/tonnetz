// A simple comoponent to display the namùe of the current chord played

let chordDisplay = {
	props: {
		notes: Array
	},
	computed: {
		//Returns the number of active notes
		noteCount: function (){
		    return this.notes.reduce( (count,note) => (note.count>0 ? count+1 : count),0);
		},
		calculateChord: function (){
			let string = "";
			let i = 0;
			if (this.noteCount <= 2)
				return string;
			let root = 0;
			while (this.notes[root].count == 0) 
				root++;
			string += noteNames[root];
			let m = false;
			// find 3rd
			if (this.notes[(root+3)%12].count > 0) {
				string += "m";
				m = true;
			}
			// 1st inversion
			if (m && this.notes[(root+8)%12].count > 0) {
				root = (root+8)%12;
				string = noteNames[root];
				m = false;
			} else if (!m && this.notes[(root+5)%12].count == 0 && this.notes[(root+9)%12].count > 0) {
				root = (root+9)%12;
				string = noteNames[root] + "m";
				m = true;
			}
			// 2nd inversion
			if (this.notes[(root+5)%12].count > 0) {
				if (this.notes[(root+8)%12].count > 0) {
					root = (root+5)%12;
					string = noteNames[root] + "m";
				} else if (this.notes[(root+9)%12].count > 0) {
					root = (root+5)%12;
					string = noteNames[root];
				}
			}
			// extra notes
			for (let i = 0; i < 12; i++) {
				if (this.notes[(root+i)%12].count > 0 && intervalNames[i] != '0') {
					string += intervalNames[i];
				}
			}
			return string;
		}
	},
	template: `
		<div id="chord">{{ calculateChord }}</div>
	`
}

var Tonnetz_chord = true
