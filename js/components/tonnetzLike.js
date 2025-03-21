
// Note component : a clickable circle with the note name
let noteTonnetz = {
    mixins: [activableMixin],
    computed:{
        strings: function (){
            return this.$root.strings
        },
        textScale: function (){
            let maxLength=Math.max(...this.strings.get('notes').map(name => name.length))
            let scale = Math.min(1,2.5/maxLength)
            return `scale(${scale})`
        }
    },
    template: `
        <g class="tonnetzNote">
            <circle v-bind:class="{activeNode:isActive, visitedNode:semiActive}"
                v-bind:data-key="notes[0].id">
            </circle>
            <text :transform="textScale">
                {{ strings.get(['notes',notes[0].id]) }}
            </text>
            </g>
        </g>
        `
};

// Common code to all chord components
let chord = {
    mixins: [activableMixin],
    props: {
        shape:{ //Relative (Tonnetz) coordinates of the chord
            type: Array,
            required: true
        }
    },
    computed: {
        coords: function (){ // Relative SVG coordinates of the chord's notes
            return this.shape.map(logicalToSvg);
        },
        center: function (){ // The barycenter of the coordinates
            return {x:average(this.coords.map(({x}) => x)),
                    y:average(this.coords.map(({y}) => y))}
        }
    }
}

// Dichord component : a clickable line between the two notes that it contains, with a small circle for easier clicking
let dichordTonnetz = {
    extends: chord,
    computed: {
        coordsHTML: function (){ // Repackages coordinates in the HTML/SVG format for lines
            return {
                x1 : this.coords[0].x,
                x2 : this.coords[1].x,
                y1 : this.coords[0].y,
                y2 : this.coords[1].y
            }
        }
    },
    template: `
    <g class="tonnetzDichord">
        <line v-bind:class="{activeDichord:isActive, visitedDichord:semiActive}" 
            v-bind="coordsHTML">
        </line> 
        <circle v-bind:class="{activeDichord:isActive}"
                v-bind:cx="center.x" v-bind:cy="center.y">
        </circle> 
    </g>
    `
};

// Trichord component : a clickable triangle between the three notes that it contains
let trichordTonnetz = {
    extends: chord,
    computed: {
        points: function (){ // Coordinates in the HTML format for polygons
            return this.coords.map( ({x,y}) => `${x},${y}` ).join(' ')
        }
    },
    template: `
        <polygon v-bind:class="{activeTrichord:isActive, visitedTrichord:semiActive}" 
            class="tonnetzTrichord"
            v-bind:points="points"/>
        `
};

