# superhistory

A tiny history API with nested contexts.

## Example

Check out this example on [flems](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4IWAA60ATsQAEWCnOBzqcOErqT6IuRjiq5rOWGm0scgOQliEuIgD0D+FnxxCDgEYZqxDAAEABnwATnwARgAmSwAdNHEpWTkAKj0Db18MEzMLa2JbeycXNw8MvyDQiOi4hJl5AGUAVwkYaUIIOGIZAE9s8ysbO0dnOFd3Bzhm1vbOnv80GAAPYli0OKFOuU9aaFaJKAxGOQBeVXUAAzi5ORIyJW2AE26lQnCXyJeAZheAFheAVheADYlBJlFdrgoMNIAOYQNCIOSBGBYADcEOuEgwDwe8JhiORaIhrAhtyg91oTwpTzkAD4UuC0JC5Li4PsMN1ETDpBAHuimZCsPCALSEGAQGEkRHhQKBABuhH51xJaEuazQG3kAHV4Q9aAB3E6qAAUxrlAEoTvTgBDNXIzI1GNIjXL8IdiNI4PgHU78NR2lAHsaVBJpDBIItEa73Z78KHwxBFkZzRCIWHiI1pEyzZbjvSMQpjZZ8PrdQbVszrkosEXMHKK5Wq2c4GrG8yAGSMtuV1nszlybm8pXdyHbaQPVrC7b5cyIuC0KC8uThCRJgDEAFEt8OR3pFzC0MKhIwGIjqCJWjuRxh94eIIwsPZVBfpFfu1icXjpSi323Bw9hQwR1aGFMAoANM8F0aLA0F-RteEaToIDAboj3oE9iDnLFzynGBiH1GAmDgyEVW7Vs22rIs2QwNB8EzKBLAoH1WnwGE8ONc040OQgUwFRtKMsajaNoCRiAgeg4EY5tyO7TsbT4kcwHQ4U4AgAAvGACXwIEfwLbsMgAa25WhGjQAC6HA6RETXSJbOI5kP1xNB8SRfB-l0hT9JkCdpGFaRsQgRCtMidyiU8ytSLbc4lAAKXqAB5AA5NwPTxZDumDe0YHZc9ETAG84BgZNeMbS05D0uQlGjfJY39aAHjDNAAH58Ey5jnVYErITK4k4l49YJPkABBCQwVOahTVza1UwFO1JhaNoOi6aRelOJoFpmZaMvk5l6AAYUIGi2MRY1aCm5RXDDBqMH1DjIs6uIIXm6Ylp6VjaCLBxIEwDUIAK5xcWIBxwksLq0zwzNs3Ogsa2LDBRobZkKV2aR2UYCrNAuCrrjk7HRx8IyHTMtDLMRTwDmoAz7NUBcZERfV2kYamlIYUDsGgfshp5G9qdgfJJ2o6gv2XVdmeUgiJSlZdZWIyLG1x8LmV7A5+3-an-2FB80ZgPyDSfT4UWXUxZbxzt6VSHbFOU1SNMRSIPO7OXIRkyFKJ1MyDTxpsVHaucpkW2YVvKxXK1BMMI0RSxEZHTQAwapgTp9kynWTK1g93Rsa3dvV9SUFQvZHdqC+7MOE0jKwvvhGihYKyx04z-jVDjxrE-tZPWlTvNi4zrOy1z+uG93JPHVabuG9LiOK5gQG67HjOncHysusXh6Q+ZBe5GXze4lXuJXCwEyGGNPVqGgkR8EeZ45BGiRzUoEBCtgXxxLQBAeH+H5EEiNgOBATAcDwH6dQ99jwiBYKwAAuqwIAA)

## Quick Start

```bash
npm install superhistory@next
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

Returns the instance's path in its local context.  Returns `undefined` if a nested history is not compatible with the current browser location pathname.

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

Create a nested istory context.  All history operations will receive/return a local pathname that does not include the `prefix` that you supply.

These operations are applied directly to the history API by the child instance using the concatenated prefixes of all of its parents.

## Advanced

### Extracting variables out of paths

This library isn't a router, its just a small wrapper around the browser history API that you could build a pattern matching router on top of.

If you're looking for a pattern matching router engine: Check out [superouter](https://github.com/JAForbes/superouter)

### Path / Prefix normalization

While not strictly correct, *superhistory* removes trailing slashes as applications tend to treat `/a/b/c` and `/a/b/c/` as equivalent.  By normalizing paths in this way the internal logic becomes much simpler when gluing together prefixes on nested child nodes.

In addition to removing trailing slashes, *superhistory* also converts empty strings (`''`) into single slashes (`'/'`).  This behaviour ensures all paths and prefixes start with a slash which again simplifies concatenation.