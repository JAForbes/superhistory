# superhistory

A tiny history API with nested contexts.

> This is being iterated on quite often, expect breaking changes for a while.

## Example

Check out this example on [flems](https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvEAXwvW10QICsEqdBk2J4IWAA60ATsQAEWCnOBzqcOErqT6IuRjiq5rOWGm0scgOQliEuIgD0D+FnxxCDgEYZqxDAAEABnwATnwARgAmSwAdNHEpWTkAKj0Db18MEzMLa2JbeycXNw8MvyDQiOi4hJl5AGUAVwkYaUIIOGIZAE9s8ysbO0dnOFd3Bzhm1vbOnorgwIBaNBgAD2IIgFZYtDihTrlPWmhWiSgMRjkAXlV1AAM4uTkSMiUjgBNupUJw78jvgDM3wALN9Nt8AGxKCTKR5PBQYaQAcwgaEQckCMCwAG44U8JBh3u9UUj0ZicXDWHCXlA3rRPnTPnIAHwpWFoeFyYlwM4YbropHSCDvXEc+FYVGLQgwCBIkjo8KBQIAN0IoqeVLFcIwiGVHQgjHe7M5dCgMnRjTQcBgxHVRjiD12aH28gA6qj3rQAO7XVQACj9yoAlNdWcA4S65GZGoxpL7lfgLsRpHB8NHY-hqO0oO8-SoJNIYJBVuiE0mU-gC0WIKsjEG4XDC8RGtIOYGQ1dWXiFH7LPgvR7vTtOU8lFhe5hlcOR6PbnBHTPOQAyY2Lznc3n8uSC4V2tdPI7Sd6tRZHfLmdFwWhQYVycISWsAYgAoq+9-uMDekWhFkJGAx0WoERWnfNdP1lH8DSxexVGA6RQMXAkiRJBUsQQmcd3eRYMBjWhFjAM0vUA69GiwNB0JHXhGk6CAwG6X96H-YhLwJIDTxtL0YCYCiNW7TkF0XMdex5DA0HwFsoEsCh01afAkRtP0g0rC5CHrMUZyEywRLE2gJGICB6DgKS5wEtcV3DdT9zARjFjgCAAC8YDJfAITQvjFwyABrQVaEtLDTXNORH0iEKePhJDiTQUkMXwTY3MstdD2PaRFmkQkIGo5zIjiikEpHTU1zuJQACl6gAeQAOTcZMSVo7o8yjGBeSA9EwE-a06zUmcQzkdylDLfIKyzaB3kLNAAH58AamS41YLr4R6yk4jUvZDPkABBCQYRuagAw7MMGzFSNJhaNoOi6aRehuJpTpmC76oszl6AAYUIUT5PRP1aH25RXELUaMC9RSCrrOI4RO6Zzp6OTaF7BxIEwZ0IHa5xiWIBxwksebGxtFs2x+7txz7DAtunTk6ROaReUYPqTPcp5zPp+EvJ8vyGLNaR0U8c5qE8sKAs5uQvXaRgwushh8OwaAt3WoVPzC2B8hPETqBQu8HzFmzONleU7yVCiQZnRm8vXDpNwFIURSZw2RxXVlUkeqybLsxz0UieK1xtp5TPhIT3TQT0vSZ8nlCjXzY0vKYztmS7epNwS5CrYt0UsMn91nYaczGz6VBmutQzj9O13Hf3A6UFRg6LmbK-T6FC2Tqx4dRUTVfayxC6LtdNGzUamBzsOY1afPOxrzue1L70lFHsfQ+r+OZ5DpOaxT1GDXb6ex+7kbs43mfpvDoe5oLomsAwVFM0YkQ04X-dNMaSTd5vuQKGQR+n6sTGlEsaIv4Ba-3-3AAXTfgvfAp8JB+hATfWsnY5DIFWJpG8xlLAAElGC5DkAAajkKsIMwD54AM5PNQh6cwEk0gQQkh8I-TIGFJoS+DBAH7SgU-ImGB-5UPTtgv0HdOELxmpWQseoYBA2FB2K4NwBHyWIIpfAYB75QAAAoqV4Xwhe40rCJl8BAZUMB16ULUTOFO+jDGd2IaYrudMDEWKXFo-SujVwWM7gLdEEgWxnBgGFJx9prFqJ9t4kOjsAmLkIPXdEAiqzCNEe8cxwTyb0GoDeXmfoYBBiCXEmcMBBEwF0QwAAIkWHCUAZGxIyfCKRsMxEsMIV7OJ7BVAMOIKUwxzTOGtMIe0p+tT36dM9r0+E3S5DmLUnNMGaBXBYF8gwP0npqCkREPgD4Xw5CbQkEGSgIBrSwG0YZPA4RwjAkQJsYEbAOAgEwDgPAmZ1AbL-CIFgrBAGsCAA)