// Tonnetz-like component : A large component that holds the Tonnetz or the Chicken-Wire
let tonnetzLike = {
    props: {
        notes: Array, // The notes and their status, forwarded from an upper-level
        intervals: { // The intervals from which to build the Tonnetz
            type: Array,
            default: () => [3,4,5]
        },
        bounds: { // The bounds of the drawing area
            type: Object
        },
        clicklock:{
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        // Returns the notes which fit in the drawing area
        // Actually also returns nodes which don't fit but for which a chord fits
        nodeList: function (){
            var nodes = [];
            var ymin = Math.floor(this.bounds.ymin/(baseSize*ystep))
            var ymax = Math.ceil(this.bounds.ymax/(baseSize*ystep))
            for(yi of range(ymin,ymax+1)){
                xmin = Math.floor(this.bounds.xmin/(baseSize)-yi/2)
                xmax = Math.ceil(this.bounds.xmax/(baseSize)-yi/2)
                for(xi of range(xmin,xmax+1)){
                    let node = {x:xi,y:yi};
                    nodes.push(node)
                }
            }
            return nodes;
        },
        // Returns the dichords which fit in the drawing area
        dichordList: function (){
            var nodes = [];
            //For each root
            for(node of this.nodeList){
                nodes.push([{x:node.x,y:node.y},{x:node.x  ,y:node.y+1}]);
                nodes.push([{x:node.x,y:node.y},{x:node.x+1,y:node.y }]);
                nodes.push([{x:node.x,y:node.y},{x:node.x+1,y:node.y-1}]);
            }
            return nodes;
        },
        // Returns the triangles which fit in the drawing area
        trichordList: function (){
            var nodes = [];
            //For each root (though actually the fifth)
            for(node of this.nodeList){
                nodes.push([{x:node.x,y:node.y},{x:node.x,y:node.y+1},{x:node.x+1,y:node.y}]);
                nodes.push([{x:node.x,y:node.y},{x:node.x+1,y:node.y-1},{x:node.x+1,y:node.y}]);
            }
            return nodes;
        }
    },
    methods: {
        // Converts an array of nodes to an array of the corresponding notes
        node2Notes: function (nodes){
            return mapOrApply(node => 
                this.notes[mod(node.y*this.intervals[0]-node.x*this.intervals[2],12)]
                )(nodes);
        },
        // Converts an array of nodes to an array of the corresponding Midi pitches
        nodesToPitches: function(nodes){
            return mapOrApply(node => {
                let x = 81 - 4*12 + node.y * this.intervals[0]
                                  - node.x * (this.intervals[2]-12);
                return Math.max(x,mod(x,12)) // Bound to valid MIDI values
            })(nodes)
        },
        // Returns the svg transform string corresponding to a node's position
        position: function(node){
            let {x,y} = logicalToSvg(node)
            return `translate(${x} ${y})`
        },
        // Returns the relative shape of an array of nodes
        shape: function(nodes){
            return nodes.map(node => ({
                x:node.x-nodes[0].x,
                y:node.y-nodes[0].y
            }));
        },
        // Unique identifier for an array of nodes
        genKey: function (n){
            return n.map(function textify(node){return `${node.x},${node.y}`}).join(' ')
        }
    },
    subtemplateTrichord:`
            <clickToPlayWrapper :transform="position(n.nodes[0])"
            v-for="n in trichordStateList" v-bind:key="genKey(n.nodes)"
            :pitches="nodesToPitches(n.nodes)"
            :id="n.nodes" :clicklock="clicklock">
                <trichord 
                v-bind:notes="memoNode2Notes(n.nodes)"
                v-bind:nodes="n.nodes"
                :shape="memoShape(n.nodes)"
                :forceState="n.status"
                />
    </clickToPlayWrapper>`,
    subtemplateDichord:`
            <clickToPlayWrapper :transform="position(n.nodes[0])"
            v-for="n in dichordStateList" v-bind:key="genKey(n.nodes)"
            :pitches="nodesToPitches(n.nodes)"
            :id="n.nodes" :clicklock="clicklock">
                <dichord 
                v-bind:shape="memoShape(n.nodes)"
                v-bind:notes="memoNode2Notes(n.nodes)"
                :forceState="n.status"/>
    </clickToPlayWrapper>`,
    subtemplateNote:`
            <clickToPlayWrapper :transform="position(n.node)"
            v-for="n in nodeStateList" v-bind:key="genKey([n.node])"
            :pitches="nodesToPitches([n.node])"
            :id="[n.node]" :clicklock="clicklock">
                <note v-bind:notes="memoNode2Notes([n.node])"
                v-bind:nodes="[n.node]"
                :forceState="n.status"/>
    </clickToPlayWrapper>`
};

// Specialisation of tonnetzLike to draw a Tonnetz
let tonnetzPlan = {
    components: {
        clickToPlayWrapper,
        'note': noteTonnetz,
        'dichord': dichordTonnetz,
        'trichord': trichordTonnetz
    },
    extends: tonnetzLike,
    mixins: [traceHandler],
    template: `
        <g>
            ${tonnetzLike.subtemplateTrichord}  
            ${tonnetzLike.subtemplateDichord} 
            ${tonnetzLike.subtemplateNote} 
        </g>
    `
}

// ----------------------- Chicken Wire ---------------------------

// The chicken-wire's trichord component : a clickable circle representing the chord
let trichordChicken = {
    extends: chord,
    props: ['id'],
    computed: {
        strings: function (){
            return this.$root.strings
        },
        isMinorish: function(){
            //Is this a majorish or minorish chord ?
            //I.E. is the matching triangle in the Tonnetz up- or down-pointed
            return this.shape[0].x !== this.shape[1].x;
        },
        text: function(){
            return this.strings.get(['notes',this.notes[2].id]);
        }
    },
    template: `
        <g v-bind:id="id" class=chickenTrichord :class="{minorish:isMinorish}">
            <circle v-bind:class="{activeTrichord:isActive, visitedTrichord:semiActive}"
                v-bind:cx="center.x" v-bind:cy="center.y">
            </circle> 
            <text v-bind:x="center.x" v-bind:y="center.y">
                {{ text }}
            </text>
        </g>
        `
}

// The chicken-wire's dichord component: a line between the two trichords that contain the same notes,
// with a small circle for easier clicking
let dichordChicken = {
    extends: chord,
    computed: {
        coordsHTML: function (){
            //Orientation of the notes axis
            let dx = this.coords[1].x - this.coords[0].x;
            let dy = this.coords[1].y - this.coords[0].y;
            //The rotation that sends (1,0) to (dx,dy)
            let rotate = function(point){ 
                return {x: (dx*point.x-dy*point.y), 
                        y: (dy*point.x+dx*point.y)};
            };
            //The extremities of the segment if the points were 0,0 and 1,0
            const p1 = {x:ystep/3,y:0.5};
            const p2 = {x:-ystep/3,y:0.5};
            return {
                x1 : rotate(p1).x,
                x2 : rotate(p2).x,
                y1 : rotate(p1).y,
                y2 : rotate(p2).y
            }
        }
    },
    template: `
    <g class="chickenDichord">
        <line v-bind:class="{activeDichord:isActive, visitedDichord:semiActive}" 
            v-bind="coordsHTML">
        </line> 
        <circle v-bind:class="{activeDichord:isActive}"
                v-bind:cx="center.x" v-bind:cy="center.y">
        </circle> 
    </g>
    `
}

// The chicken-wire's note component: A clickable hexagon located between all the chords that use that note
let noteChicken = {
    mixins: [activableMixin],
    props: ['notes','nodes'],
    computed: {
        coords: function (){
            return[
                {y:+baseSize*ystep/3,  x:+baseSize/2},
                {y:-baseSize*ystep/3,  x:+baseSize/2},
                {y:-baseSize*2*ystep/3,x:0},
                {y:-baseSize*ystep/3,  x:-baseSize/2},
                {y:+baseSize*ystep/3,  x:-baseSize/2},
                {y:+baseSize*2*ystep/3,x:0}
            ]
        },
        points: function (){
            return this.coords.map( ({x,y}) => `${x},${y}` ).join(' ')
        }
    },
    template: `
        <polygon v-bind:class="{activeNode:isActive, visitedNode:semiActive}" class="chickenNote" 
            v-bind:points="points" v-bind:data-key="notes[0].id"/>
        `
}

// Specialisation of tonnetzLike to draw the Chickenwire Torus
let chickenWire = {
    components: {
        clickToPlayWrapper,
        'note': noteChicken,
        'dichord': dichordChicken,
        'trichord': trichordChicken
    },
    extends: tonnetzLike,
    mixins: [traceHandler],
    template: `
        <g>  
        ${tonnetzLike.subtemplateNote} 
        ${tonnetzLike.subtemplateDichord} 
        ${tonnetzLike.subtemplateTrichord}
        </g>
    `
}

var Tonnetz_tonnetzLike = true
