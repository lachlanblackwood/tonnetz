// Empty Vue instance to act as a bus for note interaction Events
var midiBus=new Vue({
    data: function(){return {
        midiThru:JZZ.Widget()
    }},
    methods:{
        connect: function(output){
            this.midiThru.connect(output)
        },
        disconnect: function(output){
            this.midiThru.disconnect(output)
        }
    }
});

function connect_out(){
    out = JZZ().openMidiOut()
    midiBus.connect(out)
    // midiBus.midiThru.disconnect(proto.synth)
    proto.synth.close()
}

var Tonnetz_midiBus = true;