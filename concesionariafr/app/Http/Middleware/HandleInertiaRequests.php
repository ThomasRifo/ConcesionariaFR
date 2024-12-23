<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $empleados = User::role('empleado')->get()->map(function ($empleado) {
            return [
                'id' => $empleado->id,
                'name' => $empleado->nombre,
                'lastname' => $empleado->apellido,
            ];
        });

        return [


            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $request->user()->load('roles') : null,
                'unreadNotificationsCount' => Auth::check() 
                    ? Auth::user()->unreadNotifications->count() 
                    : 0,
                    'unreadNotifications' => Auth::check()
                    ? Auth::user()->unreadNotifications
                    : collect(), // Retorna una colección vacía si no hay usuario
            ],
            'empleados' => $empleados,
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
