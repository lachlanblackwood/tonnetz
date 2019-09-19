let infoPanel = {
    props:{
        infoType:{
            type:String,
            required:true
        }
    },
    data:function(){return {
        expanded:false
    }},
    computed:{
        strings: function(){
            return this.$root.strings;
        },
        text: function(){
            return this.strings.infos[this.infoType]
        },
        buttonText: function(){
            if(this.expanded){
                return "Close"
            }else{
                return "Info"
            }
        }
    },
    methods:{
        toggle: function(){
            this.expanded = !this.expanded;
        }
    },
    template:`
        <div class="info" :class="{infoExpanded: expanded}">
            <div @click="toggle" class="infoButton">{{buttonText}}</div>
            <div class="infoExplain"> {{text}}</div>
        </div>
    `
}


var Tonnetz_infoPanel = true;