## Quick Start

```bash
npm install superhistory@next
```

```typescript
import superhistory from 'superhistory'

const A = superhistory()

A.go('/a/b/c/d')

window.location.pathname
// '/a/b/c/d'

A.get()
// { path: 'a/b/c/d' }

A.go('/a/b/c/d/e')
A.go('/a/b/c/d/e/f', { replace: true })
A.get()
// { path: '/a/b/c/d/e/f', localPath: '/a/b/c/d/e/f' }
A.back()
A.get()
// { path: '/a/b/c/d', localPath: '/a/b/c/d' }


const B = A.get('/a/b')
const C = B.get('/c')

B.get()
// { localPath: '/c/d', path: '/a/b/c/d' }

C.get()
// { localPath: '/d', path: '/a/b/c/d' }

C.go('/g')
;[C.get(), B.get(), A.get()]
// [
//     { localPath: '/g', path: '/a/b/c/g' },
//     { localPath: '/c/g', path: '/a/b/c/g' } ,
//     { localPath: '/a/b/c/g', path: '/a/b/c/g' }
// ]

C.preview('/h')
// 'a/b/c/h'
C.get()
// { localPath: '/a/b/c/g', path: '/a/b/c/g' }
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

Creates a superhistory instance.  You can optionally pass in `onChange` to be notified any time a path is set, or `popstate` fires

The `_window` parameter there is available as an override for serverside usage or tests.  For example you could use JSDOM.

### `instance.get()`

```typescript
type State = {
    path: string | undefined,
	localPath: string | undefined
}

instance.get(): State
```

Returns the instance's `localPath` in its local context and the global `path`.  Returns `undefined` for both properties if a nested history is not compatible with the current browser location pathname.

### `instance.preview(path: string): string`

Shows what the browser location path will be were you call `instance.go(path)`.  

> Useful for generating `href`'s for anchor tags.

### `instance.go(...)`

```typescript
instance.go(path: string, options?: { replace: boolean })
```

A simple wrapper around `history.pushState` / `history.replaceState` that works with nested contexts.

### `instance.back()`

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

You can also optionally provide an onChange callback which will notify you when a route is set or on `onpopstate`.

Note there is no diffing for `onChange` callbacks, if any route instance updates all route instances get notified that the URL is being changed.

## Utilities

### `superhistory.joinPath`

```typescript
superhistory.joinPath(a: string, b: string): string
```

The function used internally to combine any two paths.

### `superhistory.normalizePath`


## Advanced

```typescript
superhistory.normalizePath(path:string): string
```

The function used internally to normalize the formatting of paths.

### Extracting variables out of paths

This library isn't a router, its just a small wrapper around the browser history API that you could build a pattern matching router on top of.

If you're looking for a pattern matching router engine: Check out [superouter](https://github.com/JAForbes/superouter)

### Path / Prefix normalization

While not strictly correct, *superhistory* removes trailing slashes as applications tend to treat `/a/b/c` and `/a/b/c/` as equivalent.  By normalizing paths in this way the internal logic becomes much simpler when gluing together prefixes on nested child nodes.

In addition to removing trailing slashes, *superhistory* also converts empty strings (`''`) into single slashes (`'/'`).  This behaviour ensures all paths and prefixes start with a slash which again simplifies concatenation.