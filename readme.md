# superhistory

A tiny history API with nested contexts.

## Quick Start

```bash
npm install superhistory
```

```typescript
import superhistory from 'superhistory'

const A = superhistory()

A.go('/a/b/c/d')

window.location.pathname
# '/a/b/c/d'

A.get()
// { path: 'a/b/c/d' }

A.go('/a/b/c/d/e')
A.go('/a/b/c/d/e/f', { replace: true })
A.get()
// { path: 'a/b/c/d/e/f' }
A.back()
A.get()
// { path: 'a/b/c/d' }


const B = A.get('/a/b')
const C = B.get('/c')

B.get()
// { path: '/c/d' }

C.get()
// { path: '/d' }

C.go('/g')
;[C.get(), B.get(), A.get()]
// [
//     { path: '/g' },
//     { path: '/c/g' } ,
//     { path: '/a/b/c/g' }
// ]
```

## API

### `superhistory(...)`

```typescript
superhistory(
    options?: { 
        _window?: Window, 
        onChange?: (state: superhistory.State) => void 
    }
): superhistory.Instance
```

### `instance.get()`

```typescript
type State = {
    path: string | undefined
}

instance.get(): State
```

Returns the route instance's path in its local context.  Returns `undefined` if a nested route is not compatible with the current browser location pathname.

### `instance.go(...)`

```typescript
instance.go(path: string, options?: { replace: boolean })
```

A simple wrapper around `history.pushState` / `history.replaceState` that works with nested contexts.

### `instance.back`

```typescript
instance.back(): void
```

A simple wrapper around `history.back()`


### `instance.end()`

```typescript
instance.end(): void
```

For the root node, this removes the listener for the `popstate` event and clears the list of children

Removes a child instance and any descendents from the list of child nodes used for notifying `onChange` callbacks.  This will allow it to be gc'd but will not prevent you from using a child node as a getter/setter if it is still in scope.

### `instance.prefix()`

```typescript
instance.prefix(): string
```

Returns the complete normalized prefix of the child instance (including all parent prefixes).  For the sake of polymorphism, the root node returns `'/'` despite not having a prefix.

### `instance.child(...)`

```typescript
instance.child(options: { prefix: string, onChange?: (state: State) => void })
```

Create a nested route context.  All route operations will receive/return a local pathname that does not include the `prefix` that you supply.

These operations are applied directly to the history API by the child instance using the concatenated prefixes of all of its parents.

## Advanced

### Path / Prefix normalization

While not strictly correct, *superhistory* removes trailing slashes as applications tend to treat `/a/b/c` and `/a/b/c/` as equivalent.  By normalizing paths in this way the internal logic becomes much simpler when gluing together prefixes on nested child nodes.

In addition to removing trailing slashes, *superhistory* also converts empty strings (`''`) into single slashes (`'/'`).  This behaviour ensures all paths and prefixes start with a slash which again simplifies concatenation.