<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Realtime Chat Room</title>
    <link rel="stylesheet" href="{{ asset('/css/app.css') }}">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <style>
    
        .list-group
        {
            overflow-y: scroll;
            height: 300px;
        }    

    </style>
</head>
<body>
    
    <div class="container">
        <div class="row" id="app">
            <div class="offset-3 col-4 col-sm-8">
                <li class="list-group-item active">Chat Room <div class="badge badge-pill badge-danger">@{{ typing }}</div><span class="badge badge-success float-right">@{{ numberOfUsers }}</span></li>
                <ul class="list-group" v-chat-scroll>
                    <message v-for="value, index in chat.message" :time=chat.time[index] :key="value.index" :color=chat.color[index] :user=chat.user[index] :float=chat.float[index]>
                        @{{ value }}
                    </message>
                </ul>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Type Your Message ..." v-model="message" @keyup.enter="send">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" id="button-addon1" v-on:click="send"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('/js/app.js') }}"></script>
</body>
</html>