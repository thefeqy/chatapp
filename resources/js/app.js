
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import Vue from 'vue'

import Toaster from 'v-toaster'

import moment from 'moment'
 
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-toaster/dist/v-toaster.css'
 
// optional set default imeout, the default is 10000 (10 seconds).
import VueChatScroll from 'vue-chat-scroll'

Vue.use(Toaster, {timeout: 5000})
Vue.use(VueChatScroll)
Vue.use(require('vue-moment'));

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('message', require('./components/message.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data:
    {
        message : '',
        chat:
        {
            message: [],
            user: [],
            color: [],
            time: [],
            float: []
        },
        typing: '',
        numberOfUsers: 0
    },
    watch:
    {
        message()
        {
            Echo.private('chat')
            .whisper('typing', {
                message: this.message
            });
        }
    },
    methods:
    {
        getMessages()
        {
            axios.post('/get_messages').then(response =>
            {
                // console.log(response.data.messages);
                for(var i = 0; i < response.data.messages.length; i++)
                {
                    console.log(response.data.messages[i]);
                    this.chat.message.push(response.data.messages[i].message);
                    if(response.data.user.id == response.data.messages[i].user_id)
                    {
                        this.chat.user.push('You');
                        this.chat.color.push('success');
                        this.chat.float.push('float-left');
                    }
                    else
                    {
                        this.chat.user.push(response.data.messages[i].user.name);
                        this.chat.color.push('warning');
                        this.chat.float.push('float-right');
                    }
                    this.chat.time.push(moment(String(response.data.messages[i].created_at)).format('hh:mm'));
                }
            });
        },
        send()
        {
            if(this.message.length > 0)
            {
                axios.post('/send', 
                {
                    message: this.message
                })
                .then(response => 
                {
                    console.log(this.response); 
                    this.chat.message.push(this.message);
                    this.chat.user.push('You');
                    this.chat.color.push('success');
                    this.chat.time.push(this.getTime());
                    this.chat.float.push('float-left');
                    this.message = '';
                })
                .catch(error => 
                {
                    console.log(error)
                });
            }
        },
        getTime()
        {
            let time = new Date();
            return time.getHours() + ':' + time.getMinutes();
        }
    },
    mounted()
    {
        this.getMessages();

        window.Echo.private('chat')
            .listen('\\App\\Events\\Illuminate\\Auth\\Events\\ChatEvent', (e) => 
            {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user);
                this.chat.time.push(this.getTime());
                this.chat.color.push('warning');
                this.chat.float.push('float-right');
                console.log(e);
            })
            .listenForWhisper('typing', (e) =>
            {
                if(e.message != '')
                {
                    this.typing = 'Typing ...'   
                }
                else
                {
                    this.typing = ''
                }
            });

        Echo.join(`chat`)
            .here((users) => 
            {
                this.numberOfUsers = users.length
            })
            .joining((user) => 
            {
                this.numberOfUsers += 1;
                this.$toaster.success(user.name+' Joined The Chat Room ');
            })
            .leaving((user) => 
            {
                this.numberOfUsers -= 1;
                this.$toaster.warning(user.name+' Leaved The Chat Room ');
            });
    }
});
