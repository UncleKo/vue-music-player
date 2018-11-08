
import Vue from 'vue';

window.Event = new Vue();

Vue.component('records', {

   template: `

   <div>

      <section v-for="self in records" class="tune">

         <transition name="player" tag="div">
   
            <player class='player' v-show="self.showPlayer">
            
               <h2>{{ self.title }}</h2>

               <audio :id="self.id" :src="self.src"></audio>
               <div class="controls">
                  <i class="far fa-play-circle" v-show="!(self.playing)" @click="play(self, $event)"></i>
                  <i class="far fa-pause-circle" v-show="self.playing" @click="pause(self, $event)"></i>
                  <i class="far fa-stop-circle" @click="stop(self, $event)"></i>
               </div>

               <div class="progress-wrap">
                     <div class="progress-bar"></div>
               </div>

             </player>
         
         </transition>

         <div class="tune-list">
            <i class="far fa-play-circle" v-show="!(self.playing)" @click="showPlayer(self, $event)"></i>
            <i class="far fa-pause-circle" v-show="self.playing" @click="pause(self, $event)"></i>
            <h2>{{ self.title }}</h2>
            <p>{{ self.description }}</p>
         </div> <!-- tune-list -->

      </section> <!-- tune -->

   </div>

   `,

   data() {

      return {

         records: [
            { 
               title: 'Tune1',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune1.wav',
               playing: '',
               showPlayer:'' 
            },
            { 
               title: 'Tune2',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune2.wav',
               playing: '',
               showPlayer:'' 
            },
            { 
               title: 'Tune3',
               description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
               src: './files/tune3.wav',
               playing: '',
               showPlayer:'' 
            }
         ]

      }

   },

   created() {

      this.records.forEach( self => {
         self.showPlayer = false;
         self.playing = false;
      });

      Event.$on('close', () => { 
         this.records.forEach( self => {
            self.showPlayer = false;
            self.playing = false;
         });
      });
   },

   methods: {

      audio(e) {
         // let audio = e.target.parentNode.querySelector('audio');
         let audio = e.target.closest('.tune').querySelector('audio');
         return audio;
      },

      showPlayer(self, e) {
         this.records.forEach( record => record.showPlayer = false );
         document.querySelectorAll('audio').forEach(aud => {
            aud.pause();
         });
         
         self.showPlayer = true;
         self.playing = true;

         let audio = this.audio(e);
         // audio.currentTime = 0;
         audio.play();
      },

      play(self, e) {
         let audio = this.audio(e);
         audio.play();
         self.playing = true;
      },

      pause(self, e) {
         let audio = this.audio(e);
         audio.pause();
         self.playing = false;
      },

      // rewind(self, e) {
      //    let audio = this.audio(e);
      //    audio.currentTime = 0;
      //    audio.play();
      // },

      stop(self, e) {
         let audio = this.audio(e);
         audio.pause();
         audio.currentTime = 0;
         self.playing = false;
      }
   }

});

Vue.component('player', {

   template: `
   
      <div :id=this.id>

             <div class="container">

                <slot></slot>

                <span class="close" @click="closePlayer">x</span>

            </div>

      </div>

   `,

   data() {
      return {
         id : ''
      }
   },

   mounted() {
      this.id = this._uid;
   },

   methods: {

      closePlayer(e) {
         Event.$emit('close');

         let audio = e.target.parentNode.querySelector('audio');
         audio.pause();
         audio.currentTime = 0;
      }

   }

});

new Vue({

   el: '#root'

});

document.querySelectorAll('.player').forEach(player => {

   let audio = player.querySelector('audio');

   audio.ontimeupdate = function(){
      player.querySelector('.progress-bar').style.width = audio.currentTime / audio.duration * 100 + '%';
   }

   // player.querySelector('.fa-play-circle').on('click', function() {
   //    audio.play();
   // })

   // player.querySelector('.fa-pause-circle').on('click', function() {
   //    audio.pause();
   // })

   // player.querySelector('.fa-fast-backward').on('click', function() {
   //    audio.currentTime = 0;
   //    audio.play();
   // })

   // player.querySelector('.fa-stop-circle').on('click', function() {
   //    audio.pause();
   //    audio.currentTime = 0;
   // })

})

// $$('.fa-play-circle').forEach(key => key.on('click', function() {
//    this.parentNode.querySelector('audio').play();
// }))

// $$('.fa-pause-circle').forEach(key => key.on('click', function() {
//    this.parentNode.querySelector('audio').pause();
// }))


