export type Window = typeof window
export type Location = typeof window.location
export type History = typeof window.history

export type State = { path?: string, fullPath?: string }

export type OnChange = (state: State) => void

interface InternalInstance {
	back(): void
	go(path: string, options?: { replace: boolean }): void
	preview(path: string): string
	onChange: OnChange
	get(): State
	end(): void
	prefix: () => string
	child(options: { prefix: string; onChange?: OnChange }): InternalInstance
}

interface Attrs {
	_window?: Window
	onChange?: (s: State) => any
}

interface ChildAttrs {
	_window: Window
	prefix: string
	onChange: OnChange
	children: Set<InternalInstance>
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
	_window = globalThis.window,
	onChange = () => {},
}: Attrs = {}): InternalInstance {
	const children = new Set<InternalInstance>()

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
		_window.history[`${options.replace ? 'replace' : 'push'}State`](
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
			fullPath: path
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

	return { go, end, back, get, preview, prefix, child, onChange }
}

function SuperhistoryChild({
	_window,
	prefix: _prefix,
	onChange,
	children: parentChildren,
	reportChanges,
}: ChildAttrs): InternalInstance {
	_prefix = normalizePath(_prefix)

	const children = new Set<InternalInstance>()
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

	function preview(path: string, options: { replace?: boolean } = {}) {
		path = normalizePath(path)
		return joinPath(_prefix, path)
	}

	function get() {
		const rootPath = _window.location.pathname
		const i = rootPath.indexOf(_prefix)
		const child = i == -1 ? undefined : rootPath.slice(i+_prefix.length)
		return { 
			path: child != null ? normalizePath(child) : child,
			fullPath: child != null ? joinPath(_prefix, child) : child
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

	const self = { go, end, back, get, prefix, child, onChange, preview }
	return self
}

export default Superhistory
