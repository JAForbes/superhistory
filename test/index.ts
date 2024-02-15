import superhistory from '../lib/index.js'
import test from 'node:test'
import assert from 'node:assert'
import jsdom from 'jsdom'

function setup(){
    const {window}  = new jsdom.JSDOM(`<html><body></body></html>`, {
        url: 'https://example.com'
    });
    
    const A = superhistory({ _window: window as any })

    return { superhistory: A, window: window as any as Window }
}

test('Basics', () => {
    const { superhistory: A, window } = setup()

    A.go('/a/b/c/d/e/f/g', { replace: true })
    const a = A.get()
    A.go('/a/b/c/d/e/f/g/', { replace: true })
    const b = A.get()

    assert.deepEqual(a, { path: '/a/b/c/d/e/f/g' })
    assert.deepEqual(a, b, 'path normalization')

    const B1 = A.child({ prefix: '/a/b' })
    const B2 = A.child({ prefix: '/a/b/'})

    assert.deepEqual(B1.get(), { path: '/c/d/e/f/g' })
    assert.deepEqual(B1.get(), B2.get())

    A.go('/a/c/d')
    assert.strictEqual(
        B1.get().path
        , undefined
        , `If child path isn't applicable, it has an undefined path`
    )

    assert.deepEqual(A.get(), { path: '/a/c/d' })
    B1.go('/d')
    assert.deepEqual(A.get(), { path: '/a/b/d' }, 'Writing to subroute reactivated its original prefix')

    assert.deepEqual(B1.get(), { path: '/d'}, 'And path is no longer undefined')
    assert.deepEqual(B1.get(), B2.get(), 'B1 and B2 are in sync')

    B2.go('/c')
    
    const C1 = B1.child({ prefix: '/c' })
    const C2 = B2.child({ prefix: '/c' })

    assert.deepEqual(C1.get(), { path: '/' })
})

test('Child with empty prefix', () => {
    
  const {superhistory} = setup()

  superhistory.go('/financials/edit/1')
  const A = superhistory.child({ prefix: ''})
  
  assert.equal('/financials/edit/1', A.get().path)
})