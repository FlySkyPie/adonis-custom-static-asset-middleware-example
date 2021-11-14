 

# Adonisjs - Custom Static Asset Middleware Example

[ServeStatic](https://github.com/adonisjs/core/blob/8486ca737e67db26058b22eb6d6b15f5004ff475/src/Hooks/Static/index.ts) already integrated to the part of core ([AppProvider](https://github.com/adonisjs/core/blob/ff13e09d1210d6e3a5431fcb241bcac7bd3aff41/providers/AppProvider.ts#L124))  in current version of AdonisJs (5.0).

So there not way to put a middleware (e.g. auth) before the request achieved assets. This is a example to service assets as middleware, so taht you can do something with the request want access assets.