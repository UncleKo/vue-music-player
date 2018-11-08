
import Vue from 'vue';

window.Event = new Vue();

Vue.component('records', {

   template: `

   <div>

      <section v-for="self in records" class="tune">

         <transition name="player" tag="div">
   
            <player class='player' :class="self.showPlayer ? 'active' : ''" v-show="self.showPlayer">
            
               <h2>{{ self.title }}</h2>

               <audio :id="self.id" :src="self.src" @play="self.playing=true" @pause="self.playing=false"></audio>
               <div class="controls">
                  <i data-skip="-3" class="fas fa-fast-backward"></i>
                  <i class="fas fa-stop" @click="stop(self, $event)"></i>
                  <i class="fas pp" :class=" self.playing ? 'fa-pause' : 'fa-play' " @click="togglePlay(self, $event)"></i>
                  <i data-skip="2" class="fas fa-fast-forward"></i>
               </div>


             </player>
         
         </transition>

         <div class="tune-list" :class="self.showPlayer ? 'active' : ''">
            <i class="far pp" :class=" self.playing ? 'fa-pause-circle' : 'fa-play-circle' " @click="togglePlay(self, $event)"></i>
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

      this.reset();

      Event.$on('close', this.reset );

      window.addEventListener('keydown', function(e) {
         if (e.keyCode === 32) {
            let activePlayer = document.querySelector('.player.active');
            if(!activePlayer) return;
            let activeAudio = activePlayer.querySelector('audio');

            activeAudio.paused ?  activeAudio.play() : activeAudio.pause();
            
         }
      });
      
   },

   methods: {

      reset() {
         this.records.forEach( self => {
            self.showPlayer = false;
         });
      },

      audio(e) {
         let audio = e.target.closest('.tune').querySelector('audio');
         return audio;
      },

      togglePlay(self, e) {

         let audio = this.audio(e);

         if(audio.paused) {

            if(!self.showPlayer) {
               Array.from(document.querySelectorAll('audio'))
                  .filter((anotherAudio) => anotherAudio !== audio)
                  .forEach( anotherAudio => {
                     anotherAudio.pause();
                     anotherAudio.currentTime = 0;
                  });
               this.reset();
               self.showPlayer = true;
            }

            audio.play();

         } else {
            audio.pause();
         }
      },

      stop(self, e) {
         let audio = this.audio(e);
         audio.pause();
         audio.currentTime = 0;
         self.playing = false;
      },
      
   }

});

Vue.component('player', {

   template: `
   
      <div :id=this.id>

             <div class="container">

                <slot></slot>

               <div class="progress-wrap">
                     <div class="progress-bar"></div>
               </div>
   
               <div class="volume">
                   <i class="fas fa-volume-up"></i>
                   <input type="range" name="volume" min="0" max="1" step="0.05" value="1" autocomplete="off">
               </div>

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

   let progress = player.querySelector('.progress-wrap');
   let audio = player.querySelector('audio');
   let ranges = player.querySelectorAll('input[type="range"]');
   let skipButtons = player.querySelectorAll('[data-skip]');
   

   audio.ontimeupdate = function(){
      player.querySelector('.progress-bar').style.width = audio.currentTime / audio.duration * 100 + '%';
   }
   
   progress.addEventListener('click', function(e) {
      audio.currentTime = (e.offsetX / progress.offsetWidth ) * audio.duration;
   });

   function handleRangeUpdate() {
      audio[this.name] = this.value;
   }

   ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
   ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

   function skip() {
      audio.currentTime += parseFloat(this.dataset.skip);
   }

   skipButtons.forEach(button => button.addEventListener('click', skip));

})


