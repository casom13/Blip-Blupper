var TinyMusic = require('../../node_modules/tinymusic/dist/TinyMusic.min');

module.exports = {
    //'TinyMusic': require('../../node_modules/tinymusic/dist/TinyMusic.min'),

    init: function(song) {
        // create the audio context
        this.ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;
        // get the current Web Audio timestamp (this is when playback should begin)
        this.when = this.ac.currentTime;
        // set the tempo
        this.tempo = 132;

        if(song == 'start'){
            this.lead = [
                '- w', '- w', '- w', '- w', '- w'
            ];
            this.harmony = [
                '- s', '- s', '- s', '- s', '- s'
            ];
            this.bass = [
                'C2 w', 'C3 w', 'C4 w', 'C2 w', 'C3 w'
            ];
        }
        else if(song == 'main') {
            // create an array of "note strings" that can be passed to a sequence
            this.harmony = [
                'E5 w', 'G5 w', 'C6 w', 'E6 w', 'E5 w', 'G5 w', 'C6 w', 'G6 w', 'Eb5 w', 'Ab5 w', 'C6 w', 'F6 w', 'E5 w', 'A5 w', 'D6 w', 'F6 w', 'E5 w', 'G5 w', 'C6 w', 'E6 w', 'E5 w', 'G5 w', 'C6 w', 'G6 w', 'Eb5 w', 'Ab5 w', 'C6 w', 'F6 w', 'Ab6 w', 'E5 w', 'A5 w', 'D6 w', 'A6 w', 'Bb6 w', 'E5 w', 'G5 w', 'C6 w', 'E6 w', 'C7 w', 'E5 w', 'G5 w', 'C6 w', 'E6 w', 'G6 w', 'Eb5 w', 'Ab5 w', 'C6 w', 'F6 w', 'E5 w', 'A5 w', 'D6 w', 'F6 w', 'E5 w', 'G5 w', 'C6 w', 'E6 w', 'E5 w', 'G5 w', 'C6 w', 'G6 w', 'Eb5 w', 'Ab5 w', 'C6 w', 'F6 w', 'Ab6 w', 'E5 w', 'A5 w', 'D6 w', 'A6 w', 'Bb6 w', 'C6 w', 'G6 w', 'C7 w'
            ];
            this.lead = [
                'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'C5 s', 'D5 s', 'E5 s', 'G5 s', 'C6 s', 'G5 s', 'E5 s', 'D5 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'Ab4 s', 'Bb4 s', 'C5 s', 'Eb5 s', 'Ab5 s', 'E5 s', 'C5 s', 'B4 s', 'A4 s', 'B4 s', 'C5 s', 'E5 s', 'A5 s', 'E5 s', 'C5 s', 'B4 s', 'C5 w', 'C6 w', 'C7 w'
            ];
            this.bass = [
                'C2 w', 'C3 w', 'C4 w', 'C2 w', 'C3 w', 'C4 w', 'Ab1 w', 'Ab2 w', 'C4 w', 'Ab3 h', 'Bb3 h', 'A1 w', 'A2 w', 'C4 w', 'C2 w', 'C3 w', 'C4 w', 'G4 h', 'E4 h', 'C2 w', 'C3 w', 'C4 w', 'Ab1 w', 'Ab2 w', 'C4 w', 'F4 w', 'D4 w', 'A1 w', 'A2 w', 'C4 w', 'F4 w', 'C2 w', 'C3 w', 'C4 w', 'E4 w', 'C2 w', 'C3 w', 'C4 w', 'G4 w', 'Ab1 w', 'Ab2 w', 'C4 w', 'Ab3 h', 'Bb3 h', 'A1 w', 'A2 w', 'C4 w', 'C2 w', 'C3 w', 'C4 w', 'G4 h', 'E4 h', 'C2 w', 'C3 w', 'C4 w', 'Ab1 w', 'Ab2 w', 'C4 w', 'F4 w', 'D4 w', 'A1 w', 'A2 w', 'C4 w', 'F4 w', 'C2 w', 'C3 w', 'G3 w', 'C4 w'
            ];
        }

        // create 3 new sequences (one for lead, one for harmony, one for bass)
        this.sequence1 = new TinyMusic.Sequence(this.ac, this.tempo, this.lead);
        this.sequence2 = new TinyMusic.Sequence(this.ac, this.tempo, this.harmony);
        this.sequence3 = new TinyMusic.Sequence(this.ac, this.tempo, this.bass);

        // set staccato and smoothing values for maximum coolness
        this.sequence1.staccato = 0.55;
        this.sequence2.staccato = 0.55;
        this.sequence3.staccato = 0.05;
        this.sequence3.smoothing = 0.4;

        // adjust the levels so the bass and harmony aren't too loud
        this.sequence1.gain.gain.value = 1.0 / 2;
        this.sequence2.gain.gain.value = 0.8 / 2;
        this.sequence3.gain.gain.value = 0.65 / 2;

        // apply EQ settings
        this.sequence1.mid.frequency.value = 800;
        this.sequence1.mid.gain.value = 3;

        this.sequence2.mid.frequency.value = 1200;

        this.sequence3.mid.gain.value = 3;
        this.sequence3.bass.gain.value = 6;
        this.sequence3.bass.frequency.value = 80;
        this.sequence3.mid.gain.value = -6;
        this.sequence3.mid.frequency.value = 500;
        this.sequence3.treble.gain.value = -2;
        this.sequence3.treble.frequency.value = 1400;

    },

    // play
    play: function(song) {
        this.init(song);
        this.when = this.ac.currentTime;
        //start the lead part immediately
        this.sequence1.play( this.when );
        // delay the harmony by 16 beats
        this.sequence2.play( this.when + ( 60 / this.tempo ) * 16 );
        // start the bass part immediately
        this.sequence3.play( this.when );
    },

    // pause
    pause: function() {
        this.sequence1.stop();
        this.sequence2.stop();
        this.sequence3.stop();
    }

};

