;(function(){
	const m = (typeof global !== 'undefined')
		? (global.m || require('mithril'))
		: window.m

	// leading zeroes
	const a0 = n => n < 10 ? `0${n}` : n

	const displayHours = (hours, tfh) =>
		tfh
			? a0(hours)
			: hours > 12
			? a0(hours - 12)
			: hours === 0
				? 12
				: a0(hours)

	const displayMinutes = minutes => minutes < 10 ? a0(minutes) : minutes

	const meridian = (hours) => hours < 12 ? 'AM' : 'PM'

	const numbers = (w, tfh, increment) => {
		let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		if (tfh && w == 'h') arr = arr.concat(arr.map(n => n + 12))
		return w == 'h'
			? arr
			: w == 'r'
				? ['AM', 'PM']
				: increment == 5
					? arr.map(n => n * 5)
					: [0, 15, 30, 45]
	}

	const wrapperClass = (editing, tfh, increment) => {
		if (!editing) return ''
		const classList = []
		classList.push(editing)
		if (tfh) classList.push('tfh')
		if (increment) classList.push(`i${increment}`)
		return classList.join(' ')
	}

	const boxClass = (w, tfh, timeVal, n) =>
		(w == 'r' && ((timeVal > 11 && n == 'PM') || (timeVal < 12 && n == 'AM'))) || 
		(timeVal === n && (w == 'm' || ( tfh && w == 'h' ) || (!tfh && timeVal < 12)) || (!tfh && timeVal > 11 && n === timeVal - 12))
			? 'current'
			: ''

	const Display = {
		view: ({attrs}) =>
			m('.display',
				{ onclick: e => { attrs.show(e.target.id) } },
				m('.display-num#h',
					{ class: attrs.editing == 'h' ? 'current' : '' },
					displayHours(attrs.time.h, attrs.tfh)
				),
				':',
				m('.display-num#m',
					{ class: attrs.editing == 'm' ? 'current' : '' },
					displayMinutes(attrs.time.m)
				),
				!attrs.tfh && m('.display-num#r',
				{ class: attrs.editing == 'r' ? 'current' : '' },
				meridian(attrs.time.h, attrs.tfh)
				)
			)
	}

	const Box = {
		view: ({attrs, children}) =>
			m('.box',
				{
					class: boxClass(attrs.type, attrs.tfh, attrs.time, attrs.n),
					onclick: attrs.boxClick
				},
				children
			)
	}

	const hourClick = (time, tfh, n) => (e) => {
		e.next = 'm'
		time.h = tfh
			? n
			: time.h < 12
				? n
				: n + 12
	}

	const minuteClick = (time, n) => (e) => {
		e.next = 'r'
		time.m = n
	}

	const meridianClick = (time, n) => (e) => {
		e.next = null
		if (time.h < 12 && n == 'PM') time.h += 12
		if (time.h > 11 && n == 'AM') time.h -= 12
	}

	const Editor = {
		view: ({attrs}) =>
			m('.wrapper',
				{ class: wrapperClass(attrs.editing, attrs.tfh, attrs.increment) },
				m('.sled',
					m('.editor', numbers('h', attrs.tfh).map(n => m(Box,
						{
							type: 'h',
							tfh: attrs.tfh,
							time: attrs.time.h,
							n: n,
							boxClick: hourClick(attrs.time, attrs.tfh, n)
						},
						displayHours(n, attrs.tfh)
					))),
					m('.editor', numbers('m', attrs.tfh, attrs.increment).map(n => m(Box,
						{
							type: 'm',
							tfh: attrs.tfh,
							time: attrs.time.m,
							n: n,
							boxClick: minuteClick(attrs.time, n)
						},
						displayMinutes(n)
					))),
					!attrs.tfh && m('.editor', numbers('r').map(n => m(Box,
					{ type: 'r', time: attrs.time.h, n: n, boxClick: meridianClick(attrs.time, n) },
					displayMinutes(n)
					))),
				)
			)
	}


	const TimePicker = vnode => {
		let editing

		// Is Non-Negative Integer
		const nn = n => n === (n >>> 0)

		// valid time is e.g. { h: 23, m: 59 }
		const isValid = t => (t && nn(t.h) && nn(t.m) && t.h < 24 && t.m < 60)

		// set editor view
		const setEditor = w => {
			if (editing == w) closeEditor(vnode.attrs.onchange)
			else editing = w
		}

		const closeEditor = (onchange, time) => {
			editing = null
			if (onchange) onchange(time)
		}

		// e.g. choosing an hour automatically advances to the minute chooser
		const advanceViews = tfh => e => {
			const next = e.next
			if (next == 'm' || (!tfh && e.next == 'r')) setEditor(next)
			if ((tfh && next == 'r') || next === null) closeEditor(vnode.attrs.onchange, vnode.attrs.time)
		}

		// if attrs.time is the wrong shape
		const nothingToSomething = (time) => {
			Object.assign(time, { h: 0, m: 0 })
			setTimeout(() => { editing = 'h'; m.redraw() }, 100)
		}

		return {
			view: ({attrs}) => {
				const increment = ( attrs.increment == 5 || attrs.increment == 15 ) ? attrs.increment : 5
				return m('.ciu-mithril-timepicker',
					{
						class: editing ? 'editing' : '',
						onclick: advanceViews(attrs.tfh)
					},
					[
						editing && m('.overlay', { onclick: closeEditor.bind(null, attrs.onchange, attrs.time) }),
						isValid(attrs.time)
							? m(Display, {
								time: attrs.time,
								tfh: attrs.tfh,
								show: setEditor,
								editing: editing
							})
							: m('.display', { onclick: nothingToSomething.bind(null, attrs.time) }, m('.clock')),
						m(Editor, {
							time: attrs.time,
							editing: editing,
							tfh: attrs.tfh,
							increment: increment
						})
					]
				)
			}
		}
	}
	
	TimePicker.reset = time => () => {
		delete time.h
		delete time.m
	}

	try { module.exports = TimePicker}
	catch(e) { window.TimePicker = TimePicker }
})()
