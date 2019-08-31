<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Events\Illuminate\Auth\Events\ChatEvent;
use App\Message;

class ChatController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat()
    {
        return view('chat');
    }

    public function getMessages()
    {
        $messages = Message::with('user')->get();
        $user = User::findOrFail(Auth::id());

        $data = 
        [
            'user'      => $user,
            'messages'  => $messages
        ];

        return $data;
    }

    public function send(Request $request)
    {
        $user = User::find(Auth::id());

        $message = $user->messages()->create(
        [
            'message'   => $request->message
        ]);

        event(new ChatEvent($message->message, $user));
        return $request->all();
    }

    // public function send(Request $request)
    // {
    //     $message = 'Hello';
    //     $user = User::find(Auth::id());
    //     event(new ChatEvent($message, $user));
    // }
}
