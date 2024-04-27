export type _Window = {
	location: _Location,
	history: _History,
	addEventListener(type: 'popstate', listener: () => void): void
	removeEventListener(type: 'popstate', listener: () => void): void
}
export type _Location = {
	pathname: string
}
export type _History = {
	replaceState(data: any, title: string, url: string): void
	pushState(data: any, title: string, url: string): void
	back(): void
}

export type State = { path?: string, localPath?: string }

export type OnChange = (state: State) => void

type Child = {
	end(): void
	onChange?: OnChange
	get(): State
}

interface InternalInstance {
	back(): void
	go(path: string, options?: { replace: boolean }): void
	preview(path: string): string
	onChange: OnChange
	observe(update: (x: State) => void): () => void
	get(): State
	end(): void
	prefix: () => string
	child(options: { prefix: string; onChange?: OnChange }): InternalInstance
}

interface Attrs {
	_window?: _Window
	onChange?: (s: State) => any
}

interface ChildAttrs {
	_window: _Window
	prefix: string
	onChange: OnChange
	children: Set<Child>
	reportChanges(): void
}

export function normalizePath(str: string): string {
	if (str == '' || str == '/') {
		return '/'
	}
	if (str.at(-1) == '/') {
		str = str.slice(0, -1)
	}
	if ( str[0] != '/' ) {
		str = '/' + str
	}
	return str
}

export function joinPath(a:string,b: string): string {
	a = normalizePath(a)
	b = normalizePath(b)

	if (a === '/' ) {
		return b
	} else if (b === '/') {
		return a
	} else {
		return a + b
	}
}

function Superhistory({
	_window= globalThis.window as any as _Window,
	onChange = () => {},
}: Attrs = {}): InternalInstance {
	const children = new Set<Child>()

	const reportChanges = () => {
		onChange({
			path: _window.location.pathname,
		})
		for (let child of children) {
			child?.onChange?.(child.get())
		}
	}
	const onpopstate = () => {
		reportChanges()
	}

	_window.addEventListener('popstate', onpopstate)

	function go(path: string, options: { replace?: boolean } = {}) {
		path = normalizePath(path)

		_window.history[options.replace ? 'replaceState' : 'pushState'](
			null,
			'',
			path,
		)
		reportChanges()
	}

	function preview(path: string): string {
		return path
	}

	function back() {
		_window.history.back()
	}

	function end() {
		_window.removeEventListener('popstate', onpopstate)
	}

	function get() {
		const path = normalizePath(_window.location.pathname)
		return { 
			path,
			localPath: path
		}
	}

	function prefix() {
		return '/'
	}

	function child({
		prefix = '',
		onChange,
	}: {
		prefix: string
		onChange: OnChange
	}) {
		const child = SuperhistoryChild({
			_window,
			prefix,
			onChange,
			children,
			reportChanges,
		})
		children.add(child)
		return child
	}

	function observe( update: (x: State) => void ): () => void {

		let self: Child = {
			end: () => {
				children.delete(self)
			},
			get: () => get(),
			onChange: update
		}

		update(get())
		
		children.add(self)

		return () => self.end()
	}

	return { go, end, back, get, preview, prefix, child, onChange, observe }
}

function SuperhistoryChild({
	_window,
	prefix: _prefix,
	onChange,
	children: parentChildren,
	reportChanges,
}: ChildAttrs): InternalInstance {
	_prefix = normalizePath(_prefix)

	const children = new Set<Child>()
	function back() {
		_window.history.back()
	}

	function end() {
		// delete from the root list
		parentChildren.delete(self)

		// loop through our list to let other child delete
		// from the root list
		// our list will gc on its own when it is de-referenced
		for( let child of children ) {
			child.end()
		}
	}

	function go(path: string, options: { replace?: boolean } = {}) {
		path = normalizePath(path)
		_window.history[`${options.replace ? 'replace' : 'push'}State`](
			null,
			'',
			joinPath(_prefix, path)
		)
		reportChanges()
	}

	function preview(path: string, _: { replace?: boolean } = {}) {
		path = normalizePath(path)
		return joinPath(_prefix, path)
	}

	function get() {
		const rootPath = _window.location.pathname
		const i = rootPath.indexOf(_prefix)
		const child = i == -1 ? undefined : rootPath.slice(i+_prefix.length)
		return { 
			localPath: child != null ? normalizePath(child) : child,
			path: child != null ? joinPath(_prefix, child) : child
		}
	}

	function prefix() {
		return _prefix
	}

	function child({
		prefix = '',
		onChange,
	}: {
		prefix: string
		onChange: OnChange
	}) {
		const child = SuperhistoryChild({
			_window,
			prefix: joinPath(_prefix, prefix),
			onChange,
			children: parentChildren,
			reportChanges,
		})
		parentChildren.add(child)
		return child
	}

	
	function observe( update: (x: State) => void ): () => void {

		let self: Child = {
			end: () => {
				children.delete(self)
			},
			get: () => get(),
			onChange: update
		}
		
		children.add(self)

		return () => self.end()
	}

	const self = { go, end, back, get, prefix, child, onChange, preview, observe }
	return self
}

export default Superhistory